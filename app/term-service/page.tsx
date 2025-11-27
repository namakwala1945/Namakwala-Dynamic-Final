// 🚀 Force dynamic rendering — always get latest Strapi data
export const dynamic = "force-dynamic";

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import Script from "next/script";

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
// Metadata
// ----------------------
export async function generateMetadata() {
  const data = await getTermsData();
  const meta = data.Metadata;

  return {
    title: meta?.title,
    description: meta?.description?.[0]?.children?.[0]?.text ?? "Namakwala Terms of Service",
    keywords: meta?.keywords,
    alternates: { canonical: meta?.openGraph?.url },
    openGraph: {
      title: meta?.openGraph?.title,
      description: meta?.openGraph?.description?.[0]?.children?.[0]?.text,
      url: meta?.openGraph?.url,
      siteName: meta?.openGraph?.siteName,
    },
    twitter: {
      card: meta?.twitter?.card,
      title: meta?.twitter?.title,
      description: meta?.twitter?.description?.[0]?.children?.[0]?.text,
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
          description: data.description?.[0]?.children?.[0]?.text,
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
        image={`${baseUrl}${banner?.image?.url}`}
      />

      {/* ✅ Main Content */}
      <div className="container cabin cabin-400 mx-auto px-6 py-16 space-y-20">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl cabin cabin-700 text-gradient font-extrabold animate-slideUp">
            {data.title}
          </h1>
          <p className="text-lg md:text-xl text-gray-700">
            {data.description?.[0]?.children?.[0]?.text}
          </p>
        </div>

        {/* Sections */}
        {sections?.map((section, idx) => {
          const isEven = idx % 2 === 0;
          const text =
            section.description
              ?.map((p) => p.children.map((c) => c.text).join(" "))
              .join("\n\n") || "";

          return (
            <div
              key={section.id}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Card */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800 animate-slideUp cabin cabin-700 text-gradient">
                  {section.title}
                </h2>
                <p className="text-gray-700 whitespace-pre-line">{text}</p>
              </div>

              {/* Image */}
              {section.image?.url && (
                <div
                  className={`md:w-1/2 mt-8 md:mt-0 relative md:-top-8 ${
                    isEven ? "md:-ml-16" : "md:-mr-16"
                  } overflow-hidden shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500`}
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
