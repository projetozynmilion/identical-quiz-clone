import { useState, lazy, Suspense } from "react";
import { Crosshair, LayoutDashboard, Wand2, Gift, Settings as SettingsIcon, Sparkles, UserPlus } from "lucide-react";

const AdminRadarPanel = lazy(() => import("@/components/AdminRadarPanel"));
const AdminPromptsPanel = lazy(() => import("@/components/admin/AdminPromptsPanel"));
const AdminBonusesPanel = lazy(() => import("@/components/admin/AdminBonusesPanel"));
const AdminSettingsPanel = lazy(() => import("@/components/admin/AdminSettingsPanel"));
const AdminStudentsPanel = lazy(() => import("@/components/admin/AdminStudentsPanel"));

type TabKey = "modules" | "radar" | "prompts" | "hooks" | "bonuses" | "students" | "settings";

export default function AdminTabs({ C, modulesNode }: { C: any; modulesNode: React.ReactNode }) {
  const [tab, setTab] = useState<TabKey>("modules");
  const tabs: { id: TabKey; label: string; icon: any }[] = [
    { id: "modules", label: "Módulos", icon: LayoutDashboard },
    { id: "radar", label: "Radar TikShop", icon: Crosshair },
    { id: "prompts", label: "Prompts", icon: Wand2 },
    { id: "hooks", label: "Ganchos", icon: Sparkles },
    { id: "bonuses", label: "Bônus / IAs", icon: Gift },
    { id: "students", label: "Alunos", icon: UserPlus },
    { id: "settings", label: "Configurações", icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-2xl p-1.5 flex flex-wrap gap-1 overflow-x-auto" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="inline-flex items-center gap-2 px-4 h-10 rounded-xl text-[13px] font-semibold whitespace-nowrap transition"
              style={active
                ? { background: C.accent, color: "#fff" }
                : { color: C.textMuted, background: "transparent" }}
            >
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      <Suspense fallback={<div className="h-40 rounded-3xl animate-pulse" style={{ background: C.hover }} />}>
        {tab === "modules" && modulesNode}
        {tab === "radar" && <AdminRadarPanel C={C} />}
        {tab === "prompts" && <AdminPromptsPanel C={C} kind="prompt" />}
        {tab === "hooks" && <AdminPromptsPanel C={C} kind="hook" />}
        {tab === "bonuses" && <AdminBonusesPanel C={C} />}
        {tab === "students" && <AdminStudentsPanel C={C} />}
        {tab === "settings" && <AdminSettingsPanel C={C} />}
      </Suspense>
    </div>
  );
}
