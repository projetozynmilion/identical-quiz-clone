import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Calendar, Library, Briefcase, Bell, BarChart3, Users2, Handshake,
  Plus, ExternalLink, Download, CheckCheck, Send, Trash2,
} from "lucide-react";

type Props = {
  user: any;
  isAdmin: boolean;
  isDark: boolean;
  C: any;
};

const NICHE_OPTIONS = ["beleza", "moda", "fitness", "casa", "tech", "maternidade", "pet", "food", "outro"];

export default function ComunidadePlus({ user, isAdmin, isDark, C }: Props) {
  const [tab, setTab] = useState("agenda");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold" style={{ color: C.text }}>Comunidade+</h1>
        <p className="text-sm" style={{ color: C.muted }}>Lives, biblioteca, vagas, notificações, analytics, grupos e parcerias</p>
      </div>

      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="w-full flex flex-wrap h-auto justify-start gap-1 bg-transparent p-0">
          <TabsTrigger value="agenda" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Calendar className="w-4 h-4 mr-1" />Agenda</TabsTrigger>
          <TabsTrigger value="biblioteca" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Library className="w-4 h-4 mr-1" />Biblioteca</TabsTrigger>
          <TabsTrigger value="vagas" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Briefcase className="w-4 h-4 mr-1" />Vagas</TabsTrigger>
          <TabsTrigger value="notif" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Bell className="w-4 h-4 mr-1" />Avisos</TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><BarChart3 className="w-4 h-4 mr-1" />Meu progresso</TabsTrigger>
          <TabsTrigger value="grupos" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Users2 className="w-4 h-4 mr-1" />Grupos</TabsTrigger>
          <TabsTrigger value="parcerias" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"><Handshake className="w-4 h-4 mr-1" />Parcerias</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda"><AgendaLives user={user} isAdmin={isAdmin} C={C} /></TabsContent>
        <TabsContent value="biblioteca"><Biblioteca user={user} isAdmin={isAdmin} C={C} /></TabsContent>
        <TabsContent value="vagas"><Vagas user={user} isAdmin={isAdmin} C={C} /></TabsContent>
        <TabsContent value="notif"><Notificacoes user={user} C={C} /></TabsContent>
        <TabsContent value="analytics"><MeuProgresso user={user} C={C} /></TabsContent>
        <TabsContent value="grupos"><GruposNicho user={user} C={C} /></TabsContent>
        <TabsContent value="parcerias"><Parcerias user={user} C={C} /></TabsContent>
      </Tabs>
    </div>
  );
}

/* ============== AGENDA DE LIVES ============== */
function AgendaLives({ user, isAdmin, C }: any) {
  const [lives, setLives] = useState<any[]>([]);
  const [rsvps, setRsvps] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", host: "", scheduled_at: "", youtube_url: "", cover_url: "" });

  const load = async () => {
    const { data } = await supabase.from("lives").select("*").order("scheduled_at", { ascending: true });
    setLives(data || []);
    if (user) {
      const { data: r } = await supabase.from("live_rsvps").select("live_id").eq("user_id", user.id);
      setRsvps(new Set((r || []).map((x: any) => x.live_id)));
    }
  };
  useEffect(() => { load(); }, [user?.id]);

  const toggleRsvp = async (liveId: string) => {
    if (!user) return;
    if (rsvps.has(liveId)) {
      await supabase.from("live_rsvps").delete().eq("live_id", liveId).eq("user_id", user.id);
    } else {
      await supabase.from("live_rsvps").insert({ live_id: liveId, user_id: user.id });
    }
    load();
  };

  const create = async () => {
    if (!form.title || !form.scheduled_at) return toast.error("Título e data obrigatórios");
    const { error } = await supabase.from("lives").insert({ ...form, created_by: user.id });
    if (error) return toast.error(error.message);
    toast.success("Live criada");
    setOpen(false);
    setForm({ title: "", description: "", host: "", scheduled_at: "", youtube_url: "", cover_url: "" });
    load();
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Agendar live</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova live</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Host</Label><Input value={form.host} onChange={e => setForm({ ...form, host: e.target.value })} /></div>
              <div><Label>Data/hora</Label><Input type="datetime-local" value={form.scheduled_at} onChange={e => setForm({ ...form, scheduled_at: e.target.value })} /></div>
              <div><Label>Link YouTube</Label><Input value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} /></div>
              <div><Label>Capa (URL)</Label><Input value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} /></div>
              <Button onClick={create} className="w-full">Criar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {lives.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Nenhuma live agendada ainda.</p>}
        {lives.map((l) => {
          const when = new Date(l.scheduled_at);
          const past = when.getTime() < Date.now();
          return (
            <Card key={l.id} className="p-4" style={{ background: C.cardBg, borderColor: C.border }}>
              {l.cover_url && <img src={l.cover_url} alt={l.title} className="w-full h-32 object-cover rounded mb-3" />}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-bold" style={{ color: C.text }}>{l.title}</h3>
                  <p className="text-xs" style={{ color: C.muted }}>{when.toLocaleString("pt-BR")} {l.host && `· ${l.host}`}</p>
                </div>
                <Badge variant={past ? "secondary" : "default"}>{past ? "encerrada" : "agendada"}</Badge>
              </div>
              {l.description && <p className="text-sm mt-2" style={{ color: C.text }}>{l.description}</p>}
              <div className="flex gap-2 mt-3">
                {l.youtube_url && <Button size="sm" variant="outline" asChild><a href={l.youtube_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3 mr-1" />Abrir</a></Button>}
                {!past && <Button size="sm" variant={rsvps.has(l.id) ? "default" : "outline"} onClick={() => toggleRsvp(l.id)}>{rsvps.has(l.id) ? "✓ Confirmado" : "Confirmar presença"}</Button>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

/* ============== BIBLIOTECA ============== */
function Biblioteca({ user, isAdmin, C }: any) {
  const [items, setItems] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", category: "geral", file_url: "", external_url: "", thumbnail_url: "" });
  const [cat, setCat] = useState<string>("todas");

  const load = async () => {
    const { data } = await supabase.from("resources").select("*").order("created_at", { ascending: false });
    setItems(data || []);
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.title) return toast.error("Título obrigatório");
    const { error } = await supabase.from("resources").insert({ ...form, created_by: user.id });
    if (error) return toast.error(error.message);
    toast.success("Recurso adicionado");
    setOpen(false);
    setForm({ title: "", description: "", category: "geral", file_url: "", external_url: "", thumbnail_url: "" });
    load();
  };

  const categories = ["todas", "música", "presets", "templates", "efeitos", "fontes", "geral"];
  const filtered = cat === "todas" ? items : items.filter(i => i.category === cat);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {categories.map(c => (
            <Button key={c} size="sm" variant={cat === c ? "default" : "outline"} onClick={() => setCat(c)}>{c}</Button>
          ))}
        </div>
        {isAdmin && (
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Adicionar</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Novo recurso</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
                <div><Label>Categoria</Label>
                  <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{categories.filter(c => c !== "todas").map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Link de download</Label><Input value={form.file_url} onChange={e => setForm({ ...form, file_url: e.target.value })} /></div>
                <div><Label>Link externo (opcional)</Label><Input value={form.external_url} onChange={e => setForm({ ...form, external_url: e.target.value })} /></div>
                <div><Label>Thumbnail (URL)</Label><Input value={form.thumbnail_url} onChange={e => setForm({ ...form, thumbnail_url: e.target.value })} /></div>
                <Button onClick={create} className="w-full">Adicionar</Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {filtered.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Nada por aqui ainda.</p>}
        {filtered.map(r => (
          <Card key={r.id} className="p-4 flex flex-col" style={{ background: C.cardBg, borderColor: C.border }}>
            {r.thumbnail_url && <img src={r.thumbnail_url} alt={r.title} className="w-full h-28 object-cover rounded mb-2" />}
            <Badge variant="secondary" className="self-start mb-2">{r.category}</Badge>
            <h3 className="font-bold" style={{ color: C.text }}>{r.title}</h3>
            {r.description && <p className="text-xs mt-1 flex-1" style={{ color: C.muted }}>{r.description}</p>}
            <div className="flex gap-2 mt-3">
              {r.file_url && <Button size="sm" asChild><a href={r.file_url} target="_blank" rel="noreferrer"><Download className="w-3 h-3 mr-1" />Baixar</a></Button>}
              {r.external_url && <Button size="sm" variant="outline" asChild><a href={r.external_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3" /></a></Button>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

/* ============== VAGAS ============== */
function Vagas({ user, isAdmin, C }: any) {
  const [jobs, setJobs] = useState<any[]>([]);
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState(false);
  const [applyOpen, setApplyOpen] = useState<string | null>(null);
  const [applyMsg, setApplyMsg] = useState({ message: "", portfolio_url: "" });
  const [form, setForm] = useState({ title: "", brand: "", description: "", budget: "", deadline: "", contact: "", niche: "" });

  const load = async () => {
    const { data } = await supabase.from("jobs").select("*").eq("status", "open").order("created_at", { ascending: false });
    setJobs(data || []);
    if (user) {
      const { data: a } = await supabase.from("job_applications").select("job_id").eq("user_id", user.id);
      setApplied(new Set((a || []).map((x: any) => x.job_id)));
    }
  };
  useEffect(() => { load(); }, [user?.id]);

  const create = async () => {
    if (!form.title || !form.brand || !form.description) return toast.error("Preencha os campos obrigatórios");
    const payload: any = { ...form, created_by: user.id };
    if (!payload.deadline) delete payload.deadline;
    const { error } = await supabase.from("jobs").insert(payload);
    if (error) return toast.error(error.message);
    toast.success("Vaga publicada");
    setOpen(false);
    setForm({ title: "", brand: "", description: "", budget: "", deadline: "", contact: "", niche: "" });
    load();
  };

  const apply = async (jobId: string) => {
    const { error } = await supabase.from("job_applications").insert({ job_id: jobId, user_id: user.id, ...applyMsg });
    if (error) return toast.error(error.message);
    toast.success("Candidatura enviada");
    setApplyOpen(null);
    setApplyMsg({ message: "", portfolio_url: "" });
    load();
  };

  return (
    <div className="space-y-4">
      {isAdmin && (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Publicar vaga</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Nova vaga UGC</DialogTitle></DialogHeader>
            <div className="space-y-3 max-h-[70vh] overflow-y-auto">
              <div><Label>Título</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div><Label>Marca</Label><Input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></div>
              <div><Label>Descrição</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
              <div><Label>Orçamento</Label><Input value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="R$ 500 por vídeo" /></div>
              <div><Label>Prazo</Label><Input type="date" value={form.deadline} onChange={e => setForm({ ...form, deadline: e.target.value })} /></div>
              <div><Label>Contato</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="WhatsApp / e-mail" /></div>
              <div><Label>Nicho</Label>
                <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>{NICHE_OPTIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button onClick={create} className="w-full">Publicar</Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {jobs.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Nenhuma vaga aberta no momento.</p>}
        {jobs.map(j => (
          <Card key={j.id} className="p-4" style={{ background: C.cardBg, borderColor: C.border }}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="font-bold" style={{ color: C.text }}>{j.title}</h3>
                <p className="text-xs" style={{ color: C.muted }}>{j.brand} {j.niche && `· ${j.niche}`}</p>
              </div>
              {j.budget && <Badge>{j.budget}</Badge>}
            </div>
            <p className="text-sm mt-2 line-clamp-3" style={{ color: C.text }}>{j.description}</p>
            {j.deadline && <p className="text-xs mt-2" style={{ color: C.muted }}>Prazo: {new Date(j.deadline).toLocaleDateString("pt-BR")}</p>}
            <div className="mt-3">
              {applied.has(j.id)
                ? <Badge variant="secondary">✓ Candidatura enviada</Badge>
                : <Button size="sm" onClick={() => setApplyOpen(j.id)}>Candidatar-se</Button>}
            </div>
          </Card>
        ))}
      </div>
      <Dialog open={!!applyOpen} onOpenChange={(o) => !o && setApplyOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Candidatar-se</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div><Label>Mensagem</Label><Textarea value={applyMsg.message} onChange={e => setApplyMsg({ ...applyMsg, message: e.target.value })} placeholder="Conte por que você é a pessoa certa" /></div>
            <div><Label>Portfólio (link)</Label><Input value={applyMsg.portfolio_url} onChange={e => setApplyMsg({ ...applyMsg, portfolio_url: e.target.value })} /></div>
            <Button onClick={() => applyOpen && apply(applyOpen)} className="w-full">Enviar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

/* ============== NOTIFICAÇÕES ============== */
function Notificacoes({ user, C }: any) {
  const [notifs, setNotifs] = useState<any[]>([]);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
    setNotifs(data || []);
  };
  useEffect(() => { load(); }, [user?.id]);

  const markAll = async () => {
    await supabase.from("notifications").update({ read: true }).eq("user_id", user.id).eq("read", false);
    load();
  };
  const del = async (id: string) => {
    await supabase.from("notifications").delete().eq("id", id);
    load();
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm" style={{ color: C.muted }}>{notifs.filter(n => !n.read).length} não lidas</p>
        {notifs.some(n => !n.read) && <Button size="sm" variant="outline" onClick={markAll}><CheckCheck className="w-3 h-3 mr-1" />Marcar todas</Button>}
      </div>
      {notifs.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Sem avisos no momento.</p>}
      {notifs.map(n => (
        <Card key={n.id} className="p-3 flex items-start gap-3" style={{ background: n.read ? C.cardBg : (C.cardBg + "ee"), borderColor: n.read ? C.border : "#0a84ff" }}>
          <div className="text-xl">{n.icon || "🔔"}</div>
          <div className="flex-1">
            <p className="font-semibold text-sm" style={{ color: C.text }}>{n.title}</p>
            {n.body && <p className="text-xs mt-1" style={{ color: C.muted }}>{n.body}</p>}
            <p className="text-[10px] mt-1" style={{ color: C.muted }}>{new Date(n.created_at).toLocaleString("pt-BR")}</p>
            {n.link && <a href={n.link} target="_blank" rel="noreferrer" className="text-xs underline" style={{ color: "#0a84ff" }}>Abrir</a>}
          </div>
          <Button size="icon" variant="ghost" onClick={() => del(n.id)}><Trash2 className="w-3 h-3" /></Button>
        </Card>
      ))}
    </div>
  );
}

/* ============== MEU PROGRESSO (analytics pessoal) ============== */
function MeuProgresso({ user, C }: any) {
  const [stats, setStats] = useState({ totalSales: 0, victories: 0, badges: 0, posts: 0, likes: 0 });

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [v, b, p, l] = await Promise.all([
        supabase.from("victories").select("amount").eq("user_id", user.id),
        supabase.from("user_badges").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("community_posts").select("id", { count: "exact", head: true }).eq("author_id", user.id),
        supabase.from("community_post_likes").select("post_id", { count: "exact", head: true }).eq("user_id", user.id),
      ]);
      const sales = (v.data || []).reduce((sum: number, x: any) => sum + Number(x.amount || 0), 0);
      setStats({
        totalSales: sales,
        victories: (v.data || []).length,
        badges: b.count || 0,
        posts: p.count || 0,
        likes: l.count || 0,
      });
    })();
  }, [user?.id]);

  const cards = [
    { label: "Vendas registradas", value: `R$ ${stats.totalSales.toLocaleString("pt-BR")}`, icon: "💰" },
    { label: "Vitórias publicadas", value: stats.victories, icon: "🏆" },
    { label: "Medalhas", value: stats.badges, icon: "🎖️" },
    { label: "Posts na comunidade", value: stats.posts, icon: "📝" },
    { label: "Curtidas dadas", value: stats.likes, icon: "❤️" },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((c) => (
        <Card key={c.label} className="p-4" style={{ background: C.cardBg, borderColor: C.border }}>
          <div className="text-2xl">{c.icon}</div>
          <p className="text-xs mt-2" style={{ color: C.muted }}>{c.label}</p>
          <p className="text-2xl font-bold mt-1" style={{ color: C.text }}>{c.value}</p>
        </Card>
      ))}
    </div>
  );
}

/* ============== GRUPOS DE NICHO ============== */
function GruposNicho({ user, C }: any) {
  const [groups, setGroups] = useState<any[]>([]);
  const [memberOf, setMemberOf] = useState<Set<string>>(new Set());
  const [active, setActive] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [text, setText] = useState("");

  const loadGroups = async () => {
    const { data } = await supabase.from("niche_groups").select("*").order("name");
    setGroups(data || []);
    if (user) {
      const { data: m } = await supabase.from("group_members").select("group_id").eq("user_id", user.id);
      setMemberOf(new Set((m || []).map((x: any) => x.group_id)));
    }
  };
  useEffect(() => { loadGroups(); }, [user?.id]);

  const loadMessages = async (gid: string) => {
    const { data } = await supabase.from("group_messages").select("*").eq("group_id", gid).order("created_at", { ascending: true }).limit(100);
    setMessages(data || []);
    const ids = Array.from(new Set((data || []).map((m: any) => m.user_id)));
    if (ids.length) {
      const { data: pr } = await supabase.from("profiles").select("id,full_name,username,avatar_url").in("id", ids);
      const map: Record<string, any> = {};
      (pr || []).forEach((p: any) => { map[p.id] = p; });
      setProfiles(map);
    }
  };

  useEffect(() => {
    if (!active) return;
    loadMessages(active);
    const ch = supabase.channel(`group-${active}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "group_messages", filter: `group_id=eq.${active}` },
        () => loadMessages(active))
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [active]);

  const join = async (gid: string) => {
    await supabase.from("group_members").insert({ group_id: gid, user_id: user.id });
    loadGroups();
  };
  const leave = async (gid: string) => {
    await supabase.from("group_members").delete().eq("group_id", gid).eq("user_id", user.id);
    if (active === gid) setActive(null);
    loadGroups();
  };

  const send = async () => {
    if (!text.trim() || !active) return;
    const { error } = await supabase.from("group_messages").insert({ group_id: active, user_id: user.id, content: text.trim() });
    if (error) return toast.error(error.message);
    setText("");
  };

  if (active) {
    const g = groups.find(x => x.id === active);
    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Button size="sm" variant="ghost" onClick={() => setActive(null)}>← Voltar</Button>
          <h3 className="font-bold" style={{ color: C.text }}>{g?.emoji} {g?.name}</h3>
          <Button size="sm" variant="outline" onClick={() => leave(active)}>Sair</Button>
        </div>
        <Card className="p-3 h-[400px] overflow-y-auto space-y-2" style={{ background: C.cardBg, borderColor: C.border }}>
          {messages.length === 0 && <p className="text-sm text-center" style={{ color: C.muted }}>Seja o primeiro a escrever 👋</p>}
          {messages.map(m => {
            const p = profiles[m.user_id];
            return (
              <div key={m.id} className="flex gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold shrink-0">
                  {(p?.full_name || p?.username || "?")[0]?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xs font-semibold" style={{ color: C.text }}>{p?.full_name || p?.username || "Membro"}</p>
                  <p className="text-sm" style={{ color: C.text }}>{m.content}</p>
                </div>
              </div>
            );
          })}
        </Card>
        <div className="flex gap-2">
          <Input value={text} onChange={e => setText(e.target.value)} placeholder="Mensagem..." onKeyDown={e => e.key === "Enter" && send()} />
          <Button onClick={send}><Send className="w-4 h-4" /></Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {groups.map(g => (
        <Card key={g.id} className="p-4" style={{ background: C.cardBg, borderColor: C.border }}>
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg" style={{ color: C.text }}>{g.emoji} {g.name}</h3>
              <p className="text-xs mt-1" style={{ color: C.muted }}>{g.description}</p>
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            {memberOf.has(g.id)
              ? <Button size="sm" onClick={() => setActive(g.id)}>Entrar na sala</Button>
              : <Button size="sm" variant="outline" onClick={() => join(g.id)}>Participar</Button>}
          </div>
        </Card>
      ))}
    </div>
  );
}

/* ============== PARCERIAS ============== */
function Parcerias({ user, C }: any) {
  const [list, setList] = useState<any[]>([]);
  const [profiles, setProfiles] = useState<Record<string, any>>({});
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"all" | "creator" | "brand">("all");
  const [form, setForm] = useState({ kind: "creator", niche: "beleza", bio: "", contact: "", portfolio_url: "" });

  const load = async () => {
    const { data } = await supabase.from("partnerships").select("*").eq("active", true).order("created_at", { ascending: false });
    setList(data || []);
    const ids = Array.from(new Set((data || []).map((x: any) => x.user_id)));
    if (ids.length) {
      const { data: pr } = await supabase.from("profiles").select("id,full_name,username,avatar_url").in("id", ids);
      const map: Record<string, any> = {};
      (pr || []).forEach((p: any) => { map[p.id] = p; });
      setProfiles(map);
    }
  };
  useEffect(() => { load(); }, []);

  const create = async () => {
    if (!form.bio || !form.contact) return toast.error("Bio e contato obrigatórios");
    const { error } = await supabase.from("partnerships").insert({ ...form, user_id: user.id });
    if (error) return toast.error(error.message);
    toast.success("Perfil publicado");
    setOpen(false);
    load();
  };

  const filtered = filter === "all" ? list : list.filter(p => p.kind === filter);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center justify-between">
        <div className="flex gap-1">
          <Button size="sm" variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>Todos</Button>
          <Button size="sm" variant={filter === "creator" ? "default" : "outline"} onClick={() => setFilter("creator")}>Criadores</Button>
          <Button size="sm" variant={filter === "brand" ? "default" : "outline"} onClick={() => setFilter("brand")}>Marcas</Button>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-1" />Publicar perfil</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Quero fazer match</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div><Label>Sou</Label>
                <Select value={form.kind} onValueChange={(v) => setForm({ ...form, kind: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="creator">Criador(a) UGC</SelectItem>
                    <SelectItem value="brand">Marca / produto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label>Nicho</Label>
                <Select value={form.niche} onValueChange={(v) => setForm({ ...form, niche: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{NICHE_OPTIONS.map(n => <SelectItem key={n} value={n}>{n}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} placeholder="O que você faz / busca" /></div>
              <div><Label>Contato</Label><Input value={form.contact} onChange={e => setForm({ ...form, contact: e.target.value })} placeholder="WhatsApp, Instagram, e-mail" /></div>
              <div><Label>Portfólio (link)</Label><Input value={form.portfolio_url} onChange={e => setForm({ ...form, portfolio_url: e.target.value })} /></div>
              <Button onClick={create} className="w-full">Publicar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {filtered.length === 0 && <p className="text-sm" style={{ color: C.muted }}>Nenhum perfil ainda.</p>}
        {filtered.map(p => {
          const pr = profiles[p.user_id];
          return (
            <Card key={p.id} className="p-4" style={{ background: C.cardBg, borderColor: C.border }}>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
                    {(pr?.full_name || pr?.username || "?")[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold" style={{ color: C.text }}>{pr?.full_name || pr?.username || "Membro"}</p>
                    <p className="text-xs" style={{ color: C.muted }}>{p.kind === "creator" ? "Criador(a)" : "Marca"} · {p.niche}</p>
                  </div>
                </div>
                <Badge variant={p.kind === "creator" ? "default" : "secondary"}>{p.kind === "creator" ? "UGC" : "Marca"}</Badge>
              </div>
              <p className="text-sm mt-3" style={{ color: C.text }}>{p.bio}</p>
              <div className="flex gap-2 mt-3 flex-wrap">
                <Badge variant="outline">📞 {p.contact}</Badge>
                {p.portfolio_url && <Button size="sm" variant="outline" asChild><a href={p.portfolio_url} target="_blank" rel="noreferrer"><ExternalLink className="w-3 h-3 mr-1" />Portfólio</a></Button>}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
