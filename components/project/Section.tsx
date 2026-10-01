/** Project-page section: numbered label column on the left, content on the right. */
export default function Section({
  id,
  index,
  title,
  intro,
  children,
}: {
  id: string;
  index: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-h`} className="border-t border-rule py-12 sm:py-16">
      <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
        <header className="lg:col-span-3">
          <p className="label">{index}</p>
          <h2 id={`${id}-h`} className="mt-1 text-xl font-semibold tracking-tight text-ink sm:text-2xl">
            {title}
          </h2>
          {intro && <div className="mt-2 max-w-sm text-[15px] leading-relaxed text-ink-2">{intro}</div>}
        </header>
        <div className="min-w-0 lg:col-span-9">{children}</div>
      </div>
    </section>
  );
}
