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
    image?: string;
    isReversed?: boolean;
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
          <h4 key={index} className="text-xl font-semibold mb-3 mt-3">
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

              return (
                <React.Fragment key={i}>
                  {node}
                </React.Fragment>
              );
            })}
          </p>
        );

      case "list":
        const ListTag =
          block.format === "ordered" ? "ol" : "ul";

        return (
          <ListTag
            key={index}
            className={
              block.format === "ordered"
                ? "list-decimal pl-6 mb-6 space-y-2"
                : "list-disc pl-6 mb-6 space-y-2"
            }
          >
            {block.children?.map((item: any, i: number) => (
              <li key={i}>
                {item.children?.map((child: any, j: number) => {
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

                  return (
                    <React.Fragment key={j}>
                      {node}
                    </React.Fragment>
                  );
                })}
              </li>
            ))}
          </ListTag>
        );

      default:
        return null;
    }
  });
};

export default function AboutSection({ section }: SectionProps) {
  console.log("CONTENT", section.content);

  const isReversed = section.isReversed || false;

  return (
    <section
      id={section.slug}
      className="
        scroll-mt-28
        overflow-hidden
        px-4
        sm:px-6
        md:px-8
        py-8
        justify-start
      "
    >
      {/* =========================================================
          OUR JOURNEY
      ========================================================= */}
      {section.slug === "our-journey" ? (
        <div
          className="
            relative
            w-full
            max-w-7xl
            mx-auto
            flex
            flex-col
            md:flex-row
            items-stretch
            md:gap-0
          "
        >
          {/* Text Card */}
          <div
            className="
              w-full
              md:w-1/2
              bg-white
              p-6
              sm:p-8
              md:p-10
              lg:p-12
              shadow-2xl
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
              md:translate-x-8
              lg:translate-x-10
            "
          >
            <h2
              className="
                text-3xl
                sm:text-3xl
                md:text-4xl
                font-bold
                mb-4
                text-gray-800
                playfair
                text-gradient
                leading-snug
                md:leading-[1.5]
              "
            >
              {section.title}
            </h2>

            <div className="rich-content">
              {renderRichText(section.content)}
            </div>
          </div>

          {/* Image */}
          {section.banner?.image && (
            <div
              className="
                w-full
                md:w-1/2
                relative
                mt-6
                md:mt-0
                md:-top-5
                md:-ml-5
                overflow-hidden
                shadow-2xl
                transition-all
                duration-500
                ease-out
                hover:scale-[1.02]
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]
                min-h-[320px]
                md:min-h-[420px]
                lg:min-h-[450px]
              "
            >
              <Image
                src={section.banner.image}
                alt={section.title}
                fill
                priority
                className="
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  hover:scale-105
                "
              />

              <div
                className="
                  absolute
                  inset-0
                  bg-black/0
                  hover:bg-black/5
                  transition-colors
                  duration-500
                "
              />
            </div>
          )}
        </div>
      ) : section.slug.startsWith("know-about-") ? (
        (() => {
          const isEven = isReversed;

          return (
            <div
              className={`
                relative
                w-full
                max-w-7xl
                mx-auto
                flex
                flex-col
                md:items-stretch
                md:gap-0
                animate-fadeIn
                ${
                  isEven
                    ? "md:flex-row-reverse"
                    : "md:flex-row"
                }
              `}
            >
              {/* =================================================
                  IMAGE
              ================================================= */}
              {section.image && (
                <div
                  className={`
                    w-full
                    md:w-1/2
                    relative
                    min-h-[320px]
                    md:min-h-[420px]
                    lg:min-h-[450px]
                    overflow-hidden
                    shadow-2xl
                    transition-all
                    duration-500
                    ease-out
                    hover:scale-[1.02]
                    hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]
                    ${
                      isEven
                        ? "md:-mr-5 md:-top-5"
                        : "md:-ml-5 md:-top-5"
                    }
                  `}
                >
                  <Image
                    src={section.image}
                    alt={section.title}
                    fill
                    priority
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      hover:scale-105
                    "
                  />

                  <div
                    className="
                      absolute
                      inset-0
                      bg-black/0
                      hover:bg-black/5
                      transition-colors
                      duration-500
                    "
                  />
                </div>
              )}

              {/* =================================================
                  CONTENT
              ================================================= */}
              <div
                className={`
                  ${
                    section.image
                      ? "w-full md:w-1/2"
                      : "w-full"
                  }

                  bg-white
                  p-6
                  sm:p-8
                  md:p-10
                  lg:p-12

                  shadow-2xl

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
                    mb-4
                    text-gray-800
                    playfair
                    text-gradient
                    leading-snug
                    md:leading-[1.5]
                  "
                >
                  {section.title}
                </h2>

                <div className="rich-content">
                  {renderRichText(section.content)}
                </div>
              </div>
            </div>
          );
        })()
      ) : null}

      {/* =========================================================
          NESTED SECTIONS
      ========================================================= */}
      {section.sections && (
        <div
          className="
            w-full
            max-w-7xl
            mx-auto
            space-y-12
            sm:space-y-16
            pt-12
            sm:pt-16
          "
        >
          {/* =====================================================
              MILESTONES
          ===================================================== */}
          {"milestones" in section.sections && (
            <div
              id={section.sections.milestones.slug}
              className="
                w-full
                bg-white
                p-5
                sm:p-8
                md:p-10
                border
                border-[#d2ab67]
                shadow-2xl
                relative
                overflow-hidden
                transition-all
                duration-500
                ease-out
                hover:-translate-y-1
                hover:shadow-[0_25px_60px_rgba(0,0,0,0.12)]
              "
            >
              <div
                className="
                  absolute
                  top-0
                  left-0
                  w-1
                  h-full
                  bg-[#d2ab67]
                "
              />

              <h3
                className="
                  text-2xl
                  sm:text-4xl
                  md:text-4xl
                  font-bold
                  mb-6
                  text-gray-800
                  animate-slideUp
                  playfair
                  text-gradient
                  leading-snug
                  md:leading-[1.5]
                "
              >
                {section.sections.milestones.title}
              </h3>

              <div className="space-y-5 sm:space-y-7">
                {Array.isArray(
                  section.sections.milestones.content
                ) &&
                  section.sections.milestones.content.map(
                    (item: string, idx: number) => {
                      const [year, ...rest] =
                        item.split("–");

                      return (
                        <div
                          key={idx}
                          className="
                            grid
                            grid-cols-1
                            md:grid-cols-4
                            gap-3
                            sm:gap-6
                            items-start
                            p-4
                            sm:p-5
                            bg-gray-50/70
                            border-l-2
                            border-[#d2ab67]
                            transition-all
                            duration-300
                            hover:bg-white
                            hover:shadow-md
                            hover:translate-x-1
                          "
                        >
                          <div
                            className="
                              text-2xl
                              sm:text-3xl
                              md:text-3xl
                              font-bold
                              text-gray-800
                              animate-slideUp
                              playfair
                              text-gradient
                              md:col-span-1
                            "
                          >
                            {year.trim()}
                          </div>

                          <div
                            className="
                              md:col-span-3
                              text-gray-700
                              leading-relaxed
                            "
                          >
                            {rest.join("–").trim()}
                          </div>
                        </div>
                      );
                    }
                  )}
              </div>
            </div>
          )}

          {/* =====================================================
              VISION + LEADERSHIP + FOUNDER'S LEGACY
          ===================================================== */}
          <div className="about-feature-grid">
            {Object.entries(section.sections || {})
              .filter(([key]) => key !== "milestones")
              .map(([key, sub]: any) => (
                <div
                  key={key}
                  id={sub.slug}
                  className="
                    relative
                    flex
                    flex-col
                    h-full
                    group
                    transition-all
                    duration-500
                    ease-out
                    hover:-translate-y-2
                  "
                >
                  {/* Image */}
                  {sub.image && (
                    <div
                      className="
                        w-full
                        relative
                        h-48
                        sm:h-56
                        md:h-64
                        overflow-hidden
                        flex-shrink-0
                        shadow-lg
                      "
                    >
                      <Image
                        src={sub.image}
                        alt={sub.title}
                        fill
                        priority
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-110
                        "
                      />

                      <div
                        className="
                          absolute
                          inset-0
                          bg-black/0
                          group-hover:bg-black/5
                          transition-colors
                          duration-500
                        "
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div
                    className="
                      w-full
                      bg-white
                      p-6
                      sm:p-8
                      md:p-10
                      relative
                      z-10
                      -mt-6
                      sm:-mt-8
                      shadow-lg
                      flex
                      flex-col
                      flex-grow
                      transition-all
                      duration-500
                      group-hover:shadow-2xl
                    "
                  >
                    <h4
                      className="
                        text-2xl
                        sm:text-2xl
                        md:text-2xl
                        font-bold
                        mb-4
                        text-gray-800
                        animate-slideUp
                        playfair
                        text-gradient
                        leading-snug
                        md:leading-[1.5]
                      "
                    >
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