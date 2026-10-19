"use client";

import { useEffect, useState } from "react";

export const SHADER_SRC = "https://gradientshader-nine.vercel.app/";

const SHADER_FALLBACK =
  "radial-gradient(120% 90% at 30% 10%, #e4b3ae 0%, #dd5c4f 38%, #d1392a 62%, #6c1f16 100%)";

export default function ShaderLayer({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.matchMedia("(max-width: 767px)").matches;
    const saveData = (
      navigator as Navigator & { connection?: { saveData?: boolean } }
    ).connection?.saveData;
    setEnabled(!coarse && !small && !saveData);
  }, []);

  if (!enabled) {
    return (
      <div
        aria-hidden="true"
        className={className ?? "absolute inset-0"}
        style={{ background: SHADER_FALLBACK }}
      />
    );
  }

  return (
    <iframe
      title="Animated gradient shader"
      src={SHADER_SRC}
      aria-hidden="true"
      tabIndex={-1}
      loading="eager"
      className={className ?? "absolute inset-0 h-full w-full border-0"}
      style={{ width: "100%", height: "100%" }}
    />
  );
}
