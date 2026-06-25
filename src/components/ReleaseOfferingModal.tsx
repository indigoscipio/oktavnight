import { useState } from "react";
import type { Mood } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { validateOfferingBody } from "../domain/validation";
import Modal from "./Modal";
import Button from "./Button";

interface ReleaseOfferingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { body: string; mood: Mood }) => void;
}

const moods: Mood[] = ["grief", "rage", "fear", "shame", "loneliness"];

export default function ReleaseOfferingModal({
  open,
  onClose,
  onSubmit,
}: ReleaseOfferingModalProps) {
  const [body, setBody] = useState("");
  const [mood, setMood] = useState<Mood>("grief");
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit() {
    const result = validateOfferingBody(body);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    onSubmit({ body: body.trim(), mood });
    setBody("");
    setMood("grief");
  }

  function handleClose() {
    setErrors([]);
    onClose();
  }

  const remaining = 280 - body.length;

  return (
    <Modal open={open} onClose={handleClose}>
      <div className="flex flex-col gap-4">
        <h2 className="font-serif text-lg text-gray-200">Release an Offering</h2>

        <p className="text-xs text-gray-500 leading-relaxed">
          Do not include names, handles, addresses, or identifying details.
          Offerings are public, anonymous, and temporary.
        </p>

        <p className="text-[10px] text-gray-600 leading-relaxed">
          Nocturne is not emergency support. If you or someone else is in immediate danger,
          contact someone near you or local emergency services now.
        </p>

        <div>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What would you like to release?"
            rows={4}
            maxLength={280}
            className="w-full bg-gray-950 border border-gray-800 rounded p-3 text-sm text-gray-200 placeholder-gray-600 resize-none focus:outline-none focus:border-gray-600"
          />
          <div className="text-right text-xs text-gray-600 mt-1">
            {remaining}
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-500 mb-2 uppercase tracking-wider">
            Mood
          </label>
          <div className="flex flex-wrap gap-2">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m)}
                className={`px-3 py-1 rounded text-xs cursor-pointer border transition-colors ${
                  mood === m
                    ? "border-gray-400 bg-gray-800 text-gray-200"
                    : "border-gray-800 text-gray-500 hover:border-gray-600"
                }`}
              >
                {moodLabels[m]}
              </button>
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div className="text-xs text-red-400">
            {errors.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

        <div className="flex gap-2 justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Release
          </Button>
        </div>
      </div>
    </Modal>
  );
}
