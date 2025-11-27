import ContactClient from "./ContactClient";
import PageSchemaScript from "@/components/PageSchemaScript"; // ✅ Add schema
import type { Metadata } from "next";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? "https://your-strapi-url.com";

// ---- Fetch Contact Data ----
async function fetchContactData() {
  const res = await fetch(
    `${STRAPI_URL}/api/contact?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[Address][populate]=*`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch contact data");
  }

  const json = await res.json();
  return json.data;
}

// ---- Page Metadata ----
export async function generateMetadata(): Promise<Metadata> {
  try {
    const data = await fetchContactData();
    const meta = data?.Metadata ?? {};

    return {
      title: meta.metaTitle || "Contact Us | Namakwala",
      description:
        meta.metaDescription ||
        "Get in touch with Namakwala for inquiries or support.",
      keywords: meta.metaKeywords || "contact, namakwala, salt, minerals",
      alternates: {
        canonical: meta.canonicalURL || "https://www.namakwala.in/contact",
      },
      openGraph: {
        title: meta.metaTitle || data.Title,
        description: meta.metaDescription,
        url: meta.canonicalURL || "https://www.namakwala.in/contact",
        images: meta.metaImage?.url
          ? [`${STRAPI_URL}${meta.metaImage.url}`]
          : ["/default-og-image.jpg"],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: meta.metaTitle || data.Title,
        description: meta.metaDescription,
        images: meta.metaImage?.url
          ? [`${STRAPI_URL}${meta.metaImage.url}`]
          : ["/default-og-image.jpg"],
      },
    };
  } catch (error) {
    return {
      title: "Contact Us | Namakwala",
      description: "Get in touch with Namakwala.",
    };
  }
}

// ---- Render Page ----
export default async function ContactPage() {
  const data = await fetchContactData();

  // ✅ Extract schema safely
  const schema = data?.PageSchema
    ? {
        Name: data.PageSchema.Name || "Contact Page",
        RatingValue: data.PageSchema.RatingValue ?? 0,
        RatingCount: data.PageSchema.RatingCount ?? 0,
        ReviewCount: data.PageSchema.ReviewCount ?? 0,
      }
    : {
        Name: "Contact Page",
        RatingValue: 0,
        RatingCount: 0,
        ReviewCount: 0,
      };

  return (
    <>
      <PageSchemaScript schema={schema} />
      <ContactClient pageData={data} />
    </>
  );
}
