import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata as NextMetadata } from "next";
import { getStrapiMedia } from "@/lib/media";
import ContentRenderer from "@/components/ContentRenderer"; // ✅ Import ContentRenderer

// ------------------------------------
// Types
// ------------------------------------
interface Section {
  title: string;
  description: any; // rich content blocks
  image?: string | null;
}

interface PageData {
  title: string;
  description: any; // rich content blocks
  banner: {
    title?: string;
    heading?: string;
    image?: string | null;
  };
  sections: Section[];
  meta?: {
    metaTitle?: string;
    metaDescription?: any;
    metaKeywords?: string;
    canonicalURL?: string;
    metaImage?: string | null;
  };
}

// ------------------------------------
// Fetch function
// ------------------------------------
async function getPrivacyPolicyData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/privacy-policy?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[CommonSection][populate]=*`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) throw new Error("Failed to fetch privacy policy data");

    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Privacy Policy fetch error:", error);
    return null;
  }
}

// ------------------------------------
// Helper: extract plain text from Strapi rich text
// ------------------------------------
function extractTextFromRichText(richText: any): string {
  if (!richText || !Array.isArray(richText)) return "";
  return richText
    .map((block: any) =>
      block.children?.map((child: any) => child.text || "").join(" ")
    )
    .join("\n\n");
}

// ------------------------------------
// Metadata
// ------------------------------------
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getPrivacyPolicyData();
  if (!data) return {};

  const meta = data.Metadata || {};

  const metaTitle = meta.title || "Privacy Policy | Namakwala";
  const metaDescription = extractTextFromRichText(meta.description) || "Learn about our privacy practices at Namakwala.";
  const metaImage = meta.metaImage?.url
    ? getStrapiMedia(meta.metaImage.url)
    : "/default-og-image.jpg";

  // OpenGraph
  const ogTitle = meta.openGraph?.title || metaTitle;
  const ogDescription = extractTextFromRichText(meta.openGraph?.description) || metaDescription;
  const ogUrl = meta.openGraph?.url || "https://www.namakwala.in/privacy-policy";

  // Twitter
  const twitterTitle = meta.twitter?.title || metaTitle;
  const twitterDescription = extractTextFromRichText(meta.twitter?.description) || metaDescription;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: meta.keywords,
    alternates: {
      canonical: meta.canonicalURL || ogUrl,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: ogUrl,
      images: [metaImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: [metaImage],
    },
  };
}

// ------------------------------------
// Component
// ------------------------------------
export default async function PrivacyPolicyPage() {
  const data = await getPrivacyPolicyData();
  if (!data) return notFound();

  const page: PageData = {
    title: data.title,
    description: data.description || [], // rich content blocks
    banner: {
      title: data.pagebanner?.title,
      heading: data.pagebanner?.heading,
      image: getStrapiMedia(data.pagebanner?.image?.url),
    },
    sections:
      data.CommonSection?.map((item: any) => ({
        title: item.title,
        description: item.description || [], // rich content blocks
        image: getStrapiMedia(item.image?.url),
      })) || [],
    meta: data.Metadata && {
      metaTitle: data.Metadata.metaTitle,
      metaDescription: data.Metadata.metaDescription,
      metaKeywords: data.Metadata.metaKeywords,
      canonicalURL: data.Metadata.canonicalURL,
      metaImage: getStrapiMedia(data.Metadata.metaImage?.url),
    },
  };

  return (
    <section className="relative poppins">
      {/* Banner */}
      <PageBanner
        title={page.banner.title || ""}
        image={page.banner.image || "/optimized/fallback-image.jpg"}
        category={page.banner.heading || ""}
        priority
      />

      {/* Content */}
      <div className="w-auto bg-[#d2ab67] mx-auto px-6 py-12 space-y-24">
        {/* Intro */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl playfair text-white font-extrabold animate-slideUp">
            {page.title}
          </h1>
          <div className="text-lg md:text-xl text-white prose prose-lg max-w-full text-justify">
            <ContentRenderer content={page.description} />
          </div>
        </div>

        {/* Sections */}
        {page.sections.map((section, idx) => {
          const isEven = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 poppins ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300"
                style={{ minHeight: "320px" }}
              >
                <div className="space-y-3 text-gray-700 prose prose-lg max-w-full text-justify">
                  <ContentRenderer content={section.description} />
                </div>
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
