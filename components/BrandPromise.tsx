"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

interface BrandItem {
  id: number;
  title: string;
  description: string;
  image?: string | null;
}

export default function BrandPromise() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [brandItems, setBrandItems] = useState<BrandItem[]>([]);

  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL;

  useEffect(() => {
    const fetchBrandPromise = async () => {
      try {
        const res = await fetch(
          `${STRAPI_URL}/api/our-brand-promises?populate[BrandPromise][populate]=*`,
          { cache: "no-store" } // 🚀 Faster fresh response
        );

        const json = await res.json();
        const item = json?.data?.[0];
        if (!item) return;

        // Title
        setTitle(item.title || "Our Brand Promise");

        // Main description → rich text to plain
        const mainDesc =
          item.description
            ?.map((block: any) =>
              block.children?.map((child: any) => child.text).join("") || ""
            )
            .join("\n") || "";

        setDescription(mainDesc);

        // BrandPromise Items
        const promises: BrandItem[] =
          item.BrandPromise?.map((bp: any) => {
            const imageUrl = getStrapiMedia(bp.image?.url);

            return {
              id: bp.id,
              title: bp.title,
              description:
                bp.description
                  ?.map((block: any) =>
                    block.children
                      ?.map((child: any) => child.text)
                      .join("")
                  )
                  .join("\n") || "",
              image: imageUrl || "/placeholder.svg",
            };
          }) || [];

        setBrandItems(promises);
      } catch (err) {
        console.error("❌ Error fetching brand promise:", err);
      }
    };

    fetchBrandPromise();
  }, []);

  if (!brandItems.length) return null;

  return (
    <section className="bg-gradient-to-r from-primary/10 to-secondary/10 p-6 sm:p-8 md:p-12">
      <div className="text-center max-w-4xl mx-auto">
        {/* Title */}
        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8">
          <span className="playfair text-gradient">{title}</span>
        </h3>

        {/* Description */}
        <p className="text-muted-foreground mb-8 text-sm sm:text-base leading-relaxed">
          {description}
        </p>

        {/* Brand Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 w-full mt-8">
          {brandItems.map((bp) => (
            <div
              key={bp.id}
              className="group bg-white shadow-lg border hover:shadow-xl transition flex flex-col"
            >
              {/* Image */}
              <div className="w-full h-40 relative overflow-hidden bg-gray-50">
                <Image
                  src={bp.image || "/placeholder.svg"}
                  alt={bp.title}
                  fill
                  className="object-contain transition-transform duration-500 ease-in-out group-hover:scale-110"
                  sizes="300px"
                  quality={70}
                />
              </div>

              {/* Content */}
              <div className="w-full bg-gray-100 flex flex-col flex-grow p-3 min-h-[120px]">
                <h3 className="mt-4 text-lg font-semibold text-gray-800 text-center">
                  {bp.title}
                </h3>
                <p className="mt-2 mb-4 text-sm text-gray-600 text-center px-3">
                  {bp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
