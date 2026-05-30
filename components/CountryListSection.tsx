"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type CountryWithCount = {
  id: number;
  Name: string;
  Slug: string;
  blogCount: number;
};

export default function CountryListSection() {
  const [countries, setCountries] = useState<
    CountryWithCount[]
  >([]);

  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);

  const [mobileIndex, setMobileIndex] = useState(0);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL;

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `${STRAPI_URL}/api/blogs?populate[country][populate]=*&pagination[pageSize]=5000`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        const blogs = result?.data || [];

        const countryMap: Record<
          string,
          {
            id: number;
            Name: string;
            Slug: string;
            blogCount: number;
          }
        > = {};

        blogs.forEach((blog: any) => {
          const country = blog?.country;

          if (!country) return;

          if (!countryMap[country.Slug]) {
            countryMap[country.Slug] = {
              id: country.id,
              Name: country.Name,
              Slug: country.Slug,
              blogCount: 1,
            };
          } else {
            countryMap[country.Slug].blogCount += 1;
          }
        });

        const formattedCountries = Object.values(
          countryMap
        ).sort((a, b) =>
          a.Name.localeCompare(b.Name)
        );

        setCountries(formattedCountries);
      } catch (error) {
        console.error(
          "Error fetching countries:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [STRAPI_URL]);

  useEffect(() => {
    if (countries.length === 0) return;

    const interval = setInterval(() => {
      setMobileIndex((prev) =>
        prev === countries.length - 1
          ? 0
          : prev + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, [countries]);

  const totalPages = Math.ceil(
    countries.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentCountries = countries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const nextMobile = () => {
    setMobileIndex((prev) =>
      prev === countries.length - 1
        ? 0
        : prev + 1
    );
  };

  const prevMobile = () => {
    setMobileIndex((prev) =>
      prev === 0
        ? countries.length - 1
        : prev - 1
    );
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-gray-500">
        Loading Countries...
      </div>
    );
  }

  if (!countries.length) {
    return null;
  }

  return (
    <section className="section-padding bg-gradient-to-b from-[#f7f7f7] to-[#ffffff] poppins py-20 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold playfair mb-4">
            <span className="primary-text">
              Worldwide Presence
            </span>
          </h2>

          <p className="text-[#5f7392] max-w-4xl mx-auto text-base sm:text-lg leading-relaxed">
            Namakwala supplies premium minerals,
            salt products, and industrial solutions
            worldwide with trusted quality,
            export expertise, and market-focused
            insights.
          </p>
        </div>

        {/* MOBILE */}
        <div className="block lg:hidden">
          <div className="relative">

            <button
              onClick={prevMobile}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
            >
              <FiChevronLeft size={24} />
            </button>

            <Link
              href={`/${countries[mobileIndex]?.Slug}`}
            >
              <div className="bg-white p-4 text-center shadow-xl border border-gray-100 mx-10">
                <div className="text-5xl font-bold primary-text mb-4">
                  {countries[mobileIndex]?.blogCount}+
                </div>

                <h4 className="text-[#5f7392] text-sm font-semibold">
                  {countries[mobileIndex]?.Name}
                </h4>

                <div className="mt-5 w-16 h-[2px] bg-[#b8922e] mx-auto"></div>
              </div>
            </Link>

            <button
              onClick={nextMobile}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg p-2 rounded-full"
            >
              <FiChevronRight size={24} />
            </button>

          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:block">

          <div className="grid grid-cols-5 gap-6">

            {currentCountries.map((country) => (
              <Link
                key={country.id}
                href={`/${country.Slug}`}
                className="group"
              >
                <div className="relative bg-white p-4 text-center shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 overflow-hidden">

                  <div className="text-5xl font-bold primary-text mb-4">
                    {country.blogCount}+
                  </div>

                  <h4 className="text-[#5f7392] text-sm font-semibold group-hover:primary-text transition-colors duration-300">
                    {country.Name}
                  </h4>

                  <div className="mt-5 w-0 group-hover:w-16 h-[2px] bg-[#b8922e] mx-auto transition-all duration-500"></div>

                </div>
              </Link>
            ))}

          </div>

          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev > 1 ? prev - 1 : prev
                  )
                }
                disabled={currentPage === 1}
                className="px-4 py-2 bg-white border border-gray-300 shadow-md disabled:opacity-40"
              >
                Prev
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => {
                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`w-10 h-10 border shadow-md ${
                        currentPage === page
                          ? "bg-[#b8922e] text-white border-[#b8922e]"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              <button
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev < totalPages
                      ? prev + 1
                      : prev
                  )
                }
                disabled={
                  currentPage === totalPages
                }
                className="px-4 py-2 bg-white border border-gray-300 shadow-md disabled:opacity-40"
              >
                Next
              </button>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}