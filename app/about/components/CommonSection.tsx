"use client";

import ContentRenderer from "@/components/ContentRenderer";
import MediaRenderer from "./MediaRenderer";

interface Props {
  sections: any[];
}

export default function CommonSection({
  sections,
}: Props) {
  if (!sections?.length) return null;

  const sortedSections = [...sections].sort(
    (a, b) =>
      Number(a.position ?? 999) -
      Number(b.position ?? 999)
  );

  return (
    <section className="space-y-32">

      {sortedSections.map((section, index) => {

        const reverse = index % 2 !== 0;

        return (

          <div
            key={section.id}
            className={`grid lg:grid-cols-2 gap-16 items-center ${
              reverse
                ? "lg:[&>*:first-child]:order-2"
                : ""
            }`}
          >

            {/* Media */}

            <div>

              <MediaRenderer
                media={section.image_video}
              />

            </div>

            {/* Content */}

            <div>

              <h2 className="text-4xl lg:text-5xl playfair font-bold mb-8">

                {section.title}

              </h2>

              <div className="rich-content">

                <ContentRenderer
                  content={section.description}
                />

              </div>

            </div>

          </div>

        );

      })}

    </section>
  );
}