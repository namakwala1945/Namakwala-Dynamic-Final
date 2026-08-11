import { useState, useEffect } from "react";

export function detectLanguage(): string {
  if (typeof navigator !== "undefined") {
    return navigator.language.split("-")[0]; // e.g. "fr"
  }
  return "en";
}

// Utility to dynamically import and merge all JSON in a folder
async function loadLocale(locale: string) {
  try {
    const context = require.context(`../locales/${locale}`, false, /\.json$/);
    const files = context.keys();
    const merged: Record<string, any> = {};

    for (const file of files) {
      const module = await import(`../locales/${locale}/${file.replace("./", "")}`);
      const key = file.replace("./", "").replace(".json", "");
      merged[key] = module.default;
    }

    return merged;
  } catch (e) {
    // fallback to English
    return loadLocale("en");
  }
}

export default function useTranslation() {
  const [locale, setLocale] = useState("en");
  const [messages, setMessages] = useState<any>({});

  useEffect(() => {
    const lang = detectLanguage();
    setLocale(lang);

    loadLocale(lang).then(setMessages);
  }, []);

  const t = (key: string) => {
    const keys = key.split(".");
    let value: any = messages;
    for (const k of keys) {
      value = value?.[k];
      if (!value) break;
    }
    return value || key;
  };

  return { t, locale, setLocale };
}
