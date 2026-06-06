import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Play, Shield, Sparkles, Zap, Clock, Star, Volume2 } from "lucide-react";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";

import logoAsset from "@/assets/cts-comunidade.png.asset.json";
import prime2Asset from "@/assets/prime2.png.asset.json";
import prime3Asset from "@/assets/prime3.png.asset.json";

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
      <DemoReel />
      <Mentor />
      <Testimonials />
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
      <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2">
          <img src={logo} alt="CTS Comunidade" className="h-7 w-auto" />
        </a>
        <nav className="hidden md:flex items-center gap-8 text-[14px] text-white/70">
          <a href="#capacidades" className="hover:text-white transition">Capacidades</a>
          <a href="#demo" className="hover:text-white transition">Demo</a>
          <a href="#planos" className="hover:text-white transition">Planos</a>
          <a href="#faq" className="hover:text-white transition">FAQ</a>
        </nav>
        <a
          href="#planos"
          className="group inline-flex items-center gap-2 bg-white text-black font-bold text-[13px] px-4 py-2 rounded-full hover:bg-[var(--acid)] transition"
        >
          Começar <ArrowRight className="w-4 h-4 transition group-hover:translate-x-0.5" />
        </a>
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
            <Sparkles className="w-3.5 h-3.5" /> Novo método 2026
          </span>
          <h1 className="font-display mt-6 text-[44px] leading-[0.95] sm:text-[68px] lg:text-[92px] uppercase">
            Influencers que <br />
            <span className="text-[var(--flame)]">não existem</span> <br />
            faturando <span className="italic font-serif normal-case text-white">de verdade.</span>
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

          <p className="mt-7 text-[17px] sm:text-[19px] text-white/70 max-w-xl leading-relaxed">
            O método <b className="text-white">CEO TikShop</b> te entrega o passo a passo pra criar sua
            Influencer de IA realista em menos de 2 minutos e vender todos os dias —
            sem aparecer, sem editar, sem equipe.
          </p>

          <div className="mt-9 flex flex-col sm:flex-row gap-3">
            <a
              href="#planos"
              className="group inline-flex items-center justify-center gap-2 bg-[var(--flame)] hover:bg-[var(--flame-2)] transition text-white font-bold text-[16px] px-7 py-5 rounded-full shadow-[0_20px_60px_-10px_rgba(255,90,31,0.6)]"
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
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime2Asset.url} alt="Prova de influencer de IA 1" className="w-full h-auto block" />
          </div>
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/5">
            <img src={prime3Asset.url} alt="Prova de influencer de IA 2" className="w-full h-auto block" />
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
    { img: mayaLuna, title: "Realismo absurdo", text: "Personagens consistentes que ninguém percebe que são IA." },
    { img: lunaRoupas, title: "Qualquer look, qualquer cenário", text: "Mesmo rosto, infinitos figurinos — pronto pra loja, marca pessoal ou perfil temático." },
    { img: influProduto, title: "Influencer + seu produto", text: "Coloca produto real nas mãos dela e gera material pra vender em qualquer plataforma." },
    { img: lunaGym, title: "Vídeos prontos pra viralizar", text: "Transforme qualquer vídeo do TikTok em conteúdo da sua influencer, em 2 cliques." },
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
              <div className="aspect-[3/4] overflow-hidden">
                <img src={it.img} alt={it.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              </div>
              <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-[var(--flame)] text-black font-bold flex items-center justify-center text-[13px]">
                0{i + 1}
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

/* ─────────────────── DEMO REEL ─────────────────── */

function DemoReel() {
  const videos = [
    { src: "/video-influ.mp4", title: "Sua influencer em qualquer vídeo", desc: "Pega um vídeo do TikTok, sobe a foto dela, aperta um botão. Pronto." },
    { src: "/video-aula.mp4", title: "Venda em qualquer plataforma", desc: "TikTok Shop, Shopee, Amazon ou sua própria loja — divulgando 24h por dia." },
    { src: "/video-transform.mp4", title: "Transforma qualquer pessoa", desc: "Movimentos originais preservados, rosto totalmente trocado. Indistinguível." },
  ];
  return (
    <section id="demo" className="max-w-7xl mx-auto px-5 py-24">
      <div className="text-center max-w-2xl mx-auto">
        <SectionLabel>Demo · não é teoria</SectionLabel>
        <h2 className="font-display text-[40px] sm:text-[60px] leading-[0.95] uppercase mt-4">
          Veja a IA fazendo o trabalho <span className="text-[var(--flame)]">no tempo real.</span>
        </h2>
      </div>

      <div className="mt-14 space-y-20">
        {videos.map((v, i) => (
          <div key={i} className={`grid lg:grid-cols-12 gap-8 items-center ${i % 2 ? "lg:[&>*:first-child]:order-2" : ""}`}>
            <div className="lg:col-span-7 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <CustomVideoPlayer src={v.src} />
            </div>
            <div className="lg:col-span-5">
              <div className="font-display text-[80px] text-[var(--flame)]/30 leading-none">0{i + 1}</div>
              <h3 className="font-display text-[32px] sm:text-[42px] uppercase leading-[1] mt-2">{v.title}</h3>
              <p className="mt-4 text-[16px] text-white/70 leading-relaxed">{v.desc}</p>
            </div>
          </div>
        ))}
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

      <div className="mt-10 rounded-2xl overflow-hidden border border-white/10">
        <img src={gridInfluencers} alt="Influencers criadas por alunos" className="w-full h-auto" />
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
            title="CTS Mensal"
            subtitle="Acesso flexível mês a mês"
            price="R$ 197,90"
            unit="/mês"
            features={[
              "Mentoria ao vivo toda semana",
              "Comunidade fechada no WhatsApp",
              "Networking com outros CEOs",
              "Suporte direto e estratégias atualizadas",
              "Bônus exclusivos todo mês",
              "Cancele quando quiser",
            ]}
            cta="Quero o CTS Mensal"
          />
          <PriceCard
            badge="Anual · Mais escolhido"
            highlight
            title="CTS Anual"
            subtitle="12 meses · plano mais vantajoso"
            priceOld="R$ 2.374"
            price="R$ 297,90"
            unit="/ano todo"
            features={[
              "Tudo do plano Mensal por 12 meses",
              "Networking VIP com top CEOs",
              "Suporte prioritário no privado",
              "Todos os bônus mensais do ano",
              "Acesso antecipado a novos treinamentos",
              "Economia de R$ 2.000+",
              "Garantia incondicional de 7 dias",
            ]}
            cta="Quero o CTS Anual"
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
  badge, title, subtitle, price, priceOld, unit, features, cta, highlight,
}: {
  badge: string; title: string; subtitle: string; price: string; priceOld?: string;
  unit: string; features: string[]; cta: string; highlight?: boolean;
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
        href="#"
        className={`mt-8 group inline-flex items-center justify-center gap-2 w-full py-5 rounded-full font-bold text-[15px] transition ${
          highlight
            ? "bg-[var(--flame)] hover:bg-[var(--flame-2)] text-white shadow-xl shadow-[var(--flame)]/30"
            : "bg-white hover:bg-[var(--acid)] text-black"
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
            <div className="w-28 h-28 rounded-full bg-[var(--flame)]/10 border-2 border-[var(--flame)] flex items-center justify-center">
              <Shield className="w-12 h-12 text-[var(--flame)]" />
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
    { q: "O que exatamente é o CEO TikShop?", a: "Treinamento completo do zero que ensina, passo a passo, a criar Influencers de IA realistas, gerar conteúdos e vídeos prontos e monetizar. Método prático, sem enrolação." },
    { q: "Preciso gastar com IA?", a: "Não. Mostramos como usar IAs gratuitas pra criar sua Influencer do zero. Ferramentas pagas só se você quiser escalar depois." },
    { q: "Em quanto tempo eu crio minha Influencer?", a: "Em menos de 2 minutos você já sai com a sua pronta pra postar." },
    { q: "Preciso saber de IA, edição ou marketing?", a: "Não. Foi feito pra quem está começando do zero absoluto. Sem programação, sem termos técnicos." },
    { q: "Dá mesmo pra ganhar dinheiro com isso?", a: "Sim. Influencers de IA já estão sendo usadas pra vendas, monetização, parcerias e tráfego. Mostramos como entrar antes da saturação." },
    { q: "Como funciona a garantia?", a: "7 dias incondicionais. E se aplicar e não tiver resultado em 30 dias, devolvemos 100% + R$1.000 no PIX." },
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
          className="group mt-10 inline-flex items-center justify-center gap-3 bg-[var(--flame)] hover:bg-[var(--flame-2)] transition text-white font-bold text-[17px] sm:text-[19px] px-10 py-6 rounded-full shadow-[0_30px_80px_-15px_rgba(255,90,31,0.7)]"
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
      <div className="max-w-7xl mx-auto px-5 py-12 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <img src={logo} alt="CTS" className="h-6 w-auto" />
          <span className="text-white/50 text-[13px]">© {new Date().getFullYear()} CEO TikShop</span>
        </div>
        <div className="flex items-center gap-6 text-[13px] text-white/50">
          <a href="#" className="hover:text-white transition">Termos</a>
          <a href="#" className="hover:text-white transition">Privacidade</a>
          <a href="#" className="hover:text-white transition">Suporte</a>
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
        className="flex items-center justify-center gap-2 w-full bg-[var(--flame)] text-white font-bold py-4 rounded-full shadow-[0_-10px_40px_-10px_rgba(255,90,31,0.6)]"
      >
        Garantir meu acesso <ArrowRight className="w-4 h-4" />
      </a>
    </div>
  );
}
