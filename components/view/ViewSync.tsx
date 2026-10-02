"use client";

import { useEffect } from "react";
import type { View } from "@/lib/view";

/** Mirrors the page's view onto <html> so the canvas and overscroll match. */
export default function ViewSync({ view }: { view: View }) {
  useEffect(() => {
    document.documentElement.setAttribute("data-view", view);
  }, [view]);
  return null;
}
