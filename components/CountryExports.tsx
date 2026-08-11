"use client";
import { useState } from "react";
import { Globe, TrendingUp, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import globalReach from "../public/optimized/global-reach-large.webp";
import Image from "next/image";

const regions = [
  {
    name: "North America",
    countries: ["United States", "Canada", "Mexico"],
    growth: "+25%",
    volume: "$2.3M",
    color: "bg-blue-500",
  },
  {
    name: "Europe",
    countries: ["Germany", "United Kingdom", "France", "Netherlands", "Italy"],
    growth: "+18%",
    volume: "$1.8M",
    color: "bg-green-500",
  },
  {
    name: "Asia Pacific",
    countries: ["Japan", "Australia", "Singapore", "South Korea"],
    growth: "+32%",
    volume: "$1.5M",
    color: "bg-purple-500",
  },
  {
    name: "Middle East",
    countries: ["UAE", "Saudi Arabia", "Qatar", "Kuwait"],
    growth: "+40%",
    volume: "$1.2M",
    color: "bg-orange-500",
  },
];

const topCountries = [
  {
    country: "United States",
    flag: "🇺🇸",
    volume: "$850K",
    growth: "+22%",
    products: ["Spices", "Textiles", "Tea"],
    clients: 45,
  },
  {
    country: "Germany",
    flag: "🇩🇪",
    volume: "$620K",
    growth: "+19%",
    products: ["Handicrafts", "Jewelry", "Spices"],
    clients: 32,
  },
  {
    country: "Japan",
    flag: "🇯🇵",
    volume: "$580K",
    growth: "+35%",
    products: ["Tea", "Spices", "Textiles"],
    clients: 28,
  },
  {
    country: "United Kingdom",
    flag: "🇬🇧",
    volume: "$445K",
    growth: "+15%",
    products: ["Textiles", "Handicrafts", "Tea"],
    clients: 24,
  },
  {
    country: "UAE",
    flag: "🇦🇪",
    volume: "$520K",
    growth: "+42%",
    products: ["Jewelry", "Spices", "Textiles"],
    clients: 38,
  },
  {
    country: "Australia",
    flag: "🇦🇺",
    volume: "$380K",
    growth: "+28%",
    products: ["Spices", "Tea", "Handicrafts"],
    clients: 19,
  },
];

const stats = [
  { icon: Globe, label: "Countries Served", value: "50+" },
  { icon: TrendingUp, label: "Annual Growth", value: "25%" },
  { icon: MapPin, label: "Export Volume", value: "$8.2M" },
  { icon: Users, label: "International Clients", value: "200+" },
];

export default function CountryExports() {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Global Reach</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Proudly serving customers across 50+ countries with authentic Indian
            products and reliable export services
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-6 hover-lift shadow-lg">
                <div className="bg-primary/10 rounded-full p-3 w-fit mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-primary" />
                </div>
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* World Map Visual */}
        <div className="relative mb-12 overflow-hidden">
          <Image
            src={globalReach}
            alt="Global Export Network"
            className="w-full h-64 md:h-96 object-cover"
          />
          <div className="absolute inset-0 hero-gradient opacity-80 flex items-center justify-center">
            <div className="text-center text-white">
              <h3 className="text-3xl md:text-4xl font-bold mb-4">
                Connecting India to the World
              </h3>
              <p className="text-lg md:text-xl mb-6">
                Reliable export partnerships across continents
              </p>
              <Button  aria-label="View Export Map" variant="hero" size="lg">
                View Export Map
              </Button>
            </div>
          </div>
        </div>

        {/* Regional Overview */}
        {/* <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {regions.map((region, index) => (
            <div
              key={index}
              className={`export-card cursor-pointer transition-all duration-300 ${
                selectedRegion === region.name
                  ? "ring-2 ring-primary scale-105"
                  : ""
              }`}
              onClick={() =>
                setSelectedRegion(
                  selectedRegion === region.name ? null : region.name
                )
              }
            >
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-4 h-4 rounded-full ${region.color}`}></div>
                <h3 className="text-lg font-bold">{region.name}</h3>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Export Volume</span>
                  <span className="font-bold text-primary">
                    {region.volume}
                  </span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Growth Rate</span>
                  <Badge
                    variant="outline"
                    className="text-green-600 border-green-600"
                  >
                    {region.growth}
                  </Badge>
                </div>

                <div>
                  <span className="text-muted-foreground text-sm">
                    Key Markets:
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {region.countries.slice(0, 3).map((country) => (
                      <Badge
                        key={country}
                        variant="secondary"
                        className="text-xs"
                      >
                        {country}
                      </Badge>
                    ))}
                    {region.countries.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{region.countries.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div> */}

        {/* Top Countries */}
        {/* <div>
          <h3 className="text-3xl font-bold text-center mb-8">
            <span className="text-gradient">Top Export Destinations</span>
          </h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topCountries.map((country, index) => (
              <div key={index} className="export-card">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-4xl">{country.flag}</span>
                  <div>
                    <h4 className="text-lg font-bold">{country.country}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold text-primary">
                        {country.volume}
                      </span>
                      <Badge
                        variant="outline"
                        className="text-green-600 border-green-600"
                      >
                        {country.growth}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      Active Clients
                    </span>
                    <span className="font-semibold">{country.clients}</span>
                  </div>

                  <div>
                    <span className="text-muted-foreground text-sm">
                      Top Products:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {country.products.map((product) => (
                        <Badge
                          key={product}
                          variant="secondary"
                          className="text-xs"
                        >
                          {product}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div> */}

        {/* Call to Action */}
        {/* <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
            <h3 className="text-2xl font-bold mb-4">
              Ready to Import from India?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Join our network of satisfied international clients. We'll help
              you find the perfect Indian products for your market.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Start Importing
              </Button>
              <Button variant="export" size="lg">
                Contact Regional Office
              </Button>
            </div>
          </div>
        </div> */}
      </div>
    </section>
  );
}
