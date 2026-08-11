import { MetadataRoute } from "next";

const SITE_URL = "https://www.namakwala.com";
const STRAPI = process.env.NEXT_PUBLIC_STRAPI_URL!;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];

  try {
    // ==========================
    // HOME PAGE
    // ==========================

    urls.push({
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    });

    // ==========================
    // COUNTRY PAGES
    // ==========================

    const countryRes = await fetch(
      `${STRAPI}/api/countries?pagination[pageSize]=5000`,
      {
        cache: "no-store",
      }
    );

    const countryJson = await countryRes.json();

    const countries = countryJson?.data || [];

    countries.forEach((country: any) => {
      if (!country?.Slug) return;

      urls.push({
        url: `${SITE_URL}/${country.Slug}`,
        lastModified: new Date(
          country.updatedAt || country.publishedAt || Date.now()
        ),
        changeFrequency: "weekly",
        priority: 0.9,
      });
    });

    // ==========================
    // BLOG PAGES
    // ==========================

    const blogRes = await fetch(
      `${STRAPI}/api/blogs?populate[country][populate]=*&pagination[pageSize]=5000`,
      {
        cache: "no-store",
      }
    );

    const blogJson = await blogRes.json();

    const blogs = blogJson?.data || [];

    blogs.forEach((blog: any) => {
      const countrySlug = blog?.country?.Slug;
      const blogSlug = blog?.slug;

      if (!countrySlug || !blogSlug) return;

      urls.push({
        url: `${SITE_URL}/${countrySlug}/${blogSlug}.html`,
        lastModified: new Date(
          blog.updatedAt ||
            blog.publishedAt ||
            blog.PublishedDate ||
            Date.now()
        ),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    });

    // ==========================
    // PRODUCT / CATEGORY PAGES
    // app/[slug] also serves pages collection
    // ==========================

    const pageRes = await fetch(
      `${STRAPI}/api/pages?pagination[pageSize]=5000`,
      {
        cache: "no-store",
      }
    );

    if (pageRes.ok) {
      const pageJson = await pageRes.json();

      const pages = pageJson?.data || [];

      pages.forEach((page: any) => {
        if (!page?.slug) return;

        urls.push({
          url: `${SITE_URL}/${page.slug}`,
          lastModified: new Date(
            page.updatedAt || page.publishedAt || Date.now()
          ),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      });
    }
  } catch (error) {
    console.error("Sitemap Generation Error:", error);
  }

  return urls;
}