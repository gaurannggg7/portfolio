import MoreWork from "../../MoreWork";
import Experience from "../../Experience";
import About from "../../About";
import NotesDesk from "./NotesDesk";

/** Field Notes homepage: the notebook on the desk, then the readable sections. */
export default function NotesHome() {
  return (
    <>
      <NotesDesk />
      <MoreWork />
      <Experience />
      <About />
    </>
  );
}
