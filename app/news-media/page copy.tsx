import PageBanner from "@/components/PageBanner";
import NewsMediaTabs from "@/components/NewsMediaTabs";
import Script from "next/script";

const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL || `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

// ----------------------
// ✅ Fetch Banner Data (fixed to match your JSON)
// ----------------------
async function getPageBanner() {
  try {
    const res = await fetch(
      `${strapiUrl}/api/pages?filters[slug][$eq]=news-media&populate=*`,
      { cache: "no-store" }
    );
    const json = await res.json();

    // ✅ In your JSON, the data is not nested under `attributes`
    const pageData = json?.data?.[0];
    if (!pageData) throw new Error("No page data found for news-media");

    const bannerImage = pageData?.bannerImage;
    const imageUrl =
      bannerImage?.url ||
      bannerImage?.formats?.large?.url ||
      bannerImage?.formats?.medium?.url ||
      bannerImage?.formats?.small?.url ||
      "";

    return {
      title: pageData?.bannerTitle || pageData?.title || "",
      heading: pageData?.bannerHeading || "",
      image: imageUrl ? `${strapiUrl}${imageUrl}` : "/optimized/fallback-image.jpg",
    };
  } catch (err) {
    console.error("❌ Error fetching banner:", err);
    return {
      title: "News & Media",
      heading: "",
      image: "/optimized/fallback-image.jpg",
    };
  }
}

// ----------------------
// ✅ Fetch News Media Data
// ----------------------
async function getPageData() {
  try {
    const res = await fetch(`${strapiUrl}/api/news-medias?populate=*`, {
      cache: "no-store",
    });
    const json = await res.json();
    const raw = json?.data?.[0];

    if (!raw) {
      return { title: "", description: "", videos: [], images: [] };
    }

    // ✅ Videos
    const videos =
      raw?.Videos?.map((v: any) => ({
        title: v.title || "Untitled Video",
        url: v.videoUrl
          ? v.videoUrl
          : v.videoFile?.data?.attributes?.url
          ? `${strapiUrl}${v.videoFile.data.attributes.url}`
          : "",
      })) || [];

    // ✅ Images
    const images =
      raw?.image?.map((i: any) => ({
        title: i.name || "Untitled Image",
        src: i.url ? `${strapiUrl}${i.url}` : "/fallback-image.jpg",
      })) || [];

    const description =
      raw?.description?.[0]?.children?.map((c: any) => c.text).join(" ") || "";

    return {
      title: raw?.title || "",
      description,
      videos,
      images,
    };
  } catch (err) {
    console.error("❌ Error fetching News Media:", err);
    return {
      title: "",
      description: "",
      videos: [],
      images: [],
    };
  }
}

// ----------------------
// ✅ Server Component
// ----------------------
export default async function NewsMediaPage() {
  const banner = await getPageBanner();
  const page = await getPageData();

  return (
    <section className="relative bg-[#fdf2df] poppins">
      {/* ✅ SEO Schema */}
      <Script type="application/ld+json" id="newsmedia-schema">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: page.title,
          description: page.description,
        })}
      </Script>

      {/* ✅ Banner Section */}
      <div className="relative h-96 w-full overflow-hidden">
        <PageBanner
          title={banner.title}
          category={banner.heading}
          image={banner.image}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-transparent"></div>
      </div>

      {/* ✅ Page Content */}
      <div className="container mx-auto px-6 pb-16 space-y-12">
        <div className="bg-white shadow-lg p-6 md:p-10">
          <h2 className="text-4xl md:text-5xl playfair font-extrabold text-gradient mb-6 text-center">
            {page.title}
          </h2>
          <p className="text-center text-gray-700 mb-8">{page.description}</p>

          {/* ✅ Pass Images + Videos to Tabs */}
          <NewsMediaTabs videos={page.videos} images={page.images} />
        </div>
      </div>
    </section>
  );
}
