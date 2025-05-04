
import { useState, useRef, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw } from 'lucide-react';
import ChatMessage from '@/components/ChatMessage';
import ChatGuidelines from '@/components/ChatGuidelines';
import { useChatHistory, ChatMessage as ChatMessageType } from '@/hooks/useChatHistory';
import { useLanguagePreference } from '@/hooks/useLanguagePreference';
import { ScrollArea } from '@/components/ui/scroll-area';
import ChatHeader from '@/components/chat-page/ChatHeader';
import ChatRatingButtons from '@/components/chat-page/ChatRatingButtons';
import ChatInputArea from '@/components/chat-page/ChatInputArea';

const Chat = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [recentResponse, setRecentResponse] = useState<ChatMessageType | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();
  const { messages, loading: historyLoading, addMessage } = useChatHistory(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { language, changeLanguage, availableLanguages } = useLanguagePreference();

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSendMessage = async (message: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication required",
        description: "Please sign in to send messages.",
      });
      return;
    }

    setIsLoading(true);
    
    // Save user message to history
    const userMessage = await addMessage(message, true, null, null);
    
    try {
      // Call Gemini API through edge function with selected language
      const { data, error } = await supabase.functions.invoke('chat-with-gemini', {
        body: {
          message,
          language: language.code
        }
      });

      if (error) throw error;

      // Save AI response to history
      const responseMessage = await addMessage(data.response, false, null, null);
      
      if (responseMessage) {
        setRecentResponse(responseMessage);
      }
    } catch (error) {
      console.error("Error getting AI response:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get a response. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRateResponse = async (helpful: boolean) => {
    if (!recentResponse) return;
    
    toast({
      title: helpful ? "Marked as helpful" : "Marked as not helpful",
      description: "Thank you for your feedback.",
    });
    
    // Reset recent response after rating
    setRecentResponse(null);
    
    // In a real app, you would save this rating to a database
  };

  const handleLanguageChange = (value: string) => {
    const selected = availableLanguages.find(lang => lang.code === value);
    if (selected) changeLanguage(selected);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="min-h-[calc(100vh-12rem)] flex flex-col">
        <CardContent className="flex-grow p-4 flex flex-col">
          <ChatHeader 
            language={language}
            availableLanguages={availableLanguages}
            onLanguageChange={handleLanguageChange}
          />

          <ChatGuidelines />
          
          <ScrollArea className="flex-grow mb-4 h-[calc(100vh-24rem)]">
            <div className="space-y-2 py-2">
              {historyLoading ? (
                <div className="flex justify-center py-4">
                  <RefreshCw className="h-6 w-6 animate-spin" />
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <p>No messages yet. Start a conversation in your preferred language!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <ChatMessage
                    key={msg.id}
                    message={msg.message}
                    isUserMessage={msg.isUserMessage}
                    timestamp={msg.timestamp}
                  />
                ))
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <ChatRatingButtons 
            responseMessage={recentResponse}
            onRateResponse={handleRateResponse}
          />
          
          <ChatInputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            languageName={language.name}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Chat;
