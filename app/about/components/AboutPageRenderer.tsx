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

  const hasLeadingContent =
    page.Content?.length > 0 || page.CommonSection?.length > 0;
  const hasTrailingContent =
    page.MilestoneSection?.KeyMilestonesOptions?.length > 0 ||
    page.TeamSection?.length > 0;

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
            : "/optimized/placeholder-large.webp"
        }
      />

      {hasLeadingContent && (
        <section className="bg-[#d2ab67] py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-12 about-section">
          <div className="max-w-7xl mx-auto">
            {page.Content?.length > 0 && (
              <div className="rich-content max-w-3xl mx-auto text-center mb-10 sm:mb-14 md:mb-20">
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
          </div>
        </section>
      )}

      {page.TimelineSection?.length > 0 && (
        <TimelineSection
          items={page.TimelineSection}
        />
      )}

      {hasTrailingContent && (
        <section className="bg-[#d2ab67] py-12 sm:py-16 md:py-20 px-4 md:px-8 lg:px-12">
          <div className="max-w-7xl mx-auto">
            {page.MilestoneSection?.KeyMilestonesOptions?.length > 0 && (
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
        </section>
      )}
    </>
  );
}