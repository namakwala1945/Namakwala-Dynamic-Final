// 🚀 Force dynamic rendering — always get latest Strapi data
export const dynamic = "force-dynamic";

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import Script from "next/script";
import { Metadata as NextMetadata } from "next";
import { getStrapiMedia } from "@/lib/media";
import ContentRenderer from "@/components/ContentRenderer"; // ✅

const API_URL = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/terms-of-service?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`;

// ----------------------
// Types
// ----------------------
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

interface TermsOfServiceData {
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

// ----------------------
// Fetch Function
// ----------------------
async function getTermsData(): Promise<TermsOfServiceData> {
  const res = await fetch(API_URL, { cache: "no-store" });

  if (!res.ok) throw new Error("Failed to fetch Terms of Service data");

  const json = await res.json();
  return json.data;
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
  const data = await getTermsData();
  const meta = data.Metadata || {};

  const metaTitle = meta.title || "Terms of Service | Namakwala";
  const metaDescription =
    extractTextFromRichText(meta.description) || "Namakwala Terms of Service";
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
      description: extractTextFromRichText(meta.openGraph?.description) || metaDescription,
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
export default async function TermsOfServicePage() {
  const data = await getTermsData();
  const banner = data.pagebanner;
  const sections = data.CommonSection;
  const baseUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  return (
    <section className="relative bg-gray-100 poppins">
      {/* ✅ Structured Data */}
      <Script type="application/ld+json" id="terms-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: data.title,
          description: extractTextFromRichText(data.description),
          url: data.Metadata?.openGraph?.url,
        })}
      </Script>

      {/* ✅ Breadcrumb structured data */}
      <Script type="application/ld+json" id="breadcrumb-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: "https://www.namakwala.in/" },
            {
              "@type": "ListItem",
              position: 2,
              name: "Terms of Service",
              item: "https://www.namakwala.in/terms-of-service",
            },
          ],
        })}
      </Script>

      {/* ✅ Banner */}
      <PageBanner
        title={banner?.title}
        category={banner?.heading}
        image={banner?.image?.url ? `${baseUrl}${banner.image.url}` : "/optimized/fallback-image.jpg"}
      />

      {/* ✅ Main Content */}
      <div className="container cabin cabin-400 mx-auto px-6 py-16 space-y-20">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl playfair text-gradient font-extrabold animate-slideUp">
            {data.title}
          </h1>
          <div className="text-lg md:text-xl prose prose-lg max-w-full">
            <ContentRenderer content={data.description} />
          </div>
        </div>

        {/* Sections */}
        {sections?.map((section, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={section.id}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 animate-fadeIn ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Card */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300 -mt-24 md:-mt-0"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 animate-slideUp cabin cabin-700 text-gradient">
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
                    src={`${baseUrl}${section.image.url}`}
                    alt={section.title}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
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
