import { createFileRoute } from "@tanstack/react-router";

// One-shot bootstrap: creates the fixed admin login adm@gmail.com / batalha1@
// Idempotent — only ever touches that specific email; safe to leave for a bit
// but should be removed once the admin has signed in at least once.
export const Route = createFileRoute("/api/public/bootstrap-adm")({
  server: {
    handlers: {
      GET: async () => handle(),
      POST: async () => handle(),
    },
  },
});

async function handle() {
  const EMAIL = "adm@gmail.com";
  const PASSWORD = "batalha1@";
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    // Look for existing user
    const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => u.email?.toLowerCase() === EMAIL);

    if (existing) {
      // Ensure password + confirmed + admin role
      await supabaseAdmin.auth.admin.updateUserById(existing.id, {
        password: PASSWORD,
        email_confirm: true,
      });
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: existing.id, role: "admin" }, { onConflict: "user_id,role" });
      return Response.json({ ok: true, existed: true });
    }

    const { data: created, error } = await supabaseAdmin.auth.admin.createUser({
      email: EMAIL,
      password: PASSWORD,
      email_confirm: true,
      user_metadata: { full_name: "Admin" },
    });
    if (error) return Response.json({ ok: false, error: error.message }, { status: 500 });

    if (created?.user?.id) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: created.user.id, role: "admin" }, { onConflict: "user_id,role" });
    }
    return Response.json({ ok: true, existed: false });
  } catch (e: any) {
    return Response.json({ ok: false, error: e?.message || String(e) }, { status: 500 });
  }
}
