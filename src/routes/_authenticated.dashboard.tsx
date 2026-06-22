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
import bannerFabricaUgc from "@/assets/banner-fabrica-ugc.png.asset.json";
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
  MessageCircle,
  Wand2,
  Radar,
} from "lucide-react";
import CommunityChat from "@/components/CommunityChat";
import CommunityFeed from "@/components/CommunityFeed";
import ProfileSettingsDialog from "@/components/ProfileSettingsDialog";
import { resolveAvatarUrl } from "@/lib/avatarUrl";
import PromptsTab from "@/components/PromptsTab";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";
import CustomYouTubePlayer from "@/components/CustomYouTubePlayer";
import ModuleDetailDialog from "@/components/ModuleDetailDialog";
import CinematicThemeSwitcher from "@/components/ui/cinematic-theme-switcher";
import { AiLoader } from "@/components/ui/ai-loader";
import { ConfettiBurst } from "@/components/ui/confetti-burst";
import { lazy, Suspense } from "react";
const RippleGrid = lazy(() => import("@/components/ui/ripple-grid"));
const AdminRadarPanel = lazy(() => import("@/components/AdminRadarPanel"));
const RadarTikshop = lazy(() => import("@/components/RadarTikshop"));
const Conquistas = lazy(() => import("@/components/Conquistas"));

const MODULE_VIDEOS: Record<string, { videoId: string; title: string }> = {
  "módulo 1": { videoId: "2sr0-43TNpU", title: "Módulo 1 — Introdução" },
  "modulo 1": { videoId: "2sr0-43TNpU", title: "Módulo 1 — Introdução" },
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

function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    // fallback regex
  }
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

function resolveModuleVideo(m: { title: string; video_url: string | null }) {
  const fromUrl = extractYoutubeId(m.video_url);
  if (fromUrl) return { videoId: fromUrl, title: m.title };
  return getModuleVideo(m.title);
}

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

type Theme = "dark" | "light";

type AiToolId = "names" | "titles" | "hashtags" | "competitor" | "script" | "bio" | "cta" | "ideas";

type AiField = {
  key: string;
  label: string;
  placeholder: string;
  type?: "text" | "textarea" | "select";
  options?: string[];
  required?: boolean;
  hint?: string;
};

const TOOL_FIELDS: Record<AiToolId, AiField[]> = {
  names: [
    { key: "Nicho", label: "Nicho do perfil", placeholder: "Ex: skincare, moda fitness, viagem luxo", required: true },
    { key: "Idade", label: "Faixa etária", placeholder: "Ex: 22-26 anos", type: "select", options: ["18-22 anos", "22-26 anos", "26-30 anos", "30-35 anos"] },
    { key: "Estética", label: "Estética / vibe", placeholder: "Ex: premium, leve, confiante, sensual elegante" },
    { key: "Plataforma", label: "Plataforma principal", placeholder: "TikTok + Instagram", type: "select", options: ["TikTok + Instagram", "Apenas TikTok", "Apenas Instagram", "YouTube Shorts"] },
    { key: "Personalidade", label: "Personalidade da persona", placeholder: "Ex: divertida, intimista, especialista, mãe moderna" },
  ],
  titles: [
    { key: "Tema do vídeo", label: "Tema do vídeo", placeholder: "Ex: review de tênis Nike Pegasus", required: true, type: "textarea" },
    { key: "Objetivo", label: "Objetivo", placeholder: "Vender", type: "select", options: ["Vender produto", "Vender serviço/curso", "Engajar / viralizar", "Gerar leads"] },
    { key: "Público-alvo", label: "Público-alvo", placeholder: "Ex: mulheres 25-40 que treinam em casa" },
    { key: "Formato", label: "Formato", placeholder: "POV", type: "select", options: ["POV", "Storytelling", "Antes/Depois", "Review", "Tutorial", "Lista/Top 5", "Reação"] },
  ],
  hashtags: [
    { key: "Tema do vídeo", label: "Tema do vídeo", placeholder: "Ex: review de skincare coreano", required: true },
    { key: "Nicho", label: "Nicho principal", placeholder: "Ex: beleza, fitness, moda" },
    { key: "Público", label: "Público", placeholder: "Ex: mulheres 18-30 Brasil" },
    { key: "Plataforma", label: "Plataforma", placeholder: "TikTok", type: "select", options: ["TikTok", "Instagram Reels", "Ambos", "YouTube Shorts"] },
  ],
  competitor: [
    { key: "Link do perfil", label: "Link do perfil do concorrente", placeholder: "https://tiktok.com/@perfil ou https://instagram.com/@perfil", required: true },
  ],
  script: [
    { key: "Produto/oferta", label: "Produto ou oferta", placeholder: "Ex: curso de UGC pra iniciantes R$197", required: true, type: "textarea" },
    { key: "Formato", label: "Formato", placeholder: "POV", type: "select", options: ["POV", "Storytelling pessoal", "Antes/Depois", "Demonstração", "Problema/Solução", "3 erros / 3 dicas"] },
    { key: "Duração", label: "Duração", placeholder: "30s", type: "select", options: ["15 segundos", "30 segundos", "45 segundos", "60 segundos"] },
    { key: "Tom", label: "Tom de voz", placeholder: "Divertido", type: "select", options: ["Divertido / leve", "Intimista", "Especialista", "Polêmico", "Aspiracional", "Conselho de amiga"] },
    { key: "Público", label: "Público-alvo", placeholder: "Ex: mulheres 25-40 que querem renda extra" },
  ],
  bio: [
    { key: "Nicho", label: "Nicho", placeholder: "Ex: UGC moda", required: true },
    { key: "Oferta principal", label: "Oferta principal", placeholder: "Ex: criação de conteúdo para marcas / mentoria" },
    { key: "Tom", label: "Tom", placeholder: "Premium", type: "select", options: ["Premium", "Divertida", "Especialista", "Acolhedora", "Polêmica"] },
    { key: "Diferencial", label: "Diferencial", placeholder: "Ex: já trabalhou com Boticário, +200 vídeos entregues" },
    { key: "Link na bio", label: "Link na bio (se houver)", placeholder: "Ex: linktree, curso, WhatsApp" },
  ],
  cta: [
    { key: "Oferta", label: "Oferta", placeholder: "Ex: mentoria de UGC R$497", required: true },
    { key: "Preço/condição", label: "Preço/condição", placeholder: "Ex: 12x R$49 ou desconto até sexta" },
    { key: "Urgência", label: "Urgência/escassez", placeholder: "Ex: últimas 48h, só 20 vagas", type: "select", options: ["Sem urgência", "Tempo limitado (24-72h)", "Vagas limitadas", "Bônus expira hoje"] },
    { key: "Onde", label: "Onde a pessoa converte", placeholder: "Link na bio", type: "select", options: ["Link na bio", "WhatsApp direto", "Comenta uma palavra", "DM no Instagram"] },
  ],
  ideas: [
    { key: "Nicho", label: "Nicho", placeholder: "Ex: fitness feminino iniciante", required: true },
    { key: "Público", label: "Público-alvo", placeholder: "Ex: mulheres 25-40 sedentárias" },
    { key: "Objetivo", label: "Objetivo das ideias", placeholder: "Viralizar + vender", type: "select", options: ["Viralizar (alcance)", "Vender oferta", "Crescer seguidores", "Gerar leads/DMs"] },
    { key: "O que evitar", label: "O que evitar", placeholder: "Ex: nada de dança, sem aparecer rosto" },
  ],
};

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
    // Do NOT setPointerCapture here — it would redirect the click event to
    // the row and break onClick on child cards. We only capture after the
    // pointer actually starts dragging (see handlePointerMove).
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
      drag.current.pointerId = -1;
      return;
    }

    if (!current.locked) {
      current.locked = true;
      try { row.setPointerCapture(event.pointerId); } catch {}
    }
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
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [theme, setTheme] = useState<Theme>("dark");
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [, setProfile] = useState<{ full_name: string | null; username: string | null; avatar_url: string | null } | null>(null);
  const [profileAvatarUrl, setProfileAvatarUrl] = useState<string | null>(null);
  const [modules, setModules] = useState<ModuleRow[]>([]);
  const [openVideo, setOpenVideo] = useState<{ videoId: string; title: string } | null>(null);
  const [openModule, setOpenModule] = useState<ModuleRow | null>(null);
  const [activeAiTool, setActiveAiTool] = useState<AiToolId | null>(null);
  const [aiInput, setAiInput] = useState("");
  const [aiFields, setAiFields] = useState<Record<string, string>>({});
  const [aiImages, setAiImages] = useState<string[]>([]);
  const [aiResult, setAiResult] = useState("");
  const [aiError, setAiError] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiProvider, setAiProvider] = useState<"lovable" | "github">("lovable");
  const [aiLovableModel, setAiLovableModel] = useState<string>("openai/gpt-5.4-mini");
  const [aiModel, setAiModel] = useState<string>("openai/gpt-4.1");
  const [confettiTick, setConfettiTick] = useState(0);

  // Reset state on tool change
  useEffect(() => {
    setAiInput("");
    setAiFields({});
    setAiImages([]);
    setAiResult("");
    setAiError("");
  }, [activeAiTool]);

  const compressImage = (file: File): Promise<string | null> =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onerror = () => resolve(null);
      reader.onload = () => {
        const dataUrl = typeof reader.result === "string" ? reader.result : null;
        if (!dataUrl) return resolve(null);
        const img = new Image();
        img.onerror = () => resolve(dataUrl);
        img.onload = () => {
          try {
            const MAX = 1600;
            let { width, height } = img;
            if (width > MAX || height > MAX) {
              const ratio = Math.min(MAX / width, MAX / height);
              width = Math.round(width * ratio);
              height = Math.round(height * ratio);
            }
            const canvas = document.createElement("canvas");
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            if (!ctx) return resolve(dataUrl);
            ctx.drawImage(img, 0, 0, width, height);
            let quality = 0.85;
            let out = canvas.toDataURL("image/jpeg", quality);
            while (out.length > 1_800_000 && quality > 0.4) {
              quality -= 0.15;
              out = canvas.toDataURL("image/jpeg", quality);
            }
            resolve(out);
          } catch {
            resolve(dataUrl);
          }
        };
        img.src = dataUrl;
      };
      reader.readAsDataURL(file);
    });

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    const remaining = 6 - aiImages.length;
    const list = Array.from(files).slice(0, remaining);
    if (!list.length) return;
    toast.info("Processando imagens…");
    const reads = await Promise.all(
      list.map(async (f) => {
        if (f.size > 20_000_000) {
          toast.error(`${f.name} maior que 20MB`);
          return null;
        }
        const result = await compressImage(f);
        if (!result) toast.error(`Falha ao ler ${f.name}`);
        return result;
      }),
    );
    const ok = reads.filter((x): x is string => !!x);
    if (ok.length) {
      setAiImages((prev) => [...prev, ...ok].slice(0, 6));
      toast.success(`${ok.length} imagem(ns) prontas`);
    }
  };

  const runAiTool = async (tool: AiToolId, auto = false) => {
    const hasFields = Object.values(aiFields).some((v) => v && v.trim());
    const hasImages = aiImages.length > 0;
    if (!auto && !hasFields && !hasImages && !aiInput.trim()) {
      toast.error("Preencha os campos ou ative o automático");
      return;
    }
    if (tool === "competitor" && !hasImages) {
      toast.error("Anexa pelo menos 1 print do perfil — a IA não consegue abrir o link sozinha");
      return;
    }
    setAiLoading(true);
    setAiResult("");
    setAiError("");
    try {
      const res = await fetch("/api/ferramentas-ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool,
          input: aiInput,
          fields: aiFields,
          images: aiImages,
          auto,
          provider: aiProvider,
          model: aiProvider === "github" ? aiModel : aiLovableModel,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const message = data.error || "Erro ao gerar";
        setAiError(message);
        toast.error(message);
      } else {
        setAiResult(data.text || "");
        if (data.text) setConfettiTick((n) => n + 1);
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
  const [revenueGoal, setRevenueGoal] = useState<number>(5000);
  const [videoPrice, setVideoPrice] = useState<number>(500);
  const [videosDelivered, setVideosDelivered] = useState<number>(0);
  const [missionDone, setMissionDone] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [now, setNow] = useState<Date>(() => new Date(0));
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [visitCount, setVisitCount] = useState<number>(0);

  // Hydrate client-only state after mount (avoids SSR/client mismatch)
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsSidebarOpen(window.innerWidth >= 1024);
    setRevenueGoal(Number(localStorage.getItem("dash-goal") ?? "5000"));
    setVideoPrice(Number(localStorage.getItem("dash-price") ?? "500"));
    setVideosDelivered(Number(localStorage.getItem("dash-delivered") ?? "0"));
    setMissionDone(
      localStorage.getItem("dash-mission-date") === new Date().toDateString() &&
        localStorage.getItem("dash-mission-done") === "1",
    );
    setStreak(Number(localStorage.getItem("dash-streak") ?? "0"));
    setNow(new Date());
    setQuoteIndex(Math.floor(Math.random() * 12));
    const v = Number(localStorage.getItem("dash-visits") ?? "0") + 1;
    localStorage.setItem("dash-visits", String(v));
    setVisitCount(v);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % 12);
    }, 4000);
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
        const [{ data: roles }, { data: prof }] = await Promise.all([
          supabase.from("user_roles").select("role").eq("user_id", data.session.user.id),
          supabase.from("profiles").select("full_name, username, avatar_url").eq("id", data.session.user.id).maybeSingle(),
        ]);
        setIsAdmin(!!roles?.some((r: any) => r.role === "admin"));
        if (prof) {
          setProfile(prof);
          const url = await resolveAvatarUrl(prof.avatar_url);
          setProfileAvatarUrl(url);
        }
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
    position: "relative",
    zIndex: 2,
    isolation: "isolate",
    backgroundColor: isDark ? "#2b2b31" : "#ffffff",
    background: isDark
      ? "linear-gradient(160deg, #34343a 0%, #2b2b31 52%, #24242a 100%)"
      : "linear-gradient(160deg, #ffffff 0%, #fbfbfc 58%, #f0f1f4 100%)",
    border: `1.5px solid ${isDark ? "#45454d" : "#d7d9df"}`,
    opacity: 1,
    backdropFilter: "none",
    WebkitBackdropFilter: "none",
    boxShadow: isDark
      ? "0 1px 0 #56565f inset, 0 26px 60px -22px rgba(0,0,0,0.9), 0 10px 28px -18px rgba(255,122,0,0.45)"
      : "0 1px 0 #ffffff inset, 0 24px 52px -24px rgba(0,0,0,0.26), 0 10px 28px -18px rgba(255,122,0,0.28)",
  };

  const sidebarItems = [
    { id: "dashboard", label: "Visão Geral", icon: LayoutDashboard },
    { id: "members", label: "Área de Membros", icon: Users },
    { id: "bonuses", label: "Ferramentas", icon: Gift },
    { id: "prompts", label: "Prompts", icon: Wand2 },
    { id: "chat", label: "Chat ao vivo", icon: MessageCircle },
    { id: "radar", label: "Radar TIKSHOP", icon: Radar },
    { id: "flow", label: "FLOW", icon: Zap },
    { id: "conquistas", label: "Conquistas", icon: Trophy },
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
    metal: "gold" | "silver" | "rose" | "cyber-yellow" | "cyber-cyan" | "cyber-magenta" | "cyber-red" | "cyber-green";
    badge: string;
    examples: string[];
  }[] = [
    {
      id: "names",
      name: "Gerador de Nomes",
      desc: "Naming profissional para influencer UGC com cara de marca real",
      placeholder: "Ex: influencer UGC de moda fitness, 22 anos, estética premium, confiante, feminina, TikTok e Instagram",
      icon: Sparkles,
      gradient: "from-pink-400 to-rose-500",
      metal: "rose",
      badge: "NAME · GEN",
      examples: [
        "Influencer UGC de moda fitness, 22 anos, estética premium e confiante",
        "Criadora de skincare, feminina, leve, chique, 20 anos, público Brasil",
        "UGC de viagem e luxo, mulher elegante 25 anos, vibe aspiracional",
      ],
    },
    {
      id: "titles",
      name: "Títulos Virais",
      desc: "Títulos POV e ganchos para TikTok que vendem",
      placeholder: "Ex: vídeo vendendo curso de UGC, foco em mulheres que querem renda extra",
      icon: Video,
      gradient: "from-violet-400 to-purple-600",
      metal: "cyber-magenta",
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
      metal: "cyber-yellow",
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
      desc: "Cole o link + prints e receba um roteiro pronto pra clonar",
      placeholder: "Cole o link do perfil do concorrente (TikTok ou Instagram)…",
      icon: Target,
      gradient: "from-emerald-400 to-teal-600",
      metal: "cyber-green",
      badge: "SPY · CLONE",
      examples: [
        "https://www.tiktok.com/@perfil",
        "https://www.instagram.com/@perfil",
      ],
    },
    {
      id: "script",
      name: "Roteiro UGC",
      desc: "Roteiro 15-30s pronto pra gravar",
      placeholder: "Ex: roteiro vendendo whey protein, formato POV, tom divertido",
      icon: FileText,
      gradient: "from-blue-400 to-indigo-600",
      metal: "cyber-cyan",
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
      metal: "cyber-magenta",
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
      metal: "gold",
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
      metal: "cyber-cyan",
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
      className="relative isolate min-h-screen flex font-[-apple-system,BlinkMacSystemFont,'SF_Pro_Display','Inter',sans-serif] antialiased transition-colors duration-500"
      style={{ background: C.bg, color: C.text }}
    >
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
      <main className={`relative z-10 flex-1 min-w-0 min-h-screen overflow-x-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] ${isSidebarOpen ? "lg:ml-[280px]" : "ml-0"}`}>
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
              <CinematicThemeSwitcher
                isDark={isDark}
                onToggle={() => setTheme(isDark ? "light" : "dark")}
              />
              <button
                onClick={() => setProfileOpen(true)}
                aria-label="Editar perfil"
                title="Editar perfil"
                className="relative w-10 h-10 flex items-center justify-center rounded-full transition-all overflow-hidden active:scale-95"
                style={{
                  background: profileAvatarUrl ? "transparent" : `linear-gradient(135deg, ${C.accent}, #ff4500)`,
                  border: `1.5px solid ${C.border}`,
                }}
              >
                {profileAvatarUrl ? (
                  <img src={profileAvatarUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-[12px] font-bold">{initials}</span>
                )}
              </button>
            </div>
          </div>
        </header>

        {activeTab === "members" ? null : null}
        <div
          className={
            activeTab === "members" || activeTab === "chat"
              ? "w-full max-w-full overflow-x-hidden"
              : "relative z-10 px-6 lg:px-10 xl:px-14 2xl:px-20 py-8 w-full max-w-[1800px] mx-auto"
          }
          style={activeTab === "dashboard" ? { background: C.bg } : undefined}
        >
          {activeTab === "dashboard" && (() => {
            const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "criador";
            const hour = now.getHours();
            const greeting = hour < 5 ? "Boa madrugada" : hour < 12 ? "Bom dia" : hour < 18 ? "Boa tarde" : "Boa noite";
            const dayQuotes = [
              "Influencer realista vende mostrando o produto na vida real.",
              "TikTok Shop paga quem transforma atenção em compra.",
              "UGC bom não parece anúncio. Parece recomendação de amiga.",
              "Mostre o problema, teste o produto e chame para comprar.",
              "Seu vídeo precisa fazer a pessoa pensar: eu quero isso agora.",
              "IA acelera o roteiro. Você entrega a verdade na câmera.",
              "Hook forte nos 3 segundos. Prova real no resto do vídeo.",
              "Produto parado não vende. Produto em uso vira desejo.",
              "TikTok Shop não quer pose. Quer demonstração que convence.",
              "Influencer UGC vende quando fala como cliente, não como propaganda.",
              "Antes e depois vende mais que legenda bonita.",
              "Teste real, reação real, venda real.",
              "A melhor copy é simples: dor, solução, prova e oferta.",
              "Um vídeo honesto pode vender mais que um ensaio perfeito.",
              "Quem domina review curto domina TikTok Shop.",
              "Use IA para criar 10 ângulos. Grave o mais forte hoje.",
              "Não grave para agradar criador. Grave para convencer comprador.",
              "Produto bom precisa aparecer funcionando, não só na embalagem.",
              "O cliente compra quando se enxerga usando o produto.",
              "UGC de verdade mostra textura, detalhe, uso e resultado.",
              "Venda sem forçar: conte uma cena real com o produto.",
              "Se o vídeo não mostra benefício, ele só ocupa feed.",
              "TikTok Shop é vitrine. Seu roteiro é o vendedor.",
              "Criador realista ganha confiança antes de pedir o clique.",
              "A câmera frontal vira loja quando sua copy é clara.",
              "Não prometa milagre. Mostre o produto resolvendo uma dor.",
              "Quem sabe demonstrar, sabe vender.",
              "IA cria ideias. Seu rosto cria confiança.",
              "Vídeo que vende começa com uma situação que o cliente vive.",
              "A prova está no uso: abra, teste, compare, recomende.",
              "UGC forte parece conversa, mas foi escrito para vender.",
              "Cada produto precisa de um hook, uma prova e um CTA.",
              "Não venda característica. Venda o ganho que ela entrega.",
              "TikTok compra emoção rápida e prova simples.",
              "Influencer que explica bem vira máquina de conversão.",
              "Roteiro com IA, gravação real e CTA direto: fórmula de venda.",
              "Mostrou o resultado, segurou atenção, chamou para comprar.",
              "A review certa faz o carrinho parecer decisão óbvia.",
              "O comprador não quer aula. Quer motivo para clicar agora.",
              "Seu conteúdo precisa parecer espontâneo, mas vender com intenção.",
            ];
            const quote = dayQuotes[quoteIndex];

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
              {/* BANNER — Fábrica de UGC (topo) */}
              <div className="w-full overflow-hidden rounded-3xl">
                <img
                  src={bannerFabricaUgc.url}
                  alt="Seja bem-vindo à Fábrica de UGC"
                  className="block w-full h-auto"
                  loading="eager"
                />
              </div>

              {/* GREETING */}
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <div className="text-[13px] font-medium" style={{ color: C.textSubtle }}>{greeting}, criador</div>
                  <h1 className="text-[34px] sm:text-[42px] font-semibold tracking-[-0.02em] leading-tight mt-1">
                    {visitCount <= 1 ? <>Bem-vindo à fábrica, <span style={{ color: C.accent }}>{firstName}</span></> : <>De volta à fábrica, <span style={{ color: C.accent }}>{firstName}</span></>}
                  </h1>
                  <p
                    key={quoteIndex}
                    className="text-[15px] mt-2 max-w-xl italic animate-in fade-in slide-in-from-bottom-1 duration-700"
                    style={{ color: C.textMuted }}
                  >
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


              {/* COMUNIDADE FÁBRICA UGC */}
              <CommunityFeed user={user} isAdmin={isAdmin} isDark={isDark} C={C} />

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
                            <div key={it.id} onClick={() => setOpenModule(it)} className="group cursor-pointer flex items-end shrink-0 snap-start" style={{ width: "clamp(150px, 30vw, 260px)" }}>
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
                            <div key={it.id} onClick={() => setOpenModule(it)} className="group cursor-pointer shrink-0 snap-start" style={{ width: "clamp(150px, 26vw, 240px)" }}>
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

                {openModule && (
                  <ModuleDetailDialog
                    module={openModule}
                    onClose={() => setOpenModule(null)}
                    onGoToCommunity={() => setActiveTabState("community")}
                  />
                )}

              </div>
            );
          })()}

          {activeTab === "admin" && isAdmin && (
            <div className="space-y-10">
              <Suspense fallback={<div className="h-40 rounded-3xl animate-pulse" style={{ background: C.hover }} />}>
                <AdminRadarPanel C={C} />
              </Suspense>
              <AdminModulesPanel C={C} modules={modules} reload={loadModules} />
            </div>
          )}

          {activeTab === "radar" && (
            <Suspense fallback={<div className="h-40 rounded-3xl animate-pulse" style={{ background: C.hover }} />}>
              <RadarTikshop isDark={theme === "dark"} />
            </Suspense>
          )}

          {activeTab === "flow" && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
              <div>
                <div
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  <Zap className="w-3 h-3" /> NOVO
                </div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">FLOW</h1>
                <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
                  Ferramenta exclusiva pra criar fluxos de vídeo com IA em segundos.
                </p>
              </div>
              <div
                className="relative w-full overflow-hidden rounded-3xl border"
                style={{
                  borderColor: isDark ? "#45454d" : "#d7d9df",
                  background: isDark ? "#1a1a1f" : "#fff",
                  height: "calc(100vh - 240px)",
                  minHeight: 600,
                }}
              >
                <iframe
                  src="https://flowveo3.lovable.app/"
                  title="FLOW"
                  className="w-full h-full border-0"
                  allow="clipboard-read; clipboard-write; camera; microphone; fullscreen"
                />
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
                  <Sparkles className="w-3 h-3" /> IAs EXCLUSIVAS
                </div>
                <h1 className="text-[40px] font-semibold tracking-[-0.02em]">Ferramentas</h1>
                <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
                  IAs treinadas pra UGC: gere nomes, títulos virais, hashtags, roteiros e analise concorrentes em segundos.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {aiTools.map((b, i) => {
                  const Ic = b.icon;
                  const isOpening = activeAiTool === b.id;
                  return (
                    <button
                      key={b.id}
                      onClick={() => {
                        setActiveAiTool(b.id);
                        setAiInput("");
                        setAiResult("");
                        setAiError("");
                      }}
                      className="tool-card-3d group relative overflow-hidden rounded-3xl text-left"
                      style={{
                        background: isDark ? "#101013" : "#ffffff",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`,
                        boxShadow: isDark
                          ? "0 1px 0 rgba(255,255,255,0.03) inset, 0 12px 40px -20px rgba(0,0,0,0.8)"
                          : "0 1px 0 rgba(255,255,255,0.8) inset, 0 8px 28px -16px rgba(0,0,0,0.18)",
                        animation: `fadeUp 0.45s ${i * 50}ms both`,
                      }}
                    >
                      {/* Subtle top accent line */}
                      <div
                        className={`absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r ${b.gradient} opacity-60 group-hover:opacity-100 transition-opacity`}
                      />
                      {/* Hover glow */}
                      <div
                        className={`pointer-events-none absolute -top-20 -right-20 w-56 h-56 rounded-full blur-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-500 bg-gradient-to-br ${b.gradient}`}
                      />
                      {/* Opening shimmer */}
                      {isOpening && (
                        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-3xl">
                          <div
                            className="absolute inset-y-0 -left-1/2 w-1/2 opacity-60"
                            style={{
                              background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.18), transparent)",
                              animation: "shimmer 1.1s ease-in-out infinite",
                            }}
                          />
                        </div>
                      )}

                      <div className="tool-card-3d__inner relative p-6 flex flex-col h-full min-h-[200px]">
                        <div className="flex items-start justify-between gap-3">
                          <div className={`metal-icon metal-icon--${b.metal} group-hover:scale-[1.06] transition-transform duration-300`}>
                            <div className="metal-icon__mid">
                              <div className="metal-icon__face">
                                <Ic className="w-5 h-5" strokeWidth={2} />
                              </div>
                            </div>
                          </div>
                          <div
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-semibold"
                            style={{
                              background: isDark ? "rgba(52,211,153,0.1)" : "rgba(16,185,129,0.08)",
                              color: isDark ? "#34d399" : "#059669",
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Pronta
                          </div>
                        </div>

                        <h4 className="mt-5 font-semibold text-[18px] tracking-tight leading-snug" style={{ color: C.text }}>
                          {b.name}
                        </h4>
                        <p
                          className="text-[13.5px] mt-1.5 leading-relaxed line-clamp-2"
                          style={{ color: C.textMuted }}
                        >
                          {b.desc}
                        </p>

                        <div
                          className="mt-auto pt-5 flex items-center justify-between text-[13px] font-medium"
                          style={{ color: C.textMuted }}
                        >
                          <span className="inline-flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            IA dedicada
                          </span>
                          <span
                            className="inline-flex items-center gap-1 group-hover:gap-2 transition-all"
                            style={{ color: C.text }}
                          >
                            Abrir
                            <ChevronRight className="w-4 h-4" strokeWidth={2.4} />
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === "prompts" && (
            <PromptsTab isDark={isDark} C={C} />
          )}





          {activeTab === "chat" && (
            <div className="w-full animate-in fade-in duration-300" style={{ height: "calc(100vh - 64px)" }}>
              <CommunityChat user={user} isAdmin={isAdmin} isDark={isDark} C={C} fullBleed />
            </div>
          )}

          {activeTab === "conquistas" && (
            <Suspense fallback={<div className="p-8"><AiLoader /></div>}>
              <Conquistas user={user} isAdmin={isAdmin} isDark={isDark} C={C} />
            </Suspense>
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

      <ConfettiBurst trigger={confettiTick} />

      {activeAiTool && (() => {
        const tool = aiTools.find((t) => t.id === activeAiTool)!;
        const Ic = tool.icon;
        const METAL_RGB: Record<string, string> = {
          gold: "200,136,10",
          silver: "200,200,210",
          rose: "184,112,96",
          "cyber-yellow": "240,192,0",
          "cyber-cyan": "0,212,212",
          "cyber-magenta": "220,0,220",
          "cyber-red": "255,48,48",
          "cyber-green": "0,204,0",
        };
        const accent = METAL_RGB[tool.metal] ?? "255,122,0";
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
                  ? "linear-gradient(145deg, #09090a 0%, #131316 45%, #08080a 100%)"
                  : "linear-gradient(145deg, #ffffff 0%, #f4f3ee 100%)",
                border: `1px solid rgba(${accent},0.32)`,
                boxShadow: `0 46px 140px -30px rgba(${accent},0.55), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 0 60px -20px rgba(${accent},0.35) inset`,
              }}
            >
              {/* Aura colorida do tool */}
              <div
                className="pointer-events-none absolute -top-40 -right-24 w-[460px] h-[460px] rounded-full blur-3xl opacity-50"
                style={{ background: `radial-gradient(circle, rgba(${accent},0.55), transparent 65%)` }}
              />
              <div
                className="pointer-events-none absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-30"
                style={{ background: `radial-gradient(circle, rgba(${accent},0.4), transparent 65%)` }}
              />
              {/* Rail vertical tinted */}
              <div
                className="absolute left-0 top-0 h-full w-[3px] pointer-events-none"
                style={{ background: `linear-gradient(180deg, transparent, rgba(${accent},0.9), transparent)` }}
              />
              {/* Top hairline shimmer */}
              <div
                className="absolute top-0 left-0 right-0 h-[1px] pointer-events-none"
                style={{ background: `linear-gradient(90deg, transparent, rgba(${accent},0.7), transparent)` }}
              />
              {/* Grid */}
              <div
                className="absolute inset-0 opacity-[0.05] pointer-events-none"
                style={{
                  backgroundImage: isDark
                    ? "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)"
                    : "linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)",
                  backgroundSize: "28px 28px",
                  maskImage: "radial-gradient(ellipse at top, rgba(0,0,0,0.9), transparent 70%)",
                }}
              />

              <div
                className="relative px-5 sm:px-7 py-5 flex items-center justify-between"
                style={{ borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"}` }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`metal-icon metal-icon--lg metal-icon--${tool.metal} shrink-0`}>
                    <div className="metal-icon__mid">
                      <div className="metal-icon__face">
                        <Ic className="w-6 h-6" strokeWidth={2} />
                      </div>
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="w-1.5 h-1.5 rounded-full animate-pulse"
                        style={{ background: `rgb(${accent})`, boxShadow: `0 0 10px rgba(${accent},0.9)` }}
                      />
                      <span className="text-[9px] font-mono font-bold tracking-[0.2em]" style={{ color: C.textSubtle }}>
                        {tool.badge}
                      </span>
                      <span
                        className="rounded-full px-2 py-0.5 text-[9px] font-mono font-black tracking-[0.16em] border"
                        style={{
                          background: `rgba(${accent},0.10)`,
                          borderColor: `rgba(${accent},0.35)`,
                          color: isDark ? `rgb(${accent})` : C.text,
                        }}
                      >
                        PREMIUM · GERAR AUTO
                      </span>
                    </div>
                    <h3
                      className="text-[22px] sm:text-[28px] font-black tracking-tight mt-0.5 truncate"
                      style={{
                        backgroundImage: `linear-gradient(90deg, ${C.text}, rgba(${accent},0.95))`,
                        WebkitBackgroundClip: "text",
                        backgroundClip: "text",
                        color: "transparent",
                      }}
                    >
                      {tool.name}
                    </h3>
                    <p className="text-[12px] truncate" style={{ color: C.textMuted }}>{tool.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveAiTool(null)}
                  className="w-10 h-10 shrink-0 rounded-full flex items-center justify-center transition-all hover:rotate-90 hover:scale-110"
                  style={{
                    background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                    border: `1px solid rgba(${accent},0.3)`,
                    color: C.text,
                    boxShadow: `0 0 14px rgba(${accent},0.25)`,
                  }}
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
                        MELHOR IA · PRO
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
                        NEURAL IA · CORE-X
                      </button>
                    </div>
                    {aiProvider === "lovable" && (
                      <select
                        value={aiLovableModel}
                        onChange={(e) => setAiLovableModel(e.target.value)}
                        className="w-full h-10 px-3 rounded-xl text-[12px] font-mono outline-none"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)",
                          color: C.text,
                          border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        }}
                      >
                        <optgroup label="🔥 Melhor resultado">
                          <option value="openai/gpt-5.4-mini">GPT-5.4 Mini · recomendado</option>
                          <option value="openai/gpt-5.5">GPT-5.5 · máximo</option>
                          <option value="openai/gpt-5.4">GPT-5.4 · raciocínio forte</option>
                          <option value="openai/gpt-5.2">GPT-5.2 · avançado</option>
                        </optgroup>
                        <optgroup label="⚡ Rápidos">
                          <option value="openai/gpt-5-mini">GPT-5 Mini</option>
                          <option value="openai/gpt-5-nano">GPT-5 Nano</option>
                          <option value="google/gemini-3.5-flash">Gemini 3.5 Flash</option>
                          <option value="google/gemini-3-flash-preview">Gemini 3 Flash</option>
                        </optgroup>
                        <optgroup label="🧠 Gemini Pro">
                          <option value="google/gemini-2.5-pro">Gemini 2.5 Pro</option>
                          <option value="google/gemini-2.5-flash">Gemini 2.5 Flash</option>
                        </optgroup>
                      </select>
                    )}
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
                          <option value="openai/gpt-4.1">GPT-4.1 · qualidade alta</option>
                          <option value="openai/gpt-4.1-mini">GPT-4.1 Mini · rápido + barato</option>
                          <option value="deepseek/DeepSeek-R1">DeepSeek R1 · reasoning</option>
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

                  <div className="flex flex-col gap-3">
                    <div className="rainbow-btn-wrap">
                      <button
                        onClick={() => runAiTool(activeAiTool)}
                        disabled={aiLoading}
                        className="rainbow-ai-btn disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ height: 52 }}
                      >
                        <span className="rb-bloom" aria-hidden="true" />
                        {aiLoading ? (
                          <RefreshCw className="w-4 h-4 animate-spin relative z-10" />
                        ) : (
                          <Sparkles className="w-[18px] h-[18px] relative z-10" />
                        )}
                        <span className="rb-word relative z-10 tracking-wide">
                          {aiResult ? "REFAZER AGORA" : "GERAR COM IA"}
                        </span>
                      </button>
                    </div>
                    <button
                      onClick={() => runAiTool(activeAiTool, true)}
                      disabled={aiLoading}
                      className="group relative h-[44px] rounded-xl text-[12px] font-bold tracking-wide flex items-center justify-center gap-2 active:scale-[0.97] transition-all duration-200 disabled:opacity-40 overflow-hidden"
                      style={{
                        background: isDark
                          ? "linear-gradient(135deg, rgba(255,122,0,0.08), rgba(255,157,58,0.06))"
                          : "linear-gradient(135deg, rgba(255,122,0,0.06), rgba(255,157,58,0.04))",
                        color: isDark ? "#ffb366" : "#c45a00",
                        border: `1px solid ${isDark ? "rgba(255,122,0,0.22)" : "rgba(255,122,0,0.2)"}`,
                        boxShadow: isDark ? "inset 0 1px 0 0 rgba(255,122,0,0.08)" : "inset 0 1px 0 0 rgba(255,122,0,0.06)",
                      }}
                    >
                      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-orange-400/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Zap className="w-3.5 h-3.5 relative z-10 group-hover:scale-110 transition-transform duration-200" />
                      <span className="relative z-10">MODO AUTOMÁTICO — IA DECIDE TUDO</span>
                    </button>
                  </div>

                  {/* Structured fields per tool */}
                  <div className="space-y-3">
                    <div className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase" style={{ color: C.textSubtle }}>
                      &gt; Briefing
                    </div>
                    {TOOL_FIELDS[activeAiTool].map((field) => {
                      const value = aiFields[field.key] ?? "";
                      const setVal = (v: string) => setAiFields((prev) => ({ ...prev, [field.key]: v }));
                      const inputBase: CSSProperties = {
                        background: isDark ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.028)",
                        border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)"}`,
                        color: C.text,
                      };
                      return (
                        <div key={field.key} className="space-y-1.5">
                          <label className="text-[11px] font-bold flex items-center gap-1.5" style={{ color: C.textMuted }}>
                            {field.label}
                            {field.required && <span style={{ color: "#ff5a1f" }}>*</span>}
                          </label>
                          {field.type === "textarea" ? (
                            <textarea
                              value={value}
                              onChange={(e) => setVal(e.target.value.slice(0, 1500))}
                              placeholder={field.placeholder}
                              rows={3}
                              className="w-full rounded-xl px-3.5 py-2.5 text-[13px] leading-relaxed resize-none outline-none focus:ring-2 focus:ring-orange-500/30 placeholder:opacity-50"
                              style={inputBase}
                            />
                          ) : field.type === "select" ? (
                            <select
                              value={value}
                              onChange={(e) => setVal(e.target.value)}
                              className="w-full h-10 rounded-xl px-3 text-[13px] outline-none focus:ring-2 focus:ring-orange-500/30"
                              style={inputBase}
                            >
                              <option value="">— escolher —</option>
                              {field.options?.map((opt) => (
                                <option key={opt} value={opt}>{opt}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={value}
                              onChange={(e) => setVal(e.target.value.slice(0, 200))}
                              placeholder={field.placeholder}
                              className="w-full h-10 rounded-xl px-3.5 text-[13px] outline-none focus:ring-2 focus:ring-orange-500/30 placeholder:opacity-50"
                              style={inputBase}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Image upload only for competitor */}
                  {activeAiTool === "competitor" && (
                    <div className="space-y-2">
                      <div className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase flex items-center justify-between" style={{ color: C.textSubtle }}>
                        <span>&gt; Prints do perfil (recomendado)</span>
                        <span>{aiImages.length}/6</span>
                      </div>
                      <label
                        className="block rounded-2xl p-4 text-center cursor-pointer transition-all hover:opacity-80"
                        style={{
                          background: isDark ? "rgba(255,255,255,0.035)" : "rgba(0,0,0,0.024)",
                          border: `1px dashed ${isDark ? "rgba(255,122,0,0.4)" : "rgba(255,122,0,0.5)"}`,
                        }}
                      >
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          className="hidden"
                          onChange={(e) => handleImageUpload(e.target.files)}
                        />
                        <Plus className="w-5 h-5 mx-auto mb-1" style={{ color: "#ff7a00" }} />
                        <div className="text-[12px] font-bold" style={{ color: C.text }}>Anexa prints (OBRIGATÓRIO) — feed, bio, vídeos virais</div>
                        <div className="text-[10px] mt-1" style={{ color: C.textSubtle }}>A IA não abre o link sozinha. Manda print do perfil pra ela analisar · até 6 imagens · qualquer tamanho (comprimo aqui)</div>
                      </label>
                      {aiImages.length > 0 && (
                        <div className="grid grid-cols-3 gap-2">
                          {aiImages.map((src, i) => (
                            <div key={i} className="relative aspect-square rounded-xl overflow-hidden group" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
                              <img src={src} alt="" className="w-full h-full object-cover" />
                              <button
                                onClick={() => setAiImages((prev) => prev.filter((_, idx) => idx !== i))}
                                className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Optional extra notes */}
                  <details className="rounded-xl" style={{ background: isDark ? "rgba(255,255,255,0.025)" : "rgba(0,0,0,0.02)", border: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` }}>
                    <summary className="cursor-pointer px-4 py-2.5 text-[11px] font-bold" style={{ color: C.textMuted }}>
                      + Observações extras (opcional)
                    </summary>
                    <textarea
                      value={aiInput}
                      onChange={(e) => setAiInput(e.target.value.slice(0, 2000))}
                      placeholder="Qualquer detalhe extra que a IA precisa saber…"
                      rows={3}
                      className="w-full bg-transparent px-4 pb-3 text-[12px] resize-none outline-none placeholder:opacity-50"
                      style={{ color: C.text }}
                    />
                  </details>
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
                          onClick={() => runAiTool(activeAiTool)}
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
                      <div className="p-10 min-h-[360px] flex flex-col items-center justify-center gap-6">
                        <AiLoader text="Generating" />
                        <div className="text-center">
                          <div className="font-black text-[15px]">Criando resultado premium…</div>
                          <div className="text-[12px] mt-1" style={{ color: C.textMuted }}>
                            A IA está montando uma resposta objetiva.
                          </div>
                        </div>
                      </div>
                    )}

                    {aiError && !aiLoading && !aiResult && (
                      <div className="p-6 h-full flex flex-col justify-center">
                        <div className="rounded-2xl p-5" style={{ background: "rgba(255,90,31,0.1)", border: "1px solid rgba(255,90,31,0.28)" }}>
                          <div className="font-black text-[16px]">Não foi possível gerar agora</div>
                          <p className="text-[13px] mt-2 leading-relaxed" style={{ color: C.textMuted }}>{aiError}</p>
                          <button onClick={() => runAiTool(activeAiTool)} className={`mt-4 h-10 px-4 rounded-full text-[12px] font-black bg-gradient-to-r ${tool.gradient} text-white`}>
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
                          <div className="holo-wobble mx-auto mb-4">
                            <div className={`metal-icon metal-icon--lg metal-icon--${tool.metal}`}>
                              <div className="metal-icon__mid">
                                <div className="metal-icon__face">
                                  <Ic className="w-6 h-6" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
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

      <ProfileSettingsDialog
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        user={user}
        isDark={isDark}
        C={C}
        onUpdated={async (p) => {
          setProfile(p);
          const url = await resolveAvatarUrl(p.avatar_url);
          setProfileAvatarUrl(url);
          setUser((u: any) => u ? { ...u, user_metadata: { ...(u.user_metadata || {}), full_name: p.full_name, avatar_url: p.avatar_url } } : u);
        }}
      />
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
              <textarea className={inp + " md:col-span-2 min-h-[110px] py-3 leading-relaxed"} style={inpStyle as any} placeholder={"Links das aulas (1 por linha)\nEx:\nAula 1 — Introdução | https://youtu.be/abc123\nhttps://youtu.be/xyz789"} value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} />
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


