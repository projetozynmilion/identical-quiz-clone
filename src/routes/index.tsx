import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Play, Shield, Sparkles, Zap, Clock, Star, Volume2, Bot, Video, Wand2, Megaphone, GraduationCap, Users, Gift, Infinity as InfinityIcon, Brain, Crown, MessageCircle, Rocket, Smartphone, Trophy, Lock, Headphones, PlayCircle, Layers, TrendingUp, Wallet } from "lucide-react";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

import logoAsset from "@/assets/fabrica-ugc-logo.png.asset.json";
import prime2Asset from "@/assets/prime2.png.asset.json";
import prime3Asset from "@/assets/prime3.png.asset.json";
import prime4Asset from "@/assets/prime4.png.asset.json";
import prime5Asset from "@/assets/prime5.png.asset.json";
import clone1Asset from "@/assets/clone1.mp4.asset.json";
import clone2Asset from "@/assets/clone2.mov.asset.json";
import cria1Asset from "@/assets/CRIA.mp4.asset.json";
import cria2Asset from "@/assets/CRIA2.mp4.asset.json";
import cria3Asset from "@/assets/CRIA3.mp4.asset.json";
import cria6Asset from "@/assets/CRIA6.mp4.asset.json";

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
      <Capabilities />
      <Learn />
      <DemoReel />
      <Audience />
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
            className="group inline-flex items-center gap-2 bg-[var(--flame)] text-white font-bold text-[13px] px-4 py-2 rounded-full hover:bg-[var(--flame-2)] transition shadow-[0_8px_24px_-6px_rgba(255,90,31,0.6)]"
          >
            Quero acesso <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
          </a>
        </div>
      </div>
    </header>
  );
}

/* ─────────────────── HERO ─────────────────── */

function Hero() {
  return (
    <section id="top" className="relative bg-noise">
      <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${FLAME}, transparent 60%)` }}
      />
      <div className="relative max-w-7xl mx-auto px-5 pt-16 sm:pt-24 pb-20">
        {/* Copy */}
        <div className="max-w-3xl">

          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--flame)] bg-[var(--flame)]/10 border border-[var(--flame)]/30 px-3 py-1.5 rounded-full">
            <Sparkles className="w-3.5 h-3.5" /> A Mentoria Mais Completa Do Brasil
          </span>
          <h1 className="font-display mt-6 text-[44px] leading-[0.95] sm:text-[68px] lg:text-[92px] uppercase">
            Crie uma <span className="text-[var(--flame)]">Influencer de IA</span> e fature de <span className="italic font-serif normal-case text-white">R$5 a R$10k/mês</span> sem aparecer.
          </h1>

          <div className="relative mt-8 max-w-2xl rounded-2xl overflow-hidden border border-white/10 shadow-2xl aspect-video bg-black">
            <iframe
              src="https://scripts.converteai.net/4c00b079-2ae9-46b7-b111-a0b4e06e709e/players/69ec506255df2a8c627a15bb/v4/embed.html"
              title="Assista a VSL"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="w-full h-full border-0"
            />
          </div>

          <p className="mt-7 text-[17px] sm:text-[19px] text-white/75 max-w-xl leading-relaxed">
            O método <b className="text-white">CEO TikShop</b> entrega o passo a passo pra criar sua Influencer de IA realista em <b className="text-white">menos de 2 minutos</b> e começar a vender no TikTok Shop ainda essa semana — <b className="text-[var(--flame)]">sem aparecer, sem gravar, sem editar</b>.
          </p>

          <ul className="mt-6 space-y-2 max-w-xl">
            {[
              "Primeiro vídeo no ar em 24h — mesmo começando do zero",
              "Primeiras vendas em ~7 dias aplicando o método",
              "100% pelo celular · sem equipe, sem aparecer",
            ].map((p) => (
              <li key={p} className="flex items-start gap-2 text-[14.5px] text-white/85">
                <Check className="w-4 h-4 mt-1 text-[var(--flame)] shrink-0" /> {p}
              </li>
            ))}
          </ul>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#planos"
              className="pb-ai-button group text-[16px] font-bold px-7 py-5 rounded-full"
            >
              Quero criar a minha agora
              <ArrowRight className="w-5 h-5 transition group-hover:translate-x-1" />
            </a>
            <a
              href="#demo"
              className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-semibold text-[15px] px-6 py-5 rounded-full"
            >
              <Play className="w-4 h-4" /> Ver demonstração
            </a>
          </div>

          <div className="mt-10 grid grid-cols-3 gap-6 max-w-md">
            <Stat value="2 min" label="Pra criar" />
            <Stat value="+12k" label="Alunos" />
            <Stat value="4.9★" label="Avaliação" />
          </div>
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-display text-[28px] sm:text-[34px] text-[var(--flame)]">{value}</div>
      <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{label}</div>
    </div>
  );
}

/* ─────────────────── MARQUEE ─────────────────── */

function Marquee() {
  const items = [
    "Sem aparecer", "Sem gravar", "Sem editar", "Sem equipe",
    "Posta sozinha", "Vende 24h", "Conteúdo infinito", "Realismo absurdo",
  ];
  const full = [...items, ...items];
  return (
    <div className="border-y border-white/10 bg-[var(--ink-2)] overflow-hidden">
      <div className="marquee-track flex gap-12 py-5 whitespace-nowrap">
        {full.map((t, i) => (
          <span key={i} className="font-display text-[24px] sm:text-[32px] uppercase text-white/60 flex items-center gap-12">
            {t}
            <span className="w-2 h-2 rounded-full bg-[var(--flame)]" />
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
        <h2 className="font-display text-[40px] sm:text-[56px] leading-[0.95] uppercase mt-4">
          Essas <span className="text-[var(--flame)]">influencers criadas por IA</span> estão lucrando em torno de <span className="text-[var(--flame)]">R$ 15 mil por mês</span>.
        </h2>
        <p className="mt-6 text-[17px] text-white/70 leading-relaxed">
          E isso é só o começo. Marcas, lojas e criadores estão usando influencers de IA
          pra dominar feed, viralizar e vender — antes da saturação chegar.
        </p>
        <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime2Asset.url} alt="Prova de influencer de IA 1" className="w-full h-auto block" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime3Asset.url} alt="Prova de influencer de IA 2" className="w-full h-auto block" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime4Asset.url} alt="Prova de influencer de IA 3" className="w-full h-auto block" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime5Asset.url} alt="Prova de influencer de IA 4" className="w-full h-auto block" />
          </div>
        </div>
      </div>
    </section>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--flame)]">
      <span className="w-6 h-px bg-[var(--flame)]" />
      {children}
    </span>
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
            <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
              Conteúdo no <span className="text-[var(--flame)]">automático.</span><br />
              Você no <span className="italic font-serif normal-case">caixa.</span>
            </h2>
          </div>
          <p className="text-white/60 max-w-sm text-[15px]">
            Quatro superpoderes que viram um negócio rodando sozinho. Sem aparecer.
          </p>
        </div>

        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <article
              key={i}
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
    { src: clone1Asset.url },
    { src: clone2Asset.url },
  ];
  return (
    <section id="demo" className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>Clonagem de movimentos</SectionLabel>
        <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
          Aprenda a <span className="text-[var(--flame)]">clonar movimentos</span> de qualquer vídeo.
        </h2>
        <p className="mt-5 text-white/60 text-[15px]">
          Qualquer dancinha, trend ou vídeo viral vira conteúdo da sua influencer em 2 cliques — movimentos idênticos, rosto trocado, ninguém percebe.
        </p>
      </div>

      <div className="mt-14 max-w-3xl mx-auto space-y-10">
        {videos.map((v, i) => (
          <div key={i} className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-secondary">
            <ReelVideo src={v.src} />
          </div>
        ))}
      </div>
    </section>
  );
}


/* ─────────────────── LEARN (O QUE VOCÊ VAI APRENDER) ─────────────────── */

function Learn() {
  const items = [
    { n: "01", t: "Criar Influencer de IA realista", d: "Do zero, em menos de 2 min, no celular — sem programa caro, sem placa de vídeo." },
    { n: "02", t: "Gerar vídeos UGC que vendem", d: "Lipsync, expressão e movimento natural — o formato que está faturando R$300 a R$2.000/dia." },
    { n: "03", t: "Achar produtos vencedores no TikTok Shop", d: "Sistema pra escolher produto quente antes da concorrência e travar comissão recorrente." },
    { n: "04", t: "Ganchos virais e roteiros que convertem", d: "Biblioteca pronta de prompts e ganchos testados — só trocar o produto e postar." },
    { n: "05", t: "Postar e escalar no automático", d: "Agendamento, automação e operação 24/7 enquanto você dorme ou trabalha em outra coisa." },
    { n: "06", t: "Transformar isso num negócio", d: "Como reinvestir, escalar pra 5–6 dígitos por mês e construir um ativo digital de verdade." },
  ];
  return (
    <section className="bg-[var(--ink)] border-b border-white/5">
      <div className="max-w-7xl mx-auto px-5 py-24">
        <div className="text-center max-w-3xl mx-auto">
          <SectionLabel>O que você vai aprender</SectionLabel>
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
            Em poucas semanas, <span className="text-[var(--flame)]">você sai do zero</span> pra ter um negócio rodando sozinho.
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            A mentoria mais completa de Influencer de IA do Brasil — e a única com garantia de <b className="text-white">R$1.000 no PIX</b> se não funcionar.
          </p>
        </div>
        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((i) => (
            <div key={i.n} className="rounded-2xl border border-white/10 bg-[var(--ink-2)] p-6 hover:border-[var(--flame)]/50 transition">
              <div className="font-display text-[28px] text-[var(--flame)] leading-none">{i.n}</div>
              <h3 className="mt-4 font-display text-[20px] uppercase leading-tight">{i.t}</h3>
              <p className="mt-3 text-[14px] text-white/65 leading-relaxed">{i.d}</p>
            </div>
          ))}
        </div>
        <div className="mt-10 rounded-2xl border border-[var(--flame)]/40 bg-gradient-to-r from-[var(--flame)]/10 via-[var(--ink-2)] to-[var(--flame)]/10 p-6 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[15px] sm:text-[17px] text-white/85 text-center sm:text-left">
            Aplicando o método, o aluno médio coloca o <b className="text-white">primeiro vídeo em 24h</b> e faz a <b className="text-white">primeira venda em ~7 dias</b>.
          </p>
          <a href="#planos" className="pb-ai-button rounded-full px-6 py-3.5 font-bold text-[14px] whitespace-nowrap">
            Quero meu acesso <ArrowRight className="w-4 h-4" />
          </a>
        </div>
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
            Isso é pra <span className="text-[var(--flame)]">você?</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Pra quem é */}
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

          {/* Pra quem NÃO é */}
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
            <img src={kaelSantyns} alt="Kael Santyns, mentor do CEO TikShop" className="w-full h-auto" />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-[var(--acid)] text-black px-4 py-3 rounded-xl shadow-xl">
            <div className="font-display text-[22px] leading-none">Milhões</div>
            <div className="text-[11px] uppercase tracking-widest font-semibold">de views com IA</div>
          </div>
        </div>
        <div className="lg:col-span-7">
          <SectionLabel>Quem ensina</SectionLabel>
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
            Kael <span className="text-[var(--flame)]">Santyns</span>
          </h2>
          <p className="mt-6 text-[17px] text-white/75 leading-relaxed">
            Criou vídeos com IA que somam <b className="text-white">milhões de views</b> e
            geraram <b className="text-white">centenas de milhares em faturamento</b> com produtos
            criados pela IA. Não ensina teoria — ensina exatamente o que está fazendo dar dinheiro agora.
          </p>
          <div className="mt-8 grid sm:grid-cols-3 gap-3">
            {[
              { v: "Milhões", l: "Views geradas" },
              { v: "R$ 500k+", l: "Faturado com IA" },
              { v: "+12k", l: "Alunos ativos" },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/5 border border-white/10 p-4">
                <div className="font-display text-[26px] text-[var(--flame)]">{s.v}</div>
                <div className="text-[11px] uppercase tracking-widest text-white/50 mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
            Pessoas comuns, <br /> resultados <span className="text-[var(--flame)]">absurdos.</span>
          </h2>
        </div>
        <div className="flex items-center gap-1 text-[var(--flame)]">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-5 h-5 fill-current" />)}
          <span className="ml-2 text-white/70 text-[14px]">4.9 · +2.300 avaliações</span>
        </div>
      </div>

      <div className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-4">
        {depos.map((d, i) => (
          <div key={i} className="rounded-xl overflow-hidden border border-white/10 hover:border-[var(--flame)]/50 transition">
            <img src={d} alt={`Depoimento ${i + 1}`} className="w-full h-auto" />
          </div>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 md:gap-6 max-w-3xl mx-auto">
        {[
          { id: "1N-VlhmQ5ox892dhkAc8v3CZN_w8UaQC5", label: "Depoimento em vídeo 1" },
          { id: "1oMvrYL7i7BkGSbVHwGI9b07W4hkxK-NZ", label: "Depoimento em vídeo 2" },
        ].map((v) => (
          <div key={v.id} className="rounded-2xl overflow-hidden border border-white/10 hover:border-[var(--flame)]/50 transition bg-black aspect-[9/16] max-h-[360px] md:max-h-[560px] mx-auto w-full">
            <iframe
              src={`https://drive.google.com/file/d/${v.id}/preview`}
              title={v.label}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="w-full h-full"
            />
          </div>
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
          <h2 className="font-display text-[40px] sm:text-[64px] leading-[0.95] uppercase mt-4">
            Tudo pronto pra você <span className="text-[var(--flame)]">lucrar nas primeiras semanas.</span>
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
              <div
                key={i}
                className={`group relative rounded-2xl bg-[var(--ink-2)] border p-3.5 sm:p-6 hover:-translate-y-1 transition-all duration-300 ${
                  it.highlight
                    ? "border-[var(--flame)]/60 shadow-[0_0_40px_-15px_rgba(255,90,31,0.5)]"
                    : "border-white/10 hover:border-[var(--flame)]/60"
                }`}
              >
                {it.highlight && (
                  <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-[var(--flame)] text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-white whitespace-nowrap">
                    ⭐ Destaque
                  </div>
                )}
                <div className="flex items-center justify-between gap-2">
                  <div
                    className="icon-3d w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[var(--flame)]/30 to-[var(--flame)]/5 border border-[var(--flame)]/40 flex items-center justify-center text-[var(--flame)] shadow-[inset_0_1px_0_rgba(255,255,255,0.18),0_8px_20px_-6px_rgba(255,90,31,0.55)]"
                    style={{ animationDelay: `${(i % 4) * 0.4}s` }}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 drop-shadow-[0_2px_4px_rgba(255,90,31,0.55)]" />
                  </div>
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.14em] sm:tracking-[0.18em] text-white/50 text-right">
                    {it.tag}
                  </span>
                </div>
                <h3 className="mt-4 sm:mt-5 font-display text-[15px] sm:text-[22px] uppercase leading-tight">{it.title}</h3>
                <p className="mt-2 sm:mt-3 text-[11.5px] sm:text-[13.5px] text-white/65 leading-relaxed">{it.desc}</p>
                <div className="mt-3 sm:mt-4 inline-flex items-center gap-1.5 sm:gap-2 px-2 py-1 sm:px-3 sm:py-1.5 rounded-full bg-[var(--flame)]/10 border border-[var(--flame)]/30">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--flame)] animate-pulse shrink-0" />
                  <span className="text-[9.5px] sm:text-[11px] font-semibold uppercase tracking-wider text-[var(--flame)] leading-tight">{it.result}</span>
                </div>
                <div className="mt-4 sm:mt-5 pt-3 sm:pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-wider text-white/40">Valor</span>
                  <span className="font-display text-[15px] sm:text-[18px] text-[var(--flame)]">{it.value}</span>
                </div>
              </div>
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
            className="pb-ai-button rounded-full px-7 py-4 font-display text-[16px] uppercase tracking-wider whitespace-nowrap"
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
          <h2 className="font-display text-[40px] sm:text-[64px] leading-[0.95] uppercase mt-4">
            Escolha seu <span className="text-[var(--flame)]">plano.</span>
          </h2>
          <p className="mt-5 text-white/70 text-[16px]">
            Garantia incondicional de 7 dias + <b className="text-white">R$1.000 no PIX</b> se não funcionar.
          </p>
        </div>

        <div className="mt-14 grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PriceCard
            badge="Mensal"
            title="Mensal"
            subtitle="Acesso flexível mês a mês"
            price="R$ 67,90"
            unit="/mês"
            features={[
              "Mentoria ao vivo toda semana",
              "Comunidade fechada no WhatsApp",
              "Networking com outros CEOs",
              "Suporte direto e estratégias atualizadas",
              "Bônus exclusivos todo mês",
              "Cancele quando quiser",
            ]}
            cta="Quero o Mensal"
            href="https://pay.cakto.com.br/bsg6tjs_775686"
          />
          <PriceCard
            badge="Vitalício · Mais escolhido"
            highlight
            title="Vitalício"
            subtitle="Acesso para sempre"
            priceOld="R$ 814,80"
            price="R$ 147,90"
            unit="/único"
            features={[
              "Tudo do plano Mensal para sempre",
              "Networking VIP com top CEOs",
              "Suporte prioritário no privado",
              "Todos os bônus mensais liberados",
              "Acesso antecipado a novos treinamentos",
              "Economia de R$ 600+",
              "Garantia incondicional de 7 dias",
            ]}
            cta="Quero o Vitalício"
            href="https://pay.cakto.com.br/327qge3"
          />
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

      <h3 className="font-display text-[36px] uppercase mt-5">{title}</h3>
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
            ? "pb-ai-button"
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
            <h2 className="font-display text-[36px] sm:text-[52px] leading-[1] uppercase mt-3">
              Funciona pra você <span className="text-[var(--flame)]">ou nós pagamos.</span>
            </h2>
            <p className="mt-5 text-[16px] text-white/75 leading-relaxed max-w-3xl">
              Se você aplicar exatamente o que ensinamos e não tiver resultados em até <b className="text-white">30 dias</b>,
              devolvemos <b className="text-white">100% do seu dinheiro</b> e ainda enviamos
              <b className="text-[var(--flame)]"> R$1.000 no PIX</b> como pedido de desculpas. Seu risco é zero.
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
          <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
            Antes de você <span className="text-[var(--flame)]">perguntar.</span>
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
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-50" />
      <div
        className="absolute inset-0"
        style={{ background: `radial-gradient(ellipse at center, ${FLAME}30, transparent 60%)` }}
      />
      <div className="relative max-w-5xl mx-auto px-5 py-32 text-center">
        <img src={slide2} alt="" className="absolute top-10 left-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[-8deg]" />
        <img src={slide3} alt="" className="absolute bottom-10 right-5 w-32 rounded-xl opacity-30 hidden lg:block rotate-[6deg]" />
        <SectionLabel>A decisão é sua</SectionLabel>
        <h2 className="font-display text-[48px] sm:text-[88px] leading-[0.9] uppercase mt-6">
          Enquanto você <span className="text-[var(--flame)]">pensa,</span><br />
          alguém já <span className="italic font-serif normal-case">começou.</span>
        </h2>
        <p className="mt-7 text-[17px] sm:text-[19px] text-white/70 max-w-2xl mx-auto">
          A diferença entre quem fatura com IA e quem só assiste é simples: <b className="text-white">um clique</b>.
        </p>
        <a
          href="#planos"
          className="pb-ai-button group mt-10 text-[17px] sm:text-[19px] font-bold px-10 py-6 rounded-full"
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
        className="pb-ai-button w-full font-bold py-4 rounded-full"
      >
        Garantir meu acesso <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
