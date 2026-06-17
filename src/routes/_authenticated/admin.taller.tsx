import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, CheckCircle2, Circle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Estado = Database["public"]["Enums"]["equipo_estado"];
type EquipoTaller = {
  id: string;
  nombre: string;
  modelo: string | null;
  serie: string | null;
  notas: string | null;
  estado: Estado;
  created_at: string;
  tareas_taller?: TareaTaller[];
};
type TareaTaller = { id: string; equipo_taller_id: string; descripcion: string; completada: boolean };

export const Route = createFileRoute("/_authenticated/admin/taller")({
  component: TallerPage,
});

const semaforo: Record<Estado, { bg: string; label: string }> = {
  ok: { bg: "bg-emerald-500", label: "OK" },
  atencion: { bg: "bg-brand-yellow", label: "Revisión próxima" },
  urgente: { bg: "bg-destructive", label: "Urgente" },
};

function TallerPage() {
  const qc = useQueryClient();

  const { data: equipos = [] } = useQuery({
    queryKey: ["equipos_taller"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("equipos_taller")
        .select("*, tareas_taller(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as EquipoTaller[];
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("equipos-taller")
      .on("postgres_changes", { event: "*", schema: "public", table: "equipos_taller" }, () => qc.invalidateQueries({ queryKey: ["equipos_taller"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "tareas_taller" }, () => qc.invalidateQueries({ queryKey: ["equipos_taller"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <AdminShell title="Equipos de taller">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{equipos.length} equipos en taller</p>
        <NewEquipoTallerDialog />
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {equipos.map((eq) => (
          <EquipoTallerCard key={eq.id} equipo={eq} />
        ))}
        {equipos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center lg:col-span-2">
            <p className="font-display text-lg font-semibold">Aún no hay equipos de taller</p>
            <p className="mt-2 text-sm text-muted-foreground">Registra tu primer equipo del taller.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function EquipoTallerCard({ equipo }: { equipo: EquipoTaller }) {
  const qc = useQueryClient();
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [notas, setNotas] = useState(equipo.notas ?? "");
  const sem = semaforo[equipo.estado];

  const updateEstado = useMutation({
    mutationFn: async (estado: Estado) => {
      const { error } = await (supabase as any).from("equipos_taller").update({ estado }).eq("id", equipo.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos_taller"] }),
  });

  const saveNotas = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("equipos_taller").update({ notas }).eq("id", equipo.id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Notas guardadas"),
  });

  const delEquipo = useMutation({
    mutationFn: async () => {
      const { error } = await (supabase as any).from("equipos_taller").delete().eq("id", equipo.id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Equipo eliminado"); qc.invalidateQueries({ queryKey: ["equipos_taller"] }); },
  });

  const addTarea = useMutation({
    mutationFn: async () => {
      if (!nuevaTarea.trim()) return;
      const { error } = await (supabase as any).from("tareas_taller").insert({ equipo_taller_id: equipo.id, descripcion: nuevaTarea.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setNuevaTarea(""); qc.invalidateQueries({ queryKey: ["equipos_taller"] }); },
  });

  const toggleTarea = useMutation({
    mutationFn: async (t: TareaTaller) => {
      const { error } = await (supabase as any).from("tareas_taller").update({ completada: !t.completada }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos_taller"] }),
  });

  const delTarea = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await (supabase as any).from("tareas_taller").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos_taller"] }),
  });

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-bold uppercase">{equipo.nombre}</h3>
          {equipo.modelo && <p className="text-sm text-muted-foreground">Modelo: {equipo.modelo}</p>}
          {equipo.serie && <p className="text-sm text-muted-foreground">Serie: {equipo.serie}</p>}
        </div>
        <div className="flex items-center gap-2">
          <span className={`h-3 w-3 rounded-full ${sem.bg}`} />
          <Select value={equipo.estado} onValueChange={(v) => updateEstado.mutate(v as Estado)}>
            <SelectTrigger className="w-40 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="ok">OK</SelectItem>
              <SelectItem value="atencion">Revisión próxima</SelectItem>
              <SelectItem value="urgente">Urgente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tareas pendientes</p>
        <ul className="mt-2 space-y-1.5">
          {(equipo.tareas_taller ?? []).map((t) => (
            <li key={t.id} className="flex items-center gap-2 text-sm">
              <button onClick={() => toggleTarea.mutate(t)} className="text-brand-blue">
                {t.completada ? <CheckCircle2 className="h-4 w-4" /> : <Circle className="h-4 w-4" />}
              </button>
              <span className={t.completada ? "flex-1 line-through text-muted-foreground" : "flex-1"}>{t.descripcion}</span>
              <button onClick={() => delTarea.mutate(t.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-2 flex gap-2">
          <Input value={nuevaTarea} onChange={(e) => setNuevaTarea(e.target.value)} placeholder="Nueva tarea..." />
          <Button size="sm" onClick={() => addTarea.mutate()}><Plus className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="mt-4">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground">Notas</Label>
        <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} className="mt-1" />
        <div className="mt-2 flex justify-between gap-2">
          <Button size="sm" variant="outline" onClick={() => saveNotas.mutate()}>Guardar notas</Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => { if (confirm("¿Eliminar este equipo del taller?")) delEquipo.mutate(); }}
          >
            <Trash2 className="mr-1 h-4 w-4" /> Eliminar equipo
          </Button>
        </div>
      </div>
    </article>
  );
}

function NewEquipoTallerDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await (supabase as any).from("equipos_taller").insert({
      nombre: String(fd.get("nombre") ?? "").trim(),
      modelo: String(fd.get("modelo") ?? "").trim() || null,
      serie: String(fd.get("serie") ?? "").trim() || null,
      notas: String(fd.get("notas") ?? "").trim() || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Equipo agregado al taller");
    qc.invalidateQueries({ queryKey: ["equipos_taller"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue hover:bg-brand-blue/90"><Plus className="mr-1 h-4 w-4" /> Equipo de taller</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo equipo de taller</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><Label>Nombre / tipo</Label><Input name="nombre" required placeholder="Ej: Generador 5kW" /></div>
          <div><Label>Modelo</Label><Input name="modelo" /></div>
          <div><Label>Serie</Label><Input name="serie" /></div>
          <div><Label>Notas</Label><Textarea name="notas" rows={2} /></div>
          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">Agregar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
