// app/blog/[slug]/page.tsx
import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import { Metadata as NextMetadata } from "next";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";
import PageSchemaScript from "@/components/PageSchemaScript"; // ✅ import schema component

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

// ----------------------------------------------
// Fetch all blogs (for sidebar + next/prev)
// ----------------------------------------------
async function getAllBlogs() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate[pagebanner][populate]=*`,
      { next: { revalidate: 60 } }
    );
    const { data } = await res.json();

    return data.sort(
      (a: any, b: any) =>
        new Date(b.PublishedDate).getTime() -
        new Date(a.PublishedDate).getTime()
    );
  } catch (e) {
    console.log(e);
    return [];
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
      url: meta.openGraph?.url || `${process.env.NEXT_PUBLIC_STRAPI_URL}/blog/${blog.slug}`,
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
  const { slug } = params;

  const blog = await getBlogData(slug);
  const blogs = await getAllBlogs();

  if (!blog) return notFound();

  // -----------------------
  // FIND NEXT + PREVIOUS
  // -----------------------
  const index = blogs.findIndex((b: any) => b.slug === slug);

  const prevBlog = blogs[index + 1] || null;
  const nextBlog = blogs[index - 1] || null;

  const banner = blog.pagebanner;

  // -----------------------
  // ✅ Prepare Schema
  // -----------------------
  const schema = blog?.PageSchema
    ? {
        Name: blog.PageSchema.Name || blog.title,
        RatingValue: blog.PageSchema.RatingValue ?? 0,
        RatingCount: blog.PageSchema.RatingCount ?? 0,
        ReviewCount: blog.PageSchema.ReviewCount ?? 0,
      }
    : {
        Name: blog.title,
        RatingValue: 0,
        RatingCount: 0,
        ReviewCount: 0,
      };

  return (
    <section className="relative poppins">
      {/* ✅ Page Schema Script */}
      <PageSchemaScript schema={schema} />

      <PageBanner
        title={banner?.title || blog.title}
        image={
          banner?.image?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image.url}`
            : "/optimized/fallback-image.jpg"
        }
        category="Blog"
      />

      {/* ---------------------- */}
      {/* MAIN LAYOUT */}
      {/* ---------------------- */}
      <div className="w-auto bg-[#d2ab67] mx-auto px-6 py-12 space-y-24">
        <div className="container bg-white mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* LEFT SIDE – Blog Content */}
          <div className="lg:col-span-8">
            <h1 className="text-4xl mb-4 playfair text-gradient font-extrabold">{blog.title}</h1>
            <hr className="mb-4"></hr>
            {/* BLOG BODY */}
            <div className="prose prose-lg max-w-full text-justify prose-p:text-justify">
              {blog.content?.map((block: any, i: number) => (
                <p key={i}>{block.children?.[0]?.text}</p>
              ))}
            </div>
            <div className="mt-4 text-gray-600 text-sm text-right">
              By <span className="text-gradient font-extrabold">{blog.AuthorName}</span> •{" "}
              {new Date(blog.PublishedDate).toLocaleDateString()}
            </div>
            {/* NEXT / PREVIOUS LINKS */}
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

          {/* RIGHT SIDE – Professional Blog List */}
          <div className="lg:col-span-4">
            <h2 className="text-4xl mb-4 playfair text-gradient font-extrabold">
              Latest Blogs
            </h2>
            <hr className="mb-4"></hr>
            <div className="">
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
                    className="flex gap-4 p-2 hover:shadow-lg transition-all duration-300 bg-white hover:-translate-y-1"
                  >
                    {/* Thumbnail */}
                    <div className="w-20 h-20 min-w-20 overflow-hidden shadow-sm">
                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Text */}
                    <div className="flex-1">
                      <h3 className="text-gray-800 playfair text-gradient font-extrabold hover:text-orange-600 transition">
                        {post.title}
                      </h3>
                      <p className="text-[13px] text-gray-500 mt-1 line-clamp-1 leading-tight">
                        {post.Excerpt || post.short_description || ""}
                      </p>
                      <p className="text-[12px] text-gray-500 mt-1">
                        {new Date(post.PublishedDate).toLocaleDateString()}
                      </p>
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
