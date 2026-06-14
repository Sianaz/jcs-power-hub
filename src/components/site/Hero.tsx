import { Button } from "@/components/ui/button";
import { MessageCircle, Wrench } from "lucide-react";
import { CONTACT } from "./Footer";

export function Hero() {
  return (
    <section className="bg-hero-industrial relative overflow-hidden text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 md:grid-cols-2 md:items-center md:px-6 md:py-28">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-brand-yellow">
            <span className="h-2 w-2 rounded-full bg-brand-yellow" />
            Servicio técnico especializado
          </div>
          <h1 className="mt-4 font-display text-4xl font-bold uppercase leading-[0.95] tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Tu maquinaria <span className="text-brand-yellow">siempre</span> en marcha
          </h1>
          <p className="mt-6 max-w-xl text-lg text-white/80 md:text-xl">
            Reparamos equipos pesados y plantas eléctricas directamente donde los necesitas.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a href="#agendar">
              <Button size="lg" className="w-full bg-brand-blue px-6 py-6 text-base font-semibold uppercase hover:bg-brand-blue/90 sm:w-auto">
                <Wrench className="mr-2 h-5 w-5" />
                Solicitar visita técnica
              </Button>
            </a>
            <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener">
              <Button size="lg" className="w-full bg-whatsapp px-6 py-6 text-base font-semibold uppercase text-white hover:bg-whatsapp/90 sm:w-auto">
                <MessageCircle className="mr-2 h-5 w-5" />
                Escríbenos por WhatsApp
              </Button>
            </a>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 text-sm text-white/70">
            <div><span className="font-display text-2xl font-bold text-brand-yellow">+10</span> años de experiencia</div>
            <div><span className="font-display text-2xl font-bold text-brand-yellow">24/7</span> emergencias</div>
            <div><span className="font-display text-2xl font-bold text-brand-yellow">100%</span> a domicilio</div>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute inset-0 -rotate-3 rounded-3xl border-4 border-brand-yellow/30" />
          <div className="relative aspect-square overflow-hidden rounded-3xl border-4 border-brand-yellow bg-brand-ink-soft p-8">
            <div className="bg-diagonal-stripes absolute inset-x-0 top-0 h-3" />
            <div className="flex h-full flex-col items-center justify-center text-center">
              <Wrench className="h-24 w-24 text-brand-yellow" />
              <p className="mt-6 font-display text-3xl font-bold uppercase">Servicio en sitio</p>
              <p className="mt-2 text-white/70">Llegamos hasta tu equipo, sin importar dónde esté.</p>
            </div>
            <div className="bg-diagonal-stripes absolute inset-x-0 bottom-0 h-3" />
          </div>
        </div>
      </div>
    </section>
  );
}