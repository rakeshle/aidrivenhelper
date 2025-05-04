
import { useEffect, useRef } from "react";
import { StudyGroupMessage } from "@/services/studyGroupsService";
import { Loader2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface ChatMessageListProps {
  messages: StudyGroupMessage[];
  userId?: string;
  isLoading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const ChatMessageList = ({ 
  messages, 
  userId, 
  isLoading,
  error,
  onRetry 
}: ChatMessageListProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Format the time
  const formatMessageTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return "Recently";
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <Loader2 className="h-8 w-8 text-primary animate-spin mb-2" />
        <p className="text-sm text-muted-foreground">Loading messages...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <div className="bg-destructive/10 rounded-full p-3 mb-3">
          <AlertCircle className="h-7 w-7 text-destructive" />
        </div>
        <p className="text-sm text-center mb-3">{error}</p>
        {onRetry && (
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={onRetry}
            size="sm"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </Button>
        )}
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4">
        <p className="text-sm text-muted-foreground text-center">No messages yet. Be the first to start the conversation!</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((message) => {
        const isCurrentUser = message.user_id === userId;
        return (
          <div
            key={message.id}
            className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-3 ${
                isCurrentUser
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted"
              }`}
            >
              {message.profile?.username && !isCurrentUser && (
                <p className="text-xs font-medium mb-1 opacity-70">
                  {message.profile.full_name || message.profile.username}
                </p>
              )}
              <p className="break-words whitespace-pre-wrap">{message.message}</p>
              <p className="text-xs opacity-70 mt-1 text-right">
                {formatMessageTime(message.created_at)}
              </p>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatMessageList;
