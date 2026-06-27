import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { ritualIconPaths } from "../assets/iconPaths";

export default function ThresholdPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-in relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4 py-10 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,3,6,0.3), rgba(3,3,6,0.72)), url('/threshold-bg.webp')",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.12)_46%,rgba(0,0,0,0.78)_100%)]" />
      <div className="relative z-10 flex w-full max-w-3xl flex-col gap-6 rounded-[2rem] border border-amber-900/30 bg-gradient-to-b from-black/40 via-gray-950/35 to-black/45 p-7 shadow-2xl shadow-black/70 backdrop-blur-[2px] sm:p-9">
        <svg aria-hidden="true" className="mx-auto mb-2 text-gray-400" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M28 4C14.7 4 4 14.7 4 28s10.7 24 24 24c-5.3-4-8-10.7-8-18s2.7-14 8-18z" />
        </svg>
        <h1 className="font-serif text-5xl text-gray-100 tracking-[0.28em]">
          Nocturne
        </h1>

        <p className="text-gray-200 text-sm leading-relaxed">
          A still place for what thou canst not speak aloud.
        </p>

        <p className="text-gray-300/85 text-xs leading-relaxed">
          No names. No replies. No knowing who.
          <br />
          Write it. Witness it. Let it fade.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button variant="primary" onClick={() => navigate("/chapel")} className="rounded-full py-3 tracking-widest">
            Enter the Chapel
          </Button>
        </div>

        <div className="grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4 text-center">
            <span className="mx-auto mb-2 block h-px w-8 bg-amber-200/55" aria-hidden="true" />
            <h2 className="font-serif text-lg text-gray-100">Offer</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">Cast thy burden into the dark.</p>
          </div>
          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4 text-center">
            <Icon src={ritualIconPaths.witnessed} className="mx-auto mb-2 h-5 w-5 text-gray-100/85" />
            <h2 className="font-serif text-lg text-gray-100">Witness</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">Bear silent witness to another soul.</p>
          </div>
          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4 text-center">
            <Icon src={ritualIconPaths.lit} className="mx-auto mb-2 h-5 w-5 text-amber-200/85" />
            <h2 className="font-serif text-lg text-gray-100">Light</h2>
            <p className="mt-1 text-xs leading-relaxed text-gray-400">Keep a small flame in the dark.</p>
          </div>
        </div>

        <p className="text-gray-400 text-xs mt-2 leading-relaxed">
          Nocturne is no physic, no remedy for what ails thee.
          <br />
          If thou or another art in peril, seek the aid of those nearby.
        </p>

        <Button variant="link" onClick={() => navigate("/about")}>
          About Nocturne
        </Button>
      </div>
    </div>
  );
}
