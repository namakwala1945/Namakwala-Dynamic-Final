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
  const refs = useRef<(HTMLElement | null)[]>([]);
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

  // Show the fixed left nav only while the timeline actually overlaps the
  // vertical center of the viewport — i.e. where the nav itself sits. A
  // plain "is the wrapper touching the viewport at all" check falsely stays
  // true on short pages, where the trailing edge of the last min-h-screen
  // section can never scroll above the viewport's *middle* before the page
  // runs out of content to scroll into.
  useEffect(() => {
    const wrapperEl = wrapperRef.current;
    if (!wrapperEl) return;

    let ticking = false;

    const updateShowNav = () => {
      ticking = false;
      const rect = wrapperEl.getBoundingClientRect();
      const viewportCenter = window.innerHeight / 2;
      setShowNav(rect.top < viewportCenter && rect.bottom > viewportCenter);
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(updateShowNav);
    };

    updateShowNav();
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
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
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-gradient-to-b from-[#d2ab67]/10 via-[#d2ab67]/50 to-[#d2ab67]/10" />

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
                    className={`flex items-center justify-center w-6 h-6 shrink-0 rotate-45 border-2 transition-all duration-300 ${
                      isActive
                        ? "bg-[#d2ab67] border-[#d2ab67] shadow-[0_0_16px_rgba(210,171,103,0.8)] animate-pulse-glow"
                        : "bg-white border-[#d2ab67]/40"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 transition-colors duration-300 ${
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
        const mediaUrl = getStrapiMedia(media?.url);

        const chapter = `Chapter ${String(index + 1).padStart(2, "0")} / ${String(items.length).padStart(2, "0")}`;

        return (
          <section
            key={item.id}
            data-index={index}
            ref={(el) => {
              refs.current[index] = el;
            }}
            className={`relative w-full min-h-screen flex items-center overflow-hidden px-6 md:px-16 lg:px-24 ${
              isDark ? "bg-[#0d1b4c]" : "bg-[#f5efe0]"
            }`}
          >
            {/* Ornamental texture — subtle diagonal gold lattice, dark chapters only */}
            {isDark && (
              <>
                <div
                  className="absolute inset-0 pointer-events-none opacity-[0.06]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(45deg, #d2ab67 0px, #d2ab67 1px, transparent 1px, transparent 44px), repeating-linear-gradient(-45deg, #d2ab67 0px, #d2ab67 1px, transparent 1px, transparent 44px)",
                  }}
                />

                {/* Stage-light vignette glow */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(210,171,103,0.10), transparent 70%)",
                  }}
                />

                {/* Brand crest watermark */}
                <img
                  src="/namakwala-white-logo.png"
                  alt=""
                  aria-hidden="true"
                  className={`absolute w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[560px] lg:h-[560px] object-contain opacity-[0.04] pointer-events-none ${
                    isMediaLeft
                      ? "-right-24 top-1/2 -translate-y-1/2"
                      : "-left-24 top-1/2 -translate-y-1/2"
                  }`}
                />
              </>
            )}

            <div className="relative z-10 max-w-7xl mx-auto w-full">
              <div
                className={`grid lg:grid-cols-2 gap-16 items-center ${
                  isMediaLeft ? "" : "lg:[&>*:first-child]:order-2"
                }`}
              >
                {/* Media */}
                {isDark ? (
                  <div className="relative">
                    <span className="absolute -top-4 -left-4 w-10 h-10 border-t-2 border-l-2 border-[#d2ab67] z-10" />
                    <span className="absolute -top-4 -left-4 w-1.5 h-1.5 -translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#d2ab67] z-10" />
                    <span className="absolute -top-4 -right-4 w-10 h-10 border-t-2 border-r-2 border-[#d2ab67] z-10" />
                    <span className="absolute -top-4 -right-4 w-1.5 h-1.5 translate-x-1/2 -translate-y-1/2 rotate-45 bg-[#d2ab67] z-10" />
                    <span className="absolute -bottom-4 -left-4 w-10 h-10 border-b-2 border-l-2 border-[#d2ab67] z-10" />
                    <span className="absolute -bottom-4 -left-4 w-1.5 h-1.5 -translate-x-1/2 translate-y-1/2 rotate-45 bg-[#d2ab67] z-10" />
                    <span className="absolute -bottom-4 -right-4 w-10 h-10 border-b-2 border-r-2 border-[#d2ab67] z-10" />
                    <span className="absolute -bottom-4 -right-4 w-1.5 h-1.5 translate-x-1/2 translate-y-1/2 rotate-45 bg-[#d2ab67] z-10" />

                    {/* Gilded double-mat frame: gold foil edge + navy mat + image */}
                    <div
                      className="p-2 rounded-xl bg-gradient-to-br from-[#f3e0ae] via-[#d2ab67] to-[#7a5c2a]"
                      style={{
                        boxShadow:
                          "0 25px 60px -15px rgba(0,0,0,0.7), 0 0 90px -20px rgba(210,171,103,0.45)",
                      }}
                    >
                      <div className="p-2 rounded-lg bg-[#0a1638]">
                        <div className="rounded-md overflow-hidden">
                          {isVideo ? (
                            <video
                              src={mediaUrl}
                              className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
                              autoPlay
                              muted
                              loop
                              playsInline
                            />
                          ) : (
                            <img
                              src={mediaUrl}
                              alt={media?.alternativeText || item.Title}
                              className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative bg-white p-4 shadow-2xl rounded-md rotate-1">
                    <span className="absolute -top-2.5 -left-2.5 w-7 h-7 border-t-2 border-l-2 border-[#d2ab67] z-10" />
                    <span className="absolute -top-2.5 -right-2.5 w-7 h-7 border-t-2 border-r-2 border-[#d2ab67] z-10" />
                    <span className="absolute -bottom-2.5 -left-2.5 w-7 h-7 border-b-2 border-l-2 border-[#d2ab67] z-10" />
                    <span className="absolute -bottom-2.5 -right-2.5 w-7 h-7 border-b-2 border-r-2 border-[#d2ab67] z-10" />

                    <div className="border border-[#d2ab67]/60 rounded overflow-hidden shadow-inner">
                      {isVideo ? (
                        <video
                          src={mediaUrl}
                          className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                        />
                      ) : (
                        <img
                          src={mediaUrl}
                          alt={media?.alternativeText || item.Title}
                          className="w-full h-[240px] sm:h-[320px] md:h-[380px] lg:h-[420px] object-cover"
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* Text */}
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="w-1.5 h-1.5 rotate-45 bg-[#d2ab67]" />
                    <span className="h-px w-10 bg-gradient-to-r from-[#d2ab67] to-transparent" />
                    <span
                      className={`playfair text-xs font-semibold uppercase tracking-[0.3em] ${
                        isDark ? "text-[#d2ab67]" : "text-[#8a6a2f]"
                      }`}
                    >
                      {chapter}
                    </span>
                  </div>

                  <h3
                    className={`playfair font-bold leading-none mb-6 ${
                      isDark
                        ? "text-[#d2ab67] drop-shadow-[0_0_35px_rgba(210,171,103,0.35)]"
                        : "text-[#1a2b5c]"
                    }`}
                    style={{ fontSize: "clamp(52px, 16vw, 140px)" }}
                  >
                    {item.Year}
                  </h3>

                  <h2
                    className={`playfair text-3xl md:text-4xl font-bold tracking-wide mb-4 ${
                      isDark ? "text-white" : "text-[#1a2b5c]"
                    }`}
                  >
                    {item.Title}
                  </h2>

                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="h-px w-14 bg-gradient-to-r from-transparent via-[#d2ab67] to-[#d2ab67]" />
                    <span className="w-1 h-1 rotate-45 bg-[#d2ab67]/60" />
                    <span className="w-2.5 h-2.5 rotate-45 border-2 border-[#d2ab67] bg-transparent" />
                    <span className="w-1 h-1 rotate-45 bg-[#d2ab67]/60" />
                    <span className="h-px w-14 bg-gradient-to-l from-transparent via-[#d2ab67] to-[#d2ab67]" />
                  </div>

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