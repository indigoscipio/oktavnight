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
import Icon from "../components/Icon";
import { ritualIconPaths } from "../assets/iconPaths";

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

  useEffect(() => {
    document.title = "the chapel | nocturne";
  }, []);

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
  const candleTimers = useRef<Set<ReturnType<typeof setTimeout>>>(new Set());

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

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimer.current) clearTimeout(feedbackTimer.current);
      candleTimers.current.forEach(clearTimeout);
      candleTimers.current.clear();
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
    let savedOffering: Offering;
    try {
      savedOffering = await postOffering(newOffering);
    } catch {
      showFeedback("Failed to create offering. Try again.");
      return;
    }
    setOfferings((prev) => [...prev.filter((o) => o.id !== savedOffering.id), savedOffering]);
    setLocalState((prev) => ({
      ...prev,
      createdOfferingIds: [...prev.createdOfferingIds, savedOffering.id],
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
        const timer = setTimeout(() => {
          setCandleAnimatingIds((prev) => prev.filter((id) => id !== selectedOffering.id));
          candleTimers.current.delete(timer);
        }, 1000);
        candleTimers.current.add(timer);
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
      <header className="relative z-20 flex items-center justify-between px-4 py-3 border-b border-amber-900/25 bg-black/55 backdrop-blur-sm shadow-lg shadow-black/40">
        <img src="/logo.svg" alt="nocturne" className="h-8 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.12)]" />
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
            "linear-gradient(rgba(3,3,6,0.18), rgba(3,3,6,0.56)), url('/chapel-bg.webp')",
        }}
      >
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.08)_42%,rgba(0,0,0,0.66)_100%)]" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
        {loading ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center" role="status" aria-live="polite">
            <div className="w-6 h-6 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
            <span className="sr-only">Loading offerings</span>
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
                  candleAnimating={candleAnimatingIds.includes(o.id)}
                />
              ))
            )}
          </div>
        )}

        {!loading && !fetchError && visibleOfferings.length > 0 && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 rounded-full border border-amber-900/35 bg-black/45 px-4 py-1.5 text-xs text-gray-200 shadow-lg shadow-black/40 backdrop-blur-sm">
            {visibleOfferings.length === 1
              ? "A single offering flickers in the dark."
              : `${visibleOfferings.length} offerings flicker in the dark.`}
          </div>
        )}

        {/* Offering button */}
        <div className="fixed bottom-6 left-1/2 z-20 -translate-x-1/2">
          <Button
            variant="primary"
            onClick={() => setShowReleaseModal(true)}
            className="rounded-full px-6 py-3 tracking-widest"
          >
            Make an Offering
          </Button>
        </div>

        {/* Legend */}
        <div className="fixed bottom-6 left-6 z-20 hidden gap-3 rounded-full border border-gray-800/70 bg-black/40 px-4 py-2 text-[11px] text-gray-300 shadow-lg shadow-black/40 backdrop-blur-sm md:flex">
          <span className="inline-flex items-center gap-1.5">
            <Icon src={ritualIconPaths.lit} className="h-3.5 w-3.5 text-amber-200/85" />
            Candle lit
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Icon src={ritualIconPaths.witnessed} className="h-3.5 w-3.5 text-gray-200/85" />
            Witness borne
          </span>
        </div>
      </main>

      {/* Feedback toast */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="toast fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-gray-800 border border-gray-700 px-4 py-2 rounded text-xs text-gray-300"
        >
          {feedback}
        </div>
      )}

      {/* Offering detail modal */}
      <Modal
        open={!!selectedOffering}
        onClose={() => setSelectedOffering(null)}
        ariaLabel={selectedOffering ? `${selectedOffering.generatedName} offering detail` : "Offering detail"}
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
