import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { UserPlus, Copy, RefreshCw, Check } from "lucide-react";
import { createStudentLogin } from "@/lib/admin-users.functions";

type Generated = { email: string; password: string; existed: boolean };

export default function AdminStudentsPanel({ C }: { C: any }) {
  const createLogin = useServerFn(createStudentLogin);
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");
  const [customPassword, setCustomPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<Generated[]>([]);
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const submit = async () => {
    if (!email.trim()) { toast.error("Informe o e-mail"); return; }
    setLoading(true);
    try {
      const res = await createLogin({
        data: {
          email: email.trim(),
          fullName: fullName.trim() || undefined,
          password: customPassword.trim() || undefined,
        },
      });
      const item: Generated = { email: res.email, password: res.password, existed: res.existed };
      setHistory((h) => [item, ...h]);
      toast.success(res.existed ? "Senha redefinida" : "Login criado");
      setEmail(""); setFullName(""); setCustomPassword("");
    } catch (e: any) {
      toast.error(e?.message || "Falha ao criar login");
    } finally {
      setLoading(false);
    }
  };

  const copyCred = async (idx: number, item: Generated) => {
    const text = `E-mail: ${item.email}\nSenha: ${item.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIdx(idx);
      toast.success("Copiado!");
      setTimeout(() => setCopiedIdx(null), 1500);
    } catch {
      toast.error("Não foi possível copiar");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-5 sm:p-6 space-y-4" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        <div className="flex items-center gap-2">
          <UserPlus className="w-4 h-4" style={{ color: C.accent }} />
          <h2 className="text-base font-bold" style={{ color: C.text }}>Gerar login de aluno</h2>
        </div>
        <p className="text-xs" style={{ color: C.textMuted }}>
          Digite o e-mail do cliente. A senha é gerada automaticamente (fácil: <code>Aluno1234!</code>). Você pode definir uma senha própria se quiser.
        </p>

        <div className="grid gap-3 sm:grid-cols-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@exemplo.com"
            className="h-11 rounded-xl px-3 text-sm outline-none"
            style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.text }}
          />
          <input
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nome (opcional)"
            className="h-11 rounded-xl px-3 text-sm outline-none"
            style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.text }}
          />
          <input
            value={customPassword}
            onChange={(e) => setCustomPassword(e.target.value)}
            placeholder="Senha personalizada (opcional)"
            className="h-11 rounded-xl px-3 text-sm outline-none sm:col-span-2"
            style={{ background: C.hover, border: `1px solid ${C.border}`, color: C.text }}
          />
        </div>

        <button
          onClick={submit}
          disabled={loading}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-xl text-sm font-semibold disabled:opacity-60"
          style={{ background: C.accent, color: "#fff" }}
        >
          {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
          {loading ? "Gerando..." : "Gerar login"}
        </button>
      </div>

      {history.length > 0 && (
        <div className="rounded-3xl p-5 sm:p-6 space-y-3" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
          <h3 className="text-sm font-bold" style={{ color: C.text }}>Logins gerados nesta sessão</h3>
          <p className="text-[11px]" style={{ color: C.textMuted }}>
            Copie e envie ao aluno agora — a senha não fica salva depois que você sair.
          </p>
          <div className="space-y-2">
            {history.map((it, idx) => (
              <div key={idx} className="rounded-xl p-3 flex items-center justify-between gap-3" style={{ background: C.hover, border: `1px solid ${C.border}` }}>
                <div className="min-w-0">
                  <div className="text-sm font-semibold truncate" style={{ color: C.text }}>{it.email}</div>
                  <div className="text-xs font-mono truncate" style={{ color: C.textMuted }}>
                    Senha: <span style={{ color: C.text }}>{it.password}</span>
                    {it.existed && <span className="ml-2 text-[10px] uppercase" style={{ color: C.accent }}>senha redefinida</span>}
                  </div>
                </div>
                <button
                  onClick={() => copyCred(idx, it)}
                  className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold shrink-0"
                  style={{ background: C.accent, color: "#fff" }}
                >
                  {copiedIdx === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIdx === idx ? "Copiado" : "Copiar"}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
