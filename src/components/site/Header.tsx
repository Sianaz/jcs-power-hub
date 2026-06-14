import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, X } from "lucide-react";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

const links = [
  { label: "Inicio", to: "/", hash: undefined as string | undefined },
  { label: "Servicios", to: "/", hash: "servicios" },
  { label: "¿Cómo funciona?", to: "/", hash: "como-funciona" },
  { label: "Contacto", to: "/", hash: "contacto" },
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link to="/" className="flex items-center gap-3">
          <Logo className="h-12 w-12 md:h-14 md:w-14" />
          <div className="hidden flex-col leading-tight sm:flex">
            <span className="font-display text-base font-bold uppercase tracking-wide text-foreground">
              Servicios Técnicos JC&apos;S
            </span>
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
              Equipo Pesado · Generación Eléctrica
            </span>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.hash ? `#${l.hash}` : "/"}
              className="rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
          <a href="#agendar" className="ml-2">
            <Button className="bg-brand-yellow text-brand-ink hover:bg-brand-yellow/90 font-semibold uppercase tracking-wide">
              Agendar visita
            </Button>
          </a>
        </nav>

        <button
          aria-label="Menú"
          onClick={() => setOpen((o) => !o)}
          className="rounded-md p-2 text-foreground md:hidden"
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-background md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.hash ? `#${l.hash}` : "/"}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-secondary"
              >
                {l.label}
              </a>
            ))}
            <a href="#agendar" onClick={() => setOpen(false)}>
              <Button className="mt-2 w-full bg-brand-yellow text-brand-ink hover:bg-brand-yellow/90 font-semibold uppercase">
                Agendar visita
              </Button>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}