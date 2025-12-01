// app/blog/[slug]/page.tsx
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";
import { BlocksRenderer } from "@strapi/blocks-react-renderer";
import BlogContentRenderer from "../BlogContentRenderer";

// ----------------------
// Fetch Blog by Slug
// ----------------------
async function getBlogData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate[Metadata][populate]=*&populate[PageSchema][populate]=*&populate[pagebanner][populate]=*`,
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
// Fetch all blogs
// ----------------------
async function getAllBlogs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate[pagebanner][populate]=*`,
      { next: { revalidate: 60 } }
    );
    const { data } = await res.json();

    return data.sort(
      (a: any, b: any) =>
        new Date(b.PublishedDate).getTime() - new Date(a.PublishedDate).getTime()
    );
  } catch (e) {
    console.log(e);
    return [];
  }
}

// ----------------------
// Static Params
// ----------------------
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs`, {
      next: { revalidate: 60 },
    });
    const { data } = await res.json();
    return data.map((post: any) => ({ slug: post.slug }));
  } catch (error) {
    console.error("Error generating params:", error);
    return [];
  }
}

// ----------------------
// Metadata with JSON-LD
// ----------------------
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = await getBlogData(slug);
  if (!blog) return {};

  const meta = blog.Metadata || {};
  const schema = blog?.PageSchema
    ? {
        "@context": "http://schema.org/",
        "@type": "Product",
        name: blog.PageSchema.Name || blog.title,
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: blog.PageSchema.RatingValue ?? 0,
          ratingCount: blog.PageSchema.RatingCount ?? 0,
          reviewCount: blog.PageSchema.ReviewCount ?? 0,
        },
      }
    : null;

  return {
    title: meta.title || blog.title,
    description:
      (meta.description && meta.description[0]?.children?.[0]?.text) || "",
    openGraph: {
      title: meta.openGraph?.title || blog.title,
      description:
        (meta.openGraph?.description &&
          meta.openGraph?.description[0]?.children?.[0]?.text) ||
        "",
      url: `${process.env.NEXT_PUBLIC_STRAPI_URL}/blog/${blog.slug}`,
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
          meta.twitter?.description[0]?.children?.[0]?.text) ||
        "",
    },
    // Inject JSON-LD in <head>
    // This is valid for Next.js 14+ using metadata
    // Google can read this for rich results
    additionalMetaTags: schema
      ? [
          {
            name: "ld+json",
            content: JSON.stringify(schema),
          },
        ]
      : [],
  };
}

// ----------------------
// Blog Detail Page
// ----------------------
export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const blog = await getBlogData(slug);
  const blogs = await getAllBlogs();
  if (!blog) return notFound();

  const index = blogs.findIndex((b: any) => b.slug === slug);
  const prevBlog = blogs[index + 1] || null;
  const nextBlog = blogs[index - 1] || null;
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

      <div className="w-auto bg-[#d2ab67] mx-auto px-6 py-12 space-y-24">
        <div className="container bg-white mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SIDE */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl mb-4 playfair text-gradient font-extrabold">{blog.title}</h1>
            <hr className="mb-4" />
            <div className="prose prose-lg max-w-full text-justify">
              <BlogContentRenderer content={blog.content} />
            </div>
            <div className="mt-4 text-gray-600 text-sm text-right">
              By <span className="text-gradient font-extrabold">{blog.AuthorName}</span> •{" "}
              {new Date(blog.PublishedDate).toLocaleDateString()}
            </div>

            {/* NEXT / PREVIOUS */}
            <div className="flex justify-between mt-6 border-t pt-6 text-sm">
              {prevBlog ? (
                <a
                  href={`/${prevBlog.slug}.html`}
                  className="text-gray-600 hover:text-gradient hover:underline hover:font-extrabold"
                >
                  ← {prevBlog.title}
                </a>
              ) : (
                <span />
              )}

              {nextBlog ? (
                <a
                  href={`/${nextBlog.slug}.html`}
                  className="text-gray-600 hover:text-gradient hover:underline hover:font-extrabold"
                >
                  {nextBlog.title} →
                </a>
              ) : (
                <span />
              )}
            </div>
          </div>

          {/* RIGHT SIDE – Latest Blogs */}
          <div className="lg:col-span-4">
            <h2 className="text-3xl mb-4 playfair text-gradient font-extrabold">Latest Blogs</h2>
            <hr className="mb-4 border-gray-300" />
            <div className="flex flex-col gap-2">
              {blogs.slice(0, 6).map((post: any) => {
                const imgUrl = getStrapiMedia(
                  post.pagebanner?.image?.url ||
                    post.pagebanner?.data?.attributes?.image?.data?.attributes?.url ||
                    post.pagebanner?.data?.attributes?.url
                );
                return (
                  <a
                    key={post.documentId}
                    href={`/${post.slug}.html`}
                    className="flex items-center gap-3 p-3 border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-white"
                  >
                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden shadow-sm">
                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full transform transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-gray-900 playfair font-semibold text-base hover:text-orange-500 transition-colors duration-300 line-clamp-2">
                        {post.title}
                      </h3>
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{post.Excerpt || post.short_description || ""}</p>
                      <p className="text-gray-500 text-xs mt-0.5">{new Date(post.PublishedDate).toLocaleDateString()}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
