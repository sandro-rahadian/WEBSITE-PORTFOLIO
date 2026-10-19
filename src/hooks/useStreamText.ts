"use client";

import { useEffect, useLayoutEffect, useRef } from "react";

// [stream-text] useLayoutEffect must not run during SSR, where it warns.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const STREAM_CLASS = "t-stream";
const WORD_CLASS = "t-stream-w";
const ARMED_CLASS = "is-armed";
const IN_CLASS = "is-in";

/**
 * Wraps every word in a `.t-stream-w` span, recursing through element children.
 *
 * Recursing matters: these paragraphs carry inline emphasis
 * (`<span class="font-medium text-white">`) and one of them is `text-justify`.
 * Splitting `textContent` and rebuilding would flatten that formatting, so each
 * text node is split in place and the wrapping happens *inside* the emphasis
 * span, which keeps its own classes. Whitespace is emitted as its own text node
 * so the browser still sees real spaces between the word boxes -- without that,
 * `text-justify` has nothing to distribute.
 */
function wrapWords(root: Node, out: HTMLElement[]) {
  for (const child of Array.from(root.childNodes)) {
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child.textContent ?? "";
      if (!text.trim()) continue;

      const frag = document.createDocumentFragment();
      for (const part of text.split(/(\s+)/)) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const span = document.createElement("span");
        span.className = WORD_CLASS;
        span.textContent = part;
        out.push(span);
        frag.appendChild(span);
      }
      child.replaceWith(frag);
    } else if (child.nodeType === Node.ELEMENT_NODE) {
      wrapWords(child, out);
    }
  }
}

/**
 * Streaming word-by-word reveal.
 *
 * Returns a ref for the element whose text should stream. The element also gets
 * the `t-stream` class; everything else (hiding, staggering) is driven from
 * here, so call sites only add a ref.
 *
 * Words rest visible in CSS and are only hidden once `is-armed` is applied in a
 * layout effect, which runs before paint -- so there is no frame where the
 * paragraph flashes fully-rendered and then vanishes, and a page without JS
 * still shows the copy.
 */
export function useStreamText<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);

  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add(STREAM_CLASS);

    // [stream-text] the reduced-motion block in globals.css already forces these
    // words to full opacity, so skip the wrapping entirely rather than splitting
    // a paragraph that is never going to animate.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const words: HTMLElement[] = [];
    wrapWords(el, words);
    if (words.length === 0) return;

    el.classList.add(ARMED_CLASS);

    // read the cadence from the stylesheet so the CSS stays the single source
    const raw = getComputedStyle(el).getPropertyValue("--stream-gap").trim();
    const gapMs = Number.parseFloat(raw) || 60;

    const timers: ReturnType<typeof setTimeout>[] = [];
    const play = () => {
      words.forEach((word, i) => {
        timers.push(setTimeout(() => word.classList.add(IN_CLASS), i * gapMs));
      });
    };

    // already on screen at mount (deep link, refresh mid-page) -- skip the observer
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9 && rect.bottom > 0) {
      play();
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          if (!entries.some((e) => e.isIntersecting)) return;
          io.disconnect();
          play();
        },
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      io.observe(el);
      return () => {
        io.disconnect();
        timers.forEach(clearTimeout);
      };
    }

    return () => timers.forEach(clearTimeout);
  }, []);

  return ref;
}
