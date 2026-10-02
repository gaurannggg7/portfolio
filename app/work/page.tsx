import type { Metadata } from "next";
import { getView } from "@/lib/getView";
import { site } from "@/content/site";
import ModeShell from "@/components/view/ModeShell";
import WorkResume from "@/components/WorkResume";

export const metadata: Metadata = {
  title: `Work & résumé — ${site.name}`,
  description: `Projects, experience, and résumé of ${site.name} on one page.`,
};

export default async function WorkPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const view = await getView(searchParams);
  return (
    <ModeShell view={view}>
      <WorkResume />
    </ModeShell>
  );
}
