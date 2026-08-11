export function getStrapiMedia(url?: string | null): string {
  if (!url || typeof url !== "string")
    return "/optimized/placeholder-large.webp";

  if (url.startsWith("http")) return url;

  return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
}
