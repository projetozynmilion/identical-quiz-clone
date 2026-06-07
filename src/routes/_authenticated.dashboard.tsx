import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  LayoutDashboard,
  Users,
  Gift,
  LogOut,
  MessageSquare,
  Cpu,
  Zap,
  Video,
  Settings,
  Bell,
  Search,
  Menu,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  User,
  ArrowUpRight,
  Play,
  TrendingUp,
  Sparkles,
  Command,
  Sun,
  Moon,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Theme = "dark" | "light";

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const saved = (typeof window !== "undefined" && localStorage.getItem("dash-theme")) as Theme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("dash-theme", theme);
  }, [theme]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate({ to: "/auth" });
  };

  const isDark = theme === "dark";
  // Palette
  const C = {
    bg: isDark ? "#0a0a0a" : "#f5f5f7",
    surface: isDark ? "#141414" : "#ffffff",
    surfaceAlt: isDark ? "#1c1c1e" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
    text: isDark ? "#f5f5f7" : "#1d1d1f",
    textMuted: isDark ? "rgba(245,245,247,0.55)" : "rgba(29,29,31,0.55)",
    textSubtle: isDark ? "rgba(245,245,247,0.4)" : "rgba(29,29,31,0.4)",
    hover: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
    accent: "#ff7a00",
    accentSoft: isDark ? "rgba(255,122,0,0.15)" : "rgba(255,122,0,0.1)",
  };

  const sidebarItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "members", label: "Área de Membros", icon: Users },
    { id: "bonuses", label: "Bônus Exclusivos", icon: Gift },
    { id: "settings", label: "Ajustes", icon: Settings },
  ];

  const bonuses = [
    { name: "ChatGPT Pro", desc: "Acesso completo ao GPT-5", icon: MessageSquare, gradient: "from-emerald-400 to-teal-500" },
    { name: "Gemini Advanced", desc: "Google AI premium", icon: Cpu, gradient: "from-blue-400 to-indigo-500" },
    { name: "Grok AI", desc: "X Premium AI", icon: Zap, gradient: "from-violet-400 to-purple-500" },
    { name: "AI Flow", desc: "Automação inteligente", icon: Sparkles, gradient: "from-orange-400 to-pink-500" },
    { name: "Veo 3", desc: "Geração de vídeo HD", icon: Video, gradient: "from-rose-400 to-red-500" },
    { name: "Lovable", desc: "Construtor de apps", icon: LayoutDashboard, gradient: "from-pink-400 to-fuchsia-500" },
  ];

  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div
      className="min-h-screen flex font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] antialiased transition-colors duration-500"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-3 left-3 z-40 w-64 rounded-3xl backdrop-blur-2xl transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${
          isSidebarOpen ? "translate-x-0 opacity-100" : "-translate-x-[110%] opacity-0"
        }`}
        style={{
          background: isDark ? "rgba(20,20,20,0.85)" : "rgba(255,255,255,0.85)",
          border: `1px solid ${C.border}`,
          boxShadow: isDark
            ? "0 8px 40px -8px rgba(0,0,0,0.6)"
            : "0 8px 40px -8px rgba(0,0,0,0.12)",
        }}
      >
        {/* Close arrow on the side */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Fechar menu"
          className="absolute -right-3 top-8 w-7 h-7 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition-all hover:scale-110"
          style={{ background: C.accent, color: "#fff" }}
        >
          <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
        </button>

        <div className="h-full flex flex-col p-5">
          <div className="flex items-center gap-2.5 px-2 mb-8 mt-1">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: `linear-gradient(135deg, ${C.accent}, #ff4500)` }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-[15px] font-semibold tracking-tight">Fábrica UGC</h1>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200"
                  style={{
                    background: active ? C.accent : "transparent",
                    color: active ? "#fff" : C.textMuted,
                  }}
                  onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = C.hover; }}
                  onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 space-y-1" style={{ borderTop: `1px solid ${C.border}` }}>
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
              <div
                className="w-8 h-8 rounded-full text-white flex items-center justify-center text-xs font-semibold"
                style={{ background: `linear-gradient(135deg, ${C.accent}, #ff4500)` }}
              >
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold truncate">{user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Você"}</div>
                <div className="text-[11px] truncate" style={{ color: C.textSubtle }}>Plano Pro</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all"
              style={{ color: C.textMuted }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.12)"; e.currentTarget.style.color = "#ef4444"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = C.textMuted; }}
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}`}>
        {/* Header */}
        <header
          className="sticky top-0 z-30 backdrop-blur-2xl"
          style={{ background: isDark ? "rgba(10,10,10,0.7)" : "rgba(245,245,247,0.8)" }}
        >
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full active:scale-95 transition-all"
                style={{ background: "transparent" }}
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                aria-label="Alternar menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[13px]" style={{ color: C.textSubtle }}>
                <span>Fábrica</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-medium capitalize" style={{ color: C.text }}>
                  {sidebarItems.find((i) => i.id === activeTab)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div
                className="hidden md:flex items-center gap-2 px-3.5 h-9 rounded-full text-[13px] w-64"
                style={{ background: C.hover, color: C.textSubtle }}
              >
                <Search className="w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar"
                  className="bg-transparent border-none focus:outline-none flex-1 placeholder:opacity-60"
                  style={{ color: C.text }}
                />
                <span className="flex items-center gap-0.5 text-[11px]" style={{ color: C.textSubtle }}>
                  <Command className="w-3 h-3" />K
                </span>
              </div>
              <button
                onClick={() => setTheme(isDark ? "light" : "dark")}
                className="w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95"
                aria-label="Alternar tema"
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                {isDark ? <Sun className="w-5 h-5" style={{ color: C.accent }} /> : <Moon className="w-5 h-5" />}
              </button>
              <button
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all"
                onMouseEnter={(e) => (e.currentTarget.style.background = C.hover)}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full" style={{ background: C.accent }} />
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 py-8 max-w-[1400px]">
          {activeTab === "dashboard" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div className="text-[13px] font-medium" style={{ color: C.textSubtle }}>Bem-vindo de volta</div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em] leading-tight mt-1">
                  Olá, {user?.user_metadata?.full_name?.split(" ")[0] || "criador"} 👋
                </h1>
                <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
                  Aqui está o resumo do seu império de IA. Tudo funcionando perfeitamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Faturamento", value: "R$ 12.450", change: "+12,4%" },
                  { label: "Influencers Ativas", value: "04", change: "+1 nova" },
                  { label: "Views Totais", value: "2,1M", change: "+450k" },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="p-6 rounded-3xl transition-all duration-300"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-medium" style={{ color: C.textMuted }}>{stat.label}</div>
                      <div
                        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{ background: C.accentSoft, color: C.accent }}
                      >
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-[34px] font-semibold tracking-tight mt-3">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-6 rounded-3xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <h3 className="text-[17px] font-semibold tracking-tight">Performance</h3>
                      <p className="text-[13px]" style={{ color: C.textMuted }}>Últimos 9 dias</p>
                    </div>
                    <div className="flex gap-1 text-[12px] font-medium">
                      {["7D", "30D", "90D"].map((p, idx) => (
                        <button
                          key={p}
                          className="px-3 py-1.5 rounded-full transition-all"
                          style={{
                            background: idx === 0 ? C.accent : "transparent",
                            color: idx === 0 ? "#fff" : C.textMuted,
                          }}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div
                          className="w-full rounded-xl transition-all duration-700 hover:opacity-80"
                          style={{ height: `${h}%`, background: `linear-gradient(to top, ${C.accent}, #ff4500)` }}
                        />
                        <div className="text-[10px] font-medium" style={{ color: C.textSubtle }}>D{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-3xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                  <h3 className="text-[17px] font-semibold tracking-tight mb-5">Atividade</h3>
                  <div className="space-y-3">
                    {[
                      { action: "Influencer criada", time: "2h", icon: User },
                      { action: "Vídeo viralizou", time: "5h", icon: Zap },
                      { action: "Venda R$ 197,90", time: "8h", icon: ArrowUpRight },
                      { action: "Bônus desbloqueado", time: "1d", icon: Gift },
                    ].map((a, i) => {
                      const Ic = a.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-xl transition-all">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center"
                            style={{ background: C.accentSoft, color: C.accent }}
                          >
                            <Ic className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold truncate">{a.action}</div>
                            <div className="text-[11px]" style={{ color: C.textSubtle }}>{a.time} atrás</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "members" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Área de Membros</h1>
                <p className="text-[15px] mt-2" style={{ color: C.textMuted }}>Continue de onde você parou.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "O Início", lessons: 8, progress: 100 },
                  { title: "Criação Realista", lessons: 12, progress: 45 },
                  { title: "Monetização", lessons: 10, progress: 0 },
                  { title: "Tráfego Viral", lessons: 15, progress: 0 },
                  { title: "TikTok Shop", lessons: 6, progress: 0 },
                ].map((mod, i) => (
                  <div
                    key={i}
                    className="group p-4 rounded-3xl transition-all cursor-pointer"
                    style={{ background: C.surface, border: `1px solid ${C.border}` }}
                  >
                    <div
                      className="aspect-video rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, #1c1c1e, #2c2c2e)` }}
                    >
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform"
                        style={{ background: C.accent }}
                      >
                        <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <div className="text-[11px] font-medium uppercase tracking-wider" style={{ color: C.textSubtle }}>
                        Módulo {i + 1}
                      </div>
                      <h4 className="font-semibold text-[17px] tracking-tight mt-0.5">{mod.title}</h4>
                      <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>{mod.lessons} aulas</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: C.hover }}>
                          <div className="h-full transition-all duration-1000" style={{ width: `${mod.progress}%`, background: C.accent }} />
                        </div>
                        <span className="text-[11px] font-semibold w-9 text-right" style={{ color: C.textMuted }}>{mod.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "bonuses" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  <Sparkles className="w-3 h-3" /> EXCLUSIVO PRO
                </div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Bônus Exclusivos</h1>
                <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
                  Acesso premium às IAs mais poderosas do mundo, totalmente liberado para você.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bonuses.map((b, i) => {
                  const Ic = b.icon;
                  return (
                    <div
                      key={i}
                      className="group p-6 rounded-3xl hover:-translate-y-0.5 transition-all duration-300"
                      style={{ background: C.surface, border: `1px solid ${C.border}` }}
                    >
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-5 shadow-lg`}>
                        <Ic className="w-6 h-6 text-white" strokeWidth={2.2} />
                      </div>
                      <h4 className="font-semibold text-[19px] tracking-tight">{b.name}</h4>
                      <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>{b.desc}</p>
                      <button
                        className="mt-5 w-full h-10 text-[13px] font-semibold rounded-full active:scale-[0.98] transition-all flex items-center justify-center gap-1.5"
                        style={{ background: C.accent, color: "#fff" }}
                      >
                        Acessar <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
              <div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Ajustes</h1>
                <p className="text-[15px] mt-2" style={{ color: C.textMuted }}>Gerencie sua conta e preferências.</p>
              </div>

              <div className="rounded-3xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="p-6 flex items-center justify-between">
                  <div>
                    <div className="text-[15px] font-semibold">Aparência</div>
                    <div className="text-[13px] mt-0.5" style={{ color: C.textMuted }}>
                      Tema {isDark ? "escuro" : "claro"} ativo
                    </div>
                  </div>
                  <div className="flex p-1 rounded-full" style={{ background: C.hover }}>
                    <button
                      onClick={() => setTheme("dark")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                      style={{ background: isDark ? C.accent : "transparent", color: isDark ? "#fff" : C.textMuted }}
                    >
                      <Moon className="w-3.5 h-3.5" /> Escuro
                    </button>
                    <button
                      onClick={() => setTheme("light")}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold transition-all"
                      style={{ background: !isDark ? C.accent : "transparent", color: !isDark ? "#fff" : C.textMuted }}
                    >
                      <Sun className="w-3.5 h-3.5" /> Claro
                    </button>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
                <div className="p-6 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium" style={{ color: C.textMuted }}>Nome completo</label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.full_name}
                      className="w-full h-11 px-4 rounded-xl text-[14px] focus:outline-none transition-all"
                      style={{ background: C.hover, color: C.text, border: `1px solid transparent` }}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium" style={{ color: C.textMuted }}>E-mail</label>
                    <input
                      type="email"
                      disabled
                      defaultValue={user?.email}
                      className="w-full h-11 px-4 rounded-xl text-[14px] cursor-not-allowed"
                      style={{ background: C.hover, color: C.textMuted }}
                    />
                  </div>
                </div>
                <div className="px-6 py-4 flex justify-end" style={{ borderTop: `1px solid ${C.border}`, background: isDark ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.02)" }}>
                  <button
                    className="h-10 px-5 text-[13px] font-semibold rounded-full active:scale-[0.98] transition-all"
                    style={{ background: C.accent, color: "#fff" }}
                  >
                    Salvar Alterações
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
