"use client";

import ContentRenderer from "@/components/ContentRenderer";
import MediaRenderer from "./MediaRenderer";
import GoldCorners from "./GoldCorners";

interface Props {
  sections: any[];
}

export default function CommonSection({ sections }: Props) {
  if (!sections?.length) return null;

  const sortedSections = [...sections].sort(
    (a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)
  );

  return (
    <section className="space-y-16 sm:space-y-20">
      {sortedSections.map((section, index) => {
        const isEven = index % 2 !== 0;

        return (
          <div
            key={section.id}
            className={`relative flex flex-col items-stretch md:gap-10 lg:gap-8 animate-fadeIn ${
              isEven ? "md:flex-row-reverse" : "md:flex-row"
            }`}
          >
            {/* Media */}
            <div
              className={`
                relative
                w-full
                md:w-1/2
                self-stretch
                ${isEven ? "md:-mr-5 md:-top-5" : "md:-ml-5 md:-top-5"}
              `}
            >
              <GoldCorners />

              <div
                className={`
                  relative
                  h-full
                  min-h-[320px]
                  overflow-hidden
                  shadow-2xl
                  border-2 border-[#d2ab67]/30
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                  [&_img]:absolute [&_img]:inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover
                  [&_video]:absolute [&_video]:inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-cover
                  [&_video]:transition-transform [&_video]:duration-700 [&_video]:hover:scale-105
                  [&_img]:transition-transform [&_img]:duration-700 [&_img]:hover:scale-105
                `}
              >
                <MediaRenderer media={section.image_video} />
              </div>
            </div>

            {/* Content */}
            <div
              className={`
                relative
                md:w-1/2
                self-stretch
                z-10
                mt-6
                md:mt-0
                ${
                  isEven
                    ? "md:-ml-10 lg:-ml-14 md:translate-x-8 lg:translate-x-10"
                    : "md:-mr-10 lg:-mr-14 md:-translate-x-8 lg:-translate-x-10"
                }
              `}
            >
              <GoldCorners size="sm" />

              <div
                className="
                  h-full
                  flex
                  flex-col
                  justify-center
                  bg-[#f5efe0]
                  border border-[#d2ab67]/40
                  p-6 md:p-10 lg:p-12
                  shadow-2xl
                  transition-all
                  duration-500
                  hover:scale-[1.02]
                "
              >
                <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 text-gray-800 playfair text-gradient leading-snug md:leading-[1.5]">
                  {section.title}
                </h2>

                <div className="flex items-center gap-2.5 mb-4">
                  <span className="h-px w-10 bg-gradient-to-r from-transparent via-[#d2ab67] to-[#d2ab67]" />
                  <span className="w-1.5 h-1.5 rotate-45 bg-[#d2ab67]" />
                </div>

                <div className="rich-content">
                  <ContentRenderer content={section.description} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}
