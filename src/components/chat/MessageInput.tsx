
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Loader2 } from "lucide-react";

interface MessageInputProps {
  onSend: (message: string) => void;
  isSending?: boolean;
  disabled?: boolean;
}

const MessageInput = ({ onSend, isSending = false, disabled = false }: MessageInputProps) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  
  // Reset message when disabled state changes
  useEffect(() => {
    if (disabled) {
      setMessage("");
    }
  }, [disabled]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || isSending || disabled) return;
    
    onSend(message);
    setMessage("");
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle IME composition for languages like Japanese, Chinese
    if (isComposing) return;
    
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <div className="flex gap-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={disabled ? "Cannot send messages at this time" : "Type your message..."}
          className="min-h-[60px] resize-none"
          disabled={isSending || disabled}
        />
        <Button 
          type="submit" 
          size="icon" 
          className="h-[60px] shrink-0"
          disabled={!message.trim() || isSending || disabled}
        >
          {isSending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </Button>
      </div>
    </form>
  );
};

export default MessageInput;
