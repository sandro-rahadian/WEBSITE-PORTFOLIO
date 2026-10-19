"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import React, { useEffect, useState } from "react";

/* Thumbnail carousel, rebuilt rather than pasted: the spec we were given was
   truncated partway through the constants and never included the slide
   markup, the drag handler or the thumbnail row.

   Mechanism is the part that was unambiguous and is kept as-is:
   - on release the offset is measured against DRAG_BUFFER; under it the deck
     springs back to the current slide, over it advances one step
   - spring transition, and auto-advance is cleared whenever the pointer is
     down so a drag is never interrupted mid-flight

   Sizing is the one deliberate deviation. The source hardcoded 320/384px
   squares, which suits a standalone gallery. Here it sits in a 36vw column of
   the pinned timeline, so the slide fills its parent and the thumbnails scale
   from the viewport instead. Widths stay fluid to keep that column intact. */

const AUTO_DELAY = 5000;
const DRAG_BUFFER = 50;

const SPRING_OPTIONS = {
  type: "spring" as const,
  mass: 3,
  stiffness: 400,
  damping: 50,
};

export type CarouselImage = {
  src: string;
  alt: string;
};

export function ThumbnailCarousel({
  images,
  alt,
  className = "",
  autoPlay = true,
}: {
  images?: CarouselImage[];
  /** Fallback when no `images` are passed -- keeps the single-photo case
      working instead of rendering an empty deck. */
  alt?: string;
  className?: string;
  autoPlay?: boolean;
}) {
  const slides: CarouselImage[] = images?.length
    ? images
    : [{ src: "/experience-photo.jpg", alt: alt ?? "" }];

  const [index, setIndex] = useState(0);
  const [dragging, setDragging] = useState(false);
  const count = slides.length;

  // A shorter deck cycles faster, otherwise the last slide lingers.
  const delay = AUTO_DELAY;

  useEffect(() => {
    if (!autoPlay || dragging || count < 2) return;
    const id = window.setTimeout(() => {
      setIndex((i) => (i + 1) % count);
    }, delay);
    return () => window.clearTimeout(id);
  }, [index, autoPlay, dragging, count, delay]);

  const paginate = (dir: 1 | -1) => {
    setIndex((i) => (i + dir + count) % count);
  };

  const handleDragEnd = (_e: unknown, info: { offset: { x: number } }) => {
    const travelled = info.offset.x;
    if (travelled < -DRAG_BUFFER) paginate(1);
    else if (travelled > DRAG_BUFFER) paginate(-1);
    else setIndex((i) => i); // re-set so the animate target re-fires the spring
  };

  return (
    <div
      className={`relative flex h-full w-full flex-col ${className}`}
      onPointerDownCapture={() => setDragging(true)}
      onPointerUpCapture={() => setDragging(false)}
    >
      {/* Deck. Keys the wrapper on the count so the transform is rebased after
          any change to the slide list. */}
      <motion.div
        key={count}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        transition={SPRING_OPTIONS}
        className="flex min-h-0 flex-1 cursor-grab active:cursor-grabbing"
        /* Deck is width:100% of the column; each slide is 100% of the deck, so
           one step is a full deck width. Do NOT bind a motionValue to `x` here:
           a style-bound motionValue wins over `animate` and the snap silently
           stops working. Framer's own drag handles the pointer, then `animate`
           resumes control on release. */
        animate={{ x: `${-index * 100}%` }}
      >
        {slides.map((s, i) => (
          <div
            key={s.src}
            /* `flex: 0 0 <pct>`, not `width`. The deck is a flex container, and
               a percentage width on a flex item resolves against the item's own
               flex basis rather than the deck, which collapsed every slide to
               half the column and put two of them on screen. Pinning the basis
               is what makes one slide exactly one step wide, so the drag
               offset lines up with the snap. */
            className="relative min-h-0"
            style={{ flex: "0 0 100%" }}
          >
            <Image
              src={s.src}
              alt={s.alt}
              draggable={false}
              fill
              unoptimized
              sizes="(max-width: 600px) 85vw, 36vw"
              className="object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </motion.div>

      {/* Thumbnail rail. Clicking jumps straight to a slide, which is the part
          drag alone does not give you on a track that scrolls with the page. */}
      {count > 1 && (
        <div className="mt-2 flex shrink-0 justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.src}
              type="button"
              aria-label={`Show photo ${i + 1}: ${s.alt}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={`relative size-12 overflow-hidden rounded-md border transition sm:size-14 ${
                i === index
                  ? "border-white opacity-100"
                  : "border-white/30 opacity-50 hover:opacity-90"
              }`}
            >
              <Image
                src={s.src}
                alt=""
                draggable={false}
                fill
                unoptimized
                sizes="56px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default ThumbnailCarousel;
