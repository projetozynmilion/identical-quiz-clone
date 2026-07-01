import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

// Simple, easy-to-share password: Aluno + 4 digits + !
function generateEasyPassword() {
  const buf = crypto.getRandomValues(new Uint8Array(4));
  const digits = Array.from(buf).map((b) => b % 10).join("");
  return `Aluno${digits}!`;
}

function normalizeEmail(input: string) {
  let email = input.trim().toLowerCase();
  if (!email) return "";
  if (!email.includes("@")) {
    email = `${email.replace(/[^a-z0-9._-]/g, "")}@aluno.fgc`;
  }
  return email;
}

export const createStudentLogin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    z.object({
      email: z.string().min(1),
      fullName: z.string().optional(),
      password: z.string().optional(),
    }),
  )
  .handler(async ({ data, context }) => {
    // must be admin
    const { data: isAdmin, error: roleErr } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (roleErr || !isAdmin) {
      throw new Error("Forbidden");
    }

    const email = normalizeEmail(data.email);
    if (!email || !email.includes("@")) {
      throw new Error("E-mail inválido");
    }

    const password = data.password?.trim() || generateEasyPassword();
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { full_name: data.fullName || undefined, source: "admin" },
    });

    if (createErr) {
      const msg = createErr.message?.toLowerCase() || "";
      if (msg.includes("already") || msg.includes("registered") || msg.includes("exists")) {
        // reset password on existing user so admin can share fresh creds
        const { data: list } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = list?.users?.find((u) => u.email?.toLowerCase() === email);
        if (!existing) throw new Error("Usuário existe mas não foi encontrado");
        await supabaseAdmin.auth.admin.updateUserById(existing.id, {
          password,
          email_confirm: true,
        });
        await supabaseAdmin
          .from("user_roles")
          .upsert({ user_id: existing.id, role: "user" }, { onConflict: "user_id,role" });
        return { ok: true, email, password, existed: true };
      }
      throw new Error(createErr.message);
    }

    if (created?.user?.id) {
      await supabaseAdmin
        .from("user_roles")
        .upsert({ user_id: created.user.id, role: "user" }, { onConflict: "user_id,role" });
    }

    return { ok: true, email, password, existed: false };
  });
