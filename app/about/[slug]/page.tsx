import qs from "qs";
import { notFound } from "next/navigation";
import AboutPageRenderer from "../components/AboutPageRenderer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function getPage(slug: string) {
  const query = qs.stringify(
    {
      filters: {
        Slug: {
          $eq: slug,
        },
      },

      populate: {
        CoverImage: true,

        Metadata: {
          populate: "*",
        },

        PageBanner: {
          populate: {
            image: true,
          },
        },

        CommonSection: {
          populate: {
            image_video: true,
          },
        },

        TimelineSection: {
          populate: {
            Image_Video: true,
          },
        },

        MilestoneSection: {
          populate: {
            KeyMilestonesOptions: true,
          },
        },

        TeamSection: {
          populate: {
            Image: true,
            SocialMedia: true,
          },
        },
      },
    },
    {
      encodeValuesOnly: true,
    }
  );

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-pages?${query}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) return null;

  const json = await res.json();

  if (!json.data?.length) return null;

  return json.data[0];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await getPage(slug);

  if (!page) {
    return {
      title: "About",
    };
  }

  return {
    title:
      page?.Metadata?.title ??
      page.Title,

    description:
      page?.Metadata?.description ??
      page.Excerpt,
  };
}

export default async function AboutSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return (
    <AboutPageRenderer
      page={page}
    />
  );
}