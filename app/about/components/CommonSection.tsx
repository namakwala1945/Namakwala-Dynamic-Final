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
    <section className="w-full max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {sortedSections.map((section, index) => {
        const isEven = index % 2 !== 0;

        return (
          <div
            key={section.id}
            className={`
              relative
              w-full
              flex
              flex-col
              items-stretch
              md:flex-row
              md:gap-0
              animate-fadeIn
              
              ${
                isEven
                  ? "md:flex-row-reverse md:-translate-x-6"
                  : "md:flex-row md:translate-x-6"
              }
            `}
          >
            {/* =====================================================
                MEDIA
            ===================================================== */}
            <div
              className={`
                w-full
                md:w-1/2
                relative
                self-stretch
                min-h-[320px]
                overflow-hidden
                shadow-2xl
                rounded-none
                flex

                transition-all
                duration-500
                ease-out

                hover:scale-[1.02]
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]

                [&_img]:absolute
                [&_img]:inset-0
                [&_img]:w-full
                [&_img]:h-full
                [&_img]:object-cover
                [&_img]:rounded-none
                [&_img]:transition-transform
                [&_img]:duration-700
                [&_img]:ease-out
                [&_img]:hover:scale-105

                [&_video]:absolute
                [&_video]:inset-0
                [&_video]:w-full
                [&_video]:h-full
                [&_video]:object-cover
                [&_video]:rounded-none
                [&_video]:transition-transform
                [&_video]:duration-700
                [&_video]:ease-out
                [&_video]:hover:scale-105

                ${
                  isEven
                    ? "md:-mr-5 md:-top-5"
                    : "md:-ml-5 md:-top-5"
                }
              `}
            >
              <MediaRenderer media={section.image_video} />

              {/* Subtle media overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  hover:bg-black/5
                  transition-colors
                  duration-500
                  pointer-events-none
                "
              />
            </div>

            {/* =====================================================
                CONTENT
            ===================================================== */}
            <div
              className={`
                w-full
                md:w-1/2

                bg-white

                p-6
                sm:p-8
                md:p-10
                lg:p-12

                shadow-2xl
                rounded-none

                relative
                z-20

                flex
                flex-col
                justify-center

                transition-all
                duration-500
                ease-out

                hover:scale-[1.02]
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)]

                mt-6
                md:mt-0

                ${
                  isEven
                    ? "md:-ml-10 lg:-ml-14 md:translate-x-8 lg:translate-x-10"
                    : "md:-mr-10 lg:-mr-14 md:-translate-x-8 lg:-translate-x-10"
                }
              `}
            >
              <h2
  className="
    text-3xl
    sm:text-4xl
    md:text-4xl
    font-bold
    mb-3
    text-gray-800
    playfair
    text-gradient
    leading-snug
    md:leading-[1.5]
  "
>
  {section.title}
              </h2>

              {/* Decorative Title Divider */}
              <div className="group/divider mb-6 flex items-center gap-2">
                <span
                  className="
                    h-[2px]
                    w-8
                    bg-[#d2ab67]
                    transition-all
                    duration-500
                    group-hover/divider:w-12
                  "
                />

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#d2ab67]
                    transition-transform
                    duration-500
                    group-hover/divider:scale-125
                  "
                />

                <span
                  className="
                    h-[2px]
                    w-16
                    bg-[#d2ab67]
                    transition-all
                    duration-500
                    group-hover/divider:w-20
                  "
                />

                <span
                  className="
                    h-1.5
                    w-1.5
                    rounded-full
                    bg-[#d2ab67]
                    transition-transform
                    duration-500
                    group-hover/divider:scale-125
                  "
                />

                <span
                  className="
                    h-[2px]
                    w-8
                    bg-[#d2ab67]
                    transition-all
                    duration-500
                    group-hover/divider:w-12
                  "
                />
              </div>

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