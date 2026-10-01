import { ActiveProjectProvider } from "@/components/ActiveProject";
import SiteHeader from "@/components/SiteHeader";
import Hero from "@/components/Hero";
import { GuardianSection, MoreProjects, SignLinkSection, VisionarySection } from "@/components/Projects";
import Experience from "@/components/Experience";
import About from "@/components/About";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <ActiveProjectProvider>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        <Hero />
        <div id="work" className="scroll-mt-16">
          <SignLinkSection />
          <GuardianSection />
          <VisionarySection />
          <MoreProjects />
        </div>
        <Experience />
        <About />
      </main>
      <Contact />
    </ActiveProjectProvider>
  );
}
