"use client";

import GoldCorners from "./GoldCorners";

interface Props {
  milestone: any;
}

export default function MilestoneSection({
  milestone,
}: Props) {
  if (!milestone?.KeyMilestonesOptions?.length) return null;

  return (
    <section className="py-12 sm:py-16 md:py-24">

      <div className="text-center mb-10 sm:mb-16">

        <span className="inline-block rounded-full bg-[#0d1b4c] text-[#d2ab67] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] mb-4 shadow-md">
          Milestones
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl playfair font-bold">
          {milestone.title}
        </h2>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">

        {milestone.KeyMilestonesOptions?.map(
          (item: any) => (
            <div
              key={item.id}
              className="hover-lift relative bg-[#f5efe0] p-6 sm:p-8 md:p-10 rounded-2xl text-center shadow-lg border-t-4 border-[#d2ab67]"
            >
              <GoldCorners size="sm" />

              <h3 className="text-4xl sm:text-5xl font-bold mb-5 playfair text-gradient">
                {item.Year}
              </h3>

              <p className="text-lg text-[#5a4a2e]">
                {item.Key}
              </p>
            </div>
          )
        )}

      </div>

    </section>
  );
}