
ALTER TABLE public.prompt_categories ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'prompt';
ALTER TABLE public.prompts ADD COLUMN IF NOT EXISTS kind text NOT NULL DEFAULT 'prompt';
CREATE INDEX IF NOT EXISTS prompt_categories_kind_idx ON public.prompt_categories(kind);
CREATE INDEX IF NOT EXISTS prompts_kind_idx ON public.prompts(kind);
