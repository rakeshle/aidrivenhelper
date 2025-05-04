
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface DashboardActivity {
  id: string;
  type: 'question' | 'material' ;
  content: string;
  timestamp: string;
  materialType?: string;
}

export const dashboardService = {
  async getUserActivity(userId: string): Promise<{ data: DashboardActivity[], error: any }> {
    try {
      // Fetch recent chat questions
      const { data: chatData, error: chatError } = await supabase
        .from("chat_history")
        .select("id, message, created_at")
        .eq("user_id", userId)
        .eq("is_user_message", true)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (chatError) throw chatError;
      
      // Fetch recent material uploads
      const { data: materialData, error: materialError } = await supabase
        .from("learning_materials")
        .select("id, title, created_at, file_type")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5);
        
      if (materialError) throw materialError;
      
      
      // Transform data into unified activity format
      const chatActivities: DashboardActivity[] = (chatData || []).map(item => ({
        id: item.id,
        type: 'question',
        content: item.message,
        timestamp: item.created_at,
      }));
      
      const materialActivities: DashboardActivity[] = (materialData || []).map(item => ({
        id: item.id,
        type: 'material',
        content: item.title,
        timestamp: item.created_at,
        materialType: item.file_type,
      }));
      
      // Combine all activities and sort by date
      const allActivities = [...chatActivities, ...materialActivities]
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10); // Limit to 10 most recent activities
      
      return { data: allActivities, error: null };
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
      return { data: [], error };
    }
  },
  
  async getDashboardStats(userId: string): Promise<{ 
    questionCount: number;
    materialCount: number;
    error: any;
  }> {
    try {
      // Fetch counts for various activities
      const { count: questionCount, error: chatError } = await supabase
        .from("chat_history")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId)
        .eq("is_user_message", true);
        
      if (chatError) throw chatError;
      
      const { count: materialCount, error: materialError } = await supabase
        .from("learning_materials")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", userId);
        
      if (materialError) throw materialError;
      
      
      return {
        questionCount: questionCount || 0,
        materialCount: materialCount || 0,
      
        error: null
      };
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      toast.error("Failed to load dashboard statistics");
      return {
        questionCount: 0,
        materialCount: 0,
        error
      };
    }
  }
};
