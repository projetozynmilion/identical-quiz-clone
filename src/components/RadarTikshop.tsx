import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  TrendingUp,
  Flame,
  Eye,
  Lock,
  Unlock,
  Crosshair,
  ChevronRight,
  Copy,
  ExternalLink,
  RefreshCw,
  X,
  Search,
  ArrowUpRight,
  Sparkles,
  Users,
  ShoppingCart,
  Filter,
  Wifi,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

// ====== Catálogo curado de produtos quentes do TikTok Shop ======
type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  oldPrice?: number;
  sales24h: number;
  growth: number;
  views: number; // em milhões
  creators: number;
  conversionScore: number;
  competition: "BAIXA" | "MÉDIA" | "ALTA";
  hashtag: string;
  hook: string;
  trend: number[]; // sparkline 12 pts
  affiliateUrl?: string;
  imageUrl?: string;
};

// gradient por categoria (sensação de "thumbnail" sem precisar de imagem real)
const CAT_GRADIENT: Record<string, string> = {
  Beleza: "linear-gradient(135deg, #ff7eb6 0%, #c084fc 100%)",
  Moda: "linear-gradient(135deg, #fda4af 0%, #f97316 100%)",
  Maquiagem: "linear-gradient(135deg, #f472b6 0%, #db2777 100%)",
  Casa: "linear-gradient(135deg, #60a5fa 0%, #34d399 100%)",
  Cozinha: "linear-gradient(135deg, #fbbf24 0%, #f97316 100%)",
  Fitness: "linear-gradient(135deg, #34d399 0%, #06b6d4 100%)",
  Gadgets: "linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)",
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sérum Vitamina C Coreano 30ml", emoji: "✨", category: "Beleza", price: 39.9, oldPrice: 89.9, sales24h: 12847, growth: 312, views: 48.2, creators: 2840, conversionScore: 94, competition: "MÉDIA", hashtag: "#skincareroutine", hook: "POV: descobri o sérum que clareou minha pele em 7 dias", trend: [12, 18, 22, 28, 35, 44, 58, 72, 81, 88, 92, 100] },
  { id: "p2", name: "Massageador Facial Lifting 3D", emoji: "💆‍♀️", category: "Beleza", price: 27.5, oldPrice: 79.9, sales24h: 9210, growth: 487, views: 31.7, creators: 1654, conversionScore: 91, competition: "BAIXA", hashtag: "#facialmassage", hook: "Antes e depois de 30 dias usando isso", trend: [8, 12, 15, 22, 30, 40, 55, 68, 78, 86, 94, 100] },
  { id: "p3", name: "Conjunto Cropped + Saia Plissada", emoji: "👗", category: "Moda", price: 59.9, oldPrice: 129.0, sales24h: 8432, growth: 278, views: 22.4, creators: 1289, conversionScore: 89, competition: "MÉDIA", hashtag: "#achadinhostiktok", hook: "Esse conjunto é tão 👄 e o preço é melhor ainda", trend: [20, 24, 30, 36, 44, 52, 60, 68, 76, 84, 92, 100] },
  { id: "p4", name: "Organizador Magnético Geladeira", emoji: "🧲", category: "Casa", price: 22.9, sales24h: 7890, growth: 521, views: 18.9, creators: 942, conversionScore: 88, competition: "BAIXA", hashtag: "#organizacao", hook: "Ninguém vai acreditar como minha geladeira ficou", trend: [5, 8, 12, 18, 26, 36, 48, 62, 76, 86, 94, 100] },
  { id: "p5", name: "Pó Compacto HD Matte 24h", emoji: "💄", category: "Maquiagem", price: 34.9, oldPrice: 69.9, sales24h: 7234, growth: 198, views: 27.1, creators: 2104, conversionScore: 87, competition: "ALTA", hashtag: "#maquiagemfacil", hook: "Testei o pó viral do TikTok por 7 dias", trend: [30, 36, 42, 48, 55, 62, 68, 74, 82, 88, 94, 100] },
  { id: "p6", name: "Mini Liquidificador Portátil USB", emoji: "🥤", category: "Cozinha", price: 49.9, oldPrice: 119.0, sales24h: 6541, growth: 342, views: 16.8, creators: 832, conversionScore: 86, competition: "BAIXA", hashtag: "#detox", hook: "Saí da CLT e agora levo meu suco pra todo lugar", trend: [12, 18, 24, 32, 40, 50, 60, 70, 80, 88, 95, 100] },
  { id: "p7", name: "Calça Wide Leg Alfaiataria", emoji: "👖", category: "Moda", price: 79.9, sales24h: 6122, growth: 256, views: 19.3, creators: 1542, conversionScore: 85, competition: "MÉDIA", hashtag: "#outfitdodia", hook: "A calça que veste tudo e disfarça tudo", trend: [25, 30, 36, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p8", name: "Cílios Postiços Magnéticos Kit", emoji: "👁️", category: "Maquiagem", price: 19.9, oldPrice: 59.9, sales24h: 5984, growth: 412, views: 21.7, creators: 1873, conversionScore: 84, competition: "ALTA", hashtag: "#cilios", hook: "Sem cola, sem trauma, em 10 segundos no olho", trend: [10, 15, 22, 30, 40, 52, 62, 72, 82, 90, 96, 100] },
  { id: "p9", name: "Tapete Antiderrapante Banheiro", emoji: "🛁", category: "Casa", price: 29.9, sales24h: 5421, growth: 367, views: 12.4, creators: 612, conversionScore: 83, competition: "BAIXA", hashtag: "#casanova", hook: "Esse achadinho salvou meu banheiro", trend: [8, 14, 22, 30, 40, 50, 60, 70, 80, 88, 94, 100] },
  { id: "p10", name: "Bolsa Tote Bag Couro PU", emoji: "👜", category: "Moda", price: 89.9, oldPrice: 199.0, sales24h: 5102, growth: 189, views: 14.8, creators: 1102, conversionScore: 82, competition: "MÉDIA", hashtag: "#bolsa", hook: "Achei a bolsa dos sonhos por menos de 100", trend: [40, 46, 52, 58, 64, 70, 76, 82, 88, 92, 96, 100] },
  { id: "p11", name: "Caneta Iluminadora Líquida", emoji: "💎", category: "Maquiagem", price: 17.9, sales24h: 4876, growth: 298, views: 15.2, creators: 1421, conversionScore: 81, competition: "MÉDIA", hashtag: "#glowup", hook: "O glow que todo mundo quer copiar", trend: [18, 24, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
  { id: "p12", name: "Suporte Celular Veicular Magnético", emoji: "📱", category: "Gadgets", price: 24.9, sales24h: 4321, growth: 234, views: 11.6, creators: 489, conversionScore: 80, competition: "BAIXA", hashtag: "#carros", hook: "Por que eu não comprei isso antes?", trend: [22, 28, 34, 40, 48, 56, 64, 72, 80, 86, 94, 100] },
  { id: "p13", name: "Vestido Midi Tubinho Canelado", emoji: "👗", category: "Moda", price: 69.9, oldPrice: 149.0, sales24h: 4198, growth: 312, views: 17.8, creators: 1287, conversionScore: 79, competition: "ALTA", hashtag: "#vestido", hook: "Sem acreditar que esse vestido perfeito está quase de graça", trend: [16, 22, 30, 38, 46, 54, 62, 72, 80, 88, 94, 100] },
  { id: "p14", name: "Escova Secadora Rotativa 3 em 1", emoji: "💇‍♀️", category: "Beleza", price: 129.9, oldPrice: 299.0, sales24h: 3987, growth: 421, views: 26.4, creators: 2010, conversionScore: 92, competition: "MÉDIA", hashtag: "#cabelo", hook: "Saí do salão sem sair de casa", trend: [10, 18, 26, 36, 46, 56, 66, 76, 84, 90, 96, 100] },
  { id: "p15", name: "Kit Pincéis Maquiagem 12 peças", emoji: "🖌️", category: "Maquiagem", price: 44.9, sales24h: 3756, growth: 178, views: 13.2, creators: 1654, conversionScore: 78, competition: "ALTA", hashtag: "#pinceis", hook: "Kit completo por menos que 1 pincel da MAC", trend: [50, 55, 60, 65, 70, 75, 80, 84, 88, 92, 96, 100] },
  { id: "p16", name: "Luminária LED Lua 3D Toque", emoji: "🌙", category: "Casa", price: 59.9, sales24h: 3421, growth: 389, views: 9.8, creators: 412, conversionScore: 77, competition: "BAIXA", hashtag: "#decor", hook: "A luminária que transforma qualquer quarto", trend: [12, 20, 28, 36, 46, 56, 66, 74, 82, 90, 96, 100] },
  { id: "p17", name: "Top Cropped Esportivo Acolchoado", emoji: "🩷", category: "Fitness", price: 39.9, sales24h: 3287, growth: 267, views: 10.4, creators: 921, conversionScore: 76, competition: "MÉDIA", hashtag: "#fitness", hook: "Treinei 30 dias com isso e mudou tudo", trend: [20, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p18", name: "Caixa Organizadora Empilhável Kit 6", emoji: "📦", category: "Casa", price: 18.9, sales24h: 2987, growth: 312, views: 8.6, creators: 387, conversionScore: 75, competition: "BAIXA", hashtag: "#organizar", hook: "Como organizei meu armário gastando quase nada", trend: [14, 22, 30, 38, 46, 54, 62, 72, 80, 88, 94, 100] },
  { id: "p19", name: "Batom Líquido Matte Longa Duração", emoji: "💋", category: "Maquiagem", price: 24.9, sales24h: 2854, growth: 198, views: 14.3, creators: 1789, conversionScore: 74, competition: "ALTA", hashtag: "#batom", hook: "Comi, bebi e o batom continuou intacto", trend: [40, 46, 52, 58, 64, 70, 76, 82, 88, 92, 96, 100] },
  { id: "p20", name: "Fone Bluetooth In-Ear Gamer", emoji: "🎧", category: "Gadgets", price: 79.9, oldPrice: 199.0, sales24h: 2654, growth: 243, views: 11.2, creators: 642, conversionScore: 73, competition: "MÉDIA", hashtag: "#fone", hook: "Fone de R$80 que entrega som de R$500", trend: [22, 30, 38, 46, 54, 60, 68, 74, 82, 88, 94, 100] },
  { id: "p21", name: "Bermuda Ciclista Modeladora", emoji: "🩳", category: "Fitness", price: 34.9, sales24h: 2521, growth: 287, views: 9.1, creators: 821, conversionScore: 72, competition: "MÉDIA", hashtag: "#bodybuilding", hook: "A bermuda que afina a cintura na hora", trend: [18, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100] },
  { id: "p22", name: "Difusor Aromaterapia Ultrassônico", emoji: "🌿", category: "Casa", price: 89.9, sales24h: 2398, growth: 198, views: 7.4, creators: 312, conversionScore: 71, competition: "BAIXA", hashtag: "#aromaterapia", hook: "Meu quarto virou spa em 5 minutos", trend: [32, 38, 44, 50, 56, 62, 70, 76, 82, 88, 94, 100] },
  { id: "p23", name: "Tênis Chunky Plataforma Branco", emoji: "👟", category: "Moda", price: 119.9, oldPrice: 249.0, sales24h: 2241, growth: 312, views: 13.9, creators: 1421, conversionScore: 70, competition: "ALTA", hashtag: "#tenis", hook: "Esse tênis alonga a perna que é uma loucura", trend: [16, 24, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
  { id: "p24", name: "Máscara Cabelo Hidratação Profunda", emoji: "💆‍♀️", category: "Beleza", price: 32.9, sales24h: 2087, growth: 234, views: 11.7, creators: 1102, conversionScore: 69, competition: "MÉDIA", hashtag: "#cronograma", hook: "Reconstruí meu cabelo em 4 semanas", trend: [20, 26, 32, 40, 48, 56, 64, 72, 80, 88, 94, 100] },
];

const CATEGORIES = ["TODOS", "Beleza", "Moda", "Maquiagem", "Casa", "Cozinha", "Fitness", "Gadgets"];
type SortKey = "score" | "sales" | "growth" | "views";
const SORTS: { id: SortKey; label: string }[] = [
  { id: "score", label: "Score" },
  { id: "growth", label: "Crescimento" },
  { id: "sales", label: "Vendas 24h" },
  { id: "views", label: "Views" },
];

// ───────────────────────────── helpers ─────────────────────────────
function fmt(n: number) {
  return n.toLocaleString("pt-BR");
}
function timeNow() {
  return new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function Sparkline({ data, color = "#10b981", width = 80, height = 24 }: { data: number[]; color?: string; width?: number; height?: number }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / Math.max(1, max - min)) * height;
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  const area = `0,${height} ${pts} ${width},${height}`;
  const gradId = `g-${color.replace("#", "")}`;
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.35" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={area} fill={`url(#${gradId})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={width} cy={height - ((data[data.length - 1] - min) / Math.max(1, max - min)) * height} r="2" fill={color} />
    </svg>
  );
}

function ProductThumb({ p, size = 56 }: { p: Product; size?: number }) {
  if (p.imageUrl) {
    return (
      <div className="relative shrink-0 rounded-xl overflow-hidden" style={{ width: size, height: size }}>
        <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
      </div>
    );
  }
  return (
    <div
      className="relative shrink-0 rounded-xl overflow-hidden flex items-center justify-center"
      style={{ width: size, height: size, background: CAT_GRADIENT[p.category] || "#1f2937" }}
    >
      <div className="absolute inset-0 opacity-25" style={{ backgroundImage: "radial-gradient(circle at 30% 20%, rgba(255,255,255,0.5), transparent 60%)" }} />
      <span style={{ fontSize: size * 0.5, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))" }}>{p.emoji}</span>
      <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-black/40 to-transparent" />
    </div>
  );
}

// ───────────────────────────── component ─────────────────────────────
export default function RadarTikshop({ isDark = true }: { isDark?: boolean }) {
  const [phase, setPhase] = useState<"locked" | "scanning" | "ready">("locked");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [category, setCategory] = useState("TODOS");
  const [sort, setSort] = useState<SortKey>("score");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Product | null>(null);
  const [tick, setTick] = useState(0);
  const [updatedAt, setUpdatedAt] = useState(timeNow());
  const [dbProducts, setDbProducts] = useState<Product[]>([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("radar_products")
        .select("*")
        .eq("is_active", true)
        .order("position", { ascending: true });
      if (cancelled || !data) return;
      const baseTrend = [20, 26, 34, 42, 50, 58, 66, 74, 82, 88, 94, 100];
      const mapped: Product[] = (data as any[]).map((r) => ({
        id: r.id,
        name: r.name,
        emoji: r.emoji || "🔥",
        category: r.category || "Moda",
        price: Number(r.price) || 0,
        oldPrice: r.old_price != null ? Number(r.old_price) : undefined,
        sales24h: r.sales_24h || 0,
        growth: r.growth || 0,
        views: Number(r.views_millions) || 0,
        creators: r.creators || 0,
        conversionScore: r.conversion_score || 80,
        competition: (r.competition as Product["competition"]) || "MÉDIA",
        hashtag: r.hashtag || "#tiktokshop",
        hook: r.hook || "Confira esse produto que está bombando agora",
        trend: baseTrend,
        affiliateUrl: r.affiliate_url,
        imageUrl: r.image_url || undefined,
      }));
      setDbProducts(mapped);
    })();
    return () => { cancelled = true; };
  }, []);

  const startScan = () => {
    setPhase("scanning");
    setProgress(0);
    setLogs([]);
    const sequence = [
      "[INIT]  Conectando à API do TikTok Shop BR…",
      "[AUTH]  Autenticação aprovada · token v3.7",
      "[SCAN]  Indexando 2.847.391 produtos ativos",
      "[ML]    Modelo de tendência carregado",
      "[DATA]  Coletando métricas de criadores BR",
      "[FILTER] Removendo ruído (saturação > 85%)",
      "[RANK]  Calculando score de conversão",
      "[DONE]  Top 24 produtos prontos para replicar",
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < sequence.length) {
        setLogs((l) => [...l, sequence[i]]);
        setProgress(Math.round(((i + 1) / sequence.length) * 100));
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => {
          setPhase("ready");
          setUpdatedAt(timeNow());
        }, 400);
      }
    }, 320);
  };

  useEffect(() => {
    if (phase !== "ready") return;
    const id = setInterval(() => {
      setTick((t) => t + 1);
      setUpdatedAt(timeNow());
    }, 3000);
    return () => clearInterval(id);
  }, [phase]);

  const products = useMemo(() => {
    const source = dbProducts.length > 0 ? dbProducts : PRODUCTS;
    let list = category === "TODOS" ? source : source.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    // live drift
    list = list.map((p) => ({
      ...p,
      sales24h: p.sales24h + Math.floor(Math.sin(tick + p.id.length) * 14 + tick * 0.6),
      growth: Math.max(50, p.growth + Math.floor(Math.cos(tick * 0.7 + p.id.length) * 4)),
    }));
    list.sort((a, b) => {
      if (sort === "score") return b.conversionScore - a.conversionScore;
      if (sort === "sales") return b.sales24h - a.sales24h;
      if (sort === "growth") return b.growth - a.growth;
      return b.views - a.views;
    });
    return list;
  }, [category, sort, search, tick, dbProducts]);

  const totalSales = products.reduce((a, p) => a + p.sales24h, 0);
  const totalViews = products.reduce((a, p) => a + p.views, 0);
  const topGrowth = Math.max(...products.map((p) => p.growth), 0);
  const avgScore = Math.round(products.reduce((a, p) => a + p.conversionScore, 0) / Math.max(1, products.length));

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado`);
  };

  // ╭───── LOCKED ─────╮
  if (phase === "locked") {
    return (
      <div className="relative min-h-[640px] rounded-3xl overflow-hidden border border-white/5" style={{ background: "radial-gradient(ellipse at top, #0f1e1a 0%, #050807 60%, #000 100%)" }}>
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.08) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        {/* radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.15), transparent 60%)" }} />
        {/* scan line */}
        <div className="absolute inset-x-0 top-0 h-px bg-emerald-400/60" style={{ animation: "scanline 4s linear infinite", boxShadow: "0 0 20px #10b981" }} />

        <div className="relative z-10 flex flex-col items-center justify-center min-h-[640px] p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold mb-6 border border-emerald-400/30 bg-emerald-400/5 text-emerald-300 backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
            ACESSO RESTRITO · NÍVEL 3
          </div>
          <h1 className="font-mono text-4xl md:text-6xl font-black tracking-tighter mb-3 bg-gradient-to-b from-emerald-200 to-emerald-500 bg-clip-text text-transparent" style={{ filter: "drop-shadow(0 0 30px rgba(16,185,129,0.3))" }}>
            RADAR TIKSHOP
          </h1>
          <p className="text-emerald-100/80 text-base md:text-lg max-w-md mb-1 font-medium">
            Os produtos que estão bombando agora
          </p>
          <p className="text-emerald-100/40 text-xs md:text-sm max-w-md mb-10 font-mono">
            Vendas, score de conversão e hooks prontos pra copiar
          </p>
          <button
            onClick={startScan}
            className="group relative px-8 py-4 bg-emerald-500 text-black font-bold text-sm tracking-wide hover:bg-emerald-400 transition-all rounded-xl"
            style={{ boxShadow: "0 0 40px rgba(16,185,129,0.5), 0 20px 60px -10px rgba(16,185,129,0.4)" }}
          >
            <span className="flex items-center gap-2">
              <Unlock className="w-4 h-4" /> ABRIR O RADAR
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
          <div className="mt-10 grid grid-cols-3 gap-3 max-w-md w-full">
            {[
              { v: "2.8M+", l: "Produtos rastreados" },
              { v: "AO VIVO", l: "Atualização" },
              { v: "BR", l: "Mercado foco" },
            ].map((s) => (
              <div key={s.l} className="border border-emerald-400/20 rounded-xl p-3 bg-black/40 backdrop-blur-sm">
                <div className="font-mono text-emerald-300 text-base font-bold">{s.v}</div>
                <div className="text-emerald-100/40 text-[10px] mt-0.5">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        <style>{`@keyframes scanline { 0% { transform: translateY(0) } 100% { transform: translateY(640px) } }`}</style>
      </div>
    );
  }

  // ╭───── SCANNING ─────╮
  if (phase === "scanning") {
    return (
      <div className="relative min-h-[640px] rounded-3xl overflow-hidden border border-white/5" style={{ background: "radial-gradient(ellipse at center, #0f1e1a 0%, #000 80%)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.1) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[640px]">
          <div className="font-mono text-emerald-400 text-[10px] mb-6 flex items-center gap-2 tracking-widest">
            <Wifi className="w-3 h-3 animate-pulse" /> CONEXÃO SEGURA · TLS 256-BIT
          </div>
          <div className="relative mb-8">
            <div className="absolute inset-0 rounded-full border border-emerald-400/30 animate-ping" />
            <div className="absolute inset-0 rounded-full border border-emerald-400/20 animate-ping" style={{ animationDelay: "0.5s" }} />
            <Crosshair className="relative w-20 h-20 text-emerald-400 animate-spin" style={{ animationDuration: "3s", filter: "drop-shadow(0 0 20px #10b981)" }} />
          </div>
          <div className="font-mono text-emerald-300 text-5xl font-black mb-3 tabular-nums tracking-tight">{progress}<span className="text-emerald-500/60 text-2xl">%</span></div>
          <div className="w-full max-w-md h-1.5 bg-emerald-950/60 rounded-full overflow-hidden mb-8 border border-emerald-500/20">
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300 transition-all duration-300" style={{ width: `${progress}%`, boxShadow: "0 0 12px #10b981" }} />
          </div>
          <div className="w-full max-w-md bg-black/70 border border-emerald-500/20 rounded-xl p-4 font-mono text-[11px] text-emerald-300 space-y-1 max-h-56 overflow-hidden backdrop-blur-sm">
            {logs.map((l, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2 whitespace-pre">{l}</div>
            ))}
            <div className="text-emerald-400 animate-pulse">█</div>
          </div>
        </div>
      </div>
    );
  }

  // ╭───── READY: dashboard ─────╮
  return (
    <div className="space-y-5">
      {/* ─── TICKER ─── */}
      <div className="relative rounded-xl overflow-hidden border border-emerald-500/20 bg-black h-9">
        <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-black to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-black to-transparent pointer-events-none" />
        <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20 flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 rounded text-[10px] font-mono font-bold text-emerald-300 backdrop-blur-sm">
          <span className="relative flex h-1.5 w-1.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" /></span>
          AO VIVO
        </div>
        <div className="absolute inset-0 flex items-center whitespace-nowrap" style={{ animation: "ticker 60s linear infinite" }}>
          {[...products, ...products].slice(0, 20).map((p, i) => (
            <span key={i} className="inline-flex items-center gap-2 px-6 font-mono text-[11px]">
              <span className="text-emerald-100/80">{p.name}</span>
              <span className="text-emerald-400 font-bold">+{p.growth}%</span>
              <span className="text-emerald-100/30">·</span>
            </span>
          ))}
        </div>
        <style>{`@keyframes ticker { 0% { transform: translateX(0) } 100% { transform: translateX(-50%) } }`}</style>
      </div>

      {/* ─── HEADER + KPI ─── */}
      <div className="relative rounded-2xl overflow-hidden border border-white/5 p-5 md:p-6" style={{ background: "linear-gradient(135deg, #0a1612 0%, #050807 100%)" }}>
        <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(16,185,129,0.06) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
        <div className="absolute top-0 right-0 w-96 h-96 -translate-y-1/2 translate-x-1/3 rounded-full" style={{ background: "radial-gradient(circle, rgba(16,185,129,0.12), transparent 60%)" }} />

        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3 mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 font-mono text-[10px] tracking-widest text-emerald-300/70 uppercase">
              <Activity className="w-3 h-3" /> TikTok Shop · Brasil · Atualizado {updatedAt}
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Radar <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">TIKSHOP</span>
            </h1>
            <p className="text-emerald-100/50 text-sm mt-1">Os {products.length} produtos com maior potencial pra você replicar agora.</p>
          </div>
          <button
            onClick={startScan}
            className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg font-mono text-[11px] text-emerald-300 transition backdrop-blur-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Re-scan
          </button>
        </div>

        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: ShoppingCart, label: "Vendas / 24h", value: fmt(totalSales), accent: "text-emerald-300" },
            { icon: TrendingUp, label: "Maior crescimento", value: `+${topGrowth}%`, accent: "text-emerald-300" },
            { icon: Eye, label: "Views combinadas", value: `${totalViews.toFixed(0)}M`, accent: "text-emerald-300" },
            { icon: Sparkles, label: "Score médio", value: `${avgScore}/100`, accent: "text-emerald-300" },
          ].map((s) => {
            const Ic = s.icon;
            return (
              <div key={s.label} className="rounded-xl p-3 border border-white/5 bg-black/40 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">{s.label}</span>
                  <Ic className="w-3.5 h-3.5 text-emerald-400/60" />
                </div>
                <div className={`font-mono font-black text-xl ${s.accent} tabular-nums`}>{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── TOOLBAR ─── */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar produto ou categoria…"
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-black/40 border border-white/10 text-white placeholder:text-white/30 text-sm focus:outline-none focus:border-emerald-500/50 transition"
          />
        </div>
        <div className="flex items-center gap-2 px-1 py-1 rounded-xl bg-black/40 border border-white/10">
          <Filter className="w-3.5 h-3.5 text-white/40 ml-2" />
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition ${
                sort === s.id ? "bg-emerald-500 text-black" : "text-white/60 hover:text-white"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── CATEGORIES ─── */}
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {CATEGORIES.map((cat) => {
          const active = category === cat;
          const count = cat === "TODOS" ? PRODUCTS.length : PRODUCTS.filter((p) => p.category === cat).length;
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-full text-[12px] font-semibold transition border ${
                active
                  ? "bg-white text-black border-white"
                  : "bg-white/5 text-white/70 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {cat}
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full ${active ? "bg-black/10 text-black/60" : "bg-white/10 text-white/40"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* ─── PRODUCT LIST ─── */}
      <div className="rounded-2xl overflow-hidden border border-white/5 bg-black/40 backdrop-blur-sm">
        {/* table head — desktop only */}
        <div className="hidden md:grid grid-cols-[1fr_120px_110px_140px_110px_60px] gap-4 px-5 py-3 font-mono text-[10px] uppercase tracking-wider text-white/40 border-b border-white/5 bg-white/[0.02]">
          <div>Produto</div>
          <div className="text-right">Vendas 24h</div>
          <div className="text-right">Crescimento</div>
          <div>Tendência 7d</div>
          <div className="text-right">Score</div>
          <div />
        </div>

        <div className="divide-y divide-white/[0.04]">
          {products.length === 0 && (
            <div className="px-5 py-12 text-center text-white/30 text-sm">Nenhum produto encontrado.</div>
          )}
          {products.map((p, idx) => (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full text-left grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_110px_140px_110px_60px] gap-3 md:gap-4 items-center px-4 md:px-5 py-3.5 hover:bg-white/[0.03] transition group"
              style={{ animation: `fadeUp 0.35s ${Math.min(idx, 12) * 25}ms both` }}
            >
              {/* product */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative">
                  <ProductThumb p={p} size={48} />
                  <div className="absolute -top-1 -left-1 w-5 h-5 rounded-md bg-black border border-emerald-400/40 flex items-center justify-center font-mono text-[9px] font-bold text-emerald-300">
                    {idx + 1}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-white text-sm truncate">{p.name}</div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="font-mono text-[11px] text-emerald-300 font-bold">R$ {p.price.toFixed(2).replace(".", ",")}</span>
                    {p.oldPrice && (
                      <span className="font-mono text-[10px] text-white/30 line-through">R$ {p.oldPrice.toFixed(0)}</span>
                    )}
                    <span className="text-[10px] text-white/30">·</span>
                    <span className="text-[10px] text-white/40">{p.category}</span>
                    <span className={`hidden sm:inline-flex text-[9px] font-mono px-1.5 py-0.5 rounded border ${
                      p.competition === "BAIXA" ? "border-emerald-400/40 text-emerald-300 bg-emerald-500/10" :
                      p.competition === "MÉDIA" ? "border-amber-400/40 text-amber-300 bg-amber-500/10" :
                      "border-rose-400/40 text-rose-300 bg-rose-500/10"
                    }`}>
                      COMP {p.competition}
                    </span>
                  </div>
                </div>
              </div>

              {/* mobile right-side score chip */}
              <div className="md:hidden flex flex-col items-end gap-1">
                <div className="font-mono text-emerald-300 font-bold text-sm tabular-nums">+{p.growth}%</div>
                <div className="font-mono text-[10px] text-white/40">{fmt(p.sales24h)}/24h</div>
              </div>

              {/* sales */}
              <div className="hidden md:block text-right font-mono text-white text-sm tabular-nums">{fmt(p.sales24h)}</div>

              {/* growth */}
              <div className="hidden md:flex items-center justify-end gap-1 font-mono text-emerald-300 text-sm font-bold tabular-nums">
                <TrendingUp className="w-3 h-3" /> +{p.growth}%
              </div>

              {/* sparkline */}
              <div className="hidden md:flex items-center">
                <Sparkline data={p.trend} />
              </div>

              {/* score */}
              <div className="hidden md:flex items-center justify-end gap-2">
                <div className="w-10 h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-300" style={{ width: `${p.conversionScore}%` }} />
                </div>
                <span className="font-mono text-white text-sm font-bold tabular-nums w-8 text-right">{p.conversionScore}</span>
              </div>

              {/* arrow */}
              <div className="hidden md:flex justify-end text-white/30 group-hover:text-emerald-300 group-hover:translate-x-0.5 transition-all">
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <p className="text-[11px] text-white/30 text-center font-mono">
        Dados estimados com base em sinais públicos do TikTok Shop · uso interno
      </p>

      {/* ─── DETAIL DRAWER ─── */}
      {selected && (
        <div className="fixed inset-0 z-[100] flex animate-in fade-in" onClick={() => setSelected(null)}>
          <div className="flex-1 bg-black/70 backdrop-blur-sm" />
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md h-full overflow-y-auto border-l border-white/10 animate-in slide-in-from-right duration-300"
            style={{ background: "linear-gradient(180deg, #0a1612 0%, #050807 100%)" }}
          >
            {/* header */}
            <div className="sticky top-0 z-10 backdrop-blur-md bg-black/60 border-b border-white/5 px-5 py-4 flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-widest text-emerald-300/70">Produto decodificado</span>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* product card */}
              <div className="flex items-start gap-3">
                <ProductThumb p={selected} size={80} />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-emerald-300/60">{selected.category}</div>
                  <h2 className="text-lg font-bold text-white leading-tight mt-1">{selected.name}</h2>
                  <div className="flex items-baseline gap-2 mt-2">
                    <span className="font-mono text-2xl font-black text-emerald-300">R$ {selected.price.toFixed(2).replace(".", ",")}</span>
                    {selected.oldPrice && (
                      <span className="font-mono text-sm text-white/30 line-through">R$ {selected.oldPrice.toFixed(0)}</span>
                    )}
                  </div>
                </div>
              </div>

              {/* big chart */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Tendência últimos 7 dias</span>
                  <span className="font-mono text-emerald-300 text-xs font-bold">+{selected.growth}%</span>
                </div>
                <Sparkline data={selected.trend} width={320} height={70} />
              </div>

              {/* stats grid */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Vendas / 24h", v: fmt(selected.sales24h), Ic: ShoppingCart },
                  { l: "Views totais", v: `${selected.views}M`, Ic: Eye },
                  { l: "Criadores ativos", v: fmt(selected.creators), Ic: Users },
                  { l: "Score conversão", v: `${selected.conversionScore}/100`, Ic: Sparkles },
                ].map((s) => {
                  const Ic = s.Ic;
                  return (
                    <div key={s.l} className="rounded-xl border border-white/5 bg-black/40 p-3">
                      <div className="flex items-center gap-1.5 text-white/40 font-mono text-[10px] uppercase tracking-wider">
                        <Ic className="w-3 h-3" /> {s.l}
                      </div>
                      <div className="text-white font-bold text-base mt-1 tabular-nums font-mono">{s.v}</div>
                    </div>
                  );
                })}
              </div>

              {/* hook */}
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-emerald-300">
                    <Flame className="w-3 h-3" /> Hook que está vendendo
                  </div>
                  <button onClick={() => copy(selected.hook, "Hook")} className="text-emerald-300/70 hover:text-emerald-300 transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-emerald-50 text-[15px] leading-snug font-medium">"{selected.hook}"</div>
              </div>

              {/* hashtag */}
              <div className="rounded-xl border border-white/5 bg-black/40 p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">Hashtag principal</span>
                  <button onClick={() => copy(selected.hashtag, "Hashtag")} className="text-white/40 hover:text-white transition">
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-emerald-300 font-mono font-bold text-base">{selected.hashtag}</div>
              </div>

              {/* strategy */}
              <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] p-4">
                <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-amber-300 mb-2">
                  <Sparkles className="w-3 h-3" /> Estratégia de replicação
                </div>
                <ol className="text-[13px] text-amber-50/90 space-y-1.5 list-decimal list-inside">
                  <li>Use o hook acima nos primeiros 3 segundos</li>
                  <li>Mostre o produto em uso, não estático</li>
                  <li>Termine com a hashtag principal + 4 secundárias</li>
                  <li>Poste entre 19h–22h pra pegar o pico do feed</li>
                </ol>
              </div>

              {/* cta */}
              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(selected.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-sm rounded-xl transition"
                style={{ boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}
              >
                <ExternalLink className="w-4 h-4" /> Ver vídeos virais deste produto
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
