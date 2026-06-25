import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import type { Offering, LocalOfferingState } from "../domain/types";
import { createOffering } from "../domain/offering";
import {
  witnessOffering,
  lightCandle,
  releaseOfferingLocally,
  reportOffering,
} from "../domain/localViewerState";
import { getVisibleOfferings } from "../domain/expiration";
import {
  loadOfferings,
  saveOfferings,
  loadViewerState,
  saveViewerState,
  clearAllLocalData,
} from "../storage/localStorageRepository";
import OfferingPreview from "../components/OfferingPreview";
import OfferingDetail from "../components/OfferingDetail";
import ReleaseOfferingModal from "../components/ReleaseOfferingModal";
import Button from "../components/Button";

export default function ChapelPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [localState, setLocalState] = useState<LocalOfferingState>({
    witnessedOfferingIds: [],
    candleOfferingIds: [],
    releasedOfferingIds: [],
    reportedOfferingIds: [],
  });
  const [selectedOffering, setSelectedOffering] = useState<Offering | null>(null);
  const [showReleaseModal, setShowReleaseModal] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setOfferings(loadOfferings());
    setLocalState(loadViewerState());
  }, []);

  useEffect(() => {
    if (searchParams.get("release") === "true") {
      setShowReleaseModal(true);
    }
  }, [searchParams]);

  useEffect(() => {
    saveOfferings(offerings);
  }, [offerings]);

  useEffect(() => {
    saveViewerState(localState);
  }, [localState]);

  const now = new Date();
  const visibleOfferings = getVisibleOfferings(offerings, localState, now);

  function handleCreateOffering(input: { body: string; mood: import("../domain/types").Mood }) {
    const newOffering = createOffering(input);
    setOfferings((prev) => [...prev, newOffering]);
    setShowReleaseModal(false);
  }

  function handleWitness() {
    if (!selectedOffering) return;
    const result = witnessOffering(selectedOffering, localState);
    setOfferings((prev) =>
      prev.map((o) => (o.id === result.offering.id ? result.offering : o))
    );
    setLocalState(result.localState);
    setSelectedOffering(result.offering);
    setFeedback(result.result.message);
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleLightCandle() {
    if (!selectedOffering) return;
    const result = lightCandle(selectedOffering, localState);
    setOfferings((prev) =>
      prev.map((o) => (o.id === result.offering.id ? result.offering : o))
    );
    setLocalState(result.localState);
    setSelectedOffering(result.offering);
    setFeedback(result.result.message);
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleRelease() {
    if (!selectedOffering) return;
    const newLocalState = releaseOfferingLocally(selectedOffering.id, localState);
    setLocalState(newLocalState);
    setSelectedOffering(null);
  }

  function handleReport() {
    if (!selectedOffering) return;
    const result = reportOffering(selectedOffering, localState);
    setOfferings((prev) =>
      prev.map((o) => (o.id === result.offering.id ? result.offering : o))
    );
    setLocalState(result.localState);
    setSelectedOffering(result.offering);
    setFeedback(result.result.message);
    setTimeout(() => setFeedback(null), 3000);
  }

  function handleResetLocalData() {
    clearAllLocalData();
    setOfferings(loadOfferings());
    setLocalState(loadViewerState());
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
          <Button variant="link" onClick={() => navigate("/about")}>
            About
          </Button>
          <button
            type="button"
            onClick={handleResetLocalData}
            className="text-[10px] text-gray-700 hover:text-gray-500 cursor-pointer"
            title="Reset local data (dev only)"
          >
            reset
          </button>
        </div>
      </header>

      {/* Chapel area */}
      <main
        className="relative w-full"
        style={{ height: "calc(100vh - 53px)" }}
      >
        {/* Mobile fallback */}
        <div className="md:hidden flex flex-col gap-3 p-4 overflow-y-auto max-h-full">
          {visibleOfferings.length === 0 ? (
            <p className="text-gray-500 text-sm text-center mt-12">
              The chapel is quiet tonight.
              <br />
              Release the first offering.
            </p>
          ) : (
            visibleOfferings.map((o) => (
              <OfferingPreview
                key={o.id}
                offering={o}
                onClick={() => setSelectedOffering(o)}
              />
            ))
          )}
        </div>

        {/* Desktop floating layout */}
        <div className="hidden md:block relative w-full h-full">
          {visibleOfferings.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500 text-sm text-center">
                The chapel is quiet tonight.
                <br />
                Release the first offering.
              </p>
            </div>
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
                />
              </div>
            ))
          )}
        </div>

        {/* Release button */}
        <div className="fixed bottom-6 right-6 z-20">
          <Button
            variant="primary"
            onClick={() => setShowReleaseModal(true)}
          >
            Release an Offering
          </Button>
        </div>
      </main>

      {/* Temp feedback toast */}
      {feedback && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-gray-800 border border-gray-700 px-4 py-2 rounded text-xs text-gray-300">
          {feedback}
        </div>
      )}

      {/* Offering detail modal */}
      {selectedOffering && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-lg p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            <OfferingDetail
              offering={selectedOffering}
              localState={localState}
              onWitness={handleWitness}
              onLightCandle={handleLightCandle}
              onRelease={handleRelease}
              onReport={handleReport}
              onClose={() => setSelectedOffering(null)}
            />
          </div>
        </div>
      )}

      {/* Release offering modal */}
      <ReleaseOfferingModal
        open={showReleaseModal}
        onClose={() => setShowReleaseModal(false)}
        onSubmit={handleCreateOffering}
      />
    </div>
  );
}
