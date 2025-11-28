import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Metadata as NextMetadata } from "next";
import { getStrapiMedia } from "@/lib/media";

// ------------------------------------
// Types
// ------------------------------------
interface Section {
  title: string;
  description: string[];
  image?: string | null;
}

interface PageData {
  title: string;
  description: string;
  banner: {
    title?: string;
    heading?: string;
    image?: string | null;
  };
  sections: Section[];
  meta?: {
    metaTitle?: string;
    metaDescription?: string;
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
// Metadata
// ------------------------------------
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getPrivacyPolicyData();
  if (!data) return {};

  const meta = data.Metadata || {};

  const metaImage = meta.metaImage?.url
    ? getStrapiMedia(meta.metaImage.url)
    : "/default-og-image.jpg";

  return {
    title: meta.metaTitle || "Privacy Policy | Namakwala",
    description: meta.metaDescription || "Learn about our privacy practices at Namakwala.",
    keywords: meta.metaKeywords,
    alternates: {
      canonical: meta.canonicalURL || "https://www.namakwala.in/privacy-policy",
    },
    openGraph: {
      title: meta.metaTitle || data.title,
      description: meta.metaDescription,
      url: meta.canonicalURL || "https://www.namakwala.in/privacy-policy",
      images: [metaImage],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: meta.metaTitle || data.title,
      description: meta.metaDescription,
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

  // -------------------------------
  // Convert Strapi → Frontend shape
  // -------------------------------
  const page: PageData = {
    title: data.title,
    description: data.description?.[0]?.children?.[0]?.text || "",

    banner: {
      title: data.pagebanner?.title,
      heading: data.pagebanner?.heading,
      image: getStrapiMedia(data.pagebanner?.image?.url),
    },

    sections:
      data.CommonSection?.map((item: any) => ({
        title: item.title,
        description: (item.description || [])
          .map((d: any) =>
            d.children?.map((c: any) => c.text).join(" ")
          )
          .filter(Boolean),
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

  // ------------------------------------
  // Page Render
  // ------------------------------------
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
          <p className="text-lg md:text-xl text-white">{page.description}</p>
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
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 playfair text-gradient">
                  {section.title}
                </h2>
                <div className="space-y-3 text-gray-700">
                  {section.description.map((text, i) => (
                    <p key={i} className="leading-relaxed">
                      {text}
                    </p>
                  ))}
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
