
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Upload a new material
export async function uploadMaterial(file: File, metadata: {
  title: string;
  description: string | null;
  subject: string;
  course_code: string | null;
  file_type: "notes" | "study_guide" | "summary" | "reference" | "other";
}) {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    
    if (!user) {
      throw new Error("User not authenticated");
    }
    
    // Upload file to storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    // Create a folder structure: userId/filename for better organization
    const filePath = `${user.id}/${fileName}`;
    
    console.log(`Uploading file to bucket 'learning-materials', path: ${filePath}`);
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('learning-materials')
      .upload(filePath, file);
    
    if (uploadError) {
      console.error("Error during file upload:", uploadError);
      throw uploadError;
    }
    
    // Get file URL
    const { data: urlData } = supabase.storage
      .from('learning-materials')
      .getPublicUrl(filePath);
      
    const fileUrl = urlData.publicUrl;
    console.log("File uploaded successfully, URL:", fileUrl);
    
    // Insert material metadata to database
    const { data, error } = await supabase
      .from("learning_materials")
      .insert({
        title: metadata.title,
        description: metadata.description,
        subject: metadata.subject,
        course_code: metadata.course_code,
        file_type: metadata.file_type,
        file_url: fileUrl,
        file_size: file.size,
        user_id: user.id,
        downloads: 0
      })
      .select()
      .single();
      
    if (error) {
      console.error("Error inserting material metadata:", error);
      throw error;
    }
    
    console.log("Material metadata inserted successfully:", data);
    return data;
  } catch (error) {
    console.error("Error uploading material:", error);
    toast.error("Upload failed: " + (error instanceof Error ? error.message : "Unknown error"));
    return null;
  }
}

// Delete a material
export async function deleteMaterial(materialId: string) {
  try {
    // First we need to get the file URL to extract the path
    const { data: material, error: fetchError } = await supabase
      .from("learning_materials")
      .select("file_url")
      .eq("id", materialId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching material for deletion:", fetchError);
      throw fetchError;
    }
    
    // Extract file path from URL
    if (material && material.file_url) {
      const url = new URL(material.file_url);
      const pathWithBucket = url.pathname;
      // Remove the /storage/v1/object/public/ prefix
      const pathParts = pathWithBucket.split('/');
      // Extract just the user ID and filename
      const filePath = pathParts.slice(pathParts.indexOf('learning-materials') + 1).join('/');
      
      // Delete file from storage
      if (filePath) {
        console.log(`Deleting file from storage: ${filePath}`);
        const { error: deleteStorageError } = await supabase.storage
          .from('learning-materials')
          .remove([filePath]);
          
        if (deleteStorageError) {
          console.warn("Error deleting file from storage:", deleteStorageError);
          // Continue even if storage deletion fails
        }
      }
    }
    
    // Delete the database record
    const { error } = await supabase
      .from("learning_materials")
      .delete()
      .eq("id", materialId);
      
    if (error) {
      console.error("Error deleting material record:", error);
      throw error;
    }
    
    console.log("Material deleted successfully");
    return true;
  } catch (error) {
    console.error("Error deleting material:", error);
    toast.error("Deletion failed: " + (error instanceof Error ? error.message : "Unknown error"));
    return false;
  }
}

// Increment download count for a material
export async function incrementDownload(materialId: string) {
  try {
    // First, get the current download count
    const { data: materialData, error: fetchError } = await supabase
      .from('learning_materials')
      .select('downloads')
      .eq('id', materialId)
      .single();
      
    if (fetchError) {
      console.error("Error fetching current downloads:", fetchError);
      return 0;
    }
    
    const currentDownloads = materialData?.downloads || 0;
    const newDownloads = currentDownloads + 1;
    
    // Update the download count
    const { data, error } = await supabase
      .from('learning_materials')
      .update({ downloads: newDownloads })
      .eq('id', materialId)
      .select('downloads')
      .single();
      
    if (error) {
      console.error("Error updating downloads count:", error);
      return currentDownloads;
    }
    
    return data?.downloads || 0;
  } catch (error) {
    console.error("Unexpected error incrementing downloads:", error);
    return 0;
  }
}
