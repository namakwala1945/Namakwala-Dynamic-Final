// app/fraud-alert/page.tsx

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "@/lib/media"; // ✅ Added helper

// ----------------------
// Types
// ----------------------
interface Section {
  title: string;
  description: string[];
  image?: string;
}

interface FraudAlert {
  title: string;
  description: string;
  banner: {
    title: string;
    heading: string;
    image?: string;
  };
  sections: Section[];
  metadata: {
    title: string;
    description: string;
    keywords: string;
    openGraph: {
      title: string;
      description: string;
      url: string;
      siteName: string;
    };
    twitter: {
      card: string;
      title: string;
      description: string;
    };
  };
}

// ----------------------
// Fetch function
// ----------------------
async function getFraudAlertData(): Promise<FraudAlert | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/fraud-alert?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`,
      { cache: "no-store" } // ⚡ always fresh
    );

    if (!res.ok) throw new Error("Failed to fetch Fraud Alert data");

    const { data } = await res.json();

    const fraudAlert: FraudAlert = {
      title: data.title,
      description:
        data.description?.[0]?.children?.[0]?.text || "Stay alert for fraud.",

      // ----------------------
      // ✅ Banner Image Fix using getStrapiMedia
      // ----------------------
      banner: {
        title: data.pagebanner?.title || "",
        heading: data.pagebanner?.heading || "",
        image: getStrapiMedia(data.pagebanner?.image?.url || null) || undefined,
      },

      // ----------------------
      // Sections
      // ----------------------
      sections:
        data.CommonSection?.map((section: any) => ({
          title: section.title,
          description:
            section.description?.map(
              (p: any) => p.children?.map((c: any) => c.text).join(" ")
            ) || [],
          image:
            getStrapiMedia(section.image?.url || null) || undefined, // ✅ safe conversion
        })) || [],

      // ----------------------
      // Metadata
      // ----------------------
      metadata: {
        title: data.Metadata?.title || "",
        description:
          data.Metadata?.description?.[0]?.children?.[0]?.text || "",
        keywords: data.Metadata?.keywords || "",
        openGraph: {
          title: data.Metadata?.openGraph?.title || "",
          description:
            data.Metadata?.openGraph?.description?.[0]?.children?.[0]?.text ||
            "",
          url: data.Metadata?.openGraph?.url || "",
          siteName: data.Metadata?.openGraph?.siteName || "",
        },
        twitter: {
          card: data.Metadata?.twitter?.card || "summary_large_image",
          title: data.Metadata?.twitter?.title || "",
          description:
            data.Metadata?.twitter?.description?.[0]?.children?.[0]?.text || "",
        },
      },
    };

    return fraudAlert;
  } catch (error) {
    console.error("Fraud Alert fetch error:", error);
    return null;
  }
}

// ----------------------
// Metadata
// ----------------------
export async function generateMetadata() {
  const data = await getFraudAlertData();
  if (!data) return {};

  return {
    title: data.metadata.title,
    description: data.metadata.description,
    keywords: data.metadata.keywords,
    openGraph: {
      title: data.metadata.openGraph.title,
      description: data.metadata.openGraph.description,
      url: data.metadata.openGraph.url,
      siteName: data.metadata.openGraph.siteName,
    },
    twitter: {
      card: data.metadata.twitter.card,
      title: data.metadata.twitter.title,
      description: data.metadata.twitter.description,
    },
  };
}

// ----------------------
// Page Component
// ----------------------
export default async function FraudAlertPage() {
  const page = await getFraudAlertData();
  if (!page) return notFound();

  return (
    <section className="relative poppins w-auto bg-[#d2ab67] mx-auto">
      {/* Page Banner */}
      <PageBanner
        title={page.banner.title}
        image={page.banner.image || "/optimized/fallback-image.jpg"}
        category={page.banner.heading}
      />

      {/* Main Content */}
      <div className="container mx-auto px-6 py-12 space-y-24">
        <div className="text-center max-w-3xl mx-auto space-y-4 animate-fadeIn text-white">
          <h1 className="text-4xl md:text-5xl playfair font-extrabold animate-slideUp">
            {page.title}
          </h1>
          <p className="text-lg md:text-xl animate-slideUp delay-100">
            {page.description}
          </p>
        </div>

        {/* Sections */}
        {page.sections.map((section, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              } animate-fadeIn`}
            >
              {/* Text Box */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 playfair text-gradient">
                  {section.title}
                </h2>

                {Array.isArray(section.description) &&
                section.description.length > 1 ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {section.description.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">
                    {section.description.join("\n")}
                  </p>
                )}
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
                    className="object-cover animate-fadeIn"
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
