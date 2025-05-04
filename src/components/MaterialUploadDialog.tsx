
import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { materialsService } from "@/services/materials";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface MaterialUploadDialogProps {
  onSuccess?: () => void;
}

const MaterialUploadDialog = ({ onSuccess }: MaterialUploadDialogProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [courseCode, setCourseCode] = useState("");
  const [fileType, setFileType] = useState<"notes" | "study_guide" | "summary" | "reference" | "other">("notes");
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [generalError, setGeneralError] = useState("");

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubject("");
    setCourseCode("");
    setFileType("notes");
    setFile(null);
    setFileError("");
    setGeneralError("");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    setFileError("");
    
    if (!selectedFile) {
      setFile(null);
      return;
    }
    
    // Check file size (5MB = 5 * 1024 * 1024 bytes)
    if (selectedFile.size > 5 * 1024 * 1024) {
      setFileError("File size exceeds 5MB limit");
      setFile(null);
      return;
    }
    
    setFile(selectedFile);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error("You must be logged in to upload materials");
      return;
    }
    
    setGeneralError("");
    
    if (!file) {
      setFileError("Please select a file");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    
    if (!subject.trim()) {
      toast.error("Please enter a subject");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Uploading material with file:", file.name);
      console.log("Material data:", {
        title,
        description,
        subject,
        course_code: courseCode || null,
        file_type: fileType
      });
      
      const result = await materialsService.uploadMaterial(file, {
        title,
        description,
        subject,
        course_code: courseCode || null,
        file_type: fileType
      });
      
      console.log("Upload result:", result);
      
      if (result) {
        resetForm();
        setIsOpen(false);
        onSuccess?.();
        toast.success("Material uploaded successfully");
      } else {
        setGeneralError("Upload failed. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading material:", error);
      setGeneralError("Failed to upload material. Please try again.");
      toast.error("Failed to upload material. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        resetForm(); // Reset form when closing dialog without submitting
      }
    }}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Upload className="h-4 w-4" /> Upload Material
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Learning Material</DialogTitle>
          <DialogDescription>
            Share study materials with other students. Maximum file size is 5MB.
          </DialogDescription>
        </DialogHeader>
        
        {generalError && (
          <div className="bg-destructive/10 p-3 rounded-md flex items-start gap-2 text-sm text-destructive mb-4">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>{generalError}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid gap-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.g., Calculus Study Notes"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="subject">Subject *</Label>
            <Input
              id="subject" 
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="E.g., Mathematics"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="course-code">Course Code (Optional)</Label>
            <Input
              id="course-code"
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              placeholder="E.g., MATH101"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of the material..."
              className="min-h-[100px]"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file-type">Material Type</Label>
            <Select value={fileType} onValueChange={(value) => setFileType(value as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="notes">Lecture Notes</SelectItem>
                <SelectItem value="study_guide">Study Guide</SelectItem>
                <SelectItem value="summary">Summary</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="file" className="mb-1">
              File Upload *
            </Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              className="cursor-pointer"
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
            />
            {fileError && <p className="text-sm text-destructive">{fileError}</p>}
            <p className="text-xs text-muted-foreground">
              Accepted formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 5MB)
            </p>
          </div>
          
          <div className="flex justify-end gap-2 mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                resetForm();
                setIsOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !user}>
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>Upload</>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MaterialUploadDialog;
