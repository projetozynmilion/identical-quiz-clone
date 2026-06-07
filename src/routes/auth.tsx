import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowRight, Mail, Lock, User, Github, Chrome } from "lucide-react";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Login realizado com sucesso!");
        navigate({ to: "/dashboard" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: window.location.origin,
          },
        });
        if (error) throw error;
        toast.success("Cadastro realizado! Verifique seu e-mail.");
      }
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin + "/dashboard",
      });
      if (result.error) throw result.error;
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--ink)] flex items-center justify-center p-5 selection:bg-[var(--flame)] selection:text-black">
      <div className="w-full max-w-md bg-[var(--ink-2)] border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--flame)]/10 blur-3xl -mr-16 -mt-16 rounded-full" />
        
        <div className="text-center mb-8 relative z-10">
          <Link to="/">
            <h1 className="font-display text-2xl uppercase text-[var(--flame)]">CEO TikShop</h1>
          </Link>
          <h2 className="text-2xl font-display uppercase mt-4">
            {isLogin ? "Bem-vindo de volta" : "Crie sua conta"}
          </h2>
          <p className="text-white/60 text-sm mt-2">
            {isLogin 
              ? "Entre para gerenciar suas influencers de IA" 
              : "Comece sua jornada no mercado de IA agora"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-5 relative z-10">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <Input
                  id="fullName"
                  placeholder="Seu nome"
                  className="pl-10 bg-white/5 border-white/10 focus:border-[var(--flame)]/50 transition-all rounded-xl"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className="pl-10 bg-white/5 border-white/10 focus:border-[var(--flame)]/50 transition-all rounded-xl"
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
                className="pl-10 bg-white/5 border-white/10 focus:border-[var(--flame)]/50 transition-all rounded-xl"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <Button 
            disabled={loading}
            className="w-full bg-[var(--flame)] hover:bg-[var(--flame)]/90 text-white font-bold h-12 rounded-xl group"
          >
            {loading ? "Carregando..." : isLogin ? "Entrar" : "Criar Conta"}
            {!loading && <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />}
          </Button>
        </form>

        <div className="relative my-8 z-10">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-[var(--ink-2)] px-2 text-white/40">Ou continue com</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 z-10 relative">
          <Button
            variant="outline"
            onClick={handleGoogleLogin}
            className="bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-12"
          >
            <Chrome className="mr-2 w-4 h-4" />
            Google
          </Button>
        </div>

        <p className="mt-8 text-center text-sm text-white/60 relative z-10">
          {isLogin ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-[var(--flame)] font-bold hover:underline"
          >
            {isLogin ? "Cadastre-se" : "Faça login"}
          </button>
        </p>
      </div>
    </div>
  );
}
