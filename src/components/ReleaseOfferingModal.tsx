import { useState } from "react";
import type { Mood } from "../domain/types";
import { moodLabels } from "../domain/moods";
import { validateOfferingBody } from "../domain/validation";
import { moodIconPaths } from "../assets/iconPaths";
import Modal from "./Modal";
import Button from "./Button";
import Icon from "./Icon";

interface ReleaseOfferingModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: { body: string; mood: Mood }) => Promise<void>;
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
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    const result = validateOfferingBody(body);
    if (!result.valid) {
      setErrors(result.errors);
      return;
    }
    setErrors([]);
    setSubmitting(true);
    await onSubmit({ body: body.trim(), mood });
    setBody("");
    setMood("grief");
    setSubmitting(false);
  }

  function handleClose() {
    setErrors([]);
    setSubmitting(false);
    onClose();
  }

  return (
    <Modal open={open} onClose={handleClose} ariaLabel="Release thy burden">
      <div className="relative flex flex-col gap-5 text-gray-200">
        <div>
          <p className="mb-1 text-[10px] uppercase tracking-[0.28em] text-amber-200/70">An Offering</p>
          <h2 className="font-serif text-3xl text-gray-100">Release Thy Burden</h2>
        </div>

        <p className="text-sm text-gray-300 leading-relaxed">
          Let no name nor mark by which thou might be known pass into these words.
          Offerings are shown to all who enter — but none shall know thee.
        </p>

        <p className="rounded-lg border border-amber-900/25 bg-amber-950/10 p-3 text-xs text-gray-400 leading-relaxed">
          nocturne is no refuge from harm. If thou or another art in peril, seek the aid of those nearby.
        </p>

        <hr className="ornate" />

        <div>
          <label className="sr-only" htmlFor="offering-body">
            Offering text
          </label>
          <textarea
            id="offering-body"
            data-autofocus="true"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What wouldst thou release?"
            rows={4}
            maxLength={280}
            aria-invalid={errors.length > 0}
            aria-describedby={errors.length > 0 ? "offering-errors" : undefined}
            className="w-full resize-none rounded-lg border border-gray-700/80 bg-black/40 p-4 text-sm leading-relaxed text-gray-100 placeholder:text-gray-500 shadow-inner shadow-black/60 focus:outline-none focus:border-amber-300/60 focus:ring-2 focus:ring-amber-200/20"
          />
          <div className="mt-1 text-right text-xs text-gray-400">
            {body.length} / 280
          </div>
        </div>

        <div>
          <label className="block text-xs text-gray-300 mb-2 uppercase tracking-[0.24em]">
            Mood
          </label>
          <div className="flex flex-wrap gap-2" role="radiogroup" aria-label="Mood">
            {moods.map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={mood === m}
                onClick={() => setMood(m)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs cursor-pointer border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 ${
                  mood === m
                    ? "border-amber-300/70 bg-amber-950/25 text-amber-100 shadow-[0_0_14px_rgba(251,191,36,0.12)]"
                    : "border-gray-700/80 bg-black/20 text-gray-300 hover:border-gray-500 hover:text-gray-100"
                }`}
              >
                <Icon src={moodIconPaths[m]} className="h-3.5 w-3.5" />
                {moodLabels[m]}
              </button>
            ))}
          </div>
        </div>

        {errors.length > 0 && (
          <div id="offering-errors" role="alert" className="rounded-lg border border-red-800/70 bg-red-950/25 p-2 text-xs text-red-300">
            {errors.map((e, i) => (
              <p key={i}>{e}</p>
            ))}
          </div>
        )}

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button variant="ghost" onClick={handleClose}>
            Stay thy hand
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
            Release
          </Button>
        </div>
      </div>
    </Modal>
  );
}
