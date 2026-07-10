import { useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Loader2, X, ShieldCheck, Mail, Lock } from "lucide-react";


type Props = {
  open: boolean;
  onClose: () => void;
};

type PixResult = {
  paymentId?: string;
  copyPaste?: string;
  qrImage?: string;
  externalRef?: string;
  amountCents?: number;
  couponApplied?: string | null;
};

const DEFAULT_PRICE_LABEL = "R$ 67,90";
const COUPON_PRICE_LABEL = "R$ 147,00";

function formatBRL(cents?: number) {
  if (cents == null) return DEFAULT_PRICE_LABEL;
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}


export default function PixCheckoutDialog({ open, onClose }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [pix, setPix] = useState<PixResult | null>(null);

  const [email, setEmail] = useState("");
  const [emailConfirmed, setEmailConfirmed] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const [coupon, setCoupon] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);
  const [couponSubmitted, setCouponSubmitted] = useState<string | null>(null);

  useEffect(() => {
    if (!open) {
      setPix(null);
      setError(null);
      setCopied(false);
      setLoading(false);
      setCoupon("");
      setShowCoupon(false);
      setCouponSubmitted(null);
      setEmail("");
      setEmailConfirmed(null);
      setEmailError(null);
    }
  }, [open]);

  const previewCents = (couponSubmitted ?? coupon).trim().toLowerCase().replace(/[^a-z0-9]/g, "") === "fabricadeugc"
    ? 14700
    : 6790;
  const previewLabel = formatBRL(pix?.amountCents ?? previewCents);

  const qrImgSrc = useMemo(() => {
    if (!pix?.qrImage) return null;
    if (pix.qrImage.startsWith("data:") || pix.qrImage.startsWith("http")) return pix.qrImage;
    return `data:image/png;base64,${pix.qrImage}`;
  }, [pix]);

  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

  async function generatePix(couponCode?: string, emailOverride?: string) {
    setError(null);
    setLoading(true);
    try {
      const r = await fetch("/api/create-pix", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coupon: couponCode?.trim() || undefined,
          email: (emailOverride ?? emailConfirmed ?? "").trim() || undefined,
        }),
      });
      const data = await r.json();
      if (!r.ok || !data?.ok) {
        const map: Record<string, string> = {
          missing_api_key: "Pagamento indisponível. Contate o suporte.",
          invalid_coupon: "Cupom inválido.",
          coupon_exhausted: "Cupom esgotado — as 5 vagas já foram usadas.",
          coupon_check_failed: "Não foi possível validar o cupom. Tente novamente.",
        };
        setError(map[data?.error] ?? "Não foi possível gerar o Pix. Tente novamente.");
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
        amountCents: data.amountCents,
        couponApplied: data.couponApplied,
      });
      if (couponCode) setCouponSubmitted(couponCode);
    } catch (err) {
      console.error(err);
      setError("Erro de rede. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  function confirmEmail() {
    const v = email.trim().toLowerCase();
    if (!isValidEmail(v)) {
      setEmailError("Digite um e-mail válido pra receber seu acesso.");
      return;
    }
    setEmailError(null);
    setEmailConfirmed(v);
    void generatePix(undefined, v);
  }


  // Auto-generate only after the buyer confirmed their email
  useEffect(() => {
    if (open && emailConfirmed && !pix && !loading && !error) {
      void generatePix(undefined, emailConfirmed);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, emailConfirmed]);


  async function applyCoupon() {
    if (!coupon.trim()) return;
    setPix(null);
    await generatePix(coupon);
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
      <div className="absolute inset-0 bg-black/85 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:max-w-[420px] max-h-[94vh] overflow-y-auto rounded-t-[2.25rem] sm:rounded-[2.25rem] bg-[#0f0f0f] border border-white/[0.06] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        {/* glow radial */}
        <div className="pointer-events-none absolute -top-32 -right-24 w-72 h-72 bg-[var(--flame)] blur-[120px] opacity-[0.12]" />

        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white z-10 transition-colors"
          aria-label="Fechar"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-7 sm:p-8 relative">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--flame)]/10 border border-[var(--flame)]/25">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--flame)] animate-pulse" />
            <span className="text-[10px] font-black tracking-[0.22em] text-[var(--flame)] uppercase">
              Pagamento via Pix
            </span>
          </div>

          <h2 className="mt-4 font-display text-[27px] sm:text-[30px] text-white leading-[1.05] tracking-tight">
            Mentoria Fábrica de UGC
          </h2>
          <p className="text-white/55 text-[13px] mt-2 leading-relaxed">
            Escaneie o QR Code ou copie o código abaixo pra pagar.
          </p>

          {/* Price */}
          <div className="mt-6 p-5 rounded-3xl bg-gradient-to-br from-white/[0.04] to-transparent border border-white/[0.08] relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-[var(--flame)] blur-[70px] opacity-[0.14]" />
            <div className="relative flex items-center gap-3 flex-wrap">
              <span className="text-white/40 line-through text-[13px] font-medium">
                {previewCents === 14700 ? "R$ 197,90" : "R$ 197,90"}
              </span>
              <div className="flex flex-col">
                <span className="font-display text-[34px] leading-none text-[var(--flame)] tracking-tight">
                  {previewLabel}
                </span>
                <span className="text-[10px] text-white/50 font-bold uppercase tracking-[0.2em] mt-1.5">
                  {previewCents === 14700 ? "cupom FABRICADEUGC aplicado" : "à vista no Pix"}
                </span>
              </div>
            </div>
          </div>

          {!emailConfirmed && !pix && (
            <div className="mt-6 space-y-4">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--flame)]/10 to-transparent border border-[var(--flame)]/25 flex gap-3 items-start">
                <ShieldCheck className="w-5 h-5 text-[var(--flame)] shrink-0 mt-0.5" />
                <div className="text-[12.5px] text-white/85 leading-snug">
                  <b className="text-white">Seu acesso vai pra este e-mail</b> assim que o Pix cair.
                  Confirme certinho — é por onde você vai receber login e senha.
                </div>
              </div>

              <label className="block">
                <span className="text-[10px] font-black uppercase tracking-[0.22em] text-white/60 ml-1 flex items-center gap-1.5">
                  <Mail className="w-3 h-3" /> Seu melhor e-mail
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(null); }}
                  onKeyDown={(e) => { if (e.key === "Enter") confirmEmail(); }}
                  placeholder="voce@email.com"
                  autoComplete="email"
                  inputMode="email"
                  className="mt-2 w-full h-13 py-3 rounded-2xl bg-[#151515] border border-white/10 focus:border-[var(--flame)]/50 focus:outline-none px-4 text-white text-[15px] placeholder:text-white/30"
                />
                {emailError && (
                  <span className="mt-2 block text-[12px] text-red-300">{emailError}</span>
                )}
              </label>

              <button
                onClick={confirmEmail}
                className="w-full h-13 py-3.5 rounded-full bg-[var(--flame)] text-white font-black text-[14px] tracking-wide hover:brightness-110 active:scale-[0.98] transition shadow-[0_10px_30px_-8px_rgba(10,132,255,0.6)] flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" /> Gerar Pix seguro
              </button>

              <div className="flex items-center justify-center gap-4 text-[10.5px] text-white/45 pt-1">
                <span className="inline-flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Compra 100% segura</span>
                <span>·</span>
                <span>Ambiente criptografado</span>
              </div>
            </div>
          )}

          {loading && !pix && emailConfirmed && (
            <div className="mt-8 flex flex-col items-center justify-center gap-3 py-10">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--flame)]" />
              <p className="text-[13px] text-white/60">Gerando seu Pix...</p>
            </div>
          )}


          {error && !pix && (
            <div className="mt-6 space-y-3">
              <div className="text-[13px] text-red-300 bg-red-500/10 border border-red-500/25 rounded-xl p-3">
                {error}
              </div>
              <button
                onClick={() => generatePix(couponSubmitted ?? undefined)}
                className="w-full h-12 rounded-full bg-[var(--flame)] text-black font-black text-[13.5px] tracking-wide hover:brightness-110 active:scale-[0.98] transition"
              >
                Tentar novamente
              </button>
            </div>
          )}


          {pix && (
            <div className="mt-7 space-y-6">
              {/* QR card */}
              <div className="relative">
                <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-[var(--flame)]/40 to-transparent blur-lg opacity-40" />
                <div className="relative p-5 rounded-[2rem] bg-white shadow-[0_30px_60px_-12px_rgba(0,0,0,0.6)] flex items-center justify-center">
                  {qrImgSrc ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={qrImgSrc} alt="QR Code Pix" className="w-60 h-60" />
                  ) : pix.copyPaste ? (
                    <QRCodeSVG value={pix.copyPaste} size={240} level="M" />
                  ) : null}
                </div>
              </div>

              {/* Steps */}
              <div className="space-y-4">
                {[
                  <>Abra o app do seu banco e vá em <strong className="text-white font-semibold">Pix &gt; Pagar com QR Code</strong>.</>,
                  <>Escaneie o código acima <strong className="text-white font-semibold">ou</strong> use "Pix Copia e Cola".</>,
                  <>Após pagar, seu acesso é liberado <strong className="text-[var(--flame)]">em segundos</strong>.</>,
                ].map((txt, i) => (
                  <div key={i} className="flex gap-3.5 items-start">
                    <div className="flex-shrink-0 w-7 h-7 rounded-xl bg-[var(--flame)]/10 border border-[var(--flame)]/25 flex items-center justify-center text-[11px] font-black text-[var(--flame)]">
                      {i + 1}
                    </div>
                    <p className="text-[13.5px] text-white/75 leading-snug pt-1">{txt}</p>
                  </div>
                ))}
              </div>

              {/* Copy paste */}
              {pix.copyPaste && (
                <div>
                  <label className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 ml-1">
                    Pix Copia e Cola
                  </label>
                  <div className="mt-2 flex items-center gap-2 p-1.5 bg-[#151515] rounded-2xl border border-white/[0.08] focus-within:border-[var(--flame)]/40 transition-colors">
                    <input
                      readOnly
                      value={pix.copyPaste}
                      onFocus={(e) => e.currentTarget.select()}
                      className="flex-1 bg-transparent px-3 py-3 text-[12px] text-white/70 font-mono truncate outline-none"
                    />
                    <button
                      onClick={copyPix}
                      className="shrink-0 h-11 px-5 rounded-[1rem] bg-[var(--flame)] text-black font-black text-[12px] uppercase tracking-wider flex items-center gap-1.5 active:scale-[0.96] transition shadow-[0_10px_20px_-6px_rgba(31, 109, 255,0.5)]"
                    >
                      {copied ? <><Check className="w-4 h-4" /> Copiado</> : <><Copy className="w-4 h-4" /> Copiar</>}
                    </button>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-gradient-to-br from-[var(--flame)]/12 to-transparent border border-[var(--flame)]/25 text-[12.5px] text-white/85 flex gap-3 items-start">
                <span className="mt-1 w-2 h-2 rounded-full bg-[var(--flame)] animate-pulse flex-shrink-0" />
                <div>
                  <b className="text-white">Aguardando pagamento...</b> Assim que o Pix cair, seu acesso vai automático pro seu e-mail.
                </div>
              </div>

              <a
                href="https://wa.me/message/UXJDQTRJZPNQE1"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full h-13 py-3.5 rounded-full font-black text-[13.5px] tracking-wide active:scale-[0.98] transition flex items-center justify-center gap-2 shadow-[0_10px_30px_-8px_rgba(37,211,102,0.7)]"
                style={{ background: "#25D366", color: "#FFFFFF" }}
              >
                <svg viewBox="0 0 32 32" className="w-5 h-5" aria-hidden="true">
                  <path fill="#FFFFFF" d="M16.003 3.2C8.94 3.2 3.2 8.94 3.2 16c0 2.253.593 4.457 1.717 6.398L3.2 28.8l6.552-1.687A12.77 12.77 0 0 0 16.003 28.8C23.06 28.8 28.8 23.06 28.8 16S23.06 3.2 16.003 3.2Zm5.79 15.655c-.317-.16-1.877-.926-2.168-1.033-.291-.107-.503-.16-.715.16-.212.318-.82 1.033-1.006 1.246-.185.212-.371.238-.688.08-.317-.16-1.34-.494-2.552-1.575-.943-.84-1.58-1.879-1.766-2.196-.185-.318-.02-.49.14-.647.144-.143.317-.371.476-.557.16-.185.212-.318.318-.53.106-.212.053-.398-.027-.557-.08-.16-.715-1.723-.98-2.36-.258-.62-.52-.535-.716-.545l-.61-.011c-.212 0-.556.08-.847.398-.291.318-1.112 1.086-1.112 2.65 0 1.564 1.138 3.075 1.297 3.288.16.212 2.24 3.42 5.428 4.797.759.328 1.35.523 1.813.67.762.242 1.455.208 2.003.126.611-.091 1.877-.767 2.142-1.508.265-.741.265-1.376.185-1.508-.08-.132-.291-.212-.608-.371Z"/>
                </svg>
                Já paguei — me chamar no WhatsApp
              </a>

              <p className="text-[11.5px] text-white/50 text-center leading-relaxed -mt-2">
                Após o pagamento, me chame no WhatsApp pra liberar seu acesso mais rápido 🔥
              </p>

              <button
                onClick={onClose}
                className="w-full h-12 rounded-full bg-white/[0.06] hover:bg-white/10 border border-white/10 text-white/80 font-semibold text-[13.5px] transition"
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
