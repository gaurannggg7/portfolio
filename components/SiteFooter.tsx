import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

const links = [
  { label: "GitHub", href: site.github },
  { label: "LinkedIn", href: site.linkedin },
  { label: "Hugging Face", href: site.huggingface },
  { label: "Resume", href: site.resume },
];

export default function SiteFooter() {
  return (
    <footer id="contact" aria-labelledby="contact-heading" className="border-t border-rule bg-surface">
      <div className="mx-auto max-w-6xl px-5 pb-10 pt-16 sm:px-8 sm:pt-20">
        <h2 id="contact-heading" className="label">
          Contact
        </h2>
        <a
          href={`mailto:${site.email}`}
          className="mt-3 inline-block break-all text-2xl font-semibold tracking-tight text-ink underline decoration-accent decoration-2 underline-offset-[6px] transition-colors hover:text-accent sm:text-4xl"
        >
          {site.email}
        </a>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-1">
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                target="_blank"
                rel={l.label === "Resume" ? "noopener" : "noopener noreferrer"}
                className="inline-flex min-h-11 items-center gap-1 text-[15px] text-ink-2 transition-colors hover:text-ink"
              >
                {l.label}
                <ArrowUpRight aria-hidden className="h-3.5 w-3.5" />
              </a>
            </li>
          ))}
        </ul>
        <p className="mt-12 border-t border-rule pt-5 text-xs text-ink-3">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  );
}
