import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/sharkhub")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const secret = process.env.SHARKHUB_WEBHOOK_SECRET;
        const provided =
          request.headers.get("x-webhook-secret") ||
          request.headers.get("x-sharkhub-secret") ||
          request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
          url.searchParams.get("secret");

        if (!secret || !provided || provided !== secret) {
          return new Response(JSON.stringify({ ok: false, error: "unauthorized" }), {
            status: 401,
            headers: { "content-type": "application/json" },
          });
        }

        let payload: any;
        try {
          payload = await request.json();
        } catch {
          return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
            status: 400,
            headers: { "content-type": "application/json" },
          });
        }

        const status = String(
          payload?.status ??
            payload?.payment?.status ??
            payload?.transaction?.status ??
            payload?.data?.status ??
            "",
        ).toUpperCase();

        const paidSet = new Set(["PAID", "APPROVED", "APROVADO", "COMPLETED", "SUCCESS", "CONFIRMED"]);
        if (!paidSet.has(status)) {
          return new Response(
            JSON.stringify({ ok: true, ignored: true, reason: `status=${status}` }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        }

        const payer =
          payload?.payer ??
          payload?.customer ??
          payload?.payment?.payer ??
          payload?.transaction?.payer ??
          payload?.data?.payer ??
          {};

        const email = String(
          payer?.email ?? payload?.email ?? payload?.customer_email ?? "",
        )
          .trim()
          .toLowerCase();

        const fullName = String(
          payer?.name ?? payer?.full_name ?? payload?.name ?? "",
        ).trim();

        if (!email) {
          return new Response(
            JSON.stringify({ ok: false, error: "missing_email" }),
            { status: 400, headers: { "content-type": "application/json" } },
          );
        }

        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        const gen = (n: number) =>
          Array.from(crypto.getRandomValues(new Uint8Array(n)))
            .map((b) => alphabet[b % alphabet.length])
            .join("");
        const password = `${gen(10)}@${gen(2)}`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName || undefined, source: "sharkhub" },
        });

        let userExisted = false;
        let userId = created?.user?.id;

        if (createErr) {
          const msg = createErr.message?.toLowerCase() || "";
          if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
            userExisted = true;
            const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
            userId = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id;
          } else {
            console.error("[sharkhub-webhook] createUser error", createErr);
            return new Response(
              JSON.stringify({ ok: false, error: "create_user_failed", detail: createErr.message }),
              { status: 500, headers: { "content-type": "application/json" } },
            );
          }
        }

        if (userId) {
          await supabaseAdmin
            .from("user_roles")
            .upsert({ user_id: userId, role: "user" }, { onConflict: "user_id,role" });
        }

        return new Response(
          JSON.stringify({
            ok: true,
            email,
            created: !userExisted,
            existed: userExisted,
            password: userExisted ? undefined : password,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },

      GET: async () =>
        new Response(
          JSON.stringify({ ok: true, endpoint: "sharkhub webhook", method: "POST" }),
          { status: 200, headers: { "content-type": "application/json" } },
        ),
    },
  },
});
