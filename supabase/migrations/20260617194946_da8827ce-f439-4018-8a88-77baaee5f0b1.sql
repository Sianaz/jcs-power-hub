GRANT SELECT, INSERT, UPDATE, DELETE ON public.citas TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.clientes TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.equipos TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.tareas TO authenticated;
GRANT ALL ON public.citas TO service_role;
GRANT ALL ON public.clientes TO service_role;
GRANT ALL ON public.equipos TO service_role;
GRANT ALL ON public.tareas TO service_role;
GRANT INSERT ON public.citas TO anon;