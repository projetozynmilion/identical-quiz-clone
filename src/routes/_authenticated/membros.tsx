import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { LogOut, Sparkles, Shield, Copy, Check } from "lucide-react";
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
  return (
    <section>
      <div className="mb-4 px-1">
        <h2 className="font-display uppercase tracking-tight text-[22px] sm:text-[28px]">
          {row.label}
        </h2>
      </div>
      <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {row.items.map((item) => (
          <PromptCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

function PromptCard({ item }: { item: PromptItem }) {
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
    <div
      className="group rounded-3xl overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1"
      style={{
        background: "linear-gradient(180deg, #14141c 0%, #0a0a10 100%)",
        border: `1px solid ${C.border}`,
        boxShadow: "0 30px 80px -30px rgba(0,0,0,0.9), 0 0 0 1px rgba(31,109,255,0.05)",
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
            autoPlay
            preload="auto"
          >
            <source src={item.videoUrl} />
          </video>
        ) : (
          <div className="absolute inset-0 grid place-items-center text-white/40 text-sm">
            sem vídeo
          </div>
        )}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
      </div>

      <div className="p-4 sm:p-5 flex flex-col gap-3">
        <h3 className="text-[15px] sm:text-[16px] font-semibold leading-tight line-clamp-2" style={{ color: C.text }}>
          {item.title}
        </h3>
        <button
          onClick={copy}
          className="inline-flex items-center justify-center gap-2 h-12 rounded-xl text-[14px] font-bold transition active:scale-[0.98]"
          style={{
            background: copied ? "rgba(0,180,120,0.15)" : "linear-gradient(135deg,#1f6dff,#0044cc)",
            color: copied ? "#5eeab0" : "#fff",
            border: copied ? "1px solid rgba(0,180,120,0.35)" : "none",
            boxShadow: copied ? "none" : "0 10px 30px -12px rgba(31,109,255,0.7)",
          }}
        >
          {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar prompt</>}
        </button>
      </div>
    </div>
  );
}


