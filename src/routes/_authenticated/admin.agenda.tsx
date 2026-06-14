import { useEffect } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { MessageCircle, MapPin, Phone, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Cita = Database["public"]["Tables"]["citas"]["Row"];
type CitaEstado = Database["public"]["Enums"]["cita_estado"];

export const Route = createFileRoute("/_authenticated/admin/agenda")({
  component: AgendaPage,
});

function estadoColor(e: CitaEstado) {
  switch (e) {
    case "pendiente": return "bg-brand-yellow text-brand-ink";
    case "confirmada": return "bg-brand-blue text-white";
    case "en_camino": return "bg-purple-500 text-white";
    case "completada": return "bg-emerald-500 text-white";
    case "cancelada": return "bg-destructive text-white";
  }
}

function estadoLabel(e: CitaEstado) {
  return { pendiente: "Pendiente", confirmada: "Confirmada", en_camino: "En camino", completada: "Completada", cancelada: "Cancelada" }[e];
}

function AgendaPage() {
  const qc = useQueryClient();
  const start = new Date(); start.setHours(0,0,0,0);
  const end = new Date(); end.setHours(23,59,59,999);

  const { data: citas = [], isLoading } = useQuery({
    queryKey: ["citas", "hoy"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .gte("fecha_hora", start.toISOString())
        .lte("fecha_hora", end.toISOString())
        .order("fecha_hora", { ascending: true });
      if (error) throw error;
      return data as Cita[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("citas-hoy")
      .on("postgres_changes", { event: "*", schema: "public", table: "citas" }, () => {
        qc.invalidateQueries({ queryKey: ["citas"] });
        qc.invalidateQueries({ queryKey: ["resumen"] });
      })
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  const updateEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: CitaEstado }) => {
      const { error } = await supabase.from("citas").update({ estado }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Estado actualizado"),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <AdminShell title="Agenda de hoy">
      {isLoading ? (
        <p className="text-muted-foreground">Cargando...</p>
      ) : citas.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <p className="font-display text-lg font-semibold">No hay citas para hoy</p>
          <p className="mt-2 text-sm text-muted-foreground">Las nuevas solicitudes aparecerán aquí automáticamente.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {citas.map((c) => {
            const wa = `https://wa.me/${c.telefono.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Hola ${c.nombre_cliente}, le escribo de Servicios Técnicos JC'S sobre su solicitud de servicio.`)}`;
            return (
              <article key={c.id} className="rounded-2xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-display text-lg font-bold uppercase">{c.nombre_cliente}</h3>
                      <Badge className={estadoColor(c.estado)}>{estadoLabel(c.estado)}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{c.tipo_equipo} · {c.tipo_servicio === "domicilio" ? "A domicilio" : "En taller"}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {new Date(c.fecha_hora).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>

                <p className="mt-3 text-sm">{c.problema}</p>

                <div className="mt-3 flex flex-wrap gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" />{c.telefono}</span>
                  {c.direccion && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{c.direccion}</span>}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Select value={c.estado} onValueChange={(v) => updateEstado.mutate({ id: c.id, estado: v as CitaEstado })}>
                    <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="confirmada">Confirmada</SelectItem>
                      <SelectItem value="en_camino">En camino</SelectItem>
                      <SelectItem value="completada">Completada</SelectItem>
                      <SelectItem value="cancelada">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <a href={wa} target="_blank" rel="noopener"
                     className="inline-flex items-center gap-2 rounded-md bg-whatsapp px-3 py-2 text-sm font-semibold text-white hover:opacity-90">
                    <MessageCircle className="h-4 w-4" /> WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}