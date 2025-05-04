
import { AlertCircle, Globe, Book } from "lucide-react";
import {
  Alert,
  AlertTitle,
  AlertDescription,
} from "@/components/ui/alert";

const ChatGuidelines = () => {
  return (
    <div className="space-y-4 mb-6">
      <Alert>
        <Globe className="h-4 w-4" />
        <AlertTitle>Language Selection</AlertTitle>
        <AlertDescription>
          Choose your preferred language from the dropdown menu above. The AI will respond in your selected language.
        </AlertDescription>
      </Alert>

      <Alert>
        <Book className="h-4 w-4" />
        <AlertTitle>Subject and Context</AlertTitle>
        <AlertDescription>
          Select a subject to focus the conversation.
        </AlertDescription>
      </Alert>

      <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Important Notes</AlertTitle>
        <AlertDescription>
          <ul className="list-disc list-inside space-y-1">
            <li>Messages are saved to your chat history</li>
            <li>Use voice input if you prefer speaking</li>
            <li>Click on any message to copy its content</li>
          </ul>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ChatGuidelines;
