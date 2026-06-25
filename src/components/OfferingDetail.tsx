import type { Offering, LocalOfferingState } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getTimeUntilFadeLabel } from "../domain/expiration";
import Button from "./Button";

interface OfferingDetailProps {
  offering: Offering;
  localState: LocalOfferingState;
  isYours: boolean;
  onWitness: () => void;
  onLightCandle: () => void;
  onRelease: () => void;
  onReport: () => void;
  onClose: () => void;
}

export default function OfferingDetail({
  offering,
  localState,
  isYours,
  onWitness,
  onLightCandle,
  onRelease,
  onReport,
  onClose,
}: OfferingDetailProps) {
  const hasWitnessed = localState.witnessedOfferingIds.includes(offering.id);
  const hasLitCandle = localState.candleOfferingIds.includes(offering.id);
  const hasReleased = localState.releasedOfferingIds.includes(offering.id);
  const hasReported = localState.reportedOfferingIds.includes(offering.id);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500 uppercase tracking-wider">
          {moodLabels[offering.mood]}
        </span>
        {getTimeUntilFadeLabel(offering, new Date()) && (
          <span className="text-[10px] text-gray-600 italic">
            {getTimeUntilFadeLabel(offering, new Date())}
          </span>
        )}
        {isYours && (
          <span className="text-[10px] text-gray-400 italic">yours</span>
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
          <span className="text-gray-400">This offering has been witnessed.</span>
        )}
        {offering.candleCount > 0 && (
          <span className="text-gray-400">A candle was lit here.</span>
        )}
      </div>

      <hr className="border-gray-800" />

      <div className="flex flex-wrap gap-2">
        <Button
          variant="ghost"
          onClick={onWitness}
          disabled={hasWitnessed}
        >
          {hasWitnessed ? "Witnessed" : "Witness"}
        </Button>

        <Button
          variant="ghost"
          onClick={onLightCandle}
          disabled={hasLitCandle}
        >
          {hasLitCandle ? "Candle Lit" : "Light Candle"}
        </Button>

        <Button
          variant="ghost"
          onClick={onRelease}
          disabled={hasReleased}
        >
          {hasReleased ? "Released" : "Release"}
        </Button>

        <Button
          variant="danger"
          onClick={onReport}
          disabled={hasReported}
        >
          {hasReported ? "Reported" : "Report"}
        </Button>
      </div>

      <Button variant="link" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}
