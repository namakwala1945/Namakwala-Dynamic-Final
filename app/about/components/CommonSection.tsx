"use client";

import ContentRenderer from "@/components/ContentRenderer";
import MediaRenderer from "./MediaRenderer";

interface Props {
  sections: any[];
}

export default function CommonSection({ sections }: Props) {
  if (!sections?.length) return null;

  const sortedSections = [...sections].sort(
    (a, b) => Number(a.position ?? 999) - Number(b.position ?? 999)
  );

  return (
    <section className="space-y-12 sm:space-y-16">
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
                w-full
                md:w-1/2
                self-stretch
                relative
                min-h-[320px]
                overflow-hidden
                shadow-2xl
                rounded-none
                transition-all
                duration-500
                hover:scale-[1.02]
                [&_img]:absolute [&_img]:inset-0 [&_img]:w-full [&_img]:h-full [&_img]:object-cover [&_img]:rounded-none
                [&_video]:absolute [&_video]:inset-0 [&_video]:w-full [&_video]:h-full [&_video]:object-cover [&_video]:rounded-none
                [&_video]:transition-transform [&_video]:duration-700 [&_video]:hover:scale-105
                [&_img]:transition-transform [&_img]:duration-700 [&_img]:hover:scale-105
                ${isEven ? "md:-mr-5 md:-top-5" : "md:-ml-5 md:-top-5"}
              `}
            >
              <MediaRenderer media={section.image_video} />
            </div>

            {/* Content */}
            <div
              className={`
                md:w-1/2
                bg-white
                p-6 md:p-10 lg:p-12
                shadow-2xl
                rounded-none
                relative
                z-10
                flex
                flex-col
                justify-center
                transition-all
                duration-500
                hover:scale-[1.02]
                mt-6
                md:mt-0
                ${
                  isEven
                    ? "md:-ml-10 lg:-ml-14 md:translate-x-8 lg:translate-x-10"
                    : "md:-mr-10 lg:-mr-14 md:-translate-x-8 lg:-translate-x-10"
                }
              `}
            >
              <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 text-gray-800 playfair text-gradient leading-snug md:leading-[1.5]">
                {section.title}
              </h2>

              <div className="rich-content">
                <ContentRenderer content={section.description} />
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}