import { Award, Laptop, Clock, Truck } from "lucide-react";

const reasons = [
  { icon: Award, title: "Técnicos con experiencia", desc: "Más de 10 años trabajando con marcas líderes en equipo pesado y generación." },
  { icon: Laptop, title: "Diagnóstico computarizado", desc: "Scanners profesionales para detectar la falla exacta y reducir tiempos." },
  { icon: Truck, title: "Servicio en sitio", desc: "Llevamos las herramientas hasta donde está tu equipo, sin importar la distancia." },
  { icon: Clock, title: "Respuesta rápida", desc: "Atendemos emergencias 24/7 vía WhatsApp para que tu operación no se detenga." },
];

export function WhyUsSection() {
  return (
    <section className="bg-secondary py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm uppercase tracking-widest text-brand-blue">¿Por qué elegirnos?</p>
          <h2 className="mt-2 font-display text-4xl uppercase leading-tight text-foreground md:text-5xl">
            Profesionales que entienden tu equipo
          </h2>
        </div>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {reasons.map((r) => (
            <div key={r.title} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-yellow/15 text-brand-yellow">
                <r.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-lg uppercase">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}