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
      { threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
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
      { threshold: 0 }
    );

    visibilityObserver.observe(wrapperEl);

    return () => visibilityObserver.disconnect();
  }, []);

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Fixed left navigation — only visible while the timeline is in view */}
      <div
        className={`hidden lg:flex fixed left-8 top-1/2 -translate-y-1/2 z-40 transition-opacity duration-300 ${
          showNav ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative">
          <div className="absolute left-[11px] top-2 bottom-2 border-l-2 border-dashed border-[#d2ab67]/40" />

          <div className="flex flex-col gap-4">
            {items.map((item, index) => {
              const isActive = active === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(index)}
                  className="relative z-10 flex items-center text-left"
                >
                  <span
                    className={`flex items-center justify-center w-6 h-6 shrink-0 rounded-full border-2 transition-colors duration-300 ${
                      isActive
                        ? "bg-[#d2ab67] border-[#d2ab67]"
                        : "bg-white border-[#d2ab67]/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                        isActive ? "bg-[#0d1b4c]" : "bg-[#d2ab67]/40"
                      }`}
                    />
                  </span>

                  <span
                    className={`ml-3 rounded-full px-4 py-1.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 ${
                      isActive
                        ? "bg-[#0d1b4c] text-[#d2ab67] opacity-100"
                        : "text-[#0d1b4c]/40 opacity-0 -translate-x-2 pointer-events-none"
                    }`}
                  >
                    {item.Year}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-width scrollable sections */}
      {items.map((item, index) => {
        const isDark = index % 2 === 0;
        const isMediaLeft = index % 2 === 0;
        const media = item.Image_Video?.[0];
        const isVideo = media?.mime?.startsWith("video");
        const mediaUrl = media?.url ? getStrapiMedia(media.url) : null;

        return (
          <section
            key={item.id}
            data-index={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className={`w-full min-h-screen flex items-center px-6 md:px-16 lg:px-24 ${
              isDark ? "bg-[#0d1b4c]" : "bg-[#f5efe0]"
            }`}
          >
            <div className="max-w-7xl mx-auto w-full">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isMediaLeft ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Media */}
                <div
                  className={
                    isDark
                      ? "rounded-xl overflow-hidden shadow-2xl"
                      : "bg-white p-4 shadow-2xl rounded-md rotate-1"
                  }
                >
                  {mediaUrl ? (
                    isVideo ? (
                      <video
                        src={mediaUrl}
                        className="w-full h-[420px] object-cover rounded"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <img
                        src={mediaUrl}
                        alt={media?.alternativeText || item.Title}
                        className="w-full h-[420px] object-cover rounded"
                      />
                    )
                  ) : (
                    <div className="w-full h-[420px] rounded bg-black/10" />
                  )}
                </div>

                {/* Text */}
                <div>
                  <h3
                    className={`playfair font-bold leading-none mb-6 ${
                      isDark ? "text-[#d2ab67]" : "text-[#1a2b5c]"
                    }`}
                    style={{ fontSize: "clamp(64px, 9vw, 140px)" }}
                  >
                    {item.Year}
                  </h3>

                  <h2
                    className={`playfair text-3xl md:text-4xl font-bold mb-6 ${
                      isDark ? "text-white" : "text-[#1a2b5c]"
                    }`}
                  >
                    {item.Title}
                  </h2>

                  <div
                    className={`rich-content text-lg leading-relaxed max-w-xl ${
                      isDark ? "text-white/70" : "text-[#444]"
                    }`}
                  >
                    <ContentRenderer content={item.Description} />
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