
-- =====================================================
-- PROMPT CATEGORIES
-- =====================================================
CREATE TABLE public.prompt_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL,
  description TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.prompt_categories TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.prompt_categories TO authenticated;
GRANT ALL ON public.prompt_categories TO service_role;
ALTER TABLE public.prompt_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read prompt_categories" ON public.prompt_categories FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write prompt_categories" ON public.prompt_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_prompt_categories_updated BEFORE UPDATE ON public.prompt_categories FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- PROMPTS
-- =====================================================
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID REFERENCES public.prompt_categories(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  subtitle TEXT,
  prompt_text TEXT NOT NULL DEFAULT '',
  video_url TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX prompts_category_idx ON public.prompts(category_id, position);
GRANT SELECT ON public.prompts TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.prompts TO authenticated;
GRANT ALL ON public.prompts TO service_role;
ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read prompts" ON public.prompts FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write prompts" ON public.prompts FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_prompts_updated BEFORE UPDATE ON public.prompts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- BONUSES (cards aba Ferramentas)
-- =====================================================
CREATE TABLE public.bonuses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  description TEXT,
  icon TEXT,
  banner_url TEXT,
  action_type TEXT NOT NULL DEFAULT 'link', -- 'link' | 'credentials' | 'module' | 'none'
  action_payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  position INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.bonuses TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.bonuses TO authenticated;
GRANT ALL ON public.bonuses TO service_role;
ALTER TABLE public.bonuses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read bonuses" ON public.bonuses FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write bonuses" ON public.bonuses FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_bonuses_updated BEFORE UPDATE ON public.bonuses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- SITE SETTINGS (key/value)
-- =====================================================
CREATE TABLE public.site_settings (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_settings TO authenticated;
GRANT INSERT, UPDATE, DELETE ON public.site_settings TO authenticated;
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read site_settings" ON public.site_settings FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin write site_settings" ON public.site_settings FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE TRIGGER trg_site_settings_updated BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
