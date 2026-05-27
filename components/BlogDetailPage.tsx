"use client";

import PageBanner from "@/components/PageBanner";
import { notFound } from "next/navigation";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";
import ContentRenderer from "@/components/ContentRenderer";

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

export default async function BlogDetailPage({
  slug,
}: {
  country: string;
  slug: string;
}) {

  const blog = await getBlogData(slug);

  const blogs = await getAllBlogs();

  if (!blog) return notFound();

  const index = blogs.findIndex((b: any) => b.slug === slug);

  const prevBlog = blogs[index + 1] || null;

  const nextBlog = blogs[index - 1] || null;

  const banner = blog.pagebanner;

  return (
    <section className="relative poppins blog-details">

      <PageBanner
        title={banner?.title || blog.title}
        image={
          banner?.image?.url
            ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${banner.image.url}`
            : "/optimized/fallback-image.jpg"
        }
        category="Blog"
      />

      <div className="w-auto bg-[#d2ab67] mx-auto px-6 py-12 space-y-24 blog-details-section">

        <div className="container bg-white mx-auto px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-10">

          {/* LEFT */}
          <div className="lg:col-span-8">

            <h1 className="text-4xl mb-4 playfair text-gradient font-extrabold">

              {blog.title}

            </h1>

            <hr className="mb-4" />

            <div className="prose prose-lg max-w-full text-justify">

              <ContentRenderer content={blog.content} />

            </div>

          </div>

          {/* RIGHT */}
          <div className="lg:col-span-4">

            <h2 className="text-3xl mb-4 playfair text-gradient font-extrabold">

              Latest Blogs

            </h2>

            <hr className="mb-4 border-gray-300" />

            <div className="flex flex-col gap-2">

              {blogs.slice(0, 6).map((post: any) => {

                const imgUrl = getStrapiMedia(
                  post.pagebanner?.image?.url
                );

                return (

                  <a
                    key={post.documentId}
                    href={`/${post.country?.Slug}/${post.slug}.html`}
                    className="flex items-center gap-3 p-3 border border-gray-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 bg-white"
                  >

                    <div className="w-16 h-16 flex-shrink-0 overflow-hidden shadow-sm">

                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={64}
                        height={64}
                        className="object-cover w-full h-full"
                      />

                    </div>

                    <div className="flex-1">

                      <h3 className="text-gray-900 playfair font-semibold text-base line-clamp-2">

                        {post.title}

                      </h3>

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