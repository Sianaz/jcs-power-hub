
CREATE TABLE public.equipos_taller (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  modelo text,
  serie text,
  notas text,
  estado public.equipo_estado NOT NULL DEFAULT 'ok',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipos_taller TO authenticated;
GRANT ALL ON public.equipos_taller TO service_role;
ALTER TABLE public.equipos_taller ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage equipos_taller" ON public.equipos_taller FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER update_equipos_taller_updated_at BEFORE UPDATE ON public.equipos_taller
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.tareas_taller (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_taller_id uuid NOT NULL REFERENCES public.equipos_taller(id) ON DELETE CASCADE,
  descripcion text NOT NULL,
  completada boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tareas_taller TO authenticated;
GRANT ALL ON public.tareas_taller TO service_role;
ALTER TABLE public.tareas_taller ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tareas_taller" ON public.tareas_taller FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));
