function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function Section({
  label,
  id,
  children,
  className = "",
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
}) {
  const headingId = `${slugify(label)}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-20 border-t border-line py-12 sm:py-16 sm:grid sm:grid-cols-[120px_1fr] gap-x-5 ${className}`}
    >
      <h2
        id={headingId}
        className="mb-4 text-[15px] font-semibold text-ink sm:mb-0"
      >
        {label}
      </h2>
      <div>{children}</div>
    </section>
  );
}
