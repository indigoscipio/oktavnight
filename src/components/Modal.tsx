import type { ReactNode, RefObject } from "react";
import { useEffect, useRef, useCallback } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
  );
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Body scroll lock
  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
      previousFocus.current?.focus();
    };
  }, [open]);

  // Autofocus first focusable element
  useEffect(() => {
    if (!open || !contentRef.current) return;
    const requestedFocus = contentRef.current.querySelector<HTMLElement>("[data-autofocus='true']");
    if (requestedFocus) {
      requestedFocus.focus();
      return;
    }
    const focusable = getFocusable(contentRef.current);
    focusable[0]?.focus();
  }, [open]);

  // Simple focus trap
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key !== "Tab" || !contentRef.current) return;
      const focusable = getFocusable(contentRef.current);
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!open) return;
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, handleKeyDown]);

  if (!open) return null;

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) {
      onClose();
    }
  }

  return (
    <div
      ref={overlayRef}
      role="dialog"
      aria-modal="true"
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out_both]"
    >
      <div
        ref={contentRef as RefObject<HTMLDivElement>}
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-amber-700/35 bg-gradient-to-b from-gray-950 via-gray-950 to-black p-6 shadow-2xl shadow-black/70 ring-1 ring-white/5 animate-[scaleIn_0.2s_ease-out_both]"
      >
        <div className="pointer-events-none absolute inset-2 rounded-lg border border-gray-700/30" />
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 rounded text-gray-400 hover:text-amber-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-950 text-xl leading-none cursor-pointer p-1"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
