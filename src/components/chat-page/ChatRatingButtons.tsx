
import { Button } from "@/components/ui/button";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { ChatMessage } from "@/hooks/useChatHistory";

interface ChatRatingButtonsProps {
  responseMessage: ChatMessage | null;
  onRateResponse: (helpful: boolean) => void;
}

const ChatRatingButtons = ({ responseMessage, onRateResponse }: ChatRatingButtonsProps) => {
  if (!responseMessage) return null;
  
  return (
    <div className="flex justify-end gap-2 mb-4">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onRateResponse(true)}
        title="This was helpful"
      >
        <ThumbsUp className="h-4 w-4 mr-1" />
        Helpful
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => onRateResponse(false)}
        title="This was not helpful"
      >
        <ThumbsDown className="h-4 w-4 mr-1" />
        Not Helpful
      </Button>
    </div>
  );
};

export default ChatRatingButtons;
