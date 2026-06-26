import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Offering, LocalOfferingState, Mood } from "../domain/types";
import { createOffering } from "../domain/offering";
import {
  witnessOffering,
  lightCandle,
  releaseOfferingLocally,
  reportOffering,
} from "../domain/localViewerState";
import { getVisibleOfferings } from "../domain/expiration";
import { fetchOfferings } from "../storage/offeringRepository";
import { loadViewerState, saveViewerState, clearViewerState } from "../storage/viewerStateRepository";
import { postOffering, postAction } from "../api/client";
import OfferingPreview from "../components/OfferingPreview";
import OfferingDetail from "../components/OfferingDetail";
import ReleaseOfferingModal from "../components/ReleaseOfferingModal";
import Modal from "../components/Modal";
import Button from "../components/Button";

function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const handler = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);
  return matches;
}

export default function ChapelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [localState, setLocalState] = useState<LocalOfferingState>(() => loadViewerState());
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [, setTick] = useState(0);
  const feedbackTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (searchParams.get("release") === "true") {
      setShowReleaseModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchOfferings()
      .then((data) => {
        setOfferings(data);
        setLoading(false);
      })
      .catch(() => {
        showFeedback("Failed to load offerings.");
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    try {
      saveViewerState(localState);
    } catch {
      // silently fail for viewer state
    }
  }, [localState]);

  // Session timer: re-evaluate expiration every 60s
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60_000);
    return () => clearInterval(interval);
  }, []);

  // Auto-refresh offerings every 15s
  useEffect(() => {
    const interval = setInterval(() => {
      fetchOfferings().then(setOfferings).catch(() => {});
    }, 15_000);
    return () => clearInterval(interval);
  }, []);

  // Cleanup feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    };
  }, []);

  const now = new Date();
  const visibleOfferings = getVisibleOfferings(offerings, localState, now);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function showEmpty() {
    return (
      <div className={isDesktop ? "absolute inset-0 flex items-center justify-center" : "flex flex-col items-center mt-12"}>
        <p className="text-gray-500 text-sm text-center mb-4">
          The chapel is quiet tonight.
          <br />
          Release the first offering.
        </p>
        <Button variant="ghost" onClick={() => setShowReleaseModal(true)}>
          Make an Offering
        </Button>
      </div>
    );
  }

  function showFeedback(message: string) {
    if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
    setFeedback(message);
    feedbackTimer.current = setTimeout(() => setFeedback(null), 3000);
  }

  async function handleCreateOffering(input: { body: string; mood: Mood }) {
    const newOffering = createOffering({ ...input, existingOfferings: offerings });
    try {
      await postOffering(newOffering);
    } catch {
      showFeedback("Failed to create offering. Try again.");
      return;
    }
    setOfferings((prev) => [...prev, newOffering]);
    setLocalState((prev) => ({
      ...prev,
      createdOfferingIds: [...prev.createdOfferingIds, newOffering.id],
    }));
    setShowReleaseModal(false);
  }

  async function handleWitness() {
    if (!selectedOffering) return;
    const result = witnessOffering(selectedOffering, localState);
    if (result.result.success) {
      try {
        const updated = await postAction(selectedOffering.id, "witness");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      }
    }
    showFeedback(result.result.message);
  }

  async function handleLightCandle() {
    if (!selectedOffering) return;
    const result = lightCandle(selectedOffering, localState);
    if (result.result.success) {
      try {
        const updated = await postAction(selectedOffering.id, "candle");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      }
    }
    showFeedback(result.result.message);
  }

  function handleRelease() {
    if (!selectedOffering) return;
    const newLocalState = releaseOfferingLocally(selectedOffering.id, localState);
    setLocalState(newLocalState);
    setSelectedOffering(null);
  }

  async function handleReport() {
    if (!selectedOffering) return;
    const result = reportOffering(selectedOffering, localState);
    if (result.result.success) {
      try {
        const updated = await postAction(selectedOffering.id, "report");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      }
    }
    showFeedback(result.result.message);
  }

  async function handleResetLocalData() {
    clearViewerState();
    setLocalState(loadViewerState());
    try {
      const data = await fetchOfferings();
      setOfferings(data);
    } catch {
      showFeedback("Failed to reload offerings.");
    }
    setSelectedOffering(null);
    setShowReleaseModal(false);
  }

  return (
    <div className="relative min-h-screen">
      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-gray-900">
        <span className="font-serif text-sm text-gray-500 tracking-wide">
          Nocturne
        </span>
        <div className="flex items-center gap-3">
          <Button variant="link" onClick={() => navigate("/")}>
            Threshold
          </Button>
          <Button variant="link" onClick={() => navigate("/about")}>
            About
          </Button>
          {import.meta.env.DEV && (
            <button
              type="button"
              onClick={handleResetLocalData}
              className="text-[10px] text-gray-700 hover:text-gray-500 cursor-pointer"
              title="Reset local data (dev only)"
            >
              reset
            </button>
          )}
        </div>
      </header>

      {/* Chapel area */}
      <main
        className="relative w-full"
        style={{ height: "calc(100vh - 53px)" }}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isDesktop ? (
          <div className="relative w-full h-full">
            {visibleOfferings.length === 0 ? (
              showEmpty()
            ) : (
              visibleOfferings.map((o) => (
                <div
                  key={o.id}
                  className="absolute"
                  style={{ left: `${o.position.x}%`, top: `${o.position.y}%` }}
                >
                  <OfferingPreview
                    offering={o}
                    onClick={() => setSelectedOffering(o)}
                    isYours={localState.createdOfferingIds.includes(o.id)}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="flex flex-wrap justify-center gap-4 p-6 pt-8 overflow-y-auto max-h-full">
            {visibleOfferings.length === 0 ? (
              showEmpty()
            ) : (
              visibleOfferings.map((o) => (
                <OfferingPreview
                  key={o.id}
                  offering={o}
                  onClick={() => setSelectedOffering(o)}
                  isYours={localState.createdOfferingIds.includes(o.id)}
                />
              ))
            )}
          </div>
        )}

        {/* Release button */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button variant="primary" onClick={() => setShowReleaseModal(true)}>
            Make an Offering
          </Button>
        </div>
      </main>

      {/* Feedback toast */}
      {feedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-gray-800 border border-gray-700 px-4 py-2 rounded text-xs text-gray-300">
          {feedback}
        </div>
      )}

      {/* Offering detail modal */}
      <Modal
        open={!!selectedOffering}
        onClose={() => setSelectedOffering(null)}
      >
        {selectedOffering && (
          <OfferingDetail
            offering={selectedOffering}
            localState={localState}
            isYours={localState.createdOfferingIds.includes(selectedOffering.id)}
            onWitness={handleWitness}
            onLightCandle={handleLightCandle}
            onRelease={handleRelease}
            onReport={handleReport}
            onClose={() => setSelectedOffering(null)}
          />
        )}
      </Modal>

      {/* Release offering modal */}
      <ReleaseOfferingModal
        open={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        onSubmit={handleCreateOffering}
      />
    </div>
  );
}
