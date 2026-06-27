import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function ThresholdPage() {
  const navigate = useNavigate();

  return (
    <div
      className="page-in relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-cover bg-center px-4 text-center"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,3,6,0.48), rgba(3,3,6,0.82)), url('/threshold-bg.webp')",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.22)_46%,rgba(0,0,0,0.84)_100%)]" />
      <div className="relative z-10 max-w-md flex flex-col gap-6 rounded-[2rem] border border-gray-800/50 bg-black/35 p-8 shadow-2xl backdrop-blur-[2px]">
        <svg aria-hidden="true" className="mx-auto mb-2 text-gray-400" width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M28 4C14.7 4 4 14.7 4 28s10.7 24 24 24c-5.3-4-8-10.7-8-18s2.7-14 8-18z" />
        </svg>
        <h1 className="font-serif text-5xl text-gray-100 tracking-[0.28em]">
          Nocturne
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          A still place for what thou canst not speak aloud.
        </p>

        <p className="text-gray-500 text-xs leading-relaxed">
          No names. No replies. No knowing who.
          <br />
          Write it. Witness it. Let it fade.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/chapel")}
            className="rounded-full border-gray-700/70 bg-black/40 py-3 tracking-widest text-gray-200 hover:bg-black/65"
          >
            Enter the Chapel
          </Button>
        </div>

        <p className="text-gray-600 text-xs mt-8 leading-relaxed">
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
