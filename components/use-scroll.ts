import { useEffect, useState, useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** True once the page is scrolled past `threshold` pixels. */
export function useScroll(threshold = 10) {
  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false
  );
}

/**
 * The href of the last section whose top has passed under the header — used to
 * mark the active nav item. Reads rects rather than using IntersectionObserver
 * because ScrollSmoother translates the content.
 */
export function useActiveSection(hrefs: readonly string[], offset = 140) {
  const [active, setActive] = useState<string | null>(null);
  const key = hrefs.join("|");

  useEffect(() => {
    const ids = key.split("|").filter(Boolean);
    let frame = 0;

    const read = () => {
      frame = 0;
      let current: string | null = null;
      for (const id of ids) {
        const el = document.querySelector(id);
        if (!el) continue;
        if (el.getBoundingClientRect().top <= offset) current = id;
      }
      setActive((prev) => (prev === current ? prev : current));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };

    read();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [key, offset]);

  return active;
}
