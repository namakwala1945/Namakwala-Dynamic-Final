import PageBanner from "@/components/PageBanner";
import NewsMediaTabs from "@/components/NewsMediaTabs";
import PageSchemaScript from "@/components/PageSchemaScript"; // ✅ Added
import Script from "next/script";
import { Metadata as NextMetadata } from "next";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

/* -------------------------------------------------------------------------- */
/* ✅ Force Dynamic Rendering                                                   */
/* -------------------------------------------------------------------------- */
export const dynamic = "force-dynamic";

/* -------------------------------------------------------------------------- */
/* ✅ Fetch Data from Strapi                                                   */
/* -------------------------------------------------------------------------- */
async function getPageData() {
  try {
    const res = await fetch(
      `${strapiUrl}/api/news-and-media?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[TypeOfMedia][populate][Media][populate]=*`,
      { cache: "no-store" }
    );

    if (!res.ok) throw new Error("Failed to fetch data");
    const json = await res.json();
    const raw = json?.data;
    if (!raw) return null;

    const description =
      raw?.description
        ?.map((block: any) =>
          block.children?.map((child: any) => child.text).join(" ")
        )
        .join(" ") || "";

    const banner = {
      title: raw?.pagebanner?.title || "News & Media",
      heading: raw?.pagebanner?.heading || "",
      image: raw?.pagebanner?.image?.url
        ? `${strapiUrl}${raw.pagebanner.image.url}`
        : "/optimized/fallback-image.jpg",
    };

    const meta = raw?.Metadata || null;

    const mediaTypes =
      raw?.TypeOfMedia?.map((type: any) => ({
        id: type.id,
        title: type.title || "Untitled",
        Media:
          type.Media?.map((m: any) => ({
            title: m.title || "Untitled",
            url: m.URL || null,
            media:
              m.media?.map((img: any) => ({
                url: img?.url ? `${strapiUrl}${img.url}` : "/fallback-image.jpg",
                alternativeText: img?.alternativeText || img?.name,
              })) || [],
          })) || [],
      })) || [];

    const pageSchema = raw?.PageSchema
      ? {
          Name: raw.PageSchema.Name || "News & Media",
          RatingValue: raw.PageSchema.RatingValue ?? 0,
          RatingCount: raw.PageSchema.RatingCount ?? 0,
          ReviewCount: raw.PageSchema.ReviewCount ?? 0,
        }
      : {
          Name: "News & Media",
          RatingValue: 0,
          RatingCount: 0,
          ReviewCount: 0,
        };

    return { title: raw?.title, description, banner, meta, mediaTypes, pageSchema };
  } catch (err) {
    console.error("❌ Error fetching News & Media:", err);
    return null;
  }
}

/* -------------------------------------------------------------------------- */
/* ✅ Metadata Generator                                                       */
/* -------------------------------------------------------------------------- */
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getPageData();
  const meta = data?.meta;

  if (!meta)
    return {
      title: "News & Media | Namakwala",
      description:
        "Explore videos, image galleries, and media updates from Namakwala Group.",
    };

  return {
    title: meta.title || "News & Media | Namakwala",
    description:
      meta.description
        ?.map((block: any) =>
          block.children?.map((child: any) => child.text).join(" ")
        )
        .join(" ") || "",
  };
}

/* -------------------------------------------------------------------------- */
/* ✅ UI Component                                                             */
/* -------------------------------------------------------------------------- */
export default async function NewsMediaPage() {
  const data = await getPageData();
  if (!data) return <p>Failed to load content.</p>;

  return (
    <section className="relative bg-[#fdf2df] poppins">
      {/* ✅ Page Schema */}
      <PageSchemaScript schema={data.pageSchema} />

      <div className="relative h-96 w-full overflow-hidden">
        <PageBanner
          title={data.banner?.title}
          category={data.banner?.heading}
          image={data.banner?.image}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
      </div>

      <div className="container mx-auto px-6 pb-16 space-y-12">
        <div className="bg-white shadow-lg p-6 md:p-10">
          <h2 className="text-4xl md:text-5xl playfair font-extrabold text-gradient mb-6 text-center">
            {data.title}
          </h2>
          <p className="text-center text-gray-700 mb-8">{data.description}</p>

          {/* ✅ Dynamic Tabs */}
          <NewsMediaTabs mediaTypes={data.mediaTypes} />
        </div>
      </div>
    </section>
  );
}
