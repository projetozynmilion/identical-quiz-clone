import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveAvatarUrl } from "@/lib/avatarUrl";
import { Trophy, Heart, Plus, Crown, Medal, Sparkles, Flame, TrendingUp, X, Loader2 } from "lucide-react";
import { toast } from "sonner";

type Palette = Record<string, string>;
type Props = {
  user: { id: string; email?: string | null } | null;
  isAdmin: boolean;
  isDark: boolean;
  C: Palette;
};

type Profile = { id: string; full_name: string | null; username: string | null; avatar_url: string | null };
type Badge = { id: string; slug: string; name: string; description: string | null; emoji: string; rarity: string; criteria: string | null; position: number };
type UserBadge = { id: string; user_id: string; badge_id: string; earned_at: string };
type Victory = { id: string; user_id: string; victory_type: string; title: string; description: string | null; media_url: string | null; amount: number | null; views_count: number | null; created_at: string };

const RARITY: Record<string, { label: string; ring: string; text: string }> = {
  common: { label: "Comum", ring: "#9ca3af", text: "#9ca3af" },
  rare: { label: "Raro", ring: "#3b82f6", text: "#60a5fa" },
  epic: { label: "Épico", ring: "#a855f7", text: "#c084fc" },
  legendary: { label: "Lendário", ring: "#f59e0b", text: "#fbbf24" },
};

function fmtBRL(n: number) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);
}
function fmtViews(n: number) {
  if (!n) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
function timeAgo(iso: string) {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "agora";
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}

export default function Conquistas({ user, isAdmin, isDark, C }: Props) {
  const [tab, setTab] = useState<"leaderboard" | "galeria" | "badges">("leaderboard");
  const [victories, setVictories] = useState<Victory[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [avatars, setAvatars] = useState<Record<string, string | null>>({});
  const [badges, setBadges] = useState<Badge[]>([]);
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [loading, setLoading] = useState(true);
  const [showPost, setShowPost] = useState(false);

  // Load everything
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      const sb = supabase as any;
      const [vRes, bRes, ubRes] = await Promise.all([
        sb.from("victories").select("*").order("created_at", { ascending: false }).limit(100),
        sb.from("badges").select("*").order("position", { ascending: true }),
        sb.from("user_badges").select("*"),
      ]);
      if (!alive) return;
      const v: Victory[] = vRes.data || [];
      const b: Badge[] = bRes.data || [];
      const ub: UserBadge[] = ubRes.data || [];
      setVictories(v);
      setBadges(b);
      setUserBadges(ub);

      // profiles
      const ids = Array.from(new Set([...v.map((x) => x.user_id), ...ub.map((x) => x.user_id)]));
      if (ids.length) {
        const { data: profs } = await supabase.from("profiles").select("id,full_name,username,avatar_url").in("id", ids);
        const map: Record<string, Profile> = {};
        for (const p of profs || []) map[p.id] = p as Profile;
        setProfiles(map);
        // resolve avatars
        const avMap: Record<string, string | null> = {};
        await Promise.all(
          (profs || []).map(async (p: any) => {
            avMap[p.id] = await resolveAvatarUrl(p.avatar_url);
          }),
        );
        if (alive) setAvatars(avMap);
      }

      // likes
      if (v.length) {
        const ids2 = v.map((x) => x.id);
        const { data: lk } = await sb.from("victory_likes").select("victory_id,user_id").in("victory_id", ids2);
        const agg: Record<string, { count: number; mine: boolean }> = {};
        for (const id of ids2) agg[id] = { count: 0, mine: false };
        for (const r of lk || []) {
          agg[r.victory_id].count += 1;
          if (user && r.user_id === user.id) agg[r.victory_id].mine = true;
        }
        if (alive) setLikes(agg);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [user?.id]);

  // Leaderboard ranks by total sales amount across last 30 days
  const ranking = useMemo(() => {
    const since = Date.now() - 30 * 86400_000;
    const agg = new Map<string, { user_id: string; amount: number; viral: number; total: number }>();
    for (const v of victories) {
      if (new Date(v.created_at).getTime() < since) continue;
      const cur = agg.get(v.user_id) || { user_id: v.user_id, amount: 0, viral: 0, total: 0 };
      cur.total += 1;
      if (v.victory_type === "sale") cur.amount += Number(v.amount || 0);
      if (v.victory_type === "viral") cur.viral += 1;
      agg.set(v.user_id, cur);
    }
    return Array.from(agg.values()).sort((a, b) => b.amount - a.amount || b.viral - a.viral).slice(0, 20);
  }, [victories]);

  async function toggleLike(victoryId: string) {
    if (!user) return toast.error("Entre para curtir");
    const sb = supabase as any;
    const mine = likes[victoryId]?.mine;
    setLikes((s) => ({ ...s, [victoryId]: { count: (s[victoryId]?.count || 0) + (mine ? -1 : 1), mine: !mine } }));
    if (mine) {
      await sb.from("victory_likes").delete().eq("victory_id", victoryId).eq("user_id", user.id);
    } else {
      await sb.from("victory_likes").insert({ victory_id: victoryId, user_id: user.id });
    }
  }

  async function handlePost(form: { type: string; title: string; description: string; media_url: string; amount: string; views: string }): Promise<void> {
    if (!user) { toast.error("Entre para postar"); return; }
    const sb = supabase as any;
    const payload = {
      user_id: user.id,
      victory_type: form.type,
      title: form.title,
      description: form.description || null,
      media_url: form.media_url || null,
      amount: form.amount ? Number(form.amount.replace(",", ".")) : 0,
      views_count: form.views ? Number(form.views) : 0,
    };
    const { data, error } = await sb.from("victories").insert(payload).select().single();
    if (error) return toast.error(error.message);
    setVictories((v) => [data as Victory, ...v]);
    setLikes((s) => ({ ...s, [data.id]: { count: 0, mine: false } }));
    toast.success("Vitória publicada! 🔥");
    setShowPost(false);
  }

  return (
    <div className="w-full animate-in fade-in duration-300 max-w-6xl">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
        <div>
          <h1 className="text-[32px] sm:text-[40px] font-semibold tracking-[-0.02em] flex items-center gap-3">
            <Trophy className="w-8 h-8" style={{ color: "#fbbf24" }} />
            Conquistas
          </h1>
          <p className="text-[15px] mt-2" style={{ color: C.textMuted }}>
            Ranking, vitórias da galera e medalhas pra colecionar.
          </p>
        </div>
        <button
          onClick={() => setShowPost(true)}
          className="inline-flex items-center gap-2 h-11 px-5 rounded-full text-[14px] font-semibold transition-transform hover:scale-[1.02]"
          style={{ background: "linear-gradient(135deg,#ff7a00,#ff4500)", color: "#fff" }}
        >
          <Plus className="w-4 h-4" /> Postar vitória
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-full mb-6 w-fit" style={{ background: C.hover }}>
        {[
          { id: "leaderboard", label: "Leaderboard", icon: Crown },
          { id: "galeria", label: "Galeria de Vitórias", icon: Sparkles },
          { id: "badges", label: "Medalhas", icon: Medal },
        ].map((t) => {
          const active = tab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id as any)}
              className="inline-flex items-center gap-2 h-9 px-4 rounded-full text-[13px] font-semibold transition-colors"
              style={{
                background: active ? C.surface : "transparent",
                color: active ? C.text : C.textMuted,
                boxShadow: active ? `0 1px 0 ${C.border} inset` : undefined,
              }}
            >
              <Icon className="w-4 h-4" /> {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: C.textMuted }} />
        </div>
      ) : tab === "leaderboard" ? (
        <LeaderboardView ranking={ranking} profiles={profiles} avatars={avatars} C={C} currentUserId={user?.id} />
      ) : tab === "galeria" ? (
        <GaleriaView victories={victories} profiles={profiles} avatars={avatars} likes={likes} onLike={toggleLike} C={C} />
      ) : (
        <BadgesView badges={badges} userBadges={userBadges} profiles={profiles} avatars={avatars} C={C} currentUserId={user?.id} />
      )}

      {showPost && user && (
        <PostVictoryDialog onClose={() => setShowPost(false)} onSubmit={handlePost} C={C} isDark={isDark} />
      )}
    </div>
  );
}

/* ============== LEADERBOARD ============== */
function LeaderboardView({
  ranking,
  profiles,
  avatars,
  C,
  currentUserId,
}: {
  ranking: { user_id: string; amount: number; viral: number; total: number }[];
  profiles: Record<string, Profile>;
  avatars: Record<string, string | null>;
  C: Palette;
  currentUserId?: string;
}) {
  if (!ranking.length) {
    return <EmptyState C={C} icon={Crown} title="Ranking vazio" desc="Seja o primeiro a postar uma vitória e liderar o mês!" />;
  }
  const podium = ranking.slice(0, 3);
  const rest = ranking.slice(3);

  return (
    <div className="space-y-6">
      {/* Pódio */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {[1, 0, 2].map((idx) => {
          const r = podium[idx];
          if (!r) return <div key={idx} />;
          const p = profiles[r.user_id];
          const pos = idx + 1;
          const heights = ["sm:pt-8", "", "sm:pt-12"];
          const colors = ["#fbbf24", "#cbd5e1", "#d97706"];
          const labels = ["🥇", "🥈", "🥉"];
          return (
            <div key={r.user_id} className={`text-center ${heights[idx]}`}>
              <div
                className="rounded-2xl p-4 sm:p-5"
                style={{
                  background: C.surface,
                  border: `1px solid ${C.border}`,
                  boxShadow: idx === 0 ? `0 0 30px -10px ${colors[idx]}80` : undefined,
                }}
              >
                <div className="text-2xl sm:text-3xl mb-1">{labels[idx]}</div>
                <Avatar url={avatars[r.user_id]} name={p?.full_name || p?.username || "Aluno"} size={64} ring={colors[idx]} />
                <div className="mt-3 text-[13px] sm:text-[14px] font-semibold truncate">{p?.full_name || p?.username || "Aluno"}</div>
                <div className="text-[16px] sm:text-[20px] font-bold mt-1" style={{ color: colors[idx] }}>
                  {fmtBRL(r.amount)}
                </div>
                <div className="text-[11px] mt-1" style={{ color: C.textMuted }}>
                  {r.viral} virais · {r.total} posts
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Restante */}
      <div className="rounded-2xl overflow-hidden" style={{ background: C.surface, border: `1px solid ${C.border}` }}>
        {rest.map((r, i) => {
          const p = profiles[r.user_id];
          const isMe = r.user_id === currentUserId;
          return (
            <div
              key={r.user_id}
              className="flex items-center gap-3 p-3 sm:p-4"
              style={{ borderTop: i === 0 ? "none" : `1px solid ${C.border}`, background: isMe ? `${C.hover}` : "transparent" }}
            >
              <div className="w-7 text-center text-[14px] font-bold" style={{ color: C.textMuted }}>
                {i + 4}
              </div>
              <Avatar url={avatars[r.user_id]} name={p?.full_name || "Aluno"} size={40} />
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-semibold truncate">
                  {p?.full_name || p?.username || "Aluno"} {isMe && <span className="text-[11px] ml-1 opacity-60">(você)</span>}
                </div>
                <div className="text-[12px]" style={{ color: C.textMuted }}>
                  {r.viral} virais · {r.total} posts
                </div>
              </div>
              <div className="text-[14px] font-bold" style={{ color: "#fbbf24" }}>
                {fmtBRL(r.amount)}
              </div>
            </div>
          );
        })}
      </div>
      <p className="text-[12px] text-center" style={{ color: C.textMuted }}>
        Ranking dos últimos 30 dias · atualizado em tempo real
      </p>
    </div>
  );
}

/* ============== GALERIA ============== */
function GaleriaView({
  victories,
  profiles,
  avatars,
  likes,
  onLike,
  C,
}: {
  victories: Victory[];
  profiles: Record<string, Profile>;
  avatars: Record<string, string | null>;
  likes: Record<string, { count: number; mine: boolean }>;
  onLike: (id: string) => void;
  C: Palette;
}) {
  if (!victories.length) {
    return <EmptyState C={C} icon={Sparkles} title="Sem vitórias ainda" desc="Posta a sua e abre o caminho pra galera!" />;
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {victories.map((v) => {
        const p = profiles[v.user_id];
        const lk = likes[v.id] || { count: 0, mine: false };
        const typeMeta =
          v.victory_type === "sale"
            ? { label: "Venda", color: "#22c55e", icon: TrendingUp }
            : v.victory_type === "viral"
              ? { label: "Viral", color: "#ef4444", icon: Flame }
              : { label: "Marco", color: "#a855f7", icon: Sparkles };
        const Icon = typeMeta.icon;
        return (
          <div
            key={v.id}
            className="rounded-2xl overflow-hidden flex flex-col"
            style={{ background: C.surface, border: `1px solid ${C.border}` }}
          >
            {v.media_url && (
              <div className="aspect-video w-full bg-black/30 overflow-hidden">
                {/\.(mp4|webm|mov)$/i.test(v.media_url) ? (
                  <video src={v.media_url} className="w-full h-full object-cover" controls playsInline />
                ) : (
                  <img src={v.media_url} alt={v.title} className="w-full h-full object-cover" loading="lazy" />
                )}
              </div>
            )}
            <div className="p-4 flex flex-col gap-3 flex-1">
              <div className="flex items-center gap-2">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold"
                  style={{ background: `${typeMeta.color}20`, color: typeMeta.color }}
                >
                  <Icon className="w-3 h-3" /> {typeMeta.label}
                </span>
                {v.victory_type === "sale" && !!v.amount && (
                  <span className="text-[13px] font-bold" style={{ color: "#22c55e" }}>
                    {fmtBRL(Number(v.amount))}
                  </span>
                )}
                {v.victory_type === "viral" && !!v.views_count && (
                  <span className="text-[13px] font-bold" style={{ color: "#ef4444" }}>
                    {fmtViews(Number(v.views_count))} views
                  </span>
                )}
                <span className="ml-auto text-[11px]" style={{ color: C.textMuted }}>
                  {timeAgo(v.created_at)}
                </span>
              </div>
              <h3 className="text-[15px] font-semibold leading-snug">{v.title}</h3>
              {v.description && (
                <p className="text-[13px] line-clamp-3" style={{ color: C.textMuted }}>
                  {v.description}
                </p>
              )}
              <div className="flex items-center justify-between pt-2 mt-auto" style={{ borderTop: `1px solid ${C.border}` }}>
                <div className="flex items-center gap-2 min-w-0">
                  <Avatar url={avatars[v.user_id]} name={p?.full_name || "Aluno"} size={28} />
                  <span className="text-[12px] truncate">{p?.full_name || p?.username || "Aluno"}</span>
                </div>
                <button
                  onClick={() => onLike(v.id)}
                  className="inline-flex items-center gap-1 text-[12px] font-semibold transition-colors"
                  style={{ color: lk.mine ? "#ef4444" : C.textMuted }}
                >
                  <Heart className="w-4 h-4" fill={lk.mine ? "#ef4444" : "none"} /> {lk.count}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ============== BADGES ============== */
function BadgesView({
  badges,
  userBadges,
  profiles,
  avatars,
  C,
  currentUserId,
}: {
  badges: Badge[];
  userBadges: UserBadge[];
  profiles: Record<string, Profile>;
  avatars: Record<string, string | null>;
  C: Palette;
  currentUserId?: string;
}) {
  const byBadge = useMemo(() => {
    const map: Record<string, UserBadge[]> = {};
    for (const ub of userBadges) (map[ub.badge_id] ||= []).push(ub);
    return map;
  }, [userBadges]);
  const myBadges = useMemo(() => new Set(userBadges.filter((u) => u.user_id === currentUserId).map((u) => u.badge_id)), [userBadges, currentUserId]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {badges.map((b) => {
        const rarity = RARITY[b.rarity] || RARITY.common;
        const earned = myBadges.has(b.id);
        const owners = byBadge[b.id] || [];
        return (
          <div
            key={b.id}
            className="rounded-2xl p-5 flex flex-col items-center text-center transition-transform hover:scale-[1.02]"
            style={{
              background: C.surface,
              border: `1px solid ${earned ? rarity.ring : C.border}`,
              opacity: earned ? 1 : 0.7,
              boxShadow: earned ? `0 0 30px -12px ${rarity.ring}80` : undefined,
            }}
          >
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-3"
              style={{
                background: earned ? `${rarity.ring}25` : C.hover,
                border: `2px solid ${earned ? rarity.ring : C.border}`,
                filter: earned ? "none" : "grayscale(0.6)",
              }}
            >
              {b.emoji}
            </div>
            <div className="text-[13px] font-bold leading-tight">{b.name}</div>
            <div className="text-[10px] uppercase tracking-wider mt-1 font-semibold" style={{ color: rarity.text }}>
              {rarity.label}
            </div>
            {b.description && (
              <p className="text-[11px] mt-2 line-clamp-2" style={{ color: C.textMuted }}>
                {b.description}
              </p>
            )}
            <div className="text-[10px] mt-3" style={{ color: C.textMuted }}>
              {owners.length} {owners.length === 1 ? "aluno tem" : "alunos têm"}
            </div>
            {earned && (
              <div className="text-[10px] mt-1 font-semibold" style={{ color: rarity.ring }}>
                ✓ Conquistada
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ============== DIALOG ============== */
function PostVictoryDialog({
  onClose,
  onSubmit,
  C,
  isDark,
}: {
  onClose: () => void;
  onSubmit: (f: { type: string; title: string; description: string; media_url: string; amount: string; views: string }) => Promise<void>;
  C: Palette;
  isDark: boolean;
}) {
  const [type, setType] = useState("sale");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media_url, setMedia] = useState("");
  const [amount, setAmount] = useState("");
  const [views, setViews] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.65)" }} onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl p-6 max-h-[90vh] overflow-y-auto"
        style={{ background: C.surface, border: `1px solid ${C.border}` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[20px] font-semibold">Postar vitória</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-white/5">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-[12px] font-semibold block mb-2" style={{ color: C.textMuted }}>Tipo</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "sale", label: "Venda", icon: TrendingUp, color: "#22c55e" },
                { id: "viral", label: "Viral", icon: Flame, color: "#ef4444" },
                { id: "milestone", label: "Marco", icon: Sparkles, color: "#a855f7" },
              ].map((t) => {
                const Icon = t.icon;
                const active = type === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setType(t.id)}
                    className="h-12 rounded-xl text-[13px] font-semibold inline-flex items-center justify-center gap-1.5 transition-colors"
                    style={{
                      background: active ? `${t.color}20` : C.hover,
                      color: active ? t.color : C.text,
                      border: `1px solid ${active ? t.color : C.border}`,
                    }}
                  >
                    <Icon className="w-4 h-4" /> {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          <Field label="Título" C={C}>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: Bati R$3k em 48h"
              className="w-full h-11 px-3 rounded-xl text-[14px] outline-none"
              style={{ background: isDark ? "#0f0f12" : "#fff", border: `1px solid ${C.border}`, color: C.text }} />
          </Field>

          <Field label="Descrição (opcional)" C={C}>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} placeholder="Conta o que fez pra chegar lá..."
              className="w-full px-3 py-2 rounded-xl text-[14px] outline-none resize-none"
              style={{ background: isDark ? "#0f0f12" : "#fff", border: `1px solid ${C.border}`, color: C.text }} />
          </Field>

          <Field label="Link da mídia (print/vídeo) — opcional" C={C}>
            <input value={media_url} onChange={(e) => setMedia(e.target.value)} placeholder="https://..."
              className="w-full h-11 px-3 rounded-xl text-[14px] outline-none"
              style={{ background: isDark ? "#0f0f12" : "#fff", border: `1px solid ${C.border}`, color: C.text }} />
          </Field>

          {type === "sale" && (
            <Field label="Valor em R$" C={C}>
              <input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0,00" inputMode="decimal"
                className="w-full h-11 px-3 rounded-xl text-[14px] outline-none"
                style={{ background: isDark ? "#0f0f12" : "#fff", border: `1px solid ${C.border}`, color: C.text }} />
            </Field>
          )}
          {type === "viral" && (
            <Field label="Views" C={C}>
              <input value={views} onChange={(e) => setViews(e.target.value.replace(/\D/g, ""))} placeholder="100000" inputMode="numeric"
                className="w-full h-11 px-3 rounded-xl text-[14px] outline-none"
                style={{ background: isDark ? "#0f0f12" : "#fff", border: `1px solid ${C.border}`, color: C.text }} />
            </Field>
          )}

          <button
            disabled={!title.trim() || busy}
            onClick={async () => {
              setBusy(true);
              try { await onSubmit({ type, title, description, media_url, amount, views }); }
              finally { setBusy(false); }
            }}
            className="w-full h-12 rounded-full font-semibold text-[14px] inline-flex items-center justify-center gap-2 disabled:opacity-50"
            style={{ background: "linear-gradient(135deg,#ff7a00,#ff4500)", color: "#fff" }}
          >
            {busy && <Loader2 className="w-4 h-4 animate-spin" />}
            Publicar vitória
          </button>
        </div>
      </div>
    </div>
  );
}

/* ============== Helpers ============== */
function Field({ label, children, C }: { label: string; children: React.ReactNode; C: Palette }) {
  return (
    <div>
      <label className="text-[12px] font-semibold block mb-2" style={{ color: C.textMuted }}>{label}</label>
      {children}
    </div>
  );
}

function Avatar({ url, name, size = 40, ring }: { url?: string | null; name: string; size?: number; ring?: string }) {
  const initials = (name || "?").split(" ").slice(0, 2).map((s) => s[0]).join("").toUpperCase();
  return (
    <div
      className="rounded-full inline-flex items-center justify-center font-semibold text-white shrink-0"
      style={{
        width: size,
        height: size,
        fontSize: size * 0.36,
        background: url ? `url(${url}) center/cover` : "linear-gradient(135deg,#ff7a00,#ff4500)",
        border: ring ? `3px solid ${ring}` : undefined,
      }}
    >
      {!url && initials}
    </div>
  );
}

function EmptyState({ C, icon: Icon, title, desc }: { C: Palette; icon: any; title: string; desc: string }) {
  return (
    <div className="text-center py-16 rounded-2xl" style={{ background: C.surface, border: `1px dashed ${C.border}` }}>
      <Icon className="w-12 h-12 mx-auto mb-4 opacity-40" />
      <div className="text-[16px] font-semibold">{title}</div>
      <div className="text-[13px] mt-1" style={{ color: C.textMuted }}>{desc}</div>
    </div>
  );
}
