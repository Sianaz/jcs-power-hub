import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { services } from "@/components/site/ServicesSection";
import { CheckCircle2 } from "lucide-react";
import foto4 from "@/assets/jcs_foto_4.jpeg.asset.json";
import foto5 from "@/assets/jcs_foto_5.jpeg.asset.json";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/servicios")({
  head: () => ({
    meta: [
      { title: "Servicios — JC'S Servicios Técnicos" },
      { name: "description", content: "Reparación de equipo pesado, plantas eléctricas, programación de ECU, calibración y diagnóstico eléctrico en Panamá." },
      { property: "og:title", content: "Servicios — JC'S" },
      { property: "og:description", content: "Equipo pesado, generación eléctrica, programación y diagnóstico computarizado." },
    ],
  }),
  component: ServiciosPage,
});

const details: Record<string, string[]> = {
  "Equipo Pesado": [
    "Diagnóstico mecánico e hidráulico completo",
    "Reparación de motores diésel y transmisiones",
    "Sistemas hidráulicos, bombas y mandos finales",
    "Tren de rodaje, frenos y dirección",
  ],
  "Generación Eléctrica": [
    "Mantenimiento de generadores diésel y gas",
    "Tableros de transferencia automática (ATS)",
    "Sincronización y carga programada",
    "Pruebas de carga y reportes",
  ],
  "Programación de Computadoras": [
    "Reprogramación de ECU (CAT, Cummins, Volvo, Detroit)",
    "Borrado y lectura de códigos de falla",
    "Actualización de software de control",
    "Parametrización de límites de operación",
  ],
  "Calibración": [
    "Calibración de inyectores comunes y unitarios",
    "Bombas de inyección rotativas y en línea",
    "Sensores de presión, temperatura y posición",
    "Sistemas hidráulicos y válvulas reguladoras",
  ],
  "Diagnóstico Eléctrico": [
    "Detección de cortos y fugas con multímetro y osciloscopio",
    "Reparación de arneses y conectores",
    "Sistemas de arranque, alternadores y baterías",
    "Instalación y diagnóstico de luces y sensores",
  ],
  "Servicio a Domicilio": [
    "Atención en obra, finca o instalación industrial",
    "Unidad móvil con herramienta y scanner",
    "Cotización transparente antes de iniciar",
    "Cobertura en toda la provincia de Panamá",
  ],
};

function ServiciosPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        {/* Hero */}
        <section className="relative overflow-hidden bg-brand-ink text-white">
          <img src={foto5.url} alt="Excavadora CAT en mantenimiento" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/30" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
            <p className="font-display text-sm uppercase tracking-widest text-brand-yellow">Servicios</p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] md:text-6xl lg:text-7xl">
              Soluciones técnicas<br /><span className="text-brand-yellow">de principio a fin</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Combinamos experiencia mecánica con tecnología de diagnóstico moderna para devolver tu equipo a la operación lo antes posible.
            </p>
          </div>
        </section>

        {/* Services detailed */}
        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-7xl space-y-12 px-4 md:px-6">
            {services.map((s, i) => (
              <article key={s.title} className="grid items-start gap-8 md:grid-cols-[auto_1fr] md:gap-10">
                <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <s.icon className="h-10 w-10" />
                </div>
                <div>
                  <p className="font-display text-xs uppercase tracking-widest text-brand-yellow">0{i + 1}</p>
                  <h2 className="mt-1 font-display text-3xl uppercase md:text-4xl">{s.title}</h2>
                  <p className="mt-3 max-w-2xl text-muted-foreground">{s.desc}</p>
                  <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                    {(details[s.title] ?? []).map((d) => (
                      <li key={d} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" />
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden bg-brand-ink py-16 text-white">
          <img src={foto4.url} alt="Planta eléctrica" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-brand-ink/70" />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-6">
            <h2 className="font-display text-4xl uppercase md:text-5xl">¿Tu equipo tiene una falla?</h2>
            <p className="max-w-xl text-white/80">Cuéntanos qué pasa y te diremos cómo podemos ayudarte.</p>
            <Link to="/contacto">
              <Button size="lg" className="bg-brand-yellow px-8 py-6 text-base font-semibold uppercase tracking-wide text-brand-ink hover:bg-brand-yellow/90">
                Solicitar servicio
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}