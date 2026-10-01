import { getView } from "@/lib/getView";
import type { View } from "@/lib/view";
import ModeShell from "@/components/view/ModeShell";
import LabHome from "@/components/modes/lab/LabHome";
import CampusHome from "@/components/modes/campus/CampusHome";
import NotesHome from "@/components/modes/notes/NotesHome";

// Only the selected view is rendered; the others are never sent to the browser.
const HOME: Record<View, () => React.ReactElement> = {
  lab: LabHome,
  campus: CampusHome,
  notes: NotesHome,
};

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const view = await getView(searchParams);
  const Page = HOME[view];
  return (
    <ModeShell view={view}>
      <Page />
    </ModeShell>
  );
}
