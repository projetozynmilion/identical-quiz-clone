import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LogOut, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import PromptsTab from "@/components/PromptsTab";

export const Route = createFileRoute("/_authenticated/membros")({
  component: MembrosPage,
});

const C = {
  text: "#ffffff",
  textMuted: "rgba(255,255,255,0.6)",
  surface: "#0e0e10",
  border: "rgba(255,255,255,0.08)",
  accent: "#1f6dff",
  bg: "#060606",
};

function MembrosPage() {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  };

  return (
    <div className="min-h-screen text-white relative" style={{ background: C.bg }}>
      <div
        className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1f6dff, transparent 60%)" }}
      />
      <div
        className="absolute top-1/2 -left-40 w-[500px] h-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #1f6dff, transparent 60%)" }}
      />

      <header
        className="sticky top-0 z-40 backdrop-blur-xl border-b"
        style={{ background: "rgba(6,6,6,0.7)", borderColor: C.border }}
      >
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1f6dff, #0044cc)" }}
            >
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-[15px] font-bold tracking-tight">Área VIP</span>
          </div>
          <button
            onClick={handleSignOut}
            className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-xs font-semibold transition hover:opacity-80"
            style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${C.border}`, color: C.text }}
          >
            <LogOut className="w-3.5 h-3.5" />
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-5 py-10 relative z-10">
        <PromptsTab isDark={true} C={C} kind="prompt" />
      </main>
    </div>
  );
}
