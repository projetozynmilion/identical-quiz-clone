
-- LIVES
CREATE TABLE public.lives (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  host text,
  scheduled_at timestamptz NOT NULL,
  youtube_url text,
  cover_url text,
  status text NOT NULL DEFAULT 'scheduled',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.lives TO authenticated;
GRANT ALL ON public.lives TO service_role;
ALTER TABLE public.lives ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lives_select_all" ON public.lives FOR SELECT TO authenticated USING (true);
CREATE POLICY "lives_admin_insert" ON public.lives FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lives_admin_update" ON public.lives FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lives_admin_delete" ON public.lives FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER lives_touch BEFORE UPDATE ON public.lives FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.live_rsvps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  live_id uuid NOT NULL REFERENCES public.lives(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(live_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.live_rsvps TO authenticated;
GRANT ALL ON public.live_rsvps TO service_role;
ALTER TABLE public.live_rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "rsvp_select_all" ON public.live_rsvps FOR SELECT TO authenticated USING (true);
CREATE POLICY "rsvp_self_insert" ON public.live_rsvps FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "rsvp_self_delete" ON public.live_rsvps FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- RESOURCES (biblioteca)
CREATE TABLE public.resources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'geral',
  file_url text,
  external_url text,
  thumbnail_url text,
  downloads int NOT NULL DEFAULT 0,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resources TO authenticated;
GRANT ALL ON public.resources TO service_role;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "resources_select_all" ON public.resources FOR SELECT TO authenticated USING (true);
CREATE POLICY "resources_admin_insert" ON public.resources FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "resources_admin_update" ON public.resources FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "resources_admin_delete" ON public.resources FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER resources_touch BEFORE UPDATE ON public.resources FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- JOBS (vagas UGC)
CREATE TABLE public.jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  brand text NOT NULL,
  description text NOT NULL,
  budget text,
  deadline date,
  contact text,
  niche text,
  status text NOT NULL DEFAULT 'open',
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_select_all" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "jobs_admin_insert" ON public.jobs FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "jobs_admin_update" ON public.jobs FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "jobs_admin_delete" ON public.jobs FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER jobs_touch BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE TABLE public.job_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text,
  portfolio_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(job_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "applic_self_select" ON public.job_applications FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "applic_self_insert" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "applic_self_delete" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  link text,
  icon text,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notif_self_select" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_self_update" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_self_delete" ON public.notifications FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "notif_admin_insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);

-- GROUPS (nichos)
CREATE TABLE public.niche_groups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  niche text NOT NULL,
  emoji text DEFAULT '💬',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.niche_groups TO authenticated;
GRANT ALL ON public.niche_groups TO service_role;
ALTER TABLE public.niche_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "groups_select_all" ON public.niche_groups FOR SELECT TO authenticated USING (true);
CREATE POLICY "groups_admin_write" ON public.niche_groups FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TABLE public.group_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.niche_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(group_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.group_members TO authenticated;
GRANT ALL ON public.group_members TO service_role;
ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gm_select_all" ON public.group_members FOR SELECT TO authenticated USING (true);
CREATE POLICY "gm_self_insert" ON public.group_members FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gm_self_delete" ON public.group_members FOR DELETE TO authenticated USING (auth.uid() = user_id);

CREATE TABLE public.group_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id uuid NOT NULL REFERENCES public.niche_groups(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.group_messages TO authenticated;
GRANT ALL ON public.group_messages TO service_role;
ALTER TABLE public.group_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "gmsg_select_all" ON public.group_messages FOR SELECT TO authenticated USING (true);
CREATE POLICY "gmsg_self_insert" ON public.group_messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "gmsg_self_delete" ON public.group_messages FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE INDEX group_messages_group_idx ON public.group_messages(group_id, created_at DESC);

-- PARTNERSHIPS (match criador/marca)
CREATE TABLE public.partnerships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind text NOT NULL,
  niche text NOT NULL,
  bio text NOT NULL,
  contact text NOT NULL,
  portfolio_url text,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.partnerships TO authenticated;
GRANT ALL ON public.partnerships TO service_role;
ALTER TABLE public.partnerships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "part_select_all" ON public.partnerships FOR SELECT TO authenticated USING (true);
CREATE POLICY "part_self_insert" ON public.partnerships FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "part_self_update" ON public.partnerships FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "part_self_delete" ON public.partnerships FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE TRIGGER partnerships_touch BEFORE UPDATE ON public.partnerships FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- Seed default niche groups
INSERT INTO public.niche_groups (name, niche, emoji, description) VALUES
('Beleza & Skincare', 'beleza', '💄', 'Criadoras de beleza, maquiagem e cuidados com a pele'),
('Moda & Lifestyle', 'moda', '👗', 'UGC de moda, looks e estilo de vida'),
('Fitness & Saúde', 'fitness', '💪', 'Conteúdo fitness, treinos e bem-estar'),
('Casa & Decor', 'casa', '🏠', 'Decoração, organização e itens para casa'),
('Tech & Gadgets', 'tech', '📱', 'Eletrônicos, apps e gadgets'),
('Mãe & Bebê', 'maternidade', '👶', 'Conteúdo materno e produtos infantis'),
('Pet', 'pet', '🐶', 'Tudo sobre pets e produtos pet shop'),
('Comida & Receitas', 'food', '🍔', 'Food content, receitas e gastronomia');
