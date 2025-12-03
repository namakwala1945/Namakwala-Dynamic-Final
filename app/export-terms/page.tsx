// app/export-terms/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";
import type { Metadata as NextMetadata } from "next";

// ----------------------------------------
// API URL
// ----------------------------------------
const API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/export-terms-and-condition?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`;

// ----------------------------------------
// Types
// ----------------------------------------
interface StrapiImage {
  url: string;
}

interface StrapiDescription {
  type: string;
  children: { type: string; text: string }[];
}

interface Section {
  id: number;
  title: string;
  description: StrapiDescription[];
  image?: StrapiImage;
}

interface ExportTermsData {
  title: string;
  description: StrapiDescription[];
  Metadata: any;
  pagebanner: {
    title: string;
    heading: string;
    image: StrapiImage;
  };
  CommonSection: Section[];
}

// ----------------------------------------
// Fetch Function
// ----------------------------------------
async function getExportTermsData(): Promise<ExportTermsData> {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) {
    console.error("❌ Failed to fetch export terms:", res.statusText);
    throw new Error("Failed to fetch export terms data");
  }

  const json = await res.json();
  return json.data;
}

// ----------------------------------------
// ⭐ Metadata Generator (SERVER COMPONENT SAFE)
// ----------------------------------------
export async function generateMetadata(): Promise<NextMetadata> {
  try {
    const data = await getExportTermsData();
    const seo = data?.Metadata;

    return {
      title: seo?.title || data?.title || "Export Terms & Conditions",
      description: seo?.description || "",
      keywords: seo?.keywords || "",
      openGraph: {
        title: seo?.openGraph?.title || seo?.title,
        description: seo?.openGraph?.description || seo?.description,
        url: seo?.openGraph?.url || "",
        siteName: seo?.openGraph?.siteName || "",
        images:
          seo?.openGraph?.images?.map((img: any) => ({
            url: getStrapiMedia(img.url),
            width: img.width || 1200,
            height: img.height || 630,
            alt: img.alt || seo?.title,
          })) || [],
      },
    };
  } catch (e) {
    console.error("❌ Metadata generation failed:", e);
    return {
      title: "Export Terms & Conditions",
      description: "",
    };
  }
}

// ----------------------------------------
// Page Component (Server Component)
// ----------------------------------------
export default async function ExportTermsPage() {
  const data = await getExportTermsData();

  const banner = data.pagebanner;
  const sections = data.CommonSection;

  return (
    <section className="relative poppins w-auto bg-gray-50">
      {/* Banner */}
      <PageBanner
        title={banner?.title}
        image={getStrapiMedia(banner?.image?.url) || "/optimized/fallback-image.jpg"}
        category={banner?.heading}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-20 space-y-32">

        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <h1 className="text-5xl playfair font-extrabold text-gradient mb-4">
            {data.title}
          </h1>

          <div className="text-lg md:text-xl text-gray-800 prose max-w-full text-justify">
            <ContentRenderer content={data.description} />
          </div>
        </div>

        {/* Sections */}
        {sections?.map((section, idx) => {
          const isEven = idx % 2 === 0;
          const imageUrl = getStrapiMedia(section.image?.url);

          return (
            <div
              key={section.id}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 poppins animate-fadeIn ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Card */}
              <div
                className="md:w-1/2 bg-white p-10 md:p-12 rounded-xl shadow-2xl 
                z-10 relative border border-gray-200 hover:scale-105 transition-transform duration-300 -mt-24 md:-mt-0"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-4xl playfair font-extrabold text-gradient mb-4">
                  {section.title}
                </h2>

                <div className="text-gray-700 prose max-w-full text-justify">
                  <ContentRenderer content={section.description} />
                </div>
              </div>

              {/* Image */}
              {imageUrl && (
                <div
                  className={`md:w-1/2 mt-12 md:mt-0 relative md:-top-10 overflow-hidden 
                  rounded-xl shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500 ${
                    isEven ? "md:-ml-20" : "md:-mr-20"
                  }`}
                  style={{ minHeight: "320px" }}
                >
                  <Image
                    src={imageUrl}
                    alt={section.title}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-700"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
