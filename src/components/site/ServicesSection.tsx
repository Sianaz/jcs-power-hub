import { Truck, Zap, Cpu, Gauge, Cable, MapPin } from "lucide-react";

export const services = [
  {
    icon: Truck,
    title: "Equipo Pesado",
    desc: "Excavadoras, tractores, bulldozers, cargadores frontales, retroexcavadoras y camiones.",
  },
  {
    icon: Zap,
    title: "Generación Eléctrica",
    desc: "Plantas eléctricas y generadores industriales de cualquier marca y capacidad.",
  },
  {
    icon: Cpu,
    title: "Programación de Computadoras",
    desc: "Reprogramación de ECU, módulos y unidades de control de motores diésel.",
  },
  {
    icon: Gauge,
    title: "Calibración",
    desc: "Calibración de inyectores, bombas, sensores y sistemas hidráulicos.",
  },
  {
    icon: Cable,
    title: "Diagnóstico Eléctrico",
    desc: "Detección y reparación de fallas eléctricas, arneses y sistemas de control.",
  },
  {
    icon: MapPin,
    title: "Servicio a Domicilio",
    desc: "Llegamos hasta donde está tu equipo con herramienta y laptop de diagnóstico.",
  },
];

export function ServicesSection() {
  return (
    <section id="servicios" className="bg-background py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-blue">Nuestros servicios</p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-tight md:text-5xl">
            Todo lo que tu maquinaria necesita
          </h2>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s) => (
            <article
              key={s.title}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-brand-blue/10 text-brand-blue transition-colors group-hover:bg-brand-yellow group-hover:text-brand-ink">
                <s.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold uppercase text-foreground">{s.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{s.desc}</p>
              <div className="absolute inset-x-0 bottom-0 h-1 bg-brand-yellow scale-x-0 transition-transform group-hover:scale-x-100" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}