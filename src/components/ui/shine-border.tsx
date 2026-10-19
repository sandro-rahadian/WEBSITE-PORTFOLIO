"use client";

import { cn } from "@/lib/utils";

type Props = {
  borderRadius?: string | number;
  borderWidth?: number;
  duration?: number;
  color?: string | string[];
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

export function ShineBorder({
  borderRadius = 8,
  borderWidth = 1,
  duration = 14,
  color = "#000000",
  className,
  style,
  children,
}: Props) {
  const stops = Array.isArray(color) ? color.join(",") : color;
  return (
    <div
      style={
        {
          "--border-radius":
            typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius,
          ...style,
        } as React.CSSProperties
      }
      className={cn(
        "relative grid min-h-0 w-auto min-w-0 place-items-center overflow-hidden rounded-[--border-radius] bg-white p-0",
        className
      )}
    >
      <div
        style={
          {
            "--border-width": `${borderWidth}px`,
            "--border-radius": `${borderRadius}px`,
            "--duration": `${duration}s`,
            "--mask-linear-gradient": `linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)`,
            "--background-radial-gradient": `radial-gradient(transparent,transparent, ${stops},transparent,transparent)`,
          } as React.CSSProperties
        }
        className="before:bg-shine-size before:absolute before:inset-0 before:aspect-square before:size-full before:rounded-[--border-radius] before:p-[--border-width] before:will-change-[background-position] before:content-[''] before:![-webkit-mask-composite:xor] before:![mask-composite:exclude] before:[background-image:--background-radial-gradient] before:[background-size:300%_300%] before:[mask:--mask-linear-gradient] motion-safe:before:animate-shine"
      />
      {children}
    </div>
  );
}

export default ShineBorder;
