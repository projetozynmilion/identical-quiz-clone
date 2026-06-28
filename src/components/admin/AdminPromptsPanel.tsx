import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, X, Pencil, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Wand2, Upload } from "lucide-react";

type Cat = { id: string; slug: string; label: string; description: string | null; position: number; is_active: boolean };
type Prompt = { id: string; category_id: string | null; title: string; subtitle: string | null; prompt_text: string; tutorial: string | null; video_url: string | null; image_url: string | null; media_type: "video" | "image"; position: number; is_active: boolean };

export default function AdminPromptsPanel({ C }: { C: any }) {
  const [cats, setCats] = useState<Cat[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);

  const [catModal, setCatModal] = useState<Cat | null>(null);
  const [catNew, setCatNew] = useState(false);

  const [promptModal, setPromptModal] = useState<Prompt | null>(null);
  const [promptNew, setPromptNew] = useState<string | null>(null); // category_id
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const [c, p] = await Promise.all([
      supabase.from("prompt_categories").select("*").order("position"),
      supabase.from("prompts").select("*").order("position"),
    ]);
    setLoading(false);
    if (c.error) { toast.error(c.error.message); return; }
    if (p.error) { toast.error(p.error.message); return; }
    setCats((c.data as any) || []);
    setPrompts((p.data as any) || []);
  };
  useEffect(() => { void load(); }, []);

  const inp = "w-full h-10 px-3 rounded-lg text-[13px] focus:outline-none";
  const inpStyle = { background: C.hover, color: C.text, border: `1px solid ${C.border}` } as any;

  // ===== category CRUD =====
  const saveCat = async (data: Partial<Cat>) => {
    const payload = {
      slug: (data.slug || "").trim() || `cat-${Date.now()}`,
      label: (data.label || "").trim(),
      description: data.description?.trim() || null,
      position: Number(data.position) || 0,
      is_active: data.is_active ?? true,
    };
    if (!payload.label) { toast.error("Label obrigatório"); return; }
    const res = catModal?.id
      ? await supabase.from("prompt_categories").update(payload).eq("id", catModal.id)
      : await supabase.from("prompt_categories").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Categoria salva");
    setCatModal(null); setCatNew(false);
    await load();
  };
  const delCat = async (id: string) => {
    if (!confirm("Excluir categoria? Os prompts ficam sem categoria.")) return;
    const { error } = await supabase.from("prompt_categories").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await load();
  };

  // ===== prompt CRUD =====
  const savePrompt = async (data: Partial<Prompt>) => {
    const payload = {
      category_id: data.category_id || null,
      title: (data.title || "").trim(),
      subtitle: data.subtitle?.trim() || null,
      prompt_text: data.prompt_text || "",
      video_url: data.video_url?.trim() || null,
      image_url: data.image_url?.trim() || null,
      media_type: data.media_type || "video",
      position: Number(data.position) || 0,
      is_active: data.is_active ?? true,
    };
    if (!payload.title) { toast.error("Título obrigatório"); return; }
    const res = promptModal?.id
      ? await supabase.from("prompts").update(payload).eq("id", promptModal.id)
      : await supabase.from("prompts").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Prompt salvo");
    setPromptModal(null); setPromptNew(null);
    await load();
  };
  const delPrompt = async (id: string) => {
    if (!confirm("Excluir este prompt?")) return;
    const { error } = await supabase.from("prompts").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    await load();
  };
  const toggleActive = async (p: Prompt) => {
    await supabase.from("prompts").update({ is_active: !p.is_active }).eq("id", p.id);
    await load();
  };
  const move = async (p: Prompt, dir: -1 | 1) => {
    const siblings = prompts.filter((x) => x.category_id === p.category_id).sort((a, b) => a.position - b.position);
    const idx = siblings.findIndex((x) => x.id === p.id);
    const swap = siblings[idx + dir];
    if (!swap) return;
    await Promise.all([
      supabase.from("prompts").update({ position: swap.position }).eq("id", p.id),
      supabase.from("prompts").update({ position: p.position }).eq("id", swap.id),
    ]);
    await load();
  };

  // ===== upload media (video or image) =====
  const uploadMedia = async (file: File, kind: "video" | "image", onUrl: (url: string) => void) => {
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || (kind === "video" ? "mp4" : "jpg")).toLowerCase();
      const path = `${kind}/${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("prompt-videos").upload(path, file, { upsert: false, contentType: file.type || (kind === "video" ? "video/mp4" : "image/jpeg") });
      if (up.error) { toast.error(up.error.message); return; }
      const signed = await supabase.storage.from("prompt-videos").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) { toast.error(signed.error?.message || "Erro ao gerar URL"); return; }
      onUrl(signed.data.signedUrl);
      toast.success(kind === "video" ? "Vídeo enviado" : "Imagem enviada");
    } finally { setUploading(false); }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-2" style={{ background: C.accent, color: "#fff" }}>
            <Wand2 className="w-3 h-3" /> ADMIN · PROMPTS
          </div>
          <h2 className="text-[26px] font-bold tracking-tight" style={{ color: C.text }}>Gerenciar Prompts</h2>
          <p className="text-[13px]" style={{ color: C.textMuted }}>Crie categorias, adicione prompts e suba seus vídeos MP4.</p>
        </div>
        <button onClick={() => { setCatNew(true); setCatModal({ id: "", slug: "", label: "", description: "", position: cats.length, is_active: true } as any); }} className="inline-flex items-center gap-2 h-10 px-4 rounded-full font-semibold text-[13px] text-white" style={{ background: C.accent }}>
          <Plus className="w-4 h-4" /> Nova categoria
        </button>
      </div>

      {loading && <div className="text-center py-8" style={{ color: C.textMuted }}>Carregando…</div>}

      {cats.map((cat) => {
        const items = prompts.filter((p) => p.category_id === cat.id).sort((a, b) => a.position - b.position);
        return (
          <div key={cat.id} className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <div className="font-bold text-[16px]" style={{ color: C.text }}>{cat.label}</div>
                {cat.description && <div className="text-[12px] mt-0.5 max-w-2xl" style={{ color: C.textMuted }}>{cat.description}</div>}
              </div>
              <div className="flex gap-1.5 shrink-0">
                <button onClick={() => { setCatNew(false); setCatModal(cat); }} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.accentSoft, color: C.accent }}><Pencil className="w-3.5 h-3.5" /></button>
                <button onClick={() => delCat(cat.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {items.map((p) => (
                <div key={p.id} className="rounded-xl overflow-hidden" style={{ background: C.hover, border: `1px solid ${C.border}`, opacity: p.is_active ? 1 : 0.5 }}>
                  {p.media_type === "image" && p.image_url ? (
                    <img src={p.image_url} className="w-full aspect-video object-cover bg-black" alt={p.title} />
                  ) : p.video_url ? (
                    <video src={p.video_url} className="w-full aspect-video object-cover bg-black" muted playsInline />
                  ) : (
                    <div className="w-full aspect-video flex items-center justify-center text-[11px]" style={{ background: C.surfaceAlt, color: C.textMuted }}>sem mídia</div>
                  )}
                  <div className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="font-semibold text-[13px] truncate flex-1" style={{ color: C.text }}>{p.title}</div>
                      <span className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: C.accentSoft, color: C.accent }}>{p.media_type === "image" ? "IMG" : "VID"}</span>
                    </div>
                    {p.subtitle && <div className="text-[11px] truncate" style={{ color: C.textMuted }}>{p.subtitle}</div>}
                    <div className="flex gap-1 mt-2">
                      <button onClick={() => move(p, -1)} className="flex-1 h-7 rounded text-[11px] flex items-center justify-center" style={{ background: C.surfaceAlt, color: C.text }}><ArrowUp className="w-3 h-3" /></button>
                      <button onClick={() => move(p, 1)} className="flex-1 h-7 rounded text-[11px] flex items-center justify-center" style={{ background: C.surfaceAlt, color: C.text }}><ArrowDown className="w-3 h-3" /></button>
                      <button onClick={() => toggleActive(p)} className="flex-1 h-7 rounded text-[11px] flex items-center justify-center" style={{ background: C.surfaceAlt, color: C.text }}>{p.is_active ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}</button>
                      <button onClick={() => { setPromptNew(null); setPromptModal(p); }} className="flex-1 h-7 rounded text-[11px] flex items-center justify-center" style={{ background: C.accentSoft, color: C.accent }}><Pencil className="w-3 h-3" /></button>
                      <button onClick={() => delPrompt(p.id)} className="flex-1 h-7 rounded text-[11px] flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}><Trash2 className="w-3 h-3" /></button>
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => { setPromptNew(cat.id); setPromptModal({ id: "", category_id: cat.id, title: "", subtitle: "", prompt_text: "", video_url: "", image_url: "", media_type: "video", position: items.length, is_active: true } as any); }} className="rounded-xl aspect-video flex flex-col items-center justify-center gap-2 transition hover:scale-[1.02]" style={{ border: `2px dashed ${C.border}`, color: C.textMuted }}>
                <Plus className="w-6 h-6" /><span className="text-[12px] font-semibold">Adicionar prompt</span>
              </button>
            </div>
          </div>
        );
      })}

      {/* CATEGORY MODAL */}
      {catModal && (
        <Modal onClose={() => { setCatModal(null); setCatNew(false); }} title={catNew ? "Nova categoria" : "Editar categoria"} C={C}>
          <input className={inp} style={inpStyle} placeholder="Slug (sem espaços)" value={catModal.slug || ""} onChange={(e) => setCatModal({ ...catModal, slug: e.target.value })} />
          <input className={inp} style={inpStyle} placeholder="Label" value={catModal.label} onChange={(e) => setCatModal({ ...catModal, label: e.target.value })} />
          <textarea className={inp + " min-h-[80px] py-2"} style={inpStyle} placeholder="Descrição" value={catModal.description || ""} onChange={(e) => setCatModal({ ...catModal, description: e.target.value })} />
          <input className={inp} style={inpStyle} type="number" placeholder="Posição" value={catModal.position} onChange={(e) => setCatModal({ ...catModal, position: Number(e.target.value) })} />
          <ModalActions onCancel={() => { setCatModal(null); setCatNew(false); }} onSave={() => saveCat(catModal)} C={C} />
        </Modal>
      )}

      {/* PROMPT MODAL */}
      {promptModal && (
        <Modal onClose={() => { setPromptModal(null); setPromptNew(null); }} title={promptNew ? "Novo prompt" : "Editar prompt"} C={C}>
          <div className="flex gap-2">
            {(["video", "image"] as const).map((k) => (
              <button key={k} type="button" onClick={() => setPromptModal({ ...promptModal, media_type: k })} className="flex-1 h-9 rounded-lg text-[12px] font-semibold" style={promptModal.media_type === k ? { background: C.accent, color: "#fff" } : { background: C.hover, color: C.text, border: `1px solid ${C.border}` }}>
                {k === "video" ? "🎬 Vídeo" : "🖼️ Imagem"}
              </button>
            ))}
          </div>

          {promptModal.media_type === "video" ? (
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: C.textSubtle }}>Vídeo MP4</span>
              <div className="mt-1 rounded-xl overflow-hidden" style={{ background: C.hover, border: `1px solid ${C.border}` }}>
                {promptModal.video_url ? (
                  <video src={promptModal.video_url} controls className="w-full aspect-video bg-black" />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-[12px]" style={{ color: C.textMuted }}>nenhum vídeo</div>
                )}
                <div className="p-3 flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[12px] font-semibold cursor-pointer" style={{ background: C.accent, color: "#fff" }}>
                    <Upload className="w-3.5 h-3.5" /> {uploading ? "Enviando…" : "Enviar vídeo"}
                    <input type="file" accept="video/*" className="hidden" disabled={uploading} onChange={async (e) => {
                      const f = e.target.files?.[0]; if (f) await uploadMedia(f, "video", (url: string) => setPromptModal({ ...promptModal, video_url: url }));
                      (e.target as HTMLInputElement).value = "";
                    }} />
                  </label>
                  {promptModal.video_url && <button onClick={() => setPromptModal({ ...promptModal, video_url: "" })} className="h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>Remover</button>}
                </div>
              </div>
            </label>
          ) : (
            <label className="block">
              <span className="text-[11px] uppercase tracking-wider" style={{ color: C.textSubtle }}>Imagem</span>
              <div className="mt-1 rounded-xl overflow-hidden" style={{ background: C.hover, border: `1px solid ${C.border}` }}>
                {promptModal.image_url ? (
                  <img src={promptModal.image_url} alt="" className="w-full aspect-video object-cover bg-black" />
                ) : (
                  <div className="aspect-video flex items-center justify-center text-[12px]" style={{ color: C.textMuted }}>nenhuma imagem</div>
                )}
                <div className="p-3 flex flex-wrap gap-2">
                  <label className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[12px] font-semibold cursor-pointer" style={{ background: C.accent, color: "#fff" }}>
                    <Upload className="w-3.5 h-3.5" /> {uploading ? "Enviando…" : "Enviar imagem"}
                    <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => {
                      const f = e.target.files?.[0]; if (f) await uploadMedia(f, "image", (url: string) => setPromptModal({ ...promptModal, image_url: url }));
                      (e.target as HTMLInputElement).value = "";
                    }} />
                  </label>
                  {promptModal.image_url && <button onClick={() => setPromptModal({ ...promptModal, image_url: "" })} className="h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>Remover</button>}
                </div>
              </div>
            </label>
          )}

          <input className={inp} style={inpStyle} placeholder={promptModal.media_type === "image" ? "URL da imagem (ou cole)" : "URL do vídeo (ou cole)"} value={(promptModal.media_type === "image" ? promptModal.image_url : promptModal.video_url) || ""} onChange={(e) => setPromptModal(promptModal.media_type === "image" ? { ...promptModal, image_url: e.target.value } : { ...promptModal, video_url: e.target.value })} />
          <input className={inp} style={inpStyle} placeholder="Título" value={promptModal.title} onChange={(e) => setPromptModal({ ...promptModal, title: e.target.value })} />
          <input className={inp} style={inpStyle} placeholder="Subtítulo" value={promptModal.subtitle || ""} onChange={(e) => setPromptModal({ ...promptModal, subtitle: e.target.value })} />
          <textarea className={inp + " min-h-[260px] py-2 font-mono text-[12px] whitespace-pre-wrap"} style={inpStyle} placeholder="Texto do prompt (será copiado pelo aluno)" value={promptModal.prompt_text} onChange={(e) => setPromptModal({ ...promptModal, prompt_text: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <select className={inp} style={inpStyle} value={promptModal.category_id || ""} onChange={(e) => setPromptModal({ ...promptModal, category_id: e.target.value || null })}>
              <option value="">(sem categoria)</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
            </select>
            <input className={inp} style={inpStyle} type="number" placeholder="Posição" value={promptModal.position} onChange={(e) => setPromptModal({ ...promptModal, position: Number(e.target.value) })} />
          </div>
          <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={promptModal.is_active} onChange={(e) => setPromptModal({ ...promptModal, is_active: e.target.checked })} /> Ativo</label>
          <ModalActions onCancel={() => { setPromptModal(null); setPromptNew(null); }} onSave={() => savePrompt(promptModal)} C={C} />
        </Modal>
      )}
    </div>
  );
}

function Modal({ children, onClose, title, C }: any) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={onClose}>
      <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-[18px] font-bold">{title}</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.hover }}><X className="w-4 h-4" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalActions({ onCancel, onSave, C }: any) {
  return (
    <div className="flex justify-end gap-2 pt-2">
      <button onClick={onCancel} className="h-10 px-4 text-[13px] font-semibold rounded-full" style={{ background: C.hover, color: C.text }}>Cancelar</button>
      <button onClick={onSave} className="h-10 px-5 text-[13px] font-bold rounded-full text-white" style={{ background: C.accent }}>Salvar</button>
    </div>
  );
}
