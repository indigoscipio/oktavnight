import type { Mood, Offering } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { getOfferingImagePath } from "../assets/offeringImages";
import { moodIconPaths, ritualIconPaths } from "../assets/iconPaths";
import Icon from "./Icon";

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
      aria-label={`${offering.generatedName}, ${moodLabels[offering.mood]} offering, ${offering.witnessCount} witnessed, ${offering.candleCount} candles lit`}
      className={`fade-in float-animate group relative flex w-72 max-w-[86vw] items-center gap-3 overflow-hidden rounded-2xl border border-amber-900/25 bg-gradient-to-br from-gray-950/85 via-black/62 to-black/42 p-2.5 pr-3.5 text-left shadow-xl shadow-black/45 backdrop-blur-[2px] transition-all duration-300 hover:bg-black/65 hover:scale-[1.02] cursor-pointer ${moodAccent[offering.mood]} ${isYours ? "ring-1 ring-amber-200/35" : ""} ${candleAnimating ? "shadow-[0_0_24px_rgba(251,191,36,0.32)]" : ""}`}
      style={getFloatStyle(offering.id)}
    >
      <span className="pointer-events-none absolute inset-1 rounded-xl border border-white/[0.04]" />
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
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1 rounded-full border border-gray-700/70 bg-black/35 px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-300">
            <Icon src={moodIconPaths[offering.mood]} className="h-3 w-3 text-amber-200/80" />
            {moodLabels[offering.mood]}
          </span>
          {isYours && (
            <span className="rounded-full border border-amber-700/45 bg-amber-950/20 px-2 py-0.5 text-[10px] uppercase tracking-wider text-amber-100/90">
              Thine
            </span>
          )}
        </span>
        <span className="font-serif text-base text-gray-200 transition-colors group-hover:text-white line-clamp-1 leading-tight">
          {offering.generatedName}
        </span>
        <span className="text-xs text-gray-300/90 leading-snug line-clamp-2">
          {offering.body}
        </span>
        <span className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-gray-300/85">
          <span className="inline-flex items-center gap-1" title="Witnessed count">
            <Icon src={ritualIconPaths.witnessed} className="h-3.5 w-3.5 text-gray-200/80" />
            {offering.witnessCount} witnessed
          </span>
          <span className="inline-flex items-center gap-1" title="Candles lit">
            <Icon src={ritualIconPaths.lit} className="h-3.5 w-3.5 text-amber-200/80" />
            {offering.candleCount} lit
          </span>
          {(isWitnessed || isLit) && (
            <span className="text-gray-400">kept</span>
          )}
        </span>
      </span>
    </button>
  );
}
