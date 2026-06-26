import type { Offering, LocalOfferingState } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getTimeUntilFadeLabel } from "../domain/expiration";
import Button from "./Button";

interface OfferingDetailProps {
  offering: Offering;
  localState: LocalOfferingState;
  isYours: boolean;
  ritualLoading: "witness" | "candle" | "report" | null;
  onWitness: () => void;
  onLightCandle: () => void;
  onReport: () => void;
  onClose: () => void;
}

export default function OfferingDetail({
  offering,
  localState,
  isYours,
  ritualLoading,
  onWitness,
  onLightCandle,
  onReport,
  onClose,
}: OfferingDetailProps) {
  const hasWitnessed = localState.witnessedOfferingIds.includes(offering.id);
  const hasLitCandle = localState.candleOfferingIds.includes(offering.id);
  const hasReported = localState.reportedOfferingIds.includes(offering.id);
  const fadeLabel = getTimeUntilFadeLabel(offering, new Date());
  const fadeColor =
    fadeLabel === "fading to ash" ? "text-red-500" :
    fadeLabel === "fading soon" ? "text-amber-500" :
    fadeLabel && (fadeLabel.startsWith("fading by") || fadeLabel.startsWith("fading in")) ? "text-amber-600/70" :
    "text-gray-600";

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {moodLabels[offering.mood]}
        </span>
        {fadeLabel && (
          <span className={`text-[10px] italic ${fadeColor}`}>
            {fadeLabel}
          </span>
        )}
        {isYours && (
          <span className="text-[10px] text-gray-400 italic">thine</span>
        )}
      </div>

      <h2 className="font-serif text-xl text-gray-200">
        {offering.generatedName}
      </h2>

      <p className="text-gray-300 leading-relaxed text-sm">
        {offering.body}
      </p>

      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        {offering.witnessCount > 0 && (
          <span className="text-gray-400">Another soul hath borne witness.</span>
        )}
        {offering.candleCount > 0 && (
          <span className="text-gray-400">A flame flickers in the dark.</span>
        )}
      </div>

      <hr className="ornate" />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={onWitness}
          disabled={hasWitnessed || ritualLoading === "witness"}
        >
          {ritualLoading === "witness" ? "Witnessing..." : hasWitnessed ? "Witnessed" : "Witness"}
        </Button>

        <Button
          variant="ghost"
          onClick={onLightCandle}
          disabled={hasLitCandle || ritualLoading === "candle"}
        >
          {ritualLoading === "candle" ? "Lighting..." : hasLitCandle ? "Candle Lit" : "Light Candle"}
        </Button>

        <Button
          variant="danger"
          onClick={onReport}
          disabled={hasReported || ritualLoading === "report"}
        >
          {ritualLoading === "report" ? "Reporting..." : hasReported ? "Reported" : "Report"}
        </Button>
      </div>

      <Button variant="link" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
