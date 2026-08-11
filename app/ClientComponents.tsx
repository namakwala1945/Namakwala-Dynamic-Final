"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Loader from "@/components/Loader/Loader";
import ContentProtector from "./ContentProtector"; 

const CustomCursor = dynamic(() => import("@/components/Cursor"), {
  ssr: false,
});

export default function ClientComponents() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let imagesLoaded = false;
    let translateLoaded = false;

    // --- IMAGE LOAD CHECK ---
    const checkImagesLoaded = () => {
      const total = document.images.length;
      if (total === 0) {
        imagesLoaded = true;
        return finishLoading();
      }

      let count = 0;
      for (const img of document.images) {
        if (img.complete) {
          count++;
          if (count === total) {
            imagesLoaded = true;
            finishLoading();
          }
          continue;
        }
        img.addEventListener("load", () => {
          count++;
          if (count === total) {
            imagesLoaded = true;
            finishLoading();
          }
        });
        img.addEventListener("error", () => {
          count++;
          if (count === total) {
            imagesLoaded = true;
            finishLoading();
          }
        });
      }
    };

    // --- GOOGLE TRANSLATE CHECK ---
    // @ts-ignore
    window.googleTranslateElementInit = () => {
      // @ts-ignore
      new window.google.translate.TranslateElement(
        { pageLanguage: "en" },
        "google_translate_element"
      );
      translateLoaded = true;
      finishLoading();
    };

    const script = document.createElement("script");
    script.src =
      "https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
    script.async = true;
    document.body.appendChild(script);

    // --- FALLBACK TIMEOUT (loader never stuck) ---
    const timeout = setTimeout(() => {
      imagesLoaded = true;
      translateLoaded = true;
      finishLoading();
    }, 2500);

    // --- FINAL UNLOCK ---
    const finishLoading = () => {
      if (imagesLoaded && translateLoaded) {
        clearTimeout(timeout);
        setLoading(false);
      }
    };

    // start image check
    checkImagesLoaded();

    return () => {
      clearTimeout(timeout);
      document.body.removeChild(script);
    };
  }, []);

  return (
    <>
      <Loader show={loading} />

      {/* 🔒 Block copy, right click, inspect, select */}
      {/* <ContentProtector /> */}

      {!loading && <CustomCursor />}
    </>
  );
}
