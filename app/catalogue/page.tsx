import CatalogueClient from "./CatalogueClient";
import PageBanner from "@/components/PageBanner";
import PageSchemaScript from "@/components/PageSchemaScript"; // ✅ Import schema component

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

// ------------------------------
// ✅ Fetch Catalogue Data
// ------------------------------
async function getCatalogueData() {
  const res = await fetch(
    `${strapiUrl}/api/catalogue?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[catalogue][populate]=*`,
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

  // ✅ Extract schema safely
  const schema = data.PageSchema
    ? {
        Name: data.PageSchema.Name || data.title || "Catalogue",
        RatingValue: data.PageSchema.RatingValue ?? 0,
        RatingCount: data.PageSchema.RatingCount ?? 0,
        ReviewCount: data.PageSchema.ReviewCount ?? 0,
      }
    : {
        Name: data.title || "Catalogue",
        RatingValue: 0,
        RatingCount: 0,
        ReviewCount: 0,
      };

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
    schema, // ✅ add schema here
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
      {/* ✅ Page Schema Script */}
      <PageSchemaScript schema={page.schema} />

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
