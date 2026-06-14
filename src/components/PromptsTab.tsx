import { useState } from "react";
import { Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import videoGiro from "@/assets/prompt-giro-30.mp4.asset.json";
import videoCabelo from "@/assets/prompt-ajustando-cabelo.mp4.asset.json";

interface PromptItem {
  id: string;
  title: string;
  subtitle: string;
  videoUrl: string;
  prompt: string;
}

interface PromptCategory {
  id: string;
  label: string;
  description: string;
  items: PromptItem[];
}

const categories: PromptCategory[] = [
  {
    id: "movimentos-naturais",
    label: "Movimentos Naturais",
    description:
      "Prompts testados pra gerar vídeos UGC com movimentos humanos super naturais — gestos, respiração, micro-expressões e câmera viva.",
    items: [
      {
        id: "giro-30",
        title: "Cena 3 — Giro 30° e volta (tripé)",
        subtitle: "Mostrando o caimento",
        videoUrl: videoGiro.url,
        prompt: `🎬 CENA 3 — GIRO 30° E VOLTA (TRIPÉ)

🔹 LAYER 1
Scene Title: "Mostrando o caimento"
Style: UGC try-on, câmera fixa, sem intervenção

🔹 LAYER 2
[0:00–0:02 — Giro leve]
Visual: ela gira cerca de 30 graus mostrando lateral
Camera: fixa, não acompanha
Audio: ambiente + leve som da roupa

[0:02–0:04 — Volta de frente]
Visual: ela retorna pro enquadramento frontal
Camera: fixa
Audio: contínuo
Emotion: confiança casual

🔹 MICRO-DETAILS
corpo sai levemente do foco e volta
tecido reage ao movimento
enquadramento não "corrige" (realismo de tripé)`,
      },
      {
        id: "ajustando-cabelo",
        title: "Cena — Ajustando o cabelo",
        subtitle: "UGC try-on, tripé fixo",
        videoUrl: videoCabelo.url,
        prompt: `LAYER 1 — SCENE TITLE + STYLE

Scene Title: "Ajustando o cabelo"
Style: UGC try-on, fixed tripod camera, ultra realistic, natural indoor light, real-time motion, no slow motion, no dialogue, no speech, no talking, silent video, no subtitles, no captions, no lip sync, no voiceover, authentic unscripted behavior.`,
      },
    ],
  },
];

interface Props {
  isDark: boolean;
  C: {
    text: string;
    textMuted: string;
    surface: string;
    border: string;
    accent: string;
    bg: string;
  };
}

const PromptCard = ({
  item,
  isDark,
  C,
}: {
  item: PromptItem;
  isDark: boolean;
  C: Props["C"];
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      toast.success("Prompt copiado!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div
      className="rounded-3xl overflow-hidden flex flex-col"
      style={{
        background: isDark ? "#101013" : "#ffffff",
        border: `1px solid ${C.border}`,
        boxShadow: isDark
          ? "0 24px 60px -28px rgba(0,0,0,0.8)"
          : "0 16px 40px -20px rgba(0,0,0,0.12)",
      }}
    >
      <div
        className="relative w-full bg-black"
        style={{ aspectRatio: "9 / 16", maxHeight: 520 }}
      >
        <video
          src={item.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          controls
          playsInline
          loop
          preload="metadata"
        />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[18px] font-semibold tracking-tight" style={{ color: C.text }}>
          {item.title}
        </h3>
        <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>
          {item.subtitle}
        </p>

      <div className="mt-auto pt-6 w-full">
          <div className="btn-wrapper" style={{ display: "block", width: "100%" }}>
            <button onClick={handleCopy} className="btn" style={{ width: "100%" }}>
              {copied ? (
                <svg className="btn-svg" viewBox="0 0 24 24">
                  <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                </svg>
              ) : (
                <svg className="btn-svg" viewBox="0 0 24 24">
                  <path d="M19,21H8V7H19M21,7V19A2,2 0 0,1 19,21H19M21,7H19M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z" />
                </svg>
              )}
              <div className="txt-wrapper">
                <div className="txt-1">
                  {"Copiar prompt inteiro".split("").map((char, i) =>
                    char === " " ? " " : <span key={i} className="btn-letter">{char}</span>
                  )}
                </div>
                <div className="txt-2">
                  {"Copiar prompt inteiro".split("").map((char, i) =>
                    char === " " ? " " : <span key={i} className="btn-letter">{char}</span>
                  )}
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const PromptsTab = ({ isDark, C }: Props) => {
  const [active, setActive] = useState(categories[0].id);
  const cat = categories.find((c) => c.id === active)!;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
          style={{ background: C.accent, color: "#fff" }}
        >
          <Wand2 className="w-3 h-3" /> BIBLIOTECA DE PROMPTS
        </div>
        <h1 className="text-[40px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
          Prompts
        </h1>
        <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
          Prompts profissionais com vídeo de exemplo. Clique em copiar, cole na sua IA e gere conteúdo UGC de outro nível.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = c.id === active;
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className="px-4 py-2 rounded-full text-[13px] font-semibold transition-all"
              style={{
                background: isActive ? C.accent : isDark ? "#1a1a1f" : "#f4f4f6",
                color: isActive ? "#fff" : C.text,
                border: `1px solid ${isActive ? C.accent : C.border}`,
                boxShadow: isActive ? "0 8px 24px -10px rgba(255,122,0,0.55)" : "none",
              }}
            >
              {c.label}
            </button>
          );
        })}
      </div>

      <p className="text-[13.5px] -mt-4" style={{ color: C.textMuted }}>
        <Sparkles className="inline w-3.5 h-3.5 mr-1" />
        {cat.description}
      </p>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cat.items.map((item) => (
          <PromptCard key={item.id} item={item} isDark={isDark} C={C} />
        ))}
      </div>
    </div>
  );
};

export default PromptsTab;
