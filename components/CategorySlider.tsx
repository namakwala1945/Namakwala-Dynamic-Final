"use client";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import categories from "../locales/en/categoryProduct.json";
import Image from "next/image";

export default function CategorySlider() {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(4);

  // Update itemsPerView based on window width
  useEffect(() => {
    const updateItems = () => {
      if (window.innerWidth >= 1024) setItemsPerView(4); // lg
      else if (window.innerWidth >= 768) setItemsPerView(2); // md
      else setItemsPerView(1); // sm
    };

    updateItems();
    window.addEventListener("resize", updateItems);
    return () => window.removeEventListener("resize", updateItems);
  }, []);

  const nextSlide = () => {
    if (startIndex < categories.length - itemsPerView) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <section className="section-padding bg-gradient-to-b from-white to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Product Categories</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our extensive range of premium Indian products, carefully curated for international markets
          </p>
        </div>

        <div className="relative">
          {/* Navigation Buttons */}
          {categories.length > itemsPerView && (
            <>
              <button
                 aria-label="Pre Arrow"
                onClick={prevSlide}
                disabled={startIndex === 0}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>

              <button
                 aria-label="Next Arrow"
                onClick={nextSlide}
                disabled={startIndex >= categories.length - itemsPerView}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg rounded-full p-3 disabled:opacity-50 disabled:cursor-not-allowed hover-lift"
              >
                <ChevronRight className="w-6 h-6 text-primary" />
              </button>
            </>
          )}

          <div className="overflow-hidden mx-4 md:mx-12">
            <div
              className={`flex transition-transform duration-500 ease-in-out gap-6 ${
                categories.length <= itemsPerView ? "justify-center" : ""
              }`}
              style={{
                transform:
                  categories.length > itemsPerView
                    ? `translateX(-${startIndex * (100 / itemsPerView)}%)`
                    : "none",
              }}
            >
              {categories.map((category) => (
                <div
                  key={category.id}
                  className={`flex-shrink-0 w-full sm:w-1/2 lg:w-1/4 group`}
                >
                  <div className="export-card h-full overflow-hidden group-hover:scale-105 transition-transform duration-300">
                    <div className="relative overflow-hidden mb-4">
                      <Image
                        src={category.image}
                        alt={category.name}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                        priority
                        fill
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        {category.description}
                      </p>
                      <p className="text-primary font-semibold">
                        {category.products}
                      </p>
                      <Button
                       aria-label="View Products"
                        variant="outline"
                        className="w-full mt-4 group-hover:border-primary"
                      >
                        View Products
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Indicators */}
        {categories.length > itemsPerView && (
          <div className="flex justify-center mt-8 gap-2">
            {Array.from({
              length: Math.ceil(categories.length - itemsPerView + 1),
            }).map((_, index) => (
              <button
               aria-label="Round"
                key={index}
                onClick={() => setStartIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === startIndex ? "bg-primary scale-125" : "bg-muted"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
