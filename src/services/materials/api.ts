
import { supabase } from "@/integrations/supabase/client";
import { Material, MaterialsFilterOptions, MaterialFilter } from './types';

const defaultFilterOptions: MaterialsFilterOptions = {
  sortBy: "newest"
};

// Fetch materials with various filter options
export async function fetchMaterials(options: MaterialsFilterOptions = defaultFilterOptions) {
  try {
    const { subject, fileType, sortBy, searchQuery } = options;
    
    let query = supabase
      .from("learning_materials")
      .select(`
        *,
        material_ratings(rating)
      `);
    
    // Apply filters
    if (subject) {
      query = query.eq("subject", subject);
    }
    
    if (fileType) {
      // Use type assertion to handle the string type
      query = query.eq("file_type", fileType as any);
    }
    
    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%,subject.ilike.%${searchQuery}%`);
    }
    
    // Apply sorting
    switch (sortBy) {
      case "popular":
        query = query.order("downloads", { ascending: false });
        break;
      case "highest_rated":
        // Here we'll need to join with ratings and calculate average
        // For now, just sort by downloads as a proxy
        query = query.order("downloads", { ascending: false });
        break;
      case "newest":
      default:
        query = query.order("created_at", { ascending: false });
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    // Calculate average ratings for each material
    const materialsWithRatings = data?.map(material => {
      const ratings = material.material_ratings || [];
      const ratingSum = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
      const averageRating = ratings.length > 0 ? ratingSum / ratings.length : 0;
      
      return {
        ...material,
        average_rating: averageRating,
        ratings_count: ratings.length,
        material_ratings: undefined // Remove the raw ratings data
      };
    });
    
    return { data: materialsWithRatings, error: null };
  } catch (error) {
    console.error("Error fetching materials:", error);
    return { data: null, error };
  }
}

// Get all materials with ratings and filter options
export async function getAllMaterialsWithRatings(filters: MaterialFilter = {}) {
  try {
    const result = await fetchMaterials({
      ...filters,
      sortBy: "newest"
    });
    
    return result.data || [];
  } catch (error) {
    console.error("Error fetching all materials with ratings:", error);
    return [];
  }
}

// Get materials uploaded by the current user
export async function getMyMaterials() {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("learning_materials")
      .select(`
        *,
        material_ratings(rating)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    
    // Calculate average ratings for each material
    const materialsWithRatings = data.map(material => {
      const ratings = material.material_ratings || [];
      
      // Type guard to ensure we're working with an array that has reduce method
      if (!Array.isArray(ratings)) {
        return {
          ...material,
          average_rating: 0,
          ratings_count: 0,
          material_ratings: undefined
        };
      }
      
      const ratingSum = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
      const averageRating = ratings.length > 0 ? ratingSum / ratings.length : 0;
      
      return {
        ...material,
        average_rating: averageRating,
        ratings_count: ratings.length,
        material_ratings: undefined
      };
    });
    
    return materialsWithRatings;
  } catch (error) {
    console.error("Error fetching user's materials:", error);
    return [];
  }
}

// Get materials saved by the current user
export async function getSavedMaterials() {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) return [];
    
    const { data, error } = await supabase
      .from("saved_materials")
      .select(`
        material:material_id(
          *,
          material_ratings(rating)
        )
      `)
      .eq("user_id", user.id);
    
    if (error) throw error;
    
    // Extract and format the materials from the join
    const savedMaterials = data
      .map(item => item.material)
      .filter(Boolean)
      .map(material => {
        // Type guard for ratings
        const ratings = Array.isArray(material.material_ratings) ? 
          material.material_ratings : [];
          
        const ratingSum = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
        const averageRating = ratings.length > 0 ? ratingSum / ratings.length : 0;
        
        return {
          ...material,
          average_rating: averageRating,
          ratings_count: ratings.length,
          material_ratings: undefined
        };
      });
    
    return savedMaterials;
  } catch (error) {
    console.error("Error fetching saved materials:", error);
    return [];
  }
}

// Get a single material by ID
export async function getMaterialById(id: string) {
  try {
    const { data, error } = await supabase
      .from("learning_materials")
      .select(`
        *,
        material_ratings(rating, user_id)
      `)
      .eq("id", id)
      .single();
      
    if (error) throw error;
    
    // Calculate average rating
    const ratings = Array.isArray(data.material_ratings) ? 
      data.material_ratings : [];
      
    const ratingSum = ratings.reduce((sum: number, r: { rating: number }) => sum + r.rating, 0);
    const averageRating = ratings.length > 0 ? ratingSum / ratings.length : 0;
    
    // Check if current user has rated
    const userId = (await supabase.auth.getUser()).data.user?.id;
    const userRating = ratings.find((r: { user_id: string }) => r.user_id === userId);
    
    return { 
      data: { 
        ...data, 
        average_rating: averageRating, 
        ratings_count: ratings.length,
        userRating: userRating ? userRating.rating : null,
        material_ratings: undefined // Remove the raw ratings data
      }, 
      error: null 
    };
  } catch (error) {
    console.error("Error fetching material:", error);
    return { data: null, error };
  }
}
