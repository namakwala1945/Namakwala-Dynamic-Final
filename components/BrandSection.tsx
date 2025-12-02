"use client";

import { Award, Star, Shield, Globe } from "lucide-react";
import Image from "next/image";
import BrandPromise from "./BrandPromise";
import YearsOfExcellence from "./YearsOfExcellence";
import Certifications from "./Certifications";
import { useEffect, useState } from "react";

interface Achievement {
  label: string;
  value: string;
}

export default function BrandSection() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch API
  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/global-reaches?populate=*`,
          { cache: "no-store" }
        );
        const json = await res.json();
        setData(json?.data?.[0]);
      } catch (error) {
        console.error("API Error:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-xl text-muted-foreground">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-20 text-xl text-red-500">
        Failed to load content.
      </div>
    );
  }

  // 🎯 Dynamic Data from API
  const title = data.title;
  const subtitle = data.description?.[0]?.children?.[0]?.text || "";
  const sections = data.common_sections || [];

  // Convert API structure → Achievement structure (for your UI)
  const achievements: Achievement[] = sections.map((item: any) => ({
    value: item.title, // e.g., "10+"
    label: item.subtitle, // e.g., "Quality Certifications"
  }));

  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background poppins">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 playfair">
            <span className="playfair font-bold text-gradient">{title}</span>
          </h2>

          <p className="text-muted-foreground max-w-md sm:max-w-2xl mx-auto text-sm sm:text-base">
            {subtitle}
          </p>
        </div>

        {/* Achievement Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-8 md:mb-12">
          {achievements.map((achievement, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-4 sm:p-6 hover-lift shadow-lg">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-1 sm:mb-2">
                  {/* If label matches, show dynamic YearsOfExcellence counter */}
                  {achievement.label === "Years of Excellence" ? (
                    <YearsOfExcellence />
                  ) : (
                    achievement.value
                  )}
                </div>

                <div className="text-sm sm:text-base text-muted-foreground font-medium">
                  {achievement.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certifications */}
        <Certifications />

        {/* Brand Promise */}
        <BrandPromise />
      </div>
    </section>
  );
}
