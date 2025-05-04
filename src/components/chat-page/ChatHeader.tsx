
import { Languages } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Language } from "@/hooks/useLanguagePreference";

interface ChatHeaderProps {
  language: Language;
  availableLanguages: Language[];
  onLanguageChange: (value: string) => void;
}

const ChatHeader = ({ language, availableLanguages, onLanguageChange }: ChatHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">AI Chat Assistant</h2>
      <div className="flex items-center gap-4">
        <Languages className="h-5 w-5 text-muted-foreground" />
        <Select
          value={language.code}
          onValueChange={onLanguageChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select Language" />
          </SelectTrigger>
          <SelectContent>
            {availableLanguages.map((lang) => (
              <SelectItem key={lang.code} value={lang.code}>
                {lang.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ChatHeader;
