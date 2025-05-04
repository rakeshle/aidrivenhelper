
-- Check if the set_expires_at trigger function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'set_expires_at'
  ) THEN
    -- Create the trigger function if it doesn't exist
    CREATE FUNCTION public.set_expires_at()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
      NEW.expires_at = NOW() + INTERVAL '72 hours';
      RETURN NEW;
    END;
    $function$;
  END IF;
END $$;

-- Check and create the trigger for study_groups if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_study_group_expires_at'
  ) THEN
    CREATE TRIGGER set_study_group_expires_at
    BEFORE INSERT ON public.study_groups
    FOR EACH ROW
    EXECUTE FUNCTION public.set_expires_at();
  END IF;
END $$;

-- Check if the set_message_expires_at trigger function exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_proc
    WHERE proname = 'set_message_expires_at'
  ) THEN
    -- Create the trigger function if it doesn't exist
    CREATE FUNCTION public.set_message_expires_at()
    RETURNS trigger
    LANGUAGE plpgsql
    AS $function$
    BEGIN
      NEW.expires_at = NOW() + INTERVAL '72 hours';
      RETURN NEW;
    END;
    $function$;
  END IF;
END $$;

-- Check and create the trigger for study_group_messages if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_trigger
    WHERE tgname = 'set_message_expires_at'
  ) THEN
    CREATE TRIGGER set_message_expires_at
    BEFORE INSERT ON public.study_group_messages
    FOR EACH ROW
    EXECUTE FUNCTION public.set_message_expires_at();
  END IF;
END $$;
