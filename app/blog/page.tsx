// app/blog/page.tsx
import Link from "next/link";
import Image from "next/image";
import PageBanner from "@/components/PageBanner";
import { getStrapiMedia } from "@/lib/media";
import { Metadata as NextMetadata } from "next";
import { notFound } from "next/navigation";

// Fetch Blog Page Data
async function getBlogPageData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blog-pages?populate[Metadata][populate]=*&populate[pagebanner][populate]=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch blog page data");
    const { data } = await res.json();
    return data?.[0];
  } catch (error) {
    console.error("Error fetching Blog Page:", error);
    return null;
  }
}

// Fetch All Blogs
async function getBlogsData() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate[Metadata][populate]=*&populate[pagebanner][populate]=*`,
      { next: { revalidate: 60 } }
    );
    if (!res.ok) throw new Error("Failed to fetch blogs");
    const { data } = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    return [];
  }
}

// Metadata
export async function generateMetadata(): Promise<NextMetadata> {
  const data = await getBlogPageData();
  if (!data) return {};

  const meta = data.Metadata || {};

  return {
    title: meta.title || "Blogs | Namakwala",
    description:
      (meta.description && meta.description[0]?.children?.[0]?.text) ||
      "Read our latest blogs on salt and minerals.",
    keywords: meta.keywords,
    openGraph: {
      title: meta.openGraph?.title,
      description:
        meta.openGraph?.description?.[0]?.children?.[0]?.text || "",
      url: meta.openGraph?.url || "https://www.namakwala.in/blog",
      siteName: meta.openGraph?.siteName || "Namakwala",
      images: [
        getStrapiMedia(meta.metaImage?.url) || "/default-og-image.jpg",
      ],
    },
    twitter: {
      card: meta.twitter?.card || "summary_large_image",
      title: meta.twitter?.title,
      description:
        meta.twitter?.description?.[0]?.children?.[0]?.text || "",
    },
  };
}

// Blog Listing Component
export default async function BlogPage() {
  const blogPage = await getBlogPageData();
  const blogs = await getBlogsData();

  if (!blogPage) return notFound();

  const banner = blogPage.pagebanner;

  return (
    <section className="relative poppins">
      <PageBanner
        title={banner?.title || "Blog"}
        image={getStrapiMedia(banner?.image?.url) || "/optimized/fallback-image.jpg"}
        category={banner?.heading || "Blog"}
      />

      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl playfair font-bold text-center mb-8">
          {blogPage.title || "Our Blog"}
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12 mt-8">
          {blogs.length > 0 ? (
            blogs.map((post: any) => {
              const imgUrl = getStrapiMedia(post.pagebanner?.image?.url);
              return (
                // ✅ Link directly to root-level slug
                <Link key={post.documentId} href={`/${post.slug}.html`}>
                  <div className="group cursor-pointer">
                    <div className="relative overflow-hidden rounded-2xl shadow-md">
                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={800}
                        height={500}
                        className="object-cover w-full h-64 transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <div className="mt-4">
                      <h2 className="text-2xl font-semibold text-gray-900 group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-gray-700 mt-2">{post.Excerpt}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        By {post.AuthorName} |{" "}
                        {new Date(post.PublishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-gray-600 col-span-full">No blogs found.</p>
          )}
        </div>
      </div>
    </section>
  );
}
