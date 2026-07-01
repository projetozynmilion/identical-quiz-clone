import { createFileRoute } from "@tanstack/react-router";

const SHARKHUB_URL = "https://api.sharkhubsubadquirente.com/v1/payment";
const AMOUNT_CENTS = 19790; // R$ 197,90

function onlyDigits(s: string) {
  return (s || "").replace(/\D/g, "");
}
function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
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

        const name = String(body?.name || "").trim();
        const email = String(body?.email || "").trim().toLowerCase();
        const taxId = onlyDigits(String(body?.taxId || ""));
        const phone = onlyDigits(String(body?.phone || ""));

        if (name.length < 3) return Response.json({ ok: false, error: "invalid_name" }, { status: 400 });
        if (!isEmail(email)) return Response.json({ ok: false, error: "invalid_email" }, { status: 400 });
        if (taxId.length !== 11 && taxId.length !== 14)
          return Response.json({ ok: false, error: "invalid_taxId" }, { status: 400 });

        const origin = new URL(request.url).origin;
        const notificationUrl = `${origin}/api/public/webhooks/sharkhub${
          webhookSecret ? `?secret=${encodeURIComponent(webhookSecret)}` : ""
        }`;

        const externalRef = `fgc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

        const payload = {
          amount: AMOUNT_CENTS,
          currency: "BRL",
          method: "PIX",
          description: "Fábrica de UGC - Mentoria",
          externalRef,
          notificationUrl,
          payer: {
            name,
            taxId,
            email,
            phone: phone || undefined,
          },
          items: [
            {
              quantity: 1,
              name: "Fábrica de UGC - Mentoria",
              price: AMOUNT_CENTS,
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

        // Try to normalize common field shapes from providers
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
          "pixCopyPaste",
          "copyPaste",
          "qrCode",
          "pix.qrcode",
          "pix.copyPaste",
          "pix.emv",
          "payment.pixCopyPaste",
          "payment.qrCode",
          "data.pixCopyPaste",
          "data.qrCode",
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

        return Response.json({
          ok: true,
          paymentId,
          copyPaste,
          qrImage,
          externalRef,
          raw: data,
        });
      },
    },
  },
});
