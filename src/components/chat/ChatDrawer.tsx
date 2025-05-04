
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { StudyGroup } from "@/services/studyGroupsService";

interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  group: StudyGroup | null;
  children: React.ReactNode;
  expiryTime: string;
}

const ChatDrawer = ({ isOpen, onClose, group, children, expiryTime }: ChatDrawerProps) => {
  return (
    <Drawer open={isOpen} onOpenChange={() => onClose()}>
      <DrawerContent className="max-h-[85vh]">
        <DrawerHeader className="flex justify-between items-start">
          <div>
            <DrawerTitle>{group?.name}</DrawerTitle>
            <DrawerDescription className="flex items-center justify-between">
              <div>
                <span className="text-sm">{group?.subject}</span>
                <span className="text-xs block mt-1 text-muted-foreground">
                  {expiryTime}
                </span>
              </div>
            </DrawerDescription>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="mt-1"
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerHeader>
        
        {children}
      </DrawerContent>
    </Drawer>
  );
};

export default ChatDrawer;
