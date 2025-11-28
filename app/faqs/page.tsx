// app/faqs/page.tsx
import PageBanner from "@/components/PageBanner";
import { Metadata as NextMetadata } from "next";
import { notFound } from "next/navigation";
import { FiChevronDown } from "react-icons/fi";

// ----------------------
// Fetch Function
// ----------------------
async function getFaqData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/faq?populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*&populate[faqs][populate]=*`,
      { next: { revalidate: 60 } } // ISR caching
    );

    if (!res.ok) throw new Error("Failed to fetch FAQ page data");
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching FAQ Page:", error);
    return null;
  }
}

// ----------------------
// Generate Metadata
// ----------------------
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getFaqData();
  if (!data) return {};

  const meta = data.Metadata || {};

  return {
    title: meta.metaTitle || "FAQs | Namakwala",
    description:
      meta.metaDescription ||
      "Frequently asked questions about our salt and minerals services.",
    keywords: meta.metaKeywords,
    alternates: {
      canonical: meta.canonicalURL || "https://www.namakwala.in/faqs",
    },
    openGraph: {
      title: meta.metaTitle || data.title,
      description: meta.metaDescription,
      url: meta.canonicalURL || "https://www.namakwala.in/faqs",
      images: meta.metaImage?.url
        ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${meta.metaImage.url}`]
        : ["/default-og-image.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: meta.metaTitle || data.title,
      description: meta.metaDescription,
      images: meta.metaImage?.url
        ? [`${process.env.NEXT_PUBLIC_STRAPI_URL}${meta.metaImage.url}`]
        : ["/default-og-image.jpg"],
    },
  };
}

// ----------------------
// Utility: Parse Rich Text Answer
// ----------------------
function parseAnswer(answer: any): string {
  if (!answer) return "";
  if (typeof answer === "string") return answer;

  // If answer is array (Strapi Rich Text)
  if (Array.isArray(answer)) {
    return answer
      .map((block: any) =>
        block.children
          ?.map((child: any) => child.text)
          .join(" ")
          .trim()
      )
      .join("\n");
  }

  return "";
}

// ----------------------
// Component
// ----------------------
export default async function FaqPage() {
  const data = await getFaqData();
  if (!data) return notFound();

  const banner = data.pagebanner;
  const faqs = data.faqs || [];

  return (
    <section className="relative poppins">
      {/* ✅ Page Banner */}
      <PageBanner
        title={banner?.title || "FAQs"}
        image={
          banner?.image?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image.url}`
            : "/optimized/fallback-image.jpg"
        }
        category={banner?.heading || ""}
        priority
      />

      {/* ✅ FAQ Section */}
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-6">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 playfair">
          {data.title || "Frequently Asked Questions"}
        </h1>

        <div className="space-y-4">
          {faqs.length > 0 ? (
            faqs.map((faq: any, idx: number) => {
              const answerText = parseAnswer(faq.answer);
              return (
                <details
                  key={idx}
                  className="group border border-gray-200 bg-white shadow-sm"
                >
                  <summary className="cursor-pointer p-4 flex justify-between items-center text-lg font-medium hover:bg-gray-50">
                    <span>{faq.question}</span>
                    <FiChevronDown className="group-open:rotate-180 transition-transform duration-300" />
                  </summary>
                  <div className="p-4 text-gray-700 border-t bg-gray-50 whitespace-pre-line">
                    {answerText}
                  </div>
                </details>
              );
            })
          ) : (
            <p className="text-center text-gray-600">No FAQs found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
