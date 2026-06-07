import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
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
  X,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
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
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Saiu com sucesso!");
    navigate({ to: "/auth" });
  };

  const bonuses = [
    { name: "ChatGPT Pro (Full Access)", icon: <MessageSquare className="w-5 h-5" />, color: "bg-emerald-500" },
    { name: "Gemini Advanced", icon: <Cpu className="w-5 h-5" />, color: "bg-blue-500" },
    { name: "Grok AI", icon: <Zap className="w-5 h-5" />, color: "bg-purple-500" },
    { name: "AI Flow Automation", icon: <LayoutDashboard className="w-5 h-5" />, color: "bg-orange-500" },
    { name: "Veo3 (Video Generation)", icon: <Video className="w-5 h-5" />, color: "bg-red-500" },
    { name: "Lovable (App Builder)", icon: <LayoutDashboard className="w-5 h-5" />, color: "bg-pink-500" },
  ];

  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "members", label: "Área de Membros", icon: <Users className="w-5 h-5" /> },
    { id: "bonuses", label: "Bônus Grátis", icon: <Gift className="w-5 h-5" /> },
    { id: "settings", label: "Configurações", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[var(--ink)] text-white flex overflow-hidden">
      {/* Mobile Sidebar Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 p-4 bg-[var(--flame)] rounded-full shadow-2xl"
      >
        {isSidebarOpen ? <X /> : <Menu />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-40 w-72 bg-[var(--ink-2)] border-r border-white/5 transition-transform duration-300 lg:relative lg:translate-x-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-[var(--flame)] rounded-xl flex items-center justify-center font-display text-xl">C</div>
            <h1 className="font-display text-xl uppercase tracking-tighter">CEO TikShop</h1>
          </div>

          <nav className="flex-1 space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`
                  w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold transition-all
                  ${activeTab === item.id 
                    ? 'bg-[var(--flame)] text-white shadow-lg shadow-[var(--flame)]/20' 
                    : 'text-white/50 hover:bg-white/5 hover:text-white'}
                `}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>

          <div className="pt-6 border-t border-white/5">
            <button 
              onClick={handleSignOut}
              className="w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl font-semibold text-white/50 hover:bg-red-500/10 hover:text-red-500 transition-all"
            >
              <LogOut className="w-5 h-5" />
              Sair da Conta
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-screen overflow-y-auto bg-noise relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[var(--flame)]/5 blur-[120px] rounded-full pointer-events-none" />
        
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[var(--ink)]/80 backdrop-blur-xl border-b border-white/5 px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4 text-white/40">
            <span className="capitalize">{activeTab}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">Visão Geral</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/5 rounded-full text-white/40 text-sm">
              <Search className="w-4 h-4" />
              <input type="text" placeholder="Pesquisar..." className="bg-transparent border-none focus:outline-none" />
            </div>
            <button className="relative p-2 text-white/40 hover:text-white transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[var(--flame)] rounded-full border-2 border-[var(--ink)]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold truncate max-w-[120px]">{user?.user_metadata?.full_name || user?.email?.split('@')[0]}</div>
                <div className="text-[10px] text-[var(--flame)] font-bold uppercase tracking-widest">Plano Pro</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[var(--flame)] to-orange-400 border-2 border-white/10" />
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <div className="p-8">
          {activeTab === 'dashboard' && (
            <div className="space-y-8 animate-in fade-in duration-700">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-display uppercase">Seu Império de IA</h2>
                  <p className="text-white/50 mt-1">Gerencie seu faturamento e suas influencers virtuais.</p>
                </div>
                <Button className="bg-[var(--flame)] hover:bg-[var(--flame)]/90 text-white font-bold rounded-xl px-6">
                  + Nova Influencer
                </Button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { label: "Faturamento Total", value: "R$ 12.450,00", change: "+12%" },
                  { label: "Influencers Ativas", value: "04", change: "0 Novo" },
                  { label: "Views Totais", value: "2.1M", change: "+450k" },
                ].map((stat, i) => (
                  <div key={i} className="p-6 bg-[var(--ink-2)] border border-white/5 rounded-3xl group hover:border-[var(--flame)]/30 transition-all duration-500">
                    <div className="text-white/40 text-sm font-semibold uppercase tracking-widest">{stat.label}</div>
                    <div className="text-3xl font-display mt-2 group-hover:text-[var(--flame)] transition-colors">{stat.value}</div>
                    <div className="text-[var(--flame)] text-xs font-bold mt-2">{stat.change} este mês</div>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-8 bg-[var(--ink-2)] border border-white/5 rounded-3xl h-80 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold uppercase tracking-tight">Gráfico de Performance</h3>
                    <p className="text-white/40 text-sm">Acompanhe o crescimento das suas visualizações.</p>
                  </div>
                  <div className="flex items-end justify-between h-40 gap-2">
                    {[40, 70, 45, 90, 65, 80, 50, 85, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-white/5 rounded-t-lg relative group overflow-hidden">
                        <div 
                          className="absolute bottom-0 left-0 w-full bg-[var(--flame)]/50 group-hover:bg-[var(--flame)] transition-all duration-500" 
                          style={{ height: `${h}%` }} 
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-8 bg-[var(--ink-2)] border border-white/5 rounded-3xl flex flex-col gap-6">
                  <h3 className="text-xl font-bold uppercase tracking-tight">Atividades Recentes</h3>
                  <div className="space-y-4">
                    {[
                      { action: "Nova influencer criada", time: "2 horas atrás", icon: <User className="w-4 h-4" /> },
                      { action: "Vídeo viralizou no TikTok", time: "5 horas atrás", icon: <Zap className="w-4 h-4" /> },
                      { action: "Venda aprovada: R$ 197,90", time: "8 horas atrás", icon: <ArrowRight className="w-4 h-4 text-[var(--flame)]" /> },
                    ].map((act, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5">
                        <div className="w-10 h-10 rounded-full bg-[var(--flame)]/10 text-[var(--flame)] flex items-center justify-center">
                          {act.icon}
                        </div>
                        <div>
                          <div className="text-sm font-bold">{act.action}</div>
                          <div className="text-xs text-white/40">{act.time}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
              <h2 className="text-3xl font-display uppercase">Área de Membros</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { title: "Módulo 1: O Início", lessons: 8, progress: 100 },
                  { title: "Módulo 2: Criação Realista", lessons: 12, progress: 45 },
                  { title: "Módulo 3: Monetização", lessons: 10, progress: 0 },
                  { title: "Módulo 4: Tráfego Viral", lessons: 15, progress: 0 },
                  { title: "Módulo 5: TikTok Shop", lessons: 6, progress: 0 },
                ].map((mod, i) => (
                  <div key={i} className="group p-6 bg-[var(--ink-2)] border border-white/5 rounded-3xl hover:border-[var(--flame)]/30 transition-all cursor-pointer">
                    <div className="aspect-video bg-white/5 rounded-2xl mb-4 overflow-hidden relative">
                       <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                         <div className="w-12 h-12 bg-[var(--flame)] rounded-full flex items-center justify-center">
                           <Play className="fill-white" />
                         </div>
                       </div>
                    </div>
                    <h4 className="font-bold text-lg">{mod.title}</h4>
                    <p className="text-white/40 text-sm">{mod.lessons} aulas • {mod.progress}% completo</p>
                    <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-[var(--flame)] transition-all duration-1000" style={{ width: `${mod.progress}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bonuses' && (
            <div className="space-y-8 animate-in zoom-in-95 duration-700">
              <div className="text-center max-w-xl mx-auto">
                <h2 className="text-3xl font-display uppercase">Bônus Exclusivos</h2>
                <p className="text-white/50 mt-2">Acesso premium às ferramentas de IA mais poderosas do mundo.</p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bonuses.map((bonus, i) => (
                  <div key={i} className="p-8 bg-[var(--ink-2)] border border-white/5 rounded-3xl flex flex-col items-center text-center group hover:scale-[1.02] transition-all">
                    <div className={`w-16 h-16 ${bonus.color} rounded-2xl flex items-center justify-center mb-6 shadow-xl shadow-black/20`}>
                      {bonus.icon}
                    </div>
                    <h4 className="font-bold text-xl">{bonus.name}</h4>
                    <p className="text-white/40 text-sm mt-2 mb-6">Acesso total liberado para membros do plano Pro.</p>
                    <Button className="w-full bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10">
                      Acessar Agora <ExternalLink className="ml-2 w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="max-w-2xl bg-[var(--ink-2)] border border-white/5 rounded-3xl p-8 space-y-8">
              <h2 className="text-2xl font-display uppercase">Configurações da Conta</h2>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold">Nome de Exibição</label>
                  <input type="text" defaultValue={user?.user_metadata?.full_name} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:outline-none focus:border-[var(--flame)]/50 transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-widest text-white/40 font-bold">E-mail</label>
                  <input type="email" disabled defaultValue={user?.email} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed" />
                </div>
                <Button className="bg-[var(--flame)] hover:bg-[var(--flame)]/90 text-white font-bold rounded-xl px-8 h-12">
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
