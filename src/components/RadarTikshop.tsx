import { useEffect, useMemo, useRef, useState } from "react";
import {
  Radar,
  Activity,
  TrendingUp,
  Flame,
  Zap,
  Eye,
  ShoppingBag,
  Lock,
  Unlock,
  Signal,
  Crosshair,
  ChevronRight,
  Copy,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { toast } from "sonner";

// ====== MOCK DATA — produtos quentes do TikTok Shop ======
type Product = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  price: number;
  sales24h: number;
  growth: number; // %
  views: string;
  creators: number;
  conversionScore: number; // 0-100
  competition: "BAIXA" | "MÉDIA" | "ALTA";
  hashtag: string;
  hook: string;
};

const PRODUCTS: Product[] = [
  { id: "p1", name: "Sérum Vitamina C Coreano", emoji: "✨", category: "Beleza", price: 39.9, sales24h: 12847, growth: 312, views: "48.2M", creators: 2840, conversionScore: 94, competition: "MÉDIA", hashtag: "#skincareroutine", hook: "POV: descobri o sérum que clareou minha pele em 7 dias" },
  { id: "p2", name: "Mini Massageador Facial Lifting", emoji: "💆‍♀️", category: "Beleza", price: 27.5, sales24h: 9210, growth: 487, views: "31.7M", creators: 1654, conversionScore: 91, competition: "BAIXA", hashtag: "#facialmassage", hook: "Antes e depois de 30 dias usando isso" },
  { id: "p3", name: "Conjunto Cropped + Saia Plissada", emoji: "👗", category: "Moda", price: 59.9, sales24h: 8432, growth: 278, views: "22.4M", creators: 1289, conversionScore: 89, competition: "MÉDIA", hashtag: "#achadinhostiktok", hook: "Esse conjunto é tão 👄 e o preço é melhor ainda" },
  { id: "p4", name: "Organizador Magnético Geladeira", emoji: "🧲", category: "Casa", price: 22.9, sales24h: 7890, growth: 521, views: "18.9M", creators: 942, conversionScore: 88, competition: "BAIXA", hashtag: "#organizacao", hook: "Ninguém vai acreditar como minha geladeira ficou" },
  { id: "p5", name: "Pó Compacto HD Matte 24h", emoji: "💄", category: "Maquiagem", price: 34.9, sales24h: 7234, growth: 198, views: "27.1M", creators: 2104, conversionScore: 87, competition: "ALTA", hashtag: "#maquiagemfacil", hook: "Testei o pó viral do TikTok por 7 dias" },
  { id: "p6", name: "Mini Liquidificador Portátil USB", emoji: "🥤", category: "Cozinha", price: 49.9, sales24h: 6541, growth: 342, views: "16.8M", creators: 832, conversionScore: 86, competition: "BAIXA", hashtag: "#detox", hook: "Saí da CLT e agora levo meu suco pra todo lugar" },
  { id: "p7", name: "Calça Wide Leg Alfaiataria", emoji: "👖", category: "Moda", price: 79.9, sales24h: 6122, growth: 256, views: "19.3M", creators: 1542, conversionScore: 85, competition: "MÉDIA", hashtag: "#outfitdodia", hook: "A calça que veste tudo e disfarça tudo" },
  { id: "p8", name: "Cílios Postiços Magnéticos", emoji: "👁️", category: "Maquiagem", price: 19.9, sales24h: 5984, growth: 412, views: "21.7M", creators: 1873, conversionScore: 84, competition: "ALTA", hashtag: "#cilios", hook: "Sem cola, sem trauma, em 10 segundos no olho" },
  { id: "p9", name: "Tapete Antiderrapante Banheiro", emoji: "🛁", category: "Casa", price: 29.9, sales24h: 5421, growth: 367, views: "12.4M", creators: 612, conversionScore: 83, competition: "BAIXA", hashtag: "#casanova", hook: "Esse achadinho salvou meu banheiro" },
  { id: "p10", name: "Bolsa Tote Bag Couro PU", emoji: "👜", category: "Moda", price: 89.9, sales24h: 5102, growth: 189, views: "14.8M", creators: 1102, conversionScore: 82, competition: "MÉDIA", hashtag: "#bolsa", hook: "Achei a bolsa dos sonhos por menos de 100" },
  { id: "p11", name: "Caneta Iluminadora Líquida", emoji: "💎", category: "Maquiagem", price: 17.9, sales24h: 4876, growth: 298, views: "15.2M", creators: 1421, conversionScore: 81, competition: "MÉDIA", hashtag: "#glowup", hook: "O glow que todo mundo quer copiar" },
  { id: "p12", name: "Suporte Celular Veicular Magnético", emoji: "📱", category: "Gadgets", price: 24.9, sales24h: 4321, growth: 234, views: "11.6M", creators: 489, conversionScore: 80, competition: "BAIXA", hashtag: "#carros", hook: "Por que eu não comprei isso antes?" },
  { id: "p13", name: "Vestido Midi Tubinho Canelado", emoji: "👗", category: "Moda", price: 69.9, sales24h: 4198, growth: 312, views: "17.8M", creators: 1287, conversionScore: 79, competition: "ALTA", hashtag: "#vestido", hook: "Sem acreditar que esse vestido perfeito está quase de graça" },
  { id: "p14", name: "Escova Secadora Rotativa 3 em 1", emoji: "💇‍♀️", category: "Beleza", price: 129.9, sales24h: 3987, growth: 421, views: "26.4M", creators: 2010, conversionScore: 92, competition: "MÉDIA", hashtag: "#cabelo", hook: "Saí do salão sem sair de casa" },
  { id: "p15", name: "Kit Pincéis Maquiagem 12 peças", emoji: "🖌️", category: "Maquiagem", price: 44.9, sales24h: 3756, growth: 178, views: "13.2M", creators: 1654, conversionScore: 78, competition: "ALTA", hashtag: "#pinceis", hook: "Kit completo por menos que 1 pincel da MAC" },
  { id: "p16", name: "Luminária LED Lua 3D Toque", emoji: "🌙", category: "Casa", price: 59.9, sales24h: 3421, growth: 389, views: "9.8M", creators: 412, conversionScore: 77, competition: "BAIXA", hashtag: "#decor", hook: "A luminária que transforma qualquer quarto" },
  { id: "p17", name: "Top Cropped Esportivo Acolchoado", emoji: "🩷", category: "Fitness", price: 39.9, sales24h: 3287, growth: 267, views: "10.4M", creators: 921, conversionScore: 76, competition: "MÉDIA", hashtag: "#fitness", hook: "Treinei 30 dias com isso e mudou tudo" },
  { id: "p18", name: "Caixa Organizadora Empilhável", emoji: "📦", category: "Casa", price: 18.9, sales24h: 2987, growth: 312, views: "8.6M", creators: 387, conversionScore: 75, competition: "BAIXA", hashtag: "#organizar", hook: "Como organizei meu armário gastando quase nada" },
  { id: "p19", name: "Batom Líquido Matte Longa Duração", emoji: "💋", category: "Maquiagem", price: 24.9, sales24h: 2854, growth: 198, views: "14.3M", creators: 1789, conversionScore: 74, competition: "ALTA", hashtag: "#batom", hook: "Comi, bebi e o batom continuou intacto" },
  { id: "p20", name: "Fone Bluetooth In-Ear Gamer", emoji: "🎧", category: "Gadgets", price: 79.9, sales24h: 2654, growth: 243, views: "11.2M", creators: 642, conversionScore: 73, competition: "MÉDIA", hashtag: "#fone", hook: "Fone de R$80 que entrega som de R$500" },
  { id: "p21", name: "Bermuda Ciclista Modeladora", emoji: "🩳", category: "Fitness", price: 34.9, sales24h: 2521, growth: 287, views: "9.1M", creators: 821, conversionScore: 72, competition: "MÉDIA", hashtag: "#bodybuilding", hook: "A bermuda que afina a cintura na hora" },
  { id: "p22", name: "Difusor Aromaterapia Ultrassônico", emoji: "🌿", category: "Casa", price: 89.9, sales24h: 2398, growth: 198, views: "7.4M", creators: 312, conversionScore: 71, competition: "BAIXA", hashtag: "#aromaterapia", hook: "Meu quarto virou spa em 5 minutos" },
  { id: "p23", name: "Tênis Chunky Plataforma", emoji: "👟", category: "Moda", price: 119.9, sales24h: 2241, growth: 312, views: "13.9M", creators: 1421, conversionScore: 70, competition: "ALTA", hashtag: "#tenis", hook: "Esse tênis alonga a perna que é uma loucura" },
  { id: "p24", name: "Máscara Cabelo Hidratação Profunda", emoji: "💆‍♀️", category: "Beleza", price: 32.9, sales24h: 2087, growth: 234, views: "11.7M", creators: 1102, conversionScore: 69, competition: "MÉDIA", hashtag: "#cronograma", hook: "Reconstruí meu cabelo em 4 semanas" },
];

const CATEGORIES = ["TODOS", "Beleza", "Moda", "Maquiagem", "Casa", "Cozinha", "Fitness", "Gadgets"];

// Matrix code rain
function MatrixRain() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    const chars = "アイウエオカキクケコサシスセソ01ABCDEF#$%TIKSHOP";
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops = Array.from({ length: columns }, () => Math.random() * -50);
    const draw = () => {
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#00ff88";
      ctx.font = `${fontSize}px monospace`;
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
      }
    };
    const id = setInterval(draw, 55);
    return () => {
      clearInterval(id);
      window.removeEventListener("resize", resize);
    };
  }, []);
  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-25" />;
}

export default function RadarTikshop({ isDark }: { isDark: boolean }) {
  const [phase, setPhase] = useState<"locked" | "scanning" | "ready">("locked");
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);
  const [category, setCategory] = useState("TODOS");
  const [selected, setSelected] = useState<Product | null>(null);
  const [tick, setTick] = useState(0);

  // Boot scan sequence
  const startScan = () => {
    setPhase("scanning");
    setProgress(0);
    setLogs([]);
    const sequence = [
      "[INIT] Conectando ao TikTok Shop API...",
      "[AUTH] Bypass de autenticação OK",
      "[SCAN] Indexando 2.847.391 produtos ativos",
      "[ML] Carregando modelo de tendência v3.7",
      "[DATA] Extraindo métricas de criadores BR",
      "[FILTER] Removendo ruído (saturação > 85%)",
      "[RANK] Calculando score de conversão",
      "[DONE] Top produtos prontos para replicar",
    ];
    let i = 0;
    const id = setInterval(() => {
      if (i < sequence.length) {
        setLogs((l) => [...l, sequence[i]]);
        setProgress(Math.round(((i + 1) / sequence.length) * 100));
        i++;
      } else {
        clearInterval(id);
        setTimeout(() => setPhase("ready"), 400);
      }
    }, 380);
  };

  // Live tick — atualiza números pra dar sensação de "real-time"
  useEffect(() => {
    if (phase !== "ready") return;
    const id = setInterval(() => setTick((t) => t + 1), 2500);
    return () => clearInterval(id);
  }, [phase]);

  const products = useMemo(() => {
    const filtered = category === "TODOS" ? PRODUCTS : PRODUCTS.filter((p) => p.category === category);
    // Adiciona "live drift" nos números baseado no tick
    return filtered.map((p) => ({
      ...p,
      sales24h: p.sales24h + Math.floor(Math.sin(tick + p.id.length) * 12 + tick * 0.8),
      growth: Math.max(50, p.growth + Math.floor(Math.cos(tick * 0.7 + p.id.length) * 3)),
    }));
  }, [category, tick]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiado!`);
  };

  if (phase === "locked") {
    return (
      <div className="relative min-h-[600px] rounded-3xl overflow-hidden border border-emerald-500/30" style={{ background: "#000" }}>
        <MatrixRain />
        <div className="relative z-10 flex flex-col items-center justify-center min-h-[600px] p-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold mb-6 border border-emerald-500/50 bg-emerald-500/10 text-emerald-400 animate-pulse">
            <Lock className="w-3 h-3" /> SISTEMA BLOQUEADO
          </div>
          <h1 className="font-mono text-5xl md:text-7xl font-black text-emerald-400 tracking-tight mb-4" style={{ textShadow: "0 0 30px rgba(0,255,136,0.5)" }}>
            RADAR TIKSHOP
          </h1>
          <p className="font-mono text-emerald-300/70 text-sm md:text-base max-w-md mb-2">
            &gt; Acesso privilegiado aos produtos mais vendidos
          </p>
          <p className="font-mono text-emerald-300/50 text-xs md:text-sm max-w-md mb-8">
            &gt; Interceptando dados do TikTok Shop em tempo real_
          </p>
          <button
            onClick={startScan}
            className="group relative px-8 py-4 bg-emerald-500 text-black font-mono font-black text-sm uppercase tracking-wider hover:bg-emerald-400 transition-all rounded-md"
            style={{ boxShadow: "0 0 40px rgba(0,255,136,0.6), 0 0 80px rgba(0,255,136,0.3)" }}
          >
            <span className="flex items-center gap-2">
              <Unlock className="w-4 h-4" /> INICIAR INTERCEPTAÇÃO
            </span>
          </button>
          <div className="mt-8 grid grid-cols-3 gap-4 max-w-md w-full">
            {[
              { v: "2.8M+", l: "produtos" },
              { v: "TEMPO REAL", l: "dados" },
              { v: "100%", l: "exclusivo" },
            ].map((s) => (
              <div key={s.l} className="border border-emerald-500/20 rounded p-2 bg-black/40">
                <div className="font-mono text-emerald-400 text-sm font-bold">{s.v}</div>
                <div className="font-mono text-emerald-300/50 text-[9px] uppercase">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (phase === "scanning") {
    return (
      <div className="relative min-h-[600px] rounded-3xl overflow-hidden border border-emerald-500/40" style={{ background: "#000" }}>
        <MatrixRain />
        <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-[600px]">
          <div className="font-mono text-emerald-400 text-xs mb-4 flex items-center gap-2">
            <Signal className="w-3 h-3 animate-pulse" /> CONEXÃO SEGURA · 256-BIT
          </div>
          <Crosshair className="w-20 h-20 text-emerald-400 animate-spin mb-6" style={{ filter: "drop-shadow(0 0 20px #00ff88)" }} />
          <div className="font-mono text-emerald-400 text-4xl font-black mb-2">{progress}%</div>
          <div className="w-full max-w-md h-2 bg-emerald-950 rounded-full overflow-hidden mb-6 border border-emerald-500/30">
            <div className="h-full bg-emerald-400 transition-all duration-300" style={{ width: `${progress}%`, boxShadow: "0 0 10px #00ff88" }} />
          </div>
          <div className="w-full max-w-md bg-black/60 border border-emerald-500/30 rounded p-3 font-mono text-[11px] text-emerald-400 space-y-1 max-h-48 overflow-hidden">
            {logs.map((l, i) => (
              <div key={i} className="animate-in fade-in slide-in-from-left-2">{l}</div>
            ))}
            <div className="text-emerald-300 animate-pulse">_</div>
          </div>
        </div>
      </div>
    );
  }

  // READY — Dashboard hacker
  return (
    <div className="space-y-4 animate-in fade-in duration-500">
      {/* Header */}
      <div className="relative rounded-2xl overflow-hidden border border-emerald-500/30 p-4 md:p-6" style={{ background: "linear-gradient(135deg, #000 0%, #001a0d 100%)" }}>
        <div className="absolute inset-0 opacity-20">
          <MatrixRain />
        </div>
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-wider">AO VIVO · TikTok Shop BR</span>
            </div>
            <h1 className="font-mono text-2xl md:text-3xl font-black text-emerald-400" style={{ textShadow: "0 0 20px rgba(0,255,136,0.4)" }}>
              &gt; RADAR_TIKSHOP.exe
            </h1>
          </div>
          <button
            onClick={startScan}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 rounded font-mono text-xs text-emerald-400 transition"
          >
            <RefreshCw className="w-3 h-3" /> RE-SCAN
          </button>
        </div>

        {/* Stats line */}
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          {[
            { icon: ShoppingBag, label: "Produtos", value: products.length.toString() },
            { icon: Activity, label: "Vendas/24h", value: products.reduce((a, p) => a + p.sales24h, 0).toLocaleString("pt-BR") },
            { icon: Eye, label: "Views totais", value: "458M" },
            { icon: Zap, label: "Top score", value: Math.max(...products.map((p) => p.conversionScore)).toString() },
          ].map((s) => {
            const Ic = s.icon;
            return (
              <div key={s.label} className="bg-black/60 border border-emerald-500/20 rounded p-2">
                <div className="flex items-center gap-1.5 text-emerald-300/60 font-mono text-[9px] uppercase">
                  <Ic className="w-3 h-3" /> {s.label}
                </div>
                <div className="font-mono text-emerald-400 font-bold text-base md:text-lg mt-0.5">{s.value}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-thin">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 px-3 py-1.5 rounded font-mono text-[11px] font-bold uppercase border transition ${
              category === cat
                ? "bg-emerald-500 text-black border-emerald-500"
                : "bg-black/40 text-emerald-400 border-emerald-500/30 hover:border-emerald-500/60"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {products.map((p, idx) => (
          <button
            key={p.id}
            onClick={() => setSelected(p)}
            className="group text-left relative overflow-hidden rounded-xl border border-emerald-500/20 hover:border-emerald-400 p-4 transition-all hover:-translate-y-0.5"
            style={{
              background: isDark
                ? "linear-gradient(160deg, #0a1f15 0%, #050a08 100%)"
                : "linear-gradient(160deg, #0a1f15 0%, #050a08 100%)",
              boxShadow: "0 0 0 0 rgba(0,255,136,0)",
              animation: `fadeUp 0.4s ${idx * 30}ms both`,
            }}
          >
            <div className="absolute top-2 right-2 font-mono text-[9px] text-emerald-300/60">#{String(idx + 1).padStart(3, "0")}</div>
            <div className="flex items-start gap-3">
              <div className="text-3xl shrink-0 p-2 bg-black/40 rounded-lg border border-emerald-500/20">{p.emoji}</div>
              <div className="flex-1 min-w-0">
                <div className="font-mono text-[9px] text-emerald-400/70 uppercase">{p.category}</div>
                <div className="font-bold text-sm text-emerald-100 truncate">{p.name}</div>
                <div className="font-mono text-xs text-emerald-300 mt-0.5">R$ {p.price.toFixed(2)}</div>
              </div>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-1 font-mono">
              <div className="bg-black/40 rounded px-1.5 py-1 border border-emerald-500/10">
                <div className="text-[8px] text-emerald-300/50 uppercase">Vendas/24h</div>
                <div className="text-emerald-400 font-bold text-xs">{p.sales24h.toLocaleString("pt-BR")}</div>
              </div>
              <div className="bg-black/40 rounded px-1.5 py-1 border border-emerald-500/10">
                <div className="text-[8px] text-emerald-300/50 uppercase">Crescimento</div>
                <div className="text-emerald-400 font-bold text-xs flex items-center gap-0.5">
                  <TrendingUp className="w-2.5 h-2.5" />{p.growth}%
                </div>
              </div>
              <div className="bg-black/40 rounded px-1.5 py-1 border border-emerald-500/10">
                <div className="text-[8px] text-emerald-300/50 uppercase">Score</div>
                <div className="text-emerald-400 font-bold text-xs">{p.conversionScore}/100</div>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
              <span className={`font-mono text-[9px] px-2 py-0.5 rounded border ${
                p.competition === "BAIXA" ? "border-emerald-400 text-emerald-300 bg-emerald-500/10" :
                p.competition === "MÉDIA" ? "border-yellow-400 text-yellow-300 bg-yellow-500/10" :
                "border-red-400 text-red-300 bg-red-500/10"
              }`}>
                COMP. {p.competition}
              </span>
              <span className="font-mono text-[10px] text-emerald-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
                ABRIR <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in" onClick={() => setSelected(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-2xl border border-emerald-500/40 p-6 animate-in zoom-in-95"
            style={{ background: "linear-gradient(160deg, #001a0d 0%, #000 100%)", boxShadow: "0 0 60px rgba(0,255,136,0.3)" }}
          >
            <button onClick={() => setSelected(null)} className="absolute top-3 right-3 text-emerald-400 hover:text-emerald-300 font-mono text-xs">[X] FECHAR</button>
            <div className="font-mono text-[10px] text-emerald-400/70 uppercase mb-1">&gt; PRODUTO_DECODIFICADO</div>
            <div className="flex items-start gap-4 mb-4">
              <div className="text-5xl p-3 bg-black/60 rounded-xl border border-emerald-500/30">{selected.emoji}</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold text-emerald-100">{selected.name}</h2>
                <div className="font-mono text-emerald-400 text-lg mt-1">R$ {selected.price.toFixed(2)}</div>
                <div className="text-xs text-emerald-300/70 mt-1">{selected.category} · {selected.views} views · {selected.creators} criadores</div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4 font-mono">
              {[
                { l: "Vendas/24h", v: selected.sales24h.toLocaleString("pt-BR") },
                { l: "Crescimento", v: `+${selected.growth}%` },
                { l: "Score", v: `${selected.conversionScore}/100` },
                { l: "Competição", v: selected.competition },
              ].map((s) => (
                <div key={s.l} className="bg-black/50 border border-emerald-500/20 rounded p-2">
                  <div className="text-[9px] text-emerald-300/60 uppercase">{s.l}</div>
                  <div className="text-emerald-400 font-bold text-sm">{s.v}</div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="bg-black/50 border border-emerald-500/20 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-mono text-[10px] text-emerald-300/60 uppercase flex items-center gap-1"><Flame className="w-3 h-3" /> HOOK QUE VENDE</div>
                  <button onClick={() => copy(selected.hook, "Hook")} className="text-emerald-400 hover:text-emerald-300"><Copy className="w-3.5 h-3.5" /></button>
                </div>
                <div className="text-emerald-100 text-sm italic">"{selected.hook}"</div>
              </div>

              <div className="bg-black/50 border border-emerald-500/20 rounded p-3">
                <div className="flex items-center justify-between mb-1">
                  <div className="font-mono text-[10px] text-emerald-300/60 uppercase">HASHTAG PRINCIPAL</div>
                  <button onClick={() => copy(selected.hashtag, "Hashtag")} className="text-emerald-400 hover:text-emerald-300"><Copy className="w-3.5 h-3.5" /></button>
                </div>
                <div className="text-emerald-400 font-mono font-bold">{selected.hashtag}</div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3 flex gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-400 shrink-0 mt-0.5" />
                <div className="text-xs text-yellow-200/90">
                  <strong>Estratégia:</strong> Grave seu próprio vídeo replicando o hook acima nas primeiras 3 segundos. Use a hashtag principal + 4-6 secundárias. Marcas pagam UGC pra promover esse tipo de produto.
                </div>
              </div>

              <a
                href={`https://www.tiktok.com/search?q=${encodeURIComponent(selected.name)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-mono font-black text-sm rounded uppercase transition"
                style={{ boxShadow: "0 0 30px rgba(0,255,136,0.4)" }}
              >
                <ExternalLink className="w-4 h-4" /> VER NO TIKTOK
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
