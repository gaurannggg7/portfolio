import { Suspense } from "react";
import type { View } from "@/lib/view";
import SiteHeader from "../SiteHeader";
import SiteFooter from "../SiteFooter";
import ViewSync from "./ViewSync";

/**
 * Page frame for every route. The view attribute lives here (not in the root
 * layout) so it always matches the page content, including after back/forward.
 */
export default function ModeShell({ view, children }: { view: View; children: React.ReactNode }) {
  return (
    <div data-view={view} className="flex min-h-screen flex-col">
      <ViewSync view={view} />
      <Suspense>
        <SiteHeader view={view} />
      </Suspense>
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Suspense>
        <SiteFooter view={view} />
      </Suspense>
    </div>
  );
}
