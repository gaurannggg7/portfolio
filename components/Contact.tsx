import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { FooterScene } from "./PixelScene";

const links = [
  { label: "GitHub", href: site.github, detail: "github.com/gaurannggg7" },
  { label: "LinkedIn", href: site.linkedin, detail: "in/gaurangmmohan" },
  { label: "Hugging Face", href: site.huggingface, detail: "huggingface.co/gaurannggg7" },
  { label: "Resume", href: site.resume, detail: "PDF" },
];

export default function Contact() {
  return (
    <footer id="contact" aria-labelledby="contact-heading" className="scroll-mt-16 border-t border-ink">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 id="contact-heading" className="text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
            Get in touch
          </h2>
          <p className="mt-3 max-w-md text-[17px] leading-relaxed text-ink-2">
            Email is the fastest way to reach me.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block break-all text-2xl font-medium tracking-tight text-accent underline decoration-2 underline-offset-[6px] hover:decoration-4 sm:text-3xl"
          >
            {site.email}
          </a>
        </div>
        <ul className="divide-y divide-rule border-y border-rule lg:col-span-5 lg:self-end">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel={l.label === "Resume" ? "noopener" : "noopener noreferrer"}
                className="group flex min-h-14 items-center justify-between gap-4 py-2 text-ink"
              >
                <span className="text-[17px] font-medium">{l.label}</span>
                <span className="flex items-center gap-2 font-mono text-xs text-ink-3 group-hover:text-ink">
                  {l.detail}
                  <ArrowUpRight aria-hidden className="h-4 w-4" />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="h-40 w-full overflow-hidden border-t border-rule sm:h-48 lg:h-56">
        <FooterScene />
      </div>
      <div className="bg-[var(--ground)] px-4 py-4 text-center font-mono text-[11px] uppercase tracking-[0.12em] text-[#d9cbbd] sm:px-6">
        © {new Date().getFullYear()} {site.name} · Sign clips in the SignLink demo: StudioGalt, CC0
      </div>
    </footer>
  );
}
