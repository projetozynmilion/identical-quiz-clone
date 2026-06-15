import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import {
  Heart,
  MessageCircle,
  Bookmark,
  Pin,
  Copy,
  Send,
  Image as ImageIcon,
  Video as VideoIcon,
  Wand2,
  Radio,
  Trash2,
  Plus,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  MoreHorizontal,
} from "lucide-react";

const BUCKET = "community-media";
const SIGN_TTL = 60 * 60;
const MAX_FILE = 25 * 1024 * 1024;

const signedCache = new Map<string, { url: string; exp: number }>();
async function signPath(path: string): Promise<string | null> {
  const now = Date.now();
  const cached = signedCache.get(path);
  if (cached && cached.exp > now + 60_000) return cached.url;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGN_TTL);
  if (!data?.signedUrl) return null;
  signedCache.set(path, { url: data.signedUrl, exp: now + SIGN_TTL * 1000 });
  return data.signedUrl;
}

type PostType = "text" | "image" | "video" | "prompt" | "live";

type Post = {
  id: string;
  author_id: string;
  post_type: PostType;
  content: string | null;
  image_urls: string[];
  video_url: string | null;
  prompt_text: string | null;
  live_url: string | null;
  live_at: string | null;
  is_pinned: boolean;
  created_at: string;
};

type Profile = { full_name: string | null; avatar_url: string | null };

type Comment = {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  created_at: string;
};

const ADMIN_NAME = "Fábrica de UGC";
const ADMIN_AVATAR_FALLBACK =
  "https://api.dicebear.com/9.x/initials/svg?seed=Fabrica%20UGC&backgroundColor=ff7a00";

function timeAgo(iso: string) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d`;
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" });
}

function ytId(url: string): string | null {
  try {
    const u = new URL(url);
    if (u.hostname.includes("youtu.be")) return u.pathname.slice(1) || null;
    if (u.hostname.includes("youtube.com")) {
      if (u.pathname === "/watch") return u.searchParams.get("v");
      if (u.pathname.startsWith("/embed/")) return u.pathname.split("/")[2] || null;
      if (u.pathname.startsWith("/shorts/")) return u.pathname.split("/")[2] || null;
    }
  } catch {}
  return null;
}

export default function CommunityFeed({
  user,
  isAdmin,
  isDark,
  C,
}: {
  user: { id: string } | null;
  isAdmin: boolean;
  isDark: boolean;
  C: any;
}) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [saves, setSaves] = useState<Record<string, boolean>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [composerOpen, setComposerOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "image" | "video" | "prompt" | "live" | "saved">("all");
  const [loading, setLoading] = useState(true);

  // Load
  const reload = async () => {
    setLoading(true);
    const { data: postsData } = await supabase
      .from("community_posts")
      .select("*")
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(100);
    const list = (postsData ?? []) as Post[];
    setPosts(list);

    const authorIds = Array.from(new Set(list.map((p) => p.author_id)));
    if (authorIds.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", authorIds);
      const map: Record<string, Profile> = {};
      (profs ?? []).forEach((p: any) => {
        map[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url };
      });
      setProfiles(map);
    }

    const ids = list.map((p) => p.id);
    if (ids.length) {
      const [{ data: likeRows }, { data: saveRows }, { data: commentRows }] = await Promise.all([
        supabase.from("community_post_likes").select("post_id, user_id").in("post_id", ids),
        user
          ? supabase
              .from("community_post_saves")
              .select("post_id")
              .eq("user_id", user.id)
              .in("post_id", ids)
          : Promise.resolve({ data: [] as any[] }),
        supabase.from("community_post_comments").select("post_id").in("post_id", ids),
      ]);
      const lk: Record<string, { count: number; mine: boolean }> = {};
      (likeRows ?? []).forEach((r: any) => {
        const cur = lk[r.post_id] ?? { count: 0, mine: false };
        cur.count += 1;
        if (user && r.user_id === user.id) cur.mine = true;
        lk[r.post_id] = cur;
      });
      setLikes(lk);
      const sv: Record<string, boolean> = {};
      (saveRows ?? []).forEach((r: any) => { sv[r.post_id] = true; });
      setSaves(sv);
      const cc: Record<string, number> = {};
      (commentRows ?? []).forEach((r: any) => { cc[r.post_id] = (cc[r.post_id] ?? 0) + 1; });
      setCommentCounts(cc);
    }
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    const ch = supabase
      .channel("community_feed")
      .on("postgres_changes", { event: "*", schema: "public", table: "community_posts" }, () => {
        void reload();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "community_post_likes" }, () => {
        void reload();
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "community_post_comments" }, () => {
        void reload();
      })
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Actions
  const toggleLike = async (postId: string) => {
    if (!user) return;
    const current = likes[postId];
    if (current?.mine) {
      setLikes((p) => ({ ...p, [postId]: { count: Math.max(0, (p[postId]?.count ?? 1) - 1), mine: false } }));
      await supabase.from("community_post_likes").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      setLikes((p) => ({ ...p, [postId]: { count: (p[postId]?.count ?? 0) + 1, mine: true } }));
      await supabase.from("community_post_likes").insert({ post_id: postId, user_id: user.id });
    }
  };

  const toggleSave = async (postId: string) => {
    if (!user) return;
    if (saves[postId]) {
      setSaves((p) => ({ ...p, [postId]: false }));
      await supabase.from("community_post_saves").delete().eq("post_id", postId).eq("user_id", user.id);
    } else {
      setSaves((p) => ({ ...p, [postId]: true }));
      await supabase.from("community_post_saves").insert({ post_id: postId, user_id: user.id });
      toast.success("Salvo");
    }
  };

  const togglePin = async (postId: string, current: boolean) => {
    await supabase.from("community_posts").update({ is_pinned: !current }).eq("id", postId);
    toast.success(!current ? "Post fixado" : "Desafixado");
    void reload();
  };

  const deletePost = async (postId: string) => {
    if (!confirm("Apagar este post?")) return;
    await supabase.from("community_posts").delete().eq("id", postId);
    toast.success("Post apagado");
    void reload();
  };

  const loadComments = async (postId: string) => {
    const { data } = await supabase
      .from("community_post_comments")
      .select("*")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    setComments((p) => ({ ...p, [postId]: (data ?? []) as Comment[] }));
    const ids = Array.from(new Set((data ?? []).map((c: any) => c.user_id)));
    const missing = ids.filter((id) => !profiles[id]);
    if (missing.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name, avatar_url")
        .in("id", missing);
      if (profs) {
        setProfiles((prev) => {
          const next = { ...prev };
          profs.forEach((p: any) => { next[p.id] = { full_name: p.full_name, avatar_url: p.avatar_url }; });
          return next;
        });
      }
    }
  };

  const openCommentsToggle = (postId: string) => {
    const willOpen = !openComments[postId];
    setOpenComments((p) => ({ ...p, [postId]: willOpen }));
    if (willOpen && !comments[postId]) void loadComments(postId);
  };

  const filtered = posts.filter((p) => {
    if (filter === "all") return true;
    if (filter === "saved") return !!saves[p.id];
    return p.post_type === filter;
  });

  const livePosts = posts.filter(
    (p) => p.post_type === "live" && p.live_at && new Date(p.live_at).getTime() > Date.now() - 2 * 3600 * 1000
  );
  const upcomingLive = livePosts.sort(
    (a, b) => new Date(a.live_at!).getTime() - new Date(b.live_at!).getTime()
  )[0];

  return (
    <div className="space-y-4">
      {/* HEADER */}
      <div
        className="rounded-3xl p-5 sm:p-6 relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1a0a04 0%, #2a0f00 50%, #0a0a0a 100%)",
          border: `1px solid ${C.border}`,
        }}
      >
        <div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-40 blur-3xl pointer-events-none"
          style={{ background: "radial-gradient(circle, #ff7a00, transparent)" }}
        />
        <div className="relative flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0"
              style={{ background: "linear-gradient(135deg, #ff7a00, #ff2d00)" }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-[18px] sm:text-[22px] leading-tight">
                Comunidade Fábrica UGC
              </div>
              <div className="text-white/60 text-[12px] sm:text-[13px]">
                Feed oficial · prompts, lives e avisos exclusivos
              </div>
            </div>
          </div>
          {isAdmin && (
            <button
              onClick={() => setComposerOpen(true)}
              className="h-10 px-4 rounded-xl font-semibold text-[13px] flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: "#fff", color: "#1a0a04" }}
            >
              <Plus className="w-4 h-4" /> Novo post
            </button>
          )}
        </div>

        {upcomingLive && (
          <div className="mt-4 relative">
            <LiveBanner post={upcomingLive} />
          </div>
        )}
      </div>

      {/* FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { id: "all", label: "Tudo", icon: Sparkles },
          { id: "image", label: "Imagens", icon: ImageIcon },
          { id: "video", label: "Vídeos", icon: VideoIcon },
          { id: "prompt", label: "Prompts", icon: Wand2 },
          { id: "live", label: "Lives", icon: Radio },
          { id: "saved", label: "Salvos", icon: Bookmark },
        ].map((f) => {
          const active = filter === f.id;
          const Icon = f.icon;
          return (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className="h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap shrink-0"
              style={{
                background: active ? C.accent : isDark ? "#101013" : "#fff",
                color: active ? "#fff" : C.text,
                border: `1px solid ${active ? C.accent : C.border}`,
              }}
            >
              <Icon className="w-3.5 h-3.5" /> {f.label}
            </button>
          );
        })}
      </div>

      {/* FEED */}
      {loading ? (
        <div className="text-center py-12 text-sm" style={{ color: C.textMuted }}>Carregando feed…</div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-3xl p-10 text-center"
          style={{ background: isDark ? "#101013" : "#fff", border: `1px solid ${C.border}` }}
        >
          <div className="text-4xl mb-3">📭</div>
          <div className="font-semibold" style={{ color: C.text }}>
            {filter === "saved" ? "Você ainda não salvou nada" : "Nenhum post por aqui ainda"}
          </div>
          <div className="text-[13px] mt-1" style={{ color: C.textMuted }}>
            {isAdmin ? "Publique o primeiro post da comunidade." : "Aguarde — em breve novidades exclusivas."}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => (
            <PostCard
              key={p.id}
              post={p}
              author={profiles[p.author_id]}
              isAdmin={isAdmin}
              isDark={isDark}
              C={C}
              like={likes[p.id]}
              saved={!!saves[p.id]}
              commentCount={commentCounts[p.id] ?? 0}
              commentsOpen={!!openComments[p.id]}
              comments={comments[p.id] ?? []}
              profiles={profiles}
              currentUserId={user?.id ?? null}
              onLike={() => toggleLike(p.id)}
              onSave={() => toggleSave(p.id)}
              onTogglePin={() => togglePin(p.id, p.is_pinned)}
              onDelete={() => deletePost(p.id)}
              onToggleComments={() => openCommentsToggle(p.id)}
              onComment={async (text) => {
                if (!user) return;
                await supabase.from("community_post_comments").insert({
                  post_id: p.id,
                  user_id: user.id,
                  content: text,
                });
                await loadComments(p.id);
                setCommentCounts((cc) => ({ ...cc, [p.id]: (cc[p.id] ?? 0) + 1 }));
              }}
              onDeleteComment={async (cid) => {
                await supabase.from("community_post_comments").delete().eq("id", cid);
                await loadComments(p.id);
                setCommentCounts((cc) => ({ ...cc, [p.id]: Math.max(0, (cc[p.id] ?? 1) - 1) }));
              }}
            />
          ))}
        </div>
      )}

      {composerOpen && isAdmin && user && (
        <Composer
          isDark={isDark}
          C={C}
          userId={user.id}
          onClose={() => setComposerOpen(false)}
          onCreated={() => {
            setComposerOpen(false);
            void reload();
          }}
        />
      )}
    </div>
  );
}

// ============ LIVE BANNER ============
function LiveBanner({ post }: { post: Post }) {
  const liveDate = new Date(post.live_at!);
  const isLive = Math.abs(Date.now() - liveDate.getTime()) < 2 * 3600 * 1000 && Date.now() >= liveDate.getTime();
  return (
    <a
      href={post.live_url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between gap-3 p-3 rounded-2xl transition-all hover:scale-[1.01]"
      style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)" }}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="relative shrink-0">
          <div className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{ background: isLive ? "#ff2d00" : "rgba(255,122,0,0.2)" }}>
            <Radio className="w-5 h-5 text-white" />
          </div>
          {isLive && (
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 animate-ping" />
          )}
        </div>
        <div className="min-w-0">
          <div className="text-white font-bold text-[13px] flex items-center gap-2">
            {isLive ? "🔴 AO VIVO AGORA" : "Próxima live"}
          </div>
          <div className="text-white/70 text-[12px] truncate">
            {post.content || "Live exclusiva"} ·{" "}
            {liveDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })} ·{" "}
            {liveDate.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
          </div>
        </div>
      </div>
      <ExternalLink className="w-4 h-4 text-white/70 shrink-0" />
    </a>
  );
}

// ============ POST CARD ============
function PostCard({
  post,
  author,
  isAdmin,
  isDark,
  C,
  like,
  saved,
  commentCount,
  commentsOpen,
  comments,
  profiles,
  currentUserId,
  onLike,
  onSave,
  onTogglePin,
  onDelete,
  onToggleComments,
  onComment,
  onDeleteComment,
}: {
  post: Post;
  author?: Profile;
  isAdmin: boolean;
  isDark: boolean;
  C: any;
  like?: { count: number; mine: boolean };
  saved: boolean;
  commentCount: number;
  commentsOpen: boolean;
  comments: Comment[];
  profiles: Record<string, Profile>;
  currentUserId: string | null;
  onLike: () => void;
  onSave: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onToggleComments: () => void;
  onComment: (text: string) => Promise<void>;
  onDeleteComment: (cid: string) => Promise<void>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const isNew = Date.now() - new Date(post.created_at).getTime() < 24 * 3600 * 1000;
  const displayName = ADMIN_NAME;
  const avatar = author?.avatar_url || ADMIN_AVATAR_FALLBACK;

  return (
    <article
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: isDark ? "#101013" : "#fff",
        border: `1px solid ${post.is_pinned ? C.accent : C.border}`,
        boxShadow: post.is_pinned ? `0 0 0 1px ${C.accent}33` : "none",
      }}
    >
      {post.is_pinned && (
        <div
          className="absolute top-0 right-0 px-2.5 py-1 text-[10px] font-bold flex items-center gap-1 rounded-bl-xl"
          style={{ background: C.accent, color: "#fff" }}
        >
          <Pin className="w-3 h-3" /> FIXADO
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <img src={avatar} alt={displayName} className="w-10 h-10 rounded-full object-cover shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-[14px] truncate" style={{ color: C.text }}>{displayName}</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full"
              style={{ background: "#1d9bf0" }}>
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                <path d="M5 12l5 5L20 7" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
            {isNew && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                style={{ background: C.accent, color: "#fff" }}>NOVO</span>
            )}
          </div>
          <div className="text-[11px]" style={{ color: C.textMuted }}>{timeAgo(post.created_at)}</div>
        </div>
        {isAdmin && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ color: C.textMuted }}
              aria-label="Mais opções"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 rounded-xl overflow-hidden z-10 min-w-[160px]"
                style={{
                  background: isDark ? "#1a1a1f" : "#fff",
                  border: `1px solid ${C.border}`,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <button
                  onClick={() => { setMenuOpen(false); onTogglePin(); }}
                  className="w-full px-3 py-2 text-left text-[13px] flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: C.text }}
                >
                  <Pin className="w-4 h-4" /> {post.is_pinned ? "Desafixar" : "Fixar no topo"}
                </button>
                <button
                  onClick={() => { setMenuOpen(false); onDelete(); }}
                  className="w-full px-3 py-2 text-left text-[13px] flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                  style={{ color: "#ef4444" }}
                >
                  <Trash2 className="w-4 h-4" /> Apagar
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* CONTENT */}
      {post.content && (
        <div className="px-4 pb-3 text-[14px] leading-relaxed whitespace-pre-wrap" style={{ color: C.text }}>
          <ReactMarkdown
            components={{
              a: ({ node, ...props }) => (
                <a {...props} target="_blank" rel="noopener noreferrer" style={{ color: C.accent, textDecoration: "underline" }} />
              ),
              p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />,
            }}
          >
            {post.content}
          </ReactMarkdown>
        </div>
      )}

      {/* MEDIA */}
      {post.post_type === "image" && post.image_urls.length > 0 && (
        <ImageGallery paths={post.image_urls} />
      )}

      {post.post_type === "video" && post.video_url && (
        <VideoBlock url={post.video_url} />
      )}

      {post.post_type === "prompt" && post.prompt_text && (
        <PromptBlock text={post.prompt_text} isDark={isDark} C={C} />
      )}

      {post.post_type === "live" && (
        <LiveCard post={post} isDark={isDark} C={C} />
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-1 px-2 py-2 border-t" style={{ borderColor: C.border }}>
        <button
          onClick={onLike}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
        >
          <Heart
            className="w-5 h-5 transition-all"
            fill={like?.mine ? "#ff2d55" : "none"}
            stroke={like?.mine ? "#ff2d55" : C.text}
          />
          <span className="text-[13px] font-semibold tabular-nums" style={{ color: like?.mine ? "#ff2d55" : C.text }}>
            {like?.count ?? 0}
          </span>
        </button>
        <button
          onClick={onToggleComments}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
          style={{ color: C.text }}
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-[13px] font-semibold tabular-nums">{commentCount}</span>
        </button>
        <div className="flex-1" />
        <button
          onClick={onSave}
          className="w-10 h-10 flex items-center justify-center rounded-full transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
          aria-label="Salvar"
        >
          <Bookmark
            className="w-5 h-5"
            fill={saved ? C.accent : "none"}
            stroke={saved ? C.accent : C.text}
          />
        </button>
      </div>

      {/* COMMENTS */}
      {commentsOpen && (
        <div className="border-t px-4 py-3 space-y-3" style={{ borderColor: C.border, background: isDark ? "#0a0a0d" : "#fafafa" }}>
          {comments.length === 0 && (
            <div className="text-[12px] text-center py-2" style={{ color: C.textMuted }}>
              Seja o primeiro a comentar
            </div>
          )}
          {comments.map((c) => {
            const prof = profiles[c.user_id];
            const name = prof?.full_name || "Aluno";
            const av = prof?.avatar_url || `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(name)}`;
            const canDelete = isAdmin || c.user_id === currentUserId;
            return (
              <div key={c.id} className="flex gap-2.5 group">
                <img src={av} alt={name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <div
                    className="rounded-2xl px-3 py-2"
                    style={{ background: isDark ? "#1a1a1f" : "#fff", border: `1px solid ${C.border}` }}
                  >
                    <div className="text-[12px] font-semibold" style={{ color: C.text }}>{name}</div>
                    <div className="text-[13px] whitespace-pre-wrap break-words" style={{ color: C.text }}>{c.content}</div>
                  </div>
                  <div className="text-[10px] mt-0.5 px-2 flex items-center gap-2" style={{ color: C.textMuted }}>
                    {timeAgo(c.created_at)}
                    {canDelete && (
                      <button
                        onClick={() => onDeleteComment(c.id)}
                        className="opacity-0 group-hover:opacity-100 hover:underline transition-opacity"
                      >
                        Apagar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {currentUserId && (
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const t = commentText.trim();
                if (!t) return;
                setCommentText("");
                await onComment(t);
              }}
              className="flex items-center gap-2 pt-1"
            >
              <input
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Comentar…"
                maxLength={1000}
                className="flex-1 h-10 px-4 rounded-full text-[13px] focus:outline-none"
                style={{
                  background: isDark ? "#1a1a1f" : "#fff",
                  border: `1px solid ${C.border}`,
                  color: C.text,
                }}
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-40 transition-all active:scale-95"
                style={{ background: C.accent, color: "#fff" }}
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      )}
    </article>
  );
}

// ============ MEDIA ============
function ImageGallery({ paths }: { paths: string[] }) {
  const [urls, setUrls] = useState<(string | null)[]>([]);
  const [index, setIndex] = useState(0);
  useEffect(() => {
    let cancelled = false;
    Promise.all(paths.map((p) => signPath(p))).then((res) => { if (!cancelled) setUrls(res); });
    return () => { cancelled = true; };
  }, [paths]);
  if (paths.length === 0) return null;
  return (
    <div className="relative bg-black">
      <div className="relative aspect-square sm:aspect-[4/3] max-h-[600px] overflow-hidden">
        {urls[index] ? (
          <img src={urls[index]!} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/30 text-sm">Carregando…</div>
        )}
        {paths.length > 1 && (
          <>
            <button
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={index === 0}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30"
            >‹</button>
            <button
              onClick={() => setIndex((i) => Math.min(paths.length - 1, i + 1))}
              disabled={index === paths.length - 1}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/60 text-white flex items-center justify-center disabled:opacity-30"
            >›</button>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
              {paths.map((_, i) => (
                <span key={i} className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: i === index ? "#fff" : "rgba(255,255,255,0.4)" }} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function VideoBlock({ url }: { url: string }) {
  const id = ytId(url);
  if (id) {
    return (
      <div className="aspect-video bg-black">
        <iframe
          src={`https://www.youtube.com/embed/${id}?rel=0`}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }
  return (
    <div className="aspect-video bg-black">
      <video src={url} controls className="w-full h-full" />
    </div>
  );
}

function PromptBlock({ text, isDark, C }: { text: string; isDark: boolean; C: any }) {
  const copy = () => {
    navigator.clipboard.writeText(text);
    toast.success("Prompt copiado!");
  };
  return (
    <div className="mx-4 mb-3">
      <div
        className="rounded-2xl p-4 relative"
        style={{
          background: isDark ? "#0a0a0d" : "#fafafa",
          border: `1px dashed ${C.accent}66`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="w-4 h-4" style={{ color: C.accent }} />
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.accent }}>
            Prompt exclusivo
          </span>
        </div>
        <pre
          className="text-[13px] whitespace-pre-wrap break-words font-mono leading-relaxed max-h-60 overflow-y-auto"
          style={{ color: C.text }}
        >
          {text}
        </pre>
        <button
          onClick={copy}
          className="mt-3 w-full h-10 rounded-xl font-semibold text-[13px] flex items-center justify-center gap-2 transition-all hover:scale-[1.01] active:scale-95"
          style={{ background: C.accent, color: "#fff" }}
        >
          <Copy className="w-4 h-4" /> Copiar prompt
        </button>
      </div>
    </div>
  );
}

function LiveCard({ post, isDark, C }: { post: Post; isDark: boolean; C: any }) {
  if (!post.live_at) return null;
  const date = new Date(post.live_at);
  const now = Date.now();
  const diff = date.getTime() - now;
  const isLive = diff < 0 && Math.abs(diff) < 2 * 3600 * 1000;
  const isPast = diff < -2 * 3600 * 1000;
  return (
    <div className="mx-4 mb-3">
      <div
        className="rounded-2xl p-4"
        style={{
          background: "linear-gradient(135deg, #2a0f00, #1a0a04)",
          border: `1px solid ${C.accent}66`,
        }}
      >
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center"
              style={{ background: isLive ? "#ff2d00" : "rgba(255,122,0,0.25)" }}>
              <Radio className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-white font-bold text-[14px]">
                {isLive ? "🔴 AO VIVO" : isPast ? "Live encerrada" : "Live agendada"}
              </div>
              <div className="text-white/70 text-[12px] flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {date.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" })} ·{" "}
                {date.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          </div>
          {post.live_url && !isPast && (
            <a
              href={post.live_url}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl font-semibold text-[13px] flex items-center gap-2 transition-all hover:scale-[1.02]"
              style={{ background: "#fff", color: "#1a0a04" }}
            >
              {isLive ? "Entrar agora" : "Abrir link"} <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ============ COMPOSER ============
function Composer({
  isDark,
  C,
  userId,
  onClose,
  onCreated,
}: {
  isDark: boolean;
  C: any;
  userId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [type, setType] = useState<PostType>("text");
  const [content, setContent] = useState("");
  const [promptText, setPromptText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [liveAt, setLiveAt] = useState("");
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) {
        if (f.size > MAX_FILE) {
          toast.error(`${f.name} excede 25MB`);
          continue;
        }
        const ext = f.name.split(".").pop() || "bin";
        const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const { error } = await supabase.storage.from(BUCKET).upload(path, f, {
          cacheControl: "3600",
          contentType: f.type,
        });
        if (error) { toast.error(error.message); continue; }
        const signed = await signPath(path);
        setImagePaths((p) => [...p, path]);
        if (signed) setImagePreviews((p) => [...p, signed]);
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  };

  const removeImage = (idx: number) => {
    setImagePaths((p) => p.filter((_, i) => i !== idx));
    setImagePreviews((p) => p.filter((_, i) => i !== idx));
  };

  const submit = async () => {
    if (submitting) return;
    if (type === "text" && !content.trim()) { toast.error("Escreva algo"); return; }
    if (type === "image" && imagePaths.length === 0) { toast.error("Envie ao menos uma imagem"); return; }
    if (type === "video" && !videoUrl.trim()) { toast.error("Cole o link do vídeo"); return; }
    if (type === "prompt" && !promptText.trim()) { toast.error("Escreva o prompt"); return; }
    if (type === "live" && (!liveUrl.trim() || !liveAt)) { toast.error("Informe link e data da live"); return; }

    setSubmitting(true);
    const payload: any = {
      author_id: userId,
      post_type: type,
      content: content.trim() || null,
      image_urls: type === "image" ? imagePaths : [],
      video_url: type === "video" ? videoUrl.trim() : null,
      prompt_text: type === "prompt" ? promptText.trim() : null,
      live_url: type === "live" ? liveUrl.trim() : null,
      live_at: type === "live" ? new Date(liveAt).toISOString() : null,
    };
    const { error } = await supabase.from("community_posts").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Publicado!");
    onCreated();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3" style={{ background: "rgba(0,0,0,0.7)" }}>
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden max-h-[90dvh] flex flex-col"
        style={{ background: isDark ? "#101013" : "#fff", border: `1px solid ${C.border}` }}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: C.border }}>
          <div className="font-bold text-[16px]" style={{ color: C.text }}>Novo post</div>
          <button onClick={onClose} className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-white/5">
            <X className="w-5 h-5" style={{ color: C.text }} />
          </button>
        </div>

        <div className="overflow-y-auto p-4 space-y-4">
          {/* Type chips */}
          <div className="flex gap-2 overflow-x-auto -mx-1 px-1">
            {[
              { id: "text", label: "Texto", icon: Sparkles },
              { id: "image", label: "Imagem", icon: ImageIcon },
              { id: "video", label: "Vídeo", icon: VideoIcon },
              { id: "prompt", label: "Prompt", icon: Wand2 },
              { id: "live", label: "Live", icon: Radio },
            ].map((t) => {
              const active = type === t.id;
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setType(t.id as PostType)}
                  className="h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all whitespace-nowrap"
                  style={{
                    background: active ? C.accent : isDark ? "#1a1a1f" : "#f5f5f7",
                    color: active ? "#fff" : C.text,
                  }}
                >
                  <Icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              );
            })}
          </div>

          {/* Always: text */}
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={type === "text" ? "O que rolou hoje na Fábrica? (markdown)" : "Legenda (opcional, markdown)"}
            rows={4}
            className="w-full p-3 rounded-2xl text-[14px] focus:outline-none resize-none"
            style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
          />

          {type === "image" && (
            <div>
              <div className="grid grid-cols-3 gap-2 mb-2">
                {imagePreviews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/70 text-white flex items-center justify-center"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="aspect-square rounded-xl flex items-center justify-center text-[12px] font-semibold disabled:opacity-50"
                  style={{ border: `1.5px dashed ${C.border}`, color: C.textMuted }}
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFiles}
                className="hidden"
              />
              <div className="text-[11px]" style={{ color: C.textMuted }}>
                Até 25MB por arquivo
              </div>
            </div>
          )}

          {type === "video" && (
            <input
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              placeholder="Link do YouTube ou MP4"
              className="w-full h-11 px-4 rounded-2xl text-[14px] focus:outline-none"
              style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
            />
          )}

          {type === "prompt" && (
            <textarea
              value={promptText}
              onChange={(e) => setPromptText(e.target.value)}
              placeholder="Cole o prompt aqui…"
              rows={6}
              className="w-full p-3 rounded-2xl text-[13px] font-mono focus:outline-none resize-none"
              style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
            />
          )}

          {type === "live" && (
            <div className="space-y-2">
              <input
                value={liveUrl}
                onChange={(e) => setLiveUrl(e.target.value)}
                placeholder="Link da live (YouTube, Zoom, Meet…)"
                className="w-full h-11 px-4 rounded-2xl text-[14px] focus:outline-none"
                style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
              />
              <input
                type="datetime-local"
                value={liveAt}
                onChange={(e) => setLiveAt(e.target.value)}
                className="w-full h-11 px-4 rounded-2xl text-[14px] focus:outline-none"
                style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
              />
            </div>
          )}
        </div>

        <div className="p-4 border-t flex items-center gap-2" style={{ borderColor: C.border }}>
          <button
            onClick={onClose}
            className="h-11 px-4 rounded-xl font-semibold text-[13px]"
            style={{ background: isDark ? "#1a1a1f" : "#f5f5f7", color: C.text }}
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            disabled={submitting || uploading}
            className="flex-1 h-11 rounded-xl font-bold text-[13px] disabled:opacity-50 transition-all hover:scale-[1.01] active:scale-95"
            style={{ background: C.accent, color: "#fff" }}
          >
            {submitting ? "Publicando…" : "Publicar"}
          </button>
        </div>
      </div>
    </div>
  );
}
