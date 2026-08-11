"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import Image from "next/image";

interface LanguageSelectorProps {
  currentLocale: string;
  changeLang: (lang: string) => void;
}

// ISO country codes for flags (using flagcdn.com)
const languages = [
  { code: "EN", name: "English", countryCode: "gb" },
  { code: "AF", name: "Afrikaans", countryCode: "za" },
  { code: "AR", name: "Arabic", countryCode: "sa" },
  { code: "UR", name: "Urdu", countryCode: "pk" },
  { code: "FR", name: "French", countryCode: "fr" },
  { code: "DE", name: "German", countryCode: "de" },
];

export default function LanguageSelector({ currentLocale, changeLang }: LanguageSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const current = languages.find((lang) => lang.code.toLowerCase() === currentLocale) || languages[0];

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-block text-left">
      {/* Button */}
      <button
       aria-label="Language"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 focus:outline-none shadow-md"
      >
        <Image
          src={`https://flagcdn.com/w20/${current.countryCode}-large.webp`}
          alt={current.name}
          className="w-5 h-5 rounded-sm object-cover"
          priority
          fill
        />
        <span className="ml-1 text-xs font-bold">{current.code}</span>
        <ChevronDown className="ml-1 w-3 h-3" />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          {languages.map((lang) => (
            <button
             aria-label="Language"
              key={lang.code}
              onClick={() => {
                changeLang(lang.code.toLowerCase());
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2 text-left hover:bg-gray-100 transition-colors"
            >
              <Image
                src={`https://flagcdn.com/w20/${lang.countryCode}-large.webp`}
                alt={lang.name}
                className="w-5 h-5 rounded-sm mr-2 object-cover"
                priority
                fill
              />
              <span className="text-sm">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
