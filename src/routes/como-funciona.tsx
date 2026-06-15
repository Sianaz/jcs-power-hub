import { createFileRoute, Link } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { Button } from "@/components/ui/button";
import { MessageSquare, Search, FileText, Wrench, CheckCircle2 } from "lucide-react";
import foto3 from "@/assets/jcs_foto_3.jpeg.asset.json";
import foto6 from "@/assets/jcs_foto_6.jpeg.asset.json";

export const Route = createFileRoute("/como-funciona")({
  head: () => ({
    meta: [
      { title: "¿Cómo funciona? — JC'S Servicios Técnicos" },
      { name: "description", content: "Conoce nuestro proceso: contacto, diagnóstico, cotización, reparación y entrega." },
      { property: "og:title", content: "¿Cómo funciona? — JC'S" },
      { property: "og:description", content: "Un proceso claro y profesional para devolver tu equipo a la operación." },
    ],
  }),
  component: ComoFuncionaPage,
});

const steps = [
  { icon: MessageSquare, title: "Nos contactas", desc: "Por WhatsApp o el formulario de contacto. Cuéntanos qué equipo es y qué falla está presentando." },
  { icon: Search, title: "Diagnóstico", desc: "Nuestro técnico revisa el equipo con scanner profesional para identificar la causa real de la falla." },
  { icon: FileText, title: "Cotización clara", desc: "Te enviamos una cotización detallada con repuestos, tiempos y mano de obra antes de comenzar." },
  { icon: Wrench, title: "Reparación", desc: "Ejecutamos el trabajo en sitio o en taller, manteniéndote informado del avance." },
  { icon: CheckCircle2, title: "Entrega y garantía", desc: "Pruebas finales y entrega del equipo funcionando, con garantía sobre el trabajo realizado." },
];

function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-brand-ink text-white">
          <img src={foto3.url} alt="Diagnóstico con laptop" className="absolute inset-0 h-full w-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/40" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
            <p className="font-display text-sm uppercase tracking-widest text-brand-yellow">El proceso</p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] md:text-6xl lg:text-7xl">
              Así trabajamos<br /><span className="text-brand-yellow">contigo</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Un flujo claro y profesional desde la primera llamada hasta la entrega del equipo reparado.
            </p>
          </div>
        </section>

        <section className="py-20 md:py-28">
          <div className="mx-auto max-w-4xl space-y-6 px-4 md:px-6">
            {steps.map((s, i) => (
              <div key={s.title} className="grid grid-cols-[auto_1fr] items-start gap-5 rounded-2xl border border-border bg-card p-6 md:gap-8 md:p-8">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-brand-yellow text-brand-ink">
                  <s.icon className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className="font-display text-xs uppercase tracking-widest text-brand-blue">Paso 0{i + 1}</p>
                  <h2 className="mt-1 font-display text-2xl uppercase md:text-3xl">{s.title}</h2>
                  <p className="mt-2 text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="relative overflow-hidden bg-brand-ink py-16 text-white">
          <img src={foto6.url} alt="Cabina con scanner" className="absolute inset-0 h-full w-full object-cover opacity-20" />
          <div className="absolute inset-0 bg-brand-ink/75" />
          <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-6 px-4 text-center md:px-6">
            <h2 className="font-display text-4xl uppercase md:text-5xl">Listo para empezar</h2>
            <Link to="/contacto">
              <Button size="lg" className="bg-brand-yellow px-8 py-6 text-base font-semibold uppercase tracking-wide text-brand-ink hover:bg-brand-yellow/90">
                Agendar visita técnica
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