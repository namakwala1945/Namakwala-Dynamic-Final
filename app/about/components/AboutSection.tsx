"use client";

import Image from "next/image";
import React from "react";

interface NestedSection {
  slug: string;
  title: string;
  content: string | string[];
  image?: string;
}

interface SectionProps {
  section: {
    slug: string;
    title: string;
    content: string | string[];
    banner?: {
      title?: string;
      heading?: string;
      image?: string;
    };
    sections?: Record<string, NestedSection>;
    image?: string; // For KnowAboutUs sections
    isReversed?: boolean; // For alternating layout
  };
}

export default function AboutSection({ section }: SectionProps) {
  const isReversed = section.isReversed || false;

  return (
    <section
      id={section.slug}
      className="scroll-mt-28 overflow-hidden px-4 sm:px-6 md:px-8 py-8 justify-start"
    >
      {/* Our Journey Section */}
      {section.slug === "our-journey" ? (
        <div className="relative flex flex-col md:flex-row items-center md:items-start md:gap-8 lg:gap-12">
          {/* Text Card */}
          <div
            className="w-full md:w-1/2 bg-white p-6 sm:p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300"
            style={{ minHeight: "auto" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
              {section.title}
            </h2>
            <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
          </div>

          {/* Image */}
          {section.banner?.image && (
            <div className="w-full md:w-1/2 mt-6 md:mt-0 relative md:-top-8 md:-ml-8 lg:-ml-16 overflow-hidden shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500 h-64 sm:h-80 md:h-[350px] lg:h-[380px]">
              <Image
                src={section.banner.image}
                alt={section.title}
                className="object-cover"
                priority
                fill
              />
            </div>
          )}
        </div>
      ) : section.image ? (
        // KnowAboutUs Sections with alternating layout + overlay
        (() => {
          const isEven = !isReversed; // Determine layout dynamically
          return (
            <div
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 animate-fadeIn ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Box overlapping image */}
              <div
                className="md:w-1/2 bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300 -mt-24 md:-mt-0"
                style={{ minHeight: "320px" }}
              >
                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 playfair text-gradient">
                  {section.title}
                </h2>

                {Array.isArray(section.content) ? (
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    {section.content.map((text, i) => (
                      <li key={i}>{text}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-700 whitespace-pre-line">{section.content}</p>
                )}
              </div>

              {/* Image */}
              <div
                className={`md:w-1/2 mt-8 md:mt-0 relative md:-top-8 overflow-hidden shadow-2xl flex-shrink-0 hover:scale-105 transition-transform duration-500 ${
                  isEven ? "md:-ml-16" : "md:-mr-16"
                }`}
                style={{ minHeight: "320px" }}
              >
                <Image
                  src={section.image}
                  alt={section.title}
                  fill
                  className="object-cover animate-fadeIn"
                  priority
                />
              </div>
            </div>
          );
        })()
      ) : (
        // Nested Sections (Milestones, Vision, Leadership, Founder’s Legacy)
        <>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800">{section.title}</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">{section.content}</p>
        </>
      )}

      {/* Nested Sections */}
      {section.sections && (
        <div className="mt-12 py-8 sm:py-12 space-y-12 sm:space-y-16 justify-start">
          {/* Milestones */}
          {"milestones" in section.sections && (
            <div
              id={section.sections.milestones.slug}
              className="bg-white p-4 sm:p-8 border border-[#d2ab67] shadow-2xl hover:scale-105 transition-transform duration-500"
            >
              <h3 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
                {section.sections.milestones.title}
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {Array.isArray(section.sections.milestones.content) &&
                  section.sections.milestones.content.map((item: string, idx: number) => {
                    const [year, ...rest] = item.split("–");
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-start">
                        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 animate-slideUp playfair text-gradient md:col-span-1">
                          {year.trim()}
                        </div>
                        <div className="md:col-span-3 text-gray-700 leading-relaxed">{rest.join("–").trim()}</div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Vision + Leadership + Founder’s Legacy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {["our-vision", "leadership", "founder-legacy"].map((key) => {
              const sub = section.sections?.[key];
              if (!sub) return null;

              return (
                <div
                  key={key}
                  id={sub.slug}
                  className="relative flex flex-col hover:scale-105 transition-transform duration-500 h-full"
                >
                  {sub.image && (
                    <div className="w-full relative h-48 sm:h-56 md:h-64 overflow-hidden flex-shrink-0">
                      <Image
                        src={sub.image}
                        alt={sub.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                        priority
                        fill
                      />
                    </div>
                  )}
                  <div className="w-full bg-white p-6 sm:p-8 md:p-10 relative z-10 -mt-6 sm:-mt-8 shadow-lg flex flex-col flex-grow">
                    <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 md:mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
                      {sub.title}
                    </h4>
                    <p className="text-gray-700 leading-relaxed flex-grow">{sub.content}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}
