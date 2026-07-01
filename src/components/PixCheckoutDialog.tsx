import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Loader2, QrCode, X, ShieldCheck } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
};

type PixResult = {
  paymentId?: string;
  copyPaste?: string;
  qrImage?: string;
  externalRef?: string;
};

const PRICE_LABEL = "R$ 197,90";


export default function PixCheckoutDialog({ open, onClose }: Props) {
  const [step, setStep] = useState<"form" | "pix">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pix, setPix] = useState<PixResult | null>(null);

  const [email, setEmail] = useState("");

  useEffect(() => {
    if (!open) {
      setStep("form");
      setPix(null);
      setError(null);
      setCopied(false);
      setLoading(false);
      setEmail("");
    }
  }, [open]);

  const qrImgSrc = useMemo(() => {
    if (!pix?.qrImage) return null;
    if (pix.qrImage.startsWith("data:") || pix.qrImage.startsWith("http")) return pix.qrImage;
    return `data:image/png;base64,${pix.qrImage}`;
  }, [pix]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setError("E-mail inválido.");

    setLoading(true);
    try {
      const r = await fetch("/api/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        setError(
          data?.error === "invalid_email"
            ? "E-mail inválido."
            : data?.error === "missing_api_key"
              ? "Pagamento indisponível. Contate o suporte."
              : "Não foi possível gerar o Pix. Tente novamente.",
        );
        return;
      }
      if (!data.copyPaste && !data.qrImage) {
        setError("O provedor não retornou o código Pix. Tente novamente.");
        return;
      }
      setPix({
        paymentId: data.paymentId,
        copyPaste: data.copyPaste,
        qrImage: data.qrImage,
        externalRef: data.externalRef,
      });
      setStep("pix");
    } catch (err) {
      console.error(err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }


  async function copyPix() {
    if (!pix?.copyPaste) return;
    try {
      await navigator.clipboard.writeText(pix.copyPaste);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-md max-h-[92vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl bg-[var(--ink)] border border-white/10 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white z-10"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-2 text-[var(--flame-2)]">
            <QrCode className="w-4 h-4" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em]">Pagamento via Pix</span>
          </div>
          <h2 className="mt-2 font-display text-[26px] sm:text-[30px] text-white leading-tight">
            Mentoria Fábrica de UGC
          </h2>
          <p className="text-white/60 text-[13px] mt-1">
            Acesso liberado automaticamente após a confirmação do Pix.
          </p>

          <div className="mt-5 p-4 rounded-2xl bg-gradient-to-br from-[var(--flame)]/15 to-transparent border border-[var(--flame)]/30 flex items-baseline gap-2">
            <span className="text-white/50 line-through text-[13px]">R$ 1.497</span>
            <span className="font-display text-[32px] text-[var(--flame)]">{PRICE_LABEL}</span>
            <span className="text-white/60 text-[12px]">à vista no Pix</span>
          </div>

          {step === "form" && (
            <form onSubmit={handleSubmit} className="mt-6 space-y-3">
              <Field
                label="Nome completo"
                value={name}
                onChange={setName}
                placeholder="Seu nome"
                autoComplete="name"
              />
              <Field
                label="E-mail (receberá o acesso)"
                type="email"
                value={email}
                onChange={setEmail}
                placeholder="voce@email.com"
                autoComplete="email"
              />
              <Field
                label="CPF"
                value={cpf}
                onChange={(v) => setCpf(maskCpf(v))}
                placeholder="000.000.000-00"
                inputMode="numeric"
              />
              <Field
                label="WhatsApp (opcional)"
                value={phone}
                onChange={(v) => setPhone(maskPhone(v))}
                placeholder="(11) 99999-9999"
                inputMode="tel"
              />

              {error && (
                <div className="text-[13px] text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl p-3">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 rounded-full bg-[var(--flame)] text-black font-black text-[15px] hover:brightness-110 active:scale-[0.98] transition disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Gerando Pix...
                  </>
                ) : (
                  <>Gerar Pix de {PRICE_LABEL}</>
                )}
              </button>

              <p className="text-center text-[11px] text-white/40 flex items-center justify-center gap-1.5 pt-1">
                <ShieldCheck className="w-3 h-3" /> Ambiente seguro · Confirmação automática
              </p>
            </form>
          )}

          {step === "pix" && pix && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-white flex items-center justify-center">
                {qrImgSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={qrImgSrc} alt="QR Code Pix" className="w-56 h-56" />
                ) : pix.copyPaste ? (
                  <QRCodeSVG value={pix.copyPaste} size={224} level="M" />
                ) : null}
              </div>

              <ol className="text-[13px] text-white/80 space-y-1.5 pl-4 list-decimal">
                <li>Abra o app do seu banco e vá em <b>Pix &gt; Pagar com QR Code</b>.</li>
                <li>Escaneie o código acima <b>ou</b> use "Pix Copia e Cola".</li>
                <li>Após pagar, seu acesso chega no e-mail em segundos.</li>
              </ol>

              {pix.copyPaste && (
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-white/50 font-bold">
                    Pix Copia e Cola
                  </label>
                  <div className="mt-1.5 flex gap-2">
                    <input
                      readOnly
                      value={pix.copyPaste}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-3 text-[12px] text-white/80 font-mono truncate"
                    />
                    <button
                      onClick={copyPix}
                      className="shrink-0 px-4 rounded-xl bg-[var(--flame)] text-black font-bold text-[13px] flex items-center gap-1.5 active:scale-[0.97]"
                    >
                      {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-3 rounded-xl bg-[var(--flame)]/10 border border-[var(--flame)]/25 text-[12.5px] text-white/85">
                <b className="text-white">Aguardando pagamento...</b> Assim que o Pix cair, criamos seu
                login automaticamente e enviamos por e-mail.
              </div>

              <button
                onClick={onClose}
                className="w-full h-12 rounded-full bg-white/10 hover:bg-white/15 text-white font-semibold text-[14px] transition"
              >
                Fechar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email";
}) {
  return (
    <label className="block">
      <span className="text-[11px] uppercase tracking-[0.18em] text-white/50 font-bold">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        className="mt-1.5 w-full h-12 rounded-xl bg-black/40 border border-white/10 focus:border-[var(--flame)]/60 focus:outline-none px-4 text-white text-[14.5px] placeholder:text-white/30"
      />
    </label>
  );
}
