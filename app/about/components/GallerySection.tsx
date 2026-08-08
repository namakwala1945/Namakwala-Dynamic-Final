"use client";

import MediaRenderer from "./MediaRenderer";

interface Props {
  media?: any[];
}

export default function GallerySection({
  media = [],
}: Props) {

  if (!media.length) return null;

  return (

    <section className="py-20">

      <div className="max-w-7xl mx-auto">

        <MediaRenderer
          media={media}
        />

      </div>

    </section>

  );

}