# Gaurang Mohan — portfolio

A Next.js site that explains three AI systems with interactive walkthroughs:
SignLink (speech → ASL clips), GuardianAI (transaction-graph fraud detection,
shown with synthetic data), and Visionary Hands (a sign-language glove).

## Run locally

```bash
npm install
npm run dev        # http://localhost:3000
```

Production check:

```bash
npm run lint
npm run build && npm run start
```

## Where things live

- `content/` holds all copy and data: project facts, pipeline stages, the
  SignLink example traces, the synthetic GuardianAI graph, and the glove letter
  templates (copied from the firmware). Edit text here, not in components.
- `app/page.tsx` is the concise homepage; `app/work/[slug]/page.tsx` renders
  the three project pages (`/work/signlink`, `/work/guardian`, `/work/visionary`).
- `components/` holds rendering. Interactive pieces are client components
  (`PipelineExplorer`, `signlink/`, `guardian/`, `visionary/`); section shells
  are server components.
- `CONTENT_TODO.md` lists facts that need verification, conflicting sources,
  and assets to add.

## View styles

Three experiences share the same content, routes, and interactive exhibits:

- **Systems Lab** (default): a lit 3D workbench (three.js via React Three
  Fiber, lazy-loaded) with one object per project. A flat SVG bench is the
  loading poster and the fallback for reduced motion, no WebGL, low-power
  devices, or by choice; phones get an illustrated card layout.
- **Research Campus**: a playable top-down campus (Canvas 2D, lazy-loaded)
  in `components/campus-game/`: `map.ts` (tiles, collision, signs, NPCs),
  `engine.ts` (tile-step movement and interaction), `sprites.ts` (original
  four-tone pixel art), `render.ts` (integer-scaled drawing), and React
  panels. Arrow keys/WASD to walk, E/Enter to interact, Esc to close; a
  D-pad on touch screens. The SVG map is the static alternative (default
  under reduced motion) and the loading poster; a directory lists every
  destination.
- **Field Notes**: an open notebook with tabbed project sheets whose numbered
  marks point to documented engineering decisions.

`/work` is a plain "Work & résumé" page for quick scanning in every view.
Exhibit copy lives in `content/exhibits.ts` and `content/notes-annotations.ts`.

- The view is resolved on the server: a valid `?view=lab|campus|notes`
  parameter, then the `view` cookie, then Systems Lab. `proxy.ts` saves a
  valid parameter as the preference; invalid values are ignored.
- The switcher (header, mobile menu, footer) sets the cookie, updates
  `?view=` in place, and re-renders without scrolling, keeping the section
  you were reading in place.
- Mode-specific layouts live in `components/modes/{lab,campus,notes}`. Shared
  styling uses tokens in `app/globals.css` (`rounded-panel`, `shadow-panel`,
  `font-display`, colours), so components don't branch on the view.
- Light/dark appearance is independent of the view and stored in `localStorage`.

## Notes

- Theme: `data-theme` on `<html>` is set before paint by an inline script in
  `app/layout.tsx` and stored in `localStorage`. Without JS it follows the OS.
- SignLink clips stream from the public Hugging Face dataset
  `gaurannggg7/asl-dictionary` (StudioGalt, CC0), and only after the visitor
  presses play.
