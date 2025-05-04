
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Rate a material
export async function rateMaterial(materialId: string, rating: number) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Check if user has already rated this material
    const { data: existingRating, error: checkError } = await supabase
      .from("material_ratings")
      .select()
      .eq("material_id", materialId)
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (checkError) throw checkError;
    
    let data;
    let error;
    
    if (existingRating) {
      // Update existing rating
      const response = await supabase
        .from("material_ratings")
        .update({ rating })
        .eq("id", existingRating.id)
        .select()
        .single();
        
      data = response.data;
      error = response.error;
    } else {
      // Create new rating
      const response = await supabase
        .from("material_ratings")
        .insert({
          material_id: materialId,
          user_id: user.id,
          rating
        })
        .select()
        .single();
        
      data = response.data;
      error = response.error;
    }
    
    if (error) throw error;
    
    return { data, error: null };
  } catch (error) {
    console.error("Error rating material:", error);
    return { data: null, error };
  }
}

// Check if a material is saved by current user
export async function isMaterialSaved(materialId: string) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      return false;
    }
    
    const { data, error } = await supabase
      .from("saved_materials")
      .select()
      .eq("material_id", materialId)
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (error) throw error;
    
    return !!data;
  } catch (error) {
    console.error("Error checking if material is saved:", error);
    return false;
  }
}

// Get user rating for a material
export async function getUserRating(materialId: string) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      return null;
    }
    
    const { data, error } = await supabase
      .from("material_ratings")
      .select("rating")
      .eq("material_id", materialId)
      .eq("user_id", user.id)
      .maybeSingle();
      
    if (error) throw error;
    
    return data ? data.rating : null;
  } catch (error) {
    console.error("Error getting user rating:", error);
    return null;
  }
}

// Get average rating for a material
export async function getMaterialRating(materialId: string) {
  try {
    const { data, error } = await supabase
      .from("material_ratings")
      .select("rating")
      .eq("material_id", materialId);
      
    if (error) throw error;
    
    const ratings = data || [];
    const sum = ratings.reduce((sum, r) => sum + r.rating, 0);
    const average = ratings.length > 0 ? sum / ratings.length : 0;
    
    return {
      average,
      count: ratings.length
    };
  } catch (error) {
    console.error("Error getting material rating:", error);
    return {
      average: 0,
      count: 0
    };
  }
}

// Save a material to user's saved collection
export async function saveMaterial(materialId: string) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { data, error } = await supabase
      .from("saved_materials")
      .insert({
        material_id: materialId,
        user_id: user.id
      })
      .select()
      .single();
      
    if (error) throw error;
    
    toast.success("Material saved successfully!");
    return { data, error: null };
  } catch (error: any) {
    console.error("Error saving material:", error);
    
    if (error.code === "23505") { // Duplicate key error
      toast.error("You've already saved this material");
    } else {
      toast.error("Failed to save material");
    }
    
    return { data: null, error };
  }
}

// Remove a material from user's saved collection
export async function unsaveMaterial(materialId: string) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    const { error } = await supabase
      .from("saved_materials")
      .delete()
      .match({ 
        material_id: materialId,
        user_id: user.id
      });
      
    if (error) throw error;
    
    toast.success("Material removed from saved collection");
    return { error: null };
  } catch (error) {
    console.error("Error removing saved material:", error);
    toast.error("Failed to remove material from saved collection");
    return { error };
  }
}
