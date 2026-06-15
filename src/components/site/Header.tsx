import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";

const links = [
  { label: "Inicio", to: "/" as const },
  { label: "Servicios", to: "/servicios" as const },
  { label: "¿Cómo funciona?", to: "/como-funciona" as const },
  { label: "Contacto", to: "/contacto" as const },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-brand-ink/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center" aria-label="JC'S Servicios Técnicos">
          <Logo className="h-14 w-14 md:h-16 md:w-16" />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.label}
              to={l.to}
              activeOptions={{ exact: true }}
              activeProps={{ className: "text-brand-yellow" }}
              className="rounded-md px-4 py-2 text-sm font-semibold uppercase tracking-wide text-white/80 transition-colors hover:text-brand-yellow"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Menú"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-white md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-white/10 bg-brand-ink md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <Link
                key={l.label}
                to={l.to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 text-base font-semibold uppercase tracking-wide text-white hover:bg-white/5 hover:text-brand-yellow"
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}