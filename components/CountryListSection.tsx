"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";

type Country = {
  id: number;
  Name: string;
  Slug: string;
};

type Blog = {
  id: number;
  title: string;
  slug: string;
  country: {
    id: number;
    Name: string;
    Slug: string;
  };
};

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

  // Desktop Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Mobile Slider
  const [mobileIndex, setMobileIndex] = useState(0);

  const STRAPI_URL =
    process.env.NEXT_PUBLIC_STRAPI_URL;

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    async function fetchData() {
      try {
        // =========================
        // FETCH COUNTRIES
        // =========================
        const countryRes = await fetch(
          `${STRAPI_URL}/api/countries?pagination[pageSize]=500`,
          {
            cache: "force-cache",
            next: { revalidate: 3600 },
          }
        );

        // =========================
        // FETCH BLOGS
        // =========================
        const blogRes = await fetch(
          `${STRAPI_URL}/api/blogs?populate=country&pagination[pageSize]=500`,
          {
            cache: "force-cache",
            next: { revalidate: 3600 },
          }
        );

        const countryData = await countryRes.json();
        const blogData = await blogRes.json();

        const countries: Country[] =
          countryData?.data || [];

        const blogs: Blog[] =
          blogData?.data || [];

        // =========================
        // BLOG COUNT MAP
        // =========================
        const blogCountMap: Record<number, number> =
          {};

        blogs.forEach((blog) => {
          const countryId = blog?.country?.id;

          if (countryId) {
            blogCountMap[countryId] =
              (blogCountMap[countryId] || 0) + 1;
          }
        });

        // =========================
        // MERGE + FILTER + SORT
        // =========================
        const formattedCountries:
          CountryWithCount[] = countries
          .map((country) => ({
            ...country,
            blogCount:
              blogCountMap[country.id] || 0,
          }))
          .filter(
            (country) => country.blogCount > 0
          )
          .sort((a, b) =>
            a.Name.localeCompare(b.Name)
          );

        setCountries(formattedCountries);
      } catch (error) {
        console.error(
          "Error fetching countries/blogs:",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [STRAPI_URL]);

  // ===================================
  // MOBILE AUTO SLIDE
  // ===================================
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

  // ===================================
  // DESKTOP PAGINATION
  // ===================================
  const totalPages = Math.ceil(
    countries.length / ITEMS_PER_PAGE
  );

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const currentCountries = countries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  // ===================================
  // MOBILE SLIDER NAVIGATION
  // ===================================
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

  return (
    <section className="section-padding bg-gradient-to-b from-[#f7f7f7] to-[#ffffff] poppins py-20 overflow-hidden">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8">

        {/* ===================================== */}
        {/* HEADING */}
        {/* ===================================== */}
        <div className="text-center mb-12">

          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold playfair mb-4">

            <span className="primary-text">
              Worldwide Presence
            </span>

          </h2>

          <p className="text-[#5f7392] max-w-4xl mx-auto text-base sm:text-lg leading-relaxed">

          Namakwala supplies premium minerals, salt products, and industrial solutions worldwide with trusted quality, export expertise, and market-focused insights.

          </p>

        </div>

        {/* ===================================== */}
        {/* MOBILE SLIDER */}
        {/* ===================================== */}
        <div className="block lg:hidden">

          <div className="relative">

            {/* LEFT ARROW */}
            <button
              aria-label="Previous Country"
              onClick={prevMobile}
              className="
                absolute
                left-0
                top-1/2
                -translate-y-1/2
                z-10
                bg-white
                shadow-lg
                p-2
                rounded-full
              "
            >
              <FiChevronLeft size={24} />
            </button>

            {/* SLIDE */}
            <Link
              href={`/${countries[mobileIndex]?.Slug}`}
            >

              <div
                className="
                  bg-white
                  p-4
                  text-center
                  shadow-xl
                  border
                  border-gray-100
                  transition-all
                  duration-500
                  mx-10
                "
              >

                {/* COUNT */}
                <div className="text-5xl font-bold primary-text mb-4">

                  {countries[mobileIndex]?.blogCount}+

                </div>

                {/* COUNTRY */}
                <h4 className="text-[#5f7392] text-sm font-semibold">

                  {countries[mobileIndex]?.Name}

                </h4>

                {/* LINE */}
                <div className="mt-5 w-16 h-[2px] bg-[#b8922e] mx-auto"></div>

              </div>

            </Link>

            {/* RIGHT ARROW */}
            <button
              aria-label="Next Country"
              onClick={nextMobile}
              className="
                absolute
                right-0
                top-1/2
                -translate-y-1/2
                z-10
                bg-white
                shadow-lg
                p-2
                rounded-full
              "
            >
              <FiChevronRight size={24} />
            </button>

          </div>

        </div>

        {/* ===================================== */}
        {/* DESKTOP GRID */}
        {/* ===================================== */}
        <div className="hidden lg:block">

          {/* COUNTRY GRID */}
          <div className="grid grid-cols-5 gap-6">

            {currentCountries.map((country) => (

              <Link
                key={country.id}
                href={`/${country.Slug}`}
                className="group"
              >

                <div
                  className="
                    relative
                    bg-white
                    p-4
                    text-center
                    shadow-xl
                    hover:shadow-2xl
                    transition-all
                    duration-500
                    hover:-translate-y-2
                    border
                    border-gray-100
                    overflow-hidden
                  "
                >

                  {/* COUNT */}
                  <div className="text-5xl font-bold primary-text mb-4">

                    {country.blogCount}+

                  </div>

                  {/* COUNTRY NAME */}
                  <h4 className="text-[#5f7392] text-sm font-semibold group-hover:primary-text transition-colors duration-300">

                    {country.Name}

                  </h4>

                  {/* HOVER LINE */}
                  <div className="mt-5 w-0 group-hover:w-16 h-[2px] bg-[#b8922e] mx-auto transition-all duration-500"></div>

                </div>

              </Link>

            ))}

          </div>

          {/* ===================================== */}
          {/* PAGINATION */}
          {/* ===================================== */}
          {totalPages > 1 && (

            <div className="flex justify-center items-center gap-3 mt-12 flex-wrap">

              {/* PREV */}
              <button
                aria-label="Previous Page"
                onClick={() =>
                  setCurrentPage((prev) =>
                    prev > 1 ? prev - 1 : prev
                  )
                }
                disabled={currentPage === 1}
                className="
                  px-4
                  py-2
                  bg-white
                  border
                  border-gray-300
                  shadow-md
                  hover:bg-[#b8922e]
                  hover:text-white
                  transition-all
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >
                Prev
              </button>

              {/* PAGE NUMBERS */}
              {Array.from(
                { length: totalPages },
                (_, index) => {

                  const page = index + 1;

                  return (
                    <button
                      key={page}
                      aria-label={`Page ${page}`}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`
                        w-10
                        h-10
                        shadow-md
                        border
                        transition-all
                        ${
                          currentPage === page
                            ? "bg-[#b8922e] text-white border-[#b8922e]"
                            : "bg-white border-gray-300 hover:bg-[#b8922e] hover:text-white"
                        }
                      `}
                    >
                      {page}
                    </button>
                  );
                }
              )}

              {/* NEXT */}
              <button
                aria-label="Next Page"
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
                className="
                  px-4
                  py-2
                  bg-white
                  border
                  border-gray-300
                  shadow-md
                  hover:bg-[#b8922e]
                  hover:text-white
                  transition-all
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
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