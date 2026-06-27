import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Offering, LocalOfferingState, Mood } from "../domain/types";
import { createOffering } from "../domain/offering";
import {
  witnessOffering,
  lightCandle,
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
  const [fetchError, setFetchError] = useState(false);
  const [ritualLoading, setRitualLoading] = useState<"witness" | "candle" | "report" | null>(null);
  const [candleAnimatingIds, setCandleAnimatingIds] = useState<string[]>([]);
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
        setFetchError(true);
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
  const visibleOfferings = getVisibleOfferings(offerings, now);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  function showEmpty() {
    return (
      <div className={isDesktop ? "absolute inset-0 flex items-center justify-center" : "flex flex-col items-center mt-12"}>
          <p className="text-gray-500 text-sm text-center mb-4">
            The chapel lies still this night.
            <br />
            No burden hath been laid here yet.
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

  async function handleRetry() {
    setLoading(true);
    setFetchError(false);
    try {
      const data = await fetchOfferings();
      setOfferings(data);
    } catch {
      setFetchError(true);
    }
    setLoading(false);
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
      setRitualLoading("witness");
      try {
        const updated = await postAction(selectedOffering.id, "witness");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      } finally {
        setRitualLoading(null);
      }
    }
    showFeedback(result.result.message);
  }

  async function handleLightCandle() {
    if (!selectedOffering) return;
    const result = lightCandle(selectedOffering, localState);
    if (result.result.success) {
      setRitualLoading("candle");
      try {
        const updated = await postAction(selectedOffering.id, "candle");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
        setCandleAnimatingIds((prev) => [...prev, selectedOffering.id]);
        setTimeout(() => {
          setCandleAnimatingIds((prev) => prev.filter((id) => id !== selectedOffering.id));
        }, 1000);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      } finally {
        setRitualLoading(null);
      }
    }
    showFeedback(result.result.message);
  }

  async function handleReport() {
    if (!selectedOffering) return;
    const result = reportOffering(selectedOffering, localState);
    if (result.result.success) {
      setRitualLoading("report");
      try {
        const updated = await postAction(selectedOffering.id, "report");
        setLocalState(result.localState);
        setOfferings((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        setSelectedOffering(updated);
      } catch {
        showFeedback("Failed to save. Try again.");
        return;
      } finally {
        setRitualLoading(null);
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
    <div className="page-in relative min-h-screen bg-black">
      {/* Header */}
      <header className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-gray-800/50 bg-black/70 backdrop-blur-sm">
        <span className="font-serif text-xl text-gray-300 tracking-[0.28em]">
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
        className="relative w-full overflow-hidden bg-cover bg-center"
        style={{
          height: "calc(100vh - 53px)",
          backgroundImage:
            "linear-gradient(rgba(3,3,6,0.34), rgba(3,3,6,0.72)), url('/chapel-bg.webp')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_42%,rgba(0,0,0,0.78)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-black/85 to-transparent" />
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : fetchError ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
              <p className="text-gray-500 text-sm text-center">The offerings elude us.</p>
              <Button variant="ghost" onClick={handleRetry}>Retry</Button>
            </div>
          </div>
        ) : isDesktop ? (
          <div className="relative z-10 w-full h-full">
            {visibleOfferings.length === 0 ? (
              showEmpty()
            ) : (
              visibleOfferings.map((o) => (
                <div
                  key={o.id}
                  className="absolute"
                  style={{
                    left: `${Math.min(Math.max(o.position.x, 4), 78)}%`,
                    top: `${Math.min(Math.max(o.position.y, 6), 78)}%`,
                  }}
                >
                  <OfferingPreview
                    offering={o}
                    onClick={() => setSelectedOffering(o)}
                    isYours={localState.createdOfferingIds.includes(o.id)}
                    isWitnessed={localState.witnessedOfferingIds.includes(o.id)}
                    isLit={localState.candleOfferingIds.includes(o.id)}
                    candleAnimating={candleAnimatingIds.includes(o.id)}
                  />
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="relative z-10 flex max-h-full flex-col items-center gap-5 overflow-y-auto p-5 pt-8 pb-28">
            {visibleOfferings.length === 0 ? (
              showEmpty()
            ) : (
              visibleOfferings.map((o) => (
                <OfferingPreview
                  key={o.id}
                  offering={o}
                  onClick={() => setSelectedOffering(o)}
                  isYours={localState.createdOfferingIds.includes(o.id)}
                  isWitnessed={localState.witnessedOfferingIds.includes(o.id)}
                  isLit={localState.candleOfferingIds.includes(o.id)}
                  candleAnimating={candleAnimatingIds.includes(o.id)}
                />
              ))
            )}
          </div>
        )}

        {!loading && !fetchError && visibleOfferings.length > 0 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 text-[10px] text-gray-500 bg-black/25 px-3 py-1 rounded-full backdrop-blur-sm">
            {visibleOfferings.length === 1
              ? "A single offering flickers in the dark."
              : `${visibleOfferings.length} offerings flicker in the dark.`}
          </div>
        )}

        {/* Offering button */}
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
          <Button
            variant="ghost"
            onClick={() => setShowReleaseModal(true)}
            className="rounded-full border-gray-700/70 bg-black/45 px-6 py-3 tracking-widest text-gray-200 backdrop-blur-sm hover:bg-black/65"
          >
            + Make an Offering
          </Button>
        </div>

        {/* Legend */}
        <div className="fixed bottom-6 left-6 z-20 hidden gap-3 text-[10px] text-gray-500 md:flex">
          <span>✦ candle lit</span>
          <span>· witness borne</span>
        </div>
      </main>

      {/* Feedback toast */}
      {feedback && (
        <div className="toast fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-gray-800 border border-gray-700 px-4 py-2 rounded text-xs text-gray-300">
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
            ritualLoading={ritualLoading}
            onWitness={handleWitness}
            onLightCandle={handleLightCandle}
            onReport={handleReport}
            onClose={() => setSelectedOffering(null)}
          />
        )}
      </Modal>

      {/* Make offering modal */}
      <ReleaseOfferingModal
        open={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        onSubmit={handleCreateOffering}
      />
    </div>
  );
}
