import { useEffect, useState } from "react";
import { Wand2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface PromptItem {
  id: string;
  title: string;
  subtitle: string | null;
  videoUrl: string | null;
  imageUrl: string | null;
  mediaType: "video" | "image";
  prompt: string;
  tutorial: string | null;
}

interface PromptCategory {
  id: string;
  label: string;
  description: string | null;
  items: PromptItem[];
}

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
        {item.mediaType === "image" && item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : item.videoUrl ? (
          <video
            key={item.videoUrl}
            className="absolute inset-0 w-full h-full object-cover"
            controls
            playsInline
            loop
            muted
            autoPlay
            preload="auto"
            crossOrigin="anonymous"
          >
            <source src={item.videoUrl} type="video/mp4" />
          </video>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-white/40 text-sm">
            sem mídia
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-[18px] font-semibold tracking-tight" style={{ color: C.text }}>
          {item.title}
        </h3>
        {item.subtitle && (
          <p className="text-[13px] mt-1" style={{ color: C.textMuted }}>
            {item.subtitle}
          </p>
        )}

        {item.tutorial && (
          <div className="mt-4 rounded-2xl p-4" style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${C.border}` }}>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: C.accent }}>📋 Passo a passo</div>
            <ol className="space-y-1.5 text-[13px] leading-relaxed list-decimal pl-5" style={{ color: C.text }}>
              {item.tutorial.split("\n").map((l) => l.replace(/^\s*\d+[\.\)]\s*/, "").trim()).filter(Boolean).map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          </div>
        )}

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
                  {(copied ? "Copiado!" : "Copiar prompt inteiro").split("").map((char, i) =>
                    char === " " ? " " : <span key={i} className="btn-letter">{char}</span>
                  )}
                </div>
                <div className="txt-2">
                  {(copied ? "Copiado!" : "Copiar prompt inteiro").split("").map((char, i) =>
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
  const [categories, setCategories] = useState<PromptCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [c, p] = await Promise.all([
        supabase.from("prompt_categories").select("*").eq("is_active", true).order("position"),
        supabase.from("prompts").select("*").eq("is_active", true).order("position"),
      ]);
      if (cancelled) return;
      const cats = (c.data || []) as any[];
      const prompts = (p.data || []) as any[];
      const list: PromptCategory[] = cats.map((cat) => ({
        id: cat.id,
        label: cat.label,
        description: cat.description,
        items: prompts
          .filter((pr) => pr.category_id === cat.id)
          .map((pr) => ({ id: pr.id, title: pr.title, subtitle: pr.subtitle, videoUrl: pr.video_url, imageUrl: pr.image_url ?? null, mediaType: (pr.media_type as "video" | "image") ?? "video", prompt: pr.prompt_text || "", tutorial: pr.tutorial ?? null })),
      }));
      setCategories(list);
      setActive(list[0]?.id || null);
      setLoading(false);
    })();
    return () => { cancelled = true; };
  }, []);

  const cat = categories.find((c) => c.id === active);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3" style={{ background: C.accent, color: "#fff" }}>
          <Sparkles className="w-3 h-3" /> PROMPTS UGC
        </div>
        <h1 className="text-[40px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
          Biblioteca de prompts
        </h1>
        <p className="text-[15px] mt-2 max-w-xl" style={{ color: C.textMuted }}>
          Prompts prontos pra colar e gerar vídeos UGC realistas em segundos.
        </p>
      </div>

      {loading && <div className="text-center py-12" style={{ color: C.textMuted }}>Carregando…</div>}

      {!loading && categories.length === 0 && (
        <div className="text-center py-12" style={{ color: C.textMuted }}>
          Nenhum prompt cadastrado ainda.
        </div>
      )}

      {!loading && categories.length > 0 && (
        <>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => {
              const isActive = c.id === active;
              return (
                <button
                  key={c.id}
                  onClick={() => setActive(c.id)}
                  className="inline-flex items-center gap-2 px-4 h-10 rounded-full text-[13px] font-semibold transition"
                  style={isActive ? { background: C.accent, color: "#fff" } : { background: C.surface, color: C.textMuted, border: `1px solid ${C.border}` }}
                >
                  <Wand2 className="w-3.5 h-3.5" /> {c.label}
                </button>
              );
            })}
          </div>

          {cat?.description && <p className="text-[14px]" style={{ color: C.textMuted }}>{cat.description}</p>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cat?.items.map((item) => (
              <PromptCard key={item.id} item={item} isDark={isDark} C={C} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default PromptsTab;
