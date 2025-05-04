
import { useState, useEffect } from "react";

export type Language = {
  code: string;
  name: string;
};

const AVAILABLE_LANGUAGES: Language[] = [
  { code: "en", name: "English" },
  { code: "sw", name: "Swahili" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
  { code: "ar", name: "Arabic" },
];

export const useLanguagePreference = () => {
  const [language, setLanguage] = useState<Language>(AVAILABLE_LANGUAGES[0]);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      try {
        const parsed = JSON.parse(savedLanguage);
        setLanguage(parsed);
      } catch (e) {
        // If parsing fails, use default language
        setLanguage(AVAILABLE_LANGUAGES[0]);
      }
    }
  }, []);

  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
    localStorage.setItem("preferred-language", JSON.stringify(newLanguage));
  };

  return {
    language,
    changeLanguage,
    availableLanguages: AVAILABLE_LANGUAGES,
  };
};
