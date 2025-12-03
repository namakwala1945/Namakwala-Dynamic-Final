// app/about/page.tsx

export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import AboutContent from "./AboutContent";
import ContentRenderer from "@/components/ContentRenderer"; // ✅ ADDED

// ----------------------
// 🔹 Fetch Function
// ----------------------
async function getAboutUsData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-us?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[OurJourney][populate]=*&populate[KnowAboutUs][populate]=*&populate[KeyMilestonesOptions][populate]=*&populate[CommonSection][populate]=*`,
    { cache: "no-store" }
  );

  if (!res.ok) throw new Error("Failed to fetch About Us data");

  const { data } = await res.json();
  return data;
}

// ----------------------
// 🔹 Dynamic Metadata with JSON-LD Schema
// ----------------------
export async function generateMetadata() {
  const data = await getAboutUsData();
  const meta = data?.Metadata;
  const schemaData = data?.PageSchema;

  // ⚡ Build JSON-LD schema if available
  const schema = schemaData
    ? {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: schemaData?.Name,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: schemaData?.RatingValue,
          ratingCount: schemaData?.RatingCount,
          reviewCount: schemaData?.ReviewCount,
        },
      }
    : null;

  const ogImage = data?.pagebanner?.image?.url
    ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.pagebanner.image.url}`
    : "https://namakwala.in/default.jpg";

  return {
    title: meta?.title || "About Namakwala",
    description:
      meta?.description?.[0]?.children?.[0]?.text ||
      "Learn more about Namakwala’s journey, milestones, and leadership.",

    keywords: meta?.keywords || "Namakwala, About Namakwala, company profile",

    openGraph: {
      title: meta?.openGraph?.title || meta?.title,
      description:
        meta?.openGraph?.description?.[0]?.children?.[0]?.text ||
        meta?.description?.[0]?.children?.[0]?.text,
      siteName: meta?.openGraph?.siteName || "Namakwala Group",
      images: [ogImage],
      url: meta?.openGraph?.url || "https://www.namakwala.com/about",
    },

    twitter: {
      card: meta?.twitter?.card || "summary_large_image",
      title: meta?.twitter?.title || meta?.title,
      description:
        meta?.twitter?.description?.[0]?.children?.[0]?.text ||
        meta?.description?.[0]?.children?.[0]?.text,
      images: [ogImage],
    },

    // ✅ Inject JSON-LD Schema
    additionalMetaTags: schema
      ? [
          {
            name: "ld+json",
            content: JSON.stringify(schema),
          },
        ]
      : [],
  };
}

// ----------------------
// 🔹 Server Component Page
// ----------------------
export default async function AboutPage() {
  const data = await getAboutUsData();

  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <AboutContent data={data} />
    </Suspense>
  );
}
