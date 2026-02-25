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
      { next: { revalidate: 60 } },
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
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[country][populate]=*`,
      { next: { revalidate: 60 } },
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
      description: meta.openGraph?.description?.[0]?.children?.[0]?.text || "",
      url: meta.openGraph?.url || "https://www.namakwala.in/blog",
      siteName: meta.openGraph?.siteName || "Namakwala",
      images: [getStrapiMedia(meta.metaImage?.url) || "/default-og-image.jpg"],
    },
    twitter: {
      card: meta.twitter?.card || "summary_large_image",
      title: meta.twitter?.title,
      description: meta.twitter?.description?.[0]?.children?.[0]?.text || "",
    },
  };
}

// Blog Listing Component
export default async function BlogPage() {
  const blogPage = await getBlogPageData();
  const blogs = await getBlogsData();

  if (!blogPage) return notFound();

  // ⭐ Sort newest → oldest
  blogs.sort((a: any, b: any) => {
    const dateA = new Date(a?.PublishedDate ?? "").getTime();
    const dateB = new Date(b?.PublishedDate ?? "").getTime();
    return dateB - dateA; // newest first
  });

  const banner = blogPage.pagebanner;

  return (
    <section className="relative poppins bg-[#efefef]">
      <PageBanner
        title={banner?.title || "Blog"}
        image={
          getStrapiMedia(banner?.image?.url) || "/optimized/fallback-image.jpg"
        }
        category={banner?.heading || "Blog"}
      />

      <div className="container mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl playfair font-bold text-center mb-8">
          {blogPage.title || "Our Blog"}
        </h1>

        {/* ⭐ WOW Blog Grid */}
        <div
          className="
          grid 
          sm:grid-cols-2 
          lg:grid-cols-3 
          xl:grid-cols-4 
          gap-10 
          mt-8
        "
        >
          {blogs.length > 0 ? (
            blogs.map((post: any) => {
              const imgUrl = getStrapiMedia(post.pagebanner?.image?.url);
              const countrySlug = post.country?.Slug;
              const blogSlug = post.slug;
              const dynamicHref = countrySlug
                ? `/${countrySlug}/${blogSlug}.html`
                : `/${blogSlug}.html`;
              console.log(countrySlug, blogSlug);
              return (
                <Link key={post.documentId} href={`${dynamicHref}`}>
                  <div
                    className="
                      group cursor-pointer overflow-hidden 
                      bg-white/80 backdrop-blur-xl
                      shadow-lg hover:shadow-2xl 
                      transition-all duration-500 
                      flex flex-col h-full
                      hover:-translate-y-2 hover:scale-[1.02]
                    "
                  >
                    {/* IMAGE */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <div
                        className="
                        absolute inset-0 
                        bg-gradient-to-t from-black/40 via-black/10 to-transparent 
                        opacity-0 group-hover:opacity-100 
                        transition-opacity duration-500
                      "
                      ></div>

                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={800}
                        height={500}
                        className="
                          w-full h-full object-cover 
                          transition-transform duration-[900ms] ease-out
                          group-hover:scale-110 group-hover:rotate-[1deg]
                        "
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h2
                        className="
                          text-[20px] font-bold text-gray-900 leading-tight 
                          group-hover:text-orange-500 
                          transition-colors duration-400
                        "
                      >
                        {post.title}
                      </h2>

                      {/* SINGLE LINE EXCERPT */}
                      <p
                        className="
                          text-gray-700 mt-2 
                          line-clamp-1 
                          group-hover:text-gray-900 
                          transition
                        "
                      >
                        {post.Excerpt}
                      </p>

                      <div className="mt-auto pt-4 flex items-center justify-between text-gray-500 text-sm">
                        <span className="group-hover:text-orange-600 transition">
                          By {post.AuthorName}
                        </span>

                        <span>
                          {new Date(post.PublishedDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center text-gray-600 col-span-full">
              No blogs found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
