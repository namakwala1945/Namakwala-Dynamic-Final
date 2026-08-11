"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { getStrapiMedia } from "@/lib/media"; // ⭐ use helper

export default function NamakwalaCare() {
  const [careData, setCareData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/namakwala-cares?populate=*`)
      .then((res) => res.json())
      .then((res) => {
        if (res?.data && res.data.length > 0) {
          setCareData(res.data[0]);
        }
      })
      .catch((err) => console.error("Error fetching data:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-center py-10">Loading...</p>;
  }

  if (!careData || !careData.namakwalaCareImage) {
    return <p className="text-center py-10 text-gray-500">No banner data found.</p>;
  }

  // ⭐ Replace direct URL with helper
  const imageUrl = getStrapiMedia(careData.namakwalaCareImage.url);
  const altText = careData.namakwalaCareImage.alternativeText || "Namakwala Care";
  const careText = careData.namakwalaCareText;

  return (
    <section className="pt-2 pb-2 bg-[#fdf2df]"> 
      <div className="container text-center justify-center py-8"> 
        <div className="w-full max-w-[680px] mx-auto pb-5">
          <Image
            src={imageUrl || ""}
            alt={altText}
            width={680}
            height={400}
            className="object-contain object-center w-full h-auto"
            priority
          />
        </div>

        <p className="text-xl nunitoFont font-light pt-4 sm:text-lg md:text-2xl lg:text-4xl pb-0">
          {careText}
        </p>
      </div>
    </section>
  );
}
