import { createFileRoute, Link } from "@tanstack/react-router";
import TikTokSaleNotifications from "@/components/TikTokSaleNotifications";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Play, Shield, Sparkles, Zap, Clock, Star, Volume2, Bot, Video, Wand2, Megaphone, GraduationCap, Users, Gift, Infinity as InfinityIcon, Brain, Crown, MessageCircle, Rocket, Smartphone, Trophy, Lock, Headphones, PlayCircle, Layers, TrendingUp, Wallet, DollarSign, Radar, Eye, Flame } from "lucide-react";
import { motion } from "framer-motion";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import { ScrollReveal } from "@/components/ScrollReveal";

import logoAsset from "@/assets/fabrica-ugc-logo.png.asset.json";
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

const logo = logoAsset.url;

const FLAME = "#ff5a1f";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CEO TikShop — Crie sua Influencer de IA que fatura 24h" },
      {
        name: "description",
        content:
          "O método CEO TikShop ensina a criar Influencers de IA realistas em 2 minutos e vender todos os dias sem aparecer. Garantia incondicional de 7 dias + R$1.000 no PIX se não funcionar.",
      },
      { property: "og:title", content: "CEO TikShop — Influencers de IA que vendem 24h" },
      { property: "og:description", content: "Crie sua Influencer de IA em 2 minutos. Sem aparecer, sem editar, sem complicação." },
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
      <RadarTikshop />
      
      <DemoReel />
      <Community />
      <Mentor />
      <Testimonials />
      <Deliverables />
      <Pricing />
      <Guarantee />
      <FAQ />
      <FinalCTA />
      <Footer />
      <StickyMobileCTA />
    </div>
  );
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
    <header className="sticky top-0 z-40 backdrop-blur-md bg-[var(--ink)]/80 border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 h-20 md:h-24 flex items-center justify-between gap-3">
        <a href="#top" className="flex items-center shrink-0">
          <img
            src={logo}
            alt="Fábrica de UGC"
            className="h-14 sm:h-16 md:h-20 w-auto drop-shadow-[0_4px_18px_rgba(255,90,31,0.55)]"
          />
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
            className="relative inline-flex items-center bg-white text-black font-semibold text-[11px] sm:text-[12px] px-3 sm:px-4 py-2 rounded-full overflow-hidden shine-btn transition hover:shadow-[0_8px_24px_-6px_rgba(255,255,255,0.4)]"
            title="Acesso exclusivo para alunos VIP"
          >
            Entrar
          </Link>
          <a
            href="#planos"
            className="group inline-flex items-center gap-2 text-white font-bold text-[12px] sm:text-[13px] px-4 py-2 rounded-full transition"
            style={{ background: "linear-gradient(180deg, #FF7A1A 0%, #8a3300 100%)", boxShadow: "inset 0 1px 0 rgba(255,255,255,0.45), 0 8px 24px -6px rgba(255,122,26,0.55)" }}
          >
            Quero vender <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
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
        style={{ background: "linear-gradient(90deg, transparent, rgba(255,122,26,.6), transparent)" }}
      />


      <div className="relative max-w-5xl mx-auto px-5 pt-12 sm:pt-20 pb-16 text-center">
        <span className="inline-flex items-center gap-2 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-[#FF7A1A] bg-[#FF7A1A]/10 border border-[#FF7A1A]/35 px-4 py-1.5 rounded-full backdrop-blur-sm">
          <Sparkles className="w-3.5 h-3.5" /> Fábrica de Influencers de IA
        </span>

        <h1 className="font-display mt-7 text-[34px] leading-[1] sm:text-[52px] lg:text-[68px] uppercase max-w-4xl mx-auto text-headline-gradient">
          <span>Aprenda a lucrar</span>{" "}
          <span>vendendo no TikTok Shop</span>{" "}
          <span>com</span>{" "}
          <span>IA</span>{" "}
          <span>sem precisar</span>{" "}
          <span>aparecer</span>
        </h1>

        <p className="mt-7 mx-auto max-w-2xl text-[16px] sm:text-[19px] text-white/80 leading-relaxed">
          <b className="text-white">O método pra fazer R$15.000/mês com TikTok Shop</b>, começando do zero e sem investir um centavo em tráfego, usando a estrutura da <b className="text-white">Fábrica de UGC</b> pra criar vídeos que vendem, <b className="text-[#FF7A1A]">aparecendo ou sem aparecer.</b>
        </p>

        <div className="relative mt-10 mx-auto max-w-2xl rounded-2xl overflow-hidden border border-[#FF7A1A]/25 shadow-[0_30px_80px_-20px_rgba(255,122,26,0.35)] aspect-video bg-black">
          <iframe
            src="https://scripts.converteai.net/4c00b079-2ae9-46b7-b111-a0b4e06e709e/players/69ec506255df2a8c627a15bb/v4/embed.html"
            title="Assista a VSL"
            allow="autoplay; fullscreen"
            allowFullScreen
            className="w-full h-full border-0"
          />
        </div>

        <div className="mt-10 flex flex-col items-center gap-5">
          <a href="#planos" className="gold-pill group">
            Quero vender no TikTok
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
  const phrase = "VENDA SEM APARECER";
  const items = Array(10).fill(phrase);
  return (
    <div className="border-y border-[#FF7A1A]/15 bg-[var(--ink-2)] overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, var(--ink-2), transparent 12%, transparent 88%, var(--ink-2))" }} />
      <div className="marquee-track flex gap-10 py-6 whitespace-nowrap">
        {[...items, ...items].map((t, i) => (
          <span key={i} className="font-display text-[28px] sm:text-[42px] uppercase flex items-center gap-10">
            <span className={i % 2 === 0 ? "ghost-stroke" : "text-gold-solid"}>{t}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF7A1A] shadow-[0_0_18px_4px_rgba(255,122,26,0.7)]" />
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
        <SectionLabel>O mercado já explodiu</SectionLabel>
        <h2 className="font-display text-[40px] sm:text-[56px] leading-[0.95] uppercase mt-4 text-headline-gradient">
          Essas influencers criadas por IA estão lucrando em torno de <span>R$ 15 mil por mês.</span>
        </h2>
        <p className="mt-6 text-[17px] text-white/70 leading-relaxed">
          E isso é só o começo. Marcas, lojas e criadores estão usando influencers de IA
          pra dominar feed, viralizar e vender — antes da saturação chegar.
        </p>
        <div className="mt-10 relative overflow-hidden -mx-5 sm:-mx-8">
          <div className="absolute inset-0 pointer-events-none z-10" style={{ background: "linear-gradient(90deg, rgba(255,255,255,0.14), transparent 10%, transparent 90%, rgba(200,200,200,0.12))" }} />
          <style>{`@keyframes proof-scroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
          <div className="flex gap-3 sm:gap-4 w-max" style={{ animation: "proof-scroll 30s linear infinite" }}>
            {[...[prime2Asset.url, prime3Asset.url, prime4Asset.url, prime5Asset.url], ...[prime2Asset.url, prime3Asset.url, prime4Asset.url, prime5Asset.url]].map((src, i) => (
              <div key={i} className="shrink-0 w-[180px] sm:w-[280px] md:w-[320px] rounded-2xl overflow-hidden border border-white/10 bg-white/5">
                <img src={src} alt={`Prova de influencer de IA ${(i % 4) + 1}`} className="w-full h-[280px] sm:h-[380px] md:h-[440px] object-cover block" />
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
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[#FF7A1A]">
      <span className="w-6 h-px bg-[#FF7A1A]" />
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
      <span className={`inline-block w-[2px] h-[10px] ml-0.5 align-middle bg-orange-300 ${done ? "animate-pulse" : ""}`} />
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
        <h2 className="font-display text-[40px] sm:text-[56px] leading-[0.95] uppercase mt-4 text-headline-gradient">
          <span>Radar TikShop</span>
          <span> — descubra os produtos</span>{" "}
          <span>antes de viralizarem</span>
        </h2>
        <p className="mt-6 text-[17px] text-white/70 leading-relaxed max-w-2xl mx-auto">
          Nossa IA varre o TikTok Shop 24h por dia e te entrega, todo dia, os produtos com maior potencial de explosão — comissão alta, baixa concorrência e demanda subindo.
        </p>
      </div>

      <div className="mt-14 max-w-5xl mx-auto rounded-3xl overflow-hidden border border-[#FF7A1A]/25 bg-gradient-to-b from-[var(--ink-2)] to-black shadow-[0_30px_80px_-20px_rgba(255,122,26,0.25)]">
        <div className="flex items-center justify-between gap-3 px-5 sm:px-7 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3">
            <span className="inline-flex rounded-full h-2.5 w-2.5 bg-[#FF7A1A]" />
            <Radar className="w-5 h-5 text-[#FF7A1A]" />
            <span className="font-display uppercase tracking-wider text-[13px] sm:text-[15px]">Radar TikShop · AO VIVO</span>
          </div>
          <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-white/60">
            <Lock className="w-3.5 h-3.5" /> Acesso exclusivo
          </span>
        </div>

        {/* Pulse Radar visual */}
        <div className="relative flex items-center justify-center py-8 border-b border-white/10 bg-gradient-to-b from-black/60 to-black/20 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at center, rgba(255,122,26,0.18), transparent 60%)" }} />
          <div
            className="pulse-radar relative z-10"
            style={{ ['--pr-size' as any]: '220px', ['--pr-color' as any]: '#FF7A1A' } as any}
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
                style={{ left: `${b.x}%`, top: `${b.y}%`, animationDelay: b.d, ['--pr-color' as any]: '#FF7A1A' } as any}
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
                <div className="absolute top-2 left-2 inline-flex items-center gap-1 bg-[#FF7A1A] text-black text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Flame className="w-3 h-3" /> HOT
                </div>
                <div className="absolute top-2 right-2 inline-flex items-center gap-1 bg-black/70 backdrop-blur text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  <Lock className="w-3 h-3" />
                </div>
                {/* Revenue badge - no circle */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="flex flex-col items-center text-center">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-wider text-orange-300 drop-shadow-[0_0_8px_rgba(255,122,26,0.6)] leading-none">
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
                    <span className="inline-flex items-center gap-1 text-orange-400 font-bold">
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
            <Eye className="inline w-4 h-4 text-[#FF7A1A] mr-1 -mt-0.5" />
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
    { video: cria1Asset.url, title: "Realismo absurdo", text: "Personagens consistentes que ninguém percebe que são IA." },
    { video: cria2Asset.url, title: "Qualquer look, qualquer cenário", text: "Mesmo rosto, infinitos figurinos — pronto pra loja, marca pessoal ou perfil temático." },
    { video: cria3Asset.url, title: "Influencer UGC", text: "Movimentos naturais, expressões reais, fala fluida — indistinguível de uma criadora de verdade segurando seu produto." },
    { video: cria6Asset.url, title: "Vídeos prontos pra viralizar", text: "Transforme qualquer vídeo do TikTok em conteúdo da sua influencer, em 2 cliques." },
  ];
  return (
    <section id="capacidades" className="bg-[var(--ink-2)] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <SectionLabel>O que ela faz por você</SectionLabel>
            <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
              Domine a criação de vídeo com IA. <span>Você cria.</span><br />
              <span className="italic font-serif normal-case">A sua influencer vende.</span>
            </h2>
          </div>
          <p className="text-white/60 max-w-sm text-[15px]">
            Quatro superpoderes que viram um negócio rodando sozinho. Sem aparecer.
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
    const tryPlay = () => v.play().catch(() => {});
    tryPlay();
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) tryPlay();
          else v.pause();
        });
      },
      { threshold: 0.15 }
    );
    io.observe(v);
    const onVis = () => { if (!document.hidden) tryPlay(); };
    const onTouch = () => tryPlay();
    document.addEventListener("visibilitychange", onVis);
    document.addEventListener("touchstart", onTouch, { once: true, passive: true });
    document.addEventListener("click", onTouch, { once: true });
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      document.removeEventListener("touchstart", onTouch);
      document.removeEventListener("click", onTouch);
    };
  }, []);
  return ref;
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
        preload="auto"
      />
      <button
        onClick={toggle}
        aria-label={muted ? "Ativar som" : "Desativar som"}
        className="absolute bottom-3 right-3 z-30 w-10 h-10 rounded-full flex items-center justify-center bg-black/60 backdrop-blur border border-white/20 hover:bg-[var(--flame)] hover:border-[var(--flame)] transition"
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
      preload="auto"
    />
  );
}

function DemoReel() {
  const videos = [
    { src: clone1Asset.url, title: "Clonar qualquer movimento", desc: "Reproduza qualquer ação, gesto ou pose de um vídeo real na sua influencer de IA — perfeita pra reviews, tutoriais e conteúdo dinâmico." },
    { src: cloneDancasAsset.url, title: "Clonar danças virais", desc: "Pegue qualquer trend ou dancinha do TikTok e transforme na sua influencer de IA — movimentos idênticos, rosto trocado, pronto pra viralizar." },
  ];
  return (
    <section id="demo" className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>Clonagem de movimentos</SectionLabel>
        <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
          Aprenda a <span>clonar movimentos</span> de qualquer vídeo.
        </h2>
        <p className="mt-5 text-white/60 text-[15px]">
          Qualquer dancinha, trend ou vídeo viral vira conteúdo da sua influencer em 2 cliques — movimentos idênticos, rosto trocado, ninguém percebe.
        </p>
      </div>

      <div className="mt-14 max-w-3xl mx-auto space-y-10">
        {videos.map((v, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#0e0e12]">
            {v.title && (
              <div className="px-5 pt-5 pb-2">
                <h3 className="font-display text-[20px] sm:text-[24px] uppercase text-[#FF7A1A]">{v.title}</h3>
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
            Isso é pra <span>você?</span>
          </h2>
          <div className="mt-10 max-w-3xl mx-auto">
            <img
              src={equipeAsset.url}
              alt="Equipe Fábrica de UGC"
              className="w-full h-auto rounded-3xl border border-white/10 shadow-[0_20px_60px_-20px_rgba(255,90,31,0.3)] breathe-3d"
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
            Kael <span>Santyns</span>
          </h2>
          <div className="mt-6 space-y-4 text-[17px] text-white/75 leading-relaxed">
            <p>
              Sou fundador da <b className="text-white">Fábrica de UGC</b> e um dos primeiros criadores a construir um ecossistema de vendas com <b className="text-white">IA realista</b> dentro do TikTok Shop.
            </p>
            <p>
              Não cheguei aqui por acidente. Cheguei porque enquanto a maioria ainda tentava entender a plataforma, eu já estava <b className="text-white">testando, errando e ajustando</b> — até encontrar o sistema que funcionava de verdade.
            </p>
            <p>
              O resultado? <b className="text-[var(--flame)]">Milhões de views</b>, centenas de milhares em faturamento e <b className="text-white">+12k alunos ativos</b> vendendo com o mesmo método — sem gastar um centavo em tráfego pago.
            </p>
            <p>
              Hoje eu não ensino teoria. Eu ensino <b className="text-white">o que eu mesmo uso todo dia</b> — a estrutura que cria vídeos que vendem, constrói perfis que convertem e escala resultado com ou sem aparecer.
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
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,122,26,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,26,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="max-w-7xl mx-auto px-5 py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>(e qual é o seu)</SectionLabel>
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
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
                    <Icon className="w-9 h-9 text-[#ff8a3d]" strokeWidth={2.2} />
                  </div>
                  <div className="flame-card pt-16 px-7 pb-10 text-center min-h-[280px]">
                    <h3 className="font-display text-[28px] uppercase leading-tight">
                      <span className="text-[#ff5a1f]" style={{ textShadow: "0 0 20px rgba(255,90,31,0.5)" }}>{p.titleYellow}</span>{" "}
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
            Quero vender no TikTok <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────── COMMUNITY ─────────────────── */

function Community() {
  const benefits = [
    { icon: DollarSign, titleYellow: "Estratégia", titleWhite: "testada", desc: "Cada passo que você vai seguir já foi executado, ajustado e validado no mundo real." },
    { icon: Rocket, titleWhite: "Funciona para", titleYellow: "iniciantes", desc: "O método foi construído pensando em quem ainda não tem nada — e transforma esse zero em estrutura, em movimento, em receita." },
    { icon: Trophy, titleWhite: "Resultados em", titleYellow: "semanas", desc: "Você não vai esperar meses pra ver se funcionou. Com execução consistente, os primeiros sinais chegam rápido." },
    { icon: Headphones, titleYellow: "Suporte", titleWhite: "contínuo", desc: "Travou numa etapa? Tem alguém do lado. É presença real enquanto você executa, pra que nenhum obstáculo vire desculpa pra parar." },
  ];
  const banners = [prime2Asset.url, prime3Asset.url, prime4Asset.url, prime5Asset.url];
  const loop = [...banners, ...banners];
  return (
    <section className="bg-black relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 40%, rgba(255,170,40,0.18), rgba(255,122,26,0.06) 40%, transparent 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(255,122,26,.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,122,26,.5) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
      <div className="max-w-6xl mx-auto px-5 py-24 relative">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>(o que muda no seu resultado)</SectionLabel>
          <h2 className="font-display text-[40px] sm:text-[56px] leading-[1] uppercase mt-4 text-headline-gradient">
            O que você vai aprender
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            Aqui você aprende o passo a passo de uma estrutura validada que transforma um vídeo comum em um vídeo que vende — mesmo que você nunca tenha gravado antes.
          </p>
        </div>

        <div className="mt-20 relative">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            const total = benefits.length;
            const scale = 1 - (total - 1 - idx) * 0.03;
            const opacity = 1 - (total - 1 - idx) * 0.08;
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
                      "linear-gradient(135deg, rgba(255,200,80,0.6), rgba(255,122,26,0.2) 40%, rgba(255,255,255,0.04) 70%, rgba(255,200,80,0.5))",
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
                        "0 30px 80px -20px rgba(255,170,40,0.15), inset 0 1px 0 rgba(255,255,255,0.04)",
                    }}
                  >
                    <div
                      className="absolute inset-0 pointer-events-none opacity-70"
                      style={{
                        background:
                          "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,170,40,0.18), transparent 70%)",
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
                            "linear-gradient(135deg, rgba(255,200,80,0.18), rgba(255,122,26,0.08))",
                          border: "1px solid rgba(255,200,80,0.35)",
                          boxShadow: "0 0 30px rgba(255,170,40,0.25)",
                        }}
                      >
                        <Icon className="w-7 h-7 text-[#ffb84a]" strokeWidth={2.2} />
                      </div>

                      <h3 className="font-display text-[26px] sm:text-[32px] uppercase leading-[1.05] text-headline-gradient font-bold max-w-md text-center">
                        <span
                          style={{ textShadow: "0 0 24px rgba(255,184,74,0.4)" }}
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
                          className="inline-flex items-center gap-2 rounded-full border border-[#ffb84a]/40 bg-[#ffb84a]/10 backdrop-blur-sm px-4 py-2 shadow-[0_0_20px_rgba(255,184,74,0.18)]"
                        >
                          <Shield className="w-4 h-4 text-[#ffb84a]" strokeWidth={2} />
                          <span className="text-[12px] font-semibold text-[#ffb84a] tracking-wide">
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
                className="shrink-0 rounded-2xl overflow-hidden border border-[#ffb84a]/20 shadow-[0_20px_60px_-20px_rgba(255,170,40,0.3)] bg-[#0c0c0e]"
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
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
          <h2 className="font-display text-[40px] sm:text-[64px] leading-[0.95] uppercase mt-4 text-headline-gradient">
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
                      ? "border-[var(--flame)]/60 shadow-[0_0_40px_-15px_rgba(255,90,31,0.5)]"
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
          <h2 className="font-display text-[40px] sm:text-[64px] leading-[0.95] uppercase mt-4 text-headline-gradient">
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
              priceOld="R$ 814,80"
              price="R$ 197,90"
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
              href="https://pay.cakto.com.br/327qge3"
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
  badge, title, subtitle, price, priceOld, unit, features, cta, highlight, href,
}: {
  badge: string; title: string; subtitle: string; price: string; priceOld?: string;
  unit: string; features: string[]; cta: string; highlight?: boolean; href?: string;
}) {
  return (
    <div
      className={`relative rounded-3xl p-8 ${
        highlight
          ? "bg-gradient-to-br from-[var(--flame)]/15 via-[var(--ink)] to-[var(--ink)] border-2 border-[var(--flame)] shadow-[0_30px_80px_-20px_rgba(255,90,31,0.4)]"
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

      <h3 className="font-display text-[36px] uppercase mt-5 text-headline-gradient">{title}</h3>
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

      <a
        href={href ?? "#"}
        target={href ? "_blank" : undefined}
        rel={href ? "noopener noreferrer" : undefined}
        className={`mt-8 group w-full py-5 rounded-full font-bold text-[15px] transition ${
          highlight
            ? "gold-pill"
            : "inline-flex items-center justify-center gap-2 bg-white hover:bg-[var(--acid)] text-black"
        }`}
      >
        {cta}
        <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
      </a>
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
            <h2 className="font-display text-[36px] sm:text-[52px] leading-[1] uppercase mt-3 text-headline-gradient">
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4 text-headline-gradient">
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
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at center, rgba(255,122,26,0.18), transparent 60%)" }} />
      <div className="relative max-w-5xl mx-auto px-5 py-32 text-center">
        <img src={slide2} alt="" className="absolute top-10 left-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[-8deg]" />
        <img src={slide3} alt="" className="absolute bottom-10 right-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[6deg]" />
        <SectionLabel>A decisão é sua</SectionLabel>
        <h2 className="font-display text-[48px] sm:text-[88px] leading-[0.9] uppercase mt-6 text-headline-gradient">
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
