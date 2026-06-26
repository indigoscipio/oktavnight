import { useNavigate } from "react-router-dom";
import Button from "../components/Button";

export default function ThresholdPage() {
  const navigate = useNavigate();

  return (
    <div className="page-in flex flex-col items-center justify-center min-h-screen px-4 text-center">
      <div className="max-w-md flex flex-col gap-6">
        <h1 className="font-serif text-3xl text-gray-200 tracking-wide">
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
          <Button variant="primary" onClick={() => navigate("/chapel")}>
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
