CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(content) > 0 AND char_length(content) <= 2000),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, DELETE ON public.chat_messages TO authenticated;
GRANT ALL ON public.chat_messages TO service_role;

ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated can view all messages"
  ON public.chat_messages FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Users can insert their own messages"
  ON public.chat_messages FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own; admins can delete any"
  ON public.chat_messages FOR DELETE
  TO authenticated USING (
    auth.uid() = user_id OR public.has_role(auth.uid(), 'admin')
  );

CREATE INDEX chat_messages_created_at_idx ON public.chat_messages (created_at DESC);

ALTER PUBLICATION supabase_realtime ADD TABLE public.chat_messages;
ALTER TABLE public.chat_messages REPLICA IDENTITY FULL;

-- Allow authenticated users to read profile basics of other members (for chat author names/avatars)
DROP POLICY IF EXISTS "Authenticated can view basic profiles" ON public.profiles;
CREATE POLICY "Authenticated can view basic profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (true);