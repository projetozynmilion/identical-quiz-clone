import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/public/webhooks/ironpay")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const url = new URL(request.url);
        const secret = process.env.IRONPAY_WEBHOOK_SECRET;
        const provided =
          request.headers.get("x-webhook-secret") ||
          request.headers.get("x-ironpay-secret") ||
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

        // Pull status + customer info from common IronPay payload shapes
        const status = String(
          payload?.status ??
            payload?.transaction?.status ??
            payload?.data?.status ??
            "",
        ).toLowerCase();

        const paidStatuses = new Set(["paid", "approved", "aprovado", "completed", "success"]);
        if (!paidStatuses.has(status)) {
          return new Response(
            JSON.stringify({ ok: true, ignored: true, reason: `status=${status}` }),
            { status: 200, headers: { "content-type": "application/json" } },
          );
        }

        const customer =
          payload?.customer ??
          payload?.buyer ??
          payload?.client ??
          payload?.transaction?.customer ??
          payload?.data?.customer ??
          {};

        const email = String(
          customer?.email ?? payload?.email ?? payload?.customer_email ?? "",
        )
          .trim()
          .toLowerCase();

        const fullName = String(
          customer?.name ??
            customer?.full_name ??
            payload?.name ??
            payload?.customer_name ??
            "",
        ).trim();

        if (!email) {
          return new Response(
            JSON.stringify({ ok: false, error: "missing_email", received: Object.keys(payload || {}) }),
            { status: 400, headers: { "content-type": "application/json" } },
          );
        }

        // Generate a memorable-ish password (letters + digits, 12 chars)
        const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
        const gen = (n: number) =>
          Array.from(crypto.getRandomValues(new Uint8Array(n)))
            .map((b) => alphabet[b % alphabet.length])
            .join("");
        const password = `${gen(10)}@${gen(2)}`;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Try to create the user. If it already exists, do nothing (don't reset).
        const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
          user_metadata: { full_name: fullName || undefined, source: "ironpay" },
        });

        let userExisted = false;
        let userId = created?.user?.id;

        if (createErr) {
          const msg = createErr.message?.toLowerCase() || "";
          if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
            userExisted = true;
            // Find the existing user id (paginate first page — enough for typical use)
            const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
            userId = list?.users?.find((u) => u.email?.toLowerCase() === email)?.id;
          } else {
            console.error("[ironpay-webhook] createUser error", createErr);
            return new Response(
              JSON.stringify({ ok: false, error: "create_user_failed", detail: createErr.message }),
              { status: 500, headers: { "content-type": "application/json" } },
            );
          }
        }

        // Ensure 'user' role exists (trigger normally does this; safety net)
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
            // Only return the password when we just created the account — so IronPay/Zapier can email it
            password: userExisted ? undefined : password,
          }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },

      GET: async () => {
        return new Response(
          JSON.stringify({ ok: true, endpoint: "ironpay webhook", method: "POST" }),
          { status: 200, headers: { "content-type": "application/json" } },
        );
      },
    },
  },
});
