import { Button } from "@/components/ui/button";
import { MessageCircle, Wrench, ChevronDown } from "lucide-react";
import { CONTACT } from "./Footer";
import heroBg from "@/assets/jcs_foto_1.jpeg.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden text-white">
      {/* Background photo */}
      <div className="absolute inset-0">
        <img
          src={heroBg.url}
          alt="Equipos pesados en el patio de Servicios Técnicos JC'S"
          className="h-full w-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-brand-ink/95 via-brand-ink/80 to-brand-ink/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-ink via-transparent to-transparent" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 py-24 md:px-6 md:py-36 lg:py-44">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/50 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-yellow">
            <span className="h-2 w-2 rounded-full bg-brand-yellow" />
            Servicio técnico especializado
          </div>
          <h1 className="mt-5 font-display text-5xl uppercase leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
            Tu maquinaria <span className="text-brand-yellow">siempre</span><br />en marcha
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/85 md:text-xl">
            Reparación, diagnóstico y programación para equipo pesado y plantas eléctricas — directamente donde los necesitas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="/contacto">
              <Button size="lg" className="w-full bg-brand-yellow px-7 py-6 text-base font-semibold uppercase tracking-wide text-brand-ink hover:bg-brand-yellow/90 sm:w-auto">
                <Wrench className="mr-2 h-5 w-5" />
                Solicitar visita técnica
              </Button>
            </a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener">
              <Button size="lg" className="w-full bg-whatsapp px-7 py-6 text-base font-semibold uppercase tracking-wide text-white hover:bg-whatsapp/90 sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                WhatsApp directo
              </Button>
            </a>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-4 border-t border-white/15 pt-6 text-sm text-white/75">
            <div><div className="font-display text-3xl text-brand-yellow md:text-4xl">+10</div>años de experiencia</div>
            <div><div className="font-display text-3xl text-brand-yellow md:text-4xl">24/7</div>emergencias</div>
            <div><div className="font-display text-3xl text-brand-yellow md:text-4xl">100%</div>a domicilio</div>
          </div>
        </div>

        <a href="#servicios" aria-label="Ver servicios" className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 animate-bounce text-white/60 hover:text-brand-yellow md:block">
          <ChevronDown className="h-8 w-8" />
        </a>
      </div>
    </section>
  );
}