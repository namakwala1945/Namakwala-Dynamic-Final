"use client";

import Image from "next/image";
import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";

interface Props {
  members: any[];
}

export default function TeamSection({ members }: Props) {
  if (!members?.length) return null;

  return (
    <section className="relative overflow-hidden bg-[#fff] py-20 lg:py-28">
      {/* Decorative Background */}
      <div className="pointer-events-none absolute -left-32 top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 bottom-10 h-96 w-96 rounded-full bg-black/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="mx-auto mb-14 max-w-3xl text-center lg:mb-20">
          <span className="mb-4 inline-flex items-center gap-3 text-sm font-bold uppercase tracking-[0.3em] text-[#2b2926]">
            <span className="h-px w-10 bg-[#2b2926]" />
            Our People
            <span className="h-px w-10 bg-[#2b2926]" />
          </span>

          <h2 className="playfair text-4xl font-bold leading-tight text-[#1f1d1a] sm:text-5xl lg:text-6xl">
            Leadership Team
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-[#3f3a34] sm:text-lg">
            Meet the people whose experience, vision and dedication continue
            to shape our journey and drive our commitment to excellence.
          </p>

          <div className="mx-auto mt-7 flex items-center justify-center gap-2">
            <span className="h-1 w-1 rounded-full bg-[#1f1d1a]" />
            <span className="h-1 w-16 rounded-full bg-[#1f1d1a]" />
            <span className="h-1 w-1 rounded-full bg-[#1f1d1a]" />
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-10">
          {members.map((member) => {
            const imageUrl = member.Image?.length
              ? getStrapiMedia(member.Image[0].url)
              : "/images/team-placeholder.webp";

            return (
              <article
                key={member.id}
                className="group overflow-hidden border border-[rgb(210 171 103]/10 bg-white shadow-[0_15px_40px_rgba(0,0,0,0.10)] transition-all duration-500 hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
              >
                {/* Image */}
                <div className="relative h-[420px] overflow-hidden bg-[#f3f0eb] sm:h-[440px]">
                  <Image
                    src={imageUrl}
                    alt={member.Name || "Leadership team member"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                  />

                  {/* Image Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-70" />

                  {/* Gold Accent */}
                  <div className="absolute bottom-0 left-0 h-1 w-0 bg-[#d2ab67] transition-all duration-500 group-hover:w-full" />
                </div>

                {/* Content */}
                <div className="relative p-7 sm:p-8">
                  {/* Decorative Gold Line */}
                  <div className="absolute left-8 top-0 h-1 w-12 -translate-y-1/2 bg-[#d2ab67]" />

                  <h3 className="playfair text-2xl font-bold leading-tight text-[#1f1d1a] sm:text-3xl">
                    {member.Name}
                  </h3>

                  <p className="mt-3 text-sm font-bold uppercase tracking-[0.15em] text-[#b18a45]">
                    {member.Designation}
                  </p>

                  <div className="mt-5 h-px w-full bg-[#e9e5df]" />

                  <div className="rich-content mt-5 line-clamp-4 text-[15px] leading-7 text-[#625d57]">
                    <ContentRenderer content={member.AboutPerson} />
                  </div>

                  {/* Bottom Accent */}
                  <div className="mt-6 flex items-center gap-2">
                    <span className="h-[2px] w-8 bg-[#d2ab67]" />
                    <span className="h-1.5 w-1.5 rounded-full bg-[#d2ab67]" />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}