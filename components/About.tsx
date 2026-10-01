import { about, availability, education } from "@/content/site";

export default function About() {
  return (
    <section id="about" aria-labelledby="about-heading" className="border-t border-rule">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-12 lg:gap-10">
        <h2 id="about-heading" className="font-display text-2xl font-semibold tracking-tight text-ink sm:text-3xl lg:col-span-3">
          About
        </h2>
        <div className="space-y-4 lg:col-span-5">
          {about.map((p) => (
            <p key={p} className="text-[16px] leading-relaxed text-ink-2">
              {p}
            </p>
          ))}
        </div>
        <dl className="space-y-5 text-sm lg:col-span-3 lg:col-start-10">
          <div>
            <dt className="label">Education</dt>
            <dd className="mt-1.5 font-medium text-ink">{education.degree}</dd>
            <dd className="mt-0.5 leading-relaxed text-ink-2">{education.school}</dd>
            <dd className="mt-0.5 leading-relaxed text-ink-3">{education.note}</dd>
          </div>
          <div>
            <dt className="label">Looking for</dt>
            <dd className="mt-1.5 leading-relaxed text-ink-2">{availability}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
