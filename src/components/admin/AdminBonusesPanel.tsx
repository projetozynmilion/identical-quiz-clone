import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, X, Pencil, Trash2, Eye, EyeOff, Gift, Upload, ArrowUp, ArrowDown } from "lucide-react";

type Bonus = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  icon: string | null;
  banner_url: string | null;
  action_type: "link" | "credentials" | "module" | "none";
  action_payload: any;
  position: number;
  is_active: boolean;
};

const empty: Bonus = {
  id: "", title: "", subtitle: "", description: "", icon: "✨", banner_url: "",
  action_type: "link", action_payload: { url: "" }, position: 0, is_active: true,
};

export default function AdminBonusesPanel({ C }: { C: any }) {
  const [items, setItems] = useState<Bonus[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<Bonus | null>(null);
  const [uploading, setUploading] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bonuses").select("*").order("position");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setItems((data as any) || []);
  };
  useEffect(() => { void load(); }, []);

  const save = async () => {
    if (!modal) return;
    if (!modal.title.trim()) { toast.error("Título obrigatório"); return; }
    const payload: any = {
      title: modal.title.trim(),
      subtitle: modal.subtitle?.trim() || null,
      description: modal.description?.trim() || null,
      icon: modal.icon?.trim() || null,
      banner_url: modal.banner_url?.trim() || null,
      action_type: modal.action_type,
      action_payload: modal.action_payload || {},
      position: Number(modal.position) || 0,
      is_active: modal.is_active,
    };
    const res = modal.id
      ? await supabase.from("bonuses").update(payload).eq("id", modal.id)
      : await supabase.from("bonuses").insert(payload);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success("Bônus salvo");
    setModal(null);
    await load();
  };
  const remove = async (id: string) => {
    if (!confirm("Excluir bônus?")) return;
    await supabase.from("bonuses").delete().eq("id", id);
    await load();
  };
  const toggle = async (b: Bonus) => { await supabase.from("bonuses").update({ is_active: !b.is_active }).eq("id", b.id); await load(); };
  const move = async (b: Bonus, dir: -1 | 1) => {
    const sorted = [...items].sort((a, z) => a.position - z.position);
    const idx = sorted.findIndex((x) => x.id === b.id);
    const sw = sorted[idx + dir]; if (!sw) return;
    await Promise.all([
      supabase.from("bonuses").update({ position: sw.position }).eq("id", b.id),
      supabase.from("bonuses").update({ position: b.position }).eq("id", sw.id),
    ]);
    await load();
  };

  const uploadBanner = async (file: File) => {
    if (!modal) return;
    setUploading(true);
    try {
      const ext = (file.name.split(".").pop() || "jpg").toLowerCase();
      const path = `${crypto.randomUUID()}.${ext}`;
      const up = await supabase.storage.from("bonus-banners").upload(path, file, { upsert: false, contentType: file.type });
      if (up.error) { toast.error(up.error.message); return; }
      const signed = await supabase.storage.from("bonus-banners").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) { toast.error("Erro ao gerar URL"); return; }
      setModal({ ...modal, banner_url: signed.data.signedUrl });
      toast.success("Banner enviado");
    } finally { setUploading(false); }
  };

  const inp = "w-full h-10 px-3 rounded-lg text-[13px] focus:outline-none";
  const inpStyle = { background: C.hover, color: C.text, border: `1px solid ${C.border}` } as any;
  const setPayload = (patch: any) => modal && setModal({ ...modal, action_payload: { ...(modal.action_payload || {}), ...patch } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-2" style={{ background: C.accent, color: "#fff" }}>
            <Gift className="w-3 h-3" /> ADMIN · BÔNUS
          </div>
          <h2 className="text-[26px] font-bold tracking-tight" style={{ color: C.text }}>Gerenciar Bônus / IAs</h2>
          <p className="text-[13px]" style={{ color: C.textMuted }}>Cards que abrem link, credenciais (login+senha) ou módulo. O bônus de credenciais aparece no popup quando o card "GROK AÍ" é clicado.</p>
        </div>
        <button onClick={() => setModal({ ...empty, position: items.length })} className="inline-flex items-center gap-2 h-10 px-4 rounded-full font-semibold text-[13px] text-white" style={{ background: C.accent }}>
          <Plus className="w-4 h-4" /> Novo bônus
        </button>
      </div>

      {loading && <div className="text-center py-8" style={{ color: C.textMuted }}>Carregando…</div>}

      <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        {items.length === 0 && !loading && <div className="text-center p-8 text-[13px]" style={{ color: C.textMuted }}>Nenhum bônus cadastrado.</div>}
        {items.map((b) => (
          <div key={b.id} className="flex items-center gap-3 p-4 border-b last:border-b-0" style={{ borderColor: C.border, opacity: b.is_active ? 1 : 0.5 }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0" style={{ background: b.banner_url ? "transparent" : C.accentSoft, color: C.accent, overflow: "hidden" }}>
              {b.banner_url ? <img src={b.banner_url} alt="" className="w-full h-full object-cover" /> : (b.icon || "✨")}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-[13px] truncate" style={{ color: C.text }}>{b.title}</div>
              <div className="text-[11px] truncate" style={{ color: C.textMuted }}>
                {b.action_type} · {b.action_type === "link" ? b.action_payload?.url : b.action_type === "credentials" ? `${b.action_payload?.email || "—"}` : b.action_type === "module" ? b.action_payload?.module_id : "—"}
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => move(b, -1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.hover, color: C.text }}><ArrowUp className="w-3.5 h-3.5" /></button>
              <button onClick={() => move(b, 1)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.hover, color: C.text }}><ArrowDown className="w-3.5 h-3.5" /></button>
              <button onClick={() => toggle(b)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.hover, color: C.text }}>{b.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}</button>
              <button onClick={() => setModal(b)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.accentSoft, color: C.accent }}><Pencil className="w-3.5 h-3.5" /></button>
              <button onClick={() => remove(b.id)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}><Trash2 className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        ))}
      </div>

      {modal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setModal(null)}>
          <div className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }} onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-2">
              <div className="text-[18px] font-bold">{modal.id ? "Editar bônus" : "Novo bônus"}</div>
              <button onClick={() => setModal(null)} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.hover }}><X className="w-4 h-4" /></button>
            </div>

            <div className="grid grid-cols-[80px_1fr] gap-3">
              <input className={inp + " text-center text-2xl"} style={inpStyle} maxLength={4} value={modal.icon || ""} onChange={(e) => setModal({ ...modal, icon: e.target.value })} />
              <input className={inp} style={inpStyle} placeholder="Título" value={modal.title} onChange={(e) => setModal({ ...modal, title: e.target.value })} />
            </div>
            <input className={inp} style={inpStyle} placeholder="Subtítulo" value={modal.subtitle || ""} onChange={(e) => setModal({ ...modal, subtitle: e.target.value })} />
            <textarea className={inp + " min-h-[80px] py-2"} style={inpStyle} placeholder="Descrição" value={modal.description || ""} onChange={(e) => setModal({ ...modal, description: e.target.value })} />

            <div className="rounded-xl overflow-hidden" style={{ background: C.hover, border: `1px solid ${C.border}` }}>
              {modal.banner_url ? <img src={modal.banner_url} alt="" className="w-full aspect-video object-cover" /> : <div className="aspect-video flex items-center justify-center text-[12px]" style={{ color: C.textMuted }}>sem banner</div>}
              <div className="p-3 flex gap-2">
                <label className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[12px] font-semibold cursor-pointer" style={{ background: C.accent, color: "#fff" }}>
                  <Upload className="w-3.5 h-3.5" /> {uploading ? "Enviando…" : "Enviar banner"}
                  <input type="file" accept="image/*" className="hidden" disabled={uploading} onChange={async (e) => { const f = e.target.files?.[0]; if (f) await uploadBanner(f); (e.target as HTMLInputElement).value = ""; }} />
                </label>
                {modal.banner_url && <button onClick={() => setModal({ ...modal, banner_url: "" })} className="h-9 px-3 rounded-lg text-[12px] font-semibold" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>Remover</button>}
              </div>
            </div>

            <select className={inp} style={inpStyle} value={modal.action_type} onChange={(e) => setModal({ ...modal, action_type: e.target.value as any, action_payload: e.target.value === "credentials" ? { email: "", password: "", warning: "" } : { url: "" } })}>
              <option value="link">Abrir link</option>
              <option value="credentials">Mostrar credenciais (email + senha)</option>
              <option value="module">Abrir módulo</option>
              <option value="none">Nenhuma ação</option>
            </select>

            {modal.action_type === "link" && (
              <input className={inp} style={inpStyle} type="url" placeholder="URL" value={modal.action_payload?.url || ""} onChange={(e) => setPayload({ url: e.target.value })} />
            )}
            {modal.action_type === "credentials" && (
              <div className="space-y-2">
                <input className={inp} style={inpStyle} placeholder="E-mail" value={modal.action_payload?.email || ""} onChange={(e) => setPayload({ email: e.target.value })} />
                <input className={inp} style={inpStyle} placeholder="Senha" value={modal.action_payload?.password || ""} onChange={(e) => setPayload({ password: e.target.value })} />
                <input className={inp} style={inpStyle} placeholder="Aviso (opcional)" value={modal.action_payload?.warning || ""} onChange={(e) => setPayload({ warning: e.target.value })} />
              </div>
            )}
            {modal.action_type === "module" && (
              <input className={inp} style={inpStyle} placeholder="ID do módulo" value={modal.action_payload?.module_id || ""} onChange={(e) => setPayload({ module_id: e.target.value })} />
            )}

            <input className={inp} style={inpStyle} type="number" placeholder="Posição" value={modal.position} onChange={(e) => setModal({ ...modal, position: Number(e.target.value) })} />
            <label className="flex items-center gap-2 text-[13px]"><input type="checkbox" checked={modal.is_active} onChange={(e) => setModal({ ...modal, is_active: e.target.checked })} /> Ativo</label>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setModal(null)} className="h-10 px-4 text-[13px] font-semibold rounded-full" style={{ background: C.hover, color: C.text }}>Cancelar</button>
              <button onClick={save} className="h-10 px-5 text-[13px] font-bold rounded-full text-white" style={{ background: C.accent }}>Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
