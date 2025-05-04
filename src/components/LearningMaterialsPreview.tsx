
import { useEffect, useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { BookOpen, FileText, Download, Users, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { materialsService, Material } from "@/services/materialsService";

const LearningMaterialsPreview = () => {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        setLoading(true);
        const data = await materialsService.getAllMaterialsWithRatings();
        // Take only the first 3 materials
        setMaterials(data.slice(0, 3));
      } catch (error) {
        console.error("Error fetching materials:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMaterials();
  }, []);

  // Function to get time elapsed since upload
  const getTimeElapsed = (createdAt: string) => {
    const uploadDate = new Date(createdAt);
    const currentDate = new Date();
    const diffInMilliseconds = currentDate.getTime() - uploadDate.getTime();
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return "Today";
    } else if (diffInDays === 1) {
      return "Yesterday";
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      return `${Math.floor(diffInDays / 7)} weeks ago`;
    } else if (diffInDays < 365) {
      return `${Math.floor(diffInDays / 30)} months ago`;
    } else {
      return `${Math.floor(diffInDays / 365)} years ago`;
    }
  };

  // Function to determine icon color based on subject
  const getColorScheme = (subject: string) => {
    const colorMap: Record<string, { color: string, iconColor: string }> = {
      "Computer Science": { color: "from-blue-500/20 to-indigo-500/20", iconColor: "text-blue-500" },
      "Mathematics": { color: "from-purple-500/20 to-pink-500/20", iconColor: "text-purple-500" },
      "Economics": { color: "from-amber-500/20 to-orange-500/20", iconColor: "text-amber-500" },
      "Engineering": { color: "from-green-500/20 to-teal-500/20", iconColor: "text-green-500" },
      "Physics": { color: "from-sky-500/20 to-blue-500/20", iconColor: "text-sky-500" },
      "Chemistry": { color: "from-red-500/20 to-pink-500/20", iconColor: "text-red-500" },
      "Biology": { color: "from-emerald-500/20 to-green-500/20", iconColor: "text-emerald-500" }
    };
    
    return colorMap[subject] || { color: "from-gray-500/20 to-slate-500/20", iconColor: "text-gray-500" };
  };

  // Fallback placeholder materials when database is empty or loading
  const placeholderMaterials = [
    {
      id: "1",
      title: "Introduction to Computer Science",
      file_type: "notes" as const,
      subject: "Computer Science",
      downloads: 156,
      user_id: "anonymous",
      created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "2",
      title: "Advanced Calculus Study Guide",
      file_type: "study_guide" as const,
      subject: "Mathematics",
      downloads: 89,
      user_id: "anonymous",
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "3",
      title: "Principles of Economics Summary",
      file_type: "summary" as const,
      subject: "Economics",
      downloads: 213,
      user_id: "anonymous",
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    }
  ];

  const displayMaterials = materials.length > 0 ? materials : placeholderMaterials;

  // Map file types to readable names
  const getFileTypeName = (fileType: string) => {
    const typeMap: Record<string, string> = {
      "notes": "Lecture Notes",
      "past_paper": "Past Paper",
      "study_guide": "Study Guide",
      "summary": "Summary",
      "practice_questions": "Practice Questions",
      "lab_report": "Lab Report",
      "assignment": "Assignment"
    };
    
    return typeMap[fileType] || "Document";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayMaterials.map((material) => {
        const colorScheme = getColorScheme(material.subject);
        return (
          <Card 
            key={material.id} 
            className="overflow-hidden border-none shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
          >
            <CardContent className="p-0">
              <div className={cn(
                "h-28 bg-gradient-to-r flex items-center justify-center",
                colorScheme.color
              )}>
                <div className="h-16 w-16 rounded-xl bg-background/70 backdrop-blur-sm flex items-center justify-center shadow-md border border-white/10">
                  <FileText className={cn("h-8 w-8", colorScheme.iconColor)} />
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs font-medium">
                    {material.subject}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {getFileTypeName(material.file_type)}
                  </Badge>
                </div>
                
                <h3 className="text-base font-semibold mb-2.5 line-clamp-2 hover:text-primary transition-colors">
                  {material.title}
                </h3>
                
                <div className="grid grid-cols-2 gap-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{material.downloads} downloads</span>
                  </div>
                  <div className="flex items-center gap-1 col-span-2">
                    <Clock className="h-3 w-3" />
                    <span>Shared {getTimeElapsed(material.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 bg-muted/30 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <BookOpen className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs">{getFileTypeName(material.file_type)}</span>
              </div>
              <Link to={`/materials?id=${material.id}`}>
                <Button size="sm" className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-xs py-1 h-7 px-3">
                  View
                </Button>
              </Link>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
};

export default LearningMaterialsPreview;
