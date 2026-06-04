"use client";

import { Suspense } from "react";
import PageBanner from "@/components/PageBanner";
import HashScroll from "@/components/HashScroll";
import AboutSection from "./components/AboutSection";
import "./about.css";
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
    
      ...Object.fromEntries(
        commonSections
          .sort(
            (a, b) =>
              parseInt(a.position || "1") -
              parseInt(b.position || "1")
          )
          .map((item: any) => [
            item.title
              .toLowerCase()
              .replace(/[^a-z0-9]+/g, "-"),
            {
              slug: item.title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-"),
              title: item.title,
              content: getDescriptionText(item.description),
              image: item.image?.url
                ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.image.url}`
                : undefined,
            },
          ])
      ),
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

        {/* About Namakwala Group */}
        {knowAboutUsData
          .filter(item => item.position === "1")
          .map((item) => (
            <AboutSection
              key={item.id}
              section={{
                slug: `know-about-${item.id}`,
                title: item.title,
                content: getDescriptionText(item.description),
                image: item.image?.url
                  ? `${process.env.NEXT_PUBLIC_STRAPI_URL}${item.image.url}`
                  : undefined,
              }}
            />
          ))}

        {/* Our Legacy Since 1945 */}
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

        {/* Remaining Know About Us */}
        {knowAboutUsData
          .filter(item => item.position !== "1")
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

        {/* Milestones + Common Sections */}
        <AboutSection
          section={{
            slug: "nested-sections",
            title: "Nested Sections",
            content: "",
            sections: pageData.sections,
          }}
        />

      </div>
    </section>
  );
}
