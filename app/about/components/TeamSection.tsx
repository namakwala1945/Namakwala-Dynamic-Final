"use client";

import Image from "next/image";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Globe } from "lucide-react";
import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";
import GoldCorners from "./GoldCorners";

interface Props {
  members: any[];
}

const socialIconMap: Record<string, typeof Globe> = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  linkedin: Linkedin,
  youtube: Youtube,
};

export default function TeamSection({
  members,
}: Props) {

  if (!members?.length) return null;

  return (

    <section className="py-12 sm:py-16 md:py-24">

      <div className="text-center mb-10 sm:mb-16">

        <span className="inline-block rounded-full bg-[#0d1b4c] text-[#d2ab67] px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] mb-4 shadow-md">
          Our People
        </span>

        <h2 className="text-3xl sm:text-4xl md:text-5xl playfair font-bold">

          Leadership Team

        </h2>

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-10">

        {members.map((member) => {

          const SocialIcon = member.SocialMedia?.SocialName
            ? socialIconMap[member.SocialMedia.SocialName.toLowerCase()] ?? Globe
            : null;

          const socialHref = member.SocialMedia?.SocialLink
            ? member.SocialMedia.SocialLink.startsWith("http")
              ? member.SocialMedia.SocialLink
              : `https://${member.SocialMedia.SocialLink}`
            : null;

          return (

            <div
              key={member.id}
              className="relative transition-all duration-300 hover:-translate-y-2"
            >

              <GoldCorners />

              <div className="bg-[#f5efe0] border border-[#d2ab67]/40 rounded-2xl overflow-hidden shadow-xl">

                <div className="relative h-[300px] sm:h-[360px] md:h-[420px]">

                  <Image
                    src={
                      member.Image?.length
                        ? getStrapiMedia(
                            member.Image[0].url
                          )
                        : "/optimized/placeholder-large.webp"
                    }
                    alt={member.Name}
                    fill
                    className="object-cover"
                  />

                </div>

                <div className="p-6 sm:p-8">

                  <h3 className="text-2xl font-bold playfair">

                    {member.Name}

                  </h3>

                  <div className="flex items-center justify-between my-4">

                    <p className="text-[#8a6a2f] font-semibold">

                      {member.Designation}

                    </p>

                    {SocialIcon && socialHref && (
                      <a
                        href={socialHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={member.SocialMedia.SocialName}
                      >
                        <SocialIcon className="w-5 h-5 text-gray-500 hover:text-[#d2ab67] transition-colors" />
                      </a>
                    )}

                  </div>

                  <div className="rich-content">

                    <ContentRenderer
                      content={member.AboutPerson}
                    />

                  </div>

                </div>

              </div>

            </div>

          );

        })}

      </div>

    </section>

  );

}