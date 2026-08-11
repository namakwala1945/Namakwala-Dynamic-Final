"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { getStrapiMedia } from "@/lib/media";

interface MediaFile {
  url: string;
  alternativeText?: string;
}

interface MediaItem {
  title: string;
  url?: string;
  media?: MediaFile[];
}

interface MediaType {
  id: number;
  title: string;
  Media: MediaItem[];
}

interface NewsMediaTabsProps {
  mediaTypes: MediaType[];
}

export default function NewsMediaTabs({
  mediaTypes = [],
}: NewsMediaTabsProps) {
  const [activeTab, setActiveTab] = useState(mediaTypes[0]?.id ?? 0);
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const activeMedia = useMemo(() => {
    const type = mediaTypes.find((t) => t.id === activeTab);

    if (!type) return [];

    return (
      type.Media?.flatMap((m) => {
        const items: any[] = [];

        // External URL
        if (m.url) {
          items.push({
            type: "video",
            url: m.url,
            title: m.title || "Video",
            isYoutube: true,
          });
        }

        // Uploaded Media
        if (m.media?.length) {
          m.media.forEach((file) => {
            const fixedUrl = getStrapiMedia(file.url);

            const lowerUrl = fixedUrl?.toLowerCase() || "";

            const isVideo =
              lowerUrl.includes(".mp4") ||
              lowerUrl.includes(".webm") ||
              lowerUrl.includes(".mov") ||
              lowerUrl.includes(".ogg");

            items.push({
              type: isVideo ? "video" : "image",
              url: fixedUrl,
              title:
                file.alternativeText ||
                m.title ||
                "Untitled",
              isYoutube: false,
            });
          });
        }

        return items;
      }) || []
    );
  }, [mediaTypes, activeTab]);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setIsOpen(true);
  };

  const nextMedia = () =>
    setCurrentIndex(
      (prev) => (prev + 1) % activeMedia.length
    );

  const prevMedia = () =>
    setCurrentIndex(
      (prev) =>
        (prev - 1 + activeMedia.length) %
        activeMedia.length
    );

  const getYouTubeID = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
    );

    return match ? match[1] : null;
  };

  return (
    <div className="w-full">
      {/* Tabs */}
      <div className="flex justify-center flex-wrap gap-4 mb-8">
        {mediaTypes.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setCurrentIndex(0);
              setIsOpen(false);
            }}
            className={`px-6 py-2 rounded-full font-semibold transition-all ${
              activeTab === tab.id
                ? "bg-[#ab8c30] text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab.title}
          </button>
        ))}
      </div>

      {/* Grid */}
      {activeMedia.length === 0 ? (
        <div className="text-center py-10">
          No media available
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeMedia.map((item, idx) => {
            const youtubeId = item.isYoutube
              ? getYouTubeID(item.url)
              : null;

            return (
              <div
                key={idx}
                onClick={() => openLightbox(idx)}
                className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer aspect-video bg-black"
              >
                {/* YouTube */}
                {item.isYoutube && youtubeId && (
                  <>
                    <Image
                      src={`https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`}
                      alt={item.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />

                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-4">
                        ▶
                      </div>
                    </div>
                  </>
                )}

                {/* Uploaded Video */}
                {!item.isYoutube &&
                  item.type === "video" && (
                    <>
                      <video
                        className="w-full h-full object-cover"
                        preload="metadata"
                        muted
                      >
                        <source
                          src={item.url}
                          type="video/mp4"
                        />
                      </video>

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-4 text-white text-2xl">
                          ▶
                        </div>
                      </div>
                    </>
                  )}

                {/* Image */}
                {item.type === "image" && (
                  <Image
                    src={item.url}
                    alt={item.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                )}

                <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-center p-2">
                  {item.title}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && activeMedia[currentIndex] && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-5 right-5 text-white text-4xl"
          >
            ×
          </button>

          <button
            onClick={prevMedia}
            className="absolute left-5 text-white text-4xl"
          >
            ←
          </button>

          <button
            onClick={nextMedia}
            className="absolute right-5 text-white text-4xl"
          >
            →
          </button>

          <div className="max-w-6xl w-full">
            {activeMedia[currentIndex].type ===
            "image" ? (
              <Image
                src={activeMedia[currentIndex].url}
                alt={activeMedia[currentIndex].title}
                width={1400}
                height={900}
                className="w-full h-auto object-contain"
                unoptimized
              />
            ) : activeMedia[currentIndex]
                .isYoutube ? (
              <iframe
                src={`https://www.youtube.com/embed/${getYouTubeID(
                  activeMedia[currentIndex].url
                )}`}
                className="w-full h-[75vh]"
                allowFullScreen
              />
            ) : (
              <video
                src={activeMedia[currentIndex].url}
                controls
                autoPlay
                className="w-full h-[75vh] object-contain"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
