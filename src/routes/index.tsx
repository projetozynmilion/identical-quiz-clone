import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import CustomYouTubePlayer from "@/components/CustomYouTubePlayer";
import CustomVideoPlayer from "@/components/CustomVideoPlayer";
import logoAsset from "@/assets/cts-comunidade.png.asset.json";
const logo = logoAsset.url;
import slide1 from "@/assets/quiz/slide1.jpg";
import slide2 from "@/assets/quiz/slide2.jpg";
import slide3 from "@/assets/quiz/slide3.jpg";
import exame from "@/assets/quiz/exame.jpg";
import stat from "@/assets/quiz/stat.jpg";
import video from "@/assets/quiz/video.jpg";
import mayaLuna from "@/assets/quiz/maya-luna.webp";
import lunaRoupas from "@/assets/quiz/luna-roupas.png";
import lunaGym from "@/assets/quiz/luna-gym.jpg";
import influProduto from "@/assets/quiz/influ-produto.jpg";
import resultadoSelfie from "@/assets/quiz/resultado-selfie.jpg";
import videoInflu from "@/assets/quiz/video-influ.jpg";
import bikiniBlonde from "@/assets/quiz/bikini-blonde.jpg";
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
      { title: "CEO TikShop" },
      { name: "description", content: "Crie agora sua influencer de IA que trabalha pra você 24h." },
    ],
  }),
  component: Quiz,
});

const slides = [slide1, slide2, slide3];

const objetivos = [
  "Ganhar dinheiro com conteúdo 💰",
  "Vestir ela com roupas da minha loja/produtos que vendo 🛍️",
  "Criar vídeos virais 🔥",
  "Outros... 😈",
];

const experiencia = [
  "Nunca",
  "já tentei, mas não deu certo",
  "já uso e quero melhorar",
  "quero usar isso pra ganhar dinheiro",
];

function Quiz() {
  const [step, setStep] = useState(0);
  const depoimentos = [depo1, depo2, depo3, depo4];
  const [depoIdx, setDepoIdx] = useState(0);
  const nextDepo = () => setDepoIdx((i) => Math.min(i + 1, depoimentos.length - 1));
  const prevDepo = () => setDepoIdx((i) => Math.max(i - 1, 0));
  const [idx, setIdx] = useState(0);
  const next = () => setIdx((i) => Math.min(i + 1, slides.length - 1));
  const prev = () => setIdx((i) => Math.max(i - 1, 0));

  // Pré-carrega todas as imagens assim que o componente monta
  useEffect(() => {
    const allImages = [
      logo, slide1, slide2, slide3, exame, stat, video, mayaLuna,
      lunaRoupas, lunaGym, influProduto, resultadoSelfie, videoInflu,
      bikiniBlonde, kaelSantyns, depo1, depo2, depo3, depo4,
    ];
    allImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [step]);

  const progress = step === 0 ? 6 : step === 1 ? 12 : step === 2 ? 18 : step === 3 ? 23 : step === 4 ? 29 : step === 5 ? 35 : step === 6 ? 41 : step === 7 ? 47 : step === 8 ? 53 : step === 9 ? 59 : step === 10 ? 65 : step === 11 ? 71 : step === 12 ? 76 : step === 13 ? 82 : step === 14 ? 88 : step === 15 ? 94 : 96;

  return (
    <div className={`min-h-screen bg-black text-white flex flex-col items-center px-5 pb-8 ${step >= 19 ? "pt-20" : "pt-10"}`}>
      {step >= 19 && <CountdownBar />}

      {step < 19 && (
        <>
          <img src={logo} alt="CTS Comunidade" className="w-72 h-auto" />
          <div className="w-full max-w-md mt-10">
            <div className="h-2 w-full bg-[#0f1a2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#ff6b1a] rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </>
      )}

      {step === 0 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold uppercase leading-tight text-[26px]">
            CRIE AGORA{" "}
            <span className="text-[#ff6b1a]">
              SUA INFLUENCER DE IA QUE TRABALHA PRA VOCÊ 24H E VENDE
            </span>{" "}
            TODOS OS DIAS, MESMO SEM VOCÊ APARECER.
          </h1>

          <p className="mt-5 w-full max-w-md text-center text-[17px] text-white/90 leading-snug">
            Mesmo que você nunca tenha usado IA, hoje já é possível criar conteúdo todos os dias sem aparecer e sem saber editar 👇
          </p>

          <div className="mt-6 w-full max-w-md relative rounded-2xl overflow-hidden">
            <img src={slides[idx]} alt="" className="w-full h-auto block" decoding="async" />
            {idx > 0 && (
              <button
                onClick={prev}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {idx < slides.length - 1 && (
              <button
                onClick={next}
                aria-label="Próximo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/45 backdrop-blur flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            {slides.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${i === idx ? "w-6 bg-[#ff6b1a]" : "w-2 bg-white/35"}`}
              />
            ))}
          </div>

          <p className="mt-8 w-full max-w-md text-center text-[19px] leading-snug">
            Enquanto você lê isso, tem pessoas lucrando com influencers de IA. A diferença é que elas já começaram.
          </p>

          <button
            onClick={() => setStep(1)}
            className="mt-6 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold uppercase text-[17px] py-5 rounded-xl shadow-lg"
          >
            Quero ver como funciona
          </button>
        </>
      )}

      {step === 1 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-left font-extrabold leading-tight text-[30px]">
            Qual o <span className="text-[#ff6b1a]">seu principal objetivo</span> com a sua Influencer I.A?
          </h1>

          <div className="mt-8 w-full max-w-md flex flex-col gap-4">
            {objetivos.map((opt) => (
              <button
                key={opt}
                onClick={() => setStep(2)}
                className="w-full bg-white text-black text-center text-[17px] py-5 px-5 rounded-2xl border-2 border-[#ff6b1a] shadow-[0_4px_0_#ff6b1a] active:translate-y-[2px] active:shadow-[0_2px_0_#ff6b1a] transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-left font-extrabold leading-tight text-[30px]">
            Você já <span className="text-[#ff6b1a]">tentou criar uma influencer</span> com IA?
          </h1>

          <div className="mt-8 w-full max-w-md flex flex-col gap-4">
            {experiencia.map((opt) => (
              <button
                key={opt}
                onClick={() => setStep(3)}
                className="w-full bg-white text-black text-center text-[17px] py-5 px-5 rounded-2xl border-2 border-[#ff6b1a] shadow-[0_4px_0_#ff6b1a] active:translate-y-[2px] active:shadow-[0_2px_0_#ff6b1a] transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Em poucos cliques, veja{" "}
            <span className="text-[#ff6b1a]">como aproveitar a nova tendência</span>{" "}
            das influencers IA que já está crescendo agora... 🔥
          </h1>

          <img src={exame} alt="Matéria Exame" className="mt-6 w-full max-w-md rounded-xl" decoding="async" />

          <h2 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Ela não existe... mas coloca{" "}
            <span className="text-[#ff6b1a]">11 mil dólares por mês</span> no bolso de quem criou...
          </h2>

          <img src={stat} alt="Estatística mercado IA" className="mt-6 w-full max-w-md rounded-xl" decoding="async" />

          <div className="mt-6 w-full max-w-md">
            <CustomYouTubePlayer videoId="a4OlnuhlAXU" title="Reportagem" />
          </div>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(4)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 4 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-left font-extrabold leading-tight text-[28px]">
            Você está vendo{" "}
            <span className="text-[#ff6b1a]">duas pessoas que não existem</span>{" "}
            Ambas foram criadas com inteligência artificial!!
          </h1>

          <img
            src={mayaLuna}
            alt="Maya e Luna"
            className="mt-6 w-full max-w-md rounded-xl"
            loading="lazy"
            decoding="async"
            width={768}
            height={1024}
          />

          <p className="mt-6 w-full max-w-md text-center text-[19px] leading-snug">
            Agora você vai ver o que realmente dá pra fazer com isso...
          </p>

          <p className="mt-4 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(5)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 5 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[26px]">
            Você pode gerar imagens da sua influenciadora com{" "}
            <span className="text-[#ff6b1a]">
              qualquer roupa, em qualquer cenário, sempre mantendo 100% de consistência no rosto.
            </span>{" "}
            Assim como no exemplo da Luna 👇
          </h1>

          <img
            src={lunaRoupas}
            alt="Luna com roupas consistentes"
            className="mt-6 w-full max-w-md rounded-xl"
            loading="lazy"
            decoding="async"
            width={768}
            height={1024}
          />

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(6)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Quero ver mais....
          </button>
        </>
      )}

      {step === 6 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[26px]">
            E tudo isso com um nível de realismo tão alto que{" "}
            <span className="text-[#ff6b1a]">ninguém vai acreditar que é uma IA</span> 👇😱
          </h1>

          <img
            src={lunaGym}
            alt="Influencer IA com whey protein"
            className="mt-6 w-full max-w-md rounded-xl"
            loading="lazy"
            decoding="async"
            width={768}
            height={1280}
          />

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(7)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 7 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[26px]">
            Você sabia que{" "}
            <span className="text-[#ff6b1a]">
              pode criar imagens ou vídeos da sua influenciadora com produtos reais
            </span>
            , exatamente como no exemplo abaixo? 👇
          </h1>

          <img
            src={influProduto}
            alt="Influenciadora IA + Produto"
            className="mt-6 w-full max-w-md rounded-xl"
            loading="lazy"
            decoding="async"
            width={1536}
            height={1024}
          />

          <img
            src={resultadoSelfie}
            alt="Resultado"
            className="mt-4 w-full max-w-md rounded-xl"
            loading="lazy"
            decoding="async"
            width={768}
            height={1280}
          />

          <h2 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[24px]">
            Na próxima página vou te mostrar uma{" "}
            <span className="text-[#ff6b1a]">ferramenta nova</span>,{" "}
            <span className="text-[#ff6b1a]">mas usa com responsabilidade</span>, combinado? 👀😈
          </h2>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(8)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 8 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Você{" "}
            <span className="text-[#ff6b1a]">
              pode colocar sua influenciadora em QUALQUER vídeo que já existe
            </span>
            ... com apenas 2 cliques e totalmente gratuito 👇😱
          </h1>

          <p className="mt-6 w-full max-w-md text-center text-[18px] leading-snug">
            Você vai adicionar um vídeo que já existe (baixei esse do tiktok, por exemplo) 👇
          </p>

          <p className="mt-4 w-full max-w-md text-center text-[18px] leading-snug">
            Depois é só subir a imagem da sua influenciadora na plataforma, apertar um único botão e pronto... você recebe o vídeo final exatamente assim 👇
          </p>

          <div className="mt-6 w-full max-w-md">
            <CustomVideoPlayer src="/video-influ.mp4" />
          </div>

          <p className="mt-6 w-full max-w-md text-center italic text-[18px]">
            100% gerado com inteligência artificial⭐⭐⭐⭐⭐
          </p>

          <h2 className="mt-8 w-full max-w-md text-center font-extrabold uppercase leading-tight text-[28px] text-[#ff6b1a]">
            Isso para viralizar é absurdo! 😱
          </h2>

          <p className="mt-6 w-full max-w-md text-center font-bold text-[18px] leading-snug">
            Você pode usar esse método para criar conteúdo de loja, marca pessoal, perfis temáticos e materiais para clientes...
          </p>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(10)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}



      {step === 13 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[32px]">
            Quem está <span className="text-[#ff6b1a]">no comando?</span>
          </h1>

          <p className="mt-5 w-full max-w-md text-center text-[19px] leading-snug">
            Sem teoria vazia. Aqui é mão na massa, resultado na tela e dinheiro no seu bolso.
          </p>

          {/* TODO: substituir pela imagem enviada pelo usuário */}
          <img
            src={kaelSantyns}
            alt="Kael Santyns - O seu Mentor"
            className="mt-8 w-full max-w-md rounded-2xl"
            loading="lazy"
            decoding="async"
          />

          <h2 className="mt-8 w-full max-w-md text-center font-extrabold text-[26px] text-[#ff6b1a]">
            Kael Santyns
          </h2>

          <p className="mt-5 w-full max-w-md text-center text-[18px] leading-snug">
            Já criei vídeos com inteligência artificial que somam <span className="font-bold">milhões de visualizações</span> e geraram <span className="font-bold">centenas de milhares em faturamento</span> com produtos feitos usando IA.
          </p>

          <p className="mt-5 w-full max-w-md text-center text-[18px] leading-snug">
            A verdade é que <span className="font-bold">ninguém ensina o que realmente funciona</span>. Por isso decidi mostrar, na prática, como qualquer pessoa pode usar a IA para criar conteúdo viral e vender todos os dias.
          </p>

          <p className="mt-5 w-full max-w-md text-center text-[18px] leading-snug">
            Hoje você tem a oportunidade de aprender como <span className="text-[#ff6b1a] font-bold">viver da internet usando inteligência artificial</span>, mesmo sem aparecer, mesmo sem experiência e mesmo começando do zero.
          </p>

          <button
            onClick={() => setStep(14)}
            className="mt-8 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}


      {step === 10 && (
        <>
          <div className="mt-6 w-full max-w-md">
            <CustomVideoPlayer src="/video-flamengo.mp4" />
          </div>

          <h2 className="mt-8 w-full max-w-md text-center font-bold leading-tight text-[22px]">
            As possibilidades são gigantes... 😱
          </h2>

          <p className="mt-5 w-full max-w-md text-center text-[18px] leading-snug">
            Daqui a pouco a gente nem vai saber mais o que é real e o que é IA... Eu só gravei um vídeo simples, mexendo a cabeça, dando tchau... E a IA transformou tudo nisso aí!!
          </p>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(11)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 11 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            E o melhor:{" "}
            <span className="text-[#ff6b1a]">
              você pode usar isso pra vender QUALQUER produto
            </span>{" "}
            do TikTok Shop, Shopee, Amazon ou da sua própria loja 🛒🔥
          </h1>

          <div className="mt-6 w-full max-w-md">
            <CustomVideoPlayer src="/video-aula.mp4" />
          </div>

          <p className="mt-6 w-full max-w-md text-center text-[18px] leading-snug">
            Sua influenciadora de IA pode <span className="text-[#ff6b1a] font-bold">divulgar produtos 24h por dia</span>, sem precisar gravar, sem aparecer e sem pagar criador de conteúdo... 🤖💸
          </p>

          <p className="mt-6 w-full max-w-md text-center font-bold text-[19px] leading-snug">
            É exatamente assim que pessoas comuns estão faturando alto com comissões de afiliados e vendas da própria loja.
          </p>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(12)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 12 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Você não faz ideia do que{" "}
            <span className="text-[#ff6b1a]">essa IA é capaz de fazer</span>
            ... Olha isso!!! 👀🔥
          </h1>

          <div className="mt-6 w-full max-w-md">
            <CustomVideoPlayer src="/video-transform.mp4" />
          </div>

          <p className="mt-6 w-full max-w-md text-center text-[18px] leading-snug">
            A IA pega <span className="text-[#ff6b1a] font-bold">qualquer pessoa comum</span> e transforma em uma influenciadora <span className="text-[#ff6b1a] font-bold">irreconhecível</span>... mantendo TODOS os movimentos originais 😱
          </p>

          <p className="mt-6 w-full max-w-md text-center font-bold text-[19px] leading-snug">
            É o tipo de coisa que parece impossível... até você ver acontecendo na sua frente.
          </p>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(13)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}




      {step === 14 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Se eu te disser que{" "}
            <span className="text-[#ff6b1a]">
              iremos te entregar todo o passo a passo desses vídeos que você viu
            </span>{" "}
            e ainda te ensinar a criar sua influenciadora de IA do zero, te interessa? 👀
          </h1>

          <div className="mt-8 w-full max-w-md bg-white text-black rounded-2xl border-2 border-[#ff6b1a] p-5">
            <div className="flex items-start gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 mt-1 flex-shrink-0"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
              <div>
                <p className="font-bold text-[17px]">Atenção!</p>
                <p className="mt-2 font-bold text-[16px] leading-snug">
                  Não precisa saber nada de Inteligência Artificial, e você pode começar com ferramentas gratuitas!
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 w-full max-w-md flex flex-col gap-4">
            <button
              onClick={() => setStep(15)}
              className="w-full bg-white text-black text-center text-[17px] py-5 px-5 rounded-2xl border-2 border-[#ff6b1a] shadow-[0_4px_0_#ff6b1a] active:translate-y-[2px] active:shadow-[0_2px_0_#ff6b1a] transition-all"
            >
              Com certeza, eu quero isso!
            </button>
            <button
              onClick={() => setStep(15)}
              className="w-full bg-white text-black text-center text-[17px] py-5 px-5 rounded-2xl border-2 border-[#ff6b1a] shadow-[0_4px_0_#ff6b1a] active:translate-y-[2px] active:shadow-[0_2px_0_#ff6b1a] transition-all"
            >
              Não, por enquanto não...
            </button>
          </div>
        </>
      )}

      {step === 15 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[30px]">
            Você acha que <span className="text-[#ff6b1a]">isso não funciona?</span> Então explica esses resultados...
          </h1>

          <p className="mt-5 w-full max-w-md text-center text-[19px] leading-snug">
            Pessoas comuns, começando do zero, estão aplicando exatamente o que você vai ver aqui
          </p>

          <div className="mt-8 w-full max-w-md relative rounded-2xl overflow-hidden bg-[#0f1a2e]">
            <img src={depoimentos[depoIdx]} alt={`Depoimento ${depoIdx + 1}`} className="w-full h-auto block" decoding="async" />
            {depoIdx > 0 && (
              <button
                onClick={prevDepo}
                aria-label="Anterior"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 backdrop-blur flex items-center justify-center"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}
            {depoIdx < depoimentos.length - 1 && (
              <button
                onClick={nextDepo}
                aria-label="Próximo"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/55 backdrop-blur flex items-center justify-center"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="mt-4 flex gap-2">
            {depoimentos.map((_, i) => (
              <span
                key={i}
                className={`h-2 rounded-full transition-all ${i === depoIdx ? "w-6 bg-[#ff6b1a]" : "w-2 bg-white/35"}`}
              />
            ))}
          </div>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(16)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 16 && (
        <>
          <h1 className="mt-8 w-full max-w-md text-center font-extrabold leading-tight text-[28px]">
            Assista por <span className="text-[#ff6b1a]">1 minuto</span> e entenda{" "}
            <span className="text-[#ff6b1a]">como criar uma influencer de IA</span> que pode te gerar{" "}
            <span className="text-[#ff6b1a]">dinheiro</span> todos os dias!! 👇
          </h1>

          <div className="mt-8 w-full max-w-md">
            <CustomVideoPlayer src="/video-1min.mp4" />
          </div>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(17)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 17 && <Step17Analise onContinue={() => setStep(18)} />}

      {step === 18 && (
        <>
          <div className="mt-6 w-full max-w-md rounded-2xl bg-white text-black px-5 py-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2l1.9 1.4 2.3-.4.9 2.2 2.1 1-.4 2.3L20 10l-1.4 1.9.4 2.3-2.1 1-.9 2.2-2.3-.4L12 18l-1.9-1.4-2.3.4-.9-2.2-2.1-1 .4-2.3L4 10l1.4-1.9-.4-2.3 2.1-1 .9-2.2 2.3.4L12 2z"
                    fill="#111"
                  />
                  <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <p className="font-extrabold text-[18px] leading-tight">Atenção!</p>
                <p className="text-[15px] text-black/80 mt-1 leading-snug">
                  Oferta com desconto exclusivo, válida somente neste mês.
                </p>
              </div>
            </div>
          </div>

          <h2 className="mt-8 w-full max-w-md text-center font-extrabold text-[22px]">
            CEO TikShop
          </h2>

          <p className="mt-4 w-full max-w-md text-center font-extrabold text-[20px] leading-snug">
            Todo o passo a passo já está gravado e direto ao ponto para que,{" "}
            <span className="text-[#ff6b1a]">em menos de 2 minutos,</span> você crie e saia com sua Influencer de IA pronta para usar. Sem espera. Sem complicação. É aplicar e pronto.
          </p>

          <h3 className="mt-8 w-full max-w-md text-center font-extrabold text-[24px] leading-tight">
            Agora a <span className="text-[#ff6b1a]">decisão é SUA!</span>
          </h3>

          <div className="mt-6 w-full max-w-md rounded-xl overflow-hidden">
            <img src={gridInfluencers} alt="Influenciadoras de IA" decoding="async" loading="lazy" className="w-full h-auto block" />
          </div>

          <div className="mt-6 w-full max-w-md rounded-xl overflow-hidden">
            <img src={bannerInfluIa} alt="Influenciadoras com IA" decoding="async" loading="lazy" className="w-full h-auto block" />
          </div>

          <div className="mt-8 w-full max-w-md flex justify-center">
            <img src={selo7dias} alt="Garantia de 7 dias" decoding="async" loading="lazy" className="w-[78%] h-auto" />
          </div>

          <h3 className="mt-8 w-full max-w-md text-center font-extrabold text-[22px] leading-tight uppercase">
            Se você não conseguir{" "}
            <span className="text-[#ff6b1a]">criar sua influencer IA e lucrar com ela</span>, eu devolvo 100% do seu dinheiro e ainda{" "}
            <span className="text-[#ff6b1a]">te mando R$1.000 no PIX</span>.
          </h3>

          <div className="mt-8 w-full max-w-md rounded-2xl bg-white text-black px-6 py-7 shadow-lg border-2 border-[#ff6b1a]/40">
            <div className="flex flex-col items-center">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2l1.9 1.4 2.3-.4.9 2.2 2.1 1-.4 2.3L20 10l-1.4 1.9.4 2.3-2.1 1-.9 2.2-2.3-.4L12 18l-1.9-1.4-2.3.4-.9-2.2-2.1-1 .4-2.3L4 10l1.4-1.9-.4-2.3 2.1-1 .9-2.2 2.3.4L12 2z"
                  fill="#111"
                />
                <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <p className="mt-3 font-extrabold text-[20px]">Seu risco é zero!</p>
              <p className="mt-3 text-center text-[16px] leading-snug">
                Nós confiamos tanto no CEO TikShop que fazemos questão de tirar todo o risco das suas mãos. Se você aplicar exatamente o que ensinamos e não tiver resultados reais em até 30 dias, basta nos chamar. Nós devolvemos 100% do seu dinheiro e ainda enviamos R$1.000 no PIX como pedido de desculpas. Simples assim. Ou o CEO TikShop funciona para você Ou nós pagamos por isso.
              </p>
            </div>
          </div>

          <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
            Clique no botão abaixo para continuar.
          </p>

          <button
            onClick={() => setStep(19)}
            className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
          >
            Continuar
          </button>
        </>
      )}

      {step === 19 && <Step19Oferta />}

      <p className="mt-10 text-sm text-white/40">Feito com o XQuiz</p>
    </div>
  );
}

function CountdownBar() {
  const [secs, setSecs] = useState(15 * 60);
  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(secs / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secs % 3600) / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-[#ff6b1a] text-black px-5 py-4 flex items-center justify-center gap-3 shadow-lg">
      <span className="font-extrabold text-[20px] tabular-nums tracking-wide">
        {hh}:{mm}:{ss}
      </span>
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="13" r="8" />
        <path d="M12 9v4l2 2" />
        <path d="M9 2h6" />
      </svg>
      <span className="font-bold text-[15px]">Oferta por tempo limitado!</span>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ff6b1a" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5">
      <circle cx="12" cy="12" r="10" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );
}

function Step19Oferta() {
  // pricing plans simplificados: Mensal e Anual
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    { q: "O que exatamente é o CEO TikShop?", a: "O CEO TikShop é um treinamento completo do zero que ensina, passo a passo, como criar Influencers de IA realistas, gerar conteúdos e vídeos prontos e usar isso para viralizar e monetizar. É método prático, não teoria." },
    { q: "Preciso gastar com IA para criar minha Influencer?", a: "Não. Você não precisa gastar nada para criar sua Influencer de IA. No CEO TikShop, mostramos como usar IAs gratuitas para gerar sua Influencer do zero e, além disso, apresentamos ferramentas profissionais para quem quiser escalar depois. Você começa sem investimento e evolui quando fizer sentido." },
    { q: "Em quanto tempo eu crio minha Influencer de IA?", a: "Em menos de 2 minutos, você já sai com sua Influencer de IA criada e pronta para uso. Nada de semanas estudando. É resultado imediato." },
    { q: "Preciso saber algo sobre IA, edição ou marketing?", a: "Não. O CEO TikShop foi criado para quem está começando do absoluto zero. Sem programação, sem edição avançada e sem linguagem técnica. Você só segue, aplica e executa." },
    { q: "Dá mesmo para viralizar ou ganhar dinheiro com isso?", a: "Sim. Influencers de IA já estão viralizando agora e sendo usadas para vendas, monetização, parcerias e tráfego. No CEO TikShop, mostramos como entrar antes da saturação e transformar atenção em dinheiro." },
  ];

  return (
    <>
      {/* Banner de capa abaixo da barra laranja */}
      <div className="mt-4 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-[#ff6b1a]/20 border border-[#ff6b1a]/30">
        <img src={bannerPremium} alt="Crie sua Influencer IA" decoding="async" className="w-full h-auto block" />
      </div>

      <h2 className="mt-8 w-full max-w-md text-left font-extrabold text-[26px] leading-tight">
        Escolha o <span className="text-[#ff6b1a]">melhor para você:</span>
      </h2>

      {/* Plano Mensal */}
      <div className="mt-6 w-full max-w-md rounded-3xl bg-gradient-to-br from-[#0b1426] to-[#0a0f1f] border-2 border-[#ff6b1a]/40 p-6 shadow-2xl shadow-[#ff6b1a]/10 relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/10 text-white/80 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Mensal
            </div>
            <h3 className="mt-3 font-extrabold text-[22px] leading-tight">
              CTS <span className="text-[#ff6b1a]">Mensal</span>
            </h3>
            <p className="mt-1 text-white/60 text-[12px]">CEO TikShop · Acesso flexível mês a mês</p>
          </div>
          <div className="text-right leading-none shrink-0">
            <div className="text-[10px] text-white/50 font-semibold uppercase tracking-wider">Por</div>
            <div className="text-[#ff6b1a] font-extrabold text-[26px] mt-1">R$ 197,90</div>
            <div className="text-[11px] text-white/50 mt-1">/mês</div>
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#ff6b1a]/30 to-transparent" />

        <p className="mt-5 text-center font-extrabold text-[15px] uppercase tracking-wider text-white/80">O que você vai receber</p>
        <ul className="mt-4 flex flex-col gap-3 text-[14.5px] leading-snug">
          <li className="flex items-start gap-3"><CheckIcon /><span>🔥 <b>Mentoria ao vivo</b> toda semana com especialistas</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>💬 Acesso à <b>Comunidade fechada CTS</b> no WhatsApp</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🤝 <b>Networking</b> com outros CEOs faturando alto</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🎯 <b>Suporte direto</b> e estratégias atualizadas</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🎁 Bônus exclusivos liberados todos os meses</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>✅ Cancele quando quiser, sem fidelidade</span></li>
        </ul>

        <a
          href="#"
          className="mt-6 w-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8a3d] hover:from-[#ff7a30] hover:to-[#ff9a4d] transition-all text-white font-extrabold text-[17px] py-4 rounded-xl shadow-xl shadow-[#ff6b1a]/40 text-center block"
        >
          Quero o CTS Mensal →
        </a>
        <p className="mt-3 text-center text-[11px] text-white/40">🔒 Compra 100% segura · Acesso imediato</p>
      </div>

      {/* Plano Anual */}
      <div className="mt-8 w-full max-w-md rounded-3xl bg-gradient-to-br from-[#1a0f00] via-[#0b1426] to-[#0a0f1f] border-2 border-[#ff6b1a] p-6 shadow-2xl shadow-[#ff6b1a]/30 relative">
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#ff6b1a] to-[#ffb347] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg shadow-[#ff6b1a]/40 whitespace-nowrap">
          ⭐ Mais Vantajoso · Economize 87%
        </span>

        <div className="mt-3 flex items-center justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-[#ff6b1a]/20 text-[#ffb347] text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
              Anual
            </div>
            <h3 className="mt-3 font-extrabold text-[22px] leading-tight">
              CTS <span className="text-[#ff6b1a]">Anual</span>
            </h3>
            <p className="mt-1 text-white/60 text-[12px]">12 meses de acesso · Plano mais escolhido</p>
          </div>
          <div className="text-right leading-none shrink-0">
            <div className="text-[10px] text-white/40 font-semibold line-through">R$ 2.374</div>
            <div className="text-[#ff6b1a] font-extrabold text-[26px] mt-1">R$ 297,90</div>
            <div className="text-[11px] text-white/50 mt-1">/ano todo</div>
          </div>
        </div>

        <div className="mt-5 h-px bg-gradient-to-r from-transparent via-[#ff6b1a]/40 to-transparent" />

        <p className="mt-5 text-center font-extrabold text-[15px] uppercase tracking-wider text-white/80">Tudo do Mensal + Extras</p>
        <ul className="mt-4 flex flex-col gap-3 text-[14.5px] leading-snug">
          <li className="flex items-start gap-3"><CheckIcon /><span>🔥 <b>12 meses</b> de Mentoria ao vivo toda semana</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>💬 <b>Comunidade fechada CTS</b> (CEO TikShop) por 1 ano</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🤝 <b>Networking VIP</b> com top CEOs e mentores</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🎯 <b>Suporte prioritário</b> direto no privado</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🎁 Todos os <b>bônus mensais</b> do ano inteiro</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>🚀 <b>Acesso antecipado</b> a novos treinamentos</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>💎 <b>Economia de R$ 2.000+</b> vs plano mensal</span></li>
          <li className="flex items-start gap-3"><CheckIcon /><span>✅ Garantia incondicional de 7 dias</span></li>
        </ul>

        <a
          href="#"
          className="mt-6 w-full bg-gradient-to-r from-[#ff6b1a] to-[#ff8a3d] hover:from-[#ff7a30] hover:to-[#ff9a4d] transition-all text-white font-extrabold text-[18px] py-5 rounded-xl shadow-xl shadow-[#ff6b1a]/50 text-center block"
        >
          Quero o CTS Anual →
        </a>
        <p className="mt-3 text-center text-[11px] text-white/40">🔒 Compra 100% segura · Acesso imediato vitalício no ano</p>
      </div>



      <h3 className="mt-12 w-full max-w-md text-center font-extrabold text-[28px]">Dúvidas Frequentes:</h3>

      <div className="mt-6 w-full max-w-md flex flex-col gap-4">
        {faqs.map((f, i) => {
          const open = openFaq === i;
          return (
            <button key={i} onClick={() => setOpenFaq(open ? null : i)} className="w-full text-left rounded-2xl bg-white text-black px-5 py-5 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="flex-1">
                  <p className={`font-extrabold text-[16px] leading-snug ${open ? "text-black" : "text-black/60"}`}>{f.q}</p>
                  {open && <p className="mt-3 text-[15px] leading-snug">{f.a}</p>}
                </div>
                <span className="shrink-0 mt-0.5">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polyline points="9 12 11 14 15 10" />
                  </svg>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}

type AnaliseProps = { onContinue: () => void };

function Step17Analise({ onContinue }: AnaliseProps) {
  const criterios = [
    "Analisando seu perfil de criadora...",
    "Identificando seu nicho ideal...",
    "Verificando compatibilidade com IA...",
    "Calculando potencial de monetização...",
    "Selecionando pacotes ideais pra você...",
  ];
  const [progressos, setProgressos] = useState<number[]>(criterios.map(() => 0));
  const [atual, setAtual] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (atual >= criterios.length) {
      setTimeout(() => setDone(true), 400);
      return;
    }
    const start = Date.now();
    const duracao = 1100;
    const id = setInterval(() => {
      const t = Math.min(1, (Date.now() - start) / duracao);
      setProgressos((prev) => {
        const novo = [...prev];
        novo[atual] = Math.round(t * 100);
        return novo;
      });
      if (t >= 1) {
        clearInterval(id);
        setTimeout(() => setAtual((a) => a + 1), 180);
      }
    }, 30);
    return () => clearInterval(id);
  }, [atual]);

  if (!done) {
    return (
      <>
        <h1 className="mt-6 w-full max-w-md text-center font-extrabold leading-tight text-[24px]">
          Analisando suas respostas <span className="text-[#ff6b1a]">com IA</span>... 🤖
        </h1>
        <p className="mt-3 w-full max-w-md text-center text-white/70 text-[15px]">
          Estamos montando o resultado ideal pra você.
        </p>

        <div className="mt-8 w-full max-w-md flex flex-col gap-5">
          {criterios.map((label, i) => {
            const p = progressos[i];
            const ativo = i === atual;
            const concluido = p >= 100;
            return (
              <div
                key={i}
                className={`transition-opacity duration-300 ${i > atual ? "opacity-30" : "opacity-100"}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-[15px] font-semibold ${concluido ? "text-white" : "text-white/80"}`}>
                    {label}
                  </span>
                  {concluido ? (
                    <span className="text-[#22c55e] font-bold text-[18px]">✓</span>
                  ) : (
                    <span className="text-[#ff6b1a] font-bold text-[14px] tabular-nums">{p}%</span>
                  )}
                </div>
                <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-100"
                    style={{
                      width: `${p}%`,
                      background: concluido
                        ? "linear-gradient(90deg,#16a34a,#22c55e)"
                        : "linear-gradient(90deg,#ff6b1a,#ff9347)",
                      boxShadow: ativo ? "0 0 12px rgba(255,107,26,0.6)" : "none",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      <div className="mt-6 text-center text-[22px] tracking-wide">⭐️⭐️⭐️⭐️⭐️</div>
      <h1 className="mt-4 w-full max-w-md text-center font-extrabold text-[22px]">
        Resultado do seu perfil 👇
      </h1>

      <div className="mt-6 w-full max-w-md text-center font-extrabold text-[20px] leading-snug">
        <p>
          Pelas suas respostas,{" "}
          <span className="text-[#ff6b1a]">
            você tem o perfil ideal pra criar uma influencer de IA, mesmo começando do zero
          </span>
          .
        </p>
        <p className="mt-3 text-white">
          Você pode usar isso pra criar conteúdo todos os dias, crescer seu perfil e até gerar vendas sem precisar aparecer.
        </p>
        <p className="mt-3 text-white">
          Pra acelerar isso pra você,{" "}
          <span className="text-[#ff6b1a]">
            já deixei 2 pacotes prontos que encaixam exatamente com o seu perfil
          </span>
          .
        </p>
        <p className="mt-3 text-white">
          É só escolher o seu e começar hoje mesmo a criar sua influencer de IA, antes que esse tipo de conteúdo sature e fique muito mais difícil crescer.
        </p>
      </div>

      <p className="mt-6 w-full max-w-md text-center italic text-[17px] text-white/90">
        Clique no botão abaixo para continuar.
      </p>

      <button
        onClick={onContinue}
        className="mt-5 w-full max-w-md bg-[#ff6b1a] hover:bg-[#ff7a30] active:bg-[#e65d12] transition-colors text-white font-bold text-[18px] py-5 rounded-xl shadow-lg"
      >
        Continuar
      </button>

      <div className="mt-6 px-5 py-2 rounded-full border border-white/15 bg-white/5 text-white/90 text-[15px] font-semibold">
        codigodaia.com
      </div>
    </>
  );
}
