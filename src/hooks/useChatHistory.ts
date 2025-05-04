
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Tables } from "@/integrations/supabase/types";

export type ChatMessage = {
  id: string;
  message: string;
  isUserMessage: boolean;
  timestamp: string;
};

export const useChatHistory = (subjectId: string | null) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const fetchChatHistory = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from("chat_history")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true });

        if (subjectId) {
          query = query.eq("subject_id", subjectId);
        }

        const { data, error } = await query;

        if (error) throw error;

        const formattedMessages = (data || []).map((msg: Tables<"chat_history">) => ({
          id: msg.id,
          message: msg.message,
          isUserMessage: msg.is_user_message === true,
          timestamp: msg.created_at,
        }));

        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error fetching chat history:", error);
        toast({
          variant: "destructive",
          title: "Failed to load chat history",
          description: "Please try refreshing the page.",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchChatHistory();
  }, [user, subjectId, toast]);

  const addMessage = async (
    message: string,
    isUserMessage: boolean,
    subjectId: string | null = null,
    documentId: string | null = null
  ) => {
    if (!user) return null;

    try {
      const newMessage = {
        user_id: user.id,
        message,
        is_user_message: isUserMessage,
        subject_id: subjectId,
        document_context: documentId,
      };

      const { data, error } = await supabase
        .from("chat_history")
        .insert(newMessage)
        .select("*")
        .single();

      if (error) throw error;

      const formattedMessage: ChatMessage = {
        id: data.id,
        message: data.message,
        isUserMessage: data.is_user_message === true,
        timestamp: data.created_at,
      };

      setMessages((prev) => [...prev, formattedMessage]);
      return formattedMessage;
    } catch (error) {
      console.error("Error adding message to chat history:", error);
      toast({
        variant: "destructive",
        title: "Failed to save message",
        description: "Your message could not be saved to history.",
      });
      return null;
    }
  };

  return {
    messages,
    loading,
    addMessage,
  };
};
