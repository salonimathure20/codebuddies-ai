/**import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";


i18n
  .use(Backend)
  .use(LanguageDetector) // Detects user's language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: require("../public/en/common.json")
      },
      sp: {
        translation: require("../public/sp/common.json")
      }
    },
    fallbackLng: "en", // Default language
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
**/

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";

i18n
  .use(Backend) // Load translations from the backend
  .use(LanguageDetector) // Detect user's language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    fallbackLng: ["en"], // Default language
    debug: true, // Enable debug mode for logs
    backend: {
      loadPath: "/i18n/{{lng}}/{{ns}}.json", // Path to translation files
    },
    ns: ["common"], // Default namespace
    defaultNS: "common",
    supportedLngs: ["en", "sp"],
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for simplicity
    },
  });

export default i18n;
