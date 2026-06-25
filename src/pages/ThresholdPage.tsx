import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function ThresholdPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-md flex flex-col gap-6">
        <h1 className="font-serif text-3xl text-gray-200 tracking-wide">
          Nocturne
        </h1>

        <p className="text-gray-400 text-sm leading-relaxed">
          Nocturne is a quiet place to release what you cannot say out loud.
        </p>

        <p className="text-gray-500 text-xs leading-relaxed">
          No profiles. No replies. No names.
          <br />
          Write it. Witness it. Let it fade.
        </p>

        <div className="flex flex-col gap-3 mt-4">
          <Button variant="primary" onClick={() => navigate("/chapel")}>
            Enter the Chapel
          </Button>

          <Button variant="ghost" onClick={() => navigate("/chapel?release=true")}>
            Release an Offering
          </Button>
        </div>

        <p className="text-gray-600 text-xs mt-8 leading-relaxed">
          Nocturne is not therapy, medical care, or emergency support.
          <br />
          If you or someone else is in immediate danger, contact local emergency services.
        </p>

        <Button variant="link" onClick={() => navigate("/about")}>
          About Nocturne
        </Button>
      </div>
    </div>
  );
}
