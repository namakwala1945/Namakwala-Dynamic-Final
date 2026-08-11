"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

interface FoundationItem {
  description: string;
  logo?: string | null;
  slider?: string[];
}

export default function FoundationSection() {
  const [foundation, setFoundation] = useState<FoundationItem | null>(null);
  const [current, setCurrent] = useState(0);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

  // Fetch foundation data with optimized request
  useEffect(() => {
    const fetchFoundation = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/namakwala-foundations?populate=*`,
          {
            cache: "no-store", // 🚀 forces fresh, fast response (no stale cache)
          }
        );

        const data = await res.json();

        if (data?.data?.length > 0) {
          const item = data.data[0];

          // Convert description rich-text to plain text
          const descriptionText = (item.description || [])
            .map((block: any) =>
              block.children?.map((c: any) => c.text).join("") || ""
            )
            .join("\n");

          // L O G O
          const logoUrl = getStrapiMedia(item.logo?.url);

          // S L I D E R
          const sliderUrls =
            item.sliderImage
              ?.map((img: any) => getStrapiMedia(img.url))
              .filter(Boolean) || [];

          setFoundation({
            description: descriptionText,
            logo: logoUrl,
            slider: sliderUrls,
          });
        }
      } catch (error) {
        console.error("Error fetching foundation:", error);
      }
    };

    fetchFoundation();
  }, []);

  // Auto slider
  useEffect(() => {
    if (!foundation?.slider || foundation.slider.length <= 1) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % foundation.slider!.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [foundation?.slider]);

  const nextSlide = () =>
    setCurrent((prev) => (prev + 1) % (foundation?.slider?.length || 1));

  const prevSlide = () =>
    setCurrent(
      (prev) =>
        (prev - 1 + (foundation?.slider?.length || 1)) %
        (foundation?.slider?.length || 1)
    );

  if (!foundation) {
    return <p className="text-center py-10">Loading foundation...</p>;
  }

  return (
    <section className="h-screen w-full flex items-center bg-[#fdf2df] shadow-lg p-4 md:p-16 poppins">
      <div className="w-full md:w-[97%] mx-auto bg-white overflow-hidden h-[80vh]">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 h-full">
          {/* LEFT CONTENT */}
          <div className="md:col-span-4 flex flex-col space-y-4 p-4 md:p-6 h-full">
            {foundation.logo && (
              <Image
                src={foundation.logo}
                alt="Namakwala Foundation"
                width={300}
                height={113}
                className="object-contain mb-2 mx-auto"
                priority
              />
            )}
            <p className="text-gray-700 text-sm md:text-base leading-relaxed text-center md:text-left">
              {foundation.description}
            </p>
          </div>

          {/* RIGHT SLIDER */}
          <div className="md:col-span-8 relative w-full h-full overflow-hidden">
            {foundation.slider && foundation.slider.length > 0 && (
              <Image
                key={current} // forces re-render for smooth animation
                src={foundation.slider[current]!}
                alt={`Slide ${current + 1}`}
                fill
                sizes="100vw"
                priority
                quality={70}
                className="object-cover"
              />
            )}

            {/* NAV BUTTONS */}
            {foundation.slider && foundation.slider.length > 1 && (
              <>
                <button
                  aria-label="Arrow Left"
                  onClick={prevSlide}
                  className="absolute top-1/2 left-2 md:left-4 -translate-y-1/2 bg-black/40 text-white p-1.5 md:p-2 rounded-full text-xs md:text-base"
                >
                  ◀
                </button>
                <button
                  aria-label="Arrow Right"
                  onClick={nextSlide}
                  className="absolute top-1/2 right-2 md:right-4 -translate-y-1/2 bg-black/40 text-white p-1.5 md:p-2 rounded-full text-xs md:text-base"
                >
                  ▶
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
