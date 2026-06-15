const brands = ["Caterpillar", "Volvo", "Komatsu", "John Deere", "Olympian", "Cummins", "Hyundai", "Kenworth"];

export function BrandsSection() {
  return (
    <section className="border-y border-border bg-background py-12">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <p className="text-center font-display text-xs uppercase tracking-[0.3em] text-muted-foreground">
          Marcas que atendemos
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {brands.map((b) => (
            <span key={b} className="font-display text-xl uppercase tracking-wide text-foreground/40 transition-colors hover:text-brand-blue md:text-2xl">
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}