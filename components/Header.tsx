"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiMenu, FiX, FiChevronDown, FiChevronUp } from "react-icons/fi";
import menuItems from "../locales/en/headerMenu.json";
import LanguageSelector from "./Language";
import CustomCursor from "./Cursor";

interface MenuCategory {
  title: string;
  slug: string;
  categories?: { title: string; slug: string }[];
}

interface MenuItem {
  name: string;
  link?: string;
  megamenu?: boolean;
  content?: MenuCategory[];
}

export default function Header() {
  const [aboutPages, setAboutPages] = useState<any[]>([]);

  useEffect(() => {
    async function loadAboutPages() {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-pages?fields[0]=Title&fields[1]=Slug`;

        const res = await fetch(apiUrl, {
          cache: "no-store",
        });

        if (!res.ok) return;

        const json = await res.json();

        const pages = (json.data || []).sort(
          (a: any, b: any) =>
            a.Title.localeCompare(b.Title, "en", {
              numeric: true,
              sensitivity: "base",
            })
        );

        setAboutPages(pages);
      } catch {
        // silently keep the previous/empty about-pages list
      }
    }

    loadAboutPages();
  }, []);
  const [fixed, setFixed] = useState(false);
  const [active, setActive] = useState<number | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [mobileSubOpen, setMobileSubOpen] = useState<
    Record<number, boolean>
  >({});

  const [mobileInnerOpen, setMobileInnerOpen] = useState<
    Record<string, boolean>
  >({});

  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => setFixed(window.scrollY > 10);

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const open = (i: number) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    setActive(i);
  };

  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);

    closeTimer.current = setTimeout(() => setActive(null), 120);
  };

  const toggleMobileSub = (i: number) =>
    setMobileSubOpen((p) => ({
      ...p,
      [i]: !p[i],
    }));

  const toggleMobileInner = (
    outerIndex: number,
    innerIndex: number
  ) => {
    const key = `${outerIndex}-${innerIndex}`;

    setMobileInnerOpen((p) => ({
      ...p,
      [key]: !p[key],
    }));
  };

  // Close mobile menu
  const handleLinkClick = () => setMobileOpen(false);

  // Alphabetical Sort Function
  const sortAlphabetically = <T extends Record<string, any>>(
    arr: T[] = [],
    key: keyof T = "title" as keyof T
  ) => {
    return [...arr].sort((a, b) => {
      const first = String(a[key] || "").trim().toLowerCase();
      const second = String(b[key] || "").trim().toLowerCase();
  
      return first.localeCompare(second, "en", {
        numeric: true,
        sensitivity: "base",
      });
    });
  };
  const sortedAboutPages = aboutPages;
  return (
    <header
      className={`z-50 transition-all duration-300 py-1 poppins
      ${
        fixed
          ? "md:fixed md:top-0 md:left-0 md:w-full md:bg-white md:shadow-lg"
          : "md:absolute md:w-full md:bg-gradient-to-r md:from-white/70 md:via-black/50 md:to-white/10 md:backdrop-blur-xs"
      } bg-white md:bg-transparent`}
    >
      <CustomCursor />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center">

        {/* Logo */}
        <div className="flex-shrink-0">

          <Link href="/" onClick={handleLinkClick}>

            <Image
              src="/namakwala-logo.png"
              alt="Namakwala"
              width={90}
              height={90}
              sizes="90px"
              quality={90}
              priority
              className="object-contain"
            />

          </Link>

        </div>

        {/* Desktop nav */}
        <nav
          className={`hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 items-center gap-3 lg:gap-6 text-sm lg:text-base whitespace-nowrap ${
            fixed ? "text-black" : "text-white"
          }`}
          onMouseLeave={scheduleClose}
        >
          {menuItems.map((item, i) => (

            <div
              key={`desktop-${i}`}
              onMouseEnter={() =>
                item.megamenu ? open(i) : setActive(null)
              }
              className="cursor-pointer"
            >

              {item.megamenu ? (

                <span
                  className={`px-1 py-2 select-none ${
                    active === i ? "text-primary" : ""
                  }`}
                >
                  {item.name}
                </span>

              ) : (

                <Link
                  href={item.link || "#"}
                  className={`px-1 py-2 hover:text-primary ${
                    active === i ? "text-primary" : ""
                  }`}
                  onClick={handleLinkClick}
                >
                  {item.name}
                </Link>

              )}
            </div>
          ))}
        </nav>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3">

          {/* <LanguageSelector /> */}

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <FiX size={24} />
            ) : (
              <FiMenu size={24} />
            )}
          </button>

        </div>
      </div>

      {/* Desktop Mega Menu */}
      {active !== null && menuItems?.[active]?.megamenu && (

        <div
          className="absolute text-black inset-x-0 top-full bg-white shadow-xl border-t"
          onMouseEnter={() => open(active)}
          onMouseLeave={scheduleClose}
        >

          <div className="max-w-7xl mx-auto px-4 lg:px-4 py-6 flex justify-center gap-12 flex-wrap">

            {sortAlphabetically(
              menuItems[active].content
            ).map((section, secIdx) => (

              <div
                key={`section-${active}-${secIdx}`}
                className="min-w-[220px] text-center"
              >

                <Link
                  href={`/${section.slug}`}
                  className="block text-1xl uppercase mb-4 font-bold"
                  onClick={handleLinkClick}
                >
                  {section.title}
                </Link>

                <ul className="space-y-2">

                  {section.slug?.toLowerCase() === "about" ? (

                    sortedAboutPages.map((page) => (

                      <li key={page.id}>

                        <Link
                          href={`/about/${page.Slug}`}
                          className="block text-sm capitalize hover:text-primary transition-colors"
                          onClick={handleLinkClick}
                        >
                          {page.Title}
                        </Link>

                      </li>

                    ))

                  ) : (

                    sortAlphabetically(
                    section.categories ?? []
                    ).map((cat) => (

                      <li key={cat.slug}>

                        <Link
                          href={`/${section.slug}#${cat.slug}`}
                          className="block text-sm capitalize hover:text-primary transition-colors"
                          onClick={handleLinkClick}
                        >
                          {cat.title}
                        </Link>

                      </li>

                    ))

                  )}

                </ul>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed inset-0 z-50 bg-white text-black shadow-lg overflow-auto transition-transform duration-300 transform ${
          mobileOpen
            ? "translate-y-0"
            : "-translate-y-full"
        }`}
      >

        {/* Mobile Header */}
        <div className="flex items-center justify-between px-4 pt-4 pb-2 border-b">

          <div className="flex-shrink-0">

            <Link href="/" onClick={handleLinkClick}>

              <Image
                src="/namakwala-logo.png"
                alt="Namakwala"
                width={90}
                height={90}
                className="object-contain"
              />

            </Link>

          </div>

          <div>

            <button
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="p-2"
            >
              <FiX size={28} />
            </button>

          </div>
        </div>

        {/* Mobile Menu Items */}
        <div className="pt-4 px-4 space-y-3">

          {menuItems.map((item, i) => (

            <div key={`mobile-${i}`}>

              <div className="flex items-center justify-between">

                {item.megamenu ? (

                  <button
                    type="button"
                    className="block py-2 font-semibold text-left w-full"
                    onClick={() => toggleMobileSub(i)}
                  >
                    {item.name}
                  </button>

                ) : (

                  <Link
                    href={item.link || "#"}
                    className="block py-2 font-semibold"
                    onClick={handleLinkClick}
                  >
                    {item.name}
                  </Link>

                )}

                {item.megamenu && (

                  <button
                    aria-label="Open menu"
                    className="p-1"
                    onClick={() => toggleMobileSub(i)}
                  >
                    {mobileSubOpen[i] ? (
                      <FiChevronUp size={20} />
                    ) : (
                      <FiChevronDown size={20} />
                    )}
                  </button>

                )}
              </div>

              {/* Mobile Submenu */}
              {item.megamenu && mobileSubOpen[i] && (

                <div className="pl-4 pt-2 space-y-2">

                  {(() => {
                    const sections = sortAlphabetically(item.content ?? []);

                    // A megamenu with only one section (e.g. "About") has
                    // nothing to disambiguate — skip the redundant nested
                    // section header/toggle and show its links directly.
                    if (sections.length === 1) {
                      const section = sections[0];

                      const links =
                        section.slug === "about"
                          ? sortedAboutPages.map((page) => (
                              <Link
                                key={page.id}
                                href={`/about/${page.Slug}`}
                                className="block text-sm capitalize py-1"
                                onClick={handleLinkClick}
                              >
                                {page.Title}
                              </Link>
                            ))
                          : sortAlphabetically(
                              section.categories ?? []
                            ).map((cat) => (
                              <Link
                                key={cat.slug}
                                href={`/${section.slug}#${cat.slug}`}
                                className="block text-sm capitalize py-1"
                                onClick={handleLinkClick}
                              >
                                {cat.title}
                              </Link>
                            ));

                      return links;
                    }

                    return sections.map((section, secIdx) => (

                      <div key={`mob-section-${i}-${secIdx}`}>

                        <div className="flex items-center justify-between">

                          <Link
                            href={`/${section.slug}`}
                            className="block text-1xl uppercase mb-2"
                            onClick={handleLinkClick}
                          >
                            {section.title}
                          </Link>

                          {(section.slug === "about" ||
                            section.categories?.length) &&  (

                              <button
                                aria-label="Open submenu"
                                className="p-1"
                                onClick={() =>
                                  toggleMobileInner(i, secIdx)
                                }
                              >
                                {mobileInnerOpen[
                                  `${i}-${secIdx}`
                                ] ? (
                                  <FiChevronUp size={18} />
                                ) : (
                                  <FiChevronDown size={18} />
                                )}
                              </button>

                            )}
                        </div>

                        {(section.slug === "about" ||
                          section.categories?.length) &&
                          mobileInnerOpen[`${i}-${secIdx}`] && (

                            <div className="pl-4 pt-1 space-y-1">

                              {section.slug === "about" ? (

                                sortedAboutPages.map((page) => (

                                  <Link
                                    key={page.id}
                                    href={`/about/${page.Slug}`}
                                    className="block text-sm capitalize"
                                    onClick={handleLinkClick}
                                  >
                                    {page.Title}
                                  </Link>

                                ))

                              ) : (

                                sortAlphabetically(
                                section.categories ?? []
                                ).map((cat) => (

                                  <Link
                                    key={`${i}-${secIdx}-${cat.slug}`}
                                    href={`/${section.slug}#${cat.slug}`}
                                    className="block text-sm capitalize"
                                    onClick={handleLinkClick}
                                  >
                                    {cat.title}
                                  </Link>

                                ))

                              )}

                            </div>

                        )}
                      </div>
                    ));
                  })()}
                </div>

              )}
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}