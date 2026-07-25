import { createFileRoute } from "@tanstack/react-router";

const SHARKHUB_URL = "https://api.sharkhubsubadquirente.com/v1/payment";
const DEFAULT_AMOUNT_CENTS = 6790; // R$ 67,90 (básico mensal)
const VIP_AMOUNT_CENTS = 19790; // R$ 197,90 (vitalício)
const COUPON_CODE = "fabricadeugc";
const COUPON_AMOUNT_CENTS = 14700; // R$ 147,00
const COUPON_MAX_USES = 5;

const PLANS = {
  basic: { amount: DEFAULT_AMOUNT_CENTS, name: "Prompts Virais - Básico Mensal (100 prompts)" },
  vip: { amount: VIP_AMOUNT_CENTS, name: "Prompts Virais - VIP Vitalício (+1.000 prompts)" },
} as const;
type PlanKey = keyof typeof PLANS;

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}
function normalizeCoupon(s: string) {
  return (s || "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

export const Route = createFileRoute("/api/create-pix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const apiKey = process.env.SHARKHUB_API_KEY;
        const webhookSecret = process.env.SHARKHUB_WEBHOOK_SECRET;
        if (!apiKey) {
          return Response.json({ ok: false, error: "missing_api_key" }, { status: 500 });
        }

        let body: any;
        try {
          body = await request.json();
        } catch {
          return Response.json({ ok: false, error: "invalid_json" }, { status: 400 });
        }

        let email = String(body?.email || "").trim().toLowerCase();
        if (!isEmail(email)) {
          email = `guest_${Date.now()}_${Math.random().toString(36).slice(2, 8)}@fabricadeugc.online`;
        }

        const couponRaw = String(body?.coupon || "").trim();
        const couponNorm = normalizeCoupon(couponRaw);
        let amountCents = DEFAULT_AMOUNT_CENTS;
        let couponApplied: string | null = null;

        if (couponRaw) {
          if (couponNorm !== COUPON_CODE) {
            return Response.json({ ok: false, error: "invalid_coupon" }, { status: 400 });
          }
          // check remaining uses
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            const { count, error: countErr } = await supabaseAdmin
              .from("coupon_uses")
              .select("*", { count: "exact", head: true })
              .eq("code", COUPON_CODE);
            if (countErr) {
              console.error("[create-pix] coupon count error", countErr);
              return Response.json({ ok: false, error: "coupon_check_failed" }, { status: 500 });
            }
            if ((count ?? 0) >= COUPON_MAX_USES) {
              return Response.json({ ok: false, error: "coupon_exhausted" }, { status: 400 });
            }
            amountCents = COUPON_AMOUNT_CENTS;
            couponApplied = COUPON_CODE;
          } catch (e) {
            console.error("[create-pix] coupon check exception", e);
            return Response.json({ ok: false, error: "coupon_check_failed" }, { status: 500 });
          }
        }

        const localPart = email.split("@")[0].replace(/[._-]+/g, " ").trim();
        const name = (localPart.length >= 3 ? localPart : "Aluno FGC")
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");

        const taxId = "00000000191";

        const origin = new URL(request.url).origin;
        const notificationUrl = `${origin}/api/public/webhooks/sharkhub${
          webhookSecret ? `?secret=${encodeURIComponent(webhookSecret)}` : ""
        }`;

        const externalRef = `fgc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const payload = {
          amount: amountCents,
          currency: "BRL",
          method: "PIX",
          description: couponApplied
            ? "Fábrica de UGC - Mentoria (cupom FABRICADEUGC)"
            : "Fábrica de UGC - Mentoria",
          externalRef,
          notificationUrl,
          payer: { name, taxId, email },
          items: [
            {
              quantity: 1,
              name: "Fábrica de UGC - Mentoria",
              price: amountCents,
              type: "DIGITAL",
            },
          ],
        };

        let upstream: Response;
        try {
          upstream = await fetch(SHARKHUB_URL, {
            method: "POST",
            headers: {
              Authorization: `Bearer ${apiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          });
        } catch (err: any) {
          console.error("[create-pix] fetch failed", err);
          return Response.json({ ok: false, error: "gateway_unreachable" }, { status: 502 });
        }

        const raw = await upstream.text();
        let data: any = null;
        try {
          data = raw ? JSON.parse(raw) : null;
        } catch {
          data = { raw };
        }

        if (!upstream.ok) {
          console.error("[create-pix] upstream error", upstream.status, raw);
          return Response.json(
            { ok: false, error: "gateway_error", status: upstream.status, detail: data },
            { status: 502 },
          );
        }

        const pick = (obj: any, keys: string[]): string | undefined => {
          for (const k of keys) {
            const parts = k.split(".");
            let v: any = obj;
            for (const p of parts) v = v?.[p];
            if (typeof v === "string" && v) return v;
          }
          return undefined;
        };

        const copyPaste = pick(data, [
          "data.copypaste",
          "data.copyPaste",
          "pixCopyPaste",
          "copyPaste",
          "qrCode",
          "pix.qrcode",
          "pix.copyPaste",
          "pix.emv",
          "payment.pixCopyPaste",
          "payment.qrCode",
        ]);
        const qrImage = pick(data, [
          "qrCodeBase64",
          "qrCodeImage",
          "qrCodeUrl",
          "pix.qrcodeBase64",
          "pix.qrCodeBase64",
          "pix.image",
          "payment.qrCodeBase64",
          "data.qrCodeBase64",
        ]);
        const paymentId = pick(data, ["id", "paymentId", "payment.id", "data.id"]);

        // Register coupon use AFTER successful pix creation (best-effort)
        if (couponApplied) {
          try {
            const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
            await supabaseAdmin.from("coupon_uses").insert({
              code: couponApplied,
              email,
              external_ref: externalRef,
            });
          } catch (e) {
            console.error("[create-pix] failed to log coupon use", e);
          }
        }

        return Response.json({
          ok: true,
          paymentId,
          copyPaste,
          qrImage,
          externalRef,
          amountCents,
          couponApplied,
          raw: data,
        });
      },
    },
  },
});
