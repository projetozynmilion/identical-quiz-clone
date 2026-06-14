
ALTER TABLE public.chat_messages
  ADD COLUMN IF NOT EXISTS message_type TEXT NOT NULL DEFAULT 'text',
  ADD COLUMN IF NOT EXISTS attachment_url TEXT,
  ADD COLUMN IF NOT EXISTS attachment_name TEXT,
  ADD COLUMN IF NOT EXISTS attachment_size BIGINT,
  ADD COLUMN IF NOT EXISTS attachment_mime TEXT,
  ADD COLUMN IF NOT EXISTS audio_duration NUMERIC;

ALTER TABLE public.chat_messages ALTER COLUMN content DROP NOT NULL;
ALTER TABLE public.chat_messages ALTER COLUMN content SET DEFAULT '';

DROP POLICY IF EXISTS "chat_attachments_read_auth" ON storage.objects;
CREATE POLICY "chat_attachments_read_auth"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (bucket_id = 'chat-attachments');

DROP POLICY IF EXISTS "chat_attachments_auth_insert" ON storage.objects;
CREATE POLICY "chat_attachments_auth_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

DROP POLICY IF EXISTS "chat_attachments_owner_delete" ON storage.objects;
CREATE POLICY "chat_attachments_owner_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'chat-attachments'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
