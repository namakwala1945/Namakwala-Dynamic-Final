"use client";

import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import BrandSection from "@/components/BrandSection";
import NamakwalaCare from "@/components/NamakwalaCare";
import Foundation from "@/components/foundation";
import BusinessSection from "@/components/business";
import LifeAtNamakwala from "@/components/LifeAtNamakwala";

// ✅ Dynamically import GSAP scroll section (client-only)
const ScrollImageSection = dynamic(() => import("@/components/ScollZoomSection"), {
  ssr: false,
});

export default function HomePage() {
  return (
    <div className="min-h-screen cursor-none">
      <HeroSection />
      <NamakwalaCare />
      <BusinessSection />

      {/* ✅ Wrap in hydration-safe container */}
      <div suppressHydrationWarning>
        <ScrollImageSection />
      </div>

      <Foundation />
      <BrandSection />
      <LifeAtNamakwala />
    </div>
  );
}
