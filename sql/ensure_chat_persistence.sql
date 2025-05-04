
-- Create index on study_group_messages to enhance query performance
CREATE INDEX IF NOT EXISTS idx_study_group_messages_group_id
ON public.study_group_messages (group_id);

-- Create index on study_group_messages by user_id
CREATE INDEX IF NOT EXISTS idx_study_group_messages_user_id
ON public.study_group_messages (user_id);

-- Create index on study_group_messages by created_at for efficient timestamp filtering
CREATE INDEX IF NOT EXISTS idx_study_group_messages_created_at
ON public.study_group_messages (created_at);

-- Enable realtime functionality for study_group_messages
ALTER PUBLICATION supabase_realtime ADD TABLE public.study_group_messages;
ALTER TABLE public.study_group_messages REPLICA IDENTITY FULL;
