import PageBanner from "@/components/PageBanner";
import Image from "next/image";
import HashScroll from "@/components/HashScroll";
import { notFound } from "next/navigation";
import { Suspense } from "react";

// ----------------------
// Types
// ----------------------
type KeyFeature = { feature: string; detail: string };
type TechnicalSpecification = { property: string; value: string };

type CategoryPageItem = {
  title: string;
  slug: string;
  description?: string[];
  productImage?: string;
  applications?: string[];
  keyFeatures?: KeyFeature[];
  technicalSpecifications?: TechnicalSpecification[];
  note?: string;

  footerHeading?: string;
  footerParagraph?: string[];
  footerBackground?: string;

  // ⭐ REQUIRED numeric position (not optional)
  position: number;
};

type BannerData = {
  title: string;
  heading: string;
  image: string;
};


// ----------------------
// Fetch API data
// ----------------------
async function fetchCategoryData(category: string): Promise<{
  products: CategoryPageItem[];
  banner: BannerData;
}> {
  
  const strapiUrl =
    process.env.NEXT_PUBLIC_STRAPI_URL ||
    `${process.env.NEXT_PUBLIC_STRAPI_URL}`;

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

    const banner: BannerData = bannerData?.data?.[0]
      ? {
          title: bannerData.data[0].bannerTitle || "",
          heading: bannerData.data[0].bannerHeading || "",
          image: bannerData.data[0].bannerImage?.url
            ? strapiUrl + bannerData.data[0].bannerImage.url
            : "/optimized/placeholder-large.webp",
        }
      : {
          title: "",
          heading: "",
          image: "/optimized/placeholder-large.webp",
        };

    const products: CategoryPageItem[] =
      productsData?.data?.map((item: any) => ({
        title: item.Title,
        slug: item.slug,

        description:
          item.introParagraph?.map(
            (p: any) => p.children?.[0]?.text || ""
          ) || [],

        applications:
          item.applicationsParagraph?.map(
            (p: any) => p.children?.[0]?.text || ""
          ) || [],

        keyFeatures:
          item.KeyFeatures?.map((k: any) => ({
            feature: k.feature,
            detail: k.benefit,
          })) || [],

        technicalSpecifications:
          item.technicalSpecifications?.map((t: any) => ({
            property: t.property,
            value: t.value,
          })) || [],

        note: item.customizationNote || "",

        productImage: item.productImage?.url
          ? strapiUrl + item.productImage.url
          : undefined,

        footerHeading: item.footerHeading || "",
        footerParagraph:
          item.footerParagraph?.map(
            (p: any) => p.children?.[0]?.text || ""
          ) || [],
        footerBackground: item.footerBackground?.url
          ? strapiUrl + item.footerBackground.url
          : undefined,

        // ⭐ Always a number (fix for sorting)
        position: Number(item.position) || 9999,
      })) || [];

    return { products, banner };
  } catch (err) {
    console.error("❌ Fetch error:", err);
    return {
      products: [],
      banner: {
        title: "",
        heading: "",
        image: "/optimized/placeholder-large.webp",
      },
    };
  }
}

// ----------------------
// Category Page Component
// ----------------------
export default async function CategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const category = params.category;

  const { products, banner } = await fetchCategoryData(category);

  if (!products || products.length === 0) return notFound();

  // ⭐ FIX: Sorting with guaranteed numeric values
  const sortedProducts = [...products].sort(
    (a, b) => Number(a.position) - Number(b.position)
  );

  return (
    <section className="relative bg-[#d2ab67] poppins">
      {/* Page Banner */}
      <div className="inset-0 top-0 playfair">
        <PageBanner
          title={banner.title}
          image={banner.image}
          category={banner.heading}
        />
      </div>

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
            {/* Product Header Section */}
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {page.productImage && (
                <div className="flex w-auto justify-center overflow-hidden">
                  <Image
                    src={page.productImage}
                    alt={page.title}
                    width={600}
                    height={400}
                    priority
                    quality={70}
                    sizes="100vw"
                  />
                </div>
              )}

              <div>
                <h2 className="text-4xl playfair font-extrabold text-gradient mb-4">
                  {page.title}
                </h2>

                <div className="text-gray-700 leading-relaxed">
                  {page.description?.map((block, i) => (
                    <div
                      key={i}
                      className="mb-3"
                      dangerouslySetInnerHTML={{ __html: block }}
                    />
                  ))}
                </div>



                {page.applications?.length ? (
                  <div className="mt-4">
                    <h3 className="text-2xl playfair font-extrabold text-gradient mb-2">
                      Applications
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {page.applications.join(" ")}
                    </p>
                  </div>
                ) : null}
              </div>
            </div>

            {/* Key Features + Technical Specs */}
            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Key Features */}
              <div className="bg-[#fdf2df] border border-[#d2ab67] shadow-lg overflow-hidden">
                <div className="px-6 py-2 border-b border-[#d2ab67] text-2xl leading-[1.8]">
                  <h3 className="playfair font-extrabold text-gradient text-center">
                    Key Features & Benefits
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#d2ab67]">
                    <thead className="bg-[#fdf2df]">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                          Feature
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                          Benefits
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-[#fdf2df] divide-y divide-[#d2ab67] capitalize">
                      {page.keyFeatures?.length ? (
                        page.keyFeatures.map((f, idx) => (
                          <tr
                            key={idx}
                            className="transition-colors duration-200 hover:bg-[#d2ab67] hover:text-white"
                          >
                            <td className="px-4 py-2">{f.feature}</td>
                            <td className="px-4 py-2">{f.detail}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-2 text-center text-gray-400 italic"
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
                <div className="px-6 py-2 border-b border-[#d2ab67] text-2xl leading-[1.8]">
                  <h3 className="playfair font-extrabold text-gradient text-center">
                    Technical Specifications
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-[#d2ab67]">
                    <thead className="bg-[#fdf2df]">
                      <tr>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                          Property
                        </th>
                        <th className="px-4 py-2 text-left text-sm font-bold text-gray-600 uppercase tracking-wider">
                          Value
                        </th>
                      </tr>
                    </thead>

                    <tbody className="bg-[#fdf2df] divide-y divide-[#d2ab67] capitalize">
                      {page.technicalSpecifications?.length ? (
                        page.technicalSpecifications.map((spec, idx) => (
                          <tr
                            key={idx}
                            className="transition-colors duration-200 hover:bg-[#d2ab67] hover:text-white"
                          >
                            <td className="px-4 py-2">{spec.property}</td>
                            <td className="px-4 py-2">{spec.value}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={2}
                            className="px-4 py-2 text-center text-gray-400 italic"
                          >
                            No technical specifications available
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {page.note && (
                  <div className="px-6 py-3 bg-[#fdf2df] border-t border-[#d2ab67] text-center">
                    <p className="text-sm italic text-gray-600">{page.note}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            {Array.isArray(page.footerParagraph) &&
            page.footerParagraph.length > 0 ? (
              <div className="relative mt-12 overflow-hidden shadow-lg">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${
                      page.footerBackground ??
                      page.productImage ??
                      "/assets/placeholder.jpg"
                    })`,
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-black/70" />

                <div className="relative z-10 p-10 text-center">
                  <h4 className="text-2xl font-bold mb-4 text-white">
                    {page.footerHeading || `Why choose ${page.title}?`}
                  </h4>

                  {page.footerParagraph.map((para, idx) => (
                    <p
                      key={idx}
                      className="text-white text-lg leading-relaxed mb-2"
                    >
                      {para}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </section>
        ))}
      </div>
    </section>
  );
}
