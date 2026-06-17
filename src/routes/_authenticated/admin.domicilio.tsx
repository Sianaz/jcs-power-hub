import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Trash2, MapPin, Phone, Clock, CalendarDays, Pencil, MessageCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Cita = Database["public"]["Tables"]["citas"]["Row"];
type Cliente = Database["public"]["Tables"]["clientes"]["Row"];
type Estado = Database["public"]["Enums"]["cita_estado"];

export const Route = createFileRoute("/_authenticated/admin/domicilio")({
  component: DomicilioPage,
});

const estadoStyle: Record<Estado, string> = {
  pendiente: "bg-brand-yellow text-brand-ink",
  confirmada: "bg-brand-blue text-white",
  en_camino: "bg-purple-500 text-white",
  completada: "bg-emerald-500 text-white",
  cancelada: "bg-destructive text-white",
};
const estadoLabel: Record<Estado, string> = {
  pendiente: "Pendiente",
  confirmada: "Confirmada",
  en_camino: "En camino",
  completada: "Completada",
  cancelada: "Cancelada",
};

function fmtFecha(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString("es-PA", {
    weekday: "short", day: "2-digit", month: "short",
    hour: "2-digit", minute: "2-digit",
  });
}

function DomicilioPage() {
  const qc = useQueryClient();
  const [filtro, setFiltro] = useState<"proximas" | "todas" | "completadas">("proximas");

  const { data: citas = [], isLoading } = useQuery({
    queryKey: ["citas", "domicilio"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("citas")
        .select("*")
        .eq("tipo_servicio", "domicilio")
        .order("fecha_hora", { ascending: true });
      if (error) throw error;
      return data as Cita[];
    },
  });

  const ahora = Date.now();
  const filtradas = useMemo(() => {
    if (filtro === "proximas") {
      return citas.filter((c) => new Date(c.fecha_hora).getTime() >= ahora - 60 * 60 * 1000 && c.estado !== "completada" && c.estado !== "cancelada");
    }
    if (filtro === "completadas") {
      return citas.filter((c) => c.estado === "completada" || c.estado === "cancelada").reverse();
    }
    return citas;
  }, [citas, filtro, ahora]);

  const updateEstado = useMutation({
    mutationFn: async ({ id, estado }: { id: string; estado: Estado }) => {
      const { error } = await supabase.from("citas").update({ estado }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["citas"] }),
  });

  const delCita = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("citas").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { toast.success("Cita eliminada"); qc.invalidateQueries({ queryKey: ["citas"] }); },
  });

  return (
    <AdminShell title="Equipos a domicilio">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {(["proximas", "todas", "completadas"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${
                filtro === f ? "bg-brand-ink text-white" : "border border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "proximas" ? "Próximas" : f === "todas" ? "Todas" : "Historial"}
            </button>
          ))}
        </div>
        <CitaDialog mode="create" />
      </div>

      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
        {isLoading ? "Cargando..." : `${filtradas.length} cita${filtradas.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {filtradas.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-blue">
                  <Clock className="h-3.5 w-3.5" /> {fmtFecha(c.fecha_hora)}
                </p>
                <h3 className="mt-1 font-display text-base font-bold uppercase">{c.nombre_cliente}</h3>
                <p className="text-sm">{c.tipo_equipo}</p>
              </div>
              <Badge className={estadoStyle[c.estado]}>{estadoLabel[c.estado]}</Badge>
            </div>

            <div className="mt-3 space-y-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5"><Phone className="h-3 w-3" /> {c.telefono}</p>
              {c.direccion && (
                <p className="flex items-start gap-1.5"><MapPin className="mt-0.5 h-3 w-3 shrink-0" /> {c.direccion}</p>
              )}
              <p className="pt-1"><span className="font-medium text-foreground">Problema:</span> {c.problema}</p>
              {c.notas && <p><span className="font-medium text-foreground">Notas:</span> {c.notas}</p>}
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Select value={c.estado} onValueChange={(v) => updateEstado.mutate({ id: c.id, estado: v as Estado })}>
                <SelectTrigger className="h-8 w-40 text-xs"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(estadoLabel) as Estado[]).map((e) => (
                    <SelectItem key={e} value={e}>{estadoLabel[e]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <a
                href={`https://wa.me/${c.telefono.replace(/\D/g, "")}`}
                target="_blank" rel="noreferrer"
                className="inline-flex h-8 items-center gap-1 rounded-md border border-border px-2.5 text-xs hover:bg-secondary"
              >
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </a>
              <div className="ml-auto flex items-center gap-1">
                <CitaDialog mode="edit" cita={c} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar esta cita?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. La cita de {c.nombre_cliente} se eliminará permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => delCita.mutate(c.id)}
                      >
                        Sí, eliminar
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </article>
        ))}
        {!isLoading && filtradas.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center lg:col-span-2">
            <CalendarDays className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-2 text-sm text-muted-foreground">No hay citas en esta vista.</p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function toLocalInput(iso?: string) {
  if (!iso) return "";
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function CitaDialog({ mode, cita }: { mode: "create" | "edit"; cita?: Cita }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("*").order("nombre");
      if (error) throw error;
      return data as Cliente[];
    },
    enabled: open,
  });

  const [clienteId, setClienteId] = useState<string>(cita?.cliente_id ?? "");
  const [nombre, setNombre] = useState(cita?.nombre_cliente ?? "");
  const [telefono, setTelefono] = useState(cita?.telefono ?? "");
  const [direccion, setDireccion] = useState(cita?.direccion ?? "");
  const [tipoEquipo, setTipoEquipo] = useState(cita?.tipo_equipo ?? "");
  const [problema, setProblema] = useState(cita?.problema ?? "");
  const [notas, setNotas] = useState(cita?.notas ?? "");
  const [fechaHora, setFechaHora] = useState(toLocalInput(cita?.fecha_hora));

  function reset() {
    setClienteId(cita?.cliente_id ?? "");
    setNombre(cita?.nombre_cliente ?? "");
    setTelefono(cita?.telefono ?? "");
    setDireccion(cita?.direccion ?? "");
    setTipoEquipo(cita?.tipo_equipo ?? "");
    setProblema(cita?.problema ?? "");
    setNotas(cita?.notas ?? "");
    setFechaHora(toLocalInput(cita?.fecha_hora));
  }

  function pickCliente(id: string) {
    setClienteId(id);
    const c = clientes.find((x) => x.id === id);
    if (c) {
      setNombre(c.nombre);
      setTelefono(c.telefono);
      if (c.direccion) setDireccion(c.direccion);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim() || !telefono.trim() || !tipoEquipo.trim() || !problema.trim() || !fechaHora) {
      toast.error("Completa los campos obligatorios");
      return;
    }
    const payload = {
      cliente_id: clienteId || null,
      nombre_cliente: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim() || null,
      tipo_equipo: tipoEquipo.trim(),
      problema: problema.trim(),
      notas: notas.trim() || null,
      fecha_hora: new Date(fechaHora).toISOString(),
      tipo_servicio: "domicilio" as const,
    };
    if (mode === "create") {
      const { error } = await supabase.from("citas").insert({ ...payload, estado: "pendiente" });
      if (error) return toast.error(error.message);
      toast.success("Cita creada");
    } else if (cita) {
      const { error } = await supabase.from("citas").update(payload).eq("id", cita.id);
      if (error) return toast.error(error.message);
      toast.success("Cita actualizada");
    }
    qc.invalidateQueries({ queryKey: ["citas"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) reset(); }}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="mr-1 h-4 w-4" /> Nueva cita
          </Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nueva cita a domicilio" : "Editar cita"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Cliente registrado (opcional)</Label>
            <Select value={clienteId || "__none__"} onValueChange={(v) => pickCliente(v === "__none__" ? "" : v)}>
              <SelectTrigger><SelectValue placeholder="Selecciona un cliente o escribe abajo" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Sin asociar —</SelectItem>
                {clientes.map((c) => (
                  <SelectItem key={c.id} value={c.id}>{c.nombre} · {c.telefono}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Nombre del cliente *</Label>
              <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
            </div>
            <div>
              <Label>Teléfono *</Label>
              <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Dirección / ubicación</Label>
            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} placeholder="Calle, barrio, referencias..." />
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label>Tipo / modelo de equipo *</Label>
              <Input value={tipoEquipo} onChange={(e) => setTipoEquipo(e.target.value)} placeholder="Ej: Aire acondicionado 18k BTU" required />
            </div>
            <div>
              <Label>Fecha y hora *</Label>
              <Input type="datetime-local" value={fechaHora} onChange={(e) => setFechaHora(e.target.value)} required />
            </div>
          </div>
          <div>
            <Label>Problema / motivo *</Label>
            <Textarea value={problema} onChange={(e) => setProblema(e.target.value)} rows={2} required />
          </div>
          <div>
            <Label>Notas internas</Label>
            <Textarea value={notas} onChange={(e) => setNotas(e.target.value)} rows={2} placeholder="Repuestos a llevar, indicaciones, etc." />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
              {mode === "create" ? "Crear cita" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}