import { Metadata } from "next";
import BlogDetailPage from "@/components/BlogDetailPage";
import { getHreflang } from "@/lib/hreflang";

async function getBlogData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate[country][populate]=*`,
      {
        next: { revalidate: 60 },
      }
    );

    const { data } = await res.json();

    return data?.[0];

  } catch (error) {

    console.error(error);

    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    slug: string;
    blogslug: string;
  }>;
}): Promise<Metadata> {

  const { blogslug } = await params;

  const blog = await getBlogData(blogslug);

  if (!blog) {
    return {};
  }

  const hreflang = getHreflang(
    blog.country?.Slug || ""
  );

  const url =
    `https://www.namakwala.com/${blog.country?.Slug}/${blog.slug}.html`;

  return {
    title: blog.title,

    description:
      blog.Excerpt || "",

    alternates: {
      canonical: url,

      languages: {
        [hreflang]: url,
      },
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{
    slug: string;
    blogslug: string;
  }>;
}) {

  const { blogslug } = await params;

  return (
    <BlogDetailPage
      slug={blogslug}
    />
  );
}