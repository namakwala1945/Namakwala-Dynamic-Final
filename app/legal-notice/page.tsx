// app/legal-notice/page.tsx

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "@/lib/media";
import PageSchemaScript from "@/components/PageSchemaScript"; // ✅ Added

// ----------------------
// Types
// ----------------------
interface CommonSection {
  title: string;
  description: string;
  image?: string;
}

interface PageBannerData {
  title: string;
  heading: string;
  image?: string;
}

interface MetadataType {
  title: string;
  description: string;
  keywords?: string;
  openGraph?: any;
  twitter?: any;
}

interface LegalNotice {
  title: string;
  description: string;
  banner: PageBannerData;
  sections: CommonSection[];
  metadata: MetadataType;
  PageSchema?: {
    Name: string;
    RatingValue: number;
    RatingCount: number;
    ReviewCount: number;
  };
}

// ----------------------
// Fetch Function
// ----------------------
async function getLegalNoticeData(): Promise<LegalNotice | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/legal-notice?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch Legal Notice data");

    const { data } = await res.json();

    const legalNotice: LegalNotice = {
      title: data.title,
      description: data.description?.[0]?.children?.[0]?.text || "",

      banner: {
        title: data.pagebanner?.title || "",
        heading: data.pagebanner?.heading || "",
        image: getStrapiMedia(data.pagebanner?.image?.url || null) || undefined,
      },

      sections:
        data.CommonSection?.map((section: any) => ({
          title: section.title,
          description:
            section.description
              ?.map((d: any) => d.children?.map((c: any) => c.text).join(" "))
              .join("\n") || "",
          image: getStrapiMedia(section.image?.url || null) || undefined,
        })) || [],

      metadata: data.Metadata || {},

      PageSchema: data.PageSchema
        ? {
            Name: data.PageSchema.Name || "Legal Notice",
            RatingValue: data.PageSchema.RatingValue ?? 0,
            RatingCount: data.PageSchema.RatingCount ?? 0,
            ReviewCount: data.PageSchema.ReviewCount ?? 0,
          }
        : {
            Name: "Legal Notice",
            RatingValue: 0,
            RatingCount: 0,
            ReviewCount: 0,
          },
    };

    return legalNotice;
  } catch (error) {
    console.error("Legal Notice fetch error:", error);
    return null;
  }
}

// ----------------------
// Page Component
// ----------------------
export default async function LegalNoticePage() {
  const page = await getLegalNoticeData();
  if (!page) return notFound();

  return (
    <section className="relative bg-gray-100 poppins">
      {/* ✅ Page Schema */}
      <PageSchemaScript schema={page.PageSchema} />

      {/* Banner */}
      <PageBanner
        title={page.banner.title}
        image={page.banner.image || "/optimized/fallback-image.jpg"}
        category={page.banner.heading}
        priority={true}
      />

      {/* Main Content */}
      <div className="w-full mx-auto px-6 py-16 space-y-28">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          <h1 className="text-4xl md:text-5xl playfair text-gradient font-extrabold animate-slideUp">
            {page.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700">{page.description}</p>
        </div>

        {/* Sections */}
        {page.sections.map((section, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 playfair text-gradient">
                  {section.title}
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {section.description}
                </p>
              </div>

              {/* Image */}
              {section.image && (
                <div
                  className={`md:w-1/2 mt-8 md:mt-0 relative md:-top-8 ${
                    isEven ? "md:-ml-16" : "md:-mr-16"
                  } overflow-hidden shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500`}
                  style={{ minHeight: "320px" }}
                >
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
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
