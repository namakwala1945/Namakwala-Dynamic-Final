"use client";

import {
  useRef,
  useState,
  useEffect,
} from "react";

import ContentRenderer from "@/components/ContentRenderer";
import MediaRenderer from "./MediaRenderer";

interface Props {
  items: any[];
}

export default function TimelineSection({
  items,
}: Props) {
  if (!items?.length) return null;

  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  const scrollToSection = (index: number) => {
    refs.current[index]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setActive(index);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const index = Number(
            entry.target.getAttribute("data-index")
          );

          setActive(index);
        });
      },
      {
        threshold: 0.5,
      }
    );

    refs.current.forEach((item) => {
      if (item) observer.observe(item);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24">

      <div className="grid lg:grid-cols-12 gap-12">

        {/* Left Navigation */}

        <div className="lg:col-span-2">

          <div className="sticky top-32 space-y-2">

            {items.map((item, index) => (

              <button
                key={item.id}
                onClick={() => scrollToSection(index)}
                className={`block w-full text-left px-5 py-4 border-l-4 transition-all duration-300

                ${
                  active === index
                    ? "bg-[#d2ab67] text-white border-[#d2ab67]"
                    : "border-gray-300 hover:bg-[#d2ab67] hover:text-white"
                }`}
              >
                {item.Year}
              </button>

            ))}

          </div>

        </div>

        {/* Right Content */}

        <div className="lg:col-span-10 space-y-32">

          {items.map((item, index) => (

            <div
              key={item.id}
              data-index={index}
              ref={(el) => {
                refs.current[index] = el;
              }}
              className="grid lg:grid-cols-2 gap-16 items-center"
            >

              {/* Media */}

              <MediaRenderer
                media={item.Image_Video}
              />

              {/* Content */}

              <div>

                <span className="inline-block text-[#d2ab67] text-lg font-semibold mb-3">

                  {item.Year}

                </span>

                <h2 className="text-5xl playfair font-bold mb-8">

                  {item.Title}

                </h2>

                <div className="rich-content">

                  <ContentRenderer
                    content={item.Description}
                  />

                </div>

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}