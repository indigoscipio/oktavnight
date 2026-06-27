import type { Mood, Offering } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getOfferingImagePath } from "../assets/offeringImages";

interface OfferingPreviewProps {
  offering: Offering;
  onClick: () => void;
  isYours: boolean;
  isWitnessed: boolean;
  isLit: boolean;
  candleAnimating?: boolean;
}

const moodAccent: Record<Mood, string> = {
  grief: "hover:border-stone-500/40 hover:shadow-[0_0_18px_rgba(120,113,108,0.18)]",
  rage: "hover:border-red-500/40 hover:shadow-[0_0_18px_rgba(220,38,38,0.16)]",
  fear: "hover:border-violet-500/40 hover:shadow-[0_0_18px_rgba(124,58,237,0.16)]",
  shame: "hover:border-amber-500/40 hover:shadow-[0_0_18px_rgba(217,119,6,0.16)]",
  loneliness: "hover:border-blue-500/40 hover:shadow-[0_0_18px_rgba(37,99,235,0.16)]",
};

function hashId(id: string): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function getFloatStyle(id: string): React.CSSProperties {
  const hash = hashId(id);
  const duration = 5 + (hash % 5);
  const delay = hash % 5;
  return {
    "--float-duration": `${duration}s`,
    "--float-delay": `${delay}s`,
  } as React.CSSProperties;
}

export default function OfferingPreview({
  offering,
  onClick,
  isYours,
  isWitnessed,
  isLit,
  candleAnimating,
}: OfferingPreviewProps) {
  const imagePath = getOfferingImagePath(offering.id);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${offering.generatedName}, ${moodLabels[offering.mood]} offering`}
      className={`fade-in float-animate group flex w-60 max-w-[78vw] items-center gap-3 rounded-2xl border border-gray-800/20 bg-black/20 p-2 pr-3 text-left backdrop-blur-[1px] transition-all duration-300 hover:bg-black/35 hover:scale-[1.02] cursor-pointer ${moodAccent[offering.mood]} ${isYours ? "ring-1 ring-gray-300/40" : ""} ${candleAnimating ? "shadow-[0_0_22px_rgba(251,191,36,0.35)]" : ""}`}
      style={getFloatStyle(offering.id)}
    >
      <span className="relative h-20 w-20 shrink-0 md:h-24 md:w-24" aria-hidden="true">
        <span className="absolute inset-x-3 bottom-1 h-3 rounded-full bg-black/70 blur-md" />
        <img
          src={imagePath}
          alt=""
          className="relative z-10 h-full w-full object-contain drop-shadow-[0_10px_18px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
      </span>
      <span className="flex min-w-0 flex-col gap-1">
        <span className="font-serif text-base text-gray-200 transition-colors group-hover:text-white line-clamp-1 leading-tight">
          {offering.generatedName}
        </span>
        <span className="text-xs text-gray-400/90 leading-snug line-clamp-2">
          {offering.body}
        </span>
        {(offering.candleCount > 0 || offering.witnessCount > 0 || isWitnessed || isLit) && (
          <span className="text-[10px] text-gray-500 leading-none pt-1">
            {offering.witnessCount > 0 && `·${offering.witnessCount} witnessed `}
            {offering.candleCount > 0 && `✦${offering.candleCount} `}
            {isWitnessed && "·"}
            {isLit && "✦"}
          </span>
        )}
        {isYours && (
          <span className="text-[10px] text-gray-500 italic">thine</span>
        )}
      </span>
    </button>
  );
}
