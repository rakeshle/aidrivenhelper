
-- Function to increment downloads count atomically
CREATE OR REPLACE FUNCTION public.increment_downloads(material_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_count integer;
BEGIN
  UPDATE public.learning_materials
  SET downloads = downloads + 1
  WHERE id = material_id
  RETURNING downloads INTO new_count;
  
  RETURN new_count;
END;
$$;
