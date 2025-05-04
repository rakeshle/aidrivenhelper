
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, Download, Clock, Bookmark, BookmarkCheck, 
  ExternalLink, AlertTriangle, Trash2, Star, StarHalf
} from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { Material, materialsService } from "@/services/materialsService";
import { useAuth } from "@/contexts/AuthContext";

interface MaterialCardProps {
  material: Material;
  onDelete?: () => void;
  onSaveChange?: () => void;
  showDeleteAction?: boolean;
}

const MaterialCard = ({ 
  material, 
  onDelete, 
  onSaveChange, 
  showDeleteAction = false 
}: MaterialCardProps) => {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [averageRating, setAverageRating] = useState<number>(material.average_rating || 0);
  const [ratingsCount, setRatingsCount] = useState<number>(material.ratings_count || 0);
  const [isRatingLoading, setIsRatingLoading] = useState(false);

  // Type mapping for display
  const typeDisplayMap: Record<string, string> = {
    notes: "Lecture Notes",
    study_guide: "Study Guide",
    summary: "Summary",
    reference: "Reference",
    other: "Other"
  };

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Check if material is saved and get user rating
  useEffect(() => {
    const checkSavedStatus = async () => {
      if (!user) return;
      const saved = await materialsService.isMaterialSaved(material.id);
      setIsSaved(saved);
    };
    
    const fetchUserRating = async () => {
      if (!user) return;
      const rating = await materialsService.getUserRating(material.id);
      setUserRating(rating);
    };
    
    const fetchMaterialRating = async () => {
      const { average, count } = await materialsService.getMaterialRating(material.id);
      setAverageRating(average);
      setRatingsCount(count);
    };
    
    checkSavedStatus();
    fetchUserRating();
    fetchMaterialRating();
  }, [material.id, user]);

  // Handle download
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      // Increment download count in database
      await materialsService.incrementDownload(material.id);
      
      // Open in a new tab for download
      window.open(material.file_url, '_blank');
    } catch (error) {
      console.error("Error downloading material:", error);
      toast.error("Failed to download material");
    }
  };

  // Handle save/unsave
  const handleToggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("Please log in to save materials");
      return;
    }
    
    setIsLoading(true);
    try {
      if (isSaved) {
        const result = await materialsService.unsaveMaterial(material.id);
        if (result) {
          setIsSaved(false);
          onSaveChange?.();
        }
      } else {
        const result = await materialsService.saveMaterial(material.id);
        if (result) {
          setIsSaved(true);
          onSaveChange?.();
        }
      }
    } catch (error) {
      console.error("Error toggling saved status:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle delete
  const handleDelete = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!window.confirm("Are you sure you want to delete this material? This action cannot be undone.")) {
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await materialsService.deleteMaterial(material.id);
      if (result) {
        onDelete?.();
      }
    } catch (error) {
      console.error("Error deleting material:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle rating
  const handleRate = async (rating: number) => {
    if (!user) {
      toast.error("Please log in to rate materials");
      return;
    }
    
    setIsRatingLoading(true);
    try {
      await materialsService.rateMaterial(material.id, rating);
      setUserRating(rating);
      
      // Refresh the average rating
      const { average, count } = await materialsService.getMaterialRating(material.id);
      setAverageRating(average);
      setRatingsCount(count);
    } catch (error) {
      console.error("Error rating material:", error);
    } finally {
      setIsRatingLoading(false);
    }
  };

  // Render star rating
  const renderStarRating = () => {
    return (
      <div className="flex items-center space-x-1 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            disabled={isRatingLoading || !user}
            className={`focus:outline-none ${!user ? 'cursor-not-allowed opacity-70' : 'hover:scale-110'} transition-transform`}
            onClick={() => handleRate(star)}
            title={user ? `Rate ${star} star${star !== 1 ? 's' : ''}` : 'Log in to rate'}
          >
            <Star
              className={`h-4 w-4 ${
                userRating && star <= userRating
                  ? 'text-yellow-500 fill-yellow-500'
                  : averageRating && star <= averageRating
                  ? 'text-yellow-400'
                  : 'text-gray-300'
              } ${userRating && star <= userRating ? 'stroke-yellow-600' : ''}`}
            />
          </button>
        ))}
        {ratingsCount > 0 && (
          <span className="text-xs text-muted-foreground ml-1">
            ({ratingsCount})
          </span>
        )}
      </div>
    );
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="p-2 bg-primary/10 rounded-full">
            <FileText className="h-5 w-5 text-primary" />
          </div>
          <Badge variant="outline" className="text-xs">
            {formatFileSize(material.file_size)}
          </Badge>
        </div>
        
        <div>
          <div className="text-xs font-medium text-primary mb-1">{material.subject}</div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{material.title}</h3>
          
          {material.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
              {material.description}
            </p>
          )}
          
          {renderStarRating()}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-3 mt-3">
            <div className="flex items-center gap-1">
              <Badge variant="secondary" className="text-xs font-normal">
                {typeDisplayMap[material.file_type] || material.file_type}
              </Badge>
            </div>
            
            {material.course_code && (
              <span className="text-xs">Code: {material.course_code}</span>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center">
              <Download className="h-3 w-3 mr-1" />
              <span>{material.downloads} downloads</span>
            </div>
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{formatDistanceToNow(new Date(material.created_at), { addSuffix: true })}</span>
            </div>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="px-4 py-3 bg-muted/30 flex items-center justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs gap-1 hover:bg-primary/10"
          disabled={isLoading}
          onClick={handleToggleSave}
        >
          {isSaved ? (
            <>
              <BookmarkCheck className="h-3.5 w-3.5" />
              Saved
            </>
          ) : (
            <>
              <Bookmark className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
        
        <div className="flex gap-1">
          {showDeleteAction && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-xs text-destructive hover:bg-destructive/10 hover:text-destructive"
              disabled={isLoading}
              onClick={handleDelete}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            className="text-xs gap-1"
            onClick={handleDownload}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default MaterialCard;
