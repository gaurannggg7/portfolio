import { about, availability, education } from "@/content/site";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="scroll-mt-16 border-t border-rule py-16 sm:py-24">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-12">
        <h2 id="about-heading" className="text-3xl font-semibold tracking-tight text-ink lg:col-span-3">
          About
        </h2>
        <div className="space-y-5 lg:col-span-6">
          {about.map((p) => (
            <p key={p} className="text-[17px] leading-relaxed text-ink-2">
              {p}
            </p>
          ))}
        </div>
        <aside className="space-y-6 lg:col-span-3 lg:border-l lg:border-rule lg:pl-6">
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Education</h3>
            <p className="mt-2 text-[15px] font-medium leading-snug text-ink">{education.degree}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-2">{education.school}</p>
            <p className="mt-1 text-sm leading-relaxed text-ink-3">{education.note}</p>
          </div>
          <div>
            <h3 className="font-mono text-xs uppercase tracking-[0.12em] text-ink-3">Looking for</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-2">{availability}</p>
          </div>
        </aside>
      </div>
    </section>
  );
}
