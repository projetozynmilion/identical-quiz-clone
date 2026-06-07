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
  User,
  ArrowUpRight,
  Play,
  TrendingUp,
  Sparkles,
  Command,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Você saiu da sua conta");
    navigate({ to: "/auth" });
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
    <div className="min-h-screen bg-[#f5f5f7] text-[#1d1d1f] flex font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] antialiased">
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-3 left-3 z-40 w-64 bg-white/80 backdrop-blur-2xl border border-black/5 rounded-3xl
        shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]
        ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0'}
      `}>
        <div className="h-full flex flex-col p-5">
          <div className="flex items-center gap-2.5 px-2 mb-8 mt-1">
            <div className="w-8 h-8 bg-gradient-to-br from-[#1d1d1f] to-[#3a3a3c] rounded-xl flex items-center justify-center">
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
                  className={`
                    w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium transition-all duration-200
                    ${active
                      ? 'bg-[#1d1d1f] text-white shadow-sm'
                      : 'text-[#1d1d1f]/70 hover:bg-black/[0.04] hover:text-[#1d1d1f]'}
                  `}
                >
                  <Icon className="w-[18px] h-[18px]" strokeWidth={2} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="pt-4 border-t border-black/5 space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-pink-500 text-white flex items-center justify-center text-xs font-semibold">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13px] font-semibold truncate">{user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Você'}</div>
                <div className="text-[11px] text-[#1d1d1f]/50 truncate">Plano Pro</div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[14px] font-medium text-[#1d1d1f]/60 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut className="w-[18px] h-[18px]" strokeWidth={2} />
              Sair
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className={`flex-1 min-h-screen transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? 'lg:ml-[280px]' : 'ml-0'}`}>
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#f5f5f7]/80 backdrop-blur-2xl">
          <div className="px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.05] active:scale-95 transition-all"
                aria-label="Alternar menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-[13px] text-[#1d1d1f]/50">
                <span>Fábrica</span>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="text-[#1d1d1f] font-medium capitalize">
                  {sidebarItems.find(i => i.id === activeTab)?.label}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="hidden md:flex items-center gap-2 px-3.5 h-9 bg-black/[0.04] rounded-full text-[13px] text-[#1d1d1f]/50 w-64">
                <Search className="w-4 h-4" />
                <input type="text" placeholder="Buscar" className="bg-transparent border-none focus:outline-none flex-1 text-[#1d1d1f] placeholder:text-[#1d1d1f]/40" />
                <span className="flex items-center gap-0.5 text-[11px] text-[#1d1d1f]/40">
                  <Command className="w-3 h-3" />K
                </span>
              </div>
              <button className="relative w-10 h-10 flex items-center justify-center rounded-full hover:bg-black/[0.05] transition-all">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>
        </header>

        <div className="px-6 lg:px-10 py-8 max-w-[1400px]">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div className="text-[13px] text-[#1d1d1f]/50 font-medium">Bem-vindo de volta</div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em] leading-tight mt-1">
                  Olá, {user?.user_metadata?.full_name?.split(' ')[0] || 'criador'} 👋
                </h1>
                <p className="text-[15px] text-[#1d1d1f]/60 mt-2 max-w-xl">
                  Aqui está o resumo do seu império de IA. Tudo funcionando perfeitamente.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: "Faturamento", value: "R$ 12.450", change: "+12,4%", trend: "up" },
                  { label: "Influencers Ativas", value: "04", change: "+1 nova", trend: "up" },
                  { label: "Views Totais", value: "2,1M", change: "+450k", trend: "up" },
                ].map((stat, i) => (
                  <div key={i} className="group p-6 bg-white rounded-3xl border border-black/[0.06] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.08)] transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <div className="text-[13px] font-medium text-[#1d1d1f]/50">{stat.label}</div>
                      <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                        <TrendingUp className="w-3 h-3" />
                        {stat.change}
                      </div>
                    </div>
                    <div className="text-[34px] font-semibold tracking-tight mt-3">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-6 bg-white rounded-3xl border border-black/[0.06]">
                  <div className="flex items-end justify-between mb-6">
                    <div>
                      <h3 className="text-[17px] font-semibold tracking-tight">Performance</h3>
                      <p className="text-[13px] text-[#1d1d1f]/50">Últimos 9 dias</p>
                    </div>
                    <div className="flex gap-1 text-[12px] font-medium">
                      {['7D', '30D', '90D'].map((p, idx) => (
                        <button key={p} className={`px-3 py-1.5 rounded-full transition-all ${idx === 0 ? 'bg-[#1d1d1f] text-white' : 'text-[#1d1d1f]/50 hover:bg-black/5'}`}>{p}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-end justify-between h-48 gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="w-full bg-gradient-to-t from-[#1d1d1f] to-[#3a3a3c] rounded-xl transition-all duration-700 hover:opacity-80" style={{ height: `${h}%` }} />
                        <div className="text-[10px] text-[#1d1d1f]/40 font-medium">D{i + 1}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-white rounded-3xl border border-black/[0.06]">
                  <h3 className="text-[17px] font-semibold tracking-tight mb-5">Atividade</h3>
                  <div className="space-y-3">
                    {[
                      { action: "Influencer criada", time: "2h", icon: User, tint: "bg-blue-50 text-blue-600" },
                      { action: "Vídeo viralizou", time: "5h", icon: Zap, tint: "bg-amber-50 text-amber-600" },
                      { action: "Venda R$ 197,90", time: "8h", icon: ArrowUpRight, tint: "bg-emerald-50 text-emerald-600" },
                      { action: "Bônus desbloqueado", time: "1d", icon: Gift, tint: "bg-pink-50 text-pink-600" },
                    ].map((a, i) => {
                      const Ic = a.icon;
                      return (
                        <div key={i} className="flex items-center gap-3 p-2 -mx-2 rounded-xl hover:bg-black/[0.03] transition-all">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center ${a.tint}`}>
                            <Ic className="w-4 h-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[13px] font-semibold truncate">{a.action}</div>
                            <div className="text-[11px] text-[#1d1d1f]/50">{a.time} atrás</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Área de Membros</h1>
                <p className="text-[15px] text-[#1d1d1f]/60 mt-2">Continue de onde você parou.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { title: "O Início", lessons: 8, progress: 100 },
                  { title: "Criação Realista", lessons: 12, progress: 45 },
                  { title: "Monetização", lessons: 10, progress: 0 },
                  { title: "Tráfego Viral", lessons: 15, progress: 0 },
                  { title: "TikTok Shop", lessons: 6, progress: 0 },
                ].map((mod, i) => (
                  <div key={i} className="group p-4 bg-white rounded-3xl border border-black/[0.06] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] transition-all cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-[#1d1d1f] to-[#3a3a3c] rounded-2xl mb-4 relative overflow-hidden flex items-center justify-center">
                      <div className="w-12 h-12 bg-white/95 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-4 h-4 fill-[#1d1d1f] text-[#1d1d1f] ml-0.5" />
                      </div>
                    </div>
                    <div className="px-2 pb-2">
                      <div className="text-[11px] text-[#1d1d1f]/50 font-medium uppercase tracking-wider">Módulo {i + 1}</div>
                      <h4 className="font-semibold text-[17px] tracking-tight mt-0.5">{mod.title}</h4>
                      <p className="text-[13px] text-[#1d1d1f]/50 mt-1">{mod.lessons} aulas</p>
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1 bg-black/5 rounded-full overflow-hidden">
                          <div className="h-full bg-[#1d1d1f] transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
                        </div>
                        <span className="text-[11px] font-semibold text-[#1d1d1f]/60 w-9 text-right">{mod.progress}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bonuses' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#1d1d1f] text-white text-[11px] font-semibold rounded-full mb-3">
                  <Sparkles className="w-3 h-3" /> EXCLUSIVO PRO
                </div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Bônus Exclusivos</h1>
                <p className="text-[15px] text-[#1d1d1f]/60 mt-2 max-w-xl">
                  Acesso premium às IAs mais poderosas do mundo, totalmente liberado para você.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {bonuses.map((b, i) => {
                  const Ic = b.icon;
                  return (
                    <div key={i} className="group p-6 bg-white rounded-3xl border border-black/[0.06] hover:shadow-[0_8px_30px_-8px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition-all duration-300">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center mb-5 shadow-lg shadow-black/5`}>
                        <Ic className="w-6 h-6 text-white" strokeWidth={2.2} />
                      </div>
                      <h4 className="font-semibold text-[19px] tracking-tight">{b.name}</h4>
                      <p className="text-[13px] text-[#1d1d1f]/55 mt-1">{b.desc}</p>
                      <button className="mt-5 w-full h-10 bg-[#1d1d1f] text-white text-[13px] font-semibold rounded-full hover:bg-[#3a3a3c] active:scale-[0.98] transition-all flex items-center justify-center gap-1.5">
                        Acessar <ExternalLink className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500 max-w-2xl">
              <div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Ajustes</h1>
                <p className="text-[15px] text-[#1d1d1f]/60 mt-2">Gerencie sua conta e preferências.</p>
              </div>
              <div className="bg-white rounded-3xl border border-black/[0.06] overflow-hidden">
                <div className="p-6 space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#1d1d1f]/70">Nome completo</label>
                    <input
                      type="text"
                      defaultValue={user?.user_metadata?.full_name}
                      className="w-full h-11 px-4 bg-black/[0.04] border border-transparent rounded-xl text-[14px] focus:outline-none focus:border-[#1d1d1f]/20 focus:bg-white transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-medium text-[#1d1d1f]/70">E-mail</label>
                    <input
                      type="email"
                      disabled
                      defaultValue={user?.email}
                      className="w-full h-11 px-4 bg-black/[0.04] rounded-xl text-[14px] text-[#1d1d1f]/50 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div className="px-6 py-4 bg-black/[0.02] border-t border-black/5 flex justify-end">
                  <button className="h-10 px-5 bg-[#1d1d1f] text-white text-[13px] font-semibold rounded-full hover:bg-[#3a3a3c] active:scale-[0.98] transition-all">
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
