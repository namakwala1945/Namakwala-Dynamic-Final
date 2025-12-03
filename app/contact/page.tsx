import ContactClient from "./ContactClient";
import type { Metadata } from "next";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ??
  "https://your-strapi-url.com";

// -----------------------------
// FETCH CONTACT DATA
// -----------------------------
async function fetchContactData() {
  const res = await fetch(
    `${STRAPI_URL}/api/contact?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[PageSchema][populate]=*&populate[Address][populate]=*`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch contact data");
  }

  const json = await res.json();
  return json.data;
}

// Helper for rich text array -> plain text
const extractText = (arr: any[]) =>
  arr?.map((block: any) =>
    block.children?.map((c: any) => c.text).join(" ")
  ).join(" ") || "";

// -----------------------------
// ⭐ METADATA GENERATOR (FIXED)
// -----------------------------
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchContactData();
    const meta = data?.Metadata;

    if (!meta) {
      return {
        title: "Contact Us | Namakwala",
        description: "Get in touch with Namakwala for inquiries or support.",
      };
    }

    // ---- Extract main metadata ----
    const title = meta.title || "Contact Us | Namakwala";
    const description = extractText(meta.description) || "Contact Namakwala.";
    const keywords = meta.keywords || "";

    // ---- OpenGraph ----
    const ogTitle = meta.openGraph?.title || title;
    const ogDesc = extractText(meta.openGraph?.description || []);
    const ogUrl = meta.openGraph?.url || "https://www.namakwala.in/contact";
    const ogSite = meta.openGraph?.siteName || "Namakwala Group";

    // ---- Twitter ----
    const twTitle = meta.twitter?.title || title;
    const twDesc = extractText(meta.twitter?.description || []);

    return {
      title,
      description,
      keywords,

      alternates: {
        canonical: ogUrl,
      },

      openGraph: {
        title: ogTitle,
        description: ogDesc,
        url: ogUrl,
        siteName: ogSite,
        images: [
          data.pagebanner?.image?.url
            ? `${STRAPI_URL}${data.pagebanner.image.url}`
            : "/default-og-image.jpg",
        ],
        type: "website",
      },

      twitter: {
        card: "summary_large_image",
        title: twTitle,
        description: twDesc,
        images: [
          data.pagebanner?.image?.url
            ? `${STRAPI_URL}${data.pagebanner.image.url}`
            : "/default-og-image.jpg",
        ],
      }
    };

  } catch (error) {
    console.log("❌ Metadata fetch failed", error);
    return {
      title: "Contact Us | Namakwala",
      description: "Get in touch with Namakwala.",
    };
  }
}

// -----------------------------
// PAGE RENDER WITH JSON-LD
// -----------------------------
export default async function ContactPage() {
  const data = await fetchContactData();
  const schema = data?.PageSchema;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      )}

      <ContactClient pageData={data} />
    </>
  );
}
