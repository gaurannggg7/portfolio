import { useRef } from "react";

/**
 * Arrow/Home/End keyboard support for a WAI-ARIA tablist with roving focus.
 * Returns refs to attach to each tab and a keydown handler for the list.
 */
export function useTabKeys(count: number, index: number, onMove: (next: number) => void) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    let next = index;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (index + 1) % count;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (index - 1 + count) % count;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = count - 1;
    else return;
    e.preventDefault();
    onMove(next);
    refs.current[next]?.focus();
  };

  const setRef = (i: number) => (el: HTMLButtonElement | null) => {
    refs.current[i] = el;
  };

  return { refs, setRef, onKeyDown };
}
