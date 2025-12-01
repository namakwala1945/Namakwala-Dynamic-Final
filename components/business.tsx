"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

type Business = {
  title: string;
  description: string;
  bannerImage: string;
  slug: string;
  buttonText: string;
};

export default function BusinessSection() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [active, setActive] = useState(0);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    async function fetchBusinesses() {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/product-tabs?populate=*`,
          { cache: "force-cache",next: { revalidate: 60 }, }
          
        );

        const data = await res.json();

        if (data?.data?.length > 0) {
          const formatted: Business[] = data.data.map((item: any) => {
            const bg = item.backgroundImage?.[0];

            const imageUrl = getStrapiMedia(
              bg?.url ||
                bg?.formats?.large?.url ||
                bg?.formats?.medium?.url ||
                bg?.formats?.thumbnail?.url
            );

            const descriptionText = (item.description || [])
              .map((block: any) =>
                block.children?.map((c: any) => c.text).join("") || ""
              )
              .join("\n");

            return {
              title: item.title || "",
              description: descriptionText,
              bannerImage: imageUrl,
              slug: (item.buttonLink || "").replace(/^\//, ""),
              buttonText: item.buttonText || "View More",
            };
          });

          setBusinesses(formatted);
        }
      } catch (err) {
        console.error("Error fetching product tabs:", err);
      }
    }

    fetchBusinesses();
  }, []);

  if (!businesses.length) {
    return <p className="text-center py-10">Loading businesses...</p>;
  }

  return (
    <div className="relative w-full min-h-screen poppins">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url(${businesses[active].bannerImage})` }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-80 shadow-inner"></div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col md:flex-row h-full w-full md:w-[95%] mx-auto">
        
        {/* Tabs */}
        <div className="flex flex-wrap md:flex-col order-1 md:order-2 w-full md:w-1/3 p-4 md:p-12 text-white md:justify-center">
          {businesses.map((b, index) => (
            <button
              aria-label={b.title}
              key={index}
              onClick={() => setActive(index)}
              className={`w-1/2 md:w-full text-center md:text-left py-4 px-2 md:px-4 border-b-4 transition-all duration-300 uppercase text-sm md:text-xl ${
                active === index
                  ? "border-[#be9244] text-white"
                  : "border-gray-300 hover:border-[#be9244]"
              }`}
            >
              {b.title}
            </button>
          ))}
        </div>

        {/* Content Section */}
        <div className="order-2 md:order-1 w-full md:w-2/3 p-4 md:p-12 flex flex-col justify-center text-white">
          <span className="flex items-center gap-3 text-lg md:text-2xl font-semibold mb-4 md:mb-6 uppercase">
            <Image
              src="/optimized/logo-ring-large.webp"
              alt="Namakwala Ring"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
            <span>Our Businesses</span>
          </span>

          <h1 className="text-3xl md:text-6xl playfair mb-4">
            {businesses[active].title}
          </h1>

          <p className="whitespace-pre-line text-sm md:text-base leading-relaxed">
            {businesses[active].description}
          </p>

          <div className="mt-6 md:mt-12 flex flex-col sm:flex-row gap-4">
            <Link href={`/${businesses[active].slug}`}>
              <button
                aria-label="View More"
                className="px-6 py-2 border-2 border-[#be9244] text-[#be9244] rounded hover:bg-[#9c7936] hover:text-white transition-colors w-full sm:w-auto"
              >
                {businesses[active].buttonText}
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
