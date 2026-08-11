"use client";

import { useState } from "react";

export default function CatalogueClient({ page }: any) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const catalogues = page.items || [];

  const closeModal = () => setSelectedIndex(null);
  const nextPdf = () =>
    setSelectedIndex((prev) => (prev! + 1) % catalogues.length);
  const prevPdf = () =>
    setSelectedIndex((prev) =>
      prev! === 0 ? catalogues.length - 1 : prev! - 1
    );

  return (
    <div className="container mx-auto px-6 py-12 text-center">
      <h1 className="text-5xl md:text-5xl playfair font-extrabold text-gradient">
        {page.title}
      </h1>
      <p className="text-lg leading-relaxed mb-8">{page.description}</p>

      {/* ✅ Catalogue Display */}
      {catalogues.length === 1 ? (
        <div className="flex justify-center">
          <div className="w-full max-w-5xl h-[800px] border shadow-lg overflow-hidden">
            <iframe
              src={catalogues[0].file}
              className="w-full h-full"
              title={catalogues[0].title}
            />
          </div>
        </div>
      ) : (
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catalogues.map((cat: any, idx: number) => (
            <div
              key={idx}
              onClick={() => setSelectedIndex(idx)}
              className="group relative bg-white shadow-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300 rounded-lg"
            >
              {/* ✅ PDF Thumbnail / Preview */}
              <div className="h-[350px] overflow-hidden bg-gray-100">
                <iframe
                  src={`${cat.file}#toolbar=0&navpanes=0&scrollbar=0`}
                  className="w-full h-full pointer-events-none"
                  title={cat.title}
                />
              </div>

              {/* ✅ Overlay on Hover */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <p className="text-white text-lg font-medium">Click to View</p>
              </div>

              {/* ✅ Title Section */}
              <div className="p-4 text-left">
                <h2 className="text-lg font-semibold">{cat.title}</h2>
                <p className="text-gray-600 text-sm mt-1 truncate">
                  {cat.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ Full-screen Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 flex flex-col items-center justify-center transition-all duration-500">
          <div className="relative w-[90vw] h-[90vh] bg-white overflow-hidden shadow-lg">
            <iframe
              src={catalogues[selectedIndex].file}
              className="w-full h-full"
              title={catalogues[selectedIndex].title}
            />

            {catalogues.length > 1 && (
              <>
                <button
                  onClick={prevPdf}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                  ◀
                </button>
                <button
                  onClick={nextPdf}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 rounded-full p-2 hover:bg-white"
                >
                  ▶
                </button>
              </>
            )}
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 bg-red-500 text-white rounded-full p-2 hover:bg-red-600"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
