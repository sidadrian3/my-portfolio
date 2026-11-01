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
  stacked = false,
}: {
  label: string;
  id?: string;
  children: React.ReactNode;
  className?: string;
  stacked?: boolean;
}) {
  const headingId = `${slugify(label)}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-20 py-6 sm:py-8 ${
        stacked ? "" : "sm:grid sm:grid-cols-[120px_minmax(0,1fr)] gap-x-5"
      } ${className}`}
    >
      <h2
        id={headingId}
        className={`mb-4 text-[15px] font-semibold text-ink ${stacked ? "" : "sm:mb-0"}`}
      >
        {label}
      </h2>
      <div>{children}</div>
    </section>
  );
}
