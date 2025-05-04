
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { dashboardService, DashboardActivity } from "@/services/dashboardService";
import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { ActivityList } from "@/components/dashboard/ActivityList";

const Dashboard = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<DashboardActivity[]>([]);
  const [stats, setStats] = useState({
    questionCount: 0,
    materialCount: 0,

  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Fetch user activity
        const { data: activityData } = await dashboardService.getUserActivity(user.id);
        setActivities(activityData);
        
        // Fetch stats
        const statsData = await dashboardService.getDashboardStats(user.id);
        setStats({
          questionCount: statsData.questionCount,
          materialCount: statsData.materialCount
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your activity and engagement
        </p>
      </div>
      
      <DashboardStats
        questionCount={stats.questionCount}
        materialCount={stats.materialCount}
        
        isLoading={loading}
      />
      
      <div className="mt-8">
        <ActivityList 
          activities={activities}
          isLoading={loading}
        />
      </div>
    </div>
  );
};

export default Dashboard;
