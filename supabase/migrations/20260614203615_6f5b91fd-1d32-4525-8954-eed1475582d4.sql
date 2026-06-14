
-- Roles system
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL DEFAULT 'admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can read their own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- Auto-grant admin role to the owner email on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF lower(NEW.email) = 'jacs196@hotmail.com' THEN
    INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, 'admin')
    ON CONFLICT DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

-- Estado de equipo
CREATE TYPE public.equipo_estado AS ENUM ('ok','atencion','urgente');
-- Estado de cita
CREATE TYPE public.cita_estado AS ENUM ('pendiente','confirmada','en_camino','completada','cancelada');
-- Tipo de servicio
CREATE TYPE public.tipo_servicio AS ENUM ('domicilio','taller');

-- Clientes
CREATE TABLE public.clientes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT ALL ON public.clientes TO service_role;
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage clientes" ON public.clientes FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_clientes_updated BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Equipos
CREATE TABLE public.equipos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  modelo TEXT,
  ultima_revision DATE,
  proxima_revision DATE,
  estado public.equipo_estado NOT NULL DEFAULT 'ok',
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipos TO authenticated;
GRANT ALL ON public.equipos TO service_role;
ALTER TABLE public.equipos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage equipos" ON public.equipos FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_equipos_updated BEFORE UPDATE ON public.equipos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_equipos_cliente ON public.equipos(cliente_id);

-- Citas
CREATE TABLE public.citas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
  equipo_id UUID REFERENCES public.equipos(id) ON DELETE SET NULL,
  nombre_cliente TEXT NOT NULL,
  telefono TEXT NOT NULL,
  direccion TEXT,
  tipo_equipo TEXT NOT NULL,
  problema TEXT NOT NULL,
  tipo_servicio public.tipo_servicio NOT NULL DEFAULT 'domicilio',
  fecha_hora TIMESTAMPTZ NOT NULL,
  estado public.cita_estado NOT NULL DEFAULT 'pendiente',
  notas TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.citas TO authenticated;
GRANT ALL ON public.citas TO service_role;
ALTER TABLE public.citas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage citas" ON public.citas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE TRIGGER trg_citas_updated BEFORE UPDATE ON public.citas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX idx_citas_fecha ON public.citas(fecha_hora);
CREATE INDEX idx_citas_estado ON public.citas(estado);

-- Tareas
CREATE TABLE public.tareas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  equipo_id UUID NOT NULL REFERENCES public.equipos(id) ON DELETE CASCADE,
  descripcion TEXT NOT NULL,
  completada BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tareas TO authenticated;
GRANT ALL ON public.tareas TO service_role;
ALTER TABLE public.tareas ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage tareas" ON public.tareas FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));
CREATE INDEX idx_tareas_equipo ON public.tareas(equipo_id);

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.citas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.equipos;
ALTER PUBLICATION supabase_realtime ADD TABLE public.tareas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.clientes;
