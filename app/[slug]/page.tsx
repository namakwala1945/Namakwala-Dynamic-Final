import { notFound } from "next/navigation";

import CountryPage from "@/components/CountryPage";
import ProductPage from "@/components/ProductPage";

// -------------------------------------
// CHECK PAGE TYPE
// -------------------------------------
async function checkPageType(slug: string) {
  const strapi = process.env.NEXT_PUBLIC_STRAPI_URL;

  try {
    // CHECK COUNTRY
    const countryRes = await fetch(
      `${strapi}/api/countries?filters[Slug][$eq]=${slug}`,
      {
        cache: "no-store",
      }
    );

    const countryData = await countryRes.json();

    if (countryData?.data?.length > 0) {
      return "country";
    }

    // CHECK PRODUCT CATEGORY PAGE
    const productRes = await fetch(
      `${strapi}/api/pages?filters[slug][$eq]=${slug}`,
      {
        cache: "no-store",
      }
    );

    const productData = await productRes.json();

    if (productData?.data?.length > 0) {
      return "product";
    }

    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

// -------------------------------------
// DYNAMIC PAGE
// -------------------------------------
export default async function DynamicPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {

  // IMPORTANT
  const { slug } = await params;

  const type = await checkPageType(slug);

  // COUNTRY PAGE
  if (type === "country") {
    return (
      <CountryPage
        params={{
          country: slug,
        }}
      />
    );
  }

  // PRODUCT PAGE
  if (type === "product") {
    return (
      <ProductPage
        params={{
          slug: slug,
        }}
      />
    );
  }

  return notFound();
}