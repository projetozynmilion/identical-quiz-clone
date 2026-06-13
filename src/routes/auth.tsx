import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, Lock as LockIcon, Crown, Zap, ShieldCheck, Clock, Flame } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

const CHECKOUT_URL = "https://pay.cakto.com.br/327qge3";

function AuthPage() {
  const [showLogin, setShowLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Acesso liberado.");
      navigate({ to: "/dashboard" });
    } catch (error: any) {
      toast.error("Acesso negado. Esta área é exclusiva para alunos VIP.");
    } finally {
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
        {!showLogin ? (
          <div className="bg-[var(--ink-2)] border border-[var(--flame)]/40 rounded-3xl p-8 sm:p-10 shadow-[0_30px_80px_-20px_rgba(255,90,31,0.5)]">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="inline-flex items-center gap-1.5 bg-[var(--flame)]/15 border border-[var(--flame)]/40 text-[var(--flame-2)] text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1.5 rounded-full">
                <LockIcon className="w-3 h-3" /> Área restrita
              </span>
            </div>

            <h1 className="font-display text-[36px] sm:text-[44px] leading-[0.95] uppercase text-center">
              Acesso <span className="text-[var(--flame)]">apenas para alunos VIP</span>
            </h1>

            <p className="mt-4 text-center text-white/70 text-[15px] leading-relaxed">
              Esta é a área de membros da <b className="text-white">Fábrica de UGC</b>. O cadastro foi <b className="text-white">encerrado para o público</b> — somente quem garantiu o acesso VIP entra aqui dentro.
            </p>

            <div className="mt-7 space-y-3">
              {[
                { icon: Crown, t: "Acesso vitalício ao método completo" },
                { icon: Zap, t: "Mentoria ao vivo + comunidade fechada" },
                { icon: Flame, t: "Bônus mensais liberados todo mês" },
                { icon: ShieldCheck, t: "Garantia de 7 dias + R$1.000 no PIX" },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[14px] text-white/85">
                  <span className="shrink-0 w-8 h-8 rounded-lg bg-[var(--flame)]/15 border border-[var(--flame)]/30 flex items-center justify-center text-[var(--flame)]">
                    <item.icon className="w-4 h-4" />
                  </span>
                  {item.t}
                </div>
              ))}
            </div>

            <div className="mt-7 p-4 rounded-2xl bg-black/40 border border-white/10 flex items-center gap-3">
              <Clock className="w-5 h-5 text-[var(--acid)] shrink-0" />
              <p className="text-[13px] text-white/70">
                <b className="text-white">Últimas vagas com bônus completos.</b> A próxima turma entra pelo valor cheio.
              </p>
            </div>

            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="pb-ai-button mt-6 w-full font-extrabold px-6 py-5 rounded-full text-[15px] uppercase tracking-wider"
            >
              Quero virar aluno VIP agora <ArrowRight className="w-4 h-4" />
            </a>

            <p className="mt-4 text-center text-white/40 text-[11px] uppercase tracking-widest">
              R$ 247,90 · pagamento único · acesso na hora
            </p>

            <div className="mt-7 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 text-[12.5px] text-white/50">
              <Link to="/" className="hover:text-white transition">← Voltar para o site</Link>
              <button
                onClick={() => setShowLogin(true)}
                className="hover:text-[var(--flame)] transition underline underline-offset-4"
              >
                Já sou aluno VIP — entrar
              </button>
            </div>
          </div>
        ) : (
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
                  Entrada <span>VIP</span>
                </h2>
                <p className="text-white/70 text-[13px] mt-2">Use o e-mail e senha cadastrados na compra.</p>
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
                  {loading ? "Validando..." : (<><ShieldCheck className="w-4 h-4 mr-2" /> Entrar na área VIP</>)}
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

              <button
                onClick={() => setShowLogin(false)}
                className="mt-6 w-full text-center text-white/45 hover:text-white text-[12px] transition"
              >
                ← Voltar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
