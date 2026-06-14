import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { CalendarDays, CalendarRange, Wrench, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";

export const Route = createFileRoute("/_authenticated/admin/")({
  component: ResumenPage,
});

function startOfToday() { const d = new Date(); d.setHours(0,0,0,0); return d; }
function endOfToday() { const d = new Date(); d.setHours(23,59,59,999); return d; }
function endOfWeek() { const d = new Date(); d.setDate(d.getDate() + 7); d.setHours(23,59,59,999); return d; }

function StatCard({ label, value, icon: Icon, accent }: { label: string; value: number | string; icon: typeof CalendarDays; accent?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
          <p className="mt-2 font-display text-4xl font-bold">{value}</p>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent ?? "bg-brand-blue/10 text-brand-blue"}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function ResumenPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["resumen"],
    queryFn: async () => {
      const [hoyRes, semanaRes, pendRes, urgRes] = await Promise.all([
        supabase.from("citas").select("id", { count: "exact", head: true }).gte("fecha_hora", startOfToday().toISOString()).lte("fecha_hora", endOfToday().toISOString()),
        supabase.from("citas").select("id", { count: "exact", head: true }).gte("fecha_hora", startOfToday().toISOString()).lte("fecha_hora", endOfWeek().toISOString()),
        supabase.from("tareas").select("equipo_id", { count: "exact", head: true }).eq("completada", false),
        supabase.from("equipos").select("id", { count: "exact", head: true }).eq("estado", "urgente"),
      ]);
      return {
        hoy: hoyRes.count ?? 0,
        semana: semanaRes.count ?? 0,
        tareas: pendRes.count ?? 0,
        urgentes: urgRes.count ?? 0,
      };
    },
  });

  return (
    <AdminShell title="Resumen">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Citas hoy" value={isLoading ? "…" : data!.hoy} icon={CalendarDays} />
        <StatCard label="Citas esta semana" value={isLoading ? "…" : data!.semana} icon={CalendarRange} />
        <StatCard label="Tareas pendientes" value={isLoading ? "…" : data!.tareas} icon={Wrench} accent="bg-brand-yellow/15 text-brand-yellow" />
        <StatCard label="Equipos urgentes" value={isLoading ? "…" : data!.urgentes} icon={AlertTriangle} accent="bg-destructive/15 text-destructive" />
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6">
        <h2 className="font-display text-lg font-bold uppercase">Bienvenido al panel</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Usa el menú lateral para gestionar la agenda del día, los equipos de tus clientes y el calendario completo de citas.
          La información se actualiza en tiempo real cuando un cliente envía una nueva solicitud desde el sitio.
        </p>
      </div>
    </AdminShell>
  );
}