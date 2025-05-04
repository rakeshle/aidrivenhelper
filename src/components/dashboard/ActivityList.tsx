
import { DashboardActivity } from "@/services/dashboardService";
import { ActivityItem } from "./ActivityItem";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ActivityListProps {
  activities: DashboardActivity[];
  isLoading: boolean;
}

export function ActivityList({ activities, isLoading }: ActivityListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest questions, uploads and messages</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">Loading activities...</p>
          </div>
        ) : activities.length > 0 ? (
          <div className="divide-y">
            {activities.map((activity) => (
              <ActivityItem key={`${activity.type}-${activity.id}`} activity={activity} />
            ))}
          </div>
        ) : (
          <div className="p-6 text-center">
            <p className="text-sm text-muted-foreground">No recent activity</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
