import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { LogOut, Sparkles, Shield, Copy, Check, Flame, LayoutGrid, Rows3, Clapperboard } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminPanel from "@/components/AdminPanel";

export const Route = createFileRoute("/_authenticated/membros")({
  component: MembrosPage,
  head: () => ({
    meta: [
      { title: "Área VIP · Prompts Virais" },
      { name: "description", content: "Biblioteca de prompts virais em vídeo: feminino, masculino, POV, casal e ganchos. Copie e cole." },
      { property: "og:title", content: "Área VIP · Prompts Virais" },
      { property: "og:description", content: "Todos os prompts virais organizados por categoria, prontos para copiar e colar." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const C = {
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.6)",
  surface: "#0e0e12",
  border: "rgba(255,255,255,0.08)",
  accent: "#22d3ee",
  hot: "#ff2e88",
  bg: "#050508",
};

type LayoutKey = "cinema" | "compacto" | "neon";

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  videoUrl: string | null;
  categoryId: string;
}
interface Cat {
  id: string;
  slug: string;
  label: string;
  items: PromptItem[];
}

function isHotCat(cat: Cat) {
  return /alta/i.test(cat.label) || cat.slug === "em-alta";
}

function MembrosPage() {
  const navigate = useNavigate();
  const [cats, setCats] = useState<Cat[]>([]);
  const [active, setActive] = useState<string>("todos");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [layout, setLayout] = useState<LayoutKey>("cinema");

  useEffect(() => {
    const saved = typeof window !== "undefined" ? (localStorage.getItem("vip-layout") as LayoutKey | null) : null;
    if (saved) setLayout(saved);
    void loadAll();
    void checkAdmin();
  }, []);

  const pickLayout = (l: LayoutKey) => {
    setLayout(l);
    localStorage.setItem("vip-layout", l);
  };

  async function checkAdmin() {
    const { data: sess } = await supabase.auth.getUser();
    const uid = sess.user?.id;
    setUserName(sess.user?.user_metadata?.full_name || sess.user?.email?.split("@")[0] || "");
    if (!uid) return;
    const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
    setIsAdmin(Boolean(data));
  }

  const loadAll = useCallback(async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("prompt_categories").select("id,slug,label,position").eq("is_active", true).eq("kind", "prompt").order("position"),
      supabase.from("prompts").select("id,title,prompt_text,video_url,category_id,position").eq("is_active", true).eq("kind", "prompt").order("position"),
    ]);
    const catRows = (c.data || []) as Array<{ id: string; slug: string; label: string; position: number }>;
    const prompts = (p.data || []) as Array<{ id: string; title: string; prompt_text: string | null; video_url: string | null; category_id: string }>;

    const storagePaths = Array.from(
      new Set(prompts.map((pr) => pr.video_url).filter((u): u is string => !!u && !/^https?:\/\//i.test(u))),
    );
    const signedMap = new Map<string, string>();
    if (storagePaths.length > 0) {
      const { data: signed } = await supabase.storage.from("prompt-videos").createSignedUrls(storagePaths, 60 * 60 * 6);
      (signed || []).forEach((s) => {
        if (s.signedUrl && s.path) signedMap.set(s.path, s.signedUrl);
      });
    }

    setCats(
      catRows.map((cat) => ({
        id: cat.id,
        slug: cat.slug,
        label: cat.label,
        items: prompts
          .filter((pr) => pr.category_id === cat.id)
          .map((pr) => ({
            id: pr.id,
            title: pr.title,
            prompt: pr.prompt_text || "",
            videoUrl: pr.video_url
              ? /^https?:\/\//i.test(pr.video_url)
                ? pr.video_url
                : signedMap.get(pr.video_url) || null
              : null,
            categoryId: pr.category_id,
          })),
      })),
    );
    setLoading(false);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const total = useMemo(() => cats.reduce((n, r) => n + r.items.length, 0), [cats]);
  const visible = active === "todos" ? cats.filter((c) => c.items.length > 0) : cats.filter((c) => c.id === active);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: C.bg }}>
      <div
        className="fixed -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #22d3ee, transparent 60%)" }}
      />
      <div
        className="fixed top-1/2 -left-52 w-[560px] h-[560px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #ff2e88, transparent 60%)" }}
      />

      <header className="sticky top-0 z-40 backdrop-blur-xl border-b" style={{ background: "rgba(5,5,8,0.8)", borderColor: C.border }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg grid place-items-center shrink-0" style={{ background: "linear-gradient(135deg,#22d3ee,#ff2e88)" }}>
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight truncate">Área VIP</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setAdminOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#22d3ee,#0284c7)", color: "#03121a" }}
              >
                <Shield className="w-3.5 h-3.5" /> Admin
              </button>
            )}
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition hover:opacity-80"
              style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, color: C.text }}
            >
              <LogOut className="w-3.5 h-3.5" /> Sair
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-5 pt-8 sm:pt-12 pb-4">
        <div
          className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3"
          style={{ background: "rgba(34,211,238,0.12)", color: "#7ee7f7", border: "1px solid rgba(34,211,238,0.32)" }}
        >
          <Sparkles className="w-3 h-3" /> BIBLIOTECA DE PROMPTS VIRAIS
        </div>
        <h1 className="font-display uppercase tracking-tight text-[34px] sm:text-[52px] leading-[1.02]">
          {userName ? `E aí, ${userName}` : "Bem-vindo à área VIP"} 👋
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: C.textMuted }}>
          {total} prompts prontos pra colar. <span style={{ color: "#7ee7f7" }}>Novos liberados todo dia.</span>
        </p>

        {isAdmin && <LayoutPicker layout={layout} onPick={pickLayout} />}
      </section>

      {/* Tabs */}
      <nav className="sticky top-16 z-30 backdrop-blur-xl border-y" style={{ background: "rgba(5,5,8,0.72)", borderColor: C.border }}>
        <div className="max-w-[1400px] mx-auto px-4 sm:px-5 py-2.5 flex gap-2 overflow-x-auto no-scrollbar">
          <TabBtn label="Todos" active={active === "todos"} onClick={() => setActive("todos")} />
          {cats.map((cat) => (
            <TabBtn
              key={cat.id}
              label={cat.label}
              hot={isHotCat(cat)}
              count={cat.items.length}
              active={active === cat.id}
              onClick={() => setActive(cat.id)}
            />
          ))}
        </div>
      </nav>

      <main className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-5 pt-8 pb-24 space-y-12">
        {loading && (
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-3xl animate-pulse" style={{ aspectRatio: "9/14", background: "rgba(255,255,255,0.05)" }} />
            ))}
          </div>
        )}

        {!loading && visible.every((r) => r.items.length === 0) && (
          <div className="text-center py-20 rounded-3xl" style={{ border: `1px dashed ${C.border}`, color: C.textMuted }}>
            Nenhum prompt nesta aba ainda.
            {isAdmin && (
              <div className="mt-4">
                <button
                  onClick={() => setAdminOpen(true)}
                  className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-[13px] font-semibold"
                  style={{ background: "linear-gradient(135deg,#22d3ee,#0284c7)", color: "#03121a" }}
                >
                  <Shield className="w-4 h-4" /> Publicar o primeiro
                </button>
              </div>
            )}
          </div>
        )}

        {!loading &&
          visible
            .filter((r) => r.items.length > 0)
            .map((cat) => {
              const hot = isHotCat(cat);
              return (
                <section key={cat.id} className="vip-fade-up">
                  <div className="mb-4 flex items-center gap-2">
                    <h2 className="font-display uppercase tracking-tight text-[22px] sm:text-[30px]">{cat.label}</h2>
                    {hot && (
                      <span
                        className="inline-flex items-center gap-1 h-6 px-2.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
                        style={{ background: "rgba(255,46,136,0.14)", color: "#ff7ab5", border: "1px solid rgba(255,46,136,0.38)" }}
                      >
                        <Flame className="w-3 h-3" /> bombando
                      </span>
                    )}
                    <span className="text-[12px] ml-auto" style={{ color: C.textMuted }}>
                      {cat.items.length} prompts
                    </span>
                  </div>
                  <div className={gridClass(layout)}>
                    {cat.items.map((item) => (
                      <PromptCard key={item.id} item={item} hot={hot} layout={layout} />
                    ))}
                  </div>
                </section>
              );
            })}
      </main>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} onChange={loadAll} />
    </div>
  );
}

function gridClass(layout: LayoutKey) {
  if (layout === "compacto") return "grid gap-2.5 grid-cols-3 sm:grid-cols-4 lg:grid-cols-6";
  if (layout === "neon") return "grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";
  return "grid gap-3 sm:gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5";
}

function LayoutPicker({ layout, onPick }: { layout: LayoutKey; onPick: (l: LayoutKey) => void }) {
  const opts: { id: LayoutKey; label: string; icon: any; hint: string }[] = [
    { id: "cinema", label: "Cinema", icon: Clapperboard, hint: "cards grandes" },
    { id: "compacto", label: "Compacto", icon: LayoutGrid, hint: "mais por tela" },
    { id: "neon", label: "Neon", icon: Rows3, hint: "premium" },
  ];
  return (
    <div className="mt-5 inline-flex flex-wrap gap-1.5 p-1.5 rounded-2xl" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
      <span className="self-center px-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: C.textMuted }}>
        Layout
      </span>
      {opts.map((o) => {
        const Icon = o.icon;
        const on = layout === o.id;
        return (
          <button
            key={o.id}
            onClick={() => onPick(o.id)}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-[12px] font-semibold transition"
            style={on ? { background: "linear-gradient(135deg,#22d3ee,#ff2e88)", color: "#fff" } : { color: C.textMuted }}
            title={o.hint}
          >
            <Icon className="w-3.5 h-3.5" /> {o.label}
          </button>
        );
      })}
    </div>
  );
}

function TabBtn({ label, active, onClick, hot, count }: { label: string; active: boolean; onClick: () => void; hot?: boolean; count?: number }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-[13px] font-bold whitespace-nowrap transition active:scale-[0.97]"
      style={
        active
          ? hot
            ? { background: "linear-gradient(120deg,#ff2e88,#a855f7)", color: "#fff", boxShadow: "0 10px 26px -12px rgba(255,46,136,0.8)" }
            : { background: "linear-gradient(120deg,#22d3ee,#0284c7)", color: "#03121a" }
          : { background: "rgba(255,255,255,0.05)", border: `1px solid ${C.border}`, color: "rgba(255,255,255,0.75)" }
      }
    >
      {hot && <Flame className="w-3.5 h-3.5" />}
      {label}
      {typeof count === "number" && count > 0 && (
        <span className="text-[10px] opacity-70">{count}</span>
      )}
    </button>
  );
}

/** Autoplay muted loop; only plays while on screen so nothing trava. */
function PromptVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      void el.play().catch(() => {});
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            el.play().catch(() => {});
          } else {
            el.pause();
          }
        }
      },
      { rootMargin: "200px 0px", threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [src]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 w-full h-full object-cover"
      src={src}
      muted
      loop
      playsInline
      autoPlay
      preload="metadata"
      // @ts-expect-error iOS attr
      webkit-playsinline="true"
    />
  );
}

function PromptCard({ item, hot, layout }: { item: PromptItem; hot: boolean; layout: LayoutKey }) {
  const [copied, setCopied] = useState(false);
  const compact = layout === "compacto";

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.prompt);
      setCopied(true);
      toast.success("Prompt copiado!");
      setTimeout(() => setCopied(false), 1800);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div
      className={`group rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1 ${hot ? "hot-card" : ""}`}
      style={{
        background: layout === "neon" ? "rgba(255,255,255,0.04)" : "linear-gradient(180deg,#14141c 0%,#0a0a10 100%)",
        border: hot ? "none" : `1px solid ${C.border}`,
        backdropFilter: layout === "neon" ? "blur(18px)" : undefined,
        boxShadow: hot ? "none" : "0 30px 80px -34px rgba(0,0,0,0.9)",
      }}
    >
      <div className="relative w-full bg-black" style={{ aspectRatio: "9 / 16" }}>
        {item.videoUrl ? (
          <PromptVideo src={item.videoUrl} />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40 text-xs">sem vídeo</div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/80 to-transparent" />
        {hot && (
          <span
            className="absolute top-2 left-2 inline-flex items-center gap-1 h-6 px-2 rounded-full text-[10px] font-bold uppercase"
            style={{ background: "rgba(0,0,0,0.55)", color: "#ff7ab5", border: "1px solid rgba(255,46,136,0.5)", backdropFilter: "blur(8px)" }}
          >
            <Flame className="w-3 h-3" /> alta
          </span>
        )}
      </div>

      <div className={compact ? "p-2.5 flex flex-col gap-2" : "p-4 flex flex-col gap-3"}>
        <h3
          className={`${compact ? "text-[12px]" : "text-[15px]"} font-semibold leading-tight line-clamp-2`}
          style={{ color: C.text }}
        >
          {item.title}
        </h3>
        <button
          onClick={copy}
          className={`inline-flex items-center justify-center gap-2 ${compact ? "h-9 text-[12px]" : "h-12 text-[14px]"} rounded-xl font-bold transition active:scale-[0.98] ${hot && !copied ? "hot-btn" : ""}`}
          style={{
            background: copied
              ? "rgba(0,180,120,0.15)"
              : hot
                ? undefined
                : "linear-gradient(135deg,#22d3ee,#0284c7)",
            color: copied ? "#5eeab0" : hot ? "#fff" : "#03121a",
            border: copied ? "1px solid rgba(0,180,120,0.35)" : "none",
            boxShadow: copied || hot ? undefined : "0 10px 30px -12px rgba(34,211,238,0.65)",
          }}
        >
          {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar prompt</>}
        </button>
      </div>
    </div>
  );
}
