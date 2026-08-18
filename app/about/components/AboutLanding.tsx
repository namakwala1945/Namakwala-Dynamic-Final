"use client";

import Image from "next/image";
import Link from "next/link";
import { getStrapiMedia } from "@/lib/media";
import GoldCorners from "./GoldCorners";

export default function AboutLanding({
  pages,
}: {
  pages: any[];
}) {
  return (
    <section className="w-auto bg-[#d2ab67] px-4 xl:py-20 md:py-20 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Cards */}
        <div className="grid mt-10 gap-10 md:grid-cols-2 lg:grid-cols-3">
          {pages.map((page) => {

            const coverImage =
              page?.CoverImage?.url
                ? getStrapiMedia(page.CoverImage.url)
                : "/optimized/placeholder-large.webp";

            return (

              <Link
                key={page.id}
                href={`/about/${page.Slug}`}
                className="group relative block transition-all duration-500 hover:-translate-y-2"
              >

                <GoldCorners />

                <div className="overflow-hidden rounded-2xl bg-[#f5efe0] border border-[#d2ab67]/40 shadow-lg group-hover:shadow-2xl transition-shadow duration-500">

                  {/* Image */}

                  <div className="relative h-64 overflow-hidden">

                    <Image
                      src={coverImage}
                      alt={page.Title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                    />

                  </div>

                  {/* Content */}

                  <div className="p-8">

                    <span className="inline-block rounded-full bg-[#0d1b4c] text-[#d2ab67] px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] mb-4 shadow-md">
                      Our Story
                    </span>

                    <h2 className="text-2xl playfair font-extrabold text-gradient mb-4">
                      {page.Title}
                    </h2>

                    <p className="text-gray-600 leading-7 line-clamp-4">
                      {page.Excerpt ||
                        "Learn more about this chapter of Namakwala's legacy and discover the values, vision and journey behind our continued growth."}
                    </p>

                    <div className="mt-8">

                      <span className="inline-flex items-center font-semibold text-primary group-hover:translate-x-2 transition-transform">

                        Read More

                        <svg
                          className="ml-2 h-5 w-5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>

                      </span>

                    </div>

                  </div>

                </div>

              </Link>

            );
          })}

        </div>
      </div>
    </section>
  );
}