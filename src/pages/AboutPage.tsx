import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="page-in flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md flex flex-col gap-5">
        <h1 className="font-serif text-2xl text-gray-200">On Nocturne</h1>

        <section className="flex flex-col gap-3 text-sm text-gray-400 leading-relaxed">
          <p>
            Nocturne is a still and quiet place for grievous thoughts — not a forum, nor a ledger of names.
          </p>

          <p>
            Offerings are brief, nameless, and fleeting. Each fades by nightfall.
            None know who left them, nor why.
          </p>

          <p>
            Thou may release a burden, bear witness to another's, light a candle in the dark, or let it pass from thy sight. That is all.
          </p>

          <hr className="border-gray-800 my-2" />

          <p className="text-gray-500 text-xs">
            Nocturne is no cure. It is a small, nameless place for those who carry what cannot be set down elsewhere.
          </p>

          <p className="text-gray-500 text-xs">
            If thou or another art in peril, seek those nearby, or the aid of those sworn to protect.
          </p>

          <hr className="border-gray-800 my-2" />

          <p className="text-gray-500 text-xs">
            Plead not names, nor addresses, nor any mark by which thou might be known.
            Offerings are open for all to see, but none shall know the hand that left them.
          </p>
        </section>

        <div className="flex gap-3 mt-2">
          <Button variant="primary" onClick={() => navigate("/chapel")}>
            Return to Chapel
          </Button>
          <Button variant="ghost" onClick={() => navigate("/")}>
            Threshold
          </Button>
        </div>
      </div>
    </div>
  );
}
