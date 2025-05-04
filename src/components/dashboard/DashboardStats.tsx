
import { 
  MessageSquare, 
  FileText, 
  MessagesSquare,
  Users
} from "lucide-react";
import { StatCard } from "./StatCard";

interface DashboardStatsProps {
  questionCount: number;
  materialCount: number;
  
  isLoading: boolean;
}

export function DashboardStats({
  questionCount,
  materialCount,
  
  isLoading
}: DashboardStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-md bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        title="Questions Asked"
        value={questionCount}
        icon={<MessageSquare className="h-5 w-5 text-blue-500" />}
      />
      <StatCard
        title="Materials Uploaded"
        value={materialCount}
        icon={<FileText className="h-5 w-5 text-emerald-500" />}
      />
    </div>
  );
}
