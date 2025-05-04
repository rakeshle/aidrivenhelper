
import { CalendarClock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DashboardActivity } from "@/services/dashboardService";

type ActivityIconProps = {
  type: string;
};

const ActivityIcon = ({ type }: ActivityIconProps) => {
  return (
    <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
      <CalendarClock className="h-5 w-5 text-primary" />
    </div>
  );
};

export function ActivityItem({ activity }: { activity: DashboardActivity }) {
  const formattedTime = formatDistanceToNow(new Date(activity.timestamp), {
    addSuffix: true,
  });

  let activityTitle = "";
  let activityDetails = "";

  switch (activity.type) {
    case "question":
      activityTitle = "You asked a question";
      activityDetails = activity.content;
      break;
    case "material":
      activityTitle = "You uploaded a material";
      activityDetails = activity.content;
      break;
    default:
      activityTitle = "Activity recorded";
      activityDetails = activity.content;
  }

  return (
    <div className="flex items-start gap-3 p-4 hover:bg-muted/50 transition-colors">
      <ActivityIcon type={activity.type} />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm">{activityTitle}</p>
        <p className="text-sm text-muted-foreground truncate">{activityDetails}</p>
      </div>
      <div className="text-xs text-muted-foreground whitespace-nowrap">
        {formattedTime}
      </div>
    </div>
  );
}
