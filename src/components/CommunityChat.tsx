import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Send, Trash2 } from "lucide-react";

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
    if (error) {
      toast.error("Não foi possível enviar");
    } else {
      setInput("");
    }
    setSending(false);
  };

  const onDelete = async (id: string) => {
    const { error } = await supabase.from("chat_messages").delete().eq("id", id);
    if (error) toast.error("Não foi possível apagar");
  };

  const groups = useMemo(() => {
    // simple chronological list; no grouping needed
    return messages;
  }, [messages]);

  const nameFor = (id: string) => {
    const p = profiles[id];
    return p?.full_name || p?.username || "Membro";
  };
  const initialsFor = (id: string) => {
    const n = nameFor(id);
    return n
      .split(" ")
      .map((s) => s[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div
      className="rounded-3xl flex flex-col overflow-hidden"
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        height: "min(72vh, 720px)",
      }}
    >
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ borderBottom: `1px solid ${C.border}` }}
      >
        <div>
          <div className="text-[15px] font-semibold" style={{ color: C.text }}>
            Chat ao vivo
          </div>
          <div className="text-[12px]" style={{ color: C.textMuted }}>
            Comunidade · {messages.length} mensagens
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500" />
          </span>
          <span className="text-[12px]" style={{ color: C.textMuted }}>
            online
          </span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {loading ? (
          <div className="text-center text-[13px]" style={{ color: C.textMuted }}>
            Carregando...
          </div>
        ) : groups.length === 0 ? (
          <div className="text-center text-[13px]" style={{ color: C.textMuted }}>
            Seja o primeiro a mandar uma mensagem 👋
          </div>
        ) : (
          groups.map((m) => {
            const mine = user?.id === m.user_id;
            const canDelete = mine || isAdmin;
            const time = new Date(m.created_at).toLocaleTimeString("pt-BR", {
              hour: "2-digit",
              minute: "2-digit",
            });
            const avatarUrl = profiles[m.user_id]?.avatar_url;
            return (
              <div
                key={m.id}
                className={`flex gap-3 group ${mine ? "flex-row-reverse" : ""}`}
              >
                <div
                  className="h-8 w-8 rounded-full flex items-center justify-center text-[11px] font-semibold shrink-0 overflow-hidden"
                  style={{
                    background: isDark ? "#3a2418" : "#ffe9d6",
                    color: isDark ? "#ffb37a" : "#9a4a14",
                    border: `1px solid ${C.border}`,
                  }}
                >
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="" className="h-full w-full object-cover" />
                  ) : (
                    initialsFor(m.user_id)
                  )}
                </div>

                <div className={`max-w-[78%] ${mine ? "items-end" : "items-start"} flex flex-col`}>
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-[12px] font-medium" style={{ color: C.text }}>
                      {mine ? "Você" : nameFor(m.user_id)}
                    </span>
                    <span className="text-[11px]" style={{ color: C.textMuted }}>
                      {time}
                    </span>
                  </div>
                  <div
                    className="rounded-2xl px-3.5 py-2 text-[14px] leading-snug break-words"
                    style={{
                      background: mine
                        ? "linear-gradient(160deg, #ff7a00, #ff5b14)"
                        : isDark
                          ? "#2a2a30"
                          : "#f3f4f7",
                      color: mine ? "#fff" : C.text,
                      border: mine ? "1px solid rgba(255,255,255,0.08)" : `1px solid ${C.border}`,
                    }}
                  >
                    {m.content}
                  </div>
                  {canDelete && (
                    <button
                      onClick={() => onDelete(m.id)}
                      className="text-[11px] mt-1 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                      style={{ color: C.textMuted }}
                    >
                      <Trash2 className="w-3 h-3" /> apagar
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div
        className="p-3 flex items-center gap-2"
        style={{ borderTop: `1px solid ${C.border}`, background: isDark ? "#202026" : "#fafafa" }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              void send();
            }
          }}
          maxLength={2000}
          placeholder={user ? "Escreva uma mensagem..." : "Faça login para conversar"}
          disabled={!user || sending}
          className="flex-1 h-11 px-4 rounded-full text-[14px] outline-none disabled:opacity-60"
          style={{
            background: isDark ? "#16161a" : "#fff",
            color: C.text,
            border: `1px solid ${C.border}`,
          }}
        />
        <button
          onClick={() => void send()}
          disabled={!user || sending || !input.trim()}
          className="h-11 w-11 rounded-full flex items-center justify-center text-white disabled:opacity-50 transition-transform active:scale-95"
          style={{
            background: "linear-gradient(160deg, #ff7a00, #ff5b14)",
            boxShadow: "0 8px 22px -10px rgba(255,122,0,0.7)",
          }}
          aria-label="Enviar"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
