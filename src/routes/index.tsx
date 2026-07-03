import { createFileRoute, Link } from "@tanstack/react-router";
import TikTokSaleNotifications from "@/components/TikTokSaleNotifications";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Play, Shield, Sparkles, Zap, Clock, Star, Volume2, Bot, Video, Wand2, Megaphone, GraduationCap, Users, Gift, Infinity as InfinityIcon, Brain, Crown, MessageCircle, Rocket, Smartphone, Trophy, Lock, Headphones, PlayCircle, Layers, TrendingUp, Wallet, DollarSign, Radar, Eye, Flame, X, AlertTriangle, TrendingDown, Target, Sparkle, ThumbsDown, Ban, Timer, Repeat, Camera, Heart, Bookmark, Share2, Music2 } from "lucide-react";
import { motion } from "framer-motion";
import { ScrollReveal } from "@/components/ScrollReveal";
import PixCheckoutDialog from "@/components/PixCheckoutDialog";

export function openPixCheckout() {
  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("open-pix-checkout"));
}

function PixCheckoutHost() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = () => setOpen(true);
    window.addEventListener("open-pix-checkout", h);
    return () => window.removeEventListener("open-pix-checkout", h);
  }, []);
  return <PixCheckoutDialog open={open} onClose={() => setOpen(false)} />;
}

import logoAsset from "@/assets/fabrica-ugc-logo.png.asset.json";
import promptsViraisLogo from "@/assets/prompts-virais-logo.png.asset.json";
import rvLogoAsset from "@/assets/rv-logo.png.asset.json";
import prime2Asset from "@/assets/prime2.png.asset.json";
import prime3Asset from "@/assets/prime3.png.asset.json";
import prime4Asset from "@/assets/prime4.png.asset.json";
import prime5Asset from "@/assets/prime5.png.asset.json";
import produtoEmAlta from "@/assets/produto-em-alta.jpeg.asset.json";
import radar1 from "@/assets/IMG_3225.jpeg.asset.json";
import radar2 from "@/assets/IMG_3226.jpeg.asset.json";
import radar3 from "@/assets/IMG_3227.jpeg.asset.json";
import radar4 from "@/assets/IMG_3228.jpeg.asset.json";
import radar5 from "@/assets/IMG_3229.jpeg.asset.json";
import radar6 from "@/assets/IMG_3230.jpeg.asset.json";
import radar7 from "@/assets/IMG_3231.jpeg.asset.json";
import radar8 from "@/assets/IMG_3232.jpeg.asset.json";
import clone1Asset from "@/assets/clone1.mp4.asset.json";

import cloneDancasAsset from "@/assets/clone-dancas-virais.mov.asset.json";
import cria1Asset from "@/assets/CRIA.mp4.asset.json";
import cria2Asset from "@/assets/CRIA2.mp4.asset.json";
import cria3Asset from "@/assets/CRIA3.mp4.asset.json";
import cria6Asset from "@/assets/CRIA6.mp4.asset.json";
import equipeAsset from "@/assets/equipe-fabrica-ugc.png.asset.json";
import promptGiro from "@/assets/prompt-giro-30.mp4.asset.json";
import promptCabelo from "@/assets/prompt-ajustando-cabelo.mp4.asset.json";
import promptUnboxPacote from "@/assets/prompt-unboxing-pacote.mp4.asset.json";
import promptUnboxBlusa from "@/assets/prompt-unboxing-blusa.mp4.asset.json";
import promptHoodieSpider from "@/assets/prompt-hoodie-spider.mp4.asset.json";
import promptHoodieCapuz from "@/assets/prompt-hoodie-capuz.mp4.asset.json";
import promptCasualTryon from "@/assets/prompt-casual-try-on.mp4.asset.json";
import promptExtra1 from "@/assets/prompt-extra-1.mp4.asset.json";
import promptExtra2 from "@/assets/prompt-extra-2.mp4.asset.json";
import promptExtra3 from "@/assets/prompt-extra-3.mp4.asset.json";
import promptExtra4 from "@/assets/prompt-extra-4.mp4.asset.json";
import promptExtra5 from "@/assets/prompt-extra-5.mp4.asset.json";
import promptExtra6 from "@/assets/prompt-extra-6.mp4.asset.json";
import promptExtra7 from "@/assets/prompt-extra-7.mp4.asset.json";

import slide1 from "@/assets/quiz/slide1.jpg";
import slide2 from "@/assets/quiz/slide2.jpg";
import slide3 from "@/assets/quiz/slide3.jpg";
import mayaLuna from "@/assets/quiz/maya-luna.webp";
import lunaRoupas from "@/assets/quiz/luna-roupas.png";
import lunaGym from "@/assets/quiz/luna-gym.jpg";
import influProduto from "@/assets/quiz/influ-produto.jpg";
import resultadoSelfie from "@/assets/quiz/resultado-selfie.jpg";
import kaelSantyns from "@/assets/quiz/kael-santyns.jpg";
import depo1 from "@/assets/quiz/depo1.jpg";
import depo2 from "@/assets/quiz/depo2.jpg";
import depo3 from "@/assets/quiz/depo3.jpg";
import depo4 from "@/assets/quiz/depo4.jpg";
import gridInfluencers from "@/assets/quiz/grid-influencers.jpg";
import dadosJunAsset from "@/assets/proof/dados-jun.png.asset.json";
import dadosJanFevAsset from "@/assets/proof/dados-jan-fev.png.asset.json";
import perfilMaya from "@/assets/IMG_4843.jpeg.asset.json";
import perfilThalia1 from "@/assets/IMG_4845.png.asset.json";
import perfilLaura from "@/assets/IMG_4846.jpeg.asset.json";
import perfilThalia2 from "@/assets/IMG_4848.jpeg.asset.json";
import perfilIsis from "@/assets/IMG_4850.png.asset.json";
import perfilLuna from "@/assets/IMG_4851.jpeg.asset.json";

const logo = logoAsset.url;

const FLAME = "#1f6dff";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Prompts de Movimento — Copie e cole pra criar vídeos UGC que vendem" },
      {
        name: "description",
        content:
          "Prompts prontos e testados pra sua influencer de IA posar, mostrar produto e criar conteúdo UGC que prende e vende. Copie, cole e use agora mesmo.",
      },
      { property: "og:title", content: "Copie e cole prompts de movimento — Vídeos UGC que vendem" },
      { property: "og:description", content: "Prompts prontos pra criar conteúdos que prendem atenção e vendem — sem gravar nada." },
      { property: "og:image", content: slide1 },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-[var(--ink)] text-white selection:bg-[var(--flame)] selection:text-black overflow-x-hidden">
      <Announcement />
      <Nav />
      <Hero />
      <Marquee />
      <Proof />
      <PromptsShowcase />
      <ErrosVsSolucao />
      <PorQueDiferente />
      <PerfisViralizados />
      <AtualizacaoDiaria />
      <PricingCard />
      <PixCheckoutHost />



    </div>
  );
}

function VipAccessModal() {
  return null;
}


/* ─────────────────── ANNOUNCEMENT + NAV ─────────────────── */

function Announcement() {
  const [secs, setSecs] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="w-full bg-[var(--flame)] text-white">
      <div className="max-w-7xl mx-auto px-5 py-2.5 flex items-center justify-center gap-3 text-[12px] sm:text-[13px] font-semibold">
        <Clock className="w-4 h-4" />
        <span className="tabular-nums font-bold">{mm}:{ss}</span>
        <span className="hidden sm:inline">·</span>
        <span className="uppercase tracking-wider">Acesso liberado por tempo limitado</span>
        <a href="#planos" className="hidden sm:inline-flex items-center gap-1 underline underline-offset-2 font-bold">
          Garantir agora <ArrowRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 bg-[var(--ink)]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 h-20 md:h-24 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center shrink-0" aria-label="Início">
          <img src={rvLogoAsset.url} alt="RV" className="h-10 sm:h-14 w-auto object-contain drop-shadow-[0_0_18px_rgba(26,122,255,0.55)]" />
        </a>

        <nav className="hidden md:flex items-center gap-8 text-[14px] text-white/70">
          <a href="#capacidades" className="hover:text-white transition">Capacidades</a>
          <a href="#demo" className="hover:text-white transition">Demo</a>
          <a href="#planos" className="hover:text-white transition">Planos</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/auth"
            className="relative inline-flex items-center bg-white text-black font-semibold text-[11px] sm:text-[12px] px-3 sm:px-4 py-2 rounded-full overflow-hidden shine-btn select-none [touch-action:manipulation] [-webkit-tap-highlight-color:transparent] transition-transform duration-150 ease-out hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.4)] active:scale-[0.94] active:shadow-inner"
          >
            Entrar
          </Link>
          <a
            href="#planos"
            className="group inline-flex items-center gap-2 text-white font-bold text-[12px] sm:text-[13px] px-4 py-2 rounded-full select-none [touch-action:manipulation] [-webkit-tap-highlight-color:transparent] transition-transform duration-150 ease-out active:scale-[0.96]"
            style={{ background: "linear-gradient(180deg, #1A7AFF 0%, #00338a 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 24px -6px rgba(26, 122, 255,0.55)" }}
          >
            Quero os prompts <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── HERO ─────────────────── */

function Hero() {
  return (
    <section id="top" className="relative bg-noise overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="gold-orb top-[-160px] left-[-120px] w-[520px] h-[520px]" />
      <div className="gold-orb bottom-[-180px] right-[-120px] w-[560px] h-[560px]" style={{ animationDelay: "3s" }} />
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(26, 122, 255,.6), transparent)" }}
      />


      <div className="relative max-w-5xl mx-auto px-5 pt-10 sm:pt-16 pb-16 text-center">
        <img
          src={promptsViraisLogo.url}
          alt="Prompts Virais"
          className="mx-auto w-full max-w-[520px] sm:max-w-[820px] h-auto drop-shadow-[0_10px_40px_rgba(26,122,255,0.4)]"
        />

        <span className="inline-flex items-center gap-2 mt-6 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A7AFF] bg-[#1A7AFF]/10 border border-[#1A7AFF]/35 px-4 py-1.5 rounded-full-sm">
          <Sparkles className="w-3.5 h-3.5" /> Prompts de Movimento Prontos
        </span>

        <h1 className="font-black mt-7 text-[32px] leading-[1.1] sm:text-[72px] lg:text-[92px] sm:leading-[1.05] max-w-4xl mx-auto text-white tracking-[-0.02em] px-2">
          Copie e cole <span className="prompt-shimmer">prompts</span> de movimento que{" "}
          <span className="italic font-medium text-white/80">viralizam e vendem.</span>
        </h1>




        <p className="mt-7 mx-auto max-w-2xl text-[16px] sm:text-[19px] text-white/80 leading-relaxed">
          <b className="text-white">Prompts prontos e testados</b> pra fazer sua influencer de IA posar, mostrar o produto e criar conteúdo que gera <b className="text-white">mais visualizações, engajamento e vendas</b> — sem gravar nada.
        </p>



        <div className="mt-10 flex flex-col items-center gap-5">
          <a href="#planos" className="gold-pill group">
            Quero os prompts prontos
            <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" />
          </a>


        </div>

        <div className="mt-12 grid grid-cols-3 gap-6 max-w-md mx-auto">
          <Stat value="2 min" label="Pra criar" />
          <Stat value="+12k" label="Alunos" />
          <Stat value="4.9★" label="Avaliação" />
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[28px] sm:text-[34px] text-gold-solid">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{label}</div>
    </div>
  );
}

/* ─────────────────── MARQUEE (VSA-style ghost) ─────────────────── */

function Marquee() {
  const phrase = "PROMPTS DE MOVIMENTO VIRAIS";
  const items = Array(10).fill(phrase);
  return (
    <div className="border-y border-[#1A7AFF]/15 bg-[var(--ink-2)] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, var(--ink-2), transparent 12%, transparent 88%, var(--ink-2))" }} />
      <div className="marquee-track flex gap-10 py-6 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-[28px] sm:text-[42px] uppercase flex items-center gap-10">
            <span className={i % 2 === 0 ? "text-white/25" : "text-gold-solid"}>{t}</span>
            <img src={rvLogoAsset.url} alt="RV" className="h-8 sm:h-11 w-auto object-contain drop-shadow-[0_0_18px_rgba(26,122,255,0.55)]" />
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────── PROOF ─────────────────── */

function Proof() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-24">
      <div className="max-w-4xl mx-auto">
        <SectionLabel>Prompts que já viralizaram</SectionLabel>
        <h2 className="font-black text-[36px] sm:text-[56px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
          Os mesmos prompts que geraram milhões de views<br className="hidden sm:block" />
          <span className="italic font-medium text-white/80">— prontos pra você copiar.</span>
        </h2>
        <p className="mt-6 text-[17px] text-white/70 leading-relaxed">
          Vídeos reais rodando com esses prompts + prints do faturamento no TikTok Shop.
        </p>

        <style>{`
          @keyframes proof-videos-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          @keyframes proof-scroll-reverse { from { transform: translateX(-50%); } to { transform: translateX(0); } }
        `}</style>

        <div className="mt-10 relative overflow-hidden -mx-5 sm:-mx-8">
          <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[var(--ink)] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[var(--ink)] to-transparent" />
          <div className="flex gap-4 w-max px-5" style={{ animation: "proof-videos-scroll 40s linear infinite" }}>
            {[...VIRAL_VIDEOS, ...VIRAL_VIDEOS].map((v, i) => (
              <TikTokViralCard key={`pv-${i}`} v={v} />
            ))}
          </div>
        </div>

        <div className="mt-6 relative overflow-hidden -mx-5 sm:-mx-8">
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent 10%, transparent 90%, rgba(200,200,200,0.12))" }} />
          <div className="flex gap-3 sm:gap-4 w-max" style={{ animation: "proof-scroll-reverse 30s linear infinite" }}>
            {[...[dadosJanFevAsset.url, dadosJunAsset.url, dadosJanFevAsset.url, dadosJunAsset.url], ...[dadosJanFevAsset.url, dadosJunAsset.url, dadosJanFevAsset.url, dadosJunAsset.url]].map((src, i) => (
              <div key={`r-${i}`} className="shrink-0 w-[260px] sm:w-[360px] md:w-[420px] rounded-2xl overflow-hidden border border-white/10 bg-white">
                <img src={src} alt={`Prova de faturamento TikTok Shop ${(i % 2) + 1}`} className="w-full h-[280px] sm:h-[380px] md:h-[440px] object-contain block bg-white" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A7AFF]">
      <span className="w-6 h-px bg-[#1A7AFF]" />
      {children}
    </span>
  );
}

/* ─────────────────── RADAR TIKSHOP ─────────────────── */

function CountUpRevenue({ target }: { target: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [val, setVal] = useState(0);
  const [done, setDone] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const duration = 1600;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.floor(target * eased));
              if (p < 1) requestAnimationFrame(tick);
              else setDone(true);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);
  const formatted = "R$ " + val.toLocaleString("pt-BR");
  return (
    <span ref={ref} className="tabular-nums">
      {formatted}
      <span className={`inline-block w-[2px] h-[10px] ml-0.5 align-middle bg-emerald-300 ${done ? "animate-pulse" : ""}`} />
    </span>
  );
}

function RadarTikshop() {
  const products = [radar1, radar2, radar3, radar4, radar5, radar6, radar7, radar8];
  const fakeNames = [
    "Sérum Glow Coreano 30ml",
    "Mini Massageador Facial LED",
    "Hair Mask Reconstrutora",
    "Body Splash Sweet Vanilla",
    "Cílios Magnéticos 3D",
    "Lip Tint Cherry Blossom",
    "Escova Alisadora Portátil",
    "Perfume Capilar Brilho+",
  ];
  const fakeRevenue = [1247300, 892450, 2105780, 756920, 1543210, 987650, 3210440, 1876300];

  return (
    <section className="relative max-w-7xl mx-auto px-5 py-24">
      <div className="text-center">
        <SectionLabel>Função exclusiva da plataforma</SectionLabel>
        <h2 className="font-black text-[40px] sm:text-[56px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
          <span>Radar TikShop</span>
          <span> — descubra os produtos</span>{" "}
          <span>antes de viralizarem</span>
        </h2>
        <p className="mt-6 text-[17px] text-white/70 leading-relaxed max-w-2xl mx-auto">
          Nossa IA varre o TikTok Shop 24h por dia e te entrega, todo dia, os produtos com maior potencial de explosão — comissão alta, baixa concorrência e demanda subindo.
        </p>
      </div>

      <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#10b981]/25 bg-gradient-to-b from-[var(--ink-2)] to-black shadow-[0_30px_80px_-20px_rgba(16,185,129,0.25)]">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#10b981]" />
            <Radar className="w-5 h-5 text-[#10b981]" />
            <span className="font-display uppercase tracking-wider text-[13px] sm:text-[15px]">Radar TikShop · AO VIVO</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
            <Lock className="w-3.5 h-3.5" /> Acesso exclusivo
          </span>
        </div>

        {/* Pulse Radar visual */}
        <div className="relative flex items-center justify-center py-8 border-b border-white/10 bg-gradient-to-b from-black/60 to-black/20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(16,185,129,0.18), transparent 60%)" }} />
          <div
            className="pulse-radar relative z-10"
            style={{ ['--pr-size' as any]: '220px', ['--pr-color' as any]: '#10b981' } as any}
          >
            {[
              { x: 28, y: 32, d: '0s' },
              { x: 68, y: 22, d: '0.4s' },
              { x: 78, y: 58, d: '0.9s' },
              { x: 42, y: 72, d: '1.3s' },
              { x: 22, y: 60, d: '1.7s' },
              { x: 58, y: 45, d: '0.6s' },
              { x: 35, y: 48, d: '1.1s' },
            ].map((b, i) => (
              <span
                key={i}
                className="pr-blip"
                style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: b.d, ['--pr-color' as any]: '#10b981' } as any}
              />
            ))}
          </div>

        </div>

        <div className="relative overflow-hidden py-6">
          <div className="absolute inset-0 pointer-events-none z-20" style={{ background: "linear-gradient(90deg, #000, transparent 10%, transparent 90%, #000)" }} />

          <div className="marquee-track flex gap-5 px-5 whitespace-nowrap">
            {[...products, ...products].map((p, i) => (
              <div key={i} className="relative shrink-0 w-[180px] sm:w-[220px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <div className="aspect-square overflow-hidden bg-black">
                  <img
                    src={p.url}
                    alt="Produto em análise"
                    className="w-full h-full object-cover"
                    style={{ filter: "blur(14px) saturate(1.1)", transform: "scale(1.15)" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#10b981] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Flame className="w-3 h-3" /> HOT
                </div>
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                </div>
                {/* Revenue badge - no circle */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-emerald-300 drop-shadow-[0_0_8px_rgba(16,185,129,0.6)] leading-none">
                      FATURAMENTO
                    </span>
                    <span className="mt-1 text-[13px] sm:text-[15px] font-black text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.9)] leading-none tabular-nums">
                      <CountUpRevenue target={fakeRevenue[i % fakeRevenue.length]} />
                    </span>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-3 text-left">
                  <div className="text-[12px] sm:text-[13px] font-bold text-white truncate" style={{ filter: "blur(3px)" }}>
                    {fakeNames[i % fakeNames.length]}
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px]">
                    <span className="text-gold-shimmer font-bold" style={{ filter: "blur(2px)" }}>R$ ●●,●●</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                      <TrendingUp className="w-3 h-3" /> +{120 + (i * 17) % 380}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-3 border-t border-white/10 divide-x divide-white/10 bg-black/30">
          <div className="p-4 sm:p-5 text-center">
            <div className="font-display text-[22px] sm:text-[28px] text-gold-solid">+1.200</div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/55 mt-1">Produtos/dia</div>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <div className="font-display text-[22px] sm:text-[28px] text-gold-solid">24/7</div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/55 mt-1">Análise ao vivo</div>
          </div>
          <div className="p-4 sm:p-5 text-center">
            <div className="font-display text-[22px] sm:text-[28px] text-gold-solid">+30%</div>
            <div className="text-[10px] sm:text-[11px] uppercase tracking-widest text-white/55 mt-1">Comissão média</div>
          </div>
        </div>

        <div className="p-6 sm:p-8 text-center border-t border-white/10">
          <p className="text-white/70 text-[14px] sm:text-[15px] max-w-xl mx-auto">
            <Eye className="inline w-4 h-4 text-[#10b981] mr-1 -mt-0.5" />
            Os produtos ficam <b className="text-white">desbloqueados só pra alunos</b>. Entra agora e vê o que tá bombando antes do mercado.
          </p>
          <a href="#planos" className="gold-pill group mt-5 inline-flex">
            Desbloquear o Radar
            <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── CAPABILITIES ─────────────────── */



function Capabilities() {
  const items = [
    { video: cria1Asset.url, title: "Realismo absurdo", text: "Ninguém percebe que é IA." },
    { video: cria2Asset.url, title: "Qualquer look, qualquer cenário", text: "Mesmo rosto, infinitos figurinos." },
    { video: cria3Asset.url, title: "Influencer UGC", text: "Movimentos naturais, fala fluida. Indistinguível da real." },
    { video: cria6Asset.url, title: "Vídeos prontos pra viralizar", text: "Transforme qualquer vídeo do TikTok no da sua influencer em 2 cliques." },
  ];
  return (
    <section id="capacidades" className="bg-[var(--ink-2)] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionLabel>O que ela faz por você</SectionLabel>
            <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
              Você cria. <span className="text-gold-shimmer">Ela vende.</span>
            </h2>
          </div>
          <p className="text-white/60 max-w-sm text-[15px]">
            Quatro ferramentas pra rodar sozinho. Sem aparecer.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <ScrollReveal key={i} delay={i * 0.08}>
              <article
                className="group relative rounded-2xl overflow-hidden bg-[var(--ink)] border border-white/10 hover:border-[var(--flame)]/50 transition"
              >
                <div className="relative">
                  <VideoCard src={it.video} />
                  <div className="absolute top-3 left-3 z-40 w-8 h-8 rounded-full bg-[var(--flame)] text-black font-bold flex items-center justify-center text-[13px]">
                    0{i + 1}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-[22px] uppercase">{it.title}</h3>
                  <p className="mt-2 text-[14px] text-white/60 leading-snug">{it.text}</p>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function useAutoplay<T extends HTMLVideoElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true;
    (v as HTMLVideoElement).defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");
    const tryPlay = () => { const p = v.play(); if (p && typeof p.catch === "function") p.catch(() => {}); };
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            if (v.preload !== "auto") v.preload = "auto";
            tryPlay();
          } else {
            v.pause();
          }
        });
      },
      { threshold: 0.15, rootMargin: "150px 0px" }
    );
    io.observe(v);
    const onVis = () => { if (!document.hidden && isInViewport(v)) tryPlay(); };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);
  return ref;
}

function isInViewport(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  return r.bottom > 0 && r.top < (window.innerHeight || 0);
}

function VideoCard({ src }: { src: string }) {
  const ref = useAutoplay<HTMLVideoElement>();
  const [muted, setMuted] = useState(true);
  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = ref.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    v.play().catch(() => {});
  };
  return (
    <div className="relative aspect-[3/4] overflow-hidden bg-black">
      <video
        ref={ref}
        src={src}
        className="w-full h-full object-cover"
        autoPlay
        loop
        muted
        playsInline
        /* @ts-ignore */
        webkit-playsinline="true"
        preload="none"
      />
      <button
        onClick={toggle}
        aria-label={muted ? "Ativar som" : "Desativar som"}
        className="absolute bottom-3 right-3 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 border border-white/20 hover:bg-[var(--flame)] hover:border-[var(--flame)] transition"
      >
        <Volume2 size={18} className={muted ? "text-white/70" : "text-white"} />
        {muted && (
          <span className="absolute inset-0 m-auto w-[2px] h-6 bg-white rotate-45 rounded" />
        )}
      </button>
    </div>
  );
}

/* ─────────────────── DEMO REEL ─────────────────── */

function ReelVideo({ src }: { src: string }) {
  const ref = useAutoplay<HTMLVideoElement>();
  return (
    <video
      ref={ref}
      src={src}
      className="w-full h-auto block"
      autoPlay
      loop
      muted
      playsInline
      /* @ts-ignore */
      webkit-playsinline="true"
      preload="none"
    />
  );
}

function DemoReel() {
  const videos = [
    { src: clone1Asset.url, title: "Clonar qualquer movimento", desc: "Reproduza ações, gestos e poses de vídeos reais na sua influencer de IA." },
    { src: cloneDancasAsset.url, title: "Clonar danças virais", desc: "Pegue qualquer trend do TikTok e transforme na sua influencer — rosto trocado, movimentos idênticos." },
  ];
  return (
    <section id="demo" className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>Clonagem de movimentos</SectionLabel>
        <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
          Clone <span>qualquer movimento</span> em segundos.
        </h2>
        <p className="mt-5 text-white/60 text-[15px]">
          Trend, dancinha ou vídeo viral vira conteúdo da sua influencer em 2 cliques. Ninguém percebe a diferença.
        </p>
      </div>

      <div className="mt-14 max-w-3xl mx-auto space-y-10">
        {videos.map((v, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0e0e12]">
            {v.title && (
              <div className="px-5 pt-5 pb-2">
                <h3 className="font-display text-[20px] sm:text-[24px] uppercase text-[#1A7AFF]">{v.title}</h3>
                {v.desc && <p className="text-[13px] sm:text-[14px] text-white/60 mt-1">{v.desc}</p>}
              </div>
            )}
            <ReelVideo src={v.src} />
          </div>
        ))}
      </div>
    </section>
  );
}



/* ─────────────────── AUDIENCE ─────────────────── */

function Audience() {
  const positive = [
    "Pessoas que querem lucrar na internet sem precisar aparecer.",
    "Quem busca uma renda extra ou principal usando apenas o celular.",
    "Iniciantes que nunca venderam nada online e buscam um passo a passo.",
    "Afiliados e criadores que querem escalar com Influencers de IA.",
    "Quem tem pouco tempo e precisa de um sistema rápido e validado."
  ];
  const negative = [
    "Pessoas que buscam 'botão mágico' para enriquecer sem esforço.",
    "Quem não está disposto a assistir as aulas e aplicar o método.",
    "Pessoas que têm medo de inovar e usar Inteligência Artificial.",
    "Quem prefere continuar tentando métodos saturados de 2018."
  ];

  return (
    <section className="bg-[var(--ink-2)] border-y border-white/5 py-24">
      <div className="max-w-7xl mx-auto px-5">
        <div className="text-center mb-16">
          <SectionLabel>Filtro de Alunos</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Isso é pra <span>você?</span>
          </h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <img
              src={equipeAsset.url}
              alt="Equipe Fábrica de UGC"
              className="w-full h-auto rounded-3xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(31, 109, 255,0.3)] breathe-3d"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pra quem é */}
          <ScrollReveal delay={0}>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[var(--flame)]/30 transition-colors group">
              <h3 className="flex items-center gap-3 text-2xl font-display uppercase text-[var(--flame)] mb-6">
                <Check className="w-6 h-6" /> É para você se:
              </h3>
              <ul className="space-y-4">
                {positive.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/70 group-hover:text-white transition-colors">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--flame)] shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>

          {/* Pra quem NÃO é */}
          <ScrollReveal delay={0.12}>
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 opacity-60">
              <h3 className="flex items-center gap-3 text-2xl font-display uppercase text-white/50 mb-6">
                <span className="text-xl">✕</span> NÃO é se:
              </h3>
              <ul className="space-y-4">
                {negative.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-white/40">
                    <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── MENTOR ─────────────────── */


function Mentor() {
  return (
    <section className="bg-[var(--ink-2)] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-24 grid lg:grid-cols-12 gap-10 items-center">
        <div className="lg:col-span-5 relative">
          <div className="rounded-2xl overflow-hidden border border-white/10">
            <img src={kaelSantyns} alt="Kael Santyns, mentor da Fábrica de UGC" className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[var(--acid)] text-black px-4 py-3 rounded-xl shadow-xl">
            <div className="font-display text-[22px] leading-none">Milhões</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold">de views com IA</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <SectionLabel>Conheça seu mentor</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Kael <span>Santyns</span>
          </h2>
          <div className="mt-6 space-y-4 text-[17px] text-white/75 leading-relaxed">
            <p>
              Fundador da <b className="text-white">Fábrica de UGC</b>. Um dos primeiros a vender no TikTok Shop usando <b className="text-white">influencers de IA realistas</b>.
            </p>
            <p>
              Enquanto outros tentavam entender a plataforma, eu já tava <b className="text-white">testando, errando e ajustando</b> — até criar o sistema que funciona.
            </p>
            <p>
              Resultado: <b className="text-[var(--flame)]">milhões de views</b>, 6 dígitos em vendas e <b className="text-white">+12k alunos</b> replicando o método.
            </p>
            <p>
              Não ensino teoria. Ensino <b className="text-white">o que eu uso todo dia</b> — estrutura pronta pra criar vídeos que vendem e escalar sem aparecer.
            </p>
          </div>
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { v: "Milhões", l: "Views geradas" },
              { v: "R$ 500k+", l: "Faturado com IA" },
              { v: "+12k", l: "Alunos ativos" },
            ].map((s, idx) => (
              <ScrollReveal key={s.l} delay={idx * 0.08}>
                <div className="rounded-xl bg-white/5 border border-white/10 p-4">
                  <div className="font-display text-[26px] text-[var(--flame)]">{s.v}</div>
                  <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{s.l}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── PATHS (3 CAMINHOS) ─────────────────── */

function Paths() {
  const paths = [
    {
      icon: Bot,
      titleYellow: "Perfil Dark",
      titleWhite: "(sem aparecer)",
      desc: "Venda sem mostrar o rosto: Influencer de IA, edição, formatos e estratégias pra perfis 100% anônimos.",
    },
    {
      icon: Video,
      titleYellow: "Vídeos que",
      titleWhite: "convertem",
      desc: "Aprenda a criar vídeos com gancho, retenção e CTA que geram clique e venda — sem precisar editar nada complexo.",
    },
    {
      icon: Users,
      titleYellow: "Perfil que aparece",
      titleWhite: "(autoridade)",
      desc: "Estratégias pra quem quer mostrar o rosto, criar confiança e construir posicionamento de marca pessoal.",
    },
  ];
  return (
    <section className="bg-[var(--ink)] border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26, 122, 255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 122, 255,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="max-w-7xl mx-auto px-5 py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>(e qual é o seu)</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Os 3 caminhos dentro do TikTok Shop com IA
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            Você escolhe o estilo que mais combina com você — todos validados, todos vendendo agora.
          </p>
        </div>
        <div className="mt-20 grid md:grid-cols-3 gap-x-6 gap-y-24">
          {paths.map((p, idx) => {
            const Icon = p.icon;
            return (
              <ScrollReveal key={p.titleYellow} delay={idx * 0.1}>
                <div
                  className="relative animate-fade-in"
                  style={{ animationDelay: `${idx * 120}ms` }}
                  onMouseMove={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                  }}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 z-10 flame-icon-orb">
                    <Icon className="w-9 h-9 text-[#3d8fff]" strokeWidth={2.2} />
                  </div>
                  <div className="flame-card pt-16 px-7 pb-10 text-center min-h-[280px]">
                    <h3 className="font-display text-[28px] uppercase leading-tight">
                      <span className="text-[#1f6dff]" style={{ textShadow: "0 0 20px rgba(31, 109, 255,0.5)" }}>{p.titleYellow}</span>{" "}
                      <span className="text-white">{p.titleWhite}</span>
                    </h3>
                    <p className="mt-5 text-[15px] text-white/75 leading-relaxed">{p.desc}</p>
                    <div className="flame-glow-bar" />
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
        <div className="mt-20 flex justify-center">
          <a href="#planos" className="gold-pill group text-[15px] font-bold px-7 py-4 rounded-full">
            Quero os prompts <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── COMMUNITY ─────────────────── */

function Community() {
  const benefits = [
    { icon: DollarSign, titleYellow: "Aprenda a vender", titleWhite: "no TikTok Shop", desc: "Do zero à primeira comissão: afiliação, produtos em alta e escala sem investir em tráfego." },
    { icon: Bot, titleYellow: "Criar sua", titleWhite: "Influencer de IA", desc: "Rosto, voz, personalidade e edição automática. Sua IA trabalha 24h por dia sem você aparecer." },
    { icon: Video, titleYellow: "Fazer vídeos que", titleWhite: "viralizam", desc: "Gancho, roteiro, edição e CTA prontos pra transformar visualização em comissão." },
    { icon: TrendingUp, titleYellow: "Escalar pra", titleWhite: "5k a 10k por mês", desc: "Estratégia de crescimento orgânico e monetização que leva de 2k seguidores à renda consistente." },
    { icon: Lock, titleYellow: "Área de membros", titleWhite: "completa", desc: "Acesso vitalício a todo o conteúdo, atualizações e novas aulas sem pagar mais nada." },
    { icon: Wand2, titleYellow: "IAs de graça", titleWhite: "inclusas", desc: "Use as mesmas inteligências artificiais gratuitas que os alunos usam pra criar e vender." },
    { icon: Radar, titleYellow: "Radar TikShop", titleWhite: "ao vivo", desc: "Descubra produtos que estão pra viralizar antes da concorrência, com comissão alta." },
    { icon: Shield, titleYellow: "Garantia", titleWhite: "incondicional", desc: "7 dias de garantia + R$1.000 no PIX se você aplicar e não tiver resultado." },
  ];
  const banners = [prime2Asset.url, prime3Asset.url, prime4Asset.url, prime5Asset.url];
  const loop = [...banners, ...banners];
  return (
    <section className="bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(26, 122, 255,0.18), rgba(26, 122, 255,0.06) 40%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(26, 122, 255,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(26, 122, 255,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="max-w-6xl mx-auto px-5 py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>(tudo incluso)</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[56px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            O que você vai receber
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            O passo a passo completo + todas as ferramentas pra criar uma Influencer de IA que vende no TikTok Shop, do zero ao resultado.
          </p>
        </div>

        <div className="mt-20 relative">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            const total = benefits.length;
            const scale = 1 - (total - 1 - idx) * 0.015;
            const opacity = 1;
            return (
              <div
                key={b.titleYellow + b.titleWhite}
                className="sticky px-2 mb-8"
                style={{ top: `${8 + idx * 2}%`, zIndex: idx + 1 }}
              >
                <div
                  className="mx-auto max-w-2xl rounded-[24px] p-[1.5px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 122, 255,0.6), rgba(26, 122, 255,0.2) 40%, rgba(255,255,255,0.04) 70%, rgba(26, 122, 255,0.5))",
                    transform: `scale(${scale})`,
                    opacity,
                    transformOrigin: "top center",
                    transition: "transform 0.4s ease, opacity 0.4s ease",
                  }}
                >
                  <div
                    className="relative rounded-[22px] overflow-hidden flex flex-col items-center text-center px-7 py-10"
                    style={{
                      background:
                        "linear-gradient(180deg, #0c0c0e 0%, #050505 100%)",
                      boxShadow:
                        "0 30px 80px -20px rgba(26, 122, 255,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-70"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(26, 122, 255,0.18), transparent 70%)",
                      }}
                    />

                    <motion.div
                      className="relative z-10 flex flex-col items-center w-full"
                      initial={{ opacity: 0, y: 60 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: false, amount: 0.3, margin: "-100px" }}
                      transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(26, 122, 255,0.18), rgba(26, 122, 255,0.08))",
                          border: "1px solid rgba(26, 122, 255,0.35)",
                          boxShadow: "0 0 30px rgba(26, 122, 255,0.25)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-[#1A7AFF]" strokeWidth={2.2} />
                      </div>

                      <h3 className="font-display text-[26px] sm:text-[32px] uppercase leading-[1.05] text-white font-bold max-w-md text-center">
                        <span
                          style={{ textShadow: "0 0 24px rgba(26, 122, 255,0.4)" }}
                        >
                          {b.titleYellow}
                        </span>{" "}
                        <span>{b.titleWhite}</span>
                      </h3>
                      <p className="mt-4 text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-md text-center">
                        {b.desc}
                      </p>

                      <div className="mt-6 flex flex-col items-center">
                        <div
                          className="inline-flex items-center gap-2 rounded-full border border-[#1A7AFF]/40 bg-[#1A7AFF]/10-sm px-4 py-2 shadow-[0_0_20px_rgba(26, 122, 255,0.18)]"
                        >
                          <Shield className="w-4 h-4 text-[#1A7AFF]" strokeWidth={2} />
                          <span className="text-[12px] font-semibold text-[#1A7AFF] tracking-wide">
                            Garantia 7 dias + R$1.000 no PIX
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-16 relative overflow-hidden"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)",
          }}
        >
          <div
            className="flex gap-5 w-max"
            style={{ animation: "banner-scroll 30s linear infinite" }}
          >
            {loop.map((src, i) => (
              <div
                key={i}
                className="shrink-0 rounded-2xl overflow-hidden border border-[#1A7AFF]/20 shadow-[0_20px_60px_-20px_rgba(26, 122, 255,0.3)] bg-[#0c0c0e]"
              >
                <img
                  src={src}
                  alt={`Banner área de membros ${i + 1}`}
                  className="block h-[220px] sm:h-[300px] w-auto object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`
        @keyframes banner-scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

/* ─────────────────── TESTIMONIALS ─────────────────── */

function Testimonials() {
  const depos = [depo1, depo2, depo3, depo4];
  return (
    <section className="max-w-7xl mx-auto px-5 py-24">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
        <div>
          <SectionLabel>Resultados reais</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Pessoas comuns, <br /> resultados <span>absurdos.</span>
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[var(--flame)]">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          <span className="ml-2 text-white/70 text-[14px]">4.9 · +2.300 avaliações</span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {depos.map((d, i) => (
          <ScrollReveal key={i} delay={i * 0.08}>
            <div className="rounded-xl overflow-hidden border border-white/10 hover:border-[var(--flame)]/50 transition">
              <img src={d} alt={`Depoimento ${i + 1}`} className="w-full h-auto" />
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto">
        {[
          { id: "1N-VlhmQ5ox892dhkAc8v3CZN_w8UaQC5", label: "Depoimento em vídeo 1" },
          { id: "1oMvrYL7i7BkGSbVHwGI9b07W4hkxK-NZ", label: "Depoimento em vídeo 2" },
        ].map((v, i) => (
          <ScrollReveal key={v.id} delay={i * 0.1}>
            <div className="rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--flame)]/50 transition bg-black aspect-[9/16] max-h-[360px] md:max-h-[560px] mx-auto w-full">
              <VideoCard src={`https://drive.google.com/uc?export=download&id=${v.id}`} />
            </div>
          </ScrollReveal>
        ))}
      </div>

    </section>
  );
}

/* ─────────────────── DELIVERABLES (O QUE VOCÊ RECEBE) ─────────────────── */

function Deliverables() {
  const items = [
    {
      icon: Brain,
      tag: "Núcleo IA",
      title: "IA que Faz Tudo por Você",
      desc: "Uma inteligência artificial treinada que cria sua influencer, escreve roteiro, gera vídeo, faz lipsync e entrega tudo pronto pra postar. Você só aprova e publica.",
      result: "Trabalho de uma equipe inteira em 2 cliques",
      value: "R$ 3.997",
      highlight: true,
    },
    {
      icon: Bot,
      tag: "Módulo 01",
      title: "Fábrica de Influencers de IA",
      desc: "Crie sua influencer realista em menos de 2 minutos e tenha um ativo digital postando no seu lugar — a maioria dos alunos publica o primeiro vídeo no mesmo dia.",
      result: "1º vídeo no ar em 24h",
      value: "R$ 1.997",
    },
    {
      icon: Video,
      tag: "Módulo 02",
      title: "Vídeos UGC Prontos pra Vender",
      desc: "Gere vídeos falados com lipsync, expressão e movimento natural — o mesmo formato que está faturando R$300 a R$2.000/dia no TikTok Shop sem aparecer.",
      result: "Primeiras vendas em ~7 dias",
      value: "R$ 1.497",
    },
    {
      icon: Wand2,
      tag: "Módulo 03",
      title: "Engenharia de Prompts CTS",
      desc: "Biblioteca pronta com prompts testados que já viralizaram milhões de views. Cola, troca o produto e posta — sem achismo, sem perder semanas testando.",
      result: "Atalho de 3 meses de tentativa",
      value: "R$ 897",
    },
    {
      icon: Megaphone,
      tag: "Módulo 04",
      title: "Monetização no TikTok Shop",
      desc: "Passo a passo pra escolher produtos quentes, abrir a loja e transformar cada vídeo em comissão recorrente caindo no PIX, 24h por dia.",
      result: "Loja vendendo nas 2 primeiras semanas",
      value: "R$ 1.297",
    },
    {
      icon: Lock,
      tag: "Acesso",
      title: "Área de Membros Fábrica de UGC",
      desc: "Plataforma completa, organizada e liberada na hora do pagamento: aulas em HD, materiais, prompts, atualizações e seu painel da IA no mesmo lugar.",
      result: "Liberação imediata após o PIX",
      value: "R$ 1.197",
    },
    {
      icon: Crown,
      tag: "Mentoria",
      title: "Mentoria Particular Comigo",
      desc: "Sessão individual direto comigo pra destravar seu nicho, validar produto e montar seu plano de faturamento — atalho que ninguém vende solto por menos de R$2.000.",
      result: "Plano sob medida pro seu caso",
      value: "R$ 2.997",
      highlight: true,
    },
    {
      icon: GraduationCap,
      tag: "Bônus 01",
      title: "Mentorias Semanais ao Vivo",
      desc: "Toda semana o time analisa seu perfil, seus vídeos e ajusta o que estiver travando seu faturamento. Você nunca fica sozinho.",
      result: "Correção de rota toda semana",
      value: "R$ 2.388",
    },
    {
      icon: Sparkles,
      tag: "Bônus 02",
      title: "Bônus Grok AI Liberado",
      desc: "Acesso e tutorial completo pra usar o Grok como sua máquina de roteiros, ganchos e copys que convertem — sem mensalidade extra.",
      result: "Roteiros virais em segundos",
      value: "R$ 697",
    },
    {
      icon: Rocket,
      tag: "Bônus 03",
      title: "Bônus Flow — Automação de Postagem",
      desc: "Aprenda a automatizar postagens, agendamentos e respostas pra deixar sua operação rodando sozinha enquanto você dorme.",
      result: "Operação 24/7 no automático",
      value: "R$ 797",
    },
    {
      icon: Users,
      tag: "Bônus 04",
      title: "Comunidade Fechada CTS",
      desc: "Grupo VIP com alunos faturando de verdade compartilhando produtos validados, ganchos que estão convertendo e prints de venda toda hora.",
      result: "Produtos validados em tempo real",
      value: "R$ 997",
    },
    {
      icon: Gift,
      tag: "Bônus 05",
      title: "Pack de Bônus Mensais",
      desc: "Todo mês um treinamento, template ou ferramenta nova destrava — você nunca para de evoluir e a concorrência nunca te alcança.",
      result: "Vantagem competitiva mensal",
      value: "R$ 1.497",
    },
    {
      icon: Headphones,
      tag: "Bônus 06",
      title: "Suporte Direto no WhatsApp",
      desc: "Travou? Manda mensagem. Time de suporte respondendo dúvidas técnicas e estratégicas pra você não perder um dia sequer de execução.",
      result: "Resposta no mesmo dia útil",
      value: "R$ 597",
    },
    {
      icon: InfinityIcon,
      tag: "Bônus 07",
      title: "Atualizações por 12 Meses",
      desc: "A IA muda toda semana e o método acompanha. Durante 12 meses você recebe cada nova aula, prompt e atualização sem pagar nada a mais.",
      result: "1 ano inteiro de evolução incluso",
      value: "Incluso",
    },
  ];

  const quickHighlights = [
    { icon: Brain, label: "IA que cria tudo" },
    { icon: PlayCircle, label: "Área de membros" },
    { icon: Crown, label: "Mentoria particular" },
    { icon: MessageCircle, label: "Suporte no WhatsApp" },
    { icon: Layers, label: "Biblioteca de prompts" },
    { icon: TrendingUp, label: "Bônus Grok + Flow" },
    { icon: Wallet, label: "Pagamento único" },
    { icon: Trophy, label: "Comunidade VIP" },
  ];

  const totalValue = "R$ 22.852";

  return (
    <section id="entrega" className="relative bg-[var(--ink)] scroll-mt-20">
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>O que você recebe — e o que isso faz pelo seu bolso</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[64px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Tudo pronto pra você <span>lucrar nas primeiras semanas.</span>
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            Não é curso de prateleira. É um sistema plugável: você entra hoje, posta essa semana e começa a ver venda caindo enquanto ainda está estudando os módulos avançados.
          </p>
        </div>

        {/* Quick highlights ribbon */}
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
          {quickHighlights.map((h, i) => {
            const Icon = h.icon;
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-xl bg-[var(--ink-2)] border border-white/10 px-3 py-4 text-center hover:border-[var(--flame)]/50 transition"
              >
                <div className="w-9 h-9 rounded-lg bg-[var(--flame)]/15 border border-[var(--flame)]/30 flex items-center justify-center text-[var(--flame)]">
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-white/80 leading-tight">
                  {h.label}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {items.map((it, i) => {
            const Icon = it.icon;
            return (
              <ScrollReveal key={i} delay={(i % 4) * 0.08}>
                <div
                  className={`group relative h-full flex flex-col rounded-2xl bg-[var(--ink-2)] border p-4 sm:p-5 hover:-translate-y-1 transition-all duration-300 ${
                    it.highlight
                      ? "border-[var(--flame)]/60 shadow-[0_0_40px_-15px_rgba(31, 109, 255,0.5)]"
                      : "border-white/10 hover:border-[var(--flame)]/50"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-[var(--flame)]/25 to-[var(--flame)]/5 border border-[var(--flame)]/40 flex items-center justify-center text-[var(--flame)]">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-white/45">
                      {it.tag}
                    </span>
                  </div>
                  <h3 className="mt-4 font-display text-[14px] sm:text-[17px] uppercase leading-snug">{it.title}</h3>
                  <div className="mt-auto pt-4 flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">Valor</span>
                    <span className="font-display text-[15px] sm:text-[17px] text-[var(--flame)]">{it.value}</span>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Total value bar */}
        <div className="mt-10 rounded-2xl border border-[var(--flame)]/40 bg-gradient-to-r from-[var(--flame)]/10 via-[var(--ink-2)] to-[var(--flame)]/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <div className="text-[11px] uppercase tracking-[0.2em] text-white/50">Valor real de tudo isso</div>
            <div className="font-display text-[34px] sm:text-[44px] leading-none mt-1">
              <span className="line-through text-white/40">{totalValue}</span>
              <span className="ml-3 text-[var(--flame)]">hoje sai por uma fração</span>
            </div>
          </div>
          <a
            href="#oferta"
            className="gold-pill rounded-full px-7 py-4 font-display text-[16px] uppercase tracking-wider whitespace-nowrap"
          >
            Quero garantir minha vaga <ArrowRight className="w-5 h-5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── PRICING ─────────────────── */

function Pricing() {
  return (
    <section id="planos" className="relative bg-[var(--ink-2)] border-y border-white/5 scroll-mt-20">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${FLAME}, transparent)` }}
      />
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="text-center max-w-2xl mx-auto">
          <SectionLabel>Acesso imediato</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[64px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Escolha seu <span>plano.</span>
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            Garantia incondicional de 7 dias + <b className="text-white">R$1.000 no PIX</b> se não funcionar.
          </p>
        </div>

        <div className="mt-14 max-w-xl mx-auto">
          <ScrollReveal delay={0}>
            <PriceCard
              badge="Vitalício · Mais escolhido"
              highlight
              title="Vitalício"
              subtitle="Acesso para sempre + bônus exclusivos"
              priceOld="R$ 197,90"
              price="R$ 67,90"
              unit="/único"
              features={[
                "Curso completo de TikTok Shop",
                "Edição na prática: perfil dark",
                "Comunidade VIP",
                "Calls semanais com alunos",
                "Suporte prioritário",
                "Grupo de ferramentas",
                "Grupo de troca de seguidores",
                "Grupo de produtos validados",
                "Você vai aprender a fazer IA ultra-realista",
                "Estratégia pra escalar sua live shop",
                "Estratégia para escalar 10K por mês",
                "Garantia incondicional de 7 dias",
              ]}
              cta="Quero entrar agora"
              onClick={openPixCheckout}
            />
          </ScrollReveal>
        </div>

        <p className="mt-8 text-center text-white/40 text-[12px]">
          🔒 Compra 100% segura · Acesso liberado imediatamente após a confirmação
        </p>
      </div>
    </section>
  );
}

function PriceCard({
  badge, title, subtitle, price, priceOld, unit, features, cta, highlight, href, onClick,
}: {
  badge: string; title: string; subtitle: string; price: string; priceOld?: string;
  unit: string; features: string[]; cta: string; highlight?: boolean; href?: string; onClick?: () => void;
}) {
  const btnClass = `mt-8 group w-full py-5 rounded-full font-bold text-[15px] transition inline-flex items-center justify-center gap-2 ${
    highlight
      ? "gold-pill"
      : "bg-white hover:bg-[var(--acid)] text-black"
  }`;
  return (
    <div
      className={`relative rounded-3xl p-8 ${
        highlight
          ? "bg-gradient-to-br from-[var(--flame)]/15 via-[var(--ink)] to-[var(--ink)] border-2 border-[var(--flame)] shadow-[0_30px_80px_-20px_rgba(31, 109, 255,0.4)]"
          : "bg-[var(--ink)] border border-white/10"
      }`}
    >
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--acid)] text-black text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest whitespace-nowrap shadow-lg">
          ⭐ Economize 87%
        </span>
      )}
      <div className="flex items-center justify-between gap-3">
        <span className={`text-[10px] font-bold uppercase tracking-[0.2em] px-2.5 py-1 rounded-full ${highlight ? "bg-[var(--flame)]/20 text-[var(--flame-2)]" : "bg-white/10 text-white/70"}`}>
          {badge}
        </span>
        {highlight && <Zap className="w-5 h-5 text-[var(--flame)]" />}
      </div>

      <h3 className="font-display text-[36px] uppercase mt-5 text-white">{title}</h3>
      <p className="text-white/60 text-[13px] mt-1">{subtitle}</p>

      <div className="mt-6 flex items-baseline gap-3">
        {priceOld && <span className="text-white/40 line-through text-[15px]">{priceOld}</span>}
        <span className="font-display text-[44px] text-[var(--flame)]">{price}</span>
        <span className="text-white/50 text-[14px]">{unit}</span>
      </div>

      <ul className="mt-7 space-y-3">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3 text-[14.5px] text-white/85">
            <span className={`shrink-0 mt-0.5 w-5 h-5 rounded-full flex items-center justify-center ${highlight ? "bg-[var(--flame)]" : "bg-white/10"}`}>
              <Check className="w-3 h-3 text-white" strokeWidth={3} />
            </span>
            {f}
          </li>
        ))}
      </ul>

      {onClick ? (
        <button type="button" onClick={onClick} className={btnClass}>
          {cta}
          <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
        </button>
      ) : (
        <a
          href={href ?? "#"}
          target={href ? "_blank" : undefined}
          rel={href ? "noopener noreferrer" : undefined}
          className={btnClass}
        >
          {cta}
          <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
        </a>
      )}
    </div>
  );
}

/* ─────────────────── GUARANTEE ─────────────────── */

function Guarantee() {
  return (
    <section className="max-w-7xl mx-auto px-5 py-24">
      <div className="relative rounded-3xl bg-gradient-to-br from-[var(--ink-2)] to-[var(--ink)] border border-[var(--flame)]/30 p-10 sm:p-14 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[400px] h-[400px] rounded-full blur-3xl opacity-20"
          style={{ background: `radial-gradient(circle, ${FLAME}, transparent 60%)` }}
        />
        <div className="relative grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-2 flex justify-center">
            <div className="relative w-28 h-28 rounded-full bg-[var(--flame)]/10 border-2 border-[var(--flame)] flex items-center justify-center">
              <span className="absolute inset-0 rounded-full border-2 border-[var(--flame)]/50 animate-ping" />
              <span
                className="absolute -inset-3 rounded-full blur-2xl opacity-60 animate-pulse"
                style={{ background: `radial-gradient(circle, ${FLAME}, transparent 70%)` }}
              />
              <Shield className="relative w-12 h-12 text-[var(--flame)] drop-shadow-[0_0_12px_var(--flame)] animate-[pulse_2.4s_ease-in-out_infinite]" />
            </div>
          </div>
          <div className="lg:col-span-10">
            <SectionLabel>Garantia blindada</SectionLabel>
            <h2 className="font-black text-[36px] sm:text-[52px] leading-[1.05] mt-3 text-white tracking-[-0.02em]">
              Funciona pra você <span>ou nós pagamos.</span>
            </h2>
            <p className="mt-5 text-[16px] text-white/75 leading-relaxed max-w-3xl">
              Você tem <b className="text-white">7 dias para testar</b> a Fábrica de UGC. Se não for pra você, devolvemos <b className="text-white">100% do valor</b>. Sem perguntas, sem burocracia.
            </p>
            <p className="mt-4 text-[16px] text-white/75 leading-relaxed max-w-3xl">
              E mais: se você entrar, <b className="text-white">aplicar o método por 30 dias</b>, postar ao menos 2 vídeos por dia e <b className="text-white">não tiver resultado</b> — devolvemos tudo + <b className="text-[var(--flame)]">R$1.000 no PIX</b>.
            </p>
            <p className="mt-4 text-[15px] text-white/60 italic max-w-3xl">
              Porque aqui a gente não vende promessa. <b className="text-white not-italic">A gente garante resultado.</b>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FAQ ─────────────────── */

function FAQ() {
  const faqs = [
    { q: "O que exatamente é a Fábrica de UGC?", a: "Treinamento completo do zero que ensina, passo a passo, a criar Influencers de IA realistas, gerar conteúdos e vídeos prontos e monetizar no TikTok Shop. Método prático, sem enrolação." },
    { q: "Preciso de computador forte ou dá pra fazer pelo celular?", a: "Dá pra fazer 100% pelo celular. Todo o método foi pensado pra rodar em qualquer aparelho com internet — você não precisa de PC gamer, placa de vídeo nem nada caro." },
    { q: "As ferramentas que vocês ensinam são pagas ou gratuitas?", a: "A maior parte é gratuita. Mostramos como usar IAs grátis pra criar sua Influencer e seus vídeos do zero. Algumas ferramentas pagas (opcionais) custam poucos reais por mês e só entram se você quiser escalar de verdade." },
    { q: "Tem limite de Influencers que posso criar?", a: "Zero limites. Você pode criar dezenas de personagens para diferentes nichos e gerenciar todos no seu celular usando o nosso método." },
    { q: "Como e em quanto tempo eu recebo o acesso?", a: "Acesso liberado na hora, automático, por e-mail, assim que o pagamento for confirmado. Você entra na área de membros e já começa hoje mesmo." },
    { q: "O método serve para quem mora fora do Brasil?", a: "Sim! O método é digital e as ferramentas de IA funcionam no mundo todo. Você pode criar conteúdo em português, inglês ou qualquer idioma que desejar." },
    { q: "Como funciona o suporte se eu tiver dúvidas?", a: "Suporte direto pelo e-mail suporte@fabricadeugc.online e dentro da área de membros. Time treinado pra te responder rápido e destravar qualquer dúvida do método." },
    { q: "Preciso saber de IA, edição ou marketing?", a: "Não. Foi feito pra quem está começando do zero absoluto. Sem programação, sem termos técnicos." },
    { q: "E se o TikTok banir minha conta?", a: "Ensinamos estratégias de contingência e como criar vídeos que seguem as diretrizes. Com IA, você cria uma nova conta e um novo rosto em minutos, o que te dá uma vantagem imensa sobre quem depende do próprio rosto." },
    { q: "Como funciona a garantia + R$1.000 no PIX?", a: "Garantia incondicional de 7 dias — desistiu, devolvemos. A bonificação de R$1.000 no PIX se aplica se, em até 30 dias, você comprovar que assistiu 100% das aulas, aplicou o método e ainda assim não teve resultado. O risco é nosso." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section id="faq" className="bg-[var(--ink-2)] border-y border-white/5">
      <div className="max-w-4xl mx-auto px-5 py-24">
        <div className="text-center">
          <SectionLabel>Dúvidas frequentes</SectionLabel>
          <h2 className="font-black text-[40px] sm:text-[60px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Antes de você <span>perguntar.</span>
          </h2>
        </div>

        <div className="mt-12 divide-y divide-white/10 border-y border-white/10">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <button
                key={i}
                onClick={() => setOpen(isOpen ? null : i)}
                className="w-full text-left py-6 flex items-start gap-5 group"
              >
                <span className={`font-display text-[22px] mt-0.5 transition ${isOpen ? "text-[var(--flame)]" : "text-white/40 group-hover:text-white/70"}`}>
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <h3 className={`font-semibold text-[18px] sm:text-[20px] transition ${isOpen ? "text-white" : "text-white/80 group-hover:text-white"}`}>
                    {f.q}
                  </h3>
                  <div className={`grid transition-all duration-300 ${isOpen ? "grid-rows-[1fr] mt-3 opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                    <div className="overflow-hidden">
                      <p className="text-[15px] text-white/70 leading-relaxed">{f.a}</p>
                    </div>
                  </div>
                </div>
                <span className={`shrink-0 mt-1 w-8 h-8 rounded-full border flex items-center justify-center transition ${isOpen ? "bg-[var(--flame)] border-[var(--flame)] rotate-45" : "border-white/20 text-white/70"}`}>
                  +
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── FINAL CTA ─────────────────── */

function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-[var(--ink)]">
      <div className="absolute inset-0 bg-grid opacity-25" />
      <div className="gold-orb top-[-100px] left-1/2 -translate-x-1/2 w-[700px] h-[700px]" />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(26, 122, 255,0.18), transparent 60%)" }} />
      <div className="relative max-w-5xl mx-auto px-5 py-32 text-center">
        <img src={slide2} alt="" className="absolute top-10 left-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[-8deg]" />
        <img src={slide3} alt="" className="absolute bottom-10 right-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[6deg]" />
        <SectionLabel>A decisão é sua</SectionLabel>
        <h2 className="font-black text-[48px] sm:text-[88px] leading-[1.05] mt-6 text-white tracking-[-0.02em]">
          Enquanto você <span>pensa,</span><br />
          alguém já <span className="italic font-serif normal-case">começou.</span>
        </h2>
        <p className="mt-7 text-[17px] sm:text-[19px] text-white/70 max-w-2xl mx-auto">
          A diferença entre quem fatura com IA e quem só assiste é simples: <b className="text-white">um clique</b>.
        </p>
        <a
          href="#planos"
          className="gold-pill group mt-10 text-[17px] sm:text-[19px] font-bold px-10 py-6 rounded-full"
        >
          Quero começar agora
          <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" />
        </a>
        <p className="mt-4 text-[12px] text-white/50">🔒 Acesso imediato · Garantia de 7 dias</p>
      </div>
    </section>
  );
}

/* ─────────────────── FOOTER ─────────────────── */

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[var(--ink)]">
      <div className="max-w-7xl mx-auto px-5 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <img src={logo} alt="Fábrica de UGC" className="h-12 w-auto mb-4" />
            <p className="text-white/60 text-[13px] leading-relaxed max-w-sm">
              Treinamento oficial Fábrica de UGC. Aprenda a criar Influencers de IA realistas e faturar no TikTok Shop sem aparecer.
            </p>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-white font-semibold text-[14px] uppercase tracking-wider mb-4">Contato</h4>
            <ul className="space-y-2 text-[13px] text-white/60">
              <li>
                Suporte:{" "}
                <a href="mailto:suporte@fabricadeugc.online" className="text-white hover:text-[var(--flame)] transition">
                  suporte@fabricadeugc.online
                </a>
              </li>
              <li>Atendimento: seg a sex · 9h às 18h</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold text-[14px] uppercase tracking-wider mb-4">Institucional</h4>
            <ul className="space-y-2 text-[13px] text-white/60">
              <li><a href="/termos" className="hover:text-white transition">Termos de Uso</a></li>
              <li><a href="/privacidade" className="hover:text-white transition">Política de Privacidade</a></li>
              <li><a href="#faq" className="hover:text-white transition">Perguntas Frequentes</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 space-y-4">
          <p className="text-[11px] text-white/40 leading-relaxed max-w-4xl">
            <b className="text-white/60">Aviso legal:</b> Este site não tem vínculo, parceria, patrocínio ou endosso com o TikTok, TikTok Shop, ByteDance, Meta, Facebook, Instagram ou qualquer outra plataforma citada. Todas as marcas mencionadas pertencem aos seus respectivos donos. Os resultados apresentados são reais de alunos e <b className="text-white/60">não representam garantia de ganho</b>. O sucesso depende de dedicação, esforço e aplicação correta do método. Este produto não promete enriquecimento rápido nem ganhos automáticos.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-[12px] text-white/45">
            <p>© {new Date().getFullYear()} Fábrica de UGC · Todos os direitos reservados</p>
            <p>contato@fabricadeugc.online</p>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ─────────────────── ERROS vs SOLUÇÃO ─────────────────── */

function ErrosVsSolucao() {
  const erros = [
    { icon: Ban, title: "Movimentos travados e sem naturalidade", desc: "A IA gera pose parada, olhar morto, mão esquisita. O algoritmo do TikTok mata o vídeo nos primeiros 3s." },
    { icon: Repeat, title: "Mesma pose, mesmo ângulo, mesmo flop", desc: "Você posta e some. Sem variação de movimento o feed entende como conteúdo repetitivo e não distribui." },
    { icon: ThumbsDown, title: "Cara de IA que ninguém acredita", desc: "Plástica demais, brilho estranho, cabelo derretendo. Perde credibilidade, comentário vira zoação, zero venda." },
    { icon: Timer, title: "Semanas testando prompt do zero", desc: "Você pega prompt aleatório no TikTok, gera 40 vídeos ruins, queima crédito da IA e desiste antes do primeiro viral." },
  ];
  const solucoes = [
    { icon: Sparkle, title: "Micro-movimentos que enganam o algoritmo", desc: "Cada prompt tem gesto humano estudado — respirar, ajustar cabelo, girar o produto. O For You lê como pessoa real." },
    { icon: Camera, title: "Ângulos que já viralizaram", desc: "Testados em milhares de vídeos reais dos alunos. Você cola, troca o produto e o padrão de retenção já vem pronto." },
    { icon: Target, title: "Realismo cirúrgico", desc: "Prompts com pele, luz, roupa e sombra calibrados. Ninguém desconfia. Vira comentário de 'onde comprou' em vez de 'isso é IA?'" },
    { icon: Rocket, title: "Cola e posta hoje", desc: "Zero achismo. Abre o app, copia o prompt, gera, publica. O que levava semanas vira 10 minutos." },
  ];
  return (
    <section className="relative bg-[var(--ink)] border-y border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 0%, rgba(239,68,68,0.15), transparent 40%), radial-gradient(circle at 80% 100%, rgba(26,122,255,0.18), transparent 45%)" }} />
      <div className="relative max-w-7xl mx-auto px-5 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>Por que a maioria floppa</SectionLabel>
          <h2 className="font-black text-[36px] sm:text-[56px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Todo mundo tem acesso à mesma IA.<br className="hidden sm:block" />
            <span className="italic font-medium text-white/80">O que muda é o prompt que você cola.</span>
          </h2>
          <p className="mt-6 text-[16px] sm:text-[18px] text-white/70 leading-relaxed">
            Você já deve ter tentado. Gerou vídeo com influencer IA, postou no TikTok e não engatou. Não é a sua conta. É o prompt.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6">
          {/* Erros */}
          <div className="relative rounded-3xl border border-red-500/20 bg-gradient-to-b from-red-950/30 to-black/40 p-6 sm:p-8 overflow-hidden">
            <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-red-500/10 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/15 border border-red-500/30 text-red-300 text-[11px] font-black uppercase tracking-wider">
                <AlertTriangle className="w-3.5 h-3.5" /> Os 4 erros que te fazem floppar
              </div>
              <div className="mt-6 space-y-4">
                {erros.map((e, i) => (
                  <ScrollReveal key={e.title} delay={i * 0.08}>
                    <div className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-red-500/10 hover:border-red-500/30 transition">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-red-500/15 border border-red-500/30 flex items-center justify-center">
                        <e.icon className="w-5 h-5 text-red-400" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[15px] leading-snug">{e.title}</p>
                        <p className="mt-1 text-white/60 text-[13.5px] leading-relaxed">{e.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-red-300/80 text-[13px] font-semibold">
                <TrendingDown className="w-4 h-4" /> Resultado: 87 views, 2 curtidas, 0 venda.
              </div>
            </div>
          </div>

          {/* Soluções */}
          <div className="relative rounded-3xl border border-[#1A7AFF]/30 bg-gradient-to-b from-[#0a1a3a]/60 to-black/40 p-6 sm:p-8 overflow-hidden">
            <div className="absolute -top-16 -left-16 w-56 h-56 rounded-full bg-[#1A7AFF]/15 blur-3xl" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1A7AFF]/15 border border-[#1A7AFF]/40 text-[#7AB0FF] text-[11px] font-black uppercase tracking-wider">
                <Sparkle className="w-3.5 h-3.5" /> O que nossos prompts resolvem
              </div>
              <div className="mt-6 space-y-4">
                {solucoes.map((s, i) => (
                  <ScrollReveal key={s.title} delay={i * 0.08}>
                    <div className="flex gap-4 p-4 rounded-2xl bg-black/40 border border-[#1A7AFF]/15 hover:border-[#1A7AFF]/40 transition">
                      <div className="shrink-0 w-11 h-11 rounded-xl bg-[#1A7AFF]/15 border border-[#1A7AFF]/40 flex items-center justify-center">
                        <s.icon className="w-5 h-5 text-[#7AB0FF]" />
                      </div>
                      <div>
                        <p className="text-white font-bold text-[15px] leading-snug">{s.title}</p>
                        <p className="mt-1 text-white/70 text-[13.5px] leading-relaxed">{s.desc}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-emerald-300/90 text-[13px] font-semibold">
                <TrendingUp className="w-4 h-4" /> Resultado: vídeo circulando, comentário perguntando link, venda no TikTok Shop.
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-white/50 text-[14px] italic max-w-2xl mx-auto">
            "Não é IA melhor. É prompt melhor. Quem entende isso vende. Quem não entende, fica reclamando do algoritmo."
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── POR QUE ESSES PROMPTS SÃO DIFERENTES ─────────────────── */

function PorQueDiferente() {
  const pilares = [
    {
      icon: Brain,
      tag: "Engenharia",
      title: "Não são prompts. É engenharia de retenção.",
      desc: "Cada movimento foi decomposto frame a frame de vídeos que fizeram +1M de views. A gente reescreve em linguagem que a IA obedece. Você não copia texto — copia um padrão de viralização.",
      accent: "from-[#1A7AFF]/20 to-transparent",
      ring: "border-[#1A7AFF]/40",
      iconBg: "bg-[#1A7AFF]/15 text-[#7AB0FF] border-[#1A7AFF]/50",
    },
    {
      icon: Flame,
      tag: "Testado ao vivo",
      title: "Passaram pelo TikTok Shop antes de você.",
      desc: "Todo prompt que entra na biblioteca já foi para o feed nos perfis dos alunos, mediu retenção real, comentário real e venda real. O que não performa, é cortado. Você só recebe o que vende.",
      accent: "from-[var(--flame)]/20 to-transparent",
      ring: "border-[var(--flame)]/40",
      iconBg: "bg-[var(--flame)]/15 text-[var(--flame)] border-[var(--flame)]/50",
    },
    {
      icon: Layers,
      tag: "Sistema",
      title: "Não é um prompt. É uma esteira.",
      desc: "Prompt de hook + prompt de sustentação + prompt de CTA + prompt de variação. Você monta um vídeo inteiro do TikTok em blocos. Isso não existe em vídeo do YouTube, não existe em curso gringo.",
      accent: "from-emerald-500/20 to-transparent",
      ring: "border-emerald-500/40",
      iconBg: "bg-emerald-500/15 text-emerald-300 border-emerald-500/50",
    },
  ];
  return (
    <section className="relative bg-[var(--ink-2)] border-b border-white/5 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: "linear-gradient(135deg, transparent 0%, rgba(255,255,255,0.02) 50%, transparent 100%)" }} />
      <div className="relative max-w-7xl mx-auto px-5 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>Por que aqui é diferente</SectionLabel>
          <h2 className="font-black text-[36px] sm:text-[56px] leading-[1.05] mt-4 text-white tracking-[-0.02em]">
            Prompt qualquer um acha rolando no TikTok.<br className="hidden sm:block" />
            <span className="italic font-medium text-white/80">Prompt que vende, só quem já vendeu monta.</span>
          </h2>
          <p className="mt-6 text-[16px] sm:text-[18px] text-white/70 leading-relaxed">
            Três coisas que fazem esses prompts serem outra categoria — e por que nenhum outro material que você viu por aí resolve isso.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {pilares.map((p, i) => {
            const Icon = p.icon;
            return (
              <ScrollReveal key={p.title} delay={i * 0.08}>
                <div
                  className="h-full rounded-[24px] p-[1.5px]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(26, 122, 255,0.6), rgba(26, 122, 255,0.2) 40%, rgba(255,255,255,0.04) 70%, rgba(26, 122, 255,0.5))",
                  }}
                >
                  <div
                    className="relative h-full rounded-[22px] overflow-hidden flex flex-col items-center text-center px-7 py-10"
                    style={{
                      background:
                        "linear-gradient(180deg, #0c0c0e 0%, #050505 100%)",
                      boxShadow:
                        "0 30px 80px -20px rgba(26, 122, 255,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-70"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(26, 122, 255,0.18), transparent 70%)",
                      }}
                    />

                    <motion.div
                      className="relative z-10 flex flex-col items-center w-full"
                      initial={{ opacity: 0, y: 40 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.5, ease: "easeOut", delay: 0.15 }}
                    >
                      <div
                        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                        style={{
                          background:
                            "linear-gradient(135deg, rgba(26, 122, 255,0.18), rgba(26, 122, 255,0.08))",
                          border: "1px solid rgba(26, 122, 255,0.35)",
                          boxShadow: "0 0 30px rgba(26, 122, 255,0.25)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-[#1A7AFF]" strokeWidth={2.2} />
                      </div>

                      <div className="text-[10px] font-black uppercase tracking-[0.22em] text-white/50 mb-3">
                        {p.tag}
                      </div>

                      <h3 className="font-display text-[22px] sm:text-[26px] uppercase leading-[1.05] text-white font-bold max-w-md text-center">
                        <span style={{ textShadow: "0 0 24px rgba(26, 122, 255,0.4)" }}>
                          {p.title}
                        </span>
                      </h3>
                      <p className="mt-4 text-[14px] sm:text-[15px] text-white/70 leading-relaxed max-w-md text-center">
                        {p.desc}
                      </p>

                      <div className="mt-6 flex flex-col items-center">
                        <div className="inline-flex items-center gap-2 rounded-full border border-[#1A7AFF]/40 bg-[#1A7AFF]/10-sm px-4 py-2 shadow-[0_0_20px_rgba(26, 122, 255,0.18)]">
                          <Shield className="w-4 h-4 text-[#1A7AFF]" strokeWidth={2} />
                          <span className="text-[12px] font-semibold text-[#1A7AFF] tracking-wide">
                            Garantia 7 dias + R$1.000 no PIX
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>


        <div className="mt-12 text-center">
          <button
            onClick={openPixCheckout}
            className="gold-pill group"
          >
            Quero acesso aos prompts que vendem <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </button>
          <p className="mt-3 text-white/40 text-[12px]">Acesso imediato · +700 prompts virais · novo prompt TODO DIA</p>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── STICKY MOBILE CTA ─────────────────── */


function StickyMobileCTA() {
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-black via-black/95 to-transparent">
      <a
        href="#planos"
        className="gold-pill w-full font-bold py-4 rounded-full"
      >
        Garantir meu acesso <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}

function formatTikCount(n: number) {
  if (n >= 1_000_000) {
    const v = n / 1_000_000;
    return (v >= 10 ? v.toFixed(1) : v.toFixed(2)).replace(/\.?0+$/, "") + "M";
  }
  if (n >= 1_000) {
    const v = n / 1_000;
    return (v >= 100 ? Math.round(v).toString() : v.toFixed(1).replace(/\.0$/, "")) + "K";
  }
  return n.toString();
}

type TikStatsBase = { views: number; likes: number; comments: number; saves: number; handle: string; caption: string };

function TikTokPromptCard({ src, seed, base }: { src: string; seed: number; base: TikStatsBase }) {
  const [views, setViews] = useState(base.views);
  const [likes, setLikes] = useState(base.likes);
  const [comments, setComments] = useState(base.comments);
  const [saves, setSaves] = useState(base.saves);
  const [liked, setLiked] = useState(false);
  const [likePop, setLikePop] = useState(false);

  useEffect(() => {
    const rand = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));
    const tickViews = setInterval(() => {
      setViews((v) => v + rand(20, 120));
    }, 4500 + (seed % 5) * 400);
    const tickEngagement = setInterval(() => {
      setLikes((v) => v + rand(1, 10));
      if (Math.random() < 0.4) setComments((v) => v + rand(1, 3));
      if (Math.random() < 0.3) setSaves((v) => v + rand(1, 4));
    }, 6000 + (seed % 6) * 500);
    const tapDelay = 12000 + (seed % 7) * 1800;
    const tickTap = setInterval(() => {
      setLiked(true);
      setLikePop(true);
      setLikes((v) => v + rand(60, 220));
      setTimeout(() => setLikePop(false), 500);
      setTimeout(() => setLiked(false), 2200);
    }, tapDelay);
    return () => {
      clearInterval(tickViews);
      clearInterval(tickEngagement);
      clearInterval(tickTap);
    };
  }, [seed]);


  return (
    <div className="relative shrink-0 w-[180px] sm:w-[240px] md:w-[280px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-[#1A7AFF]/50 bg-black shadow-[0_0_40px_-8px_rgba(26,122,255,0.55),0_20px_60px_-30px_rgba(26,122,255,0.7)] hover:border-[#1A7AFF] hover:shadow-[0_0_60px_-6px_rgba(26,122,255,0.8)] transition">
      <PromptLoopVideo src={src} />
      {/* Views badge top-left */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1 px-2 py-1 rounded-full bg-black/70 border border-white/20 text-white text-[10px] sm:text-[11px] font-black tabular-nums">
        <Play className="w-2.5 h-2.5 fill-white" /> {formatTikCount(views)}
      </div>
      {/* Live pulse dot */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-red-500/90 text-white text-[8px] font-black uppercase tracking-wider">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" /> On
      </div>
      {/* Bottom gradient */}
      <div className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-black via-black/70 to-transparent pointer-events-none" />
      {/* Right side TikTok actions */}
      <div className="absolute right-1.5 bottom-16 sm:bottom-20 z-10 flex flex-col items-center gap-3 sm:gap-4 text-white">
        <div className="flex flex-col items-center">
          <div className={`relative w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 flex items-center justify-center transition-transform ${likePop ? "scale-125" : "scale-100"}`}>
            <Heart className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors duration-300 ${liked ? "fill-[#ff2b55] text-[#ff2b55] drop-shadow-[0_0_6px_rgba(255,43,85,0.8)]" : "fill-white text-white"}`} />
            {likePop && (
              <span className="pointer-events-none absolute inset-0 rounded-full border-2 border-[#ff2b55] animate-ping" />
            )}
          </div>
          <span className={`mt-0.5 text-[9px] sm:text-[10px] font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)] transition-colors ${liked ? "text-[#ff2b55]" : "text-white"}`}>{formatTikCount(likes)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 flex items-center justify-center">
            <MessageCircle className="w-4 h-4 sm:w-5 sm:h-5 fill-white text-black" />
          </div>
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{formatTikCount(comments)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 flex items-center justify-center">
            <Bookmark className="w-4 h-4 sm:w-5 sm:h-5 fill-[#facc15] text-[#facc15]" />
          </div>
          <span className="mt-0.5 text-[9px] sm:text-[10px] font-bold tabular-nums drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{formatTikCount(saves)}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/50 flex items-center justify-center">
            <Share2 className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
          </div>
        </div>
      </div>
      {/* Bottom left handle + caption */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-2.5 sm:p-3 pr-11 sm:pr-14">
        <p className="text-white text-[11px] sm:text-[12px] font-black leading-tight drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{base.handle}</p>
        <p className="mt-1 text-white/90 text-[10px] sm:text-[11px] leading-tight line-clamp-2 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">{base.caption}</p>
        <div className="mt-1.5 flex items-center gap-1 text-white/80 text-[9px] sm:text-[10px]">
          <Music2 className="w-2.5 h-2.5" />
          <span className="truncate">som original · viral sound</span>
        </div>
      </div>
    </div>
  );
}

function PromptLoopVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;

    v.muted = true;
    v.defaultMuted = true;
    v.setAttribute("muted", "");
    v.setAttribute("playsinline", "");
    v.setAttribute("webkit-playsinline", "true");

    const tryPlay = () => {
      const p = v.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    // Prime first frame so it never shows black
    const prime = () => {
      try { if (v.currentTime === 0) v.currentTime = 0.05; } catch {}
      tryPlay();
    };

    v.addEventListener("loadedmetadata", prime);
    v.addEventListener("loadeddata", tryPlay);
    v.addEventListener("canplay", tryPlay);
    tryPlay();

    const onVis = () => { if (!document.hidden) tryPlay(); };
    const onGesture = () => tryPlay();
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("touchstart", onGesture, { passive: true });
    document.addEventListener("click", onGesture);

    return () => {
      v.removeEventListener("loadedmetadata", prime);
      v.removeEventListener("loadeddata", tryPlay);
      v.removeEventListener("canplay", tryPlay);
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("touchstart", onGesture);
      document.removeEventListener("click", onGesture);
    };
  }, [src]);
  return (
    <video
      ref={ref}
      src={src}
      muted
      loop
      autoPlay
      playsInline
      // @ts-ignore iOS Safari
      webkit-playsinline="true"
      disableRemotePlayback
      preload="none"
      className="w-full h-full object-cover bg-black"
    />
  );
}

import viral1 from "@/assets/viral1.mp4.asset.json";
import viral2 from "@/assets/viral2.mp4.asset.json";
import viral3 from "@/assets/viral3.mp4.asset.json";
import viral4 from "@/assets/viral4.mp4.asset.json";
import viral5 from "@/assets/viral5.mov.asset.json";
import viral6 from "@/assets/viral6.mp4.asset.json";
import viral7 from "@/assets/viral7.mp4.asset.json";
import viral8 from "@/assets/viral8.mp4.asset.json";
import viral9 from "@/assets/viral9.mp4.asset.json";
import viral10 from "@/assets/viral10.mp4.asset.json";
import viral11 from "@/assets/viral11.mp4.asset.json";

const VIRAL_VIDEOS = [
  { src: viral1.url, handle: "@promptsvirais", caption: "Try-on viralizando 🔥", views: "2.4M", likes: "312K", comments: "4.8K", saves: "22K" },
  { src: viral2.url, handle: "@iacreator", caption: "Giro 360° UGC prompt", views: "1.1M", likes: "184K", comments: "2.1K", saves: "18K" },
  { src: viral3.url, handle: "@ugcbrasil", caption: "Unboxing IA + TikTok Shop", views: "3.7M", likes: "521K", comments: "9.2K", saves: "41K" },
  { src: viral4.url, handle: "@promptsvirais", caption: "Ajustando cabelo — prompt clássico", views: "890K", likes: "142K", comments: "1.9K", saves: "12K" },
  { src: viral5.url, handle: "@iacreator", caption: "Hoodie pose que converteu 💸", views: "1.8M", likes: "263K", comments: "3.4K", saves: "27K" },
  { src: viral6.url, handle: "@sophielurent01", caption: "POV: achou a peça mais vendida 👗", views: "2.9M", likes: "398K", comments: "5.6K", saves: "31K" },
  { src: viral7.url, handle: "@promptsvirais", caption: "Espelho + look completo", views: "1.4M", likes: "211K", comments: "2.7K", saves: "16K" },
  { src: viral8.url, handle: "@sophielurent01", caption: "De costas mostrando o caimento", views: "980K", likes: "156K", comments: "2.2K", saves: "14K" },
  { src: viral9.url, handle: "@ugcbrasil", caption: "Prompt novo bombando essa semana 🚀", views: "4.2M", likes: "612K", comments: "11K", saves: "48K" },
  { src: viral10.url, handle: "@sophielurent01", caption: "Try-on estilo passarela", views: "1.6M", likes: "234K", comments: "3.1K", saves: "19K" },
  { src: viral11.url, handle: "@sophielurent01", caption: "Close no produto que converte", views: "760K", likes: "118K", comments: "1.6K", saves: "9.8K" },
];


function TikTokViralCard({ v }: { v: typeof VIRAL_VIDEOS[number] }) {
  return (
    <div className="shrink-0 w-[180px] sm:w-[220px] rounded-[22px] overflow-hidden bg-black relative shadow-[0_20px_50px_-25px_rgba(0,0,0,0.65)]">
      <div className="relative aspect-[9/16] bg-black">
        <PromptLoopVideo src={v.src} />
        {/* gradient overlays */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/70 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-[55%] bg-gradient-to-t from-black/95 via-black/60 to-transparent pointer-events-none" />

        {/* views badge top-left (play + count) */}
        <div className="absolute top-2 left-2 inline-flex items-center gap-1 px-2 py-1 rounded-full bg-black/55 backdrop-blur text-white text-[11px] font-black">
          <Play className="w-3 h-3 fill-white text-white" /> {v.views}
        </div>
        {/* ON badge top-right */}
        <div className="absolute top-2 right-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ff2b55] text-white text-[10px] font-black uppercase tracking-wide shadow-lg">
          <span className="w-1 h-1 rounded-full bg-white" /> ON
        </div>

        {/* right action rail — big TikTok-style icons */}
        <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2.5 text-white">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md grid place-items-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <Heart className="w-4 h-4 fill-white text-white" />
            </div>
            <span className="mt-0.5 text-[10px] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-none">{v.likes}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md grid place-items-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <MessageCircle className="w-4 h-4 fill-white text-black" />
            </div>
            <span className="mt-0.5 text-[10px] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-none">{v.comments}</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md grid place-items-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
              <Bookmark className="w-4 h-4 fill-[#facc15] text-[#facc15]" />
            </div>
            <span className="mt-0.5 text-[10px] font-black drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-none">{v.saves}</span>
          </div>
          <div className="w-8 h-8 rounded-full bg-black/45 backdrop-blur-md grid place-items-center shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
            <Share2 className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* bottom caption block */}
        <div className="absolute inset-x-0 bottom-0 z-20 p-2.5 pr-11 text-white bg-gradient-to-t from-black/95 via-black/70 to-transparent">
          <p className="text-[12px] font-black tracking-tight text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{v.handle}</p>
          <p className="mt-0.5 text-[10.5px] text-white leading-snug line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">{v.caption}</p>
          <p className="mt-1 inline-flex items-center gap-1 text-[9.5px] font-semibold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,1)]">
            <Music2 className="w-2.5 h-2.5" /> som original · viral sound
          </p>
        </div>

      </div>
    </div>
  );
}



function PromptsShowcase() {
  const loop = [...VIRAL_VIDEOS, ...VIRAL_VIDEOS];
  return (
    <section id="prompts-secretos" className="relative py-20 sm:py-28 bg-[var(--ink)] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(60% 40% at 50% 0%, rgba(31, 109, 255,0.18), transparent 70%)" }} />

      <div className="relative max-w-6xl mx-auto px-5 sm:px-8 text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-bold rounded-full mb-4 border border-[var(--flame)]/40 text-[var(--flame)] bg-[var(--flame)]/10 uppercase tracking-wider">
          <Lock className="w-3 h-3" /> Só quem entra tem acesso
        </div>
        <h2 className="text-[28px] leading-[1.1] sm:text-[52px] sm:leading-[1.05] font-black tracking-[-0.02em] text-white px-2">
          Os prompts <span className="text-[var(--flame)]">secretos</span> que estão{" "}
          <span className="italic font-medium text-white/80">gerando milhares de reais no TikTok Shop com influencers de IA.</span>
        </h2>
        <p className="mt-5 text-[15px] sm:text-[17px] text-white/70 max-w-2xl mx-auto leading-relaxed">
          Biblioteca privada de prompts UGC testados e prontos pra colar.
        </p>

        <div className="mt-6 flex flex-wrap justify-center gap-2 text-[11px] sm:text-[12px]">
          {["Unboxing", "Giro 360°", "Try-on", "Ajustando cabelo", "Hoodie pose", "De costas", "Espelho"].map((t) => (
            <span key={t} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/80">
              {t}
            </span>
          ))}
        </div>
      </div>

      <div className="relative mt-12">
        <style>{`@keyframes viral-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
        <div className="relative overflow-hidden">
          <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-[var(--ink)] to-transparent" />
          <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-[var(--ink)] to-transparent" />
          <div className="flex gap-4 w-max px-5" style={{ animation: "viral-scroll 40s linear infinite" }}>
            {loop.map((v, i) => (
              <TikTokViralCard key={`vv-${i}`} v={v} />
            ))}
          </div>
        </div>
      </div>

      <div className="relative mt-12 text-center px-5">
        <p className="text-[13px] sm:text-[14px] text-white/60 mb-5 max-w-xl mx-auto">
          <span className="text-white font-semibold">+700 prompts virais</span> na biblioteca — e um prompt <span className="text-white font-semibold">novo TODO DIA</span>. Você recebe todos assim que entrar.
        </p>
        <button
          onClick={openPixCheckout}
          className="gold-pill group"
        >
          Quero os prompts secretos <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  );

}

/* ─────────────────── PERFIS VIRALIZADOS ─────────────────── */

function PerfisViralizados() {
  const perfis = [
    { img: perfilMaya.url,    nome: "Maya Valen",     handle: "@maya.shop23",     seguidores: "179 mil",  curtidas: "507,2 mil", views: "1,2M",   lucro: "R$ 84.320", top: "Vestido viral · R$39" },
    { img: perfilThalia2.url, nome: "Thalia Oliveira",handle: "@thalia_oliveira5",seguidores: "48,8 mil", curtidas: "243,8 mil", views: "705,5 mil", lucro: "R$ 42.780", top: "Conjunto laranja · R$59" },
    { img: perfilLaura.url,   nome: "Laura",          handle: "@adnareiis",       seguidores: "28,5 mil", curtidas: "59,9 mil",  views: "102,8 mil", lucro: "R$ 27.910", top: "Achadinho fashion" },
    { img: perfilLuna.url,    nome: "Luna",           handle: "@lunafinds21",     seguidores: "11,8 mil", curtidas: "39,4 mil",  views: "117,9 mil", lucro: "R$ 19.640", top: "Vestido azul · R$49" },
    { img: perfilIsis.url,    nome: "Ísis Bellini",   handle: "@isiis.glow",      seguidores: "14,2 mil", curtidas: "52,3 mil",  views: "143 mil", lucro: "R$ 22.150", top: "Look preto viral" },
    { img: perfilThalia1.url, nome: "Thalia Oliveira",handle: "@thalia_oliveira5",seguidores: "48,8 mil", curtidas: "243,8 mil", views: "705,5 mil", lucro: "R$ 38.420", top: "Conjunto lilás · R$59" },
  ];

  return (
    <section className="relative py-24 sm:py-32 bg-[var(--ink)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(26,122,255,0.12), transparent 70%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="text-center mb-14 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A7AFF]">
            <Flame className="w-3.5 h-3.5" /> perfis que já usam
          </span>
          <h2 className="mt-4 text-[28px] leading-[1.1] sm:text-[52px] sm:leading-[1.05] font-black tracking-[-0.02em] text-white px-2">
            Perfis reais que <span className="text-[var(--flame)]">viralizaram</span>{" "}
            <span className="italic font-medium text-white/80">usando os prompts.</span>
          </h2>
          <p className="mt-4 text-[15px] sm:text-[17px] text-white/70 leading-relaxed">
            Contas anônimas de moda e achadinhos que aplicaram nossos prompts, explodiram em views e transformaram TikTok em máquina de venda.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {perfis.map((p, i) => (
            <ScrollReveal key={i} delay={i * 0.05}>
              <article className="group relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/10 hover:border-[var(--flame)]/40 transition-all duration-500 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]">
                {/* Profile image */}
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={p.img}
                    alt={p.nome}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />

                  {/* Verified badge */}
                  <div className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur border border-white/15 text-[10px] font-bold text-white uppercase tracking-wider">
                    <Check className="w-3 h-3 text-[#1A7AFF]" strokeWidth={3} />
                    Usa os prompts
                  </div>

                  {/* Lucro badge */}
                  <div className="absolute top-3 right-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[var(--flame)] text-black text-[10px] font-black uppercase tracking-wider shadow-lg">
                    <DollarSign className="w-3 h-3" strokeWidth={3} />
                    {p.lucro}
                  </div>

                  {/* Bottom info overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="text-white font-black text-[18px] leading-tight">{p.nome}</h3>
                    <p className="text-white/60 text-[12px] font-medium">{p.handle}</p>
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-3 divide-x divide-white/10 border-t border-white/10 bg-black/40">
                  <div className="px-2 py-3 text-center">
                    <div className="text-white font-black text-[15px] tabular-nums">{p.seguidores}</div>
                    <div className="text-white/45 text-[9px] font-bold uppercase tracking-wider mt-0.5">Seguidores</div>
                  </div>
                  <div className="px-2 py-3 text-center">
                    <div className="text-white font-black text-[15px] tabular-nums">{p.curtidas}</div>
                    <div className="text-white/45 text-[9px] font-bold uppercase tracking-wider mt-0.5">Curtidas</div>
                  </div>
                  <div className="px-2 py-3 text-center">
                    <div className="text-[var(--flame)] font-black text-[15px] tabular-nums">{p.views}</div>
                    <div className="text-white/45 text-[9px] font-bold uppercase tracking-wider mt-0.5">Views/vídeo</div>
                  </div>
                </div>

                {/* Top video */}
                <div className="px-5 py-3 flex items-center gap-2 border-t border-white/5 bg-black/60">
                  <TrendingUp className="w-3.5 h-3.5 text-[var(--flame)] shrink-0" />
                  <span className="text-white/70 text-[11.5px] font-semibold truncate">
                    Top: {p.top}
                  </span>
                </div>
              </article>
            </ScrollReveal>
          ))}
        </div>

        {/* Total lucrado */}
        <TotalFaturadoCard onCta={openPixCheckout} />


        <p className="mt-6 text-center text-[11px] text-white/35 max-w-2xl mx-auto">
          * Perfis reais. Valores de faturamento estimados com base em vendas, comissões TikTok Shop e mensalidades de grupos VIP dos criadores.
        </p>
      </div>
    </section>
  );
}

/* ─────────────────── TOTAL FATURADO CARD ─────────────────── */

function useCountUp(target: number, duration = 1800) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !started.current) {
            started.current = true;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min(1, (now - start) / duration);
              // easeOutExpo
              const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
              setValue(Math.round(target * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target, duration]);

  return { value, ref };
}

function TotalFaturadoCard({ onCta }: { onCta: () => void }) {
  // conta até 1.240.000
  const { value, ref } = useCountUp(1_240_000, 2000);
  const formatted = value.toLocaleString("pt-BR");

  const stats = [
    { label: "Perfis ativos", value: "+120", icon: Users },
    { label: "Views geradas", value: "480M+", icon: Eye },
    { label: "Vendas TikTok Shop", value: "62k+", icon: Wallet },
  ];

  return (
    <div ref={ref} className="mt-16 relative rounded-[32px] overflow-hidden border border-white/10 bg-zinc-950 p-8 sm:p-12 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
      {/* Glow layers (blue only) */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(70% 60% at 50% 0%, rgba(31,109,255,0.22), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-32 -right-20 w-80 h-80 rounded-full pointer-events-none opacity-70"
        style={{ background: "radial-gradient(circle, rgba(26,122,255,0.22), transparent 70%)" }}
      />
      {/* subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "42px 42px",
        }}
      />

      <div className="relative flex flex-col items-center text-center">
        {/* Trophy badge */}
        <div className="relative mb-6">
          <span className="absolute inset-0 rounded-full bg-[var(--flame)]/25 blur-2xl" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--flame)] to-[#00338a] grid place-items-center border border-white/15 shadow-[0_15px_40px_-10px_rgba(31,109,255,0.7)]">
            <Trophy className="w-8 h-8 text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]" strokeWidth={2.2} />
          </div>
        </div>

        <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[var(--flame-2)] mb-3">
          Total faturado pelos alunos
        </p>

        <div className="flex items-baseline gap-1.5 justify-center">
          <span className="text-white/60 text-[22px] sm:text-[26px] font-bold">R$</span>
          <span className="font-black text-[56px] sm:text-[84px] leading-[0.95] text-white tracking-[-0.04em] tabular-nums bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            {formatted}
          </span>
        </div>

        <p className="mt-4 text-white/60 text-[13.5px] max-w-md leading-relaxed">
          Faturamento estimado dos <b className="text-white/90">perfis acima</b> nos últimos 6 meses usando os nossos prompts.
        </p>

        {/* Stats grid */}
        <div className="mt-8 grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-md">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl bg-white/[0.03] border border-white/10 px-2 py-4 flex flex-col items-center gap-1.5"
            >
              <s.icon className="w-4 h-4 text-[var(--flame-2)]" />
              <div className="font-black text-white text-[15px] sm:text-[18px] tabular-nums">{s.value}</div>
              <div className="text-[9px] sm:text-[10px] uppercase tracking-[0.15em] text-white/45 font-bold text-center leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={onCta}
          className="gold-pill group mt-9"
        >
          <Sparkles className="w-4 h-4" />
          Quero os prompts também
          <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
        </button>

        <div className="mt-4 flex items-center gap-2 text-white/40 text-[10.5px] font-bold uppercase tracking-[0.2em]">
          <Lock className="w-3 h-3" />
          acesso vitalício · PIX seguro
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── ATUALIZAÇÃO DIÁRIA ─────────────────── */

function AtualizacaoDiaria() {
  return (
    <section className="relative py-24 sm:py-32 bg-[var(--ink-2)] border-y border-white/5 overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-70"
        style={{ background: "radial-gradient(55% 45% at 50% 0%, rgba(31,109,255,0.14), transparent 70%)" }}
      />
      <div
        className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1f6dff, transparent 60%)" }}
      />

      <div className="relative max-w-6xl mx-auto px-5">
        <div className="text-center max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A7AFF]">
            <Repeat className="w-3.5 h-3.5" /> Biblioteca sempre viva
          </span>
          <h2 className="mt-4 text-[28px] leading-[1.1] sm:text-[52px] sm:leading-[1.05] font-black tracking-[-0.02em] text-white px-2">
            +700 prompts <span className="text-[var(--flame)]">virais</span>.{" "}
            <span className="italic font-medium text-white/80">1 novo TODO DIA na área VIP.</span>
          </h2>
          <p className="mt-5 text-[15px] sm:text-[17px] text-white/70 leading-relaxed">
            Todos os dias a gente libera um prompt novo baseado nas trends do momento. Você nunca vai gravar um vídeo com prompt saturado — só usa o que ainda tá pegando fogo no feed <span className="text-white font-semibold">agora</span>.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: TrendingUp,
              title: "1 prompt novo por dia",
              desc: "Todo dia às 9h um prompt inédito cai na área VIP. Baseado em vídeos que tão bombando essa semana no TikTok Shop.",
            },
            {
              icon: Ban,
              title: "Zero prompt saturado",
              desc: "Você nunca vai gravar com prompt que já morreu. Sempre tem material fresco pra postar antes da onda passar.",
            },
            {
              icon: Rocket,
              title: "Sempre à frente da trend",
              desc: "Enquanto os outros criadores copiam o que já viralizou, você já tá gravando o próximo viral. Vantagem injusta.",
            },
          ].map((it) => (
            <ScrollReveal key={it.title}>
              <article
                className="h-full rounded-3xl p-6 sm:p-7 bg-zinc-950/80 border border-white/10 hover:border-[var(--flame)]/40 transition-all duration-500 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.7)]"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                  style={{ background: "linear-gradient(135deg, rgba(31,109,255,0.25), rgba(31,109,255,0.05))", border: "1px solid rgba(31,109,255,0.35)" }}
                >
                  <it.icon className="w-5 h-5 text-[var(--flame)]" />
                </div>
                <h3 className="font-display uppercase text-[20px] sm:text-[22px] tracking-tight text-white leading-tight">
                  {it.title}
                </h3>
                <p className="mt-3 text-[14px] text-white/65 leading-relaxed">{it.desc}</p>
              </article>
            </ScrollReveal>
          ))}
        </div>

        <div className="mt-12 relative rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-[var(--flame)]/[0.08] to-transparent border border-[var(--flame)]/25 flex flex-col sm:flex-row items-center gap-5 sm:gap-8">
          <div className="shrink-0 w-16 h-16 rounded-2xl bg-[var(--flame)]/15 border border-[var(--flame)]/40 grid place-items-center">
            <Flame className="w-7 h-7 text-[var(--flame)]" />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--flame)]">enquanto os outros repetem</div>
            <p className="mt-2 text-white text-[15px] sm:text-[17px] leading-snug">
              Cada dia você entra na área VIP e tem <span className="font-bold text-[var(--flame)]">1 prompt novo</span> te esperando. Todo santo dia. Pra você nunca ficar sem o que postar.
            </p>
          </div>
          <button
            onClick={openPixCheckout}
            className="gold-pill shrink-0 whitespace-nowrap"
          >
            Quero acesso vitalício <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── PRICING CARD ─────────────────── */



function PricingCard() {
  const [secs, setSecs] = useState(24 * 60 * 60);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  const bullets = [
    "+700 prompts virais prontos pra colar",
    "Prompt novo liberado TODO DIA na área VIP",
    "Grupo VIP com atualizações e trends do momento",
    "Acesso vitalício — pague uma vez só",
    "Garantia incondicional de 7 dias",
  ];

  return (
    <section id="planos" className="relative py-24 sm:py-32 bg-[var(--ink)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(60% 45% at 50% 0%, rgba(31,109,255,0.16), transparent 70%)" }}
      />
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(45% 40% at 50% 100%, rgba(26,122,255,0.14), transparent 70%)" }}
      />


      <div className="relative max-w-md mx-auto px-5">
        <div className="text-center mb-8">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#1A7AFF]">
            <span className="w-6 h-px bg-[#1A7AFF]" /> promoção válida por 24 horas
          </span>
          <h2 className="mt-4 font-black text-[32px] sm:text-[44px] leading-[1.05] text-white tracking-[-0.02em]">
            Somente <span className="text-[var(--flame)]">hoje</span> por esse preço.
          </h2>
          <p className="mt-4 text-[15px] text-white/70 leading-relaxed">
            Você tem <span className="text-white font-bold">24 horas</span> pra garantir. Quando o cronômetro zerar, o valor volta pro cheio — sem exceção.
          </p>
        </div>

        <div className="relative rounded-[36px] overflow-hidden bg-zinc-950 border border-white/10 shadow-[0_40px_100px_-30px_rgba(0,0,0,0.9)]">
          {/* Top urgency banner */}
          <div className="bg-[var(--flame)] py-2.5 px-4 flex justify-center items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
            </span>
            <span className="text-[10px] font-black text-black uppercase tracking-[0.25em]">
              Oferta Relâmpago
            </span>
          </div>

          <div className="p-8 flex flex-col items-center relative">
            <div
              className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 rounded-full pointer-events-none opacity-40"
              style={{ background: "radial-gradient(circle, rgba(31,109,255,0.4), transparent 70%)" }}
            />

            <h3 className="text-white/50 text-[11px] font-bold uppercase tracking-[0.25em] mb-5 relative">
              Promoção acaba em (24h)
            </h3>

            {/* Countdown */}
            <div className="flex items-start gap-2.5 mb-10 relative">
              <TimerBlock value={hh} label="Horas" />
              <span className="text-white/20 font-black text-2xl mt-2">:</span>
              <TimerBlock value={mm} label="Min" />
              <span className="text-white/20 font-black text-2xl mt-2">:</span>
              <TimerBlock value={ss} label="Seg" accent />
            </div>

            {/* Price */}
            <div className="text-center mb-8 relative">
              <div className="inline-flex items-center gap-2 mb-2">
                <span className="text-white/45 text-[14px] font-medium line-through decoration-[var(--flame)]/70">
                  R$ 197,90
                </span>
                <span className="bg-[var(--flame)]/12 text-[var(--flame)] text-[10px] px-2 py-0.5 rounded-full border border-[var(--flame)]/40 font-black uppercase tracking-wider">
                  -66% OFF
                </span>
              </div>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-white/70 text-[20px] font-bold">R$</span>
                <span className="text-white text-[72px] font-black tracking-[-0.04em] leading-none">67</span>
                <span className="text-white text-[32px] font-black tracking-tight">,90</span>
              </div>
              <p className="text-white/50 text-[12px] mt-3 font-medium">
                Pagamento único no PIX · acesso vitalício
              </p>
            </div>

            {/* Bullets */}
            <ul className="w-full space-y-2.5 mb-8 relative">
              {bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[13.5px] text-white/85 leading-snug">
                  <span className="mt-0.5 shrink-0 w-4.5 h-4.5 rounded-full bg-[var(--flame)]/15 border border-[var(--flame)]/40 grid place-items-center" style={{ width: 18, height: 18 }}>
                    <Check className="w-2.5 h-2.5 text-[var(--flame)]" strokeWidth={3} />
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <button
              onClick={openPixCheckout}
              className="gold-pill group w-full"
            >
              Quero os prompts por R$ 67,90
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </button>

            {/* Trust */}
            <div className="mt-7 flex flex-col items-center gap-3 relative">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-white/55 text-[10px] font-bold uppercase tracking-[0.2em]">
                  Pagamento seguro · Garantia 7 dias
                </span>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-[12px] text-white/40 max-w-md mx-auto">
          Depois que o cronômetro zerar, o preço volta para <span className="text-white/70 font-semibold">R$ 197,90</span>.
        </p>
      </div>
    </section>
  );
}

function TimerBlock({ value, label, accent }: { value: string; label: string; accent?: boolean }) {
  return (
    <div className="flex flex-col items-center">
      <div
        className={`w-14 h-14 rounded-xl grid place-items-center font-black text-[22px] tabular-nums shadow-inner border ${
          accent
            ? "bg-[var(--flame)]/10 border-[var(--flame)]/40 text-[var(--flame)] animate-pulse"
            : "bg-white/[0.04] border-white/10 text-white"
        }`}
      >
        {value}
      </div>
      <span className="text-[9px] text-white/40 mt-1.5 uppercase font-bold tracking-widest">{label}</span>
    </div>
  );
}


