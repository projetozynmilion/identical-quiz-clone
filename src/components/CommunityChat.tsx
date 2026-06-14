import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Send, Trash2, CheckCheck, Paperclip, Mic, Image as ImageIcon,
  Smile, X, Play, Pause, FileText, Download, Square, ArrowDown,
} from "lucide-react";
import { resolveAvatarUrl } from "@/lib/avatarUrl";

function ChatAvatar({ value, fallback, color, size = 28 }: { value: string | null | undefined; fallback: string; color: string; size?: number }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    resolveAvatarUrl(value).then((u) => { if (alive) setUrl(u); });
    return () => { alive = false; };
  }, [value]);
  if (url) {
    return <img src={url} alt="" className="rounded-full object-cover" style={{ width: size, height: size }} />;
  }
  return (
    <div className="rounded-full flex items-center justify-center text-[10px] font-bold text-white"
      style={{ background: color, width: size, height: size }}>
      {fallback}
    </div>
  );
}

type MessageType = "text" | "image" | "audio" | "file";

type ChatMessage = {
  id: string;
  user_id: string;
  content: string | null;
  created_at: string;
  message_type: MessageType;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_size: number | null;
  attachment_mime: string | null;
  audio_duration: number | null;
};

type Profile = {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
};

interface CommunityChatProps {
  user: { id: string } | null;
  isAdmin?: boolean;
  isDark: boolean;
  fullBleed?: boolean;
  C: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    hover: string;
  };
}

const NAME_COLORS = [
  "#06cf9c", "#e542a3", "#3b9eff", "#ff8a3d", "#b388ff",
  "#ffd166", "#06b6d4", "#f87171", "#a3e635", "#fb7185",
];
const colorForUser = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
};

const WA_DOODLE_DARK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='%23ffffff' stroke-opacity='0.035' stroke-width='1.4'><circle cx='30' cy='40' r='10'/><path d='M70 30c8-8 22-8 30 0s8 22 0 30'/><path d='M150 50l14 0 0 14'/><circle cx='190' cy='30' r='4' fill='%23ffffff' fill-opacity='0.04'/><path d='M20 110q20-20 40 0t40 0t40 0t40 0t40 0'/><path d='M30 170c10-6 20-6 30 0s20 6 30 0'/><path d='M150 150l10 10 10-10 10 10'/><circle cx='180' cy='190' r='8'/><path d='M60 200l8-14 8 14z'/></g></svg>\")";
const WA_DOODLE_LIGHT =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='%23000000' stroke-opacity='0.05' stroke-width='1.4'><circle cx='30' cy='40' r='10'/><path d='M70 30c8-8 22-8 30 0s8 22 0 30'/><path d='M150 50l14 0 0 14'/><circle cx='190' cy='30' r='4' fill='%23000000' fill-opacity='0.05'/><path d='M20 110q20-20 40 0t40 0t40 0t40 0t40 0'/><path d='M30 170c10-6 20-6 30 0s20 6 30 0'/><path d='M150 150l10 10 10-10 10 10'/><circle cx='180' cy='190' r='8'/><path d='M60 200l8-14 8 14z'/></g></svg>\")";

const QUICK_EMOJIS = ["😂", "❤️", "🔥", "🙌", "👏", "✨", "💸", "🤌", "💯", "🥹", "😍", "👀", "🚀", "💪", "🎯", "🥳"];

const BUCKET = "chat-attachments";
const MAX_FILE = 25 * 1024 * 1024; // 25MB

const formatBytes = (b: number) => {
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
};

const formatDuration = (s: number) => {
  const sec = Math.max(0, Math.round(s));
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return `${m}:${r.toString().padStart(2, "0")}`;
};

// Cache de URLs assinadas
const signedCache = new Map<string, { url: string; exp: number }>();
const SIGN_TTL = 60 * 60; // 1h
async function getSignedUrl(path: string): Promise<string | null> {
  const now = Date.now();
  const cached = signedCache.get(path);
  if (cached && cached.exp > now + 60_000) return cached.url;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGN_TTL);
  if (!data?.signedUrl) return null;
  signedCache.set(path, { url: data.signedUrl, exp: now + SIGN_TTL * 1000 });
  return data.signedUrl;
}

// Audio bubble
function AudioBubble({ path, mine, isDark, duration }: { path: string; mine: boolean; isDark: boolean; duration: number | null }) {
  const [url, setUrl] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [cur, setCur] = useState(0);
  const [dur, setDur] = useState(duration ?? 0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let alive = true;
    getSignedUrl(path).then((u) => alive && setUrl(u));
    return () => { alive = false; };
  }, [path]);

  const toggle = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); } else { void a.play(); }
  };

  const accent = mine ? (isDark ? "#a8c7bd" : "#54a896") : (isDark ? "#8696a0" : "#54656f");

  return (
    <div className="flex items-center gap-3 min-w-[200px] sm:min-w-[240px]">
      <button
        onClick={toggle}
        className="h-9 w-9 rounded-full flex items-center justify-center shrink-0"
        style={{ background: mine ? (isDark ? "#0d8268" : "#00a884") : (isDark ? "#374a54" : "#dadfe3"), color: mine ? "#fff" : (isDark ? "#e9edef" : "#3b4a54") }}
        aria-label={playing ? "Pausar" : "Tocar"}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
      </button>
      <div className="flex-1">
        <div className="relative h-1 rounded-full overflow-hidden" style={{ background: mine ? (isDark ? "#0a4a3b" : "#a8e0c4") : (isDark ? "#374a54" : "#dadfe3") }}>
          <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${progress * 100}%`, background: accent }} />
        </div>
        <div className="text-[11px] mt-1" style={{ color: accent }}>
          {formatDuration(playing || cur > 0 ? cur : dur || 0)}
        </div>
      </div>
      {url && (
        <audio
          ref={audioRef}
          src={url}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => { setPlaying(false); setProgress(0); setCur(0); }}
          onLoadedMetadata={(e) => {
            const d = (e.currentTarget as HTMLAudioElement).duration;
            if (isFinite(d) && d > 0) setDur(d);
          }}
          onTimeUpdate={(e) => {
            const a = e.currentTarget as HTMLAudioElement;
            setCur(a.currentTime);
            if (a.duration > 0) setProgress(a.currentTime / a.duration);
          }}
          preload="metadata"
        />
      )}
    </div>
  );
}

function ImageBubble({ path, name, onOpen }: { path: string; name: string | null; onOpen: (url: string) => void }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getSignedUrl(path).then((u) => alive && setUrl(u));
    return () => { alive = false; };
  }, [path]);
  if (!url) {
    return <div className="w-[240px] h-[180px] rounded-md animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />;
  }
  return (
    <button onClick={() => onOpen(url)} className="block rounded-md overflow-hidden group">
      <img
        src={url}
        alt={name || "imagem"}
        className="max-w-[260px] sm:max-w-[320px] max-h-[360px] object-cover transition-transform group-hover:scale-[1.01]"
        loading="lazy"
      />
    </button>
  );
}

function FileBubble({ path, name, size, mime, isDark, mine }: { path: string; name: string | null; size: number | null; mime: string | null; isDark: boolean; mine: boolean }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    getSignedUrl(path).then((u) => alive && setUrl(u));
    return () => { alive = false; };
  }, [path]);
  const accent = mine ? (isDark ? "#a8c7bd" : "#54a896") : (isDark ? "#8696a0" : "#54656f");
  return (
    <a
      href={url || "#"}
      target="_blank"
      rel="noreferrer"
      download={name || true}
      className="flex items-center gap-3 min-w-[220px] rounded-md px-3 py-2"
      style={{ background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)" }}
    >
      <div className="h-10 w-10 rounded-md flex items-center justify-center shrink-0" style={{ background: mine ? (isDark ? "#0d8268" : "#00a884") : (isDark ? "#374a54" : "#dadfe3"), color: mine ? "#fff" : (isDark ? "#e9edef" : "#3b4a54") }}>
        <FileText className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13.5px] font-medium truncate">{name || "arquivo"}</div>
        <div className="text-[11.5px] truncate" style={{ color: accent }}>
          {mime || "arquivo"} {size ? `· ${formatBytes(size)}` : ""}
        </div>
      </div>
      <Download className="w-4 h-4 shrink-0" style={{ color: accent }} />
    </a>
  );
}

export default function CommunityChat({ user, isAdmin, isDark, fullBleed, C }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [lightbox, setLightbox] = useState<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileImgRef = useRef<HTMLInputElement>(null);
  const fileAnyRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Recording state
  const [recording, setRecording] = useState(false);
  const [recElapsed, setRecElapsed] = useState(0);
  const recRef = useRef<{ mr: MediaRecorder; chunks: Blob[]; stream: MediaStream; startedAt: number; timer: number; mime: string } | null>(null);

  const loadProfiles = useCallback(async (ids: string[]) => {
    const missing = ids.filter((id) => !profiles[id]);
    if (missing.length === 0) return;
    const { data } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", missing);
    if (data) {
      setProfiles((prev) => {
        const next = { ...prev };
        for (const p of data as Profile[]) next[p.id] = p;
        return next;
      });
    }
  }, [profiles]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(300);
      if (!mounted) return;
      if (error) {
        toast.error("Erro ao carregar chat");
      } else if (data) {
        const arr = data as ChatMessage[];
        setMessages(arr);
        await loadProfiles(Array.from(new Set(arr.map((m) => m.user_id))));
      }
      setLoading(false);
    })();

    const channel = supabase
      .channel("chat_messages_room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "chat_messages" },
        async (payload) => {
          const msg = payload.new as ChatMessage;
          setMessages((prev) => (prev.some((m) => m.id === msg.id) ? prev : [...prev, msg]));
          await loadProfiles([msg.user_id]);
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "chat_messages" },
        (payload) => {
          const old = payload.old as ChatMessage;
          setMessages((prev) => prev.filter((m) => m.id !== old.id));
        },
      )
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (atBottom) {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    }
  }, [messages.length, atBottom]);

  // Auto-grow textarea
  useEffect(() => {
    const t = textareaRef.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = Math.min(t.scrollHeight, 140) + "px";
  }, [input]);

  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const near = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    setAtBottom(near);
  };
  const scrollDown = () => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  };

  const sendText = async () => {
    const text = input.trim();
    if (!text || !user || sending) return;
    setSending(true);
    const { error } = await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, content: text, message_type: "text" });
    if (error) toast.error("Não foi possível enviar");
    else { setInput(""); setShowEmoji(false); }
    setSending(false);
    textareaRef.current?.focus();
  };

  const uploadAndSend = async (
    file: Blob,
    opts: { type: MessageType; name: string; mime: string; duration?: number }
  ) => {
    if (!user) return;
    if (file.size > MAX_FILE) {
      toast.error("Arquivo muito grande (máx 25MB)");
      return;
    }
    setUploading(true);
    try {
      const ext = opts.name.includes(".") ? opts.name.split(".").pop() : opts.mime.split("/")[1] || "bin";
      const safeName = opts.name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60);
      const path = `${user.id}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName.endsWith(`.${ext}`) ? safeName : `${safeName}.${ext}`}`;
      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        contentType: opts.mime,
        upsert: false,
      });
      if (upErr) throw upErr;
      const { error } = await supabase.from("chat_messages").insert({
        user_id: user.id,
        content: "",
        message_type: opts.type,
        attachment_url: path,
        attachment_name: opts.name,
        attachment_size: file.size,
        attachment_mime: opts.mime,
        audio_duration: opts.duration ?? null,
      });
      if (error) throw error;
    } catch (e) {
      console.error(e);
      toast.error("Falha ao enviar anexo");
    } finally {
      setUploading(false);
    }
  };

  const onPickImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    await uploadAndSend(f, { type: "image", name: f.name, mime: f.type || "image/jpeg" });
  };
  const onPickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    const isImg = f.type.startsWith("image/");
    await uploadAndSend(f, { type: isImg ? "image" : "file", name: f.name, mime: f.type || "application/octet-stream" });
  };

  const startRecording = async () => {
    if (recording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : MediaRecorder.isTypeSupported("audio/webm")
          ? "audio/webm"
          : "audio/mp4";
      const mr = new MediaRecorder(stream, { mimeType: mime });
      const chunks: Blob[] = [];
      mr.ondataavailable = (ev) => { if (ev.data.size > 0) chunks.push(ev.data); };
      const startedAt = Date.now();
      const timer = window.setInterval(() => setRecElapsed(Math.floor((Date.now() - startedAt) / 1000)), 200);
      recRef.current = { mr, chunks, stream, startedAt, timer, mime };
      mr.start();
      setRecording(true);
      setRecElapsed(0);
    } catch (e) {
      console.error(e);
      toast.error("Não foi possível acessar o microfone");
    }
  };

  const stopRecording = async (cancel: boolean) => {
    const ref = recRef.current;
    if (!ref) return;
    const { mr, stream, timer, mime } = ref;
    clearInterval(timer);
    const duration = (Date.now() - ref.startedAt) / 1000;
    const blobPromise = new Promise<Blob>((resolve) => {
      mr.onstop = () => resolve(new Blob(ref.chunks, { type: mime }));
    });
    try { mr.stop(); } catch { /* noop */ }
    stream.getTracks().forEach((t) => t.stop());
    setRecording(false);
    recRef.current = null;
    if (cancel) return;
    if (duration < 0.6) {
      toast.error("Aperte e segure pra gravar mais que 1 segundo");
      return;
    }
    const blob = await blobPromise;
    const ext = mime.includes("mp4") ? "m4a" : "webm";
    await uploadAndSend(blob, { type: "audio", name: `audio.${ext}`, mime: blob.type || mime, duration });
  };

  useEffect(() => () => {
    const r = recRef.current;
    if (r) { clearInterval(r.timer); r.stream.getTracks().forEach((t) => t.stop()); }
  }, []);

  const onDelete = async (id: string) => {
    const m = messages.find((x) => x.id === id);
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) { toast.error("Não foi possível apagar"); return; }
    if (m?.attachment_url) {
      await supabase.storage.from(BUCKET).remove([m.attachment_url]).catch(() => undefined);
    }
  };

  const nameFor = (id: string) => {
    const p = profiles[id];
    return p?.full_name || p?.username || "Membro";
  };
  const initialsFor = (id: string) => {
    const n = nameFor(id);
    return n.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  };

  const items = useMemo(() => {
    const out: Array<
      | { kind: "day"; key: string; label: string }
      | { kind: "msg"; key: string; msg: ChatMessage; showMeta: boolean; isLast: boolean }
    > = [];
    let lastDay = "";
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      const d = new Date(m.created_at);
      const dayKey = d.toDateString();
      if (dayKey !== lastDay) {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        const md = new Date(d); md.setHours(0, 0, 0, 0);
        const diff = Math.round((today.getTime() - md.getTime()) / 86400000);
        const label = diff === 0 ? "Hoje" : diff === 1 ? "Ontem"
          : d.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
        out.push({ kind: "day", key: "d-" + dayKey, label });
        lastDay = dayKey;
      }
      const prev = messages[i - 1];
      const sameSender = prev && prev.user_id === m.user_id &&
        new Date(m.created_at).getTime() - new Date(prev.created_at).getTime() < 5 * 60 * 1000 &&
        new Date(prev.created_at).toDateString() === dayKey;
      const next = messages[i + 1];
      const isLast = !next || next.user_id !== m.user_id ||
        new Date(next.created_at).getTime() - new Date(m.created_at).getTime() >= 5 * 60 * 1000;
      out.push({ kind: "msg", key: m.id, msg: m, showMeta: !sameSender, isLast });
    }
    return out;
  }, [messages]);

  const wa = isDark
    ? {
        header: "#202c33",
        body: "#0b141a",
        bodyDoodle: WA_DOODLE_DARK,
        composer: "#202c33",
        inputBg: "#2a3942",
        mineBubble: "#005c4b",
        mineText: "#e9edef",
        otherBubble: "#202c33",
        otherText: "#e9edef",
        metaText: "#8696a0",
        daypill: "#182229",
        daypillText: "#8696a0",
        sendBg: "#00a884",
        iconBtn: "#8696a0",
      }
    : {
        header: "#f0f2f5",
        body: "#efeae2",
        bodyDoodle: WA_DOODLE_LIGHT,
        composer: "#f0f2f5",
        inputBg: "#ffffff",
        mineBubble: "#d9fdd3",
        mineText: "#111b21",
        otherBubble: "#ffffff",
        otherText: "#111b21",
        metaText: "#667781",
        daypill: "#ffffff",
        daypillText: "#54656f",
        sendBg: "#00a884",
        iconBtn: "#54656f",
      };

  const composerDisabled = !user || sending || uploading || recording;

  return (
    <div
      className={fullBleed ? "flex flex-col overflow-hidden h-full w-full" : "rounded-2xl flex flex-col overflow-hidden"}
      style={{
        border: fullBleed ? "none" : `1px solid ${C.border}`,
        height: fullBleed ? "100%" : "min(75vh, 760px)",
        background: wa.body,
      }}
    >
      {/* Header */}
      <div
        className="px-4 py-3 flex items-center gap-3"
        style={{ background: wa.header, borderBottom: isDark ? "1px solid #0c1317" : "1px solid #d1d7db" }}
      >
        <div
          className="h-10 w-10 rounded-full flex items-center justify-center text-[13px] font-bold text-white shrink-0"
          style={{ background: "linear-gradient(135deg, #00a884, #008f72)" }}
        >
          FU
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[15px] font-medium truncate" style={{ color: isDark ? "#e9edef" : "#111b21" }}>
            Fábrica UGC · Comunidade
          </div>
          <div className="text-[12px] truncate flex items-center gap-1.5" style={{ color: wa.metaText }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            online · {messages.length} mensagens
          </div>
        </div>
      </div>

      {/* Body */}
      <div
        ref={scrollRef}
        onScroll={onScroll}
        className="relative flex-1 overflow-y-auto px-3 sm:px-6 py-3"
        style={{
          background: wa.body,
          backgroundImage: wa.bodyDoodle,
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      >
        {loading ? (
          <div className="text-center text-[13px] mt-6" style={{ color: wa.metaText }}>Carregando...</div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
            <div className="text-5xl">👋</div>
            <div className="text-[14px] font-medium" style={{ color: isDark ? "#e9edef" : "#111b21" }}>
              Bem-vindo na Fábrica UGC
            </div>
            <div className="text-[12.5px] max-w-sm" style={{ color: wa.metaText }}>
              Esse é o chat da comunidade. Mande mensagens, áudios, imagens e arquivos. Troque networking com outros alunos.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-[2px]">
            {items.map((it) => {
              if (it.kind === "day") {
                return (
                  <div key={it.key} className="flex justify-center my-3">
                    <span
                      className="px-3 py-1 rounded-md text-[12px] shadow-sm"
                      style={{ background: wa.daypill, color: wa.daypillText }}
                    >
                      {it.label}
                    </span>
                  </div>
                );
              }
              const m = it.msg;
              const mine = user?.id === m.user_id;
              const canDelete = mine || isAdmin;
              const time = new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
              const senderColor = colorForUser(m.user_id);
              const bubbleBg = mine ? wa.mineBubble : wa.otherBubble;
              const bubbleColor = mine ? wa.mineText : wa.otherText;
              const tail = it.isLast;
              const isImage = m.message_type === "image" && m.attachment_url;
              const isAudio = m.message_type === "audio" && m.attachment_url;
              const isFile = m.message_type === "file" && m.attachment_url;
              const profile = profiles[m.user_id];

              return (
                <div
                  key={it.key}
                  className={`group flex w-full items-end gap-2 ${mine ? "justify-end" : "justify-start"} ${it.showMeta ? "mt-1.5" : ""}`}
                >
                  {!mine && (
                    <div className="w-7 shrink-0">
                      {tail && (
                        <ChatAvatar
                          value={profile?.avatar_url}
                          fallback={initialsFor(m.user_id)}
                          color={senderColor}
                        />
                      )}
                    </div>
                  )}
                  <div
                    className="relative max-w-[85%] sm:max-w-[70%] px-2.5 pt-1.5 pb-1.5 text-[14.2px] leading-[19px] break-words"
                    style={{
                      background: bubbleBg,
                      color: bubbleColor,
                      borderRadius: tail
                        ? mine
                          ? "10px 10px 0 10px"
                          : "10px 10px 10px 0"
                        : "10px",
                      boxShadow: isDark ? "0 1px 0.5px rgba(0,0,0,0.35)" : "0 1px 0.5px rgba(11,20,26,0.13)",
                    }}
                  >
                    {tail && (
                      <svg
                        viewBox="0 0 8 13"
                        width="8"
                        height="13"
                        className="absolute top-0"
                        style={{
                          [mine ? "right" : "left"]: -6,
                          transform: mine ? "scaleX(-1)" : undefined,
                          color: bubbleBg,
                        } as React.CSSProperties}
                        aria-hidden
                      >
                        <path d="M1.533 3.568L8 12.193V1H2.812C1.042 1 .474 2.156 1.533 3.568z" fill="currentColor" />
                      </svg>
                    )}

                    {it.showMeta && !mine && (
                      <div className="text-[13px] font-medium mb-0.5" style={{ color: senderColor }}>
                        {nameFor(m.user_id)}
                      </div>
                    )}

                    {isImage && (
                      <div className="mb-1 -mx-1 -mt-0.5">
                        <ImageBubble path={m.attachment_url!} name={m.attachment_name} onOpen={(u) => setLightbox(u)} />
                      </div>
                    )}
                    {isAudio && (
                      <div className="py-1">
                        <AudioBubble path={m.attachment_url!} mine={mine} isDark={isDark} duration={m.audio_duration} />
                      </div>
                    )}
                    {isFile && (
                      <div className="py-1">
                        <FileBubble path={m.attachment_url!} name={m.attachment_name} size={m.attachment_size} mime={m.attachment_mime} isDark={isDark} mine={mine} />
                      </div>
                    )}

                    {m.content && (
                      <div className="pr-[58px] whitespace-pre-wrap">{m.content}</div>
                    )}

                    <div
                      className={`flex items-center gap-1 text-[11px] select-none ${(isAudio || isFile) && !m.content ? "justify-end mt-0.5" : "absolute right-2 bottom-1"}`}
                      style={{ color: mine ? (isDark ? "#a8c7bd" : "#667781") : wa.metaText }}
                    >
                      <span>{time}</span>
                      {mine && (
                        <CheckCheck className="w-3.5 h-3.5" style={{ color: "#53bdeb" }} />
                      )}
                    </div>

                    {canDelete && (
                      <button
                        onClick={() => onDelete(m.id)}
                        className={`absolute -top-2 ${mine ? "-left-2" : "-right-2"} opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 rounded-full flex items-center justify-center`}
                        style={{
                          background: isDark ? "#2a3942" : "#ffffff",
                          color: isDark ? "#e9edef" : "#54656f",
                          border: `1px solid ${isDark ? "#0c1317" : "#d1d7db"}`,
                          boxShadow: "0 2px 6px rgba(0,0,0,0.25)",
                        }}
                        aria-label="Apagar"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!atBottom && items.length > 0 && (
          <button
            onClick={scrollDown}
            className="sticky bottom-3 ml-auto block h-10 w-10 rounded-full shadow-lg"
            style={{ background: wa.composer, color: wa.iconBtn, border: isDark ? "1px solid #0c1317" : "1px solid #d1d7db" }}
            aria-label="Ir para o final"
          >
            <ArrowDown className="w-4 h-4 mx-auto" />
          </button>
        )}
      </div>

      {/* Emoji picker */}
      {showEmoji && (
        <div className="px-3 py-2 grid grid-cols-8 gap-1" style={{ background: wa.composer, borderTop: isDark ? "1px solid #0c1317" : "1px solid #d1d7db" }}>
          {QUICK_EMOJIS.map((e) => (
            <button
              key={e}
              onClick={() => { setInput((v) => v + e); textareaRef.current?.focus(); }}
              className="h-9 rounded-md text-xl hover:bg-black/10"
              style={{ background: "transparent" }}
            >
              {e}
            </button>
          ))}
        </div>
      )}

      {/* Composer */}
      <div
        className="px-2 sm:px-3 py-2 flex items-end gap-2"
        style={{ background: wa.composer, borderTop: isDark ? "1px solid #0c1317" : "1px solid #d1d7db" }}
      >
        {recording ? (
          <div className="flex-1 flex items-center justify-between rounded-3xl px-4 py-2.5"
            style={{ background: wa.inputBg, border: isDark ? "1px solid #0c1317" : "1px solid #e9edef" }}>
            <div className="flex items-center gap-2 text-[14px]" style={{ color: isDark ? "#e9edef" : "#111b21" }}>
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
              </span>
              Gravando · {formatDuration(recElapsed)}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => void stopRecording(true)}
                className="h-9 w-9 rounded-full flex items-center justify-center"
                style={{ background: "rgba(244,67,54,0.15)", color: "#f44336" }}
                aria-label="Cancelar"
              >
                <X className="w-4 h-4" />
              </button>
              <button
                onClick={() => void stopRecording(false)}
                className="h-9 px-3 rounded-full flex items-center gap-1.5 text-white font-medium text-[13px]"
                style={{ background: wa.sendBg }}
                aria-label="Enviar áudio"
              >
                <Square className="w-3.5 h-3.5 fill-white" /> Enviar
              </button>
            </div>
          </div>
        ) : (
          <>
            <button
              onClick={() => setShowEmoji((v) => !v)}
              disabled={composerDisabled}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/10 disabled:opacity-50 shrink-0"
              style={{ color: wa.iconBtn }}
              aria-label="Emoji"
            >
              <Smile className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileImgRef.current?.click()}
              disabled={composerDisabled}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/10 disabled:opacity-50 shrink-0"
              style={{ color: wa.iconBtn }}
              aria-label="Imagem"
            >
              <ImageIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => fileAnyRef.current?.click()}
              disabled={composerDisabled}
              className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-black/10 disabled:opacity-50 shrink-0"
              style={{ color: wa.iconBtn }}
              aria-label="Anexar arquivo"
            >
              <Paperclip className="w-5 h-5" />
            </button>

            <div
              className="flex-1 flex items-center rounded-3xl px-4 py-1.5"
              style={{ background: wa.inputBg, border: isDark ? "1px solid #0c1317" : "1px solid #e9edef" }}
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendText();
                  }
                }}
                maxLength={2000}
                rows={1}
                placeholder={user ? (uploading ? "Enviando..." : "Mensagem") : "Faça login para conversar"}
                disabled={!user || sending || uploading}
                className="flex-1 bg-transparent outline-none resize-none text-[14.5px] leading-[20px] max-h-32 disabled:opacity-60"
                style={{ color: isDark ? "#e9edef" : "#111b21" }}
              />
            </div>

            {input.trim() ? (
              <button
                onClick={() => void sendText()}
                disabled={!user || sending || !input.trim()}
                className="h-11 w-11 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95 shrink-0"
                style={{ background: wa.sendBg }}
                aria-label="Enviar"
              >
                <Send className="w-5 h-5" />
              </button>
            ) : (
              <button
                onClick={() => void startRecording()}
                disabled={composerDisabled}
                className="h-11 w-11 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95 shrink-0"
                style={{ background: wa.sendBg }}
                aria-label="Gravar áudio"
              >
                <Mic className="w-5 h-5" />
              </button>
            )}
          </>
        )}

        <input ref={fileImgRef} type="file" accept="image/*" className="hidden" onChange={onPickImage} />
        <input ref={fileAnyRef} type="file" className="hidden" onChange={onPickFile} />
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.85)" }}
          onClick={() => setLightbox(null)}
        >
          <button
            onClick={(e) => { e.stopPropagation(); setLightbox(null); }}
            className="absolute top-4 right-4 h-10 w-10 rounded-full flex items-center justify-center text-white"
            style={{ background: "rgba(255,255,255,0.1)" }}
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-lg object-contain" />
        </div>
      )}
    </div>
  );
}
