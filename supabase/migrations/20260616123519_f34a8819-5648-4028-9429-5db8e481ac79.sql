
-- ============ BADGES (catálogo) ============
CREATE TABLE public.badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  description text,
  emoji text NOT NULL DEFAULT '🏆',
  rarity text NOT NULL DEFAULT 'common', -- common|rare|epic|legendary
  criteria text,
  position int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.badges TO authenticated, anon;
GRANT ALL ON public.badges TO service_role;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Badges são públicas" ON public.badges FOR SELECT USING (true);
CREATE POLICY "Admin gerencia badges" ON public.badges FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ USER_BADGES ============
CREATE TABLE public.user_badges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id uuid NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);
GRANT SELECT ON public.user_badges TO authenticated;
GRANT ALL ON public.user_badges TO service_role;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Ver medalhas conquistadas" ON public.user_badges FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admin atribui medalhas" ON public.user_badges FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ VICTORIES ============
CREATE TABLE public.victories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  victory_type text NOT NULL DEFAULT 'sale', -- sale|viral|milestone
  title text NOT NULL,
  description text,
  media_url text,
  amount numeric(12,2) DEFAULT 0,
  views_count bigint DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_victories_created ON public.victories(created_at DESC);
CREATE INDEX idx_victories_user ON public.victories(user_id);
GRANT SELECT ON public.victories TO authenticated, anon;
GRANT INSERT, UPDATE, DELETE ON public.victories TO authenticated;
GRANT ALL ON public.victories TO service_role;
ALTER TABLE public.victories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Vitórias visíveis a todos" ON public.victories FOR SELECT USING (true);
CREATE POLICY "Aluno cria própria vitória" ON public.victories FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Aluno edita própria vitória" ON public.victories FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Aluno apaga própria vitória" ON public.victories FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- ============ VICTORY_LIKES ============
CREATE TABLE public.victory_likes (
  victory_id uuid NOT NULL REFERENCES public.victories(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (victory_id, user_id)
);
GRANT SELECT ON public.victory_likes TO authenticated, anon;
GRANT INSERT, DELETE ON public.victory_likes TO authenticated;
GRANT ALL ON public.victory_likes TO service_role;
ALTER TABLE public.victory_likes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Curtidas visíveis" ON public.victory_likes FOR SELECT USING (true);
CREATE POLICY "Aluno curte" ON public.victory_likes FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Aluno descurte" ON public.victory_likes FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Triggers updated_at
CREATE TRIGGER trg_badges_updated BEFORE UPDATE ON public.badges FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_victories_updated BEFORE UPDATE ON public.victories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Seed inicial de badges
INSERT INTO public.badges (slug, name, description, emoji, rarity, criteria, position) VALUES
('primeira-venda', 'Primeira Venda', 'Fez sua primeira venda como afiliado UGC', '💰', 'common', 'Postar 1 vitória do tipo venda', 1),
('10k-vendas', '10K em Vendas', 'Acumulou R$10.000 em vendas', '🚀', 'rare', 'R$10.000 somados em vitórias de venda', 2),
('50k-vendas', '50K em Vendas', 'Acumulou R$50.000 em vendas', '💎', 'epic', 'R$50.000 somados em vitórias de venda', 3),
('100k-vendas', '100K em Vendas', 'Lenda — R$100.000 em vendas', '👑', 'legendary', 'R$100.000 somados em vitórias de venda', 4),
('video-viral', 'Vídeo Viral', 'Fez um vídeo com +100k views', '🔥', 'rare', 'Vitória do tipo viral com 100k+ views', 5),
('mega-viral', 'Mega Viral', 'Vídeo com +1M de views', '⚡', 'epic', 'Vitória do tipo viral com 1M+ views', 6),
('streak-7', 'Constante', '7 dias seguidos postando', '📅', 'common', 'Streak de 7 dias', 7),
('streak-30', 'Imparável', '30 dias seguidos postando', '🏅', 'epic', 'Streak de 30 dias', 8),
('top-criador', 'Top Criador', 'Entrou no Top 10 do Leaderboard', '🏆', 'legendary', 'Top 10 mensal', 9);
