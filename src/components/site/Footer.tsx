import { Phone, MessageCircle, MapPin, Settings, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

export const CONTACT = {
  phone: "+507 6453-1898",
  phoneRaw: "+50764531898",
  whatsappUrl: "https://wa.me/50764531898?text=" + encodeURIComponent(
    "Hola Servicios Técnicos JC'S, necesito asistencia técnica para..."
  ),
  coverage: "Panamá y áreas cercanas",
};

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-white/5 bg-brand-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div className="md:col-span-1">
          <Logo className="h-20 w-20" />
          <p className="mt-4 max-w-xs text-sm text-white/65">
            Equipo pesado y generación eléctrica. Diagnóstico, reparación y programación donde los necesites.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-yellow">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 shrink-0 text-brand-yellow" />
              <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-brand-yellow">{CONTACT.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 shrink-0 text-brand-yellow" />
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener" className="hover:text-brand-yellow">WhatsApp directo</a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 text-brand-yellow" />
              <span className="text-white/75">{CONTACT.coverage}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-yellow">Horario</h3>
          <ul className="mt-4 space-y-3 text-sm text-white/75">
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-yellow" />
              <span>Lunes a sábado<br />8:00 a.m. – 6:00 p.m.</span>
            </li>
            <li className="text-xs text-white/55">Emergencias 24/7 vía WhatsApp.</li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm uppercase tracking-widest text-brand-yellow">Navegación</h3>
          <ul className="mt-4 space-y-2 text-sm text-white/75">
            <li><Link to="/" className="hover:text-brand-yellow">Inicio</Link></li>
            <li><Link to="/servicios" className="hover:text-brand-yellow">Servicios</Link></li>
            <li><Link to="/como-funciona" className="hover:text-brand-yellow">¿Cómo funciona?</Link></li>
            <li><Link to="/contacto" className="hover:text-brand-yellow">Contacto</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-2 px-4 py-4 text-xs text-white/45 md:px-6">
          <p>© {new Date().getFullYear()} JC&apos;S Servicios Técnicos.</p>
          <a href="/admin" aria-label="Panel interno" className="opacity-40 transition-opacity hover:opacity-100 hover:text-brand-yellow">
            <Settings className="h-4 w-4" />
          </a>
        </div>
      </div>
    </footer>
  );
}