import Hero from "@/components/Hero";
import SelectedWork from "@/components/SelectedWork";
import MoreWork from "@/components/MoreWork";
import Experience from "@/components/Experience";
import About from "@/components/About";

export default function Home() {
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
