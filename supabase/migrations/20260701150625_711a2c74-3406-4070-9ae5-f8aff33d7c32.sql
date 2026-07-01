GRANT SELECT ON public.prompts TO anon;
CREATE POLICY "public read active prompts" ON public.prompts FOR SELECT TO anon USING (is_active = true);