import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const submitSchema = z.object({
  nombre: z.string().trim().min(2).max(120),
  telefono: z.string().trim().min(6).max(40),
  tipo_equipo: z.string().trim().min(1).max(60),
  problema: z.string().trim().min(5).max(2000),
  tipo_servicio: z.enum(["domicilio", "taller"]),
  direccion: z.string().trim().max(300).optional().nullable(),
  fecha_hora: z.string().min(5).max(60),
});

export const submitCitaPublica = createServerFn({ method: "POST" })
  .inputValidator((input) => submitSchema.parse(input))
  .handler(async ({ data }) => {
    if (data.tipo_servicio === "domicilio" && !data.direccion) {
      throw new Error("La dirección es obligatoria para visita a domicilio.");
    }

    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const fechaIso = new Date(data.fecha_hora).toISOString();

    const { data: cita, error } = await supabaseAdmin
      .from("citas")
      .insert({
        nombre_cliente: data.nombre,
        telefono: data.telefono,
        direccion: data.tipo_servicio === "domicilio" ? data.direccion ?? null : null,
        tipo_equipo: data.tipo_equipo,
        problema: data.problema,
        tipo_servicio: data.tipo_servicio,
        fecha_hora: fechaIso,
        estado: "pendiente",
      })
      .select()
      .single();

    if (error) {
      console.error("[citas] insert error", error);
      throw new Error("No pudimos guardar tu solicitud. Inténtalo de nuevo.");
    }

    // Fire webhook (best-effort, do not fail the request if it fails)
    try {
      await fetch("https://javierjosecompany.com/webhook/nueva-cita", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: cita.id,
          nombre: data.nombre,
          telefono: data.telefono,
          tipo_equipo: data.tipo_equipo,
          problema: data.problema,
          tipo_servicio: data.tipo_servicio,
          direccion: data.tipo_servicio === "domicilio" ? data.direccion : null,
          fecha_hora: fechaIso,
          created_at: cita.created_at,
        }),
      });
    } catch (err) {
      console.error("[citas] webhook error", err);
    }

    return { ok: true, id: cita.id };
  });