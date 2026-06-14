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

type Equipo = Database["public"]["Tables"]["equipos"]["Row"] & { cliente?: { nombre: string } | null; tareas?: Tarea[] };
type Tarea = Database["public"]["Tables"]["tareas"]["Row"];
type Estado = Database["public"]["Enums"]["equipo_estado"];

export const Route = createFileRoute("/_authenticated/admin/equipos")({
  component: EquiposPage,
});

const semaforo: Record<Estado, { bg: string; label: string }> = {
  ok: { bg: "bg-emerald-500", label: "OK" },
  atencion: { bg: "bg-brand-yellow", label: "Revisión próxima" },
  urgente: { bg: "bg-destructive", label: "Urgente" },
};

function EquiposPage() {
  const qc = useQueryClient();

  const { data: equipos = [] } = useQuery({
    queryKey: ["equipos"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("equipos")
        .select("*, cliente:clientes(nombre), tareas(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Equipo[];
    },
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("id, nombre").order("nombre");
      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    const ch = supabase
      .channel("equipos-tareas")
      .on("postgres_changes", { event: "*", schema: "public", table: "equipos" }, () => qc.invalidateQueries({ queryKey: ["equipos"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "tareas" }, () => qc.invalidateQueries({ queryKey: ["equipos"] }))
      .on("postgres_changes", { event: "*", schema: "public", table: "clientes" }, () => qc.invalidateQueries({ queryKey: ["clientes"] }))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [qc]);

  return (
    <AdminShell title="Equipos y tareas">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground">{equipos.length} equipos registrados</p>
        <div className="flex gap-2">
          <NewClientDialog />
          <NewEquipoDialog clientes={clientes} />
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {equipos.map((eq) => (
          <EquipoCard key={eq.id} equipo={eq} />
        ))}
        {equipos.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center lg:col-span-2">
            <p className="font-display text-lg font-semibold">Aún no hay equipos registrados</p>
            <p className="mt-2 text-sm text-muted-foreground">Crea un cliente y agrega su primer equipo.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function EquipoCard({ equipo }: { equipo: Equipo }) {
  const qc = useQueryClient();
  const [nuevaTarea, setNuevaTarea] = useState("");
  const [notas, setNotas] = useState(equipo.notas ?? "");

  const sem = semaforo[equipo.estado];

  const updateEstado = useMutation({
    mutationFn: async (estado: Estado) => {
      const { error } = await supabase.from("equipos").update({ estado }).eq("id", equipo.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos"] }),
  });

  const saveNotas = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.from("equipos").update({ notas }).eq("id", equipo.id);
      if (error) throw error;
    },
    onSuccess: () => toast.success("Notas guardadas"),
  });

  const addTarea = useMutation({
    mutationFn: async () => {
      if (!nuevaTarea.trim()) return;
      const { error } = await supabase.from("tareas").insert({ equipo_id: equipo.id, descripcion: nuevaTarea.trim() });
      if (error) throw error;
    },
    onSuccess: () => { setNuevaTarea(""); qc.invalidateQueries({ queryKey: ["equipos"] }); },
  });

  const toggleTarea = useMutation({
    mutationFn: async (t: Tarea) => {
      const { error } = await supabase.from("tareas").update({ completada: !t.completada }).eq("id", t.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos"] }),
  });

  const delTarea = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("tareas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["equipos"] }),
  });

  return (
    <article className="rounded-2xl border border-border bg-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground">{equipo.cliente?.nombre ?? "Sin cliente"}</p>
          <h3 className="font-display text-lg font-bold uppercase">{equipo.nombre}</h3>
          {equipo.modelo && <p className="text-sm text-muted-foreground">Modelo: {equipo.modelo}</p>}
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

      <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground">
        <div><span className="font-medium text-foreground">Última revisión:</span> {equipo.ultima_revision ?? "—"}</div>
        <div><span className="font-medium text-foreground">Próxima:</span> {equipo.proxima_revision ?? "—"}</div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tareas pendientes</p>
        <ul className="mt-2 space-y-1.5">
          {(equipo.tareas ?? []).map((t) => (
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
        <Button size="sm" variant="outline" onClick={() => saveNotas.mutate()} className="mt-2">Guardar notas</Button>
      </div>
    </article>
  );
}

function NewClientDialog() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("clientes").insert({
      nombre: String(fd.get("nombre") ?? "").trim(),
      telefono: String(fd.get("telefono") ?? "").trim(),
      direccion: String(fd.get("direccion") ?? "").trim() || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Cliente creado");
    qc.invalidateQueries({ queryKey: ["clientes"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline"><Plus className="mr-1 h-4 w-4" /> Cliente</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo cliente</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div><Label>Nombre</Label><Input name="nombre" required /></div>
          <div><Label>Teléfono</Label><Input name="telefono" required /></div>
          <div><Label>Dirección</Label><Input name="direccion" /></div>
          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">Crear</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NewEquipoDialog({ clientes }: { clientes: { id: string; nombre: string }[] }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [clienteId, setClienteId] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!clienteId) return toast.error("Selecciona un cliente");
    const fd = new FormData(e.currentTarget);
    const { error } = await supabase.from("equipos").insert({
      cliente_id: clienteId,
      nombre: String(fd.get("nombre") ?? "").trim(),
      modelo: String(fd.get("modelo") ?? "").trim() || null,
      ultima_revision: String(fd.get("ultima") ?? "") || null,
      proxima_revision: String(fd.get("proxima") ?? "") || null,
    });
    if (error) return toast.error(error.message);
    toast.success("Equipo agregado");
    qc.invalidateQueries({ queryKey: ["equipos"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-brand-blue hover:bg-brand-blue/90"><Plus className="mr-1 h-4 w-4" /> Equipo</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Nuevo equipo</DialogTitle></DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Cliente</Label>
            <Select value={clienteId} onValueChange={setClienteId}>
              <SelectTrigger><SelectValue placeholder="Selecciona un cliente" /></SelectTrigger>
              <SelectContent>
                {clientes.map((c) => <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div><Label>Nombre / tipo</Label><Input name="nombre" required placeholder="Ej: Excavadora CAT 320" /></div>
          <div><Label>Modelo</Label><Input name="modelo" /></div>
          <div className="grid grid-cols-2 gap-2">
            <div><Label>Última revisión</Label><Input name="ultima" type="date" /></div>
            <div><Label>Próxima revisión</Label><Input name="proxima" type="date" /></div>
          </div>
          <Button type="submit" className="w-full bg-brand-blue hover:bg-brand-blue/90">Agregar</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}