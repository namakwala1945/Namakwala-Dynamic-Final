import PageBanner from "@/components/PageBanner";
import NewsMediaTabs from "@/components/NewsMediaTabs";
import ContentRenderer from "@/components/ContentRenderer";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// -------------------------------------
// ⭐ DEFAULT FALLBACK CONSTANTS
// -------------------------------------
const FALLBACK = {
  title: "News & Media",
  description: [{ type: "paragraph", children: [{ text: "Content not available." }] }],
  bannerImage: "/optimized/fallback-image.jpg",
  emptyText: "Content not available",
};

// -------------------------------------
// ⭐ FETCH NEWS & MEDIA DATA
// -------------------------------------
async function fetchNewsMediaData() {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    const res = await fetch(
      `${strapiUrl}/api/news-and-media?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[TypeOfMedia][populate][Media][populate]=*`,
      { cache: "no-store" }
    );

    const data = await res.json();
    const raw = data?.data;

    if (!raw) return null;

    const banner = {
      title: raw?.pagebanner?.title || FALLBACK.title,
      heading: raw?.pagebanner?.heading || "",
      image: raw?.pagebanner?.image?.url ? strapiUrl + raw.pagebanner.image.url : FALLBACK.bannerImage,
    };

    const description = raw?.description || FALLBACK.description;
    const meta = raw?.Metadata || null;
    const schemaData = raw?.PageSchema || null;

    const schema = schemaData
      ? {
          "@context": "https://schema.org",
          "@type": "Organization",
          name: schemaData?.Name || FALLBACK.title,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: schemaData?.RatingValue || 5,
            ratingCount: schemaData?.RatingCount || 1,
            reviewCount: schemaData?.ReviewCount || 1,
          },
        }
      : null;

    const ogImage = raw?.pagebanner?.image?.url ? strapiUrl + raw.pagebanner.image.url : FALLBACK.bannerImage;

    const mediaTypes =
      raw?.TypeOfMedia?.map((type: any) => ({
        id: type.id,
        title: type.title || "Untitled",
        Media:
          type.Media?.map((m: any) => ({
            title: m.title || "Untitled",
            url: m.URL || null,
            media: m.media?.map((img: any) => ({
              url: img?.url ? strapiUrl + img.url : "/fallback-image.jpg",
              alternativeText: img?.alternativeText || img?.name,
            })) || [],
          })) || [],
      })) || [];

    return { title: raw?.title || FALLBACK.title, description, banner, meta, schema, ogImage, mediaTypes };
  } catch (err) {
    console.error("❌ Error fetching News & Media:", err);
    return null;
  }
}

// -------------------------------------
// ⭐ METADATA GENERATOR
// -------------------------------------
export async function generateMetadata({ params }: any) {
  const data = await fetchNewsMediaData();

  if (!data || !data.meta) {
    return {
      title: FALLBACK.title,
      description: data?.description?.map((b: any) => b.children?.map((c: any) => c.text).join(" ")).join(" ") || FALLBACK.emptyText,
    };
  }

  const meta = data.meta;

  return {
    title: meta?.title || FALLBACK.title,
    description:
      meta?.description?.map((b: any) => b.children?.map((c: any) => c.text).join(" ")).join(" ") || FALLBACK.emptyText,
    keywords: meta?.keywords || [],
    openGraph: {
      title: meta?.openGraph?.title || FALLBACK.title,
      description:
        meta?.openGraph?.description?.map((b: any) => b.children?.map((c: any) => c.text).join(" ")).join(" ") ||
        FALLBACK.emptyText,
      url: meta?.openGraph?.url || undefined,
      siteName: meta?.openGraph?.siteName || undefined,
      images: [data.ogImage || FALLBACK.bannerImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitter?.title || FALLBACK.title,
      description:
        meta?.twitter?.description?.map((b: any) => b.children?.map((c: any) => c.text).join(" ")).join(" ") ||
        FALLBACK.emptyText,
      images: [data.ogImage || FALLBACK.bannerImage],
    },
    additionalMetaTags: data.schema ? [{ name: "ld+json", content: JSON.stringify(data.schema) }] : [],
  };
}

// -------------------------------------
// ⭐ UI COMPONENT
// -------------------------------------
export default async function NewsMediaPage() {
  const data = await fetchNewsMediaData();
  if (!data) return <p>Failed to load content.</p>;

  return (
    <section className="relative bg-[#fdf2df] poppins">
      <div className="relative h-96 w-full overflow-hidden">
        <PageBanner title={data.banner.title} category={data.banner.heading} image={data.banner.image} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 pb-16 space-y-12">
        <div className="bg-white shadow-lg p-6 md:p-10">
          <h2 className="text-4xl md:text-5xl playfair font-extrabold text-gradient mb-6 text-center">
            {data.title}
          </h2>

          {/* Render rich text description */}
          <div className="text-center text-gray-700 mb-8">
            <ContentRenderer content={data.description} />
          </div>

          {/* Dynamic Tabs */}
          <NewsMediaTabs mediaTypes={data.mediaTypes} />
        </div>
      </div>
    </section>
  );
}
