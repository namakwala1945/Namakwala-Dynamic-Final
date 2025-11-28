import CatalogueClient from "./CatalogueClient";
import PageBanner from "@/components/PageBanner";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

// ------------------------------
// ✅ Fetch Catalogue Data
// ------------------------------
async function getCatalogueData() {
  const res = await fetch(
    `${strapiUrl}/api/catalogue?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[catalogue][populate]=*`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    console.error("❌ Failed to fetch catalogue data:", res.status);
    throw new Error("Failed to fetch catalogue data");
  }

  const json = await res.json();
  const data = json?.data;
  if (!data) throw new Error("No catalogue data found");

  // ✅ Extract metadata safely
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

  // ✅ Extract banner
  const pagebanner = data.pagebanner || {};
  const bannerImageUrl =
    pagebanner?.image?.url
      ? `${strapiUrl}${pagebanner.image.url}`
      : "/optimized/fallback-image.jpg";

  // ✅ Extract catalogue list (PDFs)
  const catalogueList = data.catalogue || [];
  const items = catalogueList.map((item: any) => ({
    id: item.id,
    title: item.title || "Untitled Catalogue",
    description: item.description?.[0]?.children?.[0]?.text || "",
    file:
      item?.catalogue?.url
        ? `${strapiUrl}${item.catalogue.url}`
        : item?.catalogue?.data?.attributes?.url
        ? `${strapiUrl}${item.catalogue.data.attributes.url}`
        : null,
  }));

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
  };
}

// ------------------------------
// ✅ Dynamic Metadata for SEO
// ------------------------------
export async function generateMetadata() {
  try {
    const page = await getCatalogueData();
    const m = page.metadata;

    return {
      title: m.title,
      description: m.description,
      keywords: m.keywords,
      openGraph: {
        title: m.openGraph.title,
        description: m.openGraph.description,
        url: m.openGraph.url,
        siteName: m.openGraph.siteName,
      },
      twitter: {
        card: m.twitter.card,
        title: m.twitter.title,
        description: m.twitter.description,
      },
    };
  } catch (error) {
    console.error("⚠️ Metadata generation failed:", error);
    return {
      title: "Catalogue - Namakwala",
      description:
        "Explore and download Namakwala's complete product catalogue.",
    };
  }
}

// ------------------------------
// ✅ Page Component
// ------------------------------
export default async function CataloguePage() {
  const page = await getCatalogueData();

  return (
    <section className="relative poppins">
      {/* ✅ Page Banner */}
      <div className="inset-0 top-0">
        <PageBanner
          title={page.banner.title}
          category={page.banner.heading}
          image={page.banner.image}
        />
      </div>

      {/* ✅ Catalogue Client Section */}
      <CatalogueClient page={page} />
    </section>
  );
}
