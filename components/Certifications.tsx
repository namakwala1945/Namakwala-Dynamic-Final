"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

export interface Certification {
  image: string | null;
  name: string;
  description: string;
  position?: number;
}

interface CertificationsProps {
  title?: string;
}

export default function Certifications({
  title = "Certifications",
}: CertificationsProps) {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/certifications-sections?populate=*`,
          {
            cache: "no-store", // 🚀 Faster fresh response
          }
        );

        const data = await res.json();

        const mapped: Certification[] = data.data
          .map((item: any) => ({
            image: getStrapiMedia(item.image?.url), // 🚀 Optimized image URL
            name: item.title || "",
            description:
              item.description
                ?.map((d: any) =>
                  d.children?.map((c: any) => c.text).join(" ")
                )
                .join(" ") || "",
            position: Number(item.certificationsPosition) || Infinity,
          }))
          .sort((a: any, b: any) => a.position - b.position);

        setCertifications(mapped);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching certifications:", err);
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) return <p className="text-center">Loading certifications...</p>;
  if (certifications.length === 0) return null;

  return (
    <div className="mb-8 md:mb-12">
      <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8">
        <span className="playfair text-gradient">{title}</span>
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {certifications.map((cert, index) => (
          <div
            key={index}
            className="bg-white p-4 sm:p-6 text-center hover-lift shadow-lg"
          >
            {/* IMAGE BOX */}
            <div className="w-20 h-20 mx-auto mb-2 sm:mb-4 relative">
              {cert.image ? (
                <Image
                  src={cert.image}
                  alt={cert.name}
                  fill
                  className="object-contain"
                  sizes="80px"
                  quality={70}
                />
              ) : (
                <div className="w-full h-full bg-gray-100"></div>
              )}
            </div>

            {/* TITLE */}
            <h4 className="font-bold mb-1 sm:mb-2 text-sm sm:text-base uppercase">
              {cert.name}
            </h4>

            {/* DESCRIPTION */}
            <p className="text-xs sm:text-sm text-muted-foreground">
              {cert.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
