"use client";

import { useCallback, useEffect, useRef } from "react";

export interface LightboxItem {
  src: string;
  alt: string;
  label: string;
  meta: string;
}

interface CertLightboxProps {
  items: LightboxItem[];
  index: number;
  onClose: () => void;
  onStep: (next: number) => void;
}

export default function CertLightbox({
  items,
  index,
  onClose,
  onStep,
}: CertLightboxProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const touchX = useRef<number | null>(null);
  const item = items[index];

  // A native modal <dialog> hands us the top layer, the focus trap, the inert
  // background and Esc for free. So close() is the ONLY exit path, and every
  // exit (Esc, backdrop, close button, arrow keys) funnels into onClose once --
  // no separate cancel handler to keep in sync.
  useEffect(() => {
    const el = ref.current;
    if (el && !el.open) el.showModal();
  }, []);

  const dismiss = useCallback(() => ref.current?.close(), []);

  const step = useCallback(
    (dir: number) => onStep((index + dir + items.length) % items.length),
    [index, items.length, onStep]
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        step(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        step(-1);
      }
    };
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [step]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchX.current = e.touches[0]?.clientX ?? null;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    const from = touchX.current;
    const to = e.changedTouches[0]?.clientX;
    touchX.current = null;
    if (from == null || to == null) return;
    const dx = to - from;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  };

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) dismiss();
      }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label="Pratinjau sertifikat"
      className="lb-root fixed inset-0 m-0 flex h-dvh max-h-dvh w-full max-w-full flex-col items-center justify-center gap-[2vh] overscroll-contain border-0 bg-transparent p-[max(14px,3vw)] text-white backdrop:bg-black/90"
    >
      <button
        type="button"
        onClick={dismiss}
        aria-label="Tutup pratinjau"
        className="lb-hit absolute z-10 right-[max(14px,3vw)] top-[max(14px,3vw)] grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-xl leading-none backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      >
        <span aria-hidden="true">&times;</span>
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={() => step(-1)}
            aria-label="Sertifikat sebelumnya"
            className="lb-hit absolute z-10 left-[max(10px,2vw)] top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-xl leading-none backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">&#8249;</span>
          </button>
          <button
            type="button"
            onClick={() => step(1)}
            aria-label="Sertifikat berikutnya"
            className="lb-hit absolute z-10 right-[max(10px,2vw)] top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/15 bg-white/10 text-xl leading-none backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <span aria-hidden="true">&#8250;</span>
          </button>
        </>
      )}

      <figure className="lb-panel flex min-h-0 w-full max-w-full flex-col items-center gap-[1.6vh]">
        {/* the certificates are 1200px scans; 78vh keeps them under that on
            every desktop height so the preview never upscales */}
        <img
          key={item.src}
          src={item.src}
          alt={item.alt}
          draggable={false}
          className="lb-img min-h-0 max-h-[78vh] w-auto max-w-full rounded-[var(--r-card)] object-contain"
        />
        <figcaption
          aria-live="polite"
          className="flex min-h-0 flex-col items-center gap-[0.4vh] px-[8vw] text-center"
        >
          <span className="text-[clamp(15px,1.5vw,22px)] font-medium leading-tight">
            {item.label}
          </span>
          <span className="text-[clamp(12px,1.05vw,15px)] leading-tight text-white/60">
            {item.meta}
          </span>
          {items.length > 1 && (
            <span className="mt-[0.6vh] text-[clamp(11px,0.85vw,13px)] tabular-nums tracking-[0.18em] text-white/40">
              {index + 1} / {items.length}
            </span>
          )}
        </figcaption>
      </figure>
    </dialog>
  );
}
