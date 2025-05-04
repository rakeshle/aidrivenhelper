
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Share2, BookOpen, ArrowRight } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import LearningMaterialsPreview from '@/components/LearningMaterialsPreview';

const MaterialsSection = () => {
  const { user } = useAuth();

  return (
    <section className="container mx-auto px-4 py-5">
      <div className="text-center mb-7">
        <h2 className="text-2xl font-bold mb-2.5">{user ? 'Learning Materials Exchange' : 'Share Learning Resources'}</h2>
        <p className="text-base text-muted-foreground max-w-2xl mx-auto">
          {user ? 'Share and discover study resources created by fellow students' : 'Sign in to access and share academic materials with classmates'}
        </p>
      </div>
      {user ? (
        <>
          <LearningMaterialsPreview />
          <div className="text-center mt-7">
            <Link to="/materials">
              <Button className="gap-2 text-[0.9rem]">
                Browse All Materials <Share2 className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <div className="text-center p-7 bg-muted/30 rounded-xl max-w-xl mx-auto">
          <BookOpen className="h-9 w-9 mx-auto mb-4 text-primary/60" />
          <h3 className="text-xl font-medium mb-2">Access Academic Resources</h3>
          <p className="text-muted-foreground mb-5">Sign in to access a library of class notes, past papers, and study guides shared by students.</p>
          <Link to="/auth">
            <Button variant="outline" className="gap-2">
              Sign in to Access <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      )}
    </section>
  );
};

export default MaterialsSection;
