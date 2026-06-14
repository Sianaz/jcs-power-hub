import { Phone, MessageCircle, MapPin } from "lucide-react";
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
    <footer id="contacto" className="border-t border-border bg-brand-ink text-white">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-3 md:px-6">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-14 w-14" />
            <div>
              <p className="font-display text-lg font-bold uppercase">Servicios Técnicos JC&apos;S</p>
              <p className="text-xs uppercase tracking-widest text-white/60">Equipo Pesado · Generación Eléctrica</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-white/70">
            Reparamos equipos pesados y plantas eléctricas directamente donde los necesitas.
          </p>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-yellow">Contacto</h3>
          <ul className="mt-4 space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-brand-yellow" />
              <a href={`tel:${CONTACT.phoneRaw}`} className="hover:text-brand-yellow">{CONTACT.phone}</a>
            </li>
            <li className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-brand-yellow" />
              <a href={CONTACT.whatsappUrl} target="_blank" rel="noopener" className="hover:text-brand-yellow">
                WhatsApp directo
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-brand-yellow" />
              <span>{CONTACT.coverage}</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-brand-yellow">Horario</h3>
          <p className="mt-4 text-sm text-white/70">Lunes a sábado · 7:00 a.m. – 6:00 p.m.</p>
          <p className="mt-2 text-sm text-white/70">Emergencias 24/7 vía WhatsApp.</p>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-white/50 md:flex-row md:px-6">
          <p>© {new Date().getFullYear()} Servicios Técnicos JC&apos;S. Todos los derechos reservados.</p>
          <a href="/admin" className="hover:text-brand-yellow">Acceso interno</a>
        </div>
      </div>
    </footer>
  );
}