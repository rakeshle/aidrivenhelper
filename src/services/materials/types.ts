
import { Tables } from "@/integrations/supabase/types";

export type Material = {
  id: string;
  title: string;
  description: string | null;
  subject: string;
  course_code: string | null;
  file_url: string;
  file_type: "notes" | "study_guide" | "summary" | "reference" | "other";
  file_size: number;
  user_id: string;
  created_at: string;
  updated_at: string;
  downloads: number;
  average_rating?: number;
  ratings_count?: number;
};

export type MaterialRating = {
  id: string;
  material_id: string;
  user_id: string;
  rating: number;
  created_at: string;
};

export interface MaterialsFilterOptions {
  subject?: string;
  fileType?: string;
  sortBy?: "newest" | "popular" | "highest_rated";
  searchQuery?: string;
}

export interface MaterialFilter {
  subject?: string;
  fileType?: string;
  searchQuery?: string;
}
