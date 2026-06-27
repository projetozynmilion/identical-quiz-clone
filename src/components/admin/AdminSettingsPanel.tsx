import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Settings, Upload, Save } from "lucide-react";
import { setSiteSetting } from "@/hooks/useSiteSettings";

type Row = { key: string; value: any };

const FIELDS: { key: string; label: string; type: "url" | "image" | "video" | "text"; bucket?: string; help?: string }[] = [
  { key: "purchase_url", label: "Link do botão de compra", type: "url", help: "Usado no botão 'Comprar' da landing." },
  { key: "flow_iframe_url", label: "URL do iframe FLOW", type: "url", help: "Aba FLOW dentro da área de membros." },
  { key: "hero_banner_url", label: "Banner principal (topo da área de membros)", type: "image", bucket: "site-media" },
  { key: "members_bg_video", label: "Vídeo de fundo (área de membros)", type: "video", bucket: "site-media" },
];

export default function AdminSettingsPanel({ C }: { C: any }) {
  const [rows, setRows] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("site_settings").select("key,value");
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    const map: Record<string, any> = {};
    (data || []).forEach((r: any) => { map[r.key] = r.value?.url ?? ""; });
    setRows(map);
  };
  useEffect(() => { void load(); }, []);

  const upload = async (key: string, bucket: string, file: File) => {
    setUploading(key);
    try {
      const ext = (file.name.split(".").pop() || "bin").toLowerCase();
      const path = `${key}-${Date.now()}.${ext}`;
      const up = await supabase.storage.from(bucket).upload(path, file, { upsert: false, contentType: file.type });
      if (up.error) { toast.error(up.error.message); return; }
      const signed = await supabase.storage.from(bucket).createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
      if (signed.error || !signed.data?.signedUrl) { toast.error("Erro ao gerar URL"); return; }
      setRows((r) => ({ ...r, [key]: signed.data.signedUrl }));
      toast.success("Arquivo enviado — clique em salvar");
    } finally { setUploading(null); }
  };

  const save = async (key: string) => {
    setSaving(key);
    try {
      await setSiteSetting(key, { url: rows[key] || "" });
      toast.success("Configuração salva");
    } catch (e: any) { toast.error(e.message); }
    finally { setSaving(null); }
  };

  const inp = "w-full h-10 px-3 rounded-lg text-[13px] focus:outline-none";
  const inpStyle = { background: C.hover, color: C.text, border: `1px solid ${C.border}` } as any;

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-semibold rounded-full mb-2" style={{ background: C.accent, color: "#fff" }}>
          <Settings className="w-3 h-3" /> ADMIN · CONFIGURAÇÕES
        </div>
        <h2 className="text-[26px] font-bold tracking-tight" style={{ color: C.text }}>Configurações gerais</h2>
        <p className="text-[13px]" style={{ color: C.textMuted }}>Links e mídias usados pelo site.</p>
      </div>

      {loading && <div className="text-center py-8" style={{ color: C.textMuted }}>Carregando…</div>}

      <div className="space-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className="rounded-2xl p-5" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
            <div className="font-bold text-[14px]" style={{ color: C.text }}>{f.label}</div>
            {f.help && <div className="text-[11px] mt-0.5" style={{ color: C.textMuted }}>{f.help}</div>}
            <div className="text-[10px] font-mono mt-1" style={{ color: C.textSubtle }}>chave: {f.key}</div>

            {f.type === "image" && rows[f.key] && <img src={rows[f.key]} alt="" className="mt-3 w-full max-w-md aspect-video object-cover rounded-xl" style={{ border: `1px solid ${C.border}` }} />}
            {f.type === "video" && rows[f.key] && <video src={rows[f.key]} controls className="mt-3 w-full max-w-md aspect-video rounded-xl bg-black" />}

            <div className="mt-3 flex flex-wrap gap-2 items-center">
              <input className={inp + " flex-1 min-w-[260px]"} style={inpStyle} placeholder="URL" value={rows[f.key] || ""} onChange={(e) => setRows({ ...rows, [f.key]: e.target.value })} />
              {(f.type === "image" || f.type === "video") && f.bucket && (
                <label className="inline-flex items-center gap-2 h-10 px-3 rounded-lg text-[12px] font-semibold cursor-pointer" style={{ background: C.hover, color: C.text, border: `1px solid ${C.border}` }}>
                  <Upload className="w-3.5 h-3.5" /> {uploading === f.key ? "Enviando…" : "Upload"}
                  <input type="file" accept={f.type === "image" ? "image/*" : "video/*"} className="hidden" disabled={!!uploading} onChange={async (e) => { const file = e.target.files?.[0]; if (file) await upload(f.key, f.bucket!, file); (e.target as HTMLInputElement).value = ""; }} />
                </label>
              )}
              <button onClick={() => save(f.key)} disabled={saving === f.key} className="inline-flex items-center gap-2 h-10 px-4 rounded-lg text-[12px] font-bold text-white disabled:opacity-50" style={{ background: C.accent }}>
                <Save className="w-3.5 h-3.5" /> {saving === f.key ? "Salvando…" : "Salvar"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
