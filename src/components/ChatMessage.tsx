
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ChatMessageProps {
  message: string;
  isUserMessage: boolean;
  timestamp?: string;
}

const ChatMessage = ({ message, isUserMessage, timestamp }: ChatMessageProps) => {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    toast({
      description: "Message copied to clipboard",
      duration: 2000,
    });
  };

  return (
    <div
      className={cn(
        "flex w-full mb-4 animate-in fade-in",
        isUserMessage ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-3 shadow-sm relative group",
          isUserMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        <p className="whitespace-pre-wrap">{message}</p>
        {timestamp && (
          <div className="text-xs opacity-50 mt-1 text-right">
            {new Date(timestamp).toLocaleTimeString()}
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={handleCopy}
        >
          <Copy className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatMessage;
