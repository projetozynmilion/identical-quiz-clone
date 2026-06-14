import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Crosshair, Plus, X, ExternalLink, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

export type RadarProductRow = {
  id: string;
  name: string;
  emoji: string;
  category: string;
  hashtag: string | null;
  hook: string | null;
  affiliate_url: string;
  image_url: string | null;
  price: number;
  old_price: number | null;
  sales_24h: number;
  growth: number;
  views_millions: number;
  creators: number;
  conversion_score: number;
  competition: string;
  position: number;
  is_active: boolean;
};

const CATS = ["Beleza", "Moda", "Maquiagem", "Casa", "Cozinha", "Fitness", "Gadgets", "Saúde", "Pet", "Tech"];
const COMPS = ["BAIXA", "MÉDIA", "ALTA"];

const empty = {
  name: "",
  emoji: "🔥",
  category: "Moda",
  hashtag: "",
  hook: "",
  affiliate_url: "",
  image_url: "",
  price: 0,
  old_price: "" as number | "",
  sales_24h: 1000,
  growth: 150,
  views_millions: 5,
  creators: 100,
  conversion_score: 85,
  competition: "MÉDIA",
  position: 0,
  is_active: true,
};

export default function AdminRadarPanel({ C }: { C: any }) {
  const [items, setItems] = useState<RadarProductRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<any>(empty);
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("radar_products")
      .select("*")
      .order("position", { ascending: true })
      .order("created_at", { ascending: false });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setItems((data as any) || []);
  };

  useEffect(() => { void load(); }, []);

  const openNew = () => {
    const maxPos = items.reduce((acc, it) => Math.max(acc, it.position), -1);
    setEditId(null);
    setForm({ ...empty, position: maxPos + 1 });
    setOpen(true);
  };

  const openEdit = (it: RadarProductRow) => {
    setEditId(it.id);
    setForm({
      ...it,
      old_price: it.old_price ?? "",
      hashtag: it.hashtag ?? "",
      hook: it.hook ?? "",
      image_url: it.image_url ?? "",
    });
    setOpen(true);
  };

  const close = () => { setOpen(false); setEditId(null); setForm(empty); };

  const save = async () => {
    if (!form.name.trim()) { toast.error("Nome obrigatório"); return; }
    if (!form.affiliate_url.trim()) { toast.error("Link de afiliado obrigatório"); return; }
    setSaving(true);
    const payload: any = {
      name: form.name.trim(),
      emoji: form.emoji || "🔥",
      category: form.category,
      hashtag: form.hashtag?.trim() || null,
      hook: form.hook?.trim() || null,
      affiliate_url: form.affiliate_url.trim(),
      image_url: form.image_url?.trim() || null,
      price: Number(form.price) || 0,
      old_price: form.old_price === "" || form.old_price == null ? null : Number(form.old_price),
      sales_24h: Number(form.sales_24h) || 0,
      growth: Number(form.growth) || 0,
      views_millions: Number(form.views_millions) || 0,
      creators: Number(form.creators) || 0,
      conversion_score: Math.max(0, Math.min(100, Number(form.conversion_score) || 0)),
      competition: form.competition,
      position: Number(form.position) || 0,
      is_active: !!form.is_active,
    };
    const res = editId
      ? await supabase.from("radar_products").update(payload).eq("id", editId)
      : await supabase.from("radar_products").insert(payload);
    setSaving(false);
    if (res.error) { toast.error(res.error.message); return; }
    toast.success(editId ? "Produto atualizado" : "Produto adicionado");
    close();
    await load();
  };

  const remove = async (id: string) => {
    if (!confirm("Excluir este produto?")) return;
    const { error } = await supabase.from("radar_products").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    toast.success("Produto excluído");
    await load();
  };

  const toggleActive = async (it: RadarProductRow) => {
    const { error } = await supabase
      .from("radar_products")
      .update({ is_active: !it.is_active })
      .eq("id", it.id);
    if (error) { toast.error(error.message); return; }
    await load();
  };

  const inp = "w-full h-10 px-3 rounded-lg text-[13px] focus:outline-none";
  const inpStyle = { background: C.hover, color: C.text, border: `1px solid ${C.border}` };

  return (
    <div className="space-y-5">
      {/* HEADER */}
      <div
        className="relative overflow-hidden rounded-3xl p-5 md:p-6"
        style={{
          background: "linear-gradient(135deg,#0a1612 0%,#050807 100%)",
          border: "1px solid rgba(16,185,129,0.18)",
        }}
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ backgroundImage: "linear-gradient(rgba(16,185,129,0.08) 1px,transparent 1px),linear-gradient(90deg,rgba(16,185,129,0.08) 1px,transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full" style={{ background: "radial-gradient(circle,rgba(16,185,129,0.18),transparent 60%)" }} />
        <div className="relative z-10 flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold border border-emerald-400/30 bg-emerald-400/5 text-emerald-300 mb-2">
              <Crosshair className="w-3 h-3" /> RADAR TIKSHOP · ADMIN
            </div>
            <h2 className="text-[22px] md:text-[26px] font-black text-white tracking-tight">
              Produtos em alta + <span className="bg-gradient-to-r from-emerald-300 to-emerald-500 bg-clip-text text-transparent">links de afiliado</span>
            </h2>
            <p className="text-emerald-100/60 text-[13px] mt-1 max-w-lg">
              Tudo que você cadastrar aqui aparece dentro do Radar TIKSHOP pros membros — com o link de afiliado pra eles se inscreverem.
            </p>
          </div>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-xl font-bold text-[13px] text-black bg-emerald-400 hover:bg-emerald-300 transition active:scale-[0.98]"
            style={{ boxShadow: "0 0 30px rgba(16,185,129,0.45)" }}
          >
            <Plus className="w-4 h-4" /> Novo produto
          </button>
        </div>
      </div>

      {/* LIST */}
      <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="hidden md:grid grid-cols-[1fr_120px_110px_110px_110px_140px] gap-3 px-5 py-3 text-[10px] font-mono uppercase tracking-wider" style={{ color: C.textSubtle, borderBottom: `1px solid ${C.border}`, background: C.hover }}>
          <div>Produto</div>
          <div className="text-right">Preço</div>
          <div className="text-right">Vendas 24h</div>
          <div className="text-right">Crescimento</div>
          <div className="text-right">Score</div>
          <div className="text-right">Ações</div>
        </div>

        <div className="divide-y" style={{ borderColor: C.border }}>
          {loading && (
            <div className="px-5 py-10 text-center text-[13px]" style={{ color: C.textMuted }}>Carregando…</div>
          )}
          {!loading && items.length === 0 && (
            <div className="px-5 py-12 text-center" style={{ color: C.textMuted }}>
              <div className="text-3xl mb-2">📡</div>
              <div className="text-[14px] font-semibold mb-1" style={{ color: C.text }}>Nenhum produto cadastrado ainda</div>
              <div className="text-[12px]">Clique em <b>Novo produto</b> pra começar.</div>
            </div>
          )}
          {!loading && items.map((it) => (
            <div key={it.id} className="grid grid-cols-[1fr_auto] md:grid-cols-[1fr_120px_110px_110px_110px_140px] gap-3 items-center px-4 md:px-5 py-3" style={{ background: it.is_active ? "transparent" : C.hover }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-2xl overflow-hidden" style={{ background: it.image_url ? "transparent" : "linear-gradient(135deg,#10b981,#34d399)" }}>
                  {it.image_url ? <img src={it.image_url} alt={it.name} className="w-full h-full object-cover" /> : <span>{it.emoji}</span>}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-[13px] truncate" style={{ color: C.text }}>{it.name}</div>
                    {!it.is_active && <span className="text-[9px] font-mono px-1.5 py-0.5 rounded" style={{ background: C.hover, color: C.textMuted, border: `1px solid ${C.border}` }}>INATIVO</span>}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]" style={{ color: C.textMuted }}>
                    <span>{it.category}</span>
                    <span>·</span>
                    <span className="font-mono">{it.hashtag || "—"}</span>
                    <a href={it.affiliate_url} target="_blank" rel="noopener noreferrer" className="hidden sm:inline-flex items-center gap-1 ml-1 text-emerald-500 hover:underline">
                      <ExternalLink className="w-3 h-3" /> link
                    </a>
                  </div>
                </div>
              </div>

              <div className="hidden md:block text-right font-mono text-[12px]" style={{ color: C.text }}>R$ {Number(it.price).toFixed(2).replace(".", ",")}</div>
              <div className="hidden md:block text-right font-mono text-[12px]" style={{ color: C.text }}>{it.sales_24h.toLocaleString("pt-BR")}</div>
              <div className="hidden md:block text-right font-mono text-[12px] font-bold text-emerald-500">+{it.growth}%</div>
              <div className="hidden md:block text-right font-mono text-[12px]" style={{ color: C.text }}>{it.conversion_score}/100</div>

              <div className="flex items-center justify-end gap-1.5">
                <button onClick={() => toggleActive(it)} title={it.is_active ? "Desativar" : "Ativar"} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.hover, color: C.text }}>
                  {it.is_active ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                </button>
                <button onClick={() => openEdit(it)} title="Editar" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: C.accentSoft, color: C.accent }}>
                  <Pencil className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => remove(it.id)} title="Excluir" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(239,68,68,0.12)", color: "#ef4444" }}>
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MODAL */}
      {open && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in duration-200" onClick={close}>
          <div
            className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl p-6 space-y-4"
            style={{ background: C.surface, border: `1px solid ${C.border}`, color: C.text }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[10px] font-mono tracking-widest text-emerald-500 uppercase mb-1">Radar TikShop</div>
                <div className="text-[20px] font-bold">{editId ? "Editar produto" : "Novo produto"}</div>
              </div>
              <button onClick={close} className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: C.hover }}>
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[80px_1fr] gap-3">
              <input className={inp + " text-center text-2xl"} style={inpStyle as any} maxLength={4} placeholder="🔥" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
              <input className={inp} style={inpStyle as any} placeholder="Nome do produto" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Link de afiliado *</label>
              <input className={inp} style={inpStyle as any} type="url" placeholder="https://s.shopee.com.br/... ou link da Shopee/TikTok Shop" value={form.affiliate_url} onChange={(e) => setForm({ ...form, affiliate_url: e.target.value })} />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Imagem (URL opcional)</label>
              <input className={inp} style={inpStyle as any} type="url" placeholder="https://...jpg" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Categoria</label>
                <select className={inp} style={inpStyle as any} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Competição</label>
                <select className={inp} style={inpStyle as any} value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })}>
                  {COMPS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Posição</label>
                <input className={inp} style={inpStyle as any} type="number" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Preço (R$)</label>
                <input className={inp} style={inpStyle as any} type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Preço antigo</label>
                <input className={inp} style={inpStyle as any} type="number" step="0.01" value={form.old_price} onChange={(e) => setForm({ ...form, old_price: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Score (0-100)</label>
                <input className={inp} style={inpStyle as any} type="number" min={0} max={100} value={form.conversion_score} onChange={(e) => setForm({ ...form, conversion_score: e.target.value })} />
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Vendas 24h</label>
                <input className={inp} style={inpStyle as any} type="number" value={form.sales_24h} onChange={(e) => setForm({ ...form, sales_24h: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Crescimento (%)</label>
                <input className={inp} style={inpStyle as any} type="number" value={form.growth} onChange={(e) => setForm({ ...form, growth: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Views (M)</label>
                <input className={inp} style={inpStyle as any} type="number" step="0.1" value={form.views_millions} onChange={(e) => setForm({ ...form, views_millions: e.target.value })} />
              </div>
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Criadores</label>
                <input className={inp} style={inpStyle as any} type="number" value={form.creators} onChange={(e) => setForm({ ...form, creators: e.target.value })} />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Hashtag</label>
              <input className={inp} style={inpStyle as any} placeholder="#achadinhostiktok" value={form.hashtag} onChange={(e) => setForm({ ...form, hashtag: e.target.value })} />
            </div>

            <div>
              <label className="text-[11px] font-mono uppercase tracking-wider block mb-1" style={{ color: C.textSubtle }}>Hook (gancho viral)</label>
              <textarea className={inp + " h-20 py-2 resize-none"} style={inpStyle as any} placeholder="Ex: POV: descobri o produto que mudou minha rotina" value={form.hook} onChange={(e) => setForm({ ...form, hook: e.target.value })} />
            </div>

            <label className="flex items-center gap-2 text-[13px] cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
              <span>Produto ativo (visível pros membros)</span>
            </label>

            <div className="flex justify-end gap-2 pt-2">
              <button onClick={close} className="h-10 px-4 text-[13px] font-semibold rounded-full" style={{ background: C.hover, color: C.text }}>Cancelar</button>
              <button disabled={saving} onClick={save} className="h-10 px-5 text-[13px] font-bold rounded-full text-black bg-emerald-400 hover:bg-emerald-300 active:scale-[0.98] transition disabled:opacity-50" style={{ boxShadow: "0 0 20px rgba(16,185,129,0.35)" }}>
                {saving ? "Salvando…" : editId ? "Salvar" : "Adicionar produto"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
