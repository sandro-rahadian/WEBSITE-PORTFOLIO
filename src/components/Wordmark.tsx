const TEXT = "SANDRO";

function maskUrl() {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 969 294'><text x='50%' y='84%' font-family='sans-serif' font-weight='900' font-size='240' text-anchor='middle' letter-spacing='-0.06em'>${TEXT}</text></svg>`;
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

type Props = {
  variant: "kinetic" | "footer";
  className?: string;
  style?: React.CSSProperties;
};

export default function Wordmark({ variant, className, style }: Props) {
  if (variant === "footer") {
    return (
      <div
        aria-label={TEXT}
        role="img"
        className={className}
        style={{
          backgroundImage: "var(--red-footer)",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          color: "transparent",
          fontWeight: 900,
          letterSpacing: "-0.06em",
          lineHeight: 0.78,
          textAlign: "center",
          mixBlendMode: "normal",
          userSelect: "none",
          ...style,
        }}
      >
        {TEXT}
      </div>
    );
  }

  const mask = maskUrl();
  const maskProps = {
    WebkitMaskImage: mask,
    maskImage: mask,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: "center",
    maskPosition: "center",
  } as const;

  return (
    <div
      aria-label={TEXT}
      role="img"
      className={className}
      style={{
        position: "relative",
        aspectRatio: "969 / 294",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          background: "#ffffff",
          mixBlendMode: "color-dodge",
          ...maskProps,
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: "var(--red-midu-mask), var(--red-midu-linear)",
          mixBlendMode: "darken",
          ...maskProps,
        }}
      />
    </div>
  );
}
