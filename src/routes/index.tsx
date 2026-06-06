import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { Check, Shield, Clock, Zap, TrendingUp, Users } from "lucide-react";
import CustomYouTubePlayer from "@/components/CustomYouTubePlayer";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import logoAsset from "@/assets/cts-comunidade.png.asset.json";
const logo = logoAsset.url;
import slide1 from "@/assets/quiz/slide1.jpg";
import exame from "@/assets/quiz/exame.jpg";
import stat from "@/assets/quiz/stat.jpg";
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
import bannerInfluIa from "@/assets/quiz/banner-influ-ia.jpg";
import selo7dias from "@/assets/quiz/selo-7dias.jpg";
import bannerPremium from "@/assets/quiz/banner-premium.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CEO TikShop · Crie sua Influencer de IA que vende 24h" },
      { name: "description", content: "Aprenda a criar sua Influencer de IA realista em menos de 2 minutos e fature todos os dias, mesmo sem aparecer. Garantia incondicional de 7 dias." },
    ],
  }),
  component: Landing,
});

const CTA_LINK = "#planos";

function Landing() {
  return (
    <div className="min-h-screen bg-black text-white">
      <CountdownBar />

      <main className="flex flex-col items-center px-5 pt-24 pb-16">
        {/* Logo */}
        <img src={logo} alt="CTS Comunidade" className="w-56 h-auto" />

        {/* HERO */}
        <section className="mt-8 w-full max-w-md flex flex-col items-center">
          <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#ff6b1a] bg-[#ff6b1a]/10 border border-[#ff6b1a]/30 px-3 py-1.5 rounded-full">
            Novo · Método CEO TikShop
          </span>
          <h1 className="mt-5 text-center font-extrabold uppercase leading-[1.05] text-[30px]">
            Crie sua{" "}
            <span className="text-[#ff6b1a]">Influencer de IA</span>{" "}
            que vende todos os dias <span className="text-[#ff6b1a]">sem você aparecer.</span>
          </h1>
          <p className="mt-5 text-center text-[17px] text-white/85 leading-snug">
            Mesmo começando do zero, sem saber editar e sem mostrar o rosto. Em menos de 2 minutos sua influencer está pronta pra postar e faturar.
          </p>

          <div className="mt-7 w-full relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl shadow-[#ff6b1a]/10">
            <img src={slide1} alt="Influencer de IA criada com o método CEO TikShop" className="w-full h-auto block" />
          </div>

          <a href={CTA_LINK} className="mt-7 w-full bg-[#ff6b1a] hover:bg-[#ff7a30] transition-colors text-white text-center font-extrabold uppercase text-[17px] py-5 rounded-xl shadow-lg shadow-[#ff6b1a]/30">
            Quero criar a minha agora →
          </a>
          <p className="mt-3 text-[12px] text-white/50">🔒 Acesso imediato · Garantia de 7 dias</p>

          {/* Social proof bar */}
          <div className="mt-8 w-full grid grid-cols-3 gap-3 text-center">
            <Metric icon={<Users className="w-4 h-4" />} value="+12k" label="Alunos" />
            <Metric icon={<TrendingUp className="w-4 h-4" />} value="4.9★" label="Avaliação" />
            <Metric icon={<Zap className="w-4 h-4" />} value="2 min" label="Pra criar" />
          </div>
        </section>

        {/* PROVA NA MÍDIA */}
        <Section title={<>O mercado das <span className="text-[#ff6b1a]">influencers de IA</span> já explodiu.</>}>
          <p className="text-center text-[17px] text-white/85">
            Uma influencer que <b>não existe</b> coloca <span className="text-[#ff6b1a] font-bold">11 mil dólares por mês</span> no bolso de quem criou. E isso é só o começo.
          </p>
          <img src={exame} alt="Reportagem Exame sobre influencers de IA" className="mt-5 w-full rounded-xl" />
          <img src={stat} alt="Estatística do mercado de IA" className="mt-4 w-full rounded-xl" />
          <div className="mt-5">
            <CustomYouTubePlayer videoId="a4OlnuhlAXU" title="Reportagem sobre influencers de IA" />
          </div>
        </Section>

        {/* O QUE DÁ PRA FAZER */}
        <Section title={<>Olha o que você vai conseguir fazer <span className="text-[#ff6b1a]">no automático</span>:</>}>
          <Feature
            img={mayaLuna}
            title="Influencers 100% realistas"
            text="Crie personagens que ninguém vai acreditar que são IA. Rosto consistente em qualquer cenário."
          />
          <Feature
            img={lunaRoupas}
            title="Qualquer roupa, qualquer cenário"
            text="Mesmo rosto, infinitos looks. Ideal pra loja, marca pessoal ou perfis temáticos."
          />
          <Feature
            img={lunaGym}
            title="Realismo absurdo"
            text="Iluminação, textura de pele e expressões reais. Nível profissional sem estúdio."
          />
          <Feature
            img={influProduto}
            title="Sua influencer + qualquer produto"
            text="Coloque produtos reais nas mãos dela e gere conteúdo pra vender em qualquer plataforma."
          />
          <Feature
            img={resultadoSelfie}
            title="Selfies, fotos e vídeos prontos"
            text="Conteúdo diário sem gravar, sem editar e sem pagar criador de conteúdo."
          />
        </Section>

        {/* VÍDEO DEMONSTRATIVO */}
        <Section title={<>Coloque sua influencer em <span className="text-[#ff6b1a]">qualquer vídeo</span> com 2 cliques:</>}>
          <CustomVideoPlayer src="/video-influ.mp4" />
          <p className="mt-4 text-center italic text-[16px] text-white/80">
            100% gerado com inteligência artificial · pronto pra viralizar.
          </p>

          <div className="mt-6">
            <CustomVideoPlayer src="/video-aula.mp4" />
          </div>
          <p className="mt-4 text-center text-[16px] text-white/85">
            Divulgue produtos do <b>TikTok Shop, Shopee, Amazon</b> ou da sua própria loja, 24h por dia.
          </p>

          <div className="mt-6">
            <CustomVideoPlayer src="/video-transform.mp4" />
          </div>
          <p className="mt-4 text-center text-[16px] text-white/85">
            Transforme qualquer pessoa em uma influencer irreconhecível, mantendo todos os movimentos.
          </p>
        </Section>

        {/* MENTOR */}
        <Section title={<>Quem está <span className="text-[#ff6b1a]">no comando</span>:</>}>
          <img src={kaelSantyns} alt="Kael Santyns" className="w-full rounded-2xl" />
          <h3 className="mt-5 text-center font-extrabold text-[26px] text-[#ff6b1a]">Kael Santyns</h3>
          <p className="mt-3 text-center text-[16px] text-white/85 leading-snug">
            Criou vídeos com IA que somam <b>milhões de views</b> e geraram <b>centenas de milhares em faturamento</b>. Agora ensina o método completo, sem teoria.
          </p>
        </Section>

        {/* DEPOIMENTOS */}
        <Section title={<>Resultados de quem <span className="text-[#ff6b1a]">já aplicou:</span></>}>
          <div className="grid grid-cols-2 gap-3">
            {[depo1, depo2, depo3, depo4].map((d, i) => (
              <img key={i} src={d} alt={`Depoimento ${i + 1}`} className="w-full rounded-xl" />
            ))}
          </div>
        </Section>

        {/* OFERTA / PLANOS */}
        <section id="planos" className="mt-20 w-full max-w-md flex flex-col items-center scroll-mt-24">
          <div className="w-full rounded-2xl overflow-hidden shadow-2xl shadow-[#ff6b1a]/20 border border-[#ff6b1a]/30">
            <img src={bannerPremium} alt="CEO TikShop" className="w-full h-auto block" />
          </div>

          <h2 className="mt-8 text-center font-extrabold text-[28px] leading-tight">
            Escolha o <span className="text-[#ff6b1a]">melhor plano pra você</span>
          </h2>
          <p className="mt-3 text-center text-white/70 text-[15px]">
            Acesso imediato · Garantia incondicional de 7 dias
          </p>

          {/* Mensal */}
          <PricingCard
            badge="Mensal"
            title={<>CTS <span className="text-[#ff6b1a]">Mensal</span></>}
            subtitle="CEO TikShop · Acesso flexível mês a mês"
            price="R$ 197,90"
            unit="/mês"
            features={[
              "🔥 Mentoria ao vivo toda semana",
              "💬 Comunidade fechada no WhatsApp",
              "🤝 Networking com outros CEOs",
              "🎯 Suporte direto e estratégias atualizadas",
              "🎁 Bônus exclusivos liberados todo mês",
              "✅ Cancele quando quiser",
            ]}
            cta="Quero o CTS Mensal"
          />

          {/* Anual */}
          <PricingCard
            badge="Anual · Mais escolhido"
            highlight
            title={<>CTS <span className="text-[#ff6b1a]">Anual</span></>}
            subtitle="12 meses de acesso · Plano mais vantajoso"
            priceOld="R$ 2.374"
            price="R$ 297,90"
            unit="/ano todo"
            features={[
              "🔥 12 meses de Mentoria ao vivo",
              "💬 Comunidade fechada CTS por 1 ano",
              "🤝 Networking VIP com top CEOs",
              "🎯 Suporte prioritário no privado",
              "🎁 Todos os bônus mensais do ano",
              "🚀 Acesso antecipado a novos treinamentos",
              "💎 Economia de R$ 2.000+ vs mensal",
              "✅ Garantia incondicional de 7 dias",
            ]}
            cta="Quero o CTS Anual"
          />
        </section>

        {/* GARANTIA */}
        <Section title={<>Garantia <span className="text-[#ff6b1a]">blindada</span> de 7 dias.</>}>
          <img src={selo7dias} alt="Garantia de 7 dias" className="w-2/3 mx-auto" />
          <div className="mt-6 rounded-2xl bg-white text-black p-6 border-2 border-[#ff6b1a]/40">
            <div className="flex flex-col items-center text-center">
              <Shield className="w-12 h-12 text-[#ff6b1a]" />
              <p className="mt-3 font-extrabold text-[20px]">Seu risco é zero.</p>
              <p className="mt-3 text-[15px] leading-snug">
                Se você aplicar exatamente o que ensinamos e não tiver resultados em até 30 dias, devolvemos 100% do seu dinheiro <b>e ainda enviamos R$1.000 no PIX</b> como pedido de desculpas. Ou o CEO TikShop funciona pra você, ou nós pagamos por isso.
              </p>
            </div>
          </div>
        </Section>

        {/* GALERIA / SOCIAL */}
        <Section title={<>Influencers criadas por <span className="text-[#ff6b1a]">alunos reais</span>:</>}>
          <img src={gridInfluencers} alt="Influenciadoras de IA criadas por alunos" className="w-full rounded-xl" />
          <img src={bannerInfluIa} alt="Mais influenciadoras com IA" className="mt-4 w-full rounded-xl" />
        </Section>

        {/* FAQ */}
        <FAQ />

        {/* CTA FINAL */}
        <section className="mt-16 w-full max-w-md text-center">
          <h2 className="font-extrabold text-[28px] leading-tight">
            A decisão é <span className="text-[#ff6b1a]">sua.</span>
          </h2>
          <p className="mt-4 text-[17px] text-white/85">
            Enquanto você lê isso, tem gente faturando com influencers de IA. A diferença é simples: <b>elas começaram</b>.
          </p>
          <a href={CTA_LINK} className="mt-6 w-full inline-block bg-[#ff6b1a] hover:bg-[#ff7a30] transition-colors text-white font-extrabold uppercase text-[18px] py-5 rounded-xl shadow-lg shadow-[#ff6b1a]/30">
            Quero começar agora →
          </a>
          <p className="mt-3 text-[12px] text-white/50">🔒 Compra 100% segura · Acesso imediato</p>
        </section>

        <p className="mt-16 text-xs text-white/30">© CEO TikShop · Todos os direitos reservados</p>
      </main>
    </div>
  );
}

/* ============ COMPONENTES ============ */

function Section({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="mt-20 w-full max-w-md">
      <h2 className="text-center font-extrabold text-[26px] leading-tight">{title}</h2>
      <div className="mt-6">{children}</div>
    </section>
  );
}

function Metric({ icon, value, label }: { icon: React.ReactNode; value: string; label: string }) {
  return (
    <div className="rounded-xl bg-white/5 border border-white/10 py-3 px-2">
      <div className="flex items-center justify-center gap-1.5 text-[#ff6b1a]">{icon}<span className="font-extrabold text-[18px]">{value}</span></div>
      <div className="mt-1 text-[11px] text-white/60 uppercase tracking-wider">{label}</div>
    </div>
  );
}

function Feature({ img, title, text }: { img: string; title: string; text: string }) {
  return (
    <div className="mb-6 rounded-2xl overflow-hidden bg-white/5 border border-white/10">
      <img src={img} alt={title} className="w-full h-auto block" />
      <div className="p-5">
        <h3 className="font-extrabold text-[18px] text-[#ff6b1a]">{title}</h3>
        <p className="mt-2 text-[15px] text-white/85 leading-snug">{text}</p>
      </div>
    </div>
  );
}

function PricingCard({
  badge, title, subtitle, price, priceOld, unit, features, cta, highlight,
}: {
  badge: string; title: React.ReactNode; subtitle: string; price: string; priceOld?: string;
  unit: string; features: string[]; cta: string; highlight?: boolean;
}) {
  return (
    <div className={`mt-8 w-full rounded-3xl p-6 relative ${highlight ? "bg-gradient-to-br from-[#1a0f00] via-[#0b1426] to-[#0a0f1f] border-2 border-[#ff6b1a] shadow-2xl shadow-[#ff6b1a]/30" : "bg-gradient-to-br from-[#0b1426] to-[#0a0f1f] border-2 border-[#ff6b1a]/40 shadow-2xl shadow-[#ff6b1a]/10"}`}>
      {highlight && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff6b1a] to-[#ffb347] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#ff6b1a]/40 whitespace-nowrap">
          ⭐ Economize 87%
        </span>
      )}
      <div className={`flex items-start justify-between gap-3 ${highlight ? "mt-3" : ""}`}>
        <div>
          <div className="inline-flex items-center gap-1.5 bg-[#ff6b1a]/20 text-[#ffb347] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
            {badge}
          </div>
          <h3 className="mt-3 font-extrabold text-[22px] leading-tight">{title}</h3>
          <p className="mt-1 text-white/60 text-[12px]">{subtitle}</p>
        </div>
        <div className="text-right leading-none shrink-0">
          {priceOld && <div className="text-[11px] text-white/40 font-semibold line-through">{priceOld}</div>}
          <div className="text-[#ff6b1a] font-extrabold text-[26px] mt-1">{price}</div>
          <div className="text-[11px] text-white/50 mt-1">{unit}</div>
        </div>
      </div>

      <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#ff6b1a]/30 to-transparent" />

      <ul className="mt-5 flex flex-col gap-3 text-[14.5px] leading-snug">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#ff6b1a] shrink-0 mt-0.5" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a href="#" className="mt-6 w-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8a3d] hover:from-[#ff7a30] hover:to-[#ff9a4d] transition-all text-white font-extrabold text-[17px] py-5 rounded-xl shadow-xl shadow-[#ff6b1a]/40 text-center block">
        {cta} →
      </a>
      <p className="mt-3 text-center text-[11px] text-white/40">🔒 Compra 100% segura · Acesso imediato</p>
    </div>
  );
}

function FAQ() {
  const faqs = [
    { q: "O que exatamente é o CEO TikShop?", a: "Treinamento completo, do zero, que ensina passo a passo a criar Influencers de IA realistas, gerar conteúdos e vídeos prontos e monetizar. É método prático, não teoria." },
    { q: "Preciso gastar com IA?", a: "Não. Mostramos como usar IAs gratuitas pra criar sua Influencer do zero. Ferramentas pagas só pra quem quiser escalar depois." },
    { q: "Em quanto tempo eu crio minha Influencer?", a: "Em menos de 2 minutos você já sai com a sua Influencer criada e pronta pra postar." },
    { q: "Preciso saber de IA, edição ou marketing?", a: "Não. Foi feito pra quem está começando do absoluto zero. Sem programação e sem termos técnicos." },
    { q: "Dá mesmo pra ganhar dinheiro com isso?", a: "Sim. Influencers de IA já estão sendo usadas pra vendas, monetização, parcerias e tráfego. Mostramos como entrar antes da saturação." },
  ];
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="mt-20 w-full max-w-md">
      <h2 className="text-center font-extrabold text-[28px]">Dúvidas frequentes</h2>
      <div className="mt-6 flex flex-col gap-3">
        {faqs.map((f, i) => {
          const isOpen = open === i;
          return (
            <button key={i} onClick={() => setOpen(isOpen ? null : i)} className="text-left rounded-2xl bg-white text-black px-5 py-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className={`font-extrabold text-[16px] leading-snug ${isOpen ? "text-black" : "text-black/70"}`}>{f.q}</p>
                  {isOpen && <p className="mt-3 text-[15px] leading-snug">{f.a}</p>}
                </div>
                <Check className="w-5 h-5 text-[#ff6b1a] shrink-0 mt-0.5" />
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

function CountdownBar() {
  const [secs, setSecs] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#ff6b1a] text-black px-5 py-3 flex items-center justify-center gap-3 shadow-lg">
      <Clock className="w-5 h-5" />
      <span className="font-extrabold text-[18px] tabular-nums tracking-wide">{mm}:{ss}</span>
      <span className="font-bold text-[14px] hidden sm:inline">Oferta por tempo limitado</span>
      <a href={CTA_LINK} className="ml-2 bg-black text-white font-extrabold text-[13px] px-3 py-1.5 rounded-full uppercase tracking-wider">
        Garantir
      </a>
    </div>
  );
}
