import { useEffect, useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Database } from "@/integrations/supabase/types";

type Cita = Database["public"]["Tables"]["citas"]["Row"];
type CitaEstado = Database["public"]["Enums"]["cita_estado"];

export const Route = createFileRoute("/_authenticated/admin/calendario")({
  component: CalendarioPage,
});

const estadoColor: Record<CitaEstado, string> = {
  pendiente: "bg-brand-yellow",
  confirmada: "bg-brand-blue",
  en_camino: "bg-purple-500",
  completada: "bg-emerald-500",
  cancelada: "bg-destructive",
};

function startOfWeek(d: Date) { const x = new Date(d); const day = x.getDay(); const diff = (day + 6) % 7; x.setDate(x.getDate() - diff); x.setHours(0,0,0,0); return x; }
function addDays(d: Date, n: number) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }
function startOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth(), 1); }
function endOfMonth(d: Date) { return new Date(d.getFullYear(), d.getMonth()+1, 0, 23,59,59,999); }

function CalendarioPage() {
  const qc = useQueryClient();
  const [view, setView] = useState<"semana" | "mes">("semana");
  const [cursor, setCursor] = useState(new Date());

  const range = useMemo(() => {
    if (view === "semana") {
      const s = startOfWeek(cursor); const e = addDays(s, 6); e.setHours(23,59,59,999);
      return { start: s, end: e };
    }
    return { start: startOfMonth(cursor), end: endOfMonth(cursor) };
  }, [cursor, view]);

  const { data: citas = [] } = useQuery({
    queryKey: ["citas", "rango", range.start.toISOString(), range.end.toISOString()],
    queryFn: async () => {
      const { data, error } = await supabase.from("citas").select("*")
        .gte("fecha_hora", range.start.toISOString())
        .lte("fecha_hora", range.end.toISOString())
        .neq("estado", "cancelada")
        .order("fecha_hora");
      if (error) throw error;
      return data as Cita[];
    },
  });

  useEffect(() => {
    const ch = supabase.channel("cal-citas")
      .on("postgres_changes", { event: "*", schema: "public", table: "citas" }, () => qc.invalidateQueries({ queryKey: ["citas"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  function nav(dir: -1 | 1) {
    const x = new Date(cursor);
    if (view === "semana") x.setDate(x.getDate() + dir * 7);
    else x.setMonth(x.getMonth() + dir);
    setCursor(x);
  }

  const byDay = useMemo(() => {
    const map = new Map<string, Cita[]>();
    for (const c of citas) {
      const key = new Date(c.fecha_hora).toDateString();
      const arr = map.get(key) ?? [];
      arr.push(c);
      map.set(key, arr);
    }
    return map;
  }, [citas]);

  return (
    <AdminShell title="Calendario">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Tabs value={view} onValueChange={(v) => setView(v as "semana" | "mes")}>
          <TabsList>
            <TabsTrigger value="semana">Semana</TabsTrigger>
            <TabsTrigger value="mes">Mes</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => nav(-1)}><ChevronLeft className="h-4 w-4" /></Button>
          <span className="min-w-44 text-center font-display font-semibold uppercase">
            {view === "semana"
              ? `${range.start.toLocaleDateString()} – ${range.end.toLocaleDateString()}`
              : cursor.toLocaleDateString([], { month: "long", year: "numeric" })}
          </span>
          <Button variant="outline" size="icon" onClick={() => nav(1)}><ChevronRight className="h-4 w-4" /></Button>
          <Button variant="outline" size="sm" onClick={() => setCursor(new Date())}>Hoy</Button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 text-xs text-muted-foreground">
        {(["pendiente","confirmada","en_camino","completada","cancelada"] as CitaEstado[]).map(e => (
          <span key={e} className="inline-flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${estadoColor[e]}`} />{e.replace("_"," ")}
          </span>
        ))}
      </div>

      {view === "semana" ? (
        <div className="mt-4 grid gap-2 md:grid-cols-7">
          {Array.from({ length: 7 }).map((_, i) => {
            const day = addDays(range.start, i);
            const list = byDay.get(day.toDateString()) ?? [];
            const isToday = day.toDateString() === new Date().toDateString();
            return (
              <div key={i} className={`min-h-40 rounded-xl border bg-card p-2 ${isToday ? "border-brand-blue ring-2 ring-brand-blue/30" : "border-border"}`}>
                <p className="text-xs font-semibold uppercase text-muted-foreground">
                  {day.toLocaleDateString([], { weekday: "short" })} {day.getDate()}
                </p>
                <div className="mt-2 space-y-1.5">
                  {list.map(c => (
                    <div key={c.id} className="rounded-md border border-border bg-secondary p-2 text-xs">
                      <div className="flex items-center gap-1.5">
                        <span className={`h-2 w-2 rounded-full ${estadoColor[c.estado]}`} />
                        <span className="font-semibold">{new Date(c.fecha_hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      </div>
                      <p className="truncate">{c.nombre_cliente}</p>
                      <p className="truncate text-muted-foreground">{c.tipo_equipo}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <MonthGrid cursor={cursor} byDay={byDay} />
      )}
    </AdminShell>
  );
}

function MonthGrid({ cursor, byDay }: { cursor: Date; byDay: Map<string, Cita[]> }) {
  const first = startOfMonth(cursor);
  const gridStart = startOfWeek(first);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  return (
    <div className="mt-4 grid grid-cols-7 gap-1">
      {["L","M","X","J","V","S","D"].map(d => <div key={d} className="px-2 py-1 text-xs font-semibold uppercase text-muted-foreground">{d}</div>)}
      {cells.map((d, i) => {
        const inMonth = d.getMonth() === cursor.getMonth();
        const list = byDay.get(d.toDateString()) ?? [];
        const isToday = d.toDateString() === new Date().toDateString();
        return (
          <div key={i} className={`min-h-24 rounded-lg border p-1.5 text-xs ${inMonth ? "bg-card" : "bg-secondary/40"} ${isToday ? "border-brand-blue ring-1 ring-brand-blue/30" : "border-border"}`}>
            <p className={`mb-1 font-semibold ${inMonth ? "" : "text-muted-foreground"}`}>{d.getDate()}</p>
            <div className="space-y-0.5">
              {list.slice(0,3).map(c => (
                <div key={c.id} className={`truncate rounded px-1 py-0.5 text-[10px] text-white ${estadoColor[c.estado]}`}>
                  {new Date(c.fecha_hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} {c.nombre_cliente}
                </div>
              ))}
              {list.length > 3 && <p className="text-[10px] text-muted-foreground">+{list.length - 3} más</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}