"use client";

import Image from "next/image";
import ContentRenderer from "@/components/ContentRenderer";
import { getStrapiMedia } from "@/lib/media";

interface Props {
  members: any[];
}

export default function TeamSection({
  members,
}: Props) {

  if (!members?.length) return null;

  return (

    <section className="py-24">

      <div className="text-center mb-16">

        <h2 className="text-5xl playfair font-bold">

          Leadership Team

        </h2>

      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-10">

        {members.map((member) => (

          <div
            key={member.id}
            className="bg-white rounded-xl overflow-hidden shadow-xl hover:-translate-y-2 transition"
          >

            <div className="relative h-[420px]">

              <Image
                src={
                  member.Image?.length
                    ? getStrapiMedia(
                        member.Image[0].url
                      )
                    : "/images/team-placeholder.webp"
                }
                alt={member.Name}
                fill
                className="object-cover"
              />

            </div>

            <div className="p-8">

              <h3 className="text-2xl font-bold">

                {member.Name}

              </h3>

              <p className="text-[#d2ab67] font-semibold my-4">

                {member.Designation}

              </p>

              <div className="rich-content">

                <ContentRenderer
                  content={member.AboutPerson}
                />

              </div>

            </div>

          </div>

        ))}

      </div>

    </section>

  );

}