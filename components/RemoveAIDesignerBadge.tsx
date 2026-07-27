"use client";
import { useEffect } from "react";

/**
 * Watches the DOM and immediately removes the aidesigner attribution badge
 * the moment their runtime script injects it.
 */
export default function RemoveAIDesignerBadge() {
  useEffect(() => {
    const remove = () => {
      document
        .querySelectorAll<HTMLElement>('a[href*="aidesigner.ai"]')
        .forEach((el) => el.remove());
    };

    // Remove if already in DOM
    remove();

    // Watch for future injections
    const observer = new MutationObserver(remove);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return null;
}
