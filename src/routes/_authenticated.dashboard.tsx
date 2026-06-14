import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
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
  X,
  Flame,
  Target,
  Trophy,
  Rocket,
  FileText,
  CheckCircle2,
  Circle,
  Clock,
  DollarSign,
  PartyPopper,
  Plus,
  Minus,
  Copy,
  RefreshCw,
  CornerDownLeft,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import { DottedSurface } from "@/components/ui/dotted-surface";
import CustomYouTubePlayer from "@/components/CustomYouTubePlayer";

const MODULE_VIDEOS: Record<string, { videoId: string; title: string }> = {
  "módulo 2": { videoId: "2sr0-43TNpU", title: "Criando Uma Influencer Passo a Passo" },
  "modulo 2": { videoId: "2sr0-43TNpU", title: "Criando Uma Influencer Passo a Passo" },
};

function getModuleVideo(title: string) {
  const t = title.toLowerCase();
  for (const key of Object.keys(MODULE_VIDEOS)) {
    if (t.includes(key)) return MODULE_VIDEOS[key];
  }
  return null;
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Theme = "dark" | "light";

type AiToolId = "names" | "titles" | "hashtags" | "competitor" | "script" | "bio" | "cta" | "ideas";

type ModuleRow = {
  id: string;
  row_type: "continue" | "trending" | "originals";
  position: number;
  title: string;
  subtitle: string | null;
  banner_url: string | null;
  video_url: string | null;
  progress: number | null;
  updated_at?: string | null;
};

function versionedImageUrl(url: string | null | undefined, version: string | number | null | undefined) {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version ?? "1"))}`;
}

function highlightUGC(text: string) {
  if (!text.includes("UGC")) return text;
  const parts = text.split("UGC");
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <span style={{ color: "#ff5a1f" }}>UGC</span>}
        </span>
      ))}
    </>
  );
}

function HorizontalScrollRow({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className: string;
  style?: CSSProperties;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const isCoarsePointer = () =>
    typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const drag = useRef({
    pointerId: -1,
    startX: 0,
    startY: 0,
    scrollLeft: 0,
    locked: false,
  });

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (isCoarsePointer()) return;
    if (event.pointerType === "mouse" && event.button !== 0) return;
    const row = rowRef.current;
    if (!row) return;
    drag.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      scrollLeft: row.scrollLeft,
      locked: false,
    };
    row.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (isCoarsePointer()) return;
    const row = rowRef.current;
    const current = drag.current;
    if (!row || current.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - current.startX;
    const deltaY = event.clientY - current.startY;

    if (!current.locked && Math.abs(deltaX) < 8 && Math.abs(deltaY) < 8) return;
    if (!current.locked && Math.abs(deltaY) > Math.abs(deltaX)) {
      row.releasePointerCapture(event.pointerId);
      drag.current.pointerId = -1;
      return;
    }

    current.locked = true;
    event.preventDefault();
    row.scrollLeft = current.scrollLeft - deltaX;
  };

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    const row = rowRef.current;
    if (row?.hasPointerCapture(event.pointerId)) row.releasePointerCapture(event.pointerId);
    drag.current.pointerId = -1;
  };

  return (
    <div
      ref={rowRef}
      className={`${className} mobile-card-scroll`}
      style={{
        overscrollBehaviorX: "contain",
        overscrollBehaviorY: "auto",
        WebkitOverflowScrolling: "touch",
        touchAction: "pan-x pan-y",
        ...style,
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {children}
    </div>
  );
}

function DashboardPage() {
  const [activeTab, setActiveTabState] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 1024 : true,
  );
  const [theme, setTheme] = useState<Theme>("dark");
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [openVideo, setOpenVideo] = useState<{ videoId: string; title: string } | null>(null);
  const [activeAiTool, setActiveAiTool] = useState<AiToolId | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<"lovable" | "github">("lovable");
  const [aiModel, setAiModel] = useState<string>("openai/gpt-4.1-mini");

  const runAiTool = async (tool: AiToolId, input: string, auto = false) => {
    if (!auto && !input.trim()) {
      toast.error("Descreva o que você precisa primeiro");
      return;
    }
    setAiLoading(true);
    setAiResult("");
    setAiError("");
    try {
      const res = await fetch("/api/ferramentas-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input, auto, provider: aiProvider, model: aiProvider === "github" ? aiModel : undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error || "Erro ao gerar";
        setAiError(message);
        toast.error(message);
      } else {
        setAiResult(data.text || "");
        toast.success(auto ? "IA gerou no automático" : "Resultado gerado");
      }
    } catch (e) {
      setAiError("Erro de rede. Tente novamente.");
      toast.error("Erro de rede");
    } finally {
      setAiLoading(false);
    }
  };


  // Dashboard gamification state (persisted locally)
  const lsGet = (k: string, def: string) =>
    typeof window !== "undefined" ? localStorage.getItem(k) ?? def : def;
  const [revenueGoal, setRevenueGoal] = useState<number>(() => Number(lsGet("dash-goal", "5000")));
  const [videoPrice, setVideoPrice] = useState<number>(() => Number(lsGet("dash-price", "500")));
  const [videosDelivered, setVideosDelivered] = useState<number>(() => Number(lsGet("dash-delivered", "0")));
  const [missionDone, setMissionDone] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("dash-mission-date") === new Date().toDateString()
      && localStorage.getItem("dash-mission-done") === "1";
  });
  const [streak, setStreak] = useState<number>(() => Number(lsGet("dash-streak", "0")));
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("dash-goal", String(revenueGoal)); }, [revenueGoal]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("dash-price", String(videoPrice)); }, [videoPrice]);
  useEffect(() => { if (typeof window !== "undefined") localStorage.setItem("dash-delivered", String(videosDelivered)); }, [videosDelivered]);

  const toggleMission = () => {
    const next = !missionDone;
    setMissionDone(next);
    if (typeof window !== "undefined") {
      localStorage.setItem("dash-mission-date", new Date().toDateString());
      localStorage.setItem("dash-mission-done", next ? "1" : "0");
      if (next) {
        const lastDate = localStorage.getItem("dash-streak-date");
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        const newStreak = lastDate === yesterday ? streak + 1 : lastDate === today ? streak : 1;
        setStreak(newStreak);
        localStorage.setItem("dash-streak", String(newStreak));
        localStorage.setItem("dash-streak-date", today);
        toast.success(`🔥 Missão concluída! Streak: ${newStreak} dia${newStreak > 1 ? "s" : ""}`);
      }
    }
  };

  const setActiveTab = (id: string) => {
    setActiveTabState(id);
    if (typeof window !== "undefined" && window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const loadModules = async () => {
    const { data } = await supabase
      .from("modules")
      .select("*")
      .order("row_type", { ascending: true })
      .order("position", { ascending: true });
    if (data) setModules(data as ModuleRow[]);
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        const { data: roles } = await supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", data.session.user.id);
        setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
      }
    });
    loadModules();
    const saved = (typeof window !== "undefined" && localStorage.getItem("dash-theme")) as Theme | null;
    if (saved === "light" || saved === "dark") setTheme(saved);
  }, []);

  useEffect(() => {
    if (activeTab === "members" || activeTab === "admin") void loadModules();
  }, [activeTab]);

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
    surface: isDark ? "#1b1b1d" : "#ffffff",
    surfaceAlt: isDark ? "#242426" : "#ffffff",
    border: isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.1)",
    text: isDark ? "#f5f5f7" : "#1d1d1f",
    textMuted: isDark ? "rgba(245,245,247,0.78)" : "rgba(29,29,31,0.68)",
    textSubtle: isDark ? "rgba(245,245,247,0.58)" : "rgba(29,29,31,0.5)",
    hover: isDark ? "#29292c" : "#f0f0f2",
    accent: "#ff7a00",
    accentSoft: isDark ? "rgba(255,122,0,0.15)" : "rgba(255,122,0,0.1)",
  };

  const dashboardCardStyle: CSSProperties = {
    background: isDark ? "#1f1f22" : "#ffffff",
    border: `1.5px solid ${isDark ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.12)"}`,
    boxShadow: isDark
      ? "0 22px 70px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08)"
      : "0 18px 46px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.9)",
  };

  const sidebarItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "members", label: "Área de Membros", icon: Users },
    { id: "bonuses", label: "Ferramentas", icon: Gift },
    ...(isAdmin ? [{ id: "admin", label: "Admin", icon: Settings }] : []),
    { id: "settings", label: "Ajustes", icon: Settings },
  ];


  const aiTools: {
    id: AiToolId;
    name: string;
    desc: string;
    placeholder: string;
    icon: typeof Sparkles;
    gradient: string;
    badge: string;
    examples: string[];
  }[] = [
    {
      id: "names",
      name: "Gerador de Nomes",
      desc: "Nomes brasileiros virais para sua influencer",
      placeholder: "Ex: influencer de moda fitness, 22 anos, vibe sensual e divertida",
      icon: Sparkles,
      gradient: "from-pink-400 to-rose-500",
      badge: "NAME · GEN",
      examples: [
        "Influencer de moda fitness, 22 anos, vibe sensual",
        "Criadora de skincare, fofa e divertida, 20 anos",
        "UGC de viagem e luxo, mulher elegante 25 anos",
      ],
    },
    {
      id: "titles",
      name: "Títulos Virais",
      desc: "Títulos POV e ganchos para TikTok que vendem",
      placeholder: "Ex: vídeo vendendo curso de UGC, foco em mulheres que querem renda extra",
      icon: Video,
      gradient: "from-violet-400 to-purple-600",
      badge: "TITLE · VIRAL",
      examples: [
        "Vídeo vendendo curso de UGC pra iniciantes",
        "Review de tênis Nike feminino",
        "Demonstração de máscara facial coreana",
      ],
    },
    {
      id: "hashtags",
      name: "Hashtags em Alta",
      desc: "Conjuntos de hashtags para viralizar agora",
      placeholder: "Ex: vídeo de skincare review, nicho beleza, público feminino 18-30",
      icon: Flame,
      gradient: "from-orange-400 to-red-500",
      badge: "TAGS · TREND",
      examples: [
        "Skincare review, público feminino 18-30",
        "Moda fitness, gym, plus-size",
        "Receita fit, low carb, café da manhã",
      ],
    },
    {
      id: "competitor",
      name: "Analisar Concorrente",
      desc: "Cole link + descrição e ganhe um roteiro pronto",
      placeholder: "Cole o @perfil ou link do concorrente e descreva os vídeos/prints que mais viralizam (gancho, edição, CTA, estilo)…",
      icon: Target,
      gradient: "from-emerald-400 to-teal-600",
      badge: "SPY · ANALYZE",
      examples: [
        "@perfil_concorrente — vídeos POV de skincare, gancho 'eu não acreditei até testar'",
        "tiktok.com/@xxx — reviews de moda fitness com close no corpo",
      ],
    },
    {
      id: "script",
      name: "Roteiro UGC",
      desc: "Roteiro 15-30s pronto pra gravar",
      placeholder: "Ex: roteiro vendendo whey protein, formato POV, tom divertido",
      icon: FileText,
      gradient: "from-blue-400 to-indigo-600",
      badge: "SCRIPT · 30s",
      examples: [
        "Vendendo whey protein, formato POV, tom divertido",
        "Review de batom matte, antes/depois",
        "Demonstrando curso de inglês, problema/solução",
      ],
    },
    {
      id: "bio",
      name: "Bio Instagram",
      desc: "Bios que convertem visitantes em seguidores",
      placeholder: "Ex: criadora UGC, vende serviço para marcas, foco em moda",
      icon: MessageSquare,
      gradient: "from-fuchsia-400 to-pink-600",
      badge: "BIO · IG",
      examples: [
        "Criadora UGC, vende serviço pra marcas, nicho moda",
        "Influencer fitness, vende mentoria, foco em mulheres",
      ],
    },
    {
      id: "cta",
      name: "CTAs que Vendem",
      desc: "Chamadas pra ação curtas e poderosas",
      placeholder: "Ex: vendendo mentoria de UGC por R$497",
      icon: Rocket,
      gradient: "from-amber-400 to-orange-600",
      badge: "CTA · SELL",
      examples: [
        "Vendendo mentoria de UGC por R$497",
        "Lançando curso de maquiagem, últimas 48h",
        "Promoção de roupa fitness, frete grátis hoje",
      ],
    },
    {
      id: "ideas",
      name: "Ideias de Vídeo",
      desc: "10 ideias virais para gravar essa semana",
      placeholder: "Ex: nicho fitness feminino, foco em iniciantes",
      icon: TrendingUp,
      gradient: "from-cyan-400 to-blue-600",
      badge: "IDEAS · WEEK",
      examples: [
        "Nicho fitness feminino, foco em iniciantes",
        "Maquiagem natural pra trabalho",
        "Decoração de quarto pequeno, low cost",
      ],
    },
  ];

  const initials = (user?.user_metadata?.full_name || user?.email || "U")
    .split(" ").map((s: string) => s[0]).slice(0, 2).join("").toUpperCase();

  return (
    <div
      className="relative min-h-screen flex font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] antialiased transition-colors duration-500"
      style={{ background: C.bg, color: C.text }}
    >
      {/* Dotted surface background */}
      <DottedSurface className="fixed inset-0 w-full h-full z-0 pointer-events-none" />
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{ background: isDark ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)" }}
        aria-hidden="true"
      />
      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden animate-in fade-in duration-300"
          aria-hidden="true"
        />
      )}

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
            <h1 className="text-[15px] font-semibold tracking-tight">Fábrica <span style={{ color: "#ff5a1f" }}>UGC</span></h1>
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
      <main className={`flex-1 min-w-0 min-h-screen overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}`}>
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

        {activeTab === "members" ? null : null}
        <div className={activeTab === "members" ? "w-full max-w-full overflow-x-hidden" : "px-6 lg:px-10 xl:px-14 2xl:px-20 py-8 w-full max-w-[1800px] mx-auto"}>
          {activeTab === "dashboard" && (() => {
            const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "criador";
            const hour = now.getHours();
            const greeting = hour < 5 ? "Boa madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
            const dayQuotes = [
              "Hoje é dia de gravar.",
              "Quem aparece, fatura.",
              "1 vídeo por dia muda o jogo em 90 dias.",
              "Sua próxima cliente já está te procurando.",
              "Não é talento. É repetição.",
              "Pare de assistir. Comece a postar.",
              "Cada roteiro vale R$ 500.",
            ];
            const quote = dayQuotes[new Date().getDate() % dayQuotes.length];

            const continueList = modules.filter((m) => m.row_type === "continue");
            const nextModule = continueList[0];
            const totalModules = modules.length || 1;
            const completedModules = modules.filter((m) => (m.progress ?? 0) >= 95).length;
            const mentorshipPct = Math.round((completedModules / totalModules) * 100);

            const videosNeeded = Math.max(1, Math.ceil(revenueGoal / Math.max(1, videoPrice)));
            const earned = videosDelivered * videoPrice;
            const goalPct = Math.min(100, Math.round((earned / Math.max(1, revenueGoal)) * 100));

            // Next live: next Tuesday 20:00
            const nextLive = (() => {
              const d = new Date(now);
              const day = d.getDay();
              const diff = (2 - day + 7) % 7 || 7;
              d.setDate(d.getDate() + diff);
              d.setHours(20, 0, 0, 0);
              return d;
            })();
            const diffMs = nextLive.getTime() - now.getTime();
            const dDays = Math.floor(diffMs / 86400000);
            const dHours = Math.floor((diffMs % 86400000) / 3600000);
            const dMins = Math.floor((diffMs % 3600000) / 60000);

            const wins = [
              { name: "João S.", text: "fechou R$ 8.500 com 12 vídeos", time: "2h" },
              { name: "Maria L.", text: "1ª venda — R$ 1.200 🎉", time: "5h" },
              { name: "Pedro R.", text: "contrato recorrente R$ 4k/mês", time: "ontem" },
              { name: "Camila A.", text: "fechou marca de cosmético", time: "ontem" },
              { name: "Lucas M.", text: "R$ 12.000 no mês", time: "2d" },
            ];
            const weeklyTotal = 87420;

            return (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              {/* GREETING */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[13px] font-medium" style={{ color: C.textSubtle }}>{greeting}, criador</div>
                  <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.02em] leading-tight mt-1">
                    De volta à fábrica, <span style={{ color: C.accent }}>{firstName}</span> ⚡
                  </h1>
                  <p className="text-[15px] mt-2 max-w-xl italic" style={{ color: C.textMuted }}>
                    "{quote}"
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[13px] font-semibold"
                    style={{ background: "linear-gradient(135deg, #ff7a00, #ff2d00)", color: "#fff" }}
                  >
                    <Flame className="w-4 h-4" /> {streak} dia{streak !== 1 ? "s" : ""} seguidos
                  </div>
                  <div
                    className="flex items-center gap-1.5 px-3 py-2 rounded-full text-[12px] font-semibold"
                    style={{ background: C.accentSoft, color: C.accent }}
                  >
                    <Sparkles className="w-3.5 h-3.5" /> Aluno PRO
                  </div>
                </div>
              </div>

              {/* HERO — Próximo passo na mentoria */}
              <div
                className="relative overflow-hidden p-6 sm:p-8 rounded-3xl"
                style={{
                  background: "linear-gradient(135deg, #1a0a04 0%, #2a0f00 50%, #0a0a0a 100%)",
                  border: `1px solid ${C.border}`,
                }}
              >
                <div
                  className="absolute -top-20 -right-20 w-72 h-72 rounded-full opacity-40 blur-3xl pointer-events-none"
                  style={{ background: "radial-gradient(circle, #ff7a00, transparent)" }}
                />
                <div className="relative grid lg:grid-cols-[1fr_auto] gap-6 items-center">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold mb-3"
                      style={{ background: C.accent, color: "#fff" }}>
                      <Rocket className="w-3 h-3" /> SEU PRÓXIMO PASSO
                    </div>
                    <h2 className="text-[24px] sm:text-[30px] font-semibold tracking-tight text-white">
                      {nextModule?.title || "Comece sua jornada na Fábrica UGC"}
                    </h2>
                    <p className="text-[14px] mt-1 text-white/60">
                      {nextModule?.subtitle || "Acesse a mentoria e dê o primeiro passo hoje."}
                    </p>
                    <div className="mt-5 flex items-center gap-3">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${mentorshipPct}%`, background: "linear-gradient(90deg, #ff7a00, #ff2d00)" }}
                        />
                      </div>
                      <div className="text-[13px] font-bold text-white">{mentorshipPct}%</div>
                    </div>
                    <div className="text-[11px] mt-1.5 text-white/40">{completedModules} de {totalModules} módulos concluídos</div>
                  </div>
                  <div className="btn-wrapper">
                    <button
                      onClick={() => setActiveTab("members")}
                      className="btn"
                      type="button"
                    >
                      <svg className="btn-svg" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <div className="txt-wrapper">
                        <span className="txt-1">
                          {"Continuar agora".split("").map((ch, i) => (
                            <span key={i} className="btn-letter">{ch === " " ? "\u00A0" : ch}</span>
                          ))}
                        </span>
                        <span className="txt-2">&nbsp;</span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* META + MISSÃO */}
              <div className="grid lg:grid-cols-2 gap-4">
                {/* META */}
                <div className="p-6 rounded-3xl flex flex-col" style={dashboardCardStyle}>
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: C.accentSoft, color: C.accent }}>
                      <Target className="w-4 h-4" />
                    </div>
                    <div className="text-[15px] font-semibold tracking-tight">Meta do mês</div>
                  </div>

                  {/* BIG NUMBER */}
                  <div className="text-[44px] sm:text-[52px] font-bold tracking-tight leading-none">
                    R$ {earned.toLocaleString("pt-BR")}
                  </div>
                  <div className="text-[13px] mt-1" style={{ color: C.textMuted }}>
                    de{" "}
                    <input
                      type="number"
                      value={revenueGoal}
                      onChange={(e) => setRevenueGoal(Math.max(0, Number(e.target.value) || 0))}
                      className="bg-transparent border-none focus:outline-none font-semibold w-24"
                      style={{ color: C.accent }}
                    />
                    {" "}este mês
                  </div>

                  {/* PROGRESS BAR */}
                  <div className="h-3 rounded-full overflow-hidden mt-5" style={{ background: C.hover }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${goalPct}%`, background: "linear-gradient(90deg, #ff7a00, #ff2d00)" }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[12px] mt-2 mb-5">
                    <span className="font-semibold" style={{ color: C.accent }}>{goalPct}%</span>
                    <span style={{ color: C.textMuted }}>
                      <span className="font-bold" style={{ color: C.text }}>{videosDelivered}</span> / {videosNeeded} vídeos
                    </span>
                  </div>

                  {/* ACTION */}
                  <div className="flex items-center gap-2 mt-auto">
                    <button
                      onClick={() => setVideosDelivered(Math.max(0, videosDelivered - 1))}
                      className="w-11 h-11 rounded-xl flex items-center justify-center transition-all active:scale-95"
                      style={{ background: isDark ? "#2b2b2f" : C.hover, color: C.text }}
                      aria-label="Remover vídeo"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        setVideosDelivered(videosDelivered + 1);
                        toast.success(`💸 +R$ ${videoPrice.toLocaleString("pt-BR")} no caixa!`);
                      }}
                      className="flex-1 h-11 rounded-xl font-semibold text-[14px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
                      style={{ background: C.accent, color: "#fff" }}
                    >
                      <Plus className="w-4 h-4" /> +1 vídeo entregue (R$ {videoPrice.toLocaleString("pt-BR")})
                    </button>
                  </div>
                </div>

                {/* MISSÃO + STREAK */}
                <div className="p-6 rounded-3xl flex flex-col" style={dashboardCardStyle}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,90,31,0.15)", color: "#ff5a1f" }}>
                        <Flame className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold tracking-tight">Missão de hoje</div>
                        <div className="text-[11px]" style={{ color: C.textSubtle }}>1 ação. Sem desculpa.</div>
                      </div>
                    </div>
                    <div className="text-[11px] font-semibold px-2 py-1 rounded-full" style={{ background: C.hover, color: C.textMuted }}>
                      {now.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })}
                    </div>
                  </div>

                  <button
                    onClick={toggleMission}
                    className="group relative w-full text-left p-5 rounded-2xl transition-all hover:scale-[1.01] active:scale-[0.99] overflow-hidden"
                    style={{
                      background: missionDone
                        ? "linear-gradient(135deg, rgba(255,122,0,0.18), rgba(255,45,0,0.08))"
                        : isDark ? "#2b2b2f" : C.hover,
                      border: `1.5px solid ${missionDone ? C.accent : isDark ? "rgba(255,255,255,0.12)" : "transparent"}`,
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {missionDone ? (
                          <CheckCircle2 className="w-6 h-6" style={{ color: C.accent }} fill={C.accent} stroke="#fff" />
                        ) : (
                          <Circle className="w-6 h-6" style={{ color: C.textSubtle }} />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className={`text-[16px] font-semibold ${missionDone ? "line-through opacity-60" : ""}`}>
                          Grave 1 vídeo UGC hoje
                        </div>
                        <div className="text-[12px] mt-0.5" style={{ color: C.textMuted }}>
                          15 segundos. Celular na mão. Sem edição perfeita.
                        </div>
                      </div>
                    </div>
                  </button>

                  <div className="mt-4 grid grid-cols-7 gap-1.5 flex-1">
                    {Array.from({ length: 7 }).map((_, i) => {
                      const active = i < Math.min(streak, 7);
                      return (
                        <div
                          key={i}
                          className="aspect-square rounded-lg flex items-center justify-center transition-all"
                          style={{
                            background: active
                              ? "linear-gradient(135deg, #ff7a00, #ff2d00)"
                              : isDark ? "#2b2b2f" : C.hover,
                          }}
                        >
                          <Flame className="w-4 h-4" style={{ color: active ? "#fff" : C.textSubtle, opacity: active ? 1 : 0.4 }} />
                        </div>
                      );
                    })}
                  </div>
                  <div className="text-[11px] mt-2 text-center" style={{ color: C.textSubtle }}>
                    Streak: <span className="font-bold" style={{ color: C.accent }}>{streak} dia{streak !== 1 ? "s" : ""}</span> · Não quebre a corrente 🔥
                  </div>
                </div>
              </div>

              {/* MURAL DE CONQUISTAS + PRÓXIMA LIVE */}
              <div className="grid lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 p-6 rounded-3xl" style={dashboardCardStyle}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}>
                        <Trophy className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="text-[15px] font-semibold tracking-tight">Conquistas da comunidade</div>
                        <div className="text-[11px]" style={{ color: C.textSubtle }}>Ao vivo · esta semana</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px]" style={{ color: C.textSubtle }}>Total faturado</div>
                      <div className="text-[18px] font-bold" style={{ color: "#22c55e" }}>
                        R$ {weeklyTotal.toLocaleString("pt-BR")}
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {wins.map((w, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-3 rounded-2xl transition-all hover:translate-x-1"
                        style={{ background: isDark ? "#2b2b2f" : C.hover, border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "transparent"}` }}
                      >
                        <div
                          className="w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold text-white shrink-0"
                          style={{ background: `linear-gradient(135deg, hsl(${i * 60},60%,55%), hsl(${i * 60 + 30},60%,40%))` }}
                        >
                          {w.name.split(" ").map((s) => s[0]).join("")}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px]">
                            <span className="font-semibold">{w.name}</span>{" "}
                            <span style={{ color: C.textMuted }}>{w.text}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[11px] shrink-0" style={{ color: C.textSubtle }}>
                          <PartyPopper className="w-3 h-3" /> {w.time}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] mt-3 text-center" style={{ color: C.textSubtle }}>
                    Sua próxima conquista aparece aqui. Bora?
                  </div>
                </div>

                {/* PRÓXIMA LIVE COUNTDOWN */}
                <div
                  className="relative overflow-hidden p-6 rounded-3xl flex flex-col"
                  style={{
                    background: "linear-gradient(160deg, #0a0a0a 0%, #1a0a04 100%)",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  <div
                    className="absolute -bottom-16 -right-16 w-48 h-48 rounded-full opacity-30 blur-2xl pointer-events-none"
                    style={{ background: "radial-gradient(circle, #ff7a00, transparent)" }}
                  />
                  <div className="relative flex flex-col h-full">
                    <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full text-[10px] font-bold mb-3"
                      style={{ background: "rgba(255,90,31,0.2)", color: "#ff7a00" }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ff5a1f] animate-pulse" /> AO VIVO EM BREVE
                    </div>
                    <div className="text-[18px] font-semibold tracking-tight text-white leading-snug">
                      Como precificar seu UGC sem dar desconto
                    </div>
                    <div className="text-[12px] mt-1 text-white/50">Mentoria ao vivo com a Fábrica</div>

                    <div className="flex items-center gap-2 mt-5">
                      {[
                        { v: dDays, l: "dias" },
                        { v: dHours, l: "h" },
                        { v: dMins, l: "min" },
                      ].map((t, i) => (
                        <div key={i} className="flex-1 text-center p-2 rounded-xl" style={{ background: "rgba(255,255,255,0.06)" }}>
                          <div className="text-[22px] font-bold text-white tabular-nums">
                            {String(Math.max(0, t.v)).padStart(2, "0")}
                          </div>
                          <div className="text-[10px] uppercase tracking-wider text-white/40">{t.l}</div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-auto pt-4 text-[11px] text-white/40 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {nextLive.toLocaleDateString("pt-BR", { weekday: "long", day: "2-digit", month: "long" })} · 20h
                    </div>
                  </div>
                </div>
              </div>

              {/* ATALHOS RÁPIDOS */}
              <div>
                <h3 className="text-[15px] font-semibold tracking-tight mb-3">Ferramentas rápidas</h3>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: "Gerar roteiro", desc: "IA escreve em 30s", icon: FileText, onClick: () => toast.info("Em breve 🚀") },
                    { label: "Modelo de proposta", desc: "Fecha contrato fácil", icon: DollarSign, onClick: () => toast.info("Em breve 🚀") },
                    { label: "Continuar mentoria", desc: "De onde parou", icon: Play, onClick: () => setActiveTab("members") },
                    { label: "Bônus exclusivos", desc: "IAs liberadas", icon: Gift, onClick: () => setActiveTab("bonuses") },
                  ].map((q, i) => {
                    const Ic = q.icon;
                    return (
                      <button
                        key={i}
                        onClick={q.onClick}
                        className="group p-4 rounded-2xl text-left transition-all hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
                        style={dashboardCardStyle}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-all group-hover:scale-110"
                          style={{ background: C.accentSoft, color: C.accent }}>
                          <Ic className="w-4 h-4" />
                        </div>
                        <div className="text-[13px] font-semibold">{q.label}</div>
                        <div className="text-[11px] mt-0.5" style={{ color: C.textSubtle }}>{q.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
            );
          })()}


          {activeTab === "members" && (() => {
            const grouped: Record<string, ModuleRow[]> = { continue: [], trending: [], originals: [] };
            modules.forEach((m) => { grouped[m.row_type]?.push(m); });
            const featured = grouped.originals[0] || grouped.trending[0] || grouped.continue[0];
            const rows: { key: string; title: string; items: ModuleRow[]; numbered?: boolean }[] = [
              { key: "continue", title: "Mentoria Fábrica de UGC", items: grouped.continue, numbered: true },
              { key: "trending", title: "Em alta", items: grouped.trending },
              { key: "originals", title: "Originais Fábrica UGC", items: grouped.originals },
            ];
            return (
              <div className="w-full animate-in fade-in duration-500 overflow-x-hidden" style={{ background: "#000", color: "#fff", fontFamily: "'Netflix Sans','Helvetica Neue',Helvetica,Arial,sans-serif", minHeight: "calc(100vh - 64px)" }}>
                {/* HERO */}
                <div className="px-0 sm:px-6 lg:px-10 xl:px-14">
                  <div className="relative w-full aspect-[16/9] sm:aspect-[16/9] lg:aspect-[2.63/1] sm:rounded-xl lg:rounded-2xl overflow-hidden" style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.6)" }}>
                    {featured?.banner_url ? (
                      <img src={versionedImageUrl(featured.banner_url, featured.updated_at)} alt={featured.title} className="absolute inset-0 w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 25% 40%, rgba(255,90,31,0.5), transparent 55%), linear-gradient(135deg, #1a1a1a 0%, #000 100%)" }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                  </div>
                </div>

                {/* ROWS */}
                <div className="px-4 sm:px-6 lg:px-10 xl:px-14 py-6 lg:py-12 space-y-8 lg:space-y-12">
                  {rows.map((row, ri) => row.items.length === 0 ? null : (
                    <div key={row.key}>
                      <h2 className="text-[16px] sm:text-[18px] font-semibold mb-3 tracking-tight text-white/95">{highlightUGC(row.title)}</h2>
                      {row.numbered ? (
                        /* Netflix Top 10 numbered */
                        <HorizontalScrollRow className="flex gap-1 sm:gap-2 overflow-x-auto overflow-y-hidden pb-4 -mx-4 sm:-mx-6 lg:-mx-10 xl:-mx-14 px-4 sm:px-6 lg:px-10 xl:px-14 scrollbar-thin snap-x select-none cursor-grab active:cursor-grabbing">
                          {row.items.slice(0, 10).map((it, i) => (
                            <div key={it.id} onClick={() => { const v = getModuleVideo(it.title); if (v) setOpenVideo(v); }} className="group cursor-pointer flex items-end shrink-0 snap-start" style={{ width: "clamp(150px, 30vw, 260px)" }}>
                              <span
                                data-num={i + 1}
                                className="font-black leading-none -mr-3 sm:-mr-5 select-none shrink-0"
                                style={{
                                  fontSize: "clamp(70px, 14vw, 150px)",
                                  lineHeight: 0.85,
                                  color: "transparent",
                                  WebkitTextStroke: "2px #ff5a1f",
                                }}
                              >
                                {i + 1}
                              </span>
                              <div className="relative flex-1 aspect-[2/3] rounded-lg overflow-hidden transition-transform duration-300 group-hover:scale-[1.04]"
                                style={{
                                  background: it.banner_url ? undefined : `linear-gradient(135deg, hsl(${(ri * 80 + i * 40) % 360},40%,25%), hsl(${(ri * 80 + i * 40 + 60) % 360},45%,12%))`,
                                }}
                              >
                                {it.banner_url && <img src={versionedImageUrl(it.banner_url, it.updated_at)} alt={it.title} className="absolute inset-0 w-full h-full object-cover" />}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40">
                                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
                                    <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                                  </div>
                                </div>
                                {typeof it.progress === "number" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                                    <div className="h-full bg-[#ff5a1f]" style={{ width: `${it.progress}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </HorizontalScrollRow>
                      ) : (
                        <HorizontalScrollRow className="flex gap-2 sm:gap-3 overflow-x-auto overflow-y-hidden pb-4 -mx-4 sm:-mx-6 lg:-mx-10 xl:-mx-14 px-4 sm:px-6 lg:px-10 xl:px-14 scrollbar-thin snap-x select-none cursor-grab active:cursor-grabbing">
                          {row.items.map((it, i) => (
                            <div key={it.id} onClick={() => { const v = getModuleVideo(it.title); if (v) setOpenVideo(v); }} className="group cursor-pointer shrink-0 snap-start" style={{ width: "clamp(150px, 26vw, 240px)" }}>
                              <div className="relative w-full aspect-video rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-[1.04]"
                                style={{
                                  background: it.banner_url ? undefined : `linear-gradient(135deg, hsl(${(ri * 80 + i * 40) % 360},40%,25%), hsl(${(ri * 80 + i * 40 + 60) % 360},45%,12%))`,
                                }}
                              >
                                {it.banner_url && <img src={versionedImageUrl(it.banner_url, it.updated_at)} alt={it.title} className="absolute inset-0 w-full h-full object-cover" />}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-black/40">
                                  <div className="w-11 h-11 rounded-full bg-white flex items-center justify-center">
                                    <Play className="w-4 h-4 fill-black text-black ml-0.5" />
                                  </div>
                                </div>
                                {typeof it.progress === "number" && (
                                  <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/20">
                                    <div className="h-full bg-[#ff5a1f]" style={{ width: `${it.progress}%` }} />
                                  </div>
                                )}
                              </div>
                              <div className="mt-2 px-0.5">
                                <div className="font-medium text-[13px] text-white/95 truncate">{it.title}</div>
                                {it.subtitle && <div className="text-[11px] text-white/50 mt-0.5 truncate">{it.subtitle}</div>}
                              </div>
                            </div>
                          ))}
                        </HorizontalScrollRow>
                      )}
                    </div>
                  ))}
                </div>

                {openVideo && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={() => setOpenVideo(null)}>
                    <div className="relative w-full max-w-5xl" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-white text-[18px] sm:text-[22px] font-bold">{openVideo.title}</h3>
                        <button onClick={() => setOpenVideo(null)} className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors">
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                      <CustomYouTubePlayer videoId={openVideo.videoId} title={openVideo.title} />
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {activeTab === "admin" && isAdmin && (
            <AdminModulesPanel C={C} modules={modules} reload={loadModules} />
          )}



          {activeTab === "bonuses" && (
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  <Sparkles className="w-3 h-3" /> IAs EXCLUSIVAS
                </div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Ferramentas</h1>
                <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
                  IAs treinadas pra UGC: gere nomes, títulos virais, hashtags, roteiros e analise concorrentes em segundos.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {aiTools.map((b, i) => {
                  const Ic = b.icon;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveAiTool(b.id);
                        setAiInput("");
                        setAiResult("");
                        setAiError("");
                      }}
                      className="group relative min-h-[230px] overflow-hidden rounded-[28px] p-[1px] text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_26px_90px_-28px_rgba(255,122,0,0.9)]"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,122,0,0.62) 42%, rgba(214,255,58,0.26))"
                          : "linear-gradient(135deg, rgba(0,0,0,0.12), rgba(255,122,0,0.7) 45%, rgba(10,10,10,0.18))",
                        animation: `fadeUp 0.5s ${i * 60}ms both`,
                      }}
                    >
                      <div
                        className="relative h-full min-h-[228px] rounded-[27px] p-5 overflow-hidden flex flex-col"
                        style={{
                          background: isDark
                            ? "radial-gradient(circle at 100% 0%, rgba(255,122,0,0.2), transparent 34%), linear-gradient(160deg, #111114 0%, #18181d 60%, #0b0b0d 100%)"
                            : "radial-gradient(circle at 100% 0%, rgba(255,122,0,0.16), transparent 34%), linear-gradient(160deg, #ffffff 0%, #f6f6f3 100%)",
                        }}
                      >
                        {/* Grid pattern */}
                        <div
                          className="absolute inset-0 opacity-[0.06] pointer-events-none"
                          style={{
                            backgroundImage: isDark
                              ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
                              : "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
                            backgroundSize: "22px 22px",
                          }}
                        />
                        {/* Glow on hover */}
                        <div
                          className={`absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-700 bg-gradient-to-br ${b.gradient}`}
                        />
                        {/* Corner brackets */}
                        <div className="absolute top-2 right-2 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                          <span
                            className="text-[9px] font-mono font-bold tracking-[0.15em]"
                            style={{ color: isDark ? "rgba(245,245,247,0.4)" : "rgba(29,29,31,0.4)" }}
                          >
                            AI-{String(i + 1).padStart(2, "0")}
                          </span>
                        </div>

                        <div className="relative flex items-start justify-between gap-4 mb-6">
                          <div className="relative">
                            <div
                              className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${b.gradient} blur-xl opacity-55 group-hover:opacity-95 transition-opacity`}
                            />
                            <div
                              className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${b.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500`}
                            >
                              <Ic className="w-6 h-6 text-white" strokeWidth={2.5} />
                            </div>
                          </div>
                          <div className="rounded-full px-3 py-1 text-[10px] font-mono font-bold tracking-[0.16em]" style={{ background: isDark ? "rgba(214,255,58,0.12)" : "rgba(10,10,10,0.06)", color: isDark ? "#d6ff3a" : "#111" }}>
                            AUTO READY
                          </div>
                        </div>

                        <h4 className="relative font-black text-[19px] tracking-tight leading-tight">
                          {b.name}
                        </h4>
                        <p
                          className="relative text-[13px] mt-2 leading-relaxed line-clamp-2"
                          style={{ color: C.textMuted }}
                        >
                          {b.desc}
                        </p>

                        <div
                          className="relative mt-auto pt-5 flex items-center justify-between"
                          style={{
                            borderTop: `1px dashed ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                          }}
                        >
                          <span
                            className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase"
                            style={{ color: C.textSubtle }}
                          >
                            &gt; Executar
                          </span>
                          <div
                            className="h-9 px-3 rounded-full flex items-center gap-1 text-[11px] font-black tracking-wide group-hover:gap-2 transition-all"
                            style={{ background: C.accent, color: "#fff" }}
                          >
                            <span>ABRIR</span>
                            <ChevronRight className="w-3.5 h-3.5" strokeWidth={3} />
                          </div>
                        </div>
                      </div>
                    </button>
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

      {activeAiTool && (() => {
        const tool = aiTools.find((t) => t.id === activeAiTool)!;
        const Ic = tool.icon;
        return (
          <div
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 backdrop-blur-xl p-3 sm:p-6 animate-in fade-in duration-200"
            onClick={() => setActiveAiTool(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl max-h-[92vh] rounded-[32px] overflow-hidden flex flex-col animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
              style={{
                background: isDark
                  ? "linear-gradient(145deg, #09090a 0%, #151519 45%, #080809 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f4f3ee 100%)",
                border: `1px solid ${isDark ? "rgba(255,122,0,0.28)" : "rgba(255,122,0,0.35)"}`,
                boxShadow: "0 46px 140px -30px rgba(255,122,0,0.65), 0 0 0 1px rgba(255,255,255,0.06) inset",
              }}
            >
              <div
                className={`absolute -top-32 -right-20 w-[420px] h-[420px] rounded-full blur-3xl opacity-40 bg-gradient-to-br ${tool.gradient} pointer-events-none`}
              />
              <div className="absolute left-0 top-0 h-full w-1 bg-gradient-to-b from-orange-400 via-orange-600 to-lime-300 pointer-events-none" />
              <div
                className="absolute inset-0 opacity-[0.055] pointer-events-none"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
                    : "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                }}
              />

              <div
                className="relative px-5 sm:px-7 py-5 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative shrink-0">
                    <div className={`absolute inset-0 rounded-[22px] bg-gradient-to-br ${tool.gradient} blur-xl opacity-75`} />
                    <div className={`relative w-14 h-14 rounded-[22px] bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-xl`}>
                      <Ic className="w-6 h-6 text-white" strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse" />
                      <span className="text-[9px] font-mono font-bold tracking-[0.2em]" style={{ color: C.textSubtle }}>
                        {tool.badge}
                      </span>
                      <span className="rounded-full px-2 py-0.5 text-[9px] font-mono font-black tracking-[0.16em]" style={{ background: isDark ? "rgba(214,255,58,0.12)" : "rgba(10,10,10,0.06)", color: isDark ? "#d6ff3a" : C.text }}>
                        GERAR AUTO
                      </span>
                    </div>
                    <h3 className="text-[22px] sm:text-[28px] font-black tracking-tight mt-0.5 truncate">{tool.name}</h3>
                    <p className="text-[12px] truncate" style={{ color: C.textMuted }}>{tool.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAiTool(null)}
                  className="w-9 h-9 shrink-0 rounded-full flex items-center justify-center transition-all hover:rotate-90"
                  style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: C.text }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="relative grid lg:grid-cols-[0.86fr_1.14fr] min-h-0 overflow-y-auto">
                <div className="p-5 sm:p-7 space-y-5" style={{ borderRight: `1px solid ${isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.06)"}` }}>
                  <div className="space-y-2">
                    <div className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: C.textSubtle }}>
                      &gt; Motor de IA
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setAiProvider("lovable")}
                        className="h-10 rounded-xl text-[11px] font-black tracking-wide transition-all"
                        style={{
                          background: aiProvider === "lovable" ? "linear-gradient(90deg,#ff7a00,#ff9d3a)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                          color: aiProvider === "lovable" ? "#fff" : C.text,
                          border: `1px solid ${aiProvider === "lovable" ? "transparent" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                        }}
                      >
                        LOVABLE · GEMINI
                      </button>
                      <button
                        onClick={() => setAiProvider("github")}
                        className="h-10 rounded-xl text-[11px] font-black tracking-wide transition-all"
                        style={{
                          background: aiProvider === "github" ? "linear-gradient(90deg,#7c3aed,#22d3ee)" : (isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)"),
                          color: aiProvider === "github" ? "#fff" : C.text,
                          border: `1px solid ${aiProvider === "github" ? "transparent" : (isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)")}`,
                        }}
                      >
                        GITHUB · PHI-4 / GPT
                      </button>
                    </div>
                    {aiProvider === "github" && (
                      <select
                        value={aiModel}
                        onChange={(e) => setAiModel(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl text-[12px] font-mono outline-none"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          color: C.text,
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        }}
                      >
                        <optgroup label="🚀 Recomendado">
                          <option value="openai/gpt-4.1-mini">GPT-4.1 Mini · rápido + barato</option>
                          <option value="openai/gpt-4.1">GPT-4.1 · qualidade alta</option>
                          <option value="microsoft/Phi-4-reasoning">Phi-4 Reasoning</option>
                        </optgroup>
                        <optgroup label="Microsoft Phi-4">
                          <option value="microsoft/Phi-4-reasoning">Phi-4 Reasoning</option>
                          <option value="microsoft/Phi-4-multimodal-instruct">Phi-4 Multimodal</option>
                          <option value="microsoft/Phi-4-mini-reasoning">Phi-4 Mini Reasoning</option>
                          <option value="microsoft/Phi-4-mini-instruct">Phi-4 Mini Instruct</option>
                          <option value="microsoft/Phi-4">Phi-4 (14B)</option>
                        </optgroup>
                        <optgroup label="OpenAI GPT-5">
                          <option value="openai/gpt-5">GPT-5</option>
                          <option value="openai/gpt-5-mini">GPT-5 Mini</option>
                          <option value="openai/gpt-5-nano">GPT-5 Nano</option>
                          <option value="openai/gpt-5-chat">GPT-5 Chat (preview)</option>
                        </optgroup>
                        <optgroup label="OpenAI GPT-4.1 / 4o">
                          <option value="openai/gpt-4.1">GPT-4.1</option>
                          <option value="openai/gpt-4.1-mini">GPT-4.1 Mini</option>
                          <option value="openai/gpt-4.1-nano">GPT-4.1 Nano</option>
                          <option value="openai/gpt-4o">GPT-4o</option>
                          <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
                        </optgroup>
                        <optgroup label="OpenAI Reasoning (o-series)">
                          <option value="openai/o4-mini">o4-mini</option>
                          <option value="openai/o3">o3</option>
                          <option value="openai/o3-mini">o3-mini</option>
                          <option value="openai/o1">o1</option>
                          <option value="openai/o1-mini">o1-mini</option>
                          <option value="openai/o1-preview">o1-preview</option>
                        </optgroup>
                        <optgroup label="Meta Llama">
                          <option value="meta/Llama-4-Maverick-17B-128E-Instruct-FP8">Llama 4 Maverick 17B</option>
                          <option value="meta/Llama-4-Scout-17B-16E-Instruct">Llama 4 Scout 17B</option>
                          <option value="meta/Llama-3.3-70B-Instruct">Llama 3.3 70B</option>
                          <option value="meta/Meta-Llama-3.1-405B-Instruct">Llama 3.1 405B</option>
                          <option value="meta/Meta-Llama-3.1-8B-Instruct">Llama 3.1 8B</option>
                          <option value="meta/Llama-3.2-90B-Vision-Instruct">Llama 3.2 90B Vision</option>
                          <option value="meta/Llama-3.2-11B-Vision-Instruct">Llama 3.2 11B Vision</option>
                        </optgroup>
                        <optgroup label="DeepSeek">
                          <option value="deepseek/DeepSeek-R1-0528">DeepSeek R1 0528</option>
                          <option value="deepseek/DeepSeek-R1">DeepSeek R1</option>
                          <option value="deepseek/DeepSeek-V3-0324">DeepSeek V3</option>
                        </optgroup>
                        <optgroup label="Mistral">
                          <option value="mistral-ai/mistral-medium-2505">Mistral Medium 3</option>
                          <option value="mistral-ai/mistral-small-2503">Mistral Small 3.1</option>
                          <option value="mistral-ai/codestral-2501">Codestral 25.01</option>
                          <option value="mistral-ai/ministral-3b">Ministral 3B</option>
                        </optgroup>
                        <optgroup label="Cohere">
                          <option value="cohere/cohere-command-a">Cohere Command A</option>
                        </optgroup>

                      </select>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">

                    <button
                      onClick={() => runAiTool(activeAiTool, aiInput)}
                      disabled={aiLoading || !aiInput.trim()}
                      className={`relative h-14 text-[13px] font-black rounded-2xl active:scale-[0.98] transition-all disabled:opacity-35 disabled:cursor-not-allowed flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r ${tool.gradient} text-white shadow-lg`}
                    >
                      {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                      <span>{aiResult ? "REFAZER" : "GERAR"}</span>
                    </button>
                    <button
                      onClick={() => runAiTool(activeAiTool, aiInput, true)}
                      disabled={aiLoading}
                      className="relative h-14 rounded-2xl text-[12px] font-black tracking-wide flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-40 overflow-hidden"
                      style={{ background: isDark ? "rgba(214,255,58,0.12)" : "rgba(10,10,10,0.06)", color: isDark ? "#d6ff3a" : C.text, border: `1px solid ${isDark ? "rgba(214,255,58,0.3)" : "rgba(10,10,10,0.1)"}` }}
                    >
                      <Command className="w-4 h-4" />
                      AUTOMÁTICO
                    </button>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: C.textSubtle }}>
                        &gt; Detalhes
                      </label>
                      <span className="text-[10px] font-mono" style={{ color: C.textSubtle }}>
                        {aiInput.length}/4000
                      </span>
                    </div>
                    <div
                      className="relative rounded-[24px] transition-all focus-within:ring-2 focus-within:ring-orange-500/35"
                      style={{
                        background: isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.028)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                      }}
                    >
                      <textarea
                        value={aiInput}
                        onChange={(e) => setAiInput(e.target.value.slice(0, 4000))}
                        onKeyDown={(e) => {
                          if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
                            e.preventDefault();
                            runAiTool(activeAiTool, aiInput);
                          }
                        }}
                        placeholder={tool.placeholder}
                        rows={activeAiTool === "competitor" ? 8 : 6}
                        className="w-full bg-transparent p-5 pr-12 text-[14px] leading-relaxed resize-none outline-none placeholder:opacity-60"
                        style={{ color: C.text }}
                      />
                      <div
                        className="hidden sm:flex absolute bottom-3 right-3 items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono"
                        style={{ background: isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)", color: C.textSubtle }}
                      >
                        ⌘ <CornerDownLeft className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>

                  {!aiResult && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono uppercase tracking-[0.18em]" style={{ color: C.textSubtle }}>
                        Presets rápidos
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {tool.examples.map((ex, idx) => (
                          <button
                            key={idx}
                            onClick={() => setAiInput(ex)}
                            className="text-[11px] px-3 py-2 rounded-full transition-all hover:scale-105"
                            style={{
                              background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                              color: C.textMuted,
                              border: `1px dashed ${isDark ? "rgba(255,255,255,0.13)" : "rgba(0,0,0,0.12)"}`,
                            }}
                          >
                            {ex.length > 58 ? ex.slice(0, 58) + "…" : ex}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-7 min-h-[420px] flex flex-col">
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: C.textSubtle }}>
                        Output da IA
                      </div>
                      <div className="text-[15px] font-bold mt-1">Resposta pronta para copiar</div>
                    </div>
                    {aiResult && (
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => runAiTool(activeAiTool, aiInput, !aiInput.trim())}
                          className="h-8 px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-colors"
                          style={{ background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)", color: C.text }}
                        >
                          <RefreshCw className="w-3 h-3" /> Refazer
                        </button>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(aiResult);
                            toast.success("Copiado!");
                          }}
                          className={`h-8 px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 bg-gradient-to-r ${tool.gradient} text-white`}
                        >
                          <Copy className="w-3 h-3" /> Copiar
                        </button>
                      </div>
                    )}
                  </div>

                  <div
                    className="relative flex-1 rounded-[28px] overflow-hidden"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.024)",
                      border: `1px solid ${isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.08)"}`,
                    }}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-orange-400 to-transparent" />
                    {aiLoading && !aiResult && (
                      <div className="p-6 space-y-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center`}>
                            <RefreshCw className="w-5 h-5 text-white animate-spin" />
                          </div>
                          <div>
                            <div className="font-black">Criando resultado premium…</div>
                            <div className="text-[12px]" style={{ color: C.textMuted }}>A IA está montando uma resposta objetiva.</div>
                          </div>
                        </div>
                        {[92, 76, 96, 68, 88, 55].map((w, i) => (
                          <div key={i} className="h-3 rounded-full animate-pulse" style={{ width: `${w}%`, background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)", animationDelay: `${i * 100}ms` }} />
                        ))}
                      </div>
                    )}

                    {aiError && !aiLoading && !aiResult && (
                      <div className="p-6 h-full flex flex-col justify-center">
                        <div className="rounded-2xl p-5" style={{ background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.28)" }}>
                          <div className="font-black text-[16px]">Não foi possível gerar agora</div>
                          <p className="text-[13px] mt-2 leading-relaxed" style={{ color: C.textMuted }}>{aiError}</p>
                          <button onClick={() => runAiTool(activeAiTool, aiInput, !aiInput.trim())} className={`mt-4 h-10 px-4 rounded-full text-[12px] font-black bg-gradient-to-r ${tool.gradient} text-white`}>
                            Tentar novamente
                          </button>
                        </div>
                      </div>
                    )}

                    {aiResult && (
                      <div className="p-6 max-h-[56vh] overflow-y-auto">
                        <div className="ai-result text-[14px] leading-relaxed" style={{ color: C.text }}>
                          <ReactMarkdown components={{
                            h1: ({ children }) => <h1 className="text-[20px] font-black mt-4 mb-2 first:mt-0">{children}</h1>,
                            h2: ({ children }) => <h2 className="text-[18px] font-black mt-4 mb-2 first:mt-0">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-[15px] font-bold mt-3 mb-1.5 first:mt-0" style={{ color: C.accent }}>{children}</h3>,
                            p: ({ children }) => <p className="mb-3 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="space-y-1.5 mb-3 list-none">{children}</ul>,
                            ol: ({ children }) => <ol className="space-y-2 mb-3 list-none">{children}</ol>,
                            li: ({ children }) => <li className="pl-4 relative before:content-['▸'] before:absolute before:left-0 before:top-0"><span style={{ color: C.text }}>{children}</span></li>,
                            strong: ({ children }) => <strong className="font-black" style={{ color: C.accent }}>{children}</strong>,
                            em: ({ children }) => <em className="italic" style={{ color: C.textMuted }}>{children}</em>,
                            code: ({ children }) => <code className="px-1.5 py-0.5 rounded text-[12px] font-mono" style={{ background: isDark ? "rgba(255,122,0,0.15)" : "rgba(255,122,0,0.1)", color: C.accent }}>{children}</code>,
                            hr: () => <hr className="my-3 border-0 border-t border-dashed" style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)" }} />,
                          }}>{aiResult}</ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {!aiLoading && !aiResult && !aiError && (
                      <div className="h-full min-h-[360px] flex items-center justify-center p-6 text-center">
                        <div>
                          <div className={`mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-2xl mb-4`}>
                            <Ic className="w-7 h-7 text-white" />
                          </div>
                          <div className="font-black text-[18px]">Pronto para gerar</div>
                          <div className="text-[12px] mt-1 max-w-xs" style={{ color: C.textMuted }}>
                            Escreva detalhes ou aperte automático para a IA decidir o melhor caminho.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function AdminModulesPanel({ C, modules, reload }: { C: any; modules: ModuleRow[]; reload: () => Promise<void> }) {
  const empty = { row_type: "originals", position: 0, title: "", subtitle: "", banner_url: "", video_url: "", progress: "" };
  const [form, setForm] = useState<any>(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const openNew = (row_type: string) => {
    const maxPos = modules.filter((m) => m.row_type === row_type).reduce((acc, m) => Math.max(acc, m.position), -1);
    setEditingId(null);
    setForm({ ...empty, row_type, position: maxPos + 1 });
    setModalOpen(true);
  };

  const openEdit = (m: ModuleRow) => {
    setEditingId(m.id);
    setForm({
      row_type: m.row_type, position: m.position, title: m.title,
      subtitle: m.subtitle || "", banner_url: m.banner_url || "",
      video_url: m.video_url || "", progress: m.progress ?? "",
    });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditingId(null); setForm(empty); };

  const save = async () => {
    if (!form.title.trim()) { toast.error("Título obrigatório"); return; }
    setSaving(true);
    const payload: any = {
      row_type: form.row_type,
      position: Number(form.position) || 0,
      title: form.title.trim(),
      subtitle: form.subtitle?.trim() || null,
      banner_url: form.banner_url?.trim() || null,
      video_url: form.video_url?.trim() || null,
      progress: form.progress === "" ? null : Number(form.progress),
      updated_at: new Date().toISOString(),
    };
    const res = editingId
      ? await supabase.from("modules").update(payload).eq("id", editingId)
      : await supabase.from("modules").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editingId ? "Card atualizado" : "Card adicionado");
    closeModal();
    await reload();
  };

  const remove = async () => {
    if (!editingId) return;
    if (!confirm("Excluir este card?")) return;
    const { error } = await supabase.from("modules").delete().eq("id", editingId);
    if (error) { toast.error(error.message); return; }
    toast.success("Card excluído");
    closeModal();
    await reload();
  };

  const uploadImage = async (file: File) => {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const currentPath = typeof form.banner_url === "string" ? form.banner_url.match(/\/object\/sign\/banners\/([^?]+)/)?.[1] : null;
      const path = currentPath ? decodeURIComponent(currentPath) : `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("banners").upload(path, file, { upsert: true, contentType: file.type });
      if (up.error) { toast.error(up.error.message); return; }
      // Bucket é privado neste workspace → URL assinada de longa duração (~10 anos)
      const signed = await supabase.storage.from("banners").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) { toast.error(signed.error?.message || "Erro ao gerar URL"); return; }
      const nextBannerUrl = `${signed.data.signedUrl}&v=${Date.now()}`;
      setForm((f: any) => ({ ...f, banner_url: nextBannerUrl }));

      if (editingId) {
        const { error } = await supabase
          .from("modules")
          .update({ banner_url: nextBannerUrl, updated_at: new Date().toISOString() })
          .eq("id", editingId);
        if (error) { toast.error(error.message); return; }
        await reload();
        toast.success("Imagem salva no card");
        return;
      }

      toast.success("Imagem enviada — agora salve o card");
    } finally {
      setUploading(false);
    }
  };

  const inp = "w-full h-10 px-3 rounded-lg text-[13px] focus:outline-none";
  const inpStyle = { background: C.hover, color: C.text, border: `1px solid ${C.border}` };

  const grouped: Record<string, ModuleRow[]> = { continue: [], trending: [], originals: [] };
  modules.forEach((m) => { grouped[m.row_type]?.push(m); });
  const sections: { key: "continue" | "trending" | "originals"; title: string; aspect: string }[] = [
    { key: "originals", title: "Originais (Módulos 1–6)", aspect: "aspect-video" },
    { key: "trending", title: "Em alta", aspect: "aspect-video" },
    { key: "continue", title: "Mentoria Fábrica de UGC (Top 10)", aspect: "aspect-[2/3]" },
  ];

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3" style={{ background: C.accent, color: "#fff" }}>
          <Settings className="w-3 h-3" /> PAINEL ADMIN
        </div>
        <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Gerenciar Módulos</h1>
        <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
          Clique em qualquer card para editar. Use o <b>+</b> para adicionar um novo card na linha.
        </p>
      </div>

      {sections.map((s) => (
        <div key={s.key}>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[18px] font-semibold tracking-tight">{highlightUGC(s.title)}</h2>
            <span className="text-[12px]" style={{ color: C.textSubtle }}>{grouped[s.key].length} card(s)</span>
          </div>
          <div className={`grid gap-3 ${s.key === "continue" ? "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`}>
            {grouped[s.key].map((m) => (
              <button
                key={m.id}
                onClick={() => openEdit(m)}
                className={`group relative ${s.aspect} rounded-xl overflow-hidden text-left transition-all hover:scale-[1.02] active:scale-[0.99]`}
                style={{ background: m.banner_url ? undefined : `linear-gradient(135deg, ${C.hover}, ${C.surfaceAlt})`, border: `1px solid ${C.border}` }}
              >
                {m.banner_url && <img src={m.banner_url} alt={m.title} className="absolute inset-0 w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                  <span className="px-3 py-1.5 text-[12px] font-semibold rounded-full" style={{ background: C.accent, color: "#fff" }}>✏️ Editar</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3">
                  <div className="text-white text-[13px] font-semibold leading-tight line-clamp-2">{m.title}</div>
                  {m.subtitle && <div className="text-white/70 text-[11px] mt-0.5 truncate">{m.subtitle}</div>}
                </div>
                <div className="absolute top-2 left-2 text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.55)", color: "#fff" }}>pos {m.position}</div>
              </button>
            ))}
            <button
              onClick={() => openNew(s.key)}
              className={`${s.aspect} rounded-xl flex flex-col items-center justify-center gap-2 transition-all hover:scale-[1.02]`}
              style={{ background: "transparent", border: `2px dashed ${C.border}`, color: C.textMuted }}
            >
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl font-light" style={{ background: C.accentSoft, color: C.accent }}>+</div>
              <span className="text-[12px] font-medium">Adicionar card</span>
            </button>
          </div>
        </div>
      ))}

      {modalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 space-y-4"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div className="text-[18px] font-semibold">{editingId ? "Editar card" : "Novo card"}</div>
              <button onClick={closeModal} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.hover }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <label
              className="relative block w-full aspect-video rounded-2xl overflow-hidden cursor-pointer group"
              style={{ background: C.hover, border: `2px dashed ${C.border}` }}
            >
              {form.banner_url ? (
                <>
                  <img src={form.banner_url} alt="preview" className="absolute inset-0 w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).style.opacity = "0.2"; }} />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition flex items-center justify-center" style={{ background: "rgba(0,0,0,0.55)" }}>
                    <span className="px-3 py-1.5 text-[12px] font-semibold rounded-full" style={{ background: C.accent, color: "#fff" }}>Trocar imagem</span>
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2" style={{ color: C.textMuted }}>
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl" style={{ background: C.accentSoft, color: C.accent }}>📤</div>
                  <span className="text-[13px] font-semibold">{uploading ? "Enviando…" : "Toque para enviar a imagem"}</span>
                  <span className="text-[11px]">PNG, JPG ou WEBP</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={uploading}
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (file) await uploadImage(file);
                  (e.target as HTMLInputElement).value = "";
                }}
              />
            </label>

            {form.banner_url && (
              <div className="flex items-center justify-between text-[12px]" style={{ color: C.textMuted }}>
                <span className="truncate">Imagem definida ✓</span>
                <button type="button" onClick={() => setForm({ ...form, banner_url: "" })} className="font-semibold" style={{ color: "#ef4444" }}>Remover</button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <select className={inp} style={inpStyle as any} value={form.row_type} onChange={(e) => setForm({ ...form, row_type: e.target.value })}>
                <option value="continue">Mentoria Fábrica de UGC</option>
                <option value="trending">Em alta</option>
                <option value="originals">Originais (Módulos 1–6)</option>
              </select>
              <input className={inp} style={inpStyle as any} type="number" placeholder="Posição (0,1,2…)" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              <input className={inp + " md:col-span-2"} style={inpStyle as any} placeholder="Título (ex: Módulo 1 — O Início)" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              <input className={inp + " md:col-span-2"} style={inpStyle as any} placeholder="Subtítulo (ex: 8 aulas)" value={form.subtitle} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} />
              <input className={inp} style={inpStyle as any} type="number" min={0} max={100} placeholder="Progresso 0-100 (opcional)" value={form.progress} onChange={(e) => setForm({ ...form, progress: e.target.value })} />
              <input className={inp} style={inpStyle as any} type="url" placeholder="Link do vídeo (opcional)" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
              <input className={inp + " md:col-span-2"} style={inpStyle as any} type="url" placeholder="Ou cole uma URL de imagem externa" value={form.banner_url} onChange={(e) => setForm({ ...form, banner_url: e.target.value })} />
            </div>

            <div className="flex flex-wrap gap-2 justify-between pt-2">
              <div>
                {editingId && (
                  <button onClick={remove} className="h-10 px-4 text-[13px] font-semibold rounded-full" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                    Excluir
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <button onClick={closeModal} className="h-10 px-4 text-[13px] font-semibold rounded-full" style={{ background: C.hover, color: C.text }}>Cancelar</button>
                <button disabled={saving || uploading} className="h-10 px-5 text-[13px] font-semibold rounded-full active:scale-[0.98] transition-all disabled:opacity-50" style={{ background: C.accent, color: "#fff" }} onClick={save}>
                  {saving ? "Salvando…" : editingId ? "Salvar" : "Adicionar"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


