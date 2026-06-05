"use client";

import Image from "next/image";
import React from "react";

interface RichTextNode {
  type?: string;
  level?: number;
  children?: {
    text?: string;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  }[];
}

interface NestedSection {
  slug: string;
  title: string;
  content: any;
  image?: string;
}

interface SectionProps {
  section: {
    slug: string;
    title: string;
    content: any;
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
const renderRichText = (content: any) => {
  if (!Array.isArray(content)) {
    return (
      <p className="text-gray-700 leading-relaxed whitespace-pre-line">
        {content}
      </p>
    );
  }

  return content.map((block: any, index: number) => {
    const text = block.children?.map((child: any) => child.text).join("");

    switch (block.type) {
      case "heading":
        if (block.level === 1) {
          return (
            <h1
              key={index}
              className="text-4xl md:text-5xl font-bold mb-6 mt-6"
            >
              {text}
            </h1>
          );
        }

        if (block.level === 2) {
          return (
            <h2
              key={index}
              className="text-3xl md:text-4xl font-bold mb-5 mt-5"
            >
              {text}
            </h2>
          );
        }

        if (block.level === 3) {
          return (
            <h3
              key={index}
              className="text-2xl md:text-3xl font-semibold mb-4 mt-4"
            >
              {text}
            </h3>
          );
        }

        return (
          <h4
            key={index}
            className="text-xl font-semibold mb-3 mt-3"
          >
            {text}
          </h4>
        );

      case "paragraph":
        return (
          <p
            key={index}
            className="mb-4 text-gray-700 leading-8"
          >
            {block.children?.map((child: any, i: number) => {
              let node: React.ReactNode = child.text;

              if (child.bold) {
                node = <strong>{node}</strong>;
              }

              if (child.italic) {
                node = <em>{node}</em>;
              }

              if (child.underline) {
                node = <u>{node}</u>;
              }

              return <React.Fragment key={i}>{node}</React.Fragment>;
            })}
          </p>
        );

      case "list":
        return (
          <ul
            key={index}
            className="list-disc pl-6 mb-4"
          >
            {block.children?.map((item: any, i: number) => (
              <li key={i}>{item.text}</li>
            ))}
          </ul>
        );

      default:
        return null;
    }
  });
};
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
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
              {section.title}
            </h2>
            <div className="rich-content">
              {renderRichText(section.content)}
            </div>
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
      ) : section.slug.startsWith("know-about-") ? (
        (() => {
          const isEven = isReversed;
      
          return (
            <div
              className={`relative flex flex-col md:flex-row items-center md:items-start md:gap-12 animate-fadeIn ${
                isEven ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Text Box */}
              <div
                className={`${
                  section.image ? "md:w-1/2" : "w-full"
                } bg-white p-8 md:p-12 shadow-2xl z-10 relative hover:scale-105 transition-transform duration-300`}
              >
                <h2 className="text-3xl sm:text-4xl md:text-4xl font-bold mb-4 text-gray-800 playfair text-gradient leading-snug md:leading-[1.5]">
                  {section.title}
                </h2>
      
                <div className="rich-content">
                  {renderRichText(section.content)}
                </div>
              </div>
      
              {/* Optional Image */}
              {section.image && (
                <div
                  className={`w-full md:w-1/2 mt-6 md:mt-0 relative overflow-hidden shadow-2xl flex-shrink-0 h-64 sm:h-80 md:h-[350px] lg:h-[380px] ${
                    isEven ? "md:-ml-16" : "md:-mr-16"
                  }`}
                >
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              )}
            </div>
          );
        })()
      ) : null}

      {/* Nested Sections */}
      {section.sections && (
        <div className="py-8 sm:py-12 space-y-12 sm:space-y-16 justify-start">
          {/* Milestones */}
          {"milestones" in section.sections && (
            <div
              id={section.sections.milestones.slug}
              className="bg-white p-4 sm:p-8 border border-[#d2ab67] shadow-2xl hover:scale-105 transition-transform duration-500"
            >
              <h3 className="text-2xl sm:text-4xl md:text-4xl font-bold mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
                {section.sections.milestones.title}
              </h3>
              <div className="space-y-4 sm:space-y-6">
                {Array.isArray(section.sections.milestones.content) &&
                  section.sections.milestones.content.map((item: string, idx: number) => {
                    const [year, ...rest] = item.split("–");
                    return (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-6 items-start">
                        <div className="text-2xl sm:text-3xl md:text-3xl font-bold text-gray-800 animate-slideUp playfair text-gradient md:col-span-1">
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
          <div className="about-feature-grid">
            {Object.entries(section.sections || {})
              .filter(([key]) => key !== "milestones")
              .map(([key, sub]: any) => (
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
                    <h4 className="text-2xl sm:text-2xl md:text-2xl font-bold mb-3 sm:mb-4 md:mb-4 text-gray-800 animate-slideUp playfair text-gradient leading-snug md:leading-[1.5]">
                      {sub.title}
                    </h4>

                    <div className="rich-content">
                    {renderRichText(sub.content)}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </section>
  );
}
