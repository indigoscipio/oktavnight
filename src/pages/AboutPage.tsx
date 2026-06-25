import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md flex flex-col gap-5">
        <h1 className="font-serif text-2xl text-gray-200">About Nocturne</h1>

        <section className="flex flex-col gap-3 text-sm text-gray-400 leading-relaxed">
          <p>
            Nocturne is a quiet gothic ritual space for difficult thoughts.
            It is not a social network, a diary, or a forum.
          </p>

          <p>
            Offerings are short, anonymous, and temporary.
            Each one fades within 24 hours.
            There are no profiles, no replies, no names.
          </p>

          <p>
            You can release a thought, silently witness what others have shared,
            light a candle, or let it go from your view.
            That is all.
          </p>

          <hr className="border-gray-800 my-2" />

          <p className="text-gray-500 text-xs">
            Nocturne is not therapy, medical care, or emergency support.
            It is a small anonymous space for people who need to set something down.
          </p>

          <p className="text-gray-500 text-xs">
            If you or someone else is in immediate danger,
            please contact local emergency services or someone near you now.
          </p>

          <hr className="border-gray-800 my-2" />

          <p className="text-gray-500 text-xs">
            Do not include names, handles, addresses, or identifying details
            in your offerings.
            Offerings are public, anonymous, and temporary.
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
