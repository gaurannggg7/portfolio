import Hero from "./Hero";
import SelectedWork from "./SelectedWork";
import MoreWork from "../../MoreWork";
import Experience from "../../Experience";
import About from "../../About";

/** Systems Lab homepage: concise studio layout. */
export default function LabHome() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <MoreWork />
      <Experience />
      <About />
    </>
  );
}
