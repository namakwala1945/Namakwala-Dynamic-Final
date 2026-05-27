import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getStrapiMedia } from "@/lib/media";

async function getCountryBlogs(country: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[country][Slug][$eq]=${country}&populate[pagebanner][populate]=*&populate[country][populate]=*&sort=PublishedDate:desc&pagination[pageSize]=100`,
      {
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      throw new Error("Failed to fetch country blogs");
    }

    const { data } = await res.json();

    return data || [];
  } catch (error) {
    console.error(error);
    return [];
  }
}

export default async function CountryPage({
  params,
}: {
  params: { country: string };
}) {
  const blogs = await getCountryBlogs(params.country);

  if (!blogs.length) {
    return notFound();
  }

  return (
    <section className="relative poppins bg-[#efefef] min-h-screen">
      <div className="bg-[#111] py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-5xl md:text-6xl text-white playfair uppercase">
            {params.country}
          </h1>

          <div className="w-24 h-[2px] bg-[#d2ab67] mt-4"></div>

          <p className="text-gray-300 mt-4">
            Total Blogs: {blogs.length}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {blogs.map((post: any) => {
            const imgUrl = getStrapiMedia(
              post.pagebanner?.image?.url
            );

            return (
              <Link
                key={post.documentId}
                href={`/${post.country?.Slug}/${post.slug}.html`}
              >
                <div className="group cursor-pointer overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-500 flex flex-col h-full hover:-translate-y-2">
                  <div className="relative h-52 w-full overflow-hidden">
                    <Image
                      src={
                        imgUrl ||
                        "/optimized/fallback-image.jpg"
                      }
                      alt={post.title}
                      width={800}
                      height={500}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h2 className="text-[20px] font-bold text-gray-900 leading-tight group-hover:text-orange-500">
                      {post.title}
                    </h2>

                    <p className="text-gray-700 mt-2 line-clamp-2">
                      {post.Excerpt}
                    </p>

                    <div className="mt-auto pt-4 flex justify-between text-gray-500 text-sm">
                      <span>
                        By {post.AuthorName}
                      </span>

                      <span>
                        {new Date(
                          post.PublishedDate
                        ).toLocaleDateString("en-GB")}
                      </span>
                    </div>

                    <div className="mt-3">
                      <span className="primary-bg blog-card-footer text-white text-xs px-3 py-1 uppercase">
                        {post.country?.Name}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}