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
    <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-5 relative overflow-hidden">
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
          <div className="bg-[var(--ink-2)] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            <div className="text-center mb-7">
              <h2 className="font-display text-[28px] uppercase">Entrada VIP</h2>
              <p className="text-white/55 text-[13px] mt-2">Use o e-mail e senha cadastrados na compra.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    className="pl-10 bg-white/5 border-white/10 rounded-xl"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 bg-white/5 border-white/10 rounded-xl"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <Button
                disabled={loading}
                className="w-full bg-[var(--flame)] hover:bg-[var(--flame)]/90 text-white font-bold h-12 rounded-xl"
              >
                {loading ? "Validando..." : "Entrar na área VIP"}
              </Button>
            </form>

            <div className="mt-6 p-4 rounded-2xl bg-[var(--flame)]/10 border border-[var(--flame)]/30">
              <p className="text-[13px] text-white/80">
                <b className="text-white">Ainda não é aluno?</b> O cadastro é exclusivo para quem garantiu o acesso VIP.
              </p>
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-2 text-[var(--flame-2)] font-bold text-[13px] hover:underline"
              >
                Garantir meu acesso agora <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            <button
              onClick={() => setShowLogin(false)}
              className="mt-6 w-full text-center text-white/45 hover:text-white text-[12px] transition"
            >
              ← Voltar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
