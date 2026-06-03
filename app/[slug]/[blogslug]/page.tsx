import { Metadata } from "next";
import BlogDetailPage from "@/components/BlogDetailPage";
import { getHreflang } from "@/lib/hreflang";

async function getBlogData(slug: string) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/blogs?filters[slug][$eq]=${slug}&populate[pagebanner][populate]=*&populate[country][populate]=*`,
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

  const cleanSlug = blogslug.replace(".html", "");

  const blog = await getBlogData(cleanSlug);

  if (!blog) {
    return {};
  }

  const hreflang = getHreflang(blog.country?.Slug || "");

  const url = `https://www.namakwala.com/${blog.country?.Slug}/${blog.slug}.html`;

  const image =
    blog.pagebanner?.image?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${blog.pagebanner.image.url}`
      : "https://www.namakwala.com/namakwala-logo.png";

  return {
    title: blog.title,

    description: blog.Excerpt || "",

    alternates: {
      canonical: url,

      languages: {
        [hreflang]: url,
      },
    },

    openGraph: {
      title: blog.title,

      description: blog.Excerpt || "",

      url,

      type: "article",

      locale: hreflang,

      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",

      title: blog.title,

      description: blog.Excerpt || "",

      images: [image],
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

  const cleanSlug = blogslug.replace(".html", "");

  return <BlogDetailPage slug={cleanSlug} />;
}