"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Globe, TrendingUp, Shield } from "lucide-react";
import Image from "next/image";
import YearsOfExcellence from "./YearsOfExcellence";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/media"; // ✅ added

const features = [
  { icon: Globe, text: "21+ Countries" },
  { icon: TrendingUp, text: <YearsOfExcellence /> },
  { icon: Shield, text: "ISO Certified" },
];

interface HeroBannerData {
  id: number;
  title: string;
  subtitle: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  imageUrl: string;
  bannerPosition?: string;
}

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [banners, setBanners] = useState<HeroBannerData[]>([]);

  useEffect(() => {
    async function fetchBanners() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/home-banners?populate=*`
        );
        const data = await res.json();

        if (!data.data) return;

        const mapped = data.data
          .map((item: any) => {
            const desc =
              item.description
                ?.map((block: any) =>
                  block.children?.map((c: any) => c.text).join(" ")
                )
                .join(" ") || "";

            // ✅ use getStrapiMedia here
            const imageUrl = getStrapiMedia(item.image?.url) || "/optimized/placeholder-large.webp";

            return {
              id: item.id,
              title: item.title,
              subtitle: item.subtitle,
              description: desc,
              buttonText: item.buttonText,
              buttonLink: item.buttonLink,
              bannerPosition: item.bannerPositions,
              imageUrl,
            };
          })
          .sort((a: HeroBannerData, b: HeroBannerData) =>
            (a.bannerPosition || "0").localeCompare(b.bannerPosition || "0")
          );

        setBanners(mapped);
      } catch (err) {
        console.error("Error fetching banners:", err);
      }
    }

    fetchBanners();
  }, []);

  // Slider interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(
        (prev) => (banners.length ? (prev + 1) % banners.length : 0)
      );
    }, 5000);
    return () => clearInterval(timer);
  }, [banners]);

  const nextSlide = () =>
    setCurrentSlide((prev) => (banners.length ? (prev + 1) % banners.length : 0));
  const prevSlide = () =>
    setCurrentSlide((prev) =>
      banners.length ? (prev - 1 + banners.length) % banners.length : 0
    );

  return (
    <section className="relative h-[90vh] overflow-hidden">
      {/* Background Slider */}
      <div className="absolute inset-0 top-0">
        {banners.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl} // ✔ now optimized URL
              alt={slide.title || "Banner"}
              fill
              className="object-cover"
              priority
              quality={70}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              placeholder="blur"
              blurDataURL="/optimized/placeholder-large.webp"
            />
            <h1> Namakwala </h1>
            <div className="absolute inset-0 hero-gradient opacity-80"></div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center mt-5 poppins">
        <div className="w-[95%] mx-auto px-4 md:px-8 lg:px-12 mt-5">
          <div className="max-w-6xl mt-5">
            {banners.map((slide, index) => (
              <div
                key={slide.id}
                className={`transition-opacity duration-700 ease-in-out transform ${
                  index === currentSlide
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 translate-x-8 absolute"
                }`}
              >
                <h2 className="text-accent text-lg md:text-lg font-semibold mb-2 animate-fade-in">
                  {slide.subtitle}
                </h2>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight playfair">
                  {slide.title}
                </h1>
                {slide.description && (
                  <p className="text-md md:text-1xl text-white/90 mb-8 max-w-2xl leading-relaxed">
                    {slide.description}
                  </p>
                )}
                {slide.buttonText && slide.buttonLink && (
                  <div className="flex flex-col sm:flex-row gap-4 mb-12">
                    <Button
                      aria-label={slide.buttonText}
                      variant="export"
                      size="lg"
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-base px-6 py-3 rounded-lg bg-transparent text-white border border-white hover:bg-white/10 transition"
                    >
                      <Link href={slide.buttonLink}>{slide.buttonText}</Link>
                    </Button>
                  </div>
                )}
              </div>
            ))}

            {/* Features */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-2 text-white rounded-md min-w-[140px] sm:min-w-[auto]"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent flex-shrink-0" />
                  {typeof feature.text === "object" ? (
                    <span className="font-light flex flex-col sm:flex-row items-center gap-1 text-sm sm:text-base">
                      {feature.text} <span>Years of Excellence</span>
                    </span>
                  ) : (
                    <span className="font-light text-sm sm:text-base">{feature.text}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 backdrop-blur-sm rounded-full p-3 text-white hover:bg-white/30 transition-all duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
        {banners.map((_, index) => (
          <button
            key={index}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? "bg-accent scale-125" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
