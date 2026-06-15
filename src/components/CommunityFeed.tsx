import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { resolveAvatarUrl } from "@/lib/avatarUrl";
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
  Pencil,
  Plus,
  X,
  ExternalLink,
  Clock,
  Sparkles,
  MoreHorizontal,
  Star,
  Share2,
  ShieldCheck,
  Smile,
  Globe,
} from "lucide-react";

const BUCKET = "community-media";
const SIGN_TTL = 60 * 60;
const MAX_FILE = 25 * 1024 * 1024;
const LAST_SEEN_KEY = "fugc-feed-last-seen";

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
  is_official: boolean;
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

function avatarOf(p?: Profile, fallbackName = "Aluno") {
  if (p?.avatar_url) return p.avatar_url;
  const seed = encodeURIComponent(p?.full_name || fallbackName);
  return `https://api.dicebear.com/9.x/initials/svg?seed=${seed}&backgroundColor=ff7a00,ff2d00&textColor=ffffff`;
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
  const [myProfile, setMyProfile] = useState<Profile | null>(null);
  const [likes, setLikes] = useState<Record<string, { count: number; mine: boolean }>>({});
  const [saves, setSaves] = useState<Record<string, boolean>>({});
  const [ratings, setRatings] = useState<Record<string, { avg: number; count: number; mine: number | null }>>({});
  const [commentCounts, setCommentCounts] = useState<Record<string, number>>({});
  const [openComments, setOpenComments] = useState<Record<string, boolean>>({});
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [filter, setFilter] = useState<"all" | "official" | "image" | "video" | "prompt" | "live" | "saved">("all");
  const [loading, setLoading] = useState(true);
  const [newSince, setNewSince] = useState(0);
  const lastSeenRef = useRef<number>(0);

  useEffect(() => {
    lastSeenRef.current = Number(localStorage.getItem(LAST_SEEN_KEY) ?? "0");
  }, []);

  useEffect(() => {
    if (!user) return;
    void supabase
      .from("profiles")
      .select("full_name, avatar_url")
      .eq("id", user.id)
      .maybeSingle()
      .then(async ({ data }) => {
        if (data) {
          const resolved = await resolveAvatarUrl(data.avatar_url);
          setMyProfile({ full_name: data.full_name, avatar_url: resolved });
        }
      });
  }, [user?.id]);

  const reload = async () => {
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
      const entries = await Promise.all(
        (profs ?? []).map(async (p: any) => {
          const url = await resolveAvatarUrl(p.avatar_url);
          return [p.id, { full_name: p.full_name, avatar_url: url }] as const;
        })
      );
      const map: Record<string, Profile> = Object.fromEntries(entries);
      setProfiles((prev) => ({ ...prev, ...map }));
    }

    const ids = list.map((p) => p.id);
    if (ids.length) {
      const [{ data: likeRows }, { data: saveRows }, { data: commentRows }, { data: ratingRows }] =
        await Promise.all([
          supabase.from("community_post_likes").select("post_id, user_id").in("post_id", ids),
          user
            ? supabase
                .from("community_post_saves")
                .select("post_id")
                .eq("user_id", user.id)
                .in("post_id", ids)
            : Promise.resolve({ data: [] as any[] }),
          supabase.from("community_post_comments").select("post_id").in("post_id", ids),
          supabase.from("community_post_ratings").select("post_id, user_id, rating").in("post_id", ids),
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

      const rt: Record<string, { sum: number; count: number; mine: number | null }> = {};
      (ratingRows ?? []).forEach((r: any) => {
        const cur = rt[r.post_id] ?? { sum: 0, count: 0, mine: null };
        cur.sum += r.rating;
        cur.count += 1;
        if (user && r.user_id === user.id) cur.mine = r.rating;
        rt[r.post_id] = cur;
      });
      const rtFinal: Record<string, { avg: number; count: number; mine: number | null }> = {};
      Object.entries(rt).forEach(([k, v]) => {
        rtFinal[k] = { avg: v.sum / v.count, count: v.count, mine: v.mine };
      });
      setRatings(rtFinal);
    }

    // notifications: count official posts newer than last seen
    const newest = list.filter((p) => p.is_official).length
      ? new Date(list.filter((p) => p.is_official)[0].created_at).getTime()
      : 0;
    if (newest > lastSeenRef.current) {
      const c = list.filter(
        (p) => p.is_official && new Date(p.created_at).getTime() > lastSeenRef.current
      ).length;
      setNewSince(c);
    } else {
      setNewSince(0);
    }
    setLoading(false);
  };

  useEffect(() => {
    void reload();
    const ch = supabase
      .channel("community_feed_v2")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "community_posts" }, (payload) => {
        const row = payload.new as Post;
        if (row.is_official && row.author_id !== user?.id) {
          toast.success("🔥 Novidade do CEO no feed!", { duration: 5000 });
        }
        void reload();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "community_posts" }, () => void reload())
      .on("postgres_changes", { event: "DELETE", schema: "public", table: "community_posts" }, () => void reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_post_likes" }, () => void reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_post_ratings" }, () => void reload())
      .on("postgres_changes", { event: "*", schema: "public", table: "community_post_comments" }, () => void reload())
      .subscribe();
    return () => { void supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const markSeen = () => {
    const t = Date.now();
    localStorage.setItem(LAST_SEEN_KEY, String(t));
    lastSeenRef.current = t;
    setNewSince(0);
  };

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

  const ratePost = async (postId: string, rating: number) => {
    if (!user) return;
    const cur = ratings[postId];
    setRatings((p) => {
      const prev = p[postId] ?? { avg: 0, count: 0, mine: null };
      const oldMine = prev.mine;
      const newCount = oldMine == null ? prev.count + 1 : prev.count;
      const sum = prev.avg * prev.count - (oldMine ?? 0) + rating;
      return { ...p, [postId]: { avg: sum / newCount, count: newCount, mine: rating } };
    });
    if (cur?.mine != null) {
      await supabase
        .from("community_post_ratings")
        .update({ rating })
        .eq("post_id", postId)
        .eq("user_id", user.id);
    } else {
      await supabase.from("community_post_ratings").insert({ post_id: postId, user_id: user.id, rating });
    }
    toast.success(`Avaliado: ${rating}★`);
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

  const editPost = async (postId: string, content: string) => {
    const { error } = await supabase
      .from("community_posts")
      .update({ content })
      .eq("id", postId);
    if (error) { toast.error("Falha ao editar"); return; }
    toast.success("Post atualizado");
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, content } : p)));
  };

  const sharePost = async (postId: string) => {
    const url = `${window.location.origin}/?post=${postId}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: "Fábrica UGC", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copiado!");
      }
    } catch {}
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
        const entries = await Promise.all(
          profs.map(async (p: any) => {
            const url = await resolveAvatarUrl(p.avatar_url);
            return [p.id, { full_name: p.full_name, avatar_url: url }] as const;
          })
        );
        setProfiles((prev) => {
          const next = { ...prev };
          entries.forEach(([id, prof]) => { next[id] = prof; });
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

  const filtered = useMemo(() => {
    return posts.filter((p) => {
      if (filter === "all") return true;
      if (filter === "official") return p.is_official;
      if (filter === "saved") return !!saves[p.id];
      return p.post_type === filter;
    });
  }, [posts, filter, saves]);

  const upcomingLive = posts
    .filter((p) => p.post_type === "live" && p.live_at && new Date(p.live_at).getTime() > Date.now() - 2 * 3600 * 1000)
    .sort((a, b) => new Date(a.live_at!).getTime() - new Date(b.live_at!).getTime())[0];

  return (
    <div className="space-y-4 max-w-2xl mx-auto w-full">
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
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg, #ff7a00, #ff2d00)" }}>
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="min-w-0">
              <div className="text-white font-bold text-[18px] sm:text-[22px] leading-tight truncate">
                Comunidade Fábrica UGC
              </div>
              <div className="text-white/60 text-[12px] sm:text-[13px]">
                Feed oficial · poste sua criação, curta, avalie
              </div>
            </div>
          </div>
          {newSince > 0 && (
            <button
              onClick={markSeen}
              className="h-9 px-3 rounded-full text-[12px] font-bold flex items-center gap-1.5 animate-pulse shrink-0"
              style={{ background: "#ff2d00", color: "#fff" }}
            >
              🔔 {newSince} novidade{newSince > 1 ? "s" : ""}
            </button>
          )}
        </div>

        {upcomingLive && (
          <div className="mt-4 relative">
            <LiveBanner post={upcomingLive} />
          </div>
        )}
      </div>

      {/* COMPOSER inline */}
      {user && (
        <InlineComposer
          isDark={isDark}
          C={C}
          userId={user.id}
          isAdmin={isAdmin}
          myProfile={myProfile}
          onCreated={() => void reload()}
        />
      )}

      {/* FILTERS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {[
          { id: "all", label: "Tudo", icon: Sparkles },
          { id: "official", label: "CEO", icon: ShieldCheck },
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
            Seja o primeiro a postar sua criação!
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
              rating={ratings[p.id]}
              commentCount={commentCounts[p.id] ?? 0}
              commentsOpen={!!openComments[p.id]}
              comments={comments[p.id] ?? []}
              profiles={profiles}
              currentUserId={user?.id ?? null}
              onLike={() => toggleLike(p.id)}
              onSave={() => toggleSave(p.id)}
              onRate={(r) => ratePost(p.id, r)}
              onShare={() => sharePost(p.id)}
              onTogglePin={() => togglePin(p.id, p.is_pinned)}
              onDelete={() => deletePost(p.id)}
              onEdit={(content) => editPost(p.id, content)}
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
    </div>
  );
}

// ============ INLINE COMPOSER (FB style) ============
function InlineComposer({
  isDark,
  C,
  userId,
  isAdmin,
  myProfile,
  onCreated,
}: {
  isDark: boolean;
  C: any;
  userId: string;
  isAdmin: boolean;
  myProfile: Profile | null;
  onCreated: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [content, setContent] = useState("");
  const [promptText, setPromptText] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [liveUrl, setLiveUrl] = useState("");
  const [liveAt, setLiveAt] = useState("");
  const [imagePaths, setImagePaths] = useState<string[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showPrompt, setShowPrompt] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [showLive, setShowLive] = useState(false);
  const [postAsOfficial, setPostAsOfficial] = useState(isAdmin);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { setPostAsOfficial(isAdmin); }, [isAdmin]);

  const reset = () => {
    setContent("");
    setPromptText("");
    setVideoUrl("");
    setLiveUrl("");
    setLiveAt("");
    setImagePaths([]);
    setImagePreviews([]);
    setShowPrompt(false);
    setShowVideo(false);
    setShowLive(false);
    setExpanded(false);
  };

  const handleFiles = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const f of files) {
        if (f.size > MAX_FILE) { toast.error(`${f.name} excede 25MB`); continue; }
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
    const hasContent = content.trim().length > 0;
    const hasImage = imagePaths.length > 0;
    const hasVideo = videoUrl.trim().length > 0;
    const hasPrompt = promptText.trim().length > 0;
    const hasLive = liveUrl.trim().length > 0 && liveAt.length > 0;

    if (!hasContent && !hasImage && !hasVideo && !hasPrompt && !hasLive) {
      toast.error("Escreva algo ou adicione mídia");
      return;
    }

    let post_type: PostType = "text";
    if (hasLive) post_type = "live";
    else if (hasPrompt) post_type = "prompt";
    else if (hasVideo) post_type = "video";
    else if (hasImage) post_type = "image";

    setSubmitting(true);
    const payload: any = {
      author_id: userId,
      post_type,
      content: content.trim() || null,
      image_urls: hasImage ? imagePaths : [],
      video_url: hasVideo ? videoUrl.trim() : null,
      prompt_text: hasPrompt ? promptText.trim() : null,
      live_url: hasLive ? liveUrl.trim() : null,
      live_at: hasLive ? new Date(liveAt).toISOString() : null,
      is_official: isAdmin && postAsOfficial,
    };
    const { error } = await supabase.from("community_posts").insert(payload);
    setSubmitting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(isAdmin && postAsOfficial ? "🔥 Publicado pra todos!" : "Publicado!");
    reset();
    onCreated();
  };

  const placeholder = isAdmin
    ? "Compartilhe uma novidade com todos os alunos…"
    : "Compartilhe sua criação, dúvida ou conquista…";

  return (
    <div
      className="rounded-3xl overflow-hidden"
      style={{
        background: isDark ? "#101013" : "#fff",
        border: `1px solid ${C.border}`,
        boxShadow: isDark ? "none" : "0 1px 2px rgba(0,0,0,0.04)",
      }}
    >
      <div className="p-4">
        <div className="flex items-start gap-3">
          <img
            src={avatarOf(myProfile ?? undefined, "Você")}
            alt=""
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => {
                setContent(e.target.value);
                const el = textareaRef.current;
                if (el) { el.style.height = "auto"; el.style.height = `${Math.min(el.scrollHeight, 200)}px`; }
              }}
              onFocus={() => setExpanded(true)}
              placeholder={placeholder}
              rows={expanded ? 3 : 1}
              className="w-full bg-transparent focus:outline-none resize-none text-[15px] leading-relaxed py-2"
              style={{ color: C.text }}
            />

            {/* media previews */}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-2 mt-2">
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
              </div>
            )}

            {showVideo && (
              <input
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Link do YouTube ou MP4…"
                className="w-full mt-2 h-10 px-3 rounded-xl text-[13px] focus:outline-none"
                style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
              />
            )}
            {showPrompt && (
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                placeholder="Cole o prompt…"
                rows={4}
                className="w-full mt-2 p-3 rounded-xl text-[13px] font-mono focus:outline-none resize-none"
                style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
              />
            )}
            {showLive && (
              <div className="mt-2 grid grid-cols-2 gap-2">
                <input
                  value={liveUrl}
                  onChange={(e) => setLiveUrl(e.target.value)}
                  placeholder="Link da live"
                  className="h-10 px-3 rounded-xl text-[13px] focus:outline-none"
                  style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
                />
                <input
                  type="datetime-local"
                  value={liveAt}
                  onChange={(e) => setLiveAt(e.target.value)}
                  className="h-10 px-3 rounded-xl text-[13px] focus:outline-none"
                  style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}`, color: C.text }}
                />
              </div>
            )}
          </div>
        </div>

        {/* toolbar */}
        <div className="mt-3 pt-3 border-t flex items-center justify-between gap-2 flex-wrap"
          style={{ borderColor: C.border }}>
          <div className="flex items-center gap-1 flex-wrap">
            <ToolBtn icon={ImageIcon} label="Foto" color="#22c55e" onClick={() => fileRef.current?.click()} isDark={isDark} C={C} />
            <ToolBtn icon={VideoIcon} label="Vídeo" color="#ef4444" onClick={() => setShowVideo((v) => !v)} active={showVideo} isDark={isDark} C={C} />
            <ToolBtn icon={Wand2} label="Prompt" color="#a855f7" onClick={() => setShowPrompt((v) => !v)} active={showPrompt} isDark={isDark} C={C} />
            {isAdmin && (
              <ToolBtn icon={Radio} label="Live" color="#f97316" onClick={() => setShowLive((v) => !v)} active={showLive} isDark={isDark} C={C} />
            )}
            <input ref={fileRef} type="file" accept="image/*,video/*" multiple onChange={handleFiles} className="hidden" />
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={() => setPostAsOfficial((v) => !v)}
                className="h-9 px-3 rounded-full text-[11px] font-bold flex items-center gap-1.5 transition-all"
                style={{
                  background: postAsOfficial ? "linear-gradient(135deg, #ff7a00, #ff2d00)" : isDark ? "#1a1a1f" : "#f5f5f7",
                  color: postAsOfficial ? "#fff" : C.text,
                }}
                title="Marcar como post oficial do CEO (notifica todos)"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> {postAsOfficial ? "OFICIAL" : "Comum"}
              </button>
            )}
            <button
              onClick={submit}
              disabled={submitting || uploading}
              className="h-10 px-5 rounded-full font-bold text-[13px] flex items-center gap-2 disabled:opacity-50 transition-all hover:scale-[1.02] active:scale-95"
              style={{ background: C.accent, color: "#fff" }}
            >
              {submitting ? "Postando…" : (<><Send className="w-4 h-4" /> Publicar</>)}
            </button>
          </div>
        </div>
        {uploading && (
          <div className="text-[11px] mt-2" style={{ color: C.textMuted }}>Enviando arquivos…</div>
        )}
      </div>
    </div>
  );
}

function ToolBtn({
  icon: Icon,
  label,
  color,
  onClick,
  active,
  isDark,
  C,
}: {
  icon: any;
  label: string;
  color: string;
  onClick: () => void;
  active?: boolean;
  isDark: boolean;
  C: any;
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3 rounded-full text-[12px] font-semibold flex items-center gap-1.5 transition-all hover:scale-[1.03]"
      style={{
        background: active ? `${color}22` : "transparent",
        color: active ? color : C.text,
      }}
    >
      <Icon className="w-4 h-4" style={{ color }} /> <span className="hidden sm:inline">{label}</span>
    </button>
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
          <div className="text-white font-bold text-[13px]">
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
  rating,
  commentCount,
  commentsOpen,
  comments,
  profiles,
  currentUserId,
  onLike,
  onSave,
  onRate,
  onShare,
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
  rating?: { avg: number; count: number; mine: number | null };
  commentCount: number;
  commentsOpen: boolean;
  comments: Comment[];
  profiles: Record<string, Profile>;
  currentUserId: string | null;
  onLike: () => void;
  onSave: () => void;
  onRate: (r: number) => void;
  onShare: () => void;
  onTogglePin: () => void;
  onDelete: () => void;
  onToggleComments: () => void;
  onComment: (text: string) => Promise<void>;
  onDeleteComment: (cid: string) => Promise<void>;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [commentText, setCommentText] = useState("");
  const isNew = Date.now() - new Date(post.created_at).getTime() < 24 * 3600 * 1000;
  const displayName = author?.full_name || (post.is_official ? "Fábrica de UGC" : "Aluno Fábrica UGC");
  const avatar = avatarOf(author, displayName);
  const ownPost = currentUserId === post.author_id;
  const canDelete = isAdmin || ownPost;
  const canRate = !post.is_official && currentUserId && !ownPost;
  const showVerified = post.is_official; // gold check for official/CEO posts

  return (
    <article
      className="rounded-3xl overflow-hidden relative"
      style={{
        background: isDark ? "#101013" : "#fff",
        border: `1px solid ${post.is_pinned ? C.accent : post.is_official ? `${C.accent}66` : C.border}`,
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
        <div className="relative shrink-0">
          <img src={avatar} alt={displayName} className="w-10 h-10 rounded-full object-cover" />
          {showVerified && (
            <span
              className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)", boxShadow: "0 0 0 2px " + (isDark ? "#101013" : "#fff") }}
              title="Verificado"
            >
              <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="#fff"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-semibold text-[14px] truncate" style={{ color: C.text }}>{displayName}</span>
            {showVerified && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full"
                style={{ background: "linear-gradient(135deg, #FFD700, #FFA500)" }}
                title="Conta verificada">
                <svg viewBox="0 0 24 24" className="w-2.5 h-2.5" fill="#fff"><path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
              </span>
            )}
            {post.is_official && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-bold"
                style={{ background: "linear-gradient(135deg, #ff7a00, #ff2d00)", color: "#fff" }}>
                <ShieldCheck className="w-2.5 h-2.5" /> CEO
              </span>
            )}
            {!post.is_official && (
              <span className="text-[11px]" style={{ color: C.textMuted }}>· aluno</span>
            )}
            {isNew && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                style={{ background: C.accent, color: "#fff" }}>NOVO</span>
            )}
          </div>
          <div className="text-[11px] flex items-center gap-1" style={{ color: C.textMuted }}>
            {timeAgo(post.created_at)} · <Globe className="w-2.5 h-2.5" /> Comunidade
          </div>
        </div>
        {canDelete && (
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all hover:bg-black/5 dark:hover:bg-white/5"
              style={{ color: C.textMuted }}
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
                {isAdmin && (
                  <button
                    onClick={() => { setMenuOpen(false); onTogglePin(); }}
                    className="w-full px-3 py-2 text-left text-[13px] flex items-center gap-2 hover:bg-black/5 dark:hover:bg-white/5"
                    style={{ color: C.text }}
                  >
                    <Pin className="w-4 h-4" /> {post.is_pinned ? "Desafixar" : "Fixar no topo"}
                  </button>
                )}
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
      {post.post_type === "image" && post.image_urls.length > 0 && <ImageGallery paths={post.image_urls} />}
      {post.post_type === "video" && post.video_url && <VideoBlock url={post.video_url} />}
      {post.post_type === "prompt" && post.prompt_text && <PromptBlock text={post.prompt_text} isDark={isDark} C={C} />}
      {post.post_type === "live" && <LiveCard post={post} isDark={isDark} C={C} />}

      {/* STATS LINE */}
      {(like?.count || commentCount > 0 || rating?.count) && (
        <div className="px-4 py-2 flex items-center justify-between text-[12px]" style={{ color: C.textMuted }}>
          <div className="flex items-center gap-1">
            {(like?.count ?? 0) > 0 && (
              <>
                <span className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 text-white" fill="#fff" />
                </span>
                <span className="font-semibold">{like!.count}</span>
              </>
            )}
            {rating && rating.count > 0 && (
              <span className="ml-2 flex items-center gap-0.5">
                <Star className="w-3 h-3" fill="#fbbf24" stroke="#fbbf24" />
                <span className="font-semibold" style={{ color: C.text }}>{rating.avg.toFixed(1)}</span>
                <span>({rating.count})</span>
              </span>
            )}
          </div>
          <div className="flex gap-3">
            {commentCount > 0 && <span>{commentCount} coment.</span>}
          </div>
        </div>
      )}

      {/* RATING (somente posts de alunos) */}
      {canRate && (
        <div
          className="mx-4 mb-2 px-3 py-2 rounded-xl flex items-center justify-between gap-2"
          style={{ background: isDark ? "#0a0a0d" : "#fafafa", border: `1px solid ${C.border}` }}
        >
          <span className="text-[11px] font-semibold" style={{ color: C.textMuted }}>
            {rating?.mine ? "Sua nota:" : "Avalie:"}
          </span>
          <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map((n) => {
              const filled = (rating?.mine ?? 0) >= n;
              return (
                <button
                  key={n}
                  onClick={() => onRate(n)}
                  className="p-1 transition-all hover:scale-125 active:scale-90"
                >
                  <Star
                    className="w-5 h-5"
                    fill={filled ? "#fbbf24" : "none"}
                    stroke={filled ? "#fbbf24" : C.textMuted}
                    strokeWidth={2}
                  />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ACTIONS */}
      <div className="flex items-center gap-1 px-2 py-1 border-t" style={{ borderColor: C.border }}>
        <ActionBtn
          icon={Heart}
          label="Curtir"
          active={!!like?.mine}
          activeColor="#ff2d55"
          onClick={onLike}
          C={C}
        />
        <ActionBtn
          icon={MessageCircle}
          label="Comentar"
          onClick={onToggleComments}
          C={C}
        />
        <ActionBtn icon={Share2} label="Compartilhar" onClick={onShare} C={C} />
        <ActionBtn
          icon={Bookmark}
          label="Salvar"
          active={saved}
          activeColor={C.accent}
          onClick={onSave}
          C={C}
        />
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
            const av = avatarOf(prof, name);
            const canDel = isAdmin || c.user_id === currentUserId;
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
                    {canDel && (
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
                placeholder="Escreva um comentário…"
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

function ActionBtn({
  icon: Icon,
  label,
  active,
  activeColor,
  onClick,
  C,
}: {
  icon: any;
  label: string;
  active?: boolean;
  activeColor?: string;
  onClick: () => void;
  C: any;
}) {
  const color = active && activeColor ? activeColor : C.text;
  return (
    <button
      onClick={onClick}
      className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-semibold transition-all active:scale-95 hover:bg-black/5 dark:hover:bg-white/5"
      style={{ color }}
    >
      <Icon className="w-5 h-5" fill={active && activeColor ? activeColor : "none"} />
      <span className="hidden sm:inline">{label}</span>
    </button>
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
  const [signed, setSigned] = useState<string | null>(null);
  const isStoragePath = !url.startsWith("http");
  useEffect(() => {
    if (isStoragePath) signPath(url).then(setSigned);
  }, [url, isStoragePath]);
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
  const src = isStoragePath ? signed : url;
  return (
    <div className="aspect-video bg-black">
      {src ? <video src={src} controls className="w-full h-full" /> : null}
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
        className="rounded-2xl p-4"
        style={{
          background: isDark ? "#0a0a0d" : "#fafafa",
          border: `1px dashed ${C.accent}66`,
        }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Wand2 className="w-4 h-4" style={{ color: C.accent }} />
          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: C.accent }}>
            Prompt
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
