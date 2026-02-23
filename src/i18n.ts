import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import pt from "./locales/pt/translation.json";
import en from "./locales/en/translation.json";

const normalize = (lng: string) => (lng?.toLowerCase().startsWith("en") ? "en" : "pt");

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      pt: { translation: pt },
      en: { translation: en },
    },
    fallbackLng: "pt",
    supportedLngs: ["pt", "en"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "buluku_lang",
    },
    react: { useSuspense: false },
  });

i18n.on("languageChanged", (lng) => {
  const n = normalize(lng);
  document.documentElement.lang = n;
});

export default i18n;