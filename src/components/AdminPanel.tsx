import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X, Plus, Trash2, FolderPlus, Wand2, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const AdminStudentsPanel = lazy(() => import("@/components/admin/AdminStudentsPanel"));


interface Category {
  id: string;
  label: string;
  slug: string;
  position: number;
}

interface PromptRow {
  id: string;
  title: string;
  category_id: string;
  video_url: string | null;
  position: number;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onChange?: () => void;
}

const B = {
  bg: "#0a0a0d",
  surface: "#111116",
  border: "rgba(255,255,255,0.08)",
  text: "#ffffff",
  muted: "rgba(255,255,255,0.55)",
  accent: "#0a84ff",
};

export default function AdminPanel({ open, onClose, onChange }: Props) {
  const [tab, setTab] = useState<"prompts" | "alunos">("prompts");
  const [cats, setCats] = useState<Category[]>([]);

  const [prompts, setPrompts] = useState<PromptRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [newCat, setNewCat] = useState("");
  const [title, setTitle] = useState("");
  const [promptText, setPromptText] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    void load();
  }, [open]);

  async function load() {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("prompt_categories").select("id,label,slug,position").eq("kind", "prompt").order("position"),
      supabase.from("prompts").select("id,title,category_id,video_url,position").eq("kind", "prompt").order("position", { ascending: true }),
    ]);
    const catList = (c.data || []) as Category[];
    setCats(catList);
    setPrompts((p.data || []) as PromptRow[]);
    if (!categoryId && catList[0]) setCategoryId(catList[0].id);
    setLoading(false);
  }

  async function addCategory() {
    const label = newCat.trim();
    if (!label) return;
    const slug = label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 60) || `cat-${Date.now()}`;
    const nextPos = (cats.at(-1)?.position ?? -1) + 1;
    const { data, error } = await supabase
      .from("prompt_categories")
      .insert({ slug, label, kind: "prompt", is_active: true, position: nextPos })
      .select()
      .single();
    if (error) return toast.error(error.message);
    setNewCat("");
    toast.success("Categoria criada");
    await load();
    if (data?.id) setCategoryId(data.id);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !promptText.trim() || !categoryId) {
      toast.error("Preencha título, prompt e categoria");
      return;
    }
    setSaving(true);
    try {
      let videoUrl: string | null = null;

      if (file) {
        setProgress(10);
        const ext = file.name.split(".").pop() || "mp4";
        const path = `prompts/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error: upErr } = await supabase.storage
          .from("prompt-videos")
          .upload(path, file, { cacheControl: "3600", upsert: false, contentType: file.type });
        if (upErr) throw upErr;
        setProgress(80);
        videoUrl = path; // store storage path; UI signs at load time
      }

      const catPrompts = prompts.filter((p) => p.category_id === categoryId);
      const nextPos = (catPrompts.at(-1)?.position ?? -1) + 1;

      const { error: insErr } = await supabase.from("prompts").insert({
        category_id: categoryId,
        title: title.trim(),
        prompt_text: promptText.trim(),
        video_url: videoUrl,
        media_type: "video",
        kind: "prompt",
        is_active: true,
        position: nextPos,
      });
      if (insErr) throw insErr;

      toast.success("Prompt publicado — já apareceu para os alunos");
      setTitle("");
      setPromptText("");
      setFile(null);
      setProgress(0);
      if (fileRef.current) fileRef.current.value = "";
      await load();
      onChange?.();
    } catch (err: any) {
      toast.error(err?.message || "Erro ao publicar");
    } finally {
      setSaving(false);
      setProgress(0);
    }
  }

  async function removePrompt(id: string, videoPath: string | null) {
    if (!confirm("Remover este prompt?")) return;
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    if (videoPath && !videoPath.startsWith("http")) {
      await supabase.storage.from("prompt-videos").remove([videoPath]);
    }
    toast.success("Removido");
    await load();
    onChange?.();
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start sm:items-center justify-center p-0 sm:p-6"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-3xl max-h-screen sm:max-h-[90vh] overflow-y-auto sm:rounded-3xl"
        style={{ background: B.bg, border: `1px solid ${B.border}`, color: B.text }}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 h-16 border-b" style={{ background: B.bg, borderColor: B.border }}>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg grid place-items-center" style={{ background: "linear-gradient(135deg,#0a84ff,#0044cc)" }}>
              <Plus className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[15px] font-bold tracking-tight">Painel admin</div>
              <div className="text-[11px]" style={{ color: B.muted }}>Publique um vídeo + prompt · aparece na hora pros alunos</div>
            </div>
          </div>
          <button onClick={onClose} className="w-9 h-9 grid place-items-center rounded-lg hover:opacity-70" style={{ background: "rgba(255,255,255,0.06)" }}>
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="flex gap-1.5 p-1.5 rounded-2xl" style={{ background: B.surface, border: `1px solid ${B.border}` }}>
            {([
              { id: "prompts" as const, label: "Prompts", icon: Wand2 },
              { id: "alunos" as const, label: "Alunos", icon: UserPlus },
            ]).map((t) => {
              const Icon = t.icon;
              const on = tab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-xl text-[13px] font-semibold transition"
                  style={on ? { background: B.accent, color: "#fff" } : { color: B.muted }}
                >
                  <Icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              );
            })}
          </div>

          {tab === "prompts" && (
            <>
          {/* Category quick-add */}

          <section>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: B.muted }}>Categorias (fileiras da dashboard)</div>
            <div className="flex flex-wrap gap-2 mb-3">
              {cats.map((c) => (
                <span key={c.id} className="inline-flex items-center h-8 px-3 rounded-full text-[12px]" style={{ background: B.surface, border: `1px solid ${B.border}` }}>
                  {c.label}
                </span>
              ))}
              {cats.length === 0 && <span className="text-[12px]" style={{ color: B.muted }}>Nenhuma ainda.</span>}
            </div>
            <div className="flex gap-2">
              <input
                value={newCat}
                onChange={(e) => setNewCat(e.target.value)}
                placeholder='Ex.: "Top em alta no momento"'
                className="flex-1 h-11 px-4 rounded-xl text-[14px] outline-none"
                style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
              />
              <button
                type="button"
                onClick={addCategory}
                className="inline-flex items-center gap-1.5 h-11 px-4 rounded-xl text-[13px] font-semibold"
                style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
              >
                <FolderPlus className="w-4 h-4" /> Adicionar
              </button>
            </div>
          </section>

          {/* Add prompt */}
          <form onSubmit={submit} className="space-y-4">
            <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: B.muted }}>Novo prompt</div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-[12px] font-semibold" style={{ color: B.muted }}>Categoria (fileira)</label>
                <select
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                  className="mt-1 w-full h-11 px-3 rounded-xl outline-none text-[14px]"
                  style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
                >
                  {cats.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] font-semibold" style={{ color: B.muted }}>Título</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex.: Menina de camisa branca no espelho"
                  className="mt-1 w-full h-11 px-4 rounded-xl outline-none text-[14px]"
                  style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] font-semibold" style={{ color: B.muted }}>Prompt (o aluno vai copiar isto)</label>
                <textarea
                  value={promptText}
                  onChange={(e) => setPromptText(e.target.value)}
                  rows={6}
                  placeholder="Cole aqui o prompt completo…"
                  className="mt-1 w-full px-4 py-3 rounded-xl outline-none text-[14px] resize-y"
                  style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-[12px] font-semibold" style={{ color: B.muted }}>Vídeo (mp4 vertical 9:16 recomendado)</label>
                <div className="mt-1 flex items-center gap-3">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    className="hidden"
                    id="admin-video-input"
                  />
                  <label
                    htmlFor="admin-video-input"
                    className="inline-flex items-center gap-2 h-11 px-4 rounded-xl text-[13px] font-semibold cursor-pointer"
                    style={{ background: B.surface, border: `1px solid ${B.border}`, color: B.text }}
                  >
                    <Upload className="w-4 h-4" /> Escolher vídeo
                  </label>
                  <div className="text-[12px] truncate" style={{ color: B.muted }}>
                    {file ? file.name : "Nenhum arquivo selecionado"}
                  </div>
                </div>
                {progress > 0 && (
                  <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
                    <div className="h-full transition-all" style={{ width: `${progress}%`, background: B.accent }} />
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 h-12 px-6 rounded-xl text-[14px] font-bold w-full sm:w-auto"
              style={{ background: "linear-gradient(135deg,#0a84ff,#0044cc)", color: "#fff", opacity: saving ? 0.6 : 1 }}
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Publicando…</> : <><Plus className="w-4 h-4" /> Publicar prompt</>}
            </button>
          </form>

          {/* Existing */}
          <section>
            <div className="text-[11px] font-semibold uppercase tracking-wider mb-3" style={{ color: B.muted }}>Prompts publicados ({prompts.length})</div>
            {loading && <div className="text-[13px]" style={{ color: B.muted }}>Carregando…</div>}
            {!loading && prompts.length === 0 && <div className="text-[13px]" style={{ color: B.muted }}>Nenhum ainda.</div>}
            <div className="space-y-2">
              {prompts.map((p) => {
                const cat = cats.find((c) => c.id === p.category_id);
                return (
                  <div key={p.id} className="flex items-center justify-between gap-3 rounded-xl px-4 py-3" style={{ background: B.surface, border: `1px solid ${B.border}` }}>
                    <div className="min-w-0">
                      <div className="text-[14px] font-semibold truncate">{p.title}</div>
                      <div className="text-[11px]" style={{ color: B.muted }}>{cat?.label || "sem categoria"}</div>
                    </div>
                    <button
                      onClick={() => removePrompt(p.id, p.video_url)}
                      className="w-9 h-9 grid place-items-center rounded-lg hover:opacity-70 shrink-0"
                      style={{ background: "rgba(255,80,80,0.1)", color: "#ff6b6b" }}
                      title="Remover"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
            </>
          )}

          {tab === "alunos" && (
            <Suspense fallback={<div className="h-40 rounded-3xl animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />}>
              <AdminStudentsPanel C={{ text: B.text, textMuted: B.muted, surface: B.surface, border: B.border, hover: "rgba(255,255,255,0.05)", accent: B.accent }} />
            </Suspense>
          )}
        </div>

      </div>
    </div>
  );
}
