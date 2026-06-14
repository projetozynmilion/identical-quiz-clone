import { useState } from "react";
import { Wand2, Copy, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PromptCategory {
  id: string;
  label: string;
  title: string;
  description: string;
  videoUrl?: string;
  prompt?: string;
}

const categories: PromptCategory[] = [
  {
    id: "movimentos-naturais",
    label: "Movimentos Naturais",
    title: "Prompts de Movimentos Naturais",
    description:
      "Prompts testados pra gerar vídeos UGC com movimentos humanos super naturais — gestos, respiração, micro-expressões e câmera viva.",
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

const PromptsTab = ({ isDark, C }: Props) => {
  const [active, setActive] = useState(categories[0].id);
  const [copied, setCopied] = useState(false);
  const cat = categories.find((c) => c.id === active)!;

  const handleCopy = () => {
    if (!cat.prompt) return;
    navigator.clipboard.writeText(cat.prompt);
    setCopied(true);
    toast.success("Prompt copiado!");
    setTimeout(() => setCopied(false), 2000);
  };

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
          Prompts profissionais com exemplo em vídeo. Copie, cole na sua IA e gere conteúdo UGC de outro nível.
        </p>
      </div>

      {/* Sub-tabs */}
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

      {/* Content */}
      <div
        className="rounded-3xl overflow-hidden grid lg:grid-cols-2 gap-0"
        style={{
          background: isDark ? "#101013" : "#ffffff",
          border: `1px solid ${C.border}`,
          boxShadow: isDark
            ? "0 24px 60px -28px rgba(0,0,0,0.8)"
            : "0 16px 40px -20px rgba(0,0,0,0.15)",
        }}
      >
        {/* Video side */}
        <div
          className="relative aspect-[9/16] lg:aspect-auto lg:min-h-[560px] flex items-center justify-center"
          style={{
            background: isDark
              ? "linear-gradient(160deg,#1a1a1f 0%,#0c0c10 100%)"
              : "linear-gradient(160deg,#f4f4f6 0%,#e8e8ec 100%)",
            borderRight: `1px solid ${C.border}`,
          }}
        >
          {cat.videoUrl ? (
            <video
              src={cat.videoUrl}
              className="w-full h-full object-cover"
              controls
              playsInline
              loop
            />
          ) : (
            <div className="text-center px-6">
              <div
                className="mx-auto w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                style={{
                  background: isDark ? "rgba(255,122,0,0.12)" : "rgba(255,122,0,0.08)",
                  color: C.accent,
                }}
              >
                <Sparkles className="w-7 h-7" />
              </div>
              <p className="font-semibold text-[15px]" style={{ color: C.text }}>
                Vídeo de exemplo em breve
              </p>
              <p className="text-[13px] mt-1.5" style={{ color: C.textMuted }}>
                Em instantes você verá aqui o vídeo gerado com esse prompt.
              </p>
            </div>
          )}
        </div>

        {/* Prompt side */}
        <div className="p-7 flex flex-col">
          <h2 className="text-[22px] font-semibold tracking-tight" style={{ color: C.text }}>
            {cat.title}
          </h2>
          <p className="text-[13.5px] mt-2 leading-relaxed" style={{ color: C.textMuted }}>
            {cat.description}
          </p>

          <div
            className="mt-5 rounded-2xl p-5 text-[13.5px] leading-relaxed font-mono whitespace-pre-wrap flex-1 overflow-auto"
            style={{
              background: isDark ? "#0a0a0d" : "#fafafb",
              border: `1px solid ${C.border}`,
              color: cat.prompt ? C.text : C.textMuted,
              maxHeight: 420,
            }}
          >
            {cat.prompt ?? "// Prompt em breve — me envie aqui no chat o texto exato do prompt e o vídeo de exemplo que eu coloco neste card."}
          </div>

          <button
            onClick={handleCopy}
            disabled={!cat.prompt}
            className="mt-5 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-semibold text-[14px] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              background: C.accent,
              color: "#fff",
              boxShadow: "0 10px 28px -12px rgba(255,122,0,0.55)",
            }}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" /> Copiado
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" /> Copiar prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PromptsTab;
