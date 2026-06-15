import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/site/Header";
import { Footer, CONTACT } from "@/components/site/Footer";
import { WhatsAppFloat } from "@/components/site/WhatsAppFloat";
import { RequestForm } from "@/components/site/RequestForm";
import { Phone, MessageCircle, MapPin, Clock } from "lucide-react";
import foto7 from "@/assets/jcs_foto_7.jpeg.asset.json";

export const Route = createFileRoute("/contacto")({
  head: () => ({
    meta: [
      { title: "Contacto — JC'S Servicios Técnicos" },
      { name: "description", content: "Llámanos, escríbenos por WhatsApp o agenda tu visita técnica en línea. Cobertura en Panamá." },
      { property: "og:title", content: "Contacto — JC'S" },
      { property: "og:description", content: "Solicita servicio técnico para tu equipo pesado o planta eléctrica." },
    ],
  }),
  component: ContactoPage,
});

function ContactoPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <section className="relative overflow-hidden bg-brand-ink text-white">
          <img src={foto7.url} alt="Bulldozer en obra" className="absolute inset-0 h-full w-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-ink via-brand-ink/85 to-brand-ink/40" />
          <div className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 md:py-28">
            <p className="font-display text-sm uppercase tracking-widest text-brand-yellow">Contacto</p>
            <h1 className="mt-2 font-display text-5xl uppercase leading-[0.95] md:text-6xl lg:text-7xl">
              Hablemos<br /><span className="text-brand-yellow">de tu equipo</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/80">
              Respondemos en menos de 2 horas en horario laboral. Para emergencias, escríbenos directamente por WhatsApp.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-6 px-4 md:grid-cols-4 md:px-6">
            <a href={`tel:${CONTACT.phoneRaw}`} className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-brand-yellow hover:shadow-lg">
              <Phone className="h-6 w-6 text-brand-blue" />
              <h3 className="mt-4 font-display text-sm uppercase tracking-wider text-muted-foreground">Teléfono</h3>
              <p className="mt-1 font-display text-xl">{CONTACT.phone}</p>
            </a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener" className="rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:border-whatsapp hover:shadow-lg">
              <MessageCircle className="h-6 w-6 text-whatsapp" />
              <h3 className="mt-4 font-display text-sm uppercase tracking-wider text-muted-foreground">WhatsApp</h3>
              <p className="mt-1 font-display text-xl">Chatea ahora</p>
            </a>
            <div className="rounded-2xl border border-border bg-card p-6">
              <MapPin className="h-6 w-6 text-brand-blue" />
              <h3 className="mt-4 font-display text-sm uppercase tracking-wider text-muted-foreground">Cobertura</h3>
              <p className="mt-1 font-display text-xl">{CONTACT.coverage}</p>
            </div>
            <div className="rounded-2xl border border-border bg-card p-6">
              <Clock className="h-6 w-6 text-brand-blue" />
              <h3 className="mt-4 font-display text-sm uppercase tracking-wider text-muted-foreground">Horario</h3>
              <p className="mt-1 font-display text-xl">Lun–Sáb · 8a–6p</p>
            </div>
          </div>
        </section>

        <RequestForm />
      </main>
      <Footer />
      <WhatsAppFloat />
    </div>
  );
}