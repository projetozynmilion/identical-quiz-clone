import { useEffect, useMemo, useState } from "react";
import { X, Play, MessageCircle, Check, ChevronRight, ChevronLeft, Clock, BookOpen, Lock } from "lucide-react";
import CustomYouTubePlayer from "@/components/CustomYouTubePlayer";

type ModuleLike = {
  id: string;
  title: string;
  subtitle: string | null;
  banner_url: string | null;
  video_url: string | null;
  progress: number | null;
  row_type: "continue" | "trending" | "originals";
  updated_at?: string | null;
};

export type Lesson = { id: string; title: string; videoId: string; raw: string };

function extractYoutubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.searchParams.get("v")) return u.searchParams.get("v");
      const parts = u.pathname.split("/").filter(Boolean);
      const idx = parts.findIndex((p) => p === "embed" || p === "shorts");
      if (idx >= 0 && parts[idx + 1]) return parts[idx + 1];
    }
  } catch {
    /* fallback */
  }
  const m = url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : null;
}

// Accepts a multi-line string. Each non-empty line is a lesson.
// Formats supported per line:
//   "https://..."
//   "Título da aula | https://..."
//   "Título da aula - https://..."
const FALLBACK_VIDEOS: Record<string, { videoId: string; title: string }> = {
  "módulo 1": { videoId: "2sr0-43TNpU", title: "Módulo 1 — Introdução" },
  "modulo 1": { videoId: "2sr0-43TNpU", title: "Módulo 1 — Introdução" },
  "criação realista": { videoId: "2sr0-43TNpU", title: "Criação Realista" },
  "criacao realista": { videoId: "2sr0-43TNpU", title: "Criação Realista" },
  "módulo 2": { videoId: "2sr0-43TNpU", title: "Criando Uma Influencer Passo a Passo" },
  "modulo 2": { videoId: "2sr0-43TNpU", title: "Criando Uma Influencer Passo a Passo" },
};

function fallbackByTitle(title: string): Lesson | null {
  const t = (title || "").toLowerCase();
  for (const key of Object.keys(FALLBACK_VIDEOS)) {
    if (t.includes(key)) {
      const v = FALLBACK_VIDEOS[key];
      return { id: `fallback-${v.videoId}`, title: v.title, videoId: v.videoId, raw: "" };
    }
  }
  return null;
}

export function parseLessons(video_url: string | null | undefined, fallbackTitle: string): Lesson[] {
  const out: Lesson[] = [];
  if (video_url) {
    const lines = video_url.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    lines.forEach((line, idx) => {
      let title = "";
      let urlPart = line;
      const sepMatch = line.match(/^(.+?)\s*[|]\s*(https?:\S+)\s*$/) || line.match(/^(.+?)\s+-\s+(https?:\S+)\s*$/);
      if (sepMatch) {
        title = sepMatch[1].trim();
        urlPart = sepMatch[2].trim();
      }
      const id = extractYoutubeId(urlPart);
      if (!id) return;
      out.push({
        id: `${idx}-${id}`,
        title: title || `${fallbackTitle} — Aula ${idx + 1}`,
        videoId: id,
        raw: line,
      });
    });
  }
  if (out.length === 0) {
    const fb = fallbackByTitle(fallbackTitle);
    if (fb) out.push(fb);
  }
  return out;
}

function versionedImageUrl(url: string | null | undefined, version: string | number | null | undefined) {
  if (!url) return "";
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${encodeURIComponent(String(version ?? "1"))}`;
}

interface Props {
  module: ModuleLike;
  onClose: () => void;
  onGoToCommunity: () => void;
}

const ModuleDetailDialog = ({ module: mod, onClose, onGoToCommunity }: Props) => {
  const lessons = useMemo(() => parseLessons(mod.video_url, mod.title), [mod.video_url, mod.title]);
  const storageKey = `mod-watched-${mod.id}`;

  const [watched, setWatched] = useState<Set<string>>(new Set());
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setWatched(new Set(JSON.parse(raw)));
    } catch {}
  }, [storageKey]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const saveWatched = (next: Set<string>) => {
    setWatched(new Set(next));
    try {
      localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
    } catch {}
  };

  const toggleWatched = (lessonId: string) => {
    const next = new Set(watched);
    if (next.has(lessonId)) next.delete(lessonId);
    else next.add(lessonId);
    saveWatched(next);
  };

  const current = lessons[currentIdx];
  const hasLessons = lessons.length > 0;
  const isWatched = current ? watched.has(current.id) : false;

  const computedProgress = hasLessons
    ? Math.round((watched.size / lessons.length) * 100)
    : typeof mod.progress === "number"
    ? Math.max(0, Math.min(100, mod.progress))
    : null;

  const goNext = () => {
    if (currentIdx < lessons.length - 1) setCurrentIdx(currentIdx + 1);
  };
  const goPrev = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1);
  };

  const markAndNext = () => {
    if (!current) return;
    const next = new Set(watched);
    next.add(current.id);
    saveWatched(next);
    if (currentIdx < lessons.length - 1) setCurrentIdx(currentIdx + 1);
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-2 sm:p-4 animate-in fade-in duration-200 overflow-hidden"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl max-h-[calc(100dvh-16px)] overflow-y-auto shadow-2xl rounded-[22px] sm:max-h-[calc(100dvh-32px)] sm:rounded-3xl lg:h-[calc(100dvh-48px)] lg:max-h-[760px] lg:overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "linear-gradient(180deg, #161616 0%, #0c0c0c 100%)",
          border: "1px solid rgba(255,255,255,0.08)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="pointer-events-none absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full blur-[120px] opacity-40"
          style={{ background: "radial-gradient(circle, #ff5a1f 0%, transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-32 w-[420px] h-[420px] rounded-full blur-[120px] opacity-25"
          style={{ background: "radial-gradient(circle, #ff8c5f 0%, transparent 70%)" }}
        />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 w-10 h-10 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 flex items-center justify-center text-white transition-all hover:scale-105"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="relative grid w-full grid-cols-1 gap-0 lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_360px]">
          {/* LEFT — Video + content */}
          <div className="relative lg:flex lg:min-h-0 lg:flex-col">
            {/* Player */}
            <div className="relative shrink-0 overflow-hidden bg-black border-b border-white/10">
              {current ? (
                <CustomYouTubePlayer
                  key={current.id}
                  videoId={current.videoId}
                  title={current.title}
                  className="mx-auto w-full aspect-video rounded-none bg-black border-0 shadow-none lg:h-[min(40dvh,360px)] lg:w-auto lg:max-w-full"
                />
              ) : mod.banner_url ? (
                <div className="relative w-full aspect-video">
                  <img
                    src={versionedImageUrl(mod.banner_url, mod.updated_at)}
                    alt={mod.title}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-white/90 text-xs font-bold uppercase tracking-widest">
                        <Clock className="w-3.5 h-3.5" />
                        Em breve
                      </div>
                      <p className="mt-3 text-white/60 text-sm">As aulas serão liberadas em breve.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full aspect-video bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center">
                  <div className="text-white/40 text-sm">Sem aulas cadastradas ainda</div>
                </div>
              )}
            </div>

            {/* Body */}
            <div className="relative p-4 sm:p-6 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:p-7 text-white custom-scroll">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5a1f]/15 border border-[#ff5a1f]/30 text-[#ff5a1f] text-[10px] font-bold uppercase tracking-[0.18em]">
                  <BookOpen className="w-3 h-3" />
                  {mod.row_type === "continue" ? "Mentoria" : mod.row_type === "trending" ? "Em alta" : "Módulo Original"}
                </span>
                {hasLessons && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-[0.18em]">
                    {lessons.length} {lessons.length === 1 ? "aula" : "aulas"}
                  </span>
                )}
                {hasLessons && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-[10px] font-bold uppercase tracking-[0.18em]">
                    Aula {currentIdx + 1} / {lessons.length}
                  </span>
                )}
              </div>

              <h2 className="text-[24px] sm:text-[32px] font-extrabold leading-tight tracking-tight">{mod.title}</h2>
              {current && (
                <p className="mt-2 text-[#ff5a1f] text-[15px] sm:text-[16px] font-semibold">{current.title}</p>
              )}
              {mod.subtitle && (
                <p className="mt-3 text-white/65 text-[14px] sm:text-[15px] leading-relaxed max-w-2xl">{mod.subtitle}</p>
              )}

              {/* Progress */}
              {computedProgress !== null && (
                <div className="mt-6 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <div className="flex items-end justify-between mb-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">Seu progresso</div>
                      {hasLessons && (
                        <div className="text-[13px] text-white/60">
                          {watched.size} de {lessons.length} aulas concluídas
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-[28px] font-extrabold text-white tracking-tight">{computedProgress}</span>
                      <span className="text-[#ff5a1f] text-base font-bold ml-0.5">%</span>
                    </div>
                  </div>
                  <div className="relative h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-700"
                      style={{
                        width: `${computedProgress}%`,
                        background: "linear-gradient(90deg, #ff5a1f 0%, #ff8c5f 100%)",
                        boxShadow: "0 0 20px rgba(255,90,31,0.5)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3">
                <button
                  onClick={markAndNext}
                  disabled={!current}
                  className="group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#ff5a1f] hover:bg-[#ff6d38] text-white font-bold text-[14px] transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ boxShadow: "0 18px 40px -12px rgba(255,90,31,0.55)" }}
                >
                  <Check className="w-4 h-4" />
                  {currentIdx < lessons.length - 1 ? "Marcar e ir para próxima" : "Marcar como concluída"}
                </button>
                <button
                  onClick={() => toggleWatched(current?.id || "")}
                  disabled={!current}
                  className={`inline-flex items-center justify-center gap-2 px-5 py-4 rounded-2xl font-bold text-[13px] transition-all active:scale-[0.98] border disabled:opacity-40 disabled:cursor-not-allowed ${
                    isWatched
                      ? "bg-green-500/15 border-green-500/30 text-green-300 hover:bg-green-500/20"
                      : "bg-white/5 border-white/10 text-white/80 hover:bg-white/10"
                  }`}
                >
                  <Check className="w-4 h-4" />
                  {isWatched ? "Aula assistida" : "Marcar como assistida"}
                </button>
                <div className="grid grid-cols-2 gap-2 sm:flex">
                  <button
                    onClick={goPrev}
                    disabled={currentIdx === 0}
                    className="w-full sm:w-12 h-full min-h-[52px] rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Aula anterior"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    disabled={currentIdx >= lessons.length - 1}
                    className="w-full sm:w-12 h-full min-h-[52px] rounded-2xl bg-white/5 border border-white/10 text-white/70 hover:bg-white/10 hover:text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center"
                    aria-label="Próxima aula"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  onGoToCommunity();
                }}
                className="mt-3 w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white font-semibold text-[13px] transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#ff5a1f]" />
                Tirar dúvida na comunidade
              </button>
            </div>
          </div>

          {/* RIGHT — Lessons list */}
          <aside className="relative border-t lg:border-t-0 lg:border-l border-white/5 bg-black/30 lg:flex lg:min-h-0 lg:flex-col lg:bg-white/[0.015]">
            <div className="sticky top-0 z-10 px-6 py-5 backdrop-blur-md bg-black/60 border-b border-white/5">
              <div className="text-[10px] uppercase tracking-[0.22em] text-white/40 font-bold mb-1">Conteúdo do módulo</div>
              <div className="flex items-center justify-between">
                <h3 className="text-white font-bold text-[15px]">Aulas</h3>
                <span className="text-[12px] text-white/50 font-semibold">
                  {hasLessons ? `${watched.size}/${lessons.length}` : "0"}
                </span>
              </div>
            </div>

            <div className="px-3 py-3 max-h-[45vh] overflow-y-auto custom-scroll lg:min-h-0 lg:max-h-none lg:flex-1">
              {!hasLessons && (
                <div className="px-3 py-10 text-center">
                  <Lock className="w-6 h-6 text-white/30 mx-auto mb-2" />
                  <p className="text-white/50 text-[13px]">Nenhuma aula publicada ainda.</p>
                  <p className="text-white/30 text-[11px] mt-1">As aulas aparecerão aqui assim que forem adicionadas.</p>
                </div>
              )}
              {lessons.map((lesson, i) => {
                const w = watched.has(lesson.id);
                const active = i === currentIdx;
                return (
                  <button
                    key={lesson.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`group w-full text-left mb-1.5 px-3 py-3 rounded-xl flex items-center gap-3 transition-all ${
                      active
                        ? "bg-[#ff5a1f]/12 border border-[#ff5a1f]/30"
                        : "bg-white/[0.02] border border-transparent hover:bg-white/[0.05] hover:border-white/10"
                    }`}
                  >
                    <div
                      className={`shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-[12px] font-bold transition-colors ${
                        w
                          ? "bg-green-500/20 text-green-300 border border-green-500/30"
                          : active
                          ? "bg-[#ff5a1f] text-white"
                          : "bg-white/5 text-white/60 border border-white/10"
                      }`}
                    >
                      {w ? <Check className="w-4 h-4" /> : active ? <Play className="w-3.5 h-3.5 fill-current ml-0.5" /> : i + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={`text-[13px] font-semibold truncate ${active ? "text-white" : "text-white/85"}`}>
                        {lesson.title}
                      </div>
                      <div className="text-[11px] text-white/40 mt-0.5">
                        Aula {i + 1} {w ? "• concluída" : active ? "• reproduzindo" : ""}
                      </div>
                    </div>
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWatched(lesson.id);
                      }}
                      className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center border transition-colors cursor-pointer ${
                        w
                          ? "bg-green-500/20 border-green-500/40 text-green-300"
                          : "bg-white/5 border-white/10 text-white/30 hover:text-white"
                      }`}
                      aria-label="Alternar assistido"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>

      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 8px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 8px; }
        .custom-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }
      `}</style>
    </div>
  );
};

export default ModuleDetailDialog;
