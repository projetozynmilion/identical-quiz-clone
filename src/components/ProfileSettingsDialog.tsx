import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { X, Camera, Loader2, User as UserIcon } from "lucide-react";
import { resolveAvatarUrl, bustAvatarCache } from "@/lib/avatarUrl";

type Theme = {
  bg: string;
  surface: string;
  border: string;
  text: string;
  textMuted: string;
  textSubtle: string;
  hover: string;
  accent: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  user: { id: string; email?: string | null; user_metadata?: any } | null;
  isDark: boolean;
  C: Theme;
  onUpdated?: (p: { full_name: string | null; username: string | null; avatar_url: string | null }) => void;
}

export default function ProfileSettingsDialog({ open, onClose, user, isDark, C, onUpdated }: Props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open || !user) return;
    let alive = true;
    setLoading(true);
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, username, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (!alive) return;
      setFullName(data?.full_name ?? user.user_metadata?.full_name ?? "");
      setUsername(data?.username ?? "");
      setAvatarPath(data?.avatar_url ?? null);
      const url = await resolveAvatarUrl(data?.avatar_url ?? null);
      if (alive) setAvatarPreview(url);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [open, user]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const pickFile = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f || !user) return;
    if (!f.type.startsWith("image/")) { toast.error("Selecione uma imagem"); return; }
    if (f.size > 5 * 1024 * 1024) { toast.error("Imagem muito grande (máx 5MB)"); return; }
    setUploading(true);
    try {
      const ext = (f.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") || "jpg";
      const path = `${user.id}/avatar-${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("avatars").upload(path, f, {
        contentType: f.type,
        upsert: false,
      });
      if (error) throw error;
      // remove previous
      if (avatarPath && avatarPath !== path && !/^https?:/i.test(avatarPath)) {
        await supabase.storage.from("avatars").remove([avatarPath]).catch(() => undefined);
      }
      bustAvatarCache(avatarPath);
      setAvatarPath(path);
      const url = await resolveAvatarUrl(path);
      setAvatarPreview(url);
      toast.success("Foto atualizada");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Falha ao enviar foto");
    } finally {
      setUploading(false);
    }
  };

  const removeAvatar = async () => {
    if (!avatarPath || !user) { setAvatarPath(null); setAvatarPreview(null); return; }
    setUploading(true);
    try {
      if (!/^https?:/i.test(avatarPath)) {
        await supabase.storage.from("avatars").remove([avatarPath]).catch(() => undefined);
      }
      bustAvatarCache(avatarPath);
      setAvatarPath(null);
      setAvatarPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const save = async () => {
    if (!user) return;
    const name = fullName.trim();
    const uname = username.trim().replace(/^@+/, "").toLowerCase();
    if (name.length < 2) { toast.error("Coloque seu nome"); return; }
    if (uname && !/^[a-z0-9_.]{2,24}$/.test(uname)) {
      toast.error("Username: 2-24 caracteres (a-z, 0-9, _ .)"); return;
    }
    setSaving(true);
    try {
      const { error } = await supabase.from("profiles").upsert({
        id: user.id,
        full_name: name,
        username: uname || null,
        avatar_url: avatarPath,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await supabase.auth.updateUser({ data: { full_name: name, avatar_url: avatarPath } }).catch(() => undefined);
      onUpdated?.({ full_name: name, username: uname || null, avatar_url: avatarPath });
      toast.success("Perfil salvo");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };

  const initials = (fullName || user?.email || "U")
    .split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-150">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-3xl overflow-hidden animate-in zoom-in-95 duration-200"
        style={{
          background: C.surface,
          border: `1px solid ${C.border}`,
          color: C.text,
          boxShadow: isDark
            ? "0 30px 80px -20px rgba(0,0,0,0.7)"
            : "0 30px 80px -20px rgba(0,0,0,0.25)",
        }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3">
          <div>
            <h2 className="text-[17px] font-semibold tracking-tight">Seu perfil</h2>
            <p className="text-[12.5px]" style={{ color: C.textSubtle }}>
              Aparece no chat ao vivo e na comunidade
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center transition"
            style={{ background: C.hover }}
            aria-label="Fechar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex flex-col items-center pt-2 pb-5">
            <div className="relative">
              <button
                onClick={pickFile}
                disabled={uploading}
                className="relative w-24 h-24 rounded-full overflow-hidden flex items-center justify-center transition active:scale-95 group"
                style={{
                  background: `linear-gradient(135deg, ${C.accent}, #ff4500)`,
                  border: `2px solid ${C.border}`,
                }}
              >
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white text-2xl font-bold">{initials}</span>
                )}
                <span className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 group-hover:opacity-100 transition">
                  {uploading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Camera className="w-5 h-5 text-white" />}
                </span>
              </button>
              <button
                onClick={pickFile}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center shadow-lg active:scale-90 transition"
                style={{ background: C.accent, color: "#fff", border: `2px solid ${C.surface}` }}
                aria-label="Trocar foto"
              >
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
            {avatarPath && (
              <button
                onClick={removeAvatar}
                disabled={uploading}
                className="mt-3 text-[12px] hover:underline"
                style={{ color: C.textSubtle }}
              >
                Remover foto
              </button>
            )}
          </div>

          {/* Fields */}
          <div className="space-y-4">
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.textMuted }}>
                Nome
              </label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Como você quer ser chamado"
                maxLength={60}
                className="w-full h-11 px-3.5 rounded-xl text-[14px] focus:outline-none transition"
                style={{
                  background: C.hover,
                  color: C.text,
                  border: `1px solid ${C.border}`,
                }}
              />
            </div>
            <div>
              <label className="text-[12px] font-medium block mb-1.5" style={{ color: C.textMuted }}>
                Username <span style={{ color: C.textSubtle }}>(opcional)</span>
              </label>
              <div
                className="flex items-center h-11 rounded-xl overflow-hidden"
                style={{ background: C.hover, border: `1px solid ${C.border}` }}
              >
                <span className="pl-3.5 pr-1 text-[14px]" style={{ color: C.textSubtle }}>@</span>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="seu_arroba"
                  maxLength={24}
                  className="flex-1 h-full bg-transparent border-none focus:outline-none text-[14px] pr-3.5"
                  style={{ color: C.text }}
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-[12px] pt-1" style={{ color: C.textSubtle }}>
              <UserIcon className="w-3.5 h-3.5" />
              <span>{user?.email}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-6">
            <button
              onClick={onClose}
              className="flex-1 h-11 rounded-xl text-[14px] font-medium transition"
              style={{ background: C.hover, color: C.text }}
            >
              Cancelar
            </button>
            <button
              onClick={save}
              disabled={saving || loading || uploading}
              className="flex-1 h-11 rounded-xl text-[14px] font-semibold text-white transition active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
              style={{ background: C.accent }}
            >
              {saving && <Loader2 className="w-4 h-4 animate-spin" />}
              {saving ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
