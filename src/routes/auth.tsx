import { createFileRoute, useNavigate, Link, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, Lock as LockIcon, Crown, Zap, ShieldCheck, Clock, Flame } from "lucide-react";
import PixCheckoutDialog from "@/components/PixCheckoutDialog";

export const Route = createFileRoute("/auth")({
  ssr: false,
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    if (data.session?.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
  component: AuthPage,
});

function AuthPage() {
  const [showLogin, setShowLogin] = useState(true);
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/dashboard`,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Conta criada! Confirme seu e-mail para entrar.");
          setLoading(false);
          setMode("login");
          return;
        }
        toast.success("Conta criada. Bem-vindo(a)!");
        window.location.href = "/dashboard";
        return;
      }
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.session) throw new Error("Sessão não criada");
      await supabase.auth.getSession();
      toast.success("Acesso liberado.");
      window.location.href = "/dashboard";
    } catch (error: any) {
      console.error("[auth]", error);
      toast.error(error?.message || "Acesso negado. Esta área é exclusiva para alunos VIP.");
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[var(--ink)] text-white flex items-center justify-center p-5 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div
        className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff5a1f, transparent 60%)" }}
      />

      <div className="w-full max-w-lg relative z-10">
        {(

          <div className="relative">
            <div
              className="absolute -inset-px rounded-[28px] opacity-60 blur-2xl pointer-events-none"
              style={{ background: "radial-gradient(60% 60% at 50% 0%, rgba(255,90,31,0.35), transparent 70%)" }}
            />
            <div className="relative bg-gradient-to-b from-[var(--ink-2)] to-black/80 border border-white/10 rounded-[28px] p-8 md:p-10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--flame)]/70 to-transparent" />

              <div className="text-center mb-8">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--flame)] to-[var(--flame-2)] flex items-center justify-center shadow-[0_10px_30px_-8px_rgba(255,90,31,0.7)] mb-4">
                  <LockIcon className="w-6 h-6 text-white" />
                </div>
                <h2 className="vip-login-title font-display text-[30px] uppercase leading-none">
                  {mode === "login" ? <>Entrada <span>VIP</span></> : <>Criar <span>Conta VIP</span></>}
                </h2>
                <p className="text-white/70 text-[13px] mt-2">
                  {mode === "login" ? "Use o e-mail e senha cadastrados na compra." : "Crie sua conta com o e-mail da compra."}
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">


                <div className="space-y-2">
                  <Label htmlFor="email" className="text-[12px] uppercase tracking-widest text-white/60">E-mail</Label>
                  <div className="relative group">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[var(--flame)] transition" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      className="vip-login-input pl-10 h-12 bg-white/[0.04] border border-white/10 rounded-xl caret-[var(--flame)] focus-visible:ring-2 focus-visible:ring-[var(--flame)]/50 focus-visible:border-[var(--flame)]/50 transition"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-[12px] uppercase tracking-widest text-white/60">Senha</Label>
                  <div className="relative group">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 group-focus-within:text-[var(--flame)] transition" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      className="vip-login-input pl-10 h-12 bg-white/[0.04] border border-white/10 rounded-xl caret-[var(--flame)] focus-visible:ring-2 focus-visible:ring-[var(--flame)]/50 focus-visible:border-[var(--flame)]/50 transition"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <Button
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[var(--flame)] to-[var(--flame-2)] hover:opacity-95 text-white font-extrabold h-12 rounded-xl uppercase tracking-wider text-[13px] shadow-[0_10px_30px_-8px_rgba(255,90,31,0.6)] transition"
                >
                  {loading ? "Processando..." : mode === "login" ? (<><ShieldCheck className="w-4 h-4 mr-2" /> Entrar na área VIP</>) : (<><ShieldCheck className="w-4 h-4 mr-2" /> Criar minha conta</>)}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-[10px] uppercase tracking-[0.25em] text-white/40">ou</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <div className="p-4 rounded-2xl bg-[var(--flame)]/[0.08] border border-[var(--flame)]/25">
                <p className="text-[13px] text-white/80">
                  <b className="text-white">Ainda não é aluno?</b> Garanta seu acesso VIP agora.
                </p>
                <a
                  href={CHECKOUT_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-[var(--flame-2)] font-bold text-[13px] hover:underline"
                >
                  Garantir meu acesso <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}
