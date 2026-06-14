const steps = [
  { n: "01", title: "Nos contactas", desc: "Por WhatsApp o usando el formulario de abajo." },
  { n: "02", title: "Agendamos la visita", desc: "Coordinamos día y hora en tu ubicación o nuestro taller." },
  { n: "03", title: "Reparamos y entregamos", desc: "Te entregamos el equipo funcionando como debe." },
];

export function HowItWorksSection() {
  return (
    <section id="como-funciona" className="bg-brand-ink py-20 text-white md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-yellow">¿Cómo funciona?</p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-tight md:text-5xl">
            Tres pasos, cero complicaciones
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="relative rounded-2xl border border-white/10 bg-white/5 p-8">
              <div className="font-display text-6xl font-bold text-brand-yellow">{s.n}</div>
              <h3 className="mt-4 font-display text-2xl font-bold uppercase">{s.title}</h3>
              <p className="mt-2 text-white/70">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}