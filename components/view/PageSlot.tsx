"use client";

/**
 * A pass-through component between <main> and the page content.
 *
 * On large pages (the campus) the page's server-component payload can still
 * be streaming when hydration reaches <main>. React then suspends on the
 * unit that owns those children and replays it. Replaying a host element
 * like <main> claims its DOM node a second time, so the hydration cursor
 * lands on <main>'s first child and React reports a mismatch. With this
 * component in between, the suspension and replay happen here instead,
 * where no DOM node is claimed. A Suspense boundary would also avoid it, but
 * would stream the page as hidden HTML that needs JavaScript to show.
 */
export default function PageSlot({ children }: { children: React.ReactNode }) {
  return children;
}
