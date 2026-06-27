import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { moodIconPaths, ritualIconPaths } from "../assets/iconPaths";

const APP_VERSION = "0.0.0";

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "on nocturne | nocturne";
  }, []);

  return (
    <div
      className="page-in relative flex min-h-dvh flex-col items-center justify-center overflow-y-auto bg-cover bg-center px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(3,3,6,0.42), rgba(3,3,6,0.82)), url('/threshold-bg.webp')",
      }}
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.18)_46%,rgba(0,0,0,0.82)_100%)]" />
      <main className="relative z-10 max-w-2xl rounded-[2rem] border border-amber-900/30 bg-gradient-to-b from-black/45 via-gray-950/45 to-black/55 p-7 shadow-2xl shadow-black/70 backdrop-blur-[2px] sm:p-9">
        <img src="/logomark.svg" alt="" className="mx-auto mb-3 h-9 w-9" />
        <p className="mb-2 text-center text-[10px] uppercase tracking-[0.3em] text-amber-200/70">about nocturne</p>
        <h1 className="font-serif text-4xl text-gray-100 text-center">on nocturne</h1>
        <hr className="ornate my-5" />

        <section className="grid gap-4 text-sm text-gray-300 leading-relaxed">
          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-100">
              <Icon src={ritualIconPaths.witnessed} className="h-5 w-5 text-gray-100/85" />
              <h2 className="font-serif text-xl">A Quiet Place</h2>
            </div>
            <p>
              nocturne is a still and quiet place for grievous thoughts — not a forum, nor a ledger of names.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-100">
              <Icon src={ritualIconPaths.lit} className="h-5 w-5 text-amber-200/85" />
              <h2 className="font-serif text-xl">Brief And Nameless</h2>
            </div>
            <p>
              Offerings are brief, nameless, and fleeting. Each fades by nightfall.
              None know who left them, nor why.
            </p>
          </div>

          <div className="rounded-xl border border-gray-800/70 bg-black/25 p-4">
            <div className="mb-2 flex items-center gap-2 text-gray-100">
              <Icon src={moodIconPaths.grief} className="h-5 w-5 text-amber-200/80" />
              <h2 className="font-serif text-xl">The Rite</h2>
            </div>
            <p>
              Thou may release a burden, bear witness to another's, light a candle in the dark, or let it pass from thy sight. That is all.
            </p>
          </div>

          <hr className="ornate my-3" />

          <p className="text-gray-400 text-xs leading-relaxed">
            nocturne is no cure. It is a small, nameless place for those who carry what cannot be set down elsewhere.
          </p>

          <p className="text-gray-400 text-xs leading-relaxed">
            If thou or another art in peril, seek those nearby, or the aid of those sworn to protect.
          </p>

          <hr className="ornate my-3" />

          <p className="text-gray-400 text-xs leading-relaxed">
            Plead not names, nor addresses, nor any mark by which thou might be known.
            Offerings are open for all to see, but none shall know the hand that left them.
          </p>
        </section>

        <div className="flex flex-col gap-3 mt-6 sm:flex-row">
          <Button variant="primary" onClick={() => navigate("/chapel")}>
            Return to Chapel
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Threshold
          </Button>
        </div>
        <footer className="mt-6 border-t border-gray-800/70 pt-4 text-center text-xs text-gray-400">
          nocturne by{" "}
          <a className="underline underline-offset-4 hover:text-gray-100" href="https://oktavsoftware.com/" target="_blank" rel="noreferrer">
            oktavsoftware
          </a>{" "}
          · version {APP_VERSION} ·{" "}
          <a className="underline underline-offset-4 hover:text-gray-100" href="https://github.com/indigoscipio/oktavnight" target="_blank" rel="noreferrer">
            GitHub
          </a>
        </footer>
      </main>
    </div>
  );
}
