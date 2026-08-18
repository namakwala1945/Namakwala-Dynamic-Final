"use client";

import { useRef, useState, useEffect } from "react";

import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";

interface StrapiMedia {
  id: number;
  url: string;
  mime: string;
  name?: string;
  alternativeText?: string | null;
}

interface StrapiTimelineItem {
  id: number;
  Year: string;
  Title: string;
  Description: any;
  Image_Video?: StrapiMedia[];
}

interface Props {
  items: StrapiTimelineItem[];
}

export default function TimelineSection({ items }: Props) {
  if (!items?.length) return null;

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const [showNav, setShowNav] = useState(false);
  const isManualScroll = useRef(false);
  const manualScrollTimeout = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const scrollToSection = (index: number) => {
    isManualScroll.current = true;
    setActive(index);

    refs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    if (manualScrollTimeout.current) clearTimeout(manualScrollTimeout.current);

    manualScrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 900);
  };

  useEffect(() => {
    const ratios = new Map<number, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;

        entries.forEach((entry) => {
          const index = Number(entry.target.getAttribute("data-index"));
          ratios.set(index, entry.intersectionRatio);
        });

        let bestIndex = -1;
        let bestRatio = 0;

        ratios.forEach((ratio, index) => {
          if (ratio > bestRatio) {
            bestRatio = ratio;
            bestIndex = index;
          }
        });

        if (bestIndex !== -1) setActive(bestIndex);
      },
      {
        threshold: [0, 0.1, 0.25, 0.5, 0.75, 1],
      }
    );

    refs.current.forEach((el) => el && observer.observe(el));

    return () => {
      observer.disconnect();

      if (manualScrollTimeout.current)
        clearTimeout(manualScrollTimeout.current);
    };
  }, [items]);

  // Show the fixed left nav only while the timeline itself is in view.
  useEffect(() => {
    const wrapperEl = wrapperRef.current;

    if (!wrapperEl) return;

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => setShowNav(entry.isIntersecting),
      {
        threshold: 0,
      }
    );

    visibilityObserver.observe(wrapperEl);

    return () => visibilityObserver.disconnect();
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full overflow-hidden bg-[#f5efe0]"
    >
      {/* =====================================================
          FIXED LEFT TIMELINE NAVIGATION
      ===================================================== */}

      <div
        className={`
          hidden
          lg:flex
          fixed
          left-8
          top-1/2
          -translate-y-1/2
          z-40
          transition-all
          duration-500

          ${
            showNav
              ? "translate-x-0 opacity-100"
              : "-translate-x-4 opacity-0 pointer-events-none"
          }
        `}
      >
        <div className="relative">
          {/* Timeline Line */}
          <div
            className="
              absolute
              left-[11px]
              top-2
              bottom-2
              w-px
              bg-gradient-to-b
              from-transparent
              via-[#d2ab67]/50
              to-transparent
            "
          />

          <div className="flex flex-col gap-5">
            {items.map((item, index) => {
              const isActive = active === index;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(index)}
                  className="group relative z-10 flex items-center text-left"
                >
                  {/* Timeline Dot */}
                  <span
                    className={`
                      relative
                      flex
                      h-6
                      w-6
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      border-2
                      transition-all
                      duration-500

                      ${
                        isActive
                          ? `
                            scale-110
                            border-[#d2ab67]
                            bg-[#d2ab67]
                            shadow-[0_0_0_6px_rgba(210,171,103,0.15)]
                          `
                          : `
                            border-[#d2ab67]/50
                            bg-[#f5efe0]
                            group-hover:border-[#d2ab67]
                            group-hover:scale-105
                          `
                      }
                    `}
                  >
                    <span
                      className={`
                        h-1.5
                        w-1.5
                        rounded-full
                        transition-all
                        duration-300

                        ${
                          isActive
                            ? "scale-100 bg-[#1f1d1a]"
                            : "bg-[#d2ab67]/50 group-hover:bg-[#d2ab67]"
                        }
                      `}
                    />
                  </span>

                  {/* Active Year */}
                  <span
                    className={`
                      ml-3
                      rounded-full
                      px-4
                      py-1.5
                      text-sm
                      font-bold
                      whitespace-nowrap
                      transition-all
                      duration-300

                      ${
                        isActive
                          ? `
                            translate-x-0
                            bg-[#1f1d1a]
                            text-[#d2ab67]
                            opacity-100
                          `
                          : `
                            pointer-events-none
                            -translate-x-2
                            text-[#1f1d1a]/40
                            opacity-0
                          `
                      }
                    `}
                  >
                    {item.Year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* =====================================================
          TIMELINE SECTIONS
      ===================================================== */}

      {items.map((item, index) => {
        const isDark = index % 2 === 0;
        const isMediaLeft = index % 2 === 0;

        const media = item.Image_Video?.[0];

        const isVideo = media?.mime?.startsWith("video");

        const mediaUrl = media?.url
          ? getStrapiMedia(media.url)
          : null;

        return (
          <section
            key={item.id}
            data-index={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className={`
              relative
              flex
              min-h-screen
              w-full
              items-center
              overflow-hidden
              px-6
              py-24
              md:px-16
              lg:px-24
              lg:py-32

              ${
                isDark
                  ? "bg-[#292722]"
                  : "bg-[#f5efe0]"
              }
            `}
          >
            {/* =====================================================
                LARGE BACKGROUND NUMBER
            ===================================================== */}

            <div
              className={`
                pointer-events-none
                absolute
                -right-12
                top-1/2
                -translate-y-1/2
                select-none
                playfair
                text-[180px]
                font-bold
                leading-none
                opacity-[0.035]
                sm:text-[240px]
                lg:text-[320px]

                ${
                  isDark
                    ? "text-white"
                    : "text-[#1f1d1a]"
                }
              `}
            >
              {String(index + 1).padStart(2, "0")}
            </div>

            <div className="relative mx-auto w-full max-w-7xl">
              <div
                className={`
                  grid
                  items-center
                  gap-12
                  lg:grid-cols-2
                  lg:gap-20

                  ${
                    isMediaLeft
                      ? ""
                      : "lg:[&>*:first-child]:order-2"
                  }
                `}
              >
                {/* =====================================================
                    MEDIA
                ===================================================== */}

                <div className="group relative">
                  {/* Decorative Corner — Bottom Left */}
                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -bottom-4
                      -left-4
                      h-24
                      w-24
                      border-b
                      border-l
                      transition-all
                      duration-500
                      group-hover:-bottom-5
                      group-hover:-left-5

                      ${
                        isDark
                          ? "border-[#d2ab67]/70"
                          : "border-[#d2ab67]"
                      }
                    `}
                  />

                  {/* Decorative Corner — Top Right */}
                  <div
                    className={`
                      pointer-events-none
                      absolute
                      -right-4
                      -top-4
                      h-24
                      w-24
                      border-r
                      border-t
                      transition-all
                      duration-500
                      group-hover:-right-5
                      group-hover:-top-5

                      ${
                        isDark
                          ? "border-[#d2ab67]/70"
                          : "border-[#d2ab67]"
                      }
                    `}
                  />

                  {/* Media Container */}
                  <div
                    className={`
                      relative
                      overflow-hidden
                      shadow-[0_25px_70px_rgba(0,0,0,0.18)]
                      transition-all
                      duration-700
                      ease-out

                      group-hover:rotate-0
                      group-hover:scale-[1.015]
                      group-hover:shadow-[0_35px_90px_rgba(0,0,0,0.25)]

                      ${
                        isDark
                          ? "bg-[#1f1d1a] p-3"
                          : "rotate-1 bg-white p-4"
                      }
                    `}
                  >
                    {mediaUrl ? (
                      isVideo ? (
                        <video
                          src={mediaUrl}
                          className="
                            h-[360px]
                            w-full
                            rounded-sm
                            object-cover
                            transition-transform
                            duration-1000
                            ease-out
                            group-hover:scale-105
                            md:h-[460px]
                            lg:h-[500px]
                          "
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={
                            media?.alternativeText ||
                            item.Title
                          }
                          className="
                            h-[360px]
                            w-full
                            rounded-sm
                            object-cover
                            transition-transform
                            duration-1000
                            ease-out
                            group-hover:scale-105
                            md:h-[460px]
                            lg:h-[500px]
                          "
                        />
                      )
                    ) : (
                      <div
                        className="
                          h-[360px]
                          w-full
                          rounded-sm
                          bg-black/10
                          md:h-[460px]
                          lg:h-[500px]
                        "
                      />
                    )}

                    {/* Media Overlay */}
                    <div
                      className="
                        pointer-events-none
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-black/20
                        to-transparent
                        opacity-0
                        transition-opacity
                        duration-700
                        group-hover:opacity-100
                      "
                    />
                  </div>
                </div>

                {/* =====================================================
                    CONTENT
                ===================================================== */}

                <div
                  className={`
                    relative
                    max-w-xl

                    ${
                      isDark
                        ? "text-white"
                        : "text-[#1f1d1a]"
                    }
                  `}
                >
                  {/* Year */}
                  <h3
                    className={`
                      playfair
                      mb-3
                      font-bold
                      leading-none
                      tracking-tight

                      ${
                        isDark
                          ? "text-[#d2ab67]"
                          : "text-[#b18a45]"
                      }
                    `}
                    style={{
                      fontSize: "clamp(64px, 9vw, 140px)",
                    }}
                  >
                    {item.Year}
                  </h3>

                  {/* =================================================
                      TITLE DECORATIVE LINE
                  ================================================= */}

                  <div className="mb-6 flex items-center gap-2">
                    <span className="h-[2px] w-8 bg-[#d2ab67]" />

                    <span className="h-1.5 w-1.5 rounded-full bg-[#d2ab67]" />

                    <span className="h-[2px] w-16 bg-[#d2ab67]" />

                    <span className="h-1.5 w-1.5 rounded-full bg-[#d2ab67]" />

                    <span className="h-[2px] w-8 bg-[#d2ab67]" />
                  </div>

                  {/* Title */}
                  <h2
                    className={`
                      playfair
                      text-3xl
                      font-bold
                      leading-tight
                      md:text-4xl
                      lg:text-5xl

                      ${
                        isDark
                          ? "text-white"
                          : "text-[#1f1d1a]"
                      }
                    `}
                  >
                    {item.Title}
                  </h2>

                  {/* Description */}
                  <div
                    className={`
                      rich-content
                      mt-6
                      max-w-xl
                      text-base
                      leading-8
                      md:text-lg

                      ${
                        isDark
                          ? "text-white/70"
                          : "text-[#625d57]"
                      }
                    `}
                  >
                    <ContentRenderer
                      content={item.Description}
                    />
                  </div>

                  {/* Bottom Accent */}
                  <div className="mt-8 flex items-center gap-3">
                    <span className="h-[2px] w-14 bg-[#d2ab67]" />

                    <span
                      className={`
                        text-xs
                        font-bold
                        uppercase
                        tracking-[0.25em]

                        ${
                          isDark
                            ? "text-white/40"
                            : "text-[#1f1d1a]/40"
                        }
                      `}
                    >
                      Milestone{" "}
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}