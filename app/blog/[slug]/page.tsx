import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import { Metadata as NextMetadata } from "next";

// ----------------------
// ✅ Fetch Blog by Slug
// ----------------------
async function getBlogData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate[Metadata][populate]=*&populate[pagebanner][populate]=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch single blog");
    const { data } = await res.json();
    return data?.[0];
  } catch (error) {
    console.error("Error fetching blog:", error);
    return null;
  }
}

// ----------------------
// ✅ Static Params for SSG
// ----------------------
export async function generateStaticParams() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs`,
      { next: { revalidate: 60 } }
    );
    const { data } = await res.json();
    return data.map((post: any) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error generating params:", error);
    return [];
  }
}

// ----------------------
// ✅ Metadata
// ----------------------
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = await params;       // ⬅ IMPORTANT FIX

  const blog = await getBlogData(slug);
  if (!blog) return {};

  const meta = blog.Metadata || {};

  return {
    title: meta.title || blog.title,
    description:
      (meta.description && meta.description[0]?.children?.[0]?.text) || "",
    openGraph: {
      title: meta.openGraph?.title || blog.title,
      description:
        (meta.openGraph?.description &&
          meta.openGraph?.description[0]?.children?.[0]?.text) || "",
      url: meta.openGraph?.url || `https://www.namakwala.in/blog/${blog.slug}`,
      images: [
        blog.pagebanner?.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${blog.pagebanner.image.url}`
          : "/default-og-image.jpg",
      ],
    },
    twitter: {
      card: meta.twitter?.card || "summary_large_image",
      title: meta.twitter?.title || blog.title,
      description:
        (meta.twitter?.description &&
          meta.twitter?.description[0]?.children?.[0]?.text) || "",
    },
  };
}

// ----------------------
// ✅ Single Blog Component
// ----------------------
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;      // ⬅ FIX HERE

  const blog = await getBlogData(slug);
  if (!blog) return notFound();

  const banner = blog.pagebanner;

  return (
    <section className="relative poppins">
      <PageBanner
        title={banner?.title || blog.title}
        image={
          banner?.image?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image.url}`
            : "/optimized/fallback-image.jpg"
        }
        category="Blog"
      />

      <div className="container mx-auto px-6 py-16 max-w-3xl prose prose-lg">
        <div className="mb-6 text-gray-600 text-sm">
          By <span className="font-semibold">{blog.AuthorName}</span> •{" "}
          {new Date(blog.PublishedDate).toLocaleDateString()}
        </div>

        {blog.content?.map((block: any, i: number) => (
          <p key={i}>{block.children?.[0]?.text}</p>
        ))}
      </div>
    </section>
  );
}







