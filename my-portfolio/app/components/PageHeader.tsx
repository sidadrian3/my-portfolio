export function PageHeader({ title, children }: { title: string; children?: React.ReactNode }) {
  return (
    <header className="pt-8 pb-4 sm:pt-12">
      <h1 className="text-[32px] font-[650] leading-[1.1] tracking-[-0.03em] text-ink">{title}</h1>
      {children && <p className="mt-2 text-[15px] text-mute">{children}</p>}
    </header>
  );
}
