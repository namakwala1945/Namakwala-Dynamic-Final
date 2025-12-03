import CatalogueClient from "./CatalogueClient";
import PageBanner from "@/components/PageBanner";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

// ------------------------------
// ✅ Fetch Catalogue Data
// ------------------------------
async function getCatalogueData() {
  const res = await fetch(
    `${strapiUrl}/api/catalogue?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[PageSchema][populate]=*&populate[catalogue][populate]=*`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch catalogue data");
  }

  const json = await res.json();

  const data = json?.data;

  if (!data) throw new Error("No catalogue data found");

  const metadata = data.Metadata || {};

  const meta = {
    title: metadata.title || "",
    description:
      metadata.description?.[0]?.children?.[0]?.text ||
      "Explore our complete product catalogue.",
    keywords: metadata.keywords || "",
    openGraph: {
      title: metadata.openGraph?.title || "",
      description:
        metadata.openGraph?.description?.[0]?.children?.[0]?.text || "",
      url: metadata.openGraph?.url || "",
      siteName: metadata.openGraph?.siteName || "",
    },
    twitter: {
      card: metadata.twitter?.card || "summary_large_image",
      title: metadata.twitter?.title || "",
      description:
        metadata.twitter?.description?.[0]?.children?.[0]?.text || "",
    },
  };

  const pagebanner = data.pagebanner || {};
  const bannerImageUrl =
    pagebanner?.image?.url
      ? `${strapiUrl}${pagebanner.image.url}`
      : "/optimized/fallback-image.jpg";

  const catalogueList = data.catalogue || [];
  const items = catalogueList.map((item: any) => {
    const fileUrl =
      item?.catalogue?.url
        ? `${strapiUrl}${item.catalogue.url}`
        : item?.catalogue?.data?.attributes?.url
        ? `${strapiUrl}${item.catalogue.data.attributes.url}`
        : null;
    return {
      id: item.id,
      title: item.title || "Untitled Catalogue",
      description: item.description?.[0]?.children?.[0]?.text || "",
      file: fileUrl,
    };
  });

  return {
    banner: {
      title: pagebanner.title || "",
      heading: pagebanner.heading || "",
      image: bannerImageUrl,
    },
    title: data.title || "Catalogue",
    description:
      data.description?.[0]?.children?.[0]?.text ||
      "Download our complete product catalogue or browse individual ones below.",
    items,
    metadata: meta,
    ogImage: bannerImageUrl,
    schema: data.PageSchema || null,
  };
}


// -------------------------------------
// ⭐ METADATA GENERATOR (Your block)
// -------------------------------------
export async function generateMetadata({ params }: any) {
  const data = await getCatalogueData();

  if (!data || !data.metadata) {
    return {
      title: data?.title || "Catalogue - Namakwala",
      description:
        data?.description || "Download our complete product catalogue.",
    };
  }

  const meta = data.metadata;

  return {
    title: meta?.title || "Catalogue - Namakwala",
    description: meta?.description || "Download our complete product catalogue.",
    keywords: meta?.keywords || [],
    openGraph: {
      title: meta?.openGraph?.title || "Catalogue - Namakwala",
      description:
        meta?.openGraph?.description ||
        "Download our complete product catalogue.",
      url: meta?.openGraph?.url || undefined,
      siteName: meta?.openGraph?.siteName || undefined,
      images: [data.ogImage || "/optimized/fallback-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.twitter?.title || "Catalogue - Namakwala",
      description:
        meta?.twitter?.description ||
        "Download our complete product catalogue.",
      images: [data.ogImage || "/optimized/fallback-image.jpg"],
    },

    // ⭐ Your required part:
    additionalMetaTags: data.schema
      ? [{ name: "ld+json", content: JSON.stringify(data.schema) }]
      : [],
  };
}

// ------------------------------
// ✅ Page Component
// ------------------------------
export default async function CataloguePage() {
  const page = await getCatalogueData();

  return (
    <section className="relative poppins">
      <PageBanner
        title={page.banner.title}
        category={page.banner.heading}
        image={page.banner.image}
      />

      <CatalogueClient page={page} />
    </section>
  );
}
