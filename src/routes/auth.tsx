import { useState, useEffect } from "react";
import { createFileRoute, useNavigate, useRouter, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/site/Logo";

const ADMIN_EMAIL = "jacs196@hotmail.com";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [{ title: "Acceso interno · JC'S" }] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") ?? "").trim().toLowerCase();
    const password = String(fd.get("password") ?? "");

    if (email !== ADMIN_EMAIL) {
      toast.error("Acceso restringido. Solo el administrador puede ingresar.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.invalidate();
      navigate({ to: "/admin", replace: true });
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error de autenticación";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-hero-industrial flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur transition-colors hover:bg-white/20"
        >
          <ArrowLeft className="h-4 w-4" /> Volver al inicio
        </Link>
        <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center">
            <Logo className="h-16 w-16" />
            <h1 className="mt-4 font-display text-2xl font-bold uppercase">Acceso interno</h1>
            <p className="mt-1 text-sm text-muted-foreground">Solo el administrador autorizado.</p>
          </div>

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required autoComplete="email" />
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input id="password" name="password" type="password" required minLength={6} autoComplete="current-password" />
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-blue py-6 font-semibold uppercase hover:bg-brand-blue/90"
            >
              {loading ? "Procesando..." : "Entrar"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}