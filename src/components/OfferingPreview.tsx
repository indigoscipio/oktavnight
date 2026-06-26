import type { Offering } from "../domain/types";

interface OfferingPreviewProps {
  offering: Offering;
  onClick: () => void;
  isYours: boolean;
  isWitnessed: boolean;
  isLit: boolean;
}

const moodBorder: Record<string, string> = {
  grief: "border-stone-600/40 hover:border-stone-500/60 hover:shadow-[0_0_12px_rgba(120,113,108,0.2)]",
  rage: "border-red-600/40 hover:border-red-500/60 hover:shadow-[0_0_12px_rgba(220,38,38,0.2)]",
  fear: "border-violet-600/40 hover:border-violet-500/60 hover:shadow-[0_0_12px_rgba(124,58,237,0.2)]",
  shame: "border-amber-600/40 hover:border-amber-500/60 hover:shadow-[0_0_12px_rgba(217,119,6,0.2)]",
  loneliness: "border-blue-600/40 hover:border-blue-500/60 hover:shadow-[0_0_12px_rgba(37,99,235,0.2)]",
};

const moodIcon: Record<string, string> = {
  grief: "○",
  rage: "◉",
  fear: "◈",
  shame: "◎",
  loneliness: "◇",
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
    animation: `float ${duration}s ease-in-out ${delay}s infinite`,
    willChange: "transform",
  };
}

export default function OfferingPreview({
  offering,
  onClick,
  isYours,
  isWitnessed,
  isLit,
}: OfferingPreviewProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={offering.generatedName}
      className={`fade-in float-animate group flex flex-col items-center justify-center gap-1 w-24 h-24 md:w-20 md:h-20 rounded-full border bg-gray-900/60 hover:bg-gray-800/70 hover:scale-105 transition-all duration-300 cursor-pointer text-center ${moodBorder[offering.mood]} ${isYours ? "ring-1 ring-gray-300/50" : ""}`}
      style={getFloatStyle(offering.id)}
    >
      <span className="text-lg leading-none text-gray-500 group-hover:text-gray-400 transition-colors">
        {moodIcon[offering.mood]}
      </span>
      <span className="font-serif text-[11px] text-gray-300 group-hover:text-white transition-colors line-clamp-1 px-1 leading-tight">
        {offering.generatedName}
      </span>
      <span className="text-[10px] text-gray-600 leading-none line-clamp-1 px-1">
        {offering.body}
      </span>
      {(offering.candleCount > 0 || offering.witnessCount > 0 || isWitnessed || isLit) && (
        <span className="text-[9px] text-gray-500 leading-none -mt-0.5">
          {offering.candleCount > 0 && `✦${offering.candleCount} `}
          {offering.witnessCount > 0 && `·${offering.witnessCount} `}
          {isLit && "✦"}
          {isWitnessed && "·"}
        </span>
      )}
    </button>
  );
}
