import type { Offering, LocalOfferingState } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getTimeUntilFadeLabel } from "../domain/expiration";
import { getOfferingImagePath } from "../assets/offeringImages";
import { moodIconPaths, ritualIconPaths } from "../assets/iconPaths";
import Button from "./Button";
import Icon from "./Icon";

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
  const imagePath = getOfferingImagePath(offering.id);
  const fadeLabel = getTimeUntilFadeLabel(offering, new Date());
  const fadeColor =
    fadeLabel === "fading to ash" ? "text-red-300" :
    fadeLabel === "fading soon" ? "text-amber-300" :
    fadeLabel && (fadeLabel.startsWith("fading by") || fadeLabel.startsWith("fading in")) ? "text-amber-300/85" :
    "text-gray-400";

  return (
    <div className="flex flex-col gap-5 text-gray-200">
      <div className="relative mx-auto flex h-48 w-full items-center justify-center overflow-hidden rounded-lg border border-amber-900/25 bg-gradient-to-b from-gray-950 to-black">
        <div className="absolute inset-3 rounded border border-gray-800/60" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,158,11,0.08),transparent_58%)]" />
        <img
          src={imagePath}
          alt=""
          className="relative z-10 h-44 w-44 object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.85)]"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-700/70 bg-black/30 px-2.5 py-1 text-xs uppercase tracking-wider text-gray-200">
          <Icon src={moodIconPaths[offering.mood]} className="h-3.5 w-3.5 text-amber-200/85" />
          {moodLabels[offering.mood]}
        </span>
        {fadeLabel && (
          <span className={`rounded-full border border-gray-800 bg-black/25 px-2.5 py-1 text-xs italic ${fadeColor}`}>
            {fadeLabel}
          </span>
        )}
        {isYours && (
          <span className="rounded-full border border-amber-700/45 bg-amber-950/20 px-2.5 py-1 text-xs uppercase tracking-wider text-amber-100/90">Thine</span>
        )}
      </div>

      <h2 className="font-serif text-3xl text-gray-100 leading-none">
        {offering.generatedName}
      </h2>

      <p className="text-gray-200/90 leading-relaxed text-sm">
        {offering.body}
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-lg border border-gray-800/70 bg-black/25 p-3 text-sm">
        <div className="flex items-center gap-2">
          <Icon src={ritualIconPaths.witnessed} className="h-5 w-5 text-gray-100/85" />
          <div>
            <div className="text-lg leading-none text-gray-100">{offering.witnessCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Witnessed</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Icon src={ritualIconPaths.lit} className="h-5 w-5 text-amber-200/85" />
          <div>
            <div className="text-lg leading-none text-gray-100">{offering.candleCount}</div>
            <div className="text-[10px] uppercase tracking-wider text-gray-400">Candles lit</div>
          </div>
        </div>
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
