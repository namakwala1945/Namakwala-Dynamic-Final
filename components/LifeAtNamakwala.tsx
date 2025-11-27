"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { fastFetch } from "@/lib/fetcher";
import { getStrapiMedia } from "@/lib/media";

interface LifeAtNamakwala {
  title: string;
  description: string;
  images: { src: string; alt: string }[];
}

export default function LifeAtNamakwala() {
  const [data, setData] = useState<LifeAtNamakwala | null>(null);

  const BASE_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    const loadData = async () => {
      if (!BASE_URL) {
        console.error("❌ Missing NEXT_PUBLIC_STRAPI_URL");
        return;
      }

      try {
        const json = await fastFetch(
          `${BASE_URL}/api/life-at-namakwalas?populate=*`
        );

        const item = json?.data?.[0];
        if (!item) return;

        // ✔ Extract Title
        const title = item.title || "Life at Namakwala";

        // ✔ Rich text → Plain text conversion
        const description =
          item.description
            ?.map((block: any) =>
              block.children?.map((child: any) => child.text).join("") || ""
            )
            .join("\n") || "Experience vibrant culture and teamwork at Namakwala.";

        // ✔ Extract Images with getStrapiMedia
        const images =
          item.image?.map((img: any) => {
            const src = getStrapiMedia(img?.url) || "/placeholder.png";
            return {
              src,
              alt: img?.alternativeText || img?.name || "Life at Namakwala",
            };
          }) || [];

        setData({ title, description, images });
      } catch (err) {
        console.error("❌ API Fetch Error:", err);
      }
    };

    loadData();
  }, []);

  if (!data) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <section className="relative">
      <div className="bg-[#d2ab67] px-4 sm:px-6 lg:px-16 py-6 sm:py-8 lg:py-12 poppins">
        <div className="w-full md:w-[97%] mx-auto bg-white p-2 sm:p-4 md:p-6 lg:p-6 grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 items-start">

          {/* LEFT IMAGE GRID */}
          <div className="grid grid-cols-2 sm:grid-cols-2 gap-2 sm:gap-4">
            {data.images.map((img, idx) => (
              <div
                key={idx}
                className="overflow-hidden shadow-lg relative rounded-lg"
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={600}
                  height={400}
                  className="w-full h-28 sm:h-32 md:h-40 lg:h-48 xl:h-56 object-cover transition-transform duration-500 hover:scale-105"
                  priority={idx === 0}
                />
              </div>
            ))}
          </div>

          {/* RIGHT CONTENT */}
          <div className="text-gray-700 space-y-2 sm:space-y-4 text-center lg:text-left mt-4 lg:mt-0">
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl playfair font-bold text-gradient">
              {data.title}
            </h1>

            <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
              {data.description}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
