import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Sparkles, Shield, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import AdminPanel from "@/components/AdminPanel";

export const Route = createFileRoute("/_authenticated/membros")({
  component: MembrosPage,
});

const C = {
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.6)",
  surface: "#0e0e12",
  border: "rgba(255,255,255,0.08)",
  accent: "#1f6dff",
  bg: "#050508",
};

interface PromptItem {
  id: string;
  title: string;
  prompt: string;
  videoUrl: string | null; // resolved (signed or absolute)
  categoryId: string;
}
interface Row {
  id: string;
  label: string;
  items: PromptItem[];
}

function MembrosPage() {
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    void loadAll();
    void checkAdmin();
  }, []);

  async function checkAdmin() {
    const { data: sess } = await supabase.auth.getUser();
    const uid = sess.user?.id;
    setUserName(sess.user?.user_metadata?.full_name || sess.user?.email?.split("@")[0] || "");
    if (!uid) return;
    const { data } = await supabase.rpc("has_role", { _user_id: uid, _role: "admin" });
    setIsAdmin(Boolean(data));
  }

  async function loadAll() {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("prompt_categories").select("id,label,position").eq("is_active", true).eq("kind", "prompt").order("position"),
      supabase.from("prompts").select("id,title,prompt_text,video_url,category_id,position").eq("is_active", true).eq("kind", "prompt").order("position"),
    ]);
    const cats = (c.data || []) as Array<{ id: string; label: string; position: number }>;
    const prompts = (p.data || []) as Array<{ id: string; title: string; prompt_text: string | null; video_url: string | null; category_id: string; position: number }>;

    // Resolve videoUrl: sign storage paths; passthrough http(s)
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

    const resolvedRows: Row[] = cats.map((cat) => ({
      id: cat.id,
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
    }));

    setRows(resolvedRows);
    setLoading(false);
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  const totalPrompts = useMemo(() => rows.reduce((n, r) => n + r.items.length, 0), [rows]);

  return (
    <div className="min-h-screen text-white relative overflow-x-hidden" style={{ background: C.bg }}>
      {/* Backdrop glow */}
      <div
        className="absolute -top-40 -right-40 w-[700px] h-[700px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1f6dff, transparent 60%)" }}
      />
      <div
        className="absolute top-1/3 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1f6dff, transparent 60%)" }}
      />

      {/* Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{ background: "rgba(5,5,8,0.75)", borderColor: C.border }}
      >
        <div className="max-w-[1400px] mx-auto px-5 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #1f6dff, #0044cc)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight truncate">Área VIP</span>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setAdminOpen(true)}
                className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition hover:opacity-90"
                style={{ background: "linear-gradient(135deg,#1f6dff,#0044cc)", color: "#fff" }}
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
      <section className="relative z-10 max-w-[1400px] mx-auto px-5 pt-10 sm:pt-14 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-3" style={{ background: "rgba(31,109,255,0.15)", color: "#7aa8ff", border: "1px solid rgba(31,109,255,0.35)" }}>
          <Sparkles className="w-3 h-3" /> BIBLIOTECA DE PROMPTS UGC
        </div>
        <h1 className="font-display uppercase tracking-tight text-[36px] sm:text-[52px] leading-[1.02]">
          {userName ? `E aí, ${userName}` : "Bem-vindo à área VIP"} 👋
        </h1>
        <p className="mt-3 text-[15px] max-w-xl" style={{ color: C.textMuted }}>
          {totalPrompts} prompts prontos pra colar. Novos liberados todo dia.
        </p>
      </section>

      {/* Rows */}
      <main className="relative z-10 max-w-[1400px] mx-auto px-5 pb-24 space-y-14">
        {loading && (
          <div className="text-center py-20" style={{ color: C.textMuted }}>Carregando…</div>
        )}
        {!loading && rows.every((r) => r.items.length === 0) && (
          <div
            className="text-center py-20 rounded-3xl"
            style={{ border: `1px dashed ${C.border}`, color: C.textMuted }}
          >
            Nenhum prompt publicado ainda.
            {isAdmin && (
              <div className="mt-4">
                <button onClick={() => setAdminOpen(true)} className="inline-flex items-center gap-1.5 h-10 px-4 rounded-xl text-[13px] font-semibold" style={{ background: "linear-gradient(135deg,#1f6dff,#0044cc)", color: "#fff" }}>
                  <Shield className="w-4 h-4" /> Publicar o primeiro
                </button>
              </div>
            )}
          </div>
        )}
        {!loading &&
          rows
            .filter((r) => r.items.length > 0)
            .map((row) => <NetflixRow key={row.id} row={row} />)}
      </main>

      <AdminPanel open={adminOpen} onClose={() => setAdminOpen(false)} onChange={loadAll} />
    </div>
  );
}

function NetflixRow({ row }: { row: Row }) {
  const scrollerId = `row-${row.id}`;

  const scroll = (dir: 1 | -1) => {
    const el = document.getElementById(scrollerId);
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <section>
      <div className="flex items-end justify-between mb-4 px-1">
        <h2 className="font-display uppercase tracking-tight text-[22px] sm:text-[28px]">
          {row.label}
        </h2>
        <div className="hidden sm:flex gap-1.5">
          <button onClick={() => scroll(-1)} className="w-9 h-9 grid place-items-center rounded-full hover:opacity-80" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}` }}>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={() => scroll(1)} className="w-9 h-9 grid place-items-center rounded-full hover:opacity-80" style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}` }}>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div
        id={scrollerId}
        className="flex gap-4 sm:gap-6 overflow-x-auto snap-x snap-mandatory pb-6 -mx-5 px-5 no-scrollbar"
        style={{ scrollbarWidth: "none" }}
      >
        {row.items.map((item, idx) => (
          <RankedCard key={item.id} item={item} rank={idx + 1} />
        ))}
      </div>
    </section>
  );
}

function RankedCard({ item, rank }: { item: PromptItem; rank: number }) {
  const [copied, setCopied] = useState(false);

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
    <div className="snap-start shrink-0 flex items-end gap-2 sm:gap-3" style={{ width: "min(78vw, 300px)" }}>
      {/* Big outlined rank number, Netflix Top-10 style */}
      <div
        aria-hidden
        className="hidden sm:block shrink-0 select-none"
        style={{
          fontFamily: "var(--font-display, 'Anton', 'Bebas Neue', sans-serif)",
          fontSize: rank >= 10 ? 180 : 220,
          lineHeight: 0.8,
          fontWeight: 900,
          color: "transparent",
          WebkitTextStroke: "3px rgba(31,109,255,0.9)",
          textShadow: "0 0 40px rgba(31,109,255,0.35)",
          marginRight: -20,
          marginBottom: -6,
        }}
      >
        {rank}
      </div>

      <div
        className="flex-1 rounded-2xl overflow-hidden flex flex-col"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          boxShadow: "0 24px 60px -30px rgba(0,0,0,0.9)",
        }}
      >
        <div className="relative w-full bg-black" style={{ aspectRatio: "9 / 16" }}>
          {item.videoUrl ? (
            <video
              key={item.videoUrl}
              className="absolute inset-0 w-full h-full object-cover"
              controls
              playsInline
              loop
              muted
              preload="metadata"
            >
              <source src={item.videoUrl} />
            </video>
          ) : (
            <div className="absolute inset-0 grid place-items-center text-white/40 text-sm">
              sem vídeo
            </div>
          )}
          {/* rank badge on mobile */}
          <div
            className="sm:hidden absolute top-2 left-2 h-8 min-w-8 px-2 grid place-items-center rounded-lg text-[13px] font-black"
            style={{ background: "rgba(31,109,255,0.9)", color: "#fff" }}
          >
            #{rank}
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3">
          <h3 className="text-[14px] font-semibold leading-tight line-clamp-2" style={{ color: C.text }}>
            {item.title}
          </h3>
          <button
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 h-10 rounded-xl text-[13px] font-bold transition"
            style={{ background: copied ? "rgba(0,180,120,0.15)" : "linear-gradient(135deg,#1f6dff,#0044cc)", color: copied ? "#5eeab0" : "#fff", border: copied ? "1px solid rgba(0,180,120,0.35)" : "none" }}
          >
            {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar prompt</>}
          </button>
        </div>
      </div>
    </div>
  );
}
