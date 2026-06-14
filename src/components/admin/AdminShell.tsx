import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import { LayoutDashboard, CalendarDays, Wrench, CalendarRange, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";

const nav = [
  { to: "/admin", label: "Resumen", icon: LayoutDashboard, exact: true },
  { to: "/admin/agenda", label: "Agenda de hoy", icon: CalendarDays },
  { to: "/admin/equipos", label: "Equipos y tareas", icon: Wrench },
  { to: "/admin/calendario", label: "Calendario", icon: CalendarRange },
] as const;

export function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function signOut() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  function isActive(to: string, exact?: boolean) {
    return exact ? path === to : path === to || path.startsWith(to + "/");
  }

  return (
    <div className="flex min-h-screen bg-secondary">
      {/* Sidebar desktop */}
      <aside className="hidden w-64 flex-col border-r border-border bg-brand-ink text-white md:flex">
        <div className="flex items-center gap-2 border-b border-white/10 px-5 py-4">
          <Logo className="h-10 w-10" />
          <div>
            <p className="font-display text-sm font-bold uppercase">JC&apos;S</p>
            <p className="text-[10px] uppercase tracking-widest text-white/60">Panel interno</p>
          </div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive(n.to, n.exact)
                  ? "bg-brand-yellow text-brand-ink"
                  : "text-white/80 hover:bg-white/5"
              }`}
            >
              <n.icon className="h-4 w-4" />
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Button onClick={signOut} variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/5 hover:text-white">
            <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-border bg-background px-4 py-3 md:px-6">
          <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Menú">
            <Menu className="h-6 w-6" />
          </button>
          <h1 className="font-display text-xl font-bold uppercase tracking-tight">{title}</h1>
          <div className="w-6 md:hidden" />
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 flex h-full w-72 flex-col bg-brand-ink text-white">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-4">
              <div className="flex items-center gap-2">
                <Logo className="h-10 w-10" />
                <p className="font-display font-bold uppercase">JC&apos;S</p>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Cerrar"><X className="h-6 w-6" /></button>
            </div>
            <nav className="flex-1 space-y-1 p-3">
              {nav.map((n) => (
                <Link
                  key={n.to}
                  to={n.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-base font-medium transition-colors ${
                    isActive(n.to, n.exact) ? "bg-brand-yellow text-brand-ink" : "text-white/80 hover:bg-white/5"
                  }`}
                >
                  <n.icon className="h-5 w-5" />
                  {n.label}
                </Link>
              ))}
            </nav>
            <div className="border-t border-white/10 p-3">
              <Button onClick={signOut} variant="ghost" className="w-full justify-start text-white/80 hover:bg-white/5 hover:text-white">
                <LogOut className="mr-2 h-4 w-4" /> Cerrar sesión
              </Button>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}