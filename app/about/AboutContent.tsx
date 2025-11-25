"use client";

import { Suspense } from "react";
import PageBanner from "@/components/PageBanner";
import HashScroll from "@/components/HashScroll";
import AboutSection from "./components/AboutSection";

interface Description {
  children: { text?: string }[];
}

interface KnowAboutUsItem {
  id: string;
  title: string;
  description?: Description[];
  image?: { url?: string };
  position?: string;
}

interface AboutContentProps {
  data: {
    pagebanner?: { title?: string; heading?: string; image?: { url?: string } };
    CommonSection?: any[];
    KeyMilestonesOptions?: { title?: string; KeyMilestonesOptions?: any[] };
    OurJourney?: { title?: string; description?: Description[]; image?: { url?: string } };
    KnowAboutUs?: KnowAboutUsItem[];
  };
}

export default function AboutContent({ data }: AboutContentProps) {
  const bannerImage =
    data.pagebanner?.image?.url
      ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${data.pagebanner.image.url}`
      : "/optimized/placeholder-large.webp";

  const commonSections = data.CommonSection || [];
  const milestoneData = data.KeyMilestonesOptions?.KeyMilestonesOptions || [];
  const journeyData = data.OurJourney || {};
  const knowAboutUsData = data.KnowAboutUs || [];

  // Helper to safely extract text from Description[]
  const getDescriptionText = (descArr?: Description[]): string =>
    descArr
      ?.map(desc =>
        desc.children
          ?.map(c => c.text || "")
          .join(" ")
      )
      .join("\n\n") || "";

  // Prepare pageData for nested sections
  const pageData: any = {
    slug: "our-journey",
    title: journeyData?.title || "Our Journey",
    content: getDescriptionText(journeyData?.description) || "Namakwala's journey began in 1945 in Bhilwara.",
    banner: {
      title: journeyData?.title,
      heading: journeyData?.title,
      image: journeyData?.image?.url
        ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${journeyData.image.url}`
        : undefined,
    },
    sections: {
      milestones: {
        slug: "milestones",
        title: data.KeyMilestonesOptions?.title || "Key Milestones",
        content: milestoneData.map((item: any) => `${item.Year} – ${item.Key}`),
      },
      "our-vision": {
        slug: "our-vision",
        title: commonSections[0]?.title || "Our Vision",
        content: getDescriptionText(commonSections[0]?.description),
        image: commonSections[0]?.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${commonSections[0].image.url}`
          : undefined,
      },
      leadership: {
        slug: "leadership",
        title: commonSections[1]?.title || "Leadership",
        content: getDescriptionText(commonSections[1]?.description),
        image: commonSections[1]?.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${commonSections[1].image.url}`
          : undefined,
      },
      "founder-legacy": {
        slug: "founder-legacy",
        title: commonSections[2]?.title || "Founder’s Legacy",
        content: getDescriptionText(commonSections[2]?.description),
        image: commonSections[2]?.image?.url
          ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${commonSections[2].image.url}`
          : undefined,
      },
    },
  };

  return (
    <section className="relative bg-[#d2ab67] poppins">
      {/* Top Banner */}
      <PageBanner
        title={data.pagebanner?.title || "About Us"}
        image={bannerImage}
        category={
          data.pagebanner?.heading ||
          "Learn about our journey, milestones, and leadership"
        }
      />

      <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
        <HashScroll />
      </Suspense>

      <div className="container mx-auto py-12 space-y-16">
        {/* Our Journey Section */}
        <AboutSection
          section={{
            slug: "our-journey",
            title: journeyData?.title || "Our Journey",
            content: getDescriptionText(journeyData?.description),
            banner: {
              title: journeyData?.title,
              heading: journeyData?.title,
              image: journeyData?.image?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${journeyData.image.url}`
                : undefined,
            },
          }}
        />

        {/* KnowAboutUs Sections (alternating layout) */}
        {knowAboutUsData
          .sort((a, b) => parseInt(a.position || "1") - parseInt(b.position || "1"))
          .map((item, idx) => (
            <AboutSection
              key={item.id}
              section={{
                slug: `know-about-${item.id}`,
                title: item.title,
                content: getDescriptionText(item.description),
                image: item.image?.url
                  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.image.url}`
                  : undefined,
                isReversed: idx % 2 === 1,
              }}
            />
          ))}

        {/* Nested Sections */}
        <AboutSection
          section={{
            slug: "nested-sections",
            title: "Nested Sections", // required
            content: "",              // required
            sections: pageData.sections,
          }}
        />

      </div>
    </section>
  );
}
