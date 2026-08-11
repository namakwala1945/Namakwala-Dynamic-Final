// pages/resources/gallery.tsx
import React from "react";
import Head from "next/head";
import Image from "next/image";

const images = [
  "/images/gallery1-large.webp",
  "/images/gallery2-large.webp",
  "/images/gallery3-large.webp",
];

const GalleryPage: React.FC = () => {
  return (
    <>
      <Head>
        <title>Gallery - Your Company</title>
      </Head>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold mb-4">Gallery</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((src, idx) => (
            <Image key={idx} src={src} alt={`Gallery ${idx + 1}`} className="w-full h-48 object-cover shadow-md" priority
                    fill/>
          ))}
        </div>
      </div>
    </>
  );
};

export default GalleryPage;
