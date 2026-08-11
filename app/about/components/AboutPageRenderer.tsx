"use client";

import PageBanner from "@/components/PageBanner";
import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";

import CommonSection from "./CommonSection";
import TimelineSection from "./TimelineSection";
import MilestoneSection from "./MilestoneSection";
import TeamSection from "./TeamSection";

export default function AboutPageRenderer({
  page,
}: {
  page: any;
}) {
  console.log("PAGE DATA", page);

  return (
    <>
      <PageBanner
        title={
          page?.PageBanner?.title ??
          page.Title
        }
        image={
          page?.PageBanner?.image?.url
            ? getStrapiMedia(
                page.PageBanner.image.url
              )
            : "/images/about-banner.webp"
        }
      />

      <section className="bg-[#d2ab67] py-20">

        <div className="max-w-7xl mx-auto bg-white shadow-xl">

          <div className="p-8 md:p-14 lg:p-20">

            <h1 className="text-5xl playfair font-bold mb-8">
              {page.Title}
            </h1>

            {page.Content?.length > 0 && (
              <div className="rich-content mb-20">
                <ContentRenderer
                  content={page.Content}
                />
              </div>
            )}

            {page.CommonSection?.length > 0 && (
              <CommonSection
                sections={page.CommonSection}
              />
            )}

            {page.TimelineSection?.length > 0 && (
              <TimelineSection
                items={page.TimelineSection}
              />
            )}

            {page.MilestoneSection && (
              <MilestoneSection
                milestone={
                  page.MilestoneSection
                }
              />
            )}

            {page.TeamSection?.length > 0 && (
              <TeamSection
                members={page.TeamSection}
              />
            )}

          </div>

        </div>

      </section>
    </>
  );
}