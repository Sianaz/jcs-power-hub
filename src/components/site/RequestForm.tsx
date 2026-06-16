import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { submitCitaPublica } from "@/lib/citas.functions";

type CitaPayload = {
  nombre: string;
  telefono: string;
  tipo_equipo: string;
  serie_modelo: string | null;
  problema: string;
  tipo_servicio: "domicilio" | "taller";
  direccion: string | null;
  fecha_hora: string;
};

const TECNICO_WHATSAPP = "50764421260";

export function RequestForm() {
  const submit = useServerFn(submitCitaPublica);
  const [tipoServicio, setTipoServicio] = useState<"domicilio" | "taller">("domicilio");
  const [tipoEquipo, setTipoEquipo] = useState<string>("excavadora");

  const mutation = useMutation({
    mutationFn: (data: CitaPayload) => submit({ data }),
    onSuccess: (_res, vars) => {
      toast.success("¡Solicitud enviada! Te contactaremos pronto.");
      const fechaTxt = vars.fecha_hora
        ? new Date(vars.fecha_hora).toLocaleString("es-PA", { dateStyle: "full", timeStyle: "short" })
        : "—";
      const lines = [
        "*Nueva solicitud de servicio — JC'S*",
        `*Cliente:* ${vars.nombre}`,
        `*Teléfono:* ${vars.telefono}`,
        `*Equipo:* ${vars.tipo_equipo}`,
        vars.serie_modelo ? `*Serie/Modelo:* ${vars.serie_modelo}` : null,
        `*Servicio:* ${vars.tipo_servicio === "domicilio" ? "A domicilio" : "En taller"}`,
        vars.direccion ? `*Dirección:* ${vars.direccion}` : null,
        `*Fecha preferida:* ${fechaTxt}`,
        `*Problema:* ${vars.problema}`,
      ].filter(Boolean).join("\n");
      const url = `https://wa.me/${TECNICO_WHATSAPP}?text=${encodeURIComponent(lines)}`;
      window.open(url, "_blank", "noopener");
      (document.getElementById("form-cita") as HTMLFormElement | null)?.reset();
      setTipoServicio("domicilio");
      setTipoEquipo("excavadora");
    },
    onError: (err: Error) => toast.error(err.message ?? "Ocurrió un error."),
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const serie = String(fd.get("serie_modelo") ?? "").trim();
    mutation.mutate({
      nombre: String(fd.get("nombre") ?? ""),
      telefono: String(fd.get("telefono") ?? ""),
      tipo_equipo: tipoEquipo === "otro" ? String(fd.get("tipo_equipo_otro") ?? "Otro") : tipoEquipo,
      serie_modelo: serie ? serie : null,
      problema: String(fd.get("problema") ?? ""),
      tipo_servicio: tipoServicio,
      direccion: tipoServicio === "domicilio" ? String(fd.get("direccion") ?? "") : null,
      fecha_hora: String(fd.get("fecha_hora") ?? ""),
    });
  }

  return (
    <section id="agendar" className="bg-secondary py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 md:grid-cols-5 md:px-6">
        <div className="md:col-span-2">
          <p className="font-display text-sm font-semibold uppercase tracking-widest text-brand-blue">Agenda tu visita</p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-tight md:text-5xl">
            Solicita servicio técnico
          </h2>
          <p className="mt-4 text-muted-foreground">
            Completa el formulario y te contactaremos en menos de 2 horas para confirmar la visita.
          </p>
        </div>

        <form
          id="form-cita"
          onSubmit={onSubmit}
          className="rounded-2xl border border-border bg-card p-6 shadow-sm md:col-span-3 md:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="nombre">Nombre completo</Label>
              <Input id="nombre" name="nombre" required minLength={2} maxLength={120} placeholder="Tu nombre" />
            </div>
            <div>
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" required type="tel" placeholder="+507 0000-0000" />
            </div>
            <div>
              <Label>Tipo de equipo</Label>
              <Select value={tipoEquipo} onValueChange={setTipoEquipo}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="excavadora">Excavadora</SelectItem>
                  <SelectItem value="generador">Generador / planta eléctrica</SelectItem>
                  <SelectItem value="camion">Camión</SelectItem>
                  <SelectItem value="tractor">Tractor</SelectItem>
                  <SelectItem value="cargador">Cargador frontal</SelectItem>
                  <SelectItem value="retroexcavadora">Retroexcavadora</SelectItem>
                  <SelectItem value="bulldozer">Bulldozer</SelectItem>
                  <SelectItem value="motoniveladora">Motoniveladora</SelectItem>
                  <SelectItem value="compactadora">Compactadora / rodillo</SelectItem>
                  <SelectItem value="montacargas">Montacargas</SelectItem>
                  <SelectItem value="grua">Grúa</SelectItem>
                  <SelectItem value="minicargador">Minicargador (Bobcat)</SelectItem>
                  <SelectItem value="volqueta">Volqueta</SelectItem>
                  <SelectItem value="trailer">Tráiler / cabezal</SelectItem>
                  <SelectItem value="compresor">Compresor industrial</SelectItem>
                  <SelectItem value="soldadora">Soldadora industrial</SelectItem>
                  <SelectItem value="bomba">Bomba de agua / hidráulica</SelectItem>
                  <SelectItem value="transferencia">Tablero de transferencia (ATS)</SelectItem>
                  <SelectItem value="motor_diesel">Motor diésel</SelectItem>
                  <SelectItem value="motor_gasolina">Motor a gasolina</SelectItem>
                  <SelectItem value="computadora">Computadora / ECU</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              {tipoEquipo === "otro" && (
                <Input className="mt-2" name="tipo_equipo_otro" placeholder="Especifica el equipo" required maxLength={60} />
              )}
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="serie_modelo">Serie y modelo del equipo <span className="text-xs font-normal text-muted-foreground">(opcional)</span></Label>
              <Input id="serie_modelo" name="serie_modelo" maxLength={120} placeholder="Ej: CAT 320D, S/N ABC12345" />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="problema">Descripción del problema</Label>
              <Textarea id="problema" name="problema" required minLength={5} maxLength={2000} rows={4} placeholder="Cuéntanos qué falla está presentando el equipo..." />
            </div>

            <div>
              <Label>Tipo de servicio</Label>
              <Select value={tipoServicio} onValueChange={(v) => setTipoServicio(v as "domicilio" | "taller")}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="domicilio">Visita a domicilio</SelectItem>
                  <SelectItem value="taller">Llevar al taller</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="fecha_hora">Fecha y hora preferida</Label>
              <Input id="fecha_hora" name="fecha_hora" type="datetime-local" required />
            </div>

            {tipoServicio === "domicilio" && (
              <div className="sm:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Input id="direccion" name="direccion" required maxLength={300} placeholder="Dirección donde se encuentra el equipo" />
              </div>
            )}
          </div>

          <Button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 w-full bg-brand-blue py-6 text-base font-semibold uppercase tracking-wide hover:bg-brand-blue/90"
          >
            {mutation.isPending ? "Enviando..." : "Solicitar servicio"}
          </Button>
        </form>
      </div>
    </section>
  );
}