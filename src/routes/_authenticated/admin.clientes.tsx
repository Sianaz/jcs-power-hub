import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { Plus, Search, Pencil, Trash2, Phone, MapPin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminShell } from "@/components/admin/AdminShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Cliente = Database["public"]["Tables"]["clientes"]["Row"];

export const Route = createFileRoute("/_authenticated/admin/clientes")({
  component: ClientesPage,
});

function ClientesPage() {
  const qc = useQueryClient();
  const [q, setQ] = useState("");

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("clientes").select("*").order("nombre");
      if (error) throw error;
      return data as Cliente[];
    },
  });

  const term = q.trim().toLowerCase();
  const filtrados = useMemo(() => {
    if (!term) return clientes;
    return clientes.filter((c) =>
      [c.nombre, c.telefono ?? "", c.direccion ?? ""].some((v) => v.toLowerCase().includes(term))
    );
  }, [clientes, term]);

  const delCliente = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("clientes").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Cliente eliminado");
      qc.invalidateQueries({ queryKey: ["clientes"] });
    },
    onError: (e: any) => toast.error(e.message ?? "No se pudo eliminar"),
  });

  return (
    <AdminShell title="Clientes">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar por nombre, teléfono o dirección..."
            className="pl-9"
          />
        </div>
        <ClienteDialog mode="create" />
      </div>

      <p className="mt-4 text-xs uppercase tracking-widest text-muted-foreground">
        {isLoading ? "Cargando..." : `${filtrados.length} cliente${filtrados.length === 1 ? "" : "s"}`}
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filtrados.map((c) => (
          <article key={c.id} className="rounded-2xl border border-border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="font-display text-base font-bold uppercase truncate">{c.nombre}</h3>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Phone className="h-3 w-3" /> {c.telefono}
                </p>
                {c.direccion && (
                  <p className="mt-1 flex items-start gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="mt-0.5 h-3 w-3 shrink-0" />
                    <span className="line-clamp-2">{c.direccion}</span>
                  </p>
                )}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <ClienteDialog mode="edit" cliente={c} />
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Eliminar a {c.nombre}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Esta acción no se puede deshacer. Se eliminará el cliente y sus equipos y citas asociados.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => delCliente.mutate(c.id)}
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
        {!isLoading && filtrados.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-card p-10 text-center sm:col-span-2 lg:col-span-3">
            <p className="text-sm text-muted-foreground">
              {term ? "Sin resultados para tu búsqueda." : "Aún no hay clientes registrados."}
            </p>
          </div>
        )}
      </div>
    </AdminShell>
  );
}

function ClienteDialog({ mode, cliente }: { mode: "create" | "edit"; cliente?: Cliente }) {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [telefono, setTelefono] = useState(cliente?.telefono ?? "");
  const [direccion, setDireccion] = useState(cliente?.direccion ?? "");

  function reset() {
    setNombre(cliente?.nombre ?? "");
    setTelefono(cliente?.telefono ?? "");
    setDireccion(cliente?.direccion ?? "");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const payload = {
      nombre: nombre.trim(),
      telefono: telefono.trim(),
      direccion: direccion.trim() || null,
    };
    if (!payload.nombre || !payload.telefono) {
      toast.error("Nombre y teléfono son obligatorios");
      return;
    }
    if (mode === "create") {
      const { error } = await supabase.from("clientes").insert(payload);
      if (error) return toast.error(error.message);
      toast.success("Cliente creado");
    } else if (cliente) {
      const { error } = await supabase.from("clientes").update(payload).eq("id", cliente.id);
      if (error) return toast.error(error.message);
      toast.success("Cliente actualizado");
    }
    qc.invalidateQueries({ queryKey: ["clientes"] });
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) reset(); }}>
      <DialogTrigger asChild>
        {mode === "create" ? (
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="mr-1 h-4 w-4" /> Nuevo cliente
          </Button>
        ) : (
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{mode === "create" ? "Nuevo cliente" : "Editar cliente"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={onSubmit} className="space-y-3">
          <div>
            <Label>Nombre</Label>
            <Input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
          </div>
          <div>
            <Label>Teléfono</Label>
            <Input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
          </div>
          <div>
            <Label>Dirección</Label>
            <Input value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </div>
          <DialogFooter>
            <Button type="submit" className="bg-brand-blue hover:bg-brand-blue/90">
              {mode === "create" ? "Crear" : "Guardar cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}