"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  Navigation,
  Pagination,
  Autoplay,
} from "swiper/modules";

import { getStrapiMedia } from "@/lib/media";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

interface Props {
  media?: any[];
}

export default function MediaRenderer({
  media = [],
}: Props) {

  if (!media?.length) return null;

  // -----------------
  // Single Media
  // -----------------

  if (media.length === 1) {

    const item = media[0];

    const url = getStrapiMedia(item.url);

    if (
      item.mime?.startsWith("video")
    ) {

      return (

        <video
          controls
          autoPlay
          muted
          loop
          playsInline
          className="w-full  shadow-xl"
        >

          <source
            src={url}
            type={item.mime}
          />

        </video>

      );

    }

    return (

      <div className="relative overflow-hidden w-full h-full min-h-[320px]  shadow-xl">

        <Image
          src={url}
          alt={
            item.alternativeText ||
            "Image"
          }
          fill
          className="object-cover"
        />

      </div>

    );

  }

  // -----------------
  // Multiple Media
  // -----------------

  return (

    <Swiper
      className="h-full min-h-[320px]"
      modules={[
        Navigation,
        Pagination,
        Autoplay,
      ]}
      navigation
      pagination={{
        clickable: true,
      }}
      autoplay={{
        delay: 3500,
      }}
      loop
      spaceBetween={20}
    >

      {media.map((item) => {

        const url = getStrapiMedia(
          item.url
        );

        return (

          <SwiperSlide key={item.id} className="h-full">

            {item.mime?.startsWith(
              "video"
            ) ? (

              <video
                controls
                className="w-full h-full object-cover "
              >

                <source
                  src={url}
                  type={item.mime}
                />

              </video>

            ) : (

              <div className="relative w-full h-full  overflow-hidden">

                <Image
                  src={url}
                  alt={
                    item.alternativeText ||
                    "Image"
                  }
                  fill
                  className="object-cover"
                />

              </div>

            )}

          </SwiperSlide>

        );

      })}

    </Swiper>

  );

}