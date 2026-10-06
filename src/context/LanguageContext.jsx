import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react";
import { languageOptions, normalizeLanguage, t as translate } from "../i18n/translations";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => normalizeLanguage(localStorage.getItem("tfb_lang")));

  const changeLang = useCallback((code) => {
    const nextLanguage = normalizeLanguage(code);
    setLang(nextLanguage);
    localStorage.setItem("tfb_lang", nextLanguage);
  }, []);

  useEffect(() => {
    document.documentElement.lang = languageOptions.find(({ code }) => code === lang)?.locale || "en-IN";
  }, [lang]);

  const t = useCallback((key, values) => translate(lang, key, values), [lang]);
  const formatNumber = useCallback((value, options) => (
    new Intl.NumberFormat(languageOptions.find(({ code }) => code === lang)?.locale || "en-IN", options).format(value)
  ), [lang]);
  const formatCurrency = useCallback((value) => (
    new Intl.NumberFormat(languageOptions.find(({ code }) => code === lang)?.locale || "en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }).format(value)
  ), [lang]);
  const formatDate = useCallback((value, options) => (
    new Intl.DateTimeFormat(languageOptions.find(({ code }) => code === lang)?.locale || "en-IN", {
      timeZone: "Asia/Kolkata",
      ...options,
    }).format(new Date(value))
  ), [lang]);
  const value = useMemo(
    () => ({ lang, setLang: changeLang, t, formatNumber, formatCurrency, formatDate }),
    [lang, changeLang, t, formatNumber, formatCurrency, formatDate],
  );
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
