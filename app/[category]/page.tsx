// app/[category]/page.tsx

import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import HashScroll from "@/components/HashScroll";
import ContentRenderer from "@/components/ContentRenderer";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// -------------------------------------
// ⭐ DEFAULT FALLBACK CONSTANTS
// -------------------------------------
const FALLBACK = {
  title: "Product Information",
  description: "Explore high-quality industrial products.",
  keywords: [],
  bannerImage: "/optimized/placeholder-large.webp",
  footerImage: "/assets/placeholder.jpg",
  emptyText: "Information not available",
};

// -------------------------------------
// ⭐ FETCH PAGE BY SLUG
// -------------------------------------
async function fetchPageBySlug(slug: string) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const url = `${base}/api/pages?filters[slug][$eq]=${slug}&populate=*`;

  console.log("Fetching Category Page URL:", url);

  const res = await fetch(url, { cache: "no-store" });
  const data = await res.json();
  const pageData = data?.data?.[0] || null;

  console.log("Category Page Data:", pageData);

  return pageData;
}

// -------------------------------------
// ⭐ DYNAMIC METADATA
// -------------------------------------
export async function generateMetadata({ params }: any) {
  const category = params.category;

  // Fetch page data
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
  const res = await fetch(
    `${strapiUrl}/api/pages?filters[slug][$eq]=${category}&populate=*`,
    { cache: "no-store" }
  );

  const pageData = (await res.json())?.data?.[0] || null;

  console.log("Category Page Data:", pageData);

  if (!pageData) {
    return {
      title: FALLBACK.title,
      description: FALLBACK.description,
      keywords: FALLBACK.keywords,
    };
  }

  // ✅ Access top-level fields
  const meta = pageData.Metadata || {};
  const bannerImage = pageData.bannerImage?.url;

  const safeText = (block: any) =>
    Array.isArray(block) ? block[0]?.children?.[0]?.text || "" : "";

  const ogImage = bannerImage
    ? `${strapiUrl}${bannerImage}`
    : FALLBACK.bannerImage;

  return {
    title: meta?.title || FALLBACK.title,
    description: safeText(meta?.description) || FALLBACK.description,
    keywords: meta?.keywords || FALLBACK.keywords,
    openGraph: {
      title: meta?.title || FALLBACK.title,
      description: safeText(meta?.description) || FALLBACK.description,
      url: `${process.env.NEXT_PUBLIC_SITE_URL}/${category}`,
      siteName: "Namakwala",
      images: [ogImage],
    },
    twitter: {
      card: "summary_large_image",
      title: meta?.title || FALLBACK.title,
      description: safeText(meta?.description) || FALLBACK.description,
      images: [ogImage],
    },
    additionalMetaTags: [], // Add schema later if you have PageSchema
  };
};


// -------------------------------------
// TYPES
// -------------------------------------
type KeyFeature = { feature: string; detail: string };
type TechnicalSpecification = { property: string; value: string };
type CategoryPageItem = {
  title: string;
  slug: string;
  description: any[];
  productImage: string;
  applications: any[];
  keyFeatures: KeyFeature[];
  technicalSpecifications: TechnicalSpecification[];
  note: string;
  footerHeading: string;
  footerParagraph: any[];
  footerBackground: string;
  position: number;
};
type BannerData = {
  title: string;
  heading: string;
  image: string;
};

// -------------------------------------
// FETCH PRODUCT + BANNER DATA
// -------------------------------------
async function fetchCategoryData(category: string): Promise<{
  products: CategoryPageItem[];
  banner: BannerData;
}> {
  const strapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    const productsRes = await fetch(
      `${strapiUrl}/api/products?filters[category][$eq]=${category}&populate=*`,
      { cache: "no-store" }
    );

    const bannerRes = await fetch(
      `${strapiUrl}/api/pages?filters[slug][$eq]=${category}&populate=bannerImage`,
      { cache: "no-store" }
    );

    const productsData = await productsRes.json();
    const bannerData = await bannerRes.json();

    const bannerRaw = bannerData?.data?.[0] || null;

    const banner: BannerData = {
      title: bannerRaw?.bannerTitle || FALLBACK.title,
      heading: bannerRaw?.bannerHeading || "",
      image: bannerRaw?.bannerImage?.url
        ? strapiUrl + bannerRaw.bannerImage.url
        : FALLBACK.bannerImage,
    };

    const products: CategoryPageItem[] =
      productsData?.data?.map((item: any) => ({
        title: item.Title || FALLBACK.title,
        slug: item.slug || "",
        description:
          item.introParagraph || [
            { type: "paragraph", children: [{ text: FALLBACK.emptyText }] },
          ],
        applications: item.applicationsParagraph || [],
        keyFeatures:
          item.KeyFeatures?.map((k: any) => ({
            feature: k.feature || FALLBACK.emptyText,
            detail: k.benefit || FALLBACK.emptyText,
          })) || [],
        technicalSpecifications:
          item.technicalSpecifications?.map((t: any) => ({
            property: t.property || FALLBACK.emptyText,
            value: t.value || FALLBACK.emptyText,
          })) || [],
        note: item.customizationNote || "",
        productImage: item.productImage?.url
          ? strapiUrl + item.productImage.url
          : FALLBACK.bannerImage,
        footerHeading: item.footerHeading || "",
        footerParagraph:
          item.footerParagraph || [
            { type: "paragraph", children: [{ text: FALLBACK.emptyText }] },
          ],
        footerBackground: item.footerBackground?.url
          ? strapiUrl + item.footerBackground.url
          : FALLBACK.footerImage,
        position: Number(item.position) || 9999,
      })) || [];

    return { products, banner };
  } catch (err) {
    console.error("❌ Fetch error:", err);

    return {
      products: [],
      banner: {
        title: FALLBACK.title,
        heading: "",
        image: FALLBACK.bannerImage,
      },
    };
  }
}

// -------------------------------------
// ⭐ CATEGORY PAGE COMPONENT
// -------------------------------------
export default async function CategoryPage({ params }: any) {
  const category = params.category;

  const { products, banner } = await fetchCategoryData(category);

  if (!products || products.length === 0) return notFound();

  const sortedProducts = [...products].sort(
    (a, b) => Number(a.position) - Number(b.position)
  );

  return (
    <section className="relative bg-[#d2ab67] poppins">
      {/* Banner */}
      <PageBanner
        title={banner.title || FALLBACK.title}
        image={banner.image || FALLBACK.bannerImage}
        category={banner.heading || ""}
      />

      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <HashScroll />
      </Suspense>

      <div className="w-auto bg-[#d2ab67] mx-auto px-6 py-12 space-y-24">
        {sortedProducts.map((page, idx) => (
          <section
            id={page.slug}
            key={page.slug}
            className={`scroll-mt-28 ${
              idx % 2 === 0 ? "bg-white" : "bg-gray-50"
            } shadow-md px-6 py-12 lg:px-10`}
          >
            {/* PRODUCT IMAGE + DETAILS */}
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div className="flex w-auto justify-center overflow-hidden">
                <Image
                  src={page.productImage || FALLBACK.bannerImage}
                  alt={page.title}
                  width={600}
                  height={400}
                  priority
                  quality={70}
                />
              </div>

              <div>
                <h2 className="text-4xl playfair font-extrabold text-gradient mb-4">
                  {page.title || FALLBACK.title}
                </h2>

                <div className="text-gray-700 leading-relaxed">
                  <ContentRenderer content={page.description} />
                </div>

                {page.applications?.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-2xl playfair font-extrabold text-gradient mb-2">
                      Applications
                    </h3>
                    <ContentRenderer content={page.applications} />
                  </div>
                )}
              </div>
            </div>

            {/* KEY FEATURES & SPECIFICATIONS */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Features */}
              <div className="bg-[#fdf2df] border border-[#d2ab67] shadow-lg overflow-hidden">
                <div className="px-6 py-2 border-b border-[#d2ab67] text-2xl">
                  <h3 className="playfair font-extrabold text-gradient text-center">
                    Key Features & Benefits
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-[#d2ab67]">
                    <tbody>
                      {page.keyFeatures.length > 0 ? (
                        page.keyFeatures.map((f, idx) => (
                          <tr
                            key={idx}
                            className="border border-[#d2ab67]"
                          >
                            <td className="px-4 py-2 border border-[#d2ab67]">
                              {f.feature || FALLBACK.emptyText}
                            </td>
                            <td className="px-4 py-2 border border-[#d2ab67]">
                              {f.detail || FALLBACK.emptyText}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-4 text-center text-gray-400 italic border border-[#d2ab67]"
                          >
                            No key features available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Technical Specifications */}
              <div className="bg-[#fdf2df] border border-[#d2ab67] shadow-lg overflow-hidden">
                <div className="px-6 py-2 border-b border-[#d2ab67] text-2xl">
                  <h3 className="playfair font-extrabold text-gradient text-center">
                    Technical Specifications
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full border border-[#d2ab67]">
                    <tbody>
                      {page.technicalSpecifications.length > 0 ? (
                        page.technicalSpecifications.map((spec, idx) => (
                          <tr
                            key={idx}
                            className="border border-[#d2ab67]"
                          >
                            <td className="px-4 py-2 border border-[#d2ab67]">
                              {spec.property || FALLBACK.emptyText}
                            </td>
                            <td className="px-4 py-2 border border-[#d2ab67]">
                              {spec.value || FALLBACK.emptyText}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-4 text-center text-gray-400 italic border border-[#d2ab67]"
                          >
                            No technical specifications available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {page.note && (
                  <p className="px-6 py-3 text-sm italic text-gray-600">
                    {page.note}
                  </p>
                )}
              </div>
            </div>

            {/* FOOTER SECTION */}
            {page.footerParagraph.length > 0 && (
              <div className="mt-12 relative overflow-hidden shadow-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      page.footerBackground ||
                      page.productImage ||
                      FALLBACK.footerImage
                    })`,
                  }}
                />

                <div className="absolute inset-0 bg-black/70" />

                <div className="relative z-10 p-10 text-center text-white">
                  <h4 className="text-2xl font-bold mb-4">
                    {page.footerHeading ||
                      `Why choose ${page.title || FALLBACK.title}?`}
                  </h4>

                  <ContentRenderer content={page.footerParagraph} />
                </div>
              </div>
            )}
          </section>
        ))}
      </div>
    </section>
  );
}
