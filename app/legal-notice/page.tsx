// 🚀 Force dynamic rendering — always get latest Strapi data
export const dynamic = "force-dynamic";

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata as NextMetadata } from "next";
import { getStrapiMedia } from "@/lib/media";
import ContentRenderer from "@/components/ContentRenderer"; // ✅

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

interface FraudAlertData {
  title: string;
  description: StrapiDescription[];
  banner: {
    title: string;
    heading: string;
    image?: StrapiImage;
  };
  sections: Section[];
  metadata: any;
}

// ----------------------
// Fetch Function
// ----------------------
async function getFraudAlertData(): Promise<FraudAlertData | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/fraud-alert?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`,
      { cache: "no-store" }
    );
    if (!res.ok) throw new Error("Failed to fetch Fraud Alert data");

    const { data } = await res.json();

    return {
      title: data.title,
      description: data.description || [],
      banner: {
        title: data.pagebanner?.title || "",
        heading: data.pagebanner?.heading || "",
        image: data.pagebanner?.image || undefined,
      },
      sections:
        data.CommonSection?.map((section: any) => ({
          id: section.id,
          title: section.title,
          description: section.description || [],
          image: section.image || undefined,
        })) || [],
      metadata: data.Metadata || {},
    };
  } catch (error) {
    console.error("Fraud Alert fetch error:", error);
    return null;
  }
}

// ----------------------
// Helper: extract plain text from rich text
// ----------------------
function extractTextFromRichText(richText: any): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((block: any) =>
      block.children?.map((child: any) => child.text || "").join(" ")
    )
    .join("\n\n");
}

// ----------------------
// Metadata
// ----------------------
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getFraudAlertData();
  if (!data) return {};

  const meta = data.metadata || {};
  const metaTitle = meta.title || "Fraud Alert | Namakwala";
  const metaDescription =
    extractTextFromRichText(meta.description) || "Stay alert for fraud on Namakwala.";

  const metaImage = meta.metaImage?.url
    ? getStrapiMedia(meta.metaImage.url)
    : "/default-og-image.jpg";

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: meta.keywords,
    alternates: { canonical: meta.openGraph?.url },
    openGraph: {
      title: meta.openGraph?.title || metaTitle,
      description:
        extractTextFromRichText(meta.openGraph?.description) || metaDescription,
      url: meta.openGraph?.url,
      siteName: meta.openGraph?.siteName,
      images: [metaImage],
      type: "website",
    },
    twitter: {
      card: meta.twitter?.card || "summary_large_image",
      title: meta.twitter?.title || metaTitle,
      description: extractTextFromRichText(meta.twitter?.description) || metaDescription,
      images: [metaImage],
    },
  };
}

// ----------------------
// Page Component
// ----------------------
export default async function FraudAlertPage() {
  const page = await getFraudAlertData();
  if (!page) return notFound();

  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <section className="relative poppins w-auto bg-[#d2ab67] mx-auto">
      {/* Page Banner */}
      <PageBanner
        title={page.banner.title}
        image={page.banner.image?.url ? getStrapiMedia(page.banner.image.url) : "/optimized/fallback-image.jpg"}
        category={page.banner.heading}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 space-y-24">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn text-white">
          <h1 className="text-4xl md:text-5xl playfair font-extrabold animate-slideUp">
            {page.title}
          </h1>
          <div className="text-lg md:text-xl animate-slideUp delay-100 prose prose-lg max-w-full text-justify text-white">
            <ContentRenderer content={page.description} />
          </div>
        </div>

        {/* Sections */}
        {page.sections.map((section, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={section.id}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 animate-fadeIn ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Box */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300 -mt-24 md:-mt-0"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 playfair text-gradient">
                  {section.title}
                </h2>
                <div className="text-gray-700 prose prose-lg max-w-full text-justify">
                  <ContentRenderer content={section.description} />
                </div>
              </div>

              {/* Image */}
              {section.image?.url && (
                <div
                  className={`md:w-1/2 mt-8 md:mt-0 relative md:-top-8 overflow-hidden shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500 ${
                    isEven ? "md:-ml-16" : "md:-mr-16"
                  }`}
                  style={{ minHeight: "320px" }}
                >
                  <Image
                    src={getStrapiMedia(section.image.url)}
                    alt={section.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
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
