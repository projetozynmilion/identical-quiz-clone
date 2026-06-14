import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Trash2, Check, CheckCheck } from "lucide-react";

type ChatMessage = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
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
  C: {
    bg: string;
    surface: string;
    border: string;
    text: string;
    textMuted: string;
    hover: string;
  };
}

// WhatsApp-style sender name colors
const NAME_COLORS = [
  "#06cf9c", "#e542a3", "#3b9eff", "#ff8a3d", "#b388ff",
  "#ffd166", "#06b6d4", "#f87171", "#a3e635", "#fb7185",
];
const colorForUser = (id: string) => {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return NAME_COLORS[h % NAME_COLORS.length];
};

// WhatsApp doodle background (SVG, encoded)
const WA_DOODLE_DARK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='%23ffffff' stroke-opacity='0.035' stroke-width='1.4'><circle cx='30' cy='40' r='10'/><path d='M70 30c8-8 22-8 30 0s8 22 0 30'/><path d='M150 50l14 0 0 14'/><circle cx='190' cy='30' r='4' fill='%23ffffff' fill-opacity='0.04'/><path d='M20 110q20-20 40 0t40 0t40 0t40 0t40 0'/><path d='M30 170c10-6 20-6 30 0s20 6 30 0'/><path d='M150 150l10 10 10-10 10 10'/><circle cx='180' cy='190' r='8'/><path d='M60 200l8-14 8 14z'/></g></svg>\")";
const WA_DOODLE_LIGHT =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'><g fill='none' stroke='%23000000' stroke-opacity='0.05' stroke-width='1.4'><circle cx='30' cy='40' r='10'/><path d='M70 30c8-8 22-8 30 0s8 22 0 30'/><path d='M150 50l14 0 0 14'/><circle cx='190' cy='30' r='4' fill='%23000000' fill-opacity='0.05'/><path d='M20 110q20-20 40 0t40 0t40 0t40 0t40 0'/><path d='M30 170c10-6 20-6 30 0s20 6 30 0'/><path d='M150 150l10 10 10-10 10 10'/><circle cx='180' cy='190' r='8'/><path d='M60 200l8-14 8 14z'/></g></svg>\")";

export default function CommunityChat({ user, isAdmin, isDark, C }: CommunityChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  const loadProfiles = async (ids: string[]) => {
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
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .order("created_at", { ascending: true })
        .limit(200);
      if (!mounted) return;
      if (error) {
        toast.error("Erro ao carregar chat");
      } else if (data) {
        setMessages(data as ChatMessage[]);
        await loadProfiles(Array.from(new Set((data as ChatMessage[]).map((m) => m.user_id))));
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
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const send = async () => {
    const text = input.trim();
    if (!text || !user || sending) return;
    setSending(true);
    const { error } = await supabase
      .from("chat_messages")
      .insert({ user_id: user.id, content: text });
    if (error) toast.error("Não foi possível enviar");
    else setInput("");
    setSending(false);
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar");
  };

  const nameFor = (id: string) => {
    const p = profiles[id];
    return p?.full_name || p?.username || "Membro";
  };
  const initialsFor = (id: string) => {
    const n = nameFor(id);
    return n.split(" ").map((s) => s[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();
  };

  // Group with day separators + consecutive-sender collapse
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

  // WhatsApp palette
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
      };

  return (
    <div
      className="rounded-2xl flex flex-col overflow-hidden"
      style={{ border: `1px solid ${C.border}`, height: "min(75vh, 760px)", background: wa.body }}
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
        className="flex-1 overflow-y-auto px-3 sm:px-6 py-3"
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
          <div className="flex justify-center mt-6">
            <span
              className="px-3 py-1.5 rounded-md text-[12px] shadow-sm"
              style={{ background: wa.daypill, color: wa.daypillText }}
            >
              Sem mensagens ainda. Manda a primeira 👋
            </span>
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
              return (
                <div
                  key={it.key}
                  className={`group flex w-full ${mine ? "justify-end" : "justify-start"} ${it.showMeta ? "mt-1.5" : ""}`}
                >
                  <div
                    className="relative max-w-[85%] sm:max-w-[70%] px-2.5 pt-1.5 pb-1.5 text-[14.2px] leading-[19px] break-words"
                    style={{
                      background: bubbleBg,
                      color: bubbleColor,
                      borderRadius: tail
                        ? mine
                          ? "7.5px 7.5px 0 7.5px"
                          : "7.5px 7.5px 7.5px 0"
                        : "7.5px",
                      boxShadow: isDark ? "0 1px 0.5px rgba(0,0,0,0.35)" : "0 1px 0.5px rgba(11,20,26,0.13)",
                      marginLeft: !mine && tail ? 6 : 0,
                      marginRight: mine && tail ? 6 : 0,
                    }}
                  >
                    {/* tail */}
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

                    <div className="pr-[58px] whitespace-pre-wrap">{m.content}</div>

                    <div
                      className="absolute right-2 bottom-1 flex items-center gap-1 text-[11px] select-none"
                      style={{ color: mine ? (isDark ? "#a8c7bd" : "#667781") : wa.metaText }}
                    >
                      <span>{time}</span>
                      {mine && (
                        <CheckCheck className="w-3.5 h-3.5" style={{ color: isDark ? "#53bdeb" : "#53bdeb" }} />
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
      </div>

      {/* Composer */}
      <div
        className="px-3 py-2.5 flex items-end gap-2"
        style={{ background: wa.composer, borderTop: isDark ? "1px solid #0c1317" : "1px solid #d1d7db" }}
      >
        <div
          className="flex-1 flex items-center rounded-3xl px-4 py-2"
          style={{ background: wa.inputBg, border: isDark ? "1px solid #0c1317" : "1px solid #e9edef" }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            maxLength={2000}
            rows={1}
            placeholder={user ? "Mensagem" : "Faça login para conversar"}
            disabled={!user || sending}
            className="flex-1 bg-transparent outline-none resize-none text-[14.5px] leading-[20px] max-h-32 disabled:opacity-60"
            style={{ color: isDark ? "#e9edef" : "#111b21" }}
          />
        </div>
        <button
          onClick={() => void send()}
          disabled={!user || sending || !input.trim()}
          className="h-11 w-11 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95 shrink-0"
          style={{ background: wa.sendBg }}
          aria-label="Enviar"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
