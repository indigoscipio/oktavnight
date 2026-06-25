import type { Offering } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getTimeUntilFadeLabel } from "../domain/expiration";

interface OfferingPreviewProps {
  offering: Offering;
  onClick: () => void;
}

const moodDot: Record<string, string> = {
  grief: "bg-stone-500",
  rage: "bg-red-500",
  fear: "bg-violet-500",
  shame: "bg-amber-500",
  loneliness: "bg-blue-500",
};

export default function OfferingPreview({ offering, onClick }: OfferingPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex flex-col gap-1 p-3 rounded-lg border border-gray-800 bg-gray-900/70 hover:bg-gray-800/80 hover:border-gray-600 transition-colors duration-150 cursor-pointer text-left w-44"
    >
      <div className="flex items-center gap-2">
        <span className={`w-2 h-2 rounded-full shrink-0 ${moodDot[offering.mood]}`} />
        <span className="text-xs text-gray-400 uppercase tracking-wider">
          {moodLabels[offering.mood]}
        </span>
      </div>
      <span className="font-serif text-sm text-gray-200 group-hover:text-white transition-colors">
        {offering.generatedName}
      </span>
      <div className="flex gap-3 mt-1 text-[10px] text-gray-500">
        <span>{offering.witnessCount > 0 ? "witnessed" : ""}</span>
        <span>{offering.candleCount > 0 ? "\u2726" : ""}</span>
        <span>{getTimeUntilFadeLabel(offering, new Date())}</span>
      </div>
    </button>
  );
}
