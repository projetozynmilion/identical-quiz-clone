INSERT INTO public.prompt_categories (slug, label, description, position, is_active, kind)
VALUES ('em-alta', 'Top em alta no momento', 'Prompts virais adicionados recentemente', 0, true, 'prompt')
ON CONFLICT (slug) DO NOTHING;