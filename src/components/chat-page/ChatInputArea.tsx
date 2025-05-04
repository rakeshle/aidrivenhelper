
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";
import VoiceInput from "@/components/VoiceInput";

interface ChatInputAreaProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  languageName: string;
}

const ChatInputArea = ({ onSendMessage, isLoading, languageName }: ChatInputAreaProps) => {
  const [message, setMessage] = useState('');

  const handleVoiceInput = (transcript: string) => {
    setMessage(transcript);
  };

  const handleSend = () => {
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="flex gap-2 items-center">
      <VoiceInput onTranscript={handleVoiceInput} />
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={`Type your question in ${languageName}...`}
        className="flex-grow"
        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        disabled={isLoading}
      />
      <Button 
        onClick={handleSend} 
        disabled={isLoading || !message.trim()}
      >
        {isLoading ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default ChatInputArea;
