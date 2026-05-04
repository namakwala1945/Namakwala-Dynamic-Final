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

// ✅ CORE FIX: Dynamic pagination (NO LIMIT ISSUE EVER)
async function getBlogsData(page = 1, pageSize = 8) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?pagination[page]=${page}&pagination[pageSize]=${pageSize}&sort=PublishedDate:desc&populate[Metadata][populate]=*&populate[pagebanner][populate]=*&populate[country][populate]=*`,
      { next: { revalidate: 60 } },
    );

    if (!res.ok) throw new Error("Failed to fetch blogs");

    const { data, meta } = await res.json();

    return {
      blogs: data || [],
      pagination: meta?.pagination || {
        page: 1,
        pageSize,
        pageCount: 1,
        total: 0,
      },
    };
  } catch (error) {
    console.error("Error fetching Blogs:", error);
    return {
      blogs: [],
      pagination: { page: 1, pageSize: 8, pageCount: 1, total: 0 },
    };
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
export default async function BlogPage({ searchParams }: any) {
  const currentPage = Number(searchParams?.page) || 1;
  const pageSize = 8;

  const blogPage = await getBlogPageData();
  const { blogs, pagination } = await getBlogsData(currentPage, pageSize);

  if (!blogPage) return notFound();

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

        {/* BLOG GRID */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-8">
          {blogs.length > 0 ? (
            blogs.map((post: any) => {
              const imgUrl = getStrapiMedia(post.pagebanner?.image?.url);
              const countrySlug = post.country?.Slug;
              const blogSlug = post.slug;

              const dynamicHref = countrySlug
                ? `/${countrySlug}/${blogSlug}.html`
                : `/${blogSlug}.html`;

              return (
                <Link key={post.documentId} href={dynamicHref}>
                  <div className="group cursor-pointer overflow-hidden bg-white/80 backdrop-blur-xl shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2 hover:scale-[1.02]">

                    {/* IMAGE */}
                    <div className="relative h-52 w-full overflow-hidden">
                      <Image
                        src={imgUrl || "/optimized/fallback-image.jpg"}
                        alt={post.title}
                        width={800}
                        height={500}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-5 flex flex-col flex-grow">
                      <h2 className="text-[20px] font-bold text-gray-900 leading-tight group-hover:text-orange-500">
                        {post.title}
                      </h2>

                      <p className="text-gray-700 mt-2 line-clamp-1">
                        {post.Excerpt}
                      </p>

                      <div className="mt-auto pt-4 flex justify-between text-gray-500 text-sm">
                        <span>By {post.AuthorName}</span>

                        {/* ✅ DATE FORMAT FIX */}
                        <span>
                          {new Date(post.PublishedDate).toLocaleDateString(
                            "en-GB"
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <p className="text-center col-span-full">No blogs found.</p>
          )}
        </div>

        {/* ✅ SMART PAGINATION */}
        {pagination.pageCount > 1 && (
          <div className="flex justify-center mt-12 gap-2 flex-wrap">
            {Array.from({ length: pagination.pageCount }, (_, i) => {
              const page = i + 1;

              return (
                <Link key={page} href={`/blog?page=${page}`}>
                  <button
                    className={`px-4 py-2 border ${
                      currentPage === page
                        ? "bg-orange-500 text-white"
                        : "bg-white"
                    }`}
                  >
                    {page}
                  </button>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
