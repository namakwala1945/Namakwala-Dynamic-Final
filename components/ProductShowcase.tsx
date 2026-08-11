"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import productsImage from "../public/assets/salt-animation.gif";
import Image from "next/image";

const filters = ["All", "Salt", "Minerals"];
import products from "../locales/en/product.json";

export default function ProductShowcase() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [favorites, setFavorites] = useState<number[]>([]);

  const filteredProducts = products.filter(
    (product) => activeFilter === "All" || product.category === activeFilter
  );

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Featured Products</span>
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Explore our handpicked collection of premium Indian products, each
            representing the finest quality and craftsmanship
          </p>
        </div>

        {/* Showcase Image */}
        <div className="relative mb-12 overflow-hidden">
          <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] relative">
            <Image
              src={productsImage}
              alt="NAMAKWALA Exporter"
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 flex items-center justify-center px-4 text-center">
              <div className="text-white">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                  Premium Quality Guaranteed
                </h3>
                <p className="text-base sm:text-lg md:text-xl mb-6">
                  Every product is carefully selected and quality tested
                </p>
                <Button
                  variant="export"
                  size="lg"
                  className="hover-lift bg-transparent text-white border-white"
                >
                  View Catalog
                </Button>
              </div>
            </div>
          </div>
        </div>


        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-12">
          {filters.map((filter) => (
            <Button
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              onClick={() => setActiveFilter(filter)}
              className="rounded-full px-4 sm:px-6 py-2"
            >
              {filter}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.map((product, index) => (
            <div key={product.id} className="export-card group flex flex-col">
              <div className="relative overflow-hidden mb-4 w-full aspect-[4/3]">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />

                <Badge className="absolute top-3 left-3 bg-accent text-accent-foreground text-xs sm:text-sm">
                  {product.badge}
                </Badge>

                <button
                  onClick={() => toggleFavorite(product.id)}
                  className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
                >
                  <Heart
                    className={`w-4 h-4 sm:w-5 sm:h-5 ${
                      favorites.includes(product.id)
                        ? "text-red-500 fill-red-500"
                        : "text-gray-600"
                    }`}
                  />
                </button>

                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center px-2">
                  <Button variant="hero" size="sm">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Quick View
                  </Button>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-sm sm:text-base mb-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-yellow-400" />
                      <span className="font-medium">{product.rating}</span>
                    </div>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>

                  <p className="text-sm sm:text-base text-muted-foreground">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between mt-3">
                  <span className="text-lg sm:text-2xl font-bold text-primary">
                    {product.price}
                  </span>
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {product.category}
                  </Badge>
                </div>

                <Button className="w-full mt-3" variant="outline" size="sm">
                  Add to Inquiry
                </Button>
              </div>
            </div>
          ))}
        </div>


        {/* Call to Action */}
        <div className="text-center mt-12 flex flex-col sm:flex-row justify-center gap-4">
          <Button variant="hero" size="lg">
            View All Products
          </Button>
          <Button variant="export" size="lg">
            Request Catalog
          </Button>
        </div>
      </div>
    </section>
  );
}
