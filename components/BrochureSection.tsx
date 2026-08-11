import { Download, FileText, Globe, Star, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const brochures = [
  {
    id: 1,
    title: "Complete Product Catalog 2024",
    description: "Comprehensive guide featuring all our premium Indian export products with detailed specifications and pricing.",
    pages: 120,
    size: "15.2 MB",
    language: "English",
    updated: "March 2024",
    category: "Product Catalog",
    downloads: "2.5K+",
    thumbnail: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=500&fit=crop",
    featured: true
  },
  {
    id: 2,
    title: "Spices & Condiments Guide",
    description: "Detailed information about our authentic Indian spices, their origins, quality grades, and export specifications.",
    pages: 45,
    size: "8.7 MB",
    language: "English",
    updated: "February 2024",
    category: "Spices",
    downloads: "1.8K+",
    thumbnail: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=500&fit=crop"
  },
  {
    id: 3,
    title: "Textile & Apparel Collection",
    description: "Showcase of premium Indian textiles including silk, cotton, and traditional fabrics with quality certifications.",
    pages: 68,
    size: "12.3 MB",
    language: "English",
    updated: "January 2024",
    category: "Textiles",
    downloads: "1.2K+",
    thumbnail: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=400&h=500&fit=crop"
  },
  {
    id: 4,
    title: "Handicrafts & Jewelry Portfolio",
    description: "Exquisite collection of handcrafted items and traditional jewelry pieces that represent Indian artistry.",
    pages: 52,
    size: "10.1 MB",
    language: "English",
    updated: "March 2024",
    category: "Handicrafts",
    downloads: "950+",
    thumbnail: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=500&fit=crop"
  },
  {
    id: 5,
    title: "Export Services Guide",
    description: "Complete overview of our export services, logistics solutions, quality certifications, and global reach.",
    pages: 32,
    size: "6.8 MB",
    language: "English",
    updated: "February 2024",
    category: "Services",
    downloads: "1.5K+",
    thumbnail: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=500&fit=crop"
  },
  {
    id: 6,
    title: "Quality & Certification Manual",
    description: "Detailed documentation of our quality control processes, international certifications, and compliance standards.",
    pages: 28,
    size: "5.2 MB",
    language: "English",
    updated: "January 2024",
    category: "Quality",
    downloads: "890+",
    thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=500&fit=crop"
  }
];

const languages = ["English", "German", "French", "Spanish", "Japanese", "Arabic"];

const stats = [
  { icon: FileText, label: "Digital Brochures", value: "25+" },
  { icon: Download, label: "Total Downloads", value: "10K+" },
  { icon: Globe, label: "Languages Available", value: "6" },
  { icon: Users, label: "Active Subscribers", value: "500+" }
];

export default function BrochureSection() {
  const featuredBrochure = brochures.find(b => b.featured);
  const regularBrochures = brochures.filter(b => !b.featured);

  return (
    <section className="relative section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Download Resources</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Access our comprehensive collection of product catalogs, guides, and resources to make informed export decisions
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
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Brochure */}
        {featuredBrochure && (
          <div className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8 export-card overflow-hidden">
              <div className="relative">
                <Image
                  src={featuredBrochure.thumbnail}
                  alt={featuredBrochure.title}
                  className="w-full h-64 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
                  priority
                  fill
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Featured
                </Badge>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2">
                  <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                </div>
              </div>
              
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <Badge variant="outline" className="w-fit mb-4">
                  {featuredBrochure.category}
                </Badge>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  {featuredBrochure.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {featuredBrochure.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-muted/50">
                    <FileText className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-semibold">{featuredBrochure.pages} Pages</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50">
                    <Download className="w-5 h-5 mx-auto mb-1 text-primary" />
                    <div className="text-sm font-semibold">{featuredBrochure.downloads}</div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-3 mb-6 text-sm text-muted-foreground">
                  <div className="flex justify-between">
                    <span>File Size:</span>
                    <span className="font-semibold">{featuredBrochure.size}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Language:</span>
                    <span className="font-semibold">{featuredBrochure.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Last Updated:</span>
                    <span className="font-semibold">{featuredBrochure.updated}</span>
                  </div>
                </div>
                
                <Button  aria-label="Download Now" variant="hero" size="lg" className="group">
                  <Download className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                  Download Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Language Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-bold mb-4 text-center">Available Languages</h3>
          <div className="flex flex-wrap justify-center gap-3">
            {languages.map((language) => (
              <Button
                aria-label={language}
                key={language}
                variant="outline"
                size="sm"
                className="rounded-full hover:bg-primary hover:text-primary-foreground"
              >
                <Globe className="w-3 h-3 mr-2" />
                {language}
              </Button>
            ))}
          </div>
        </div>

        {/* Brochures Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {regularBrochures.map((brochure, index) => (
            <div
              key={brochure.id}
              className="export-card group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden mb-4">
                <Image
                  src={brochure.thumbnail}
                  alt={brochure.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  priority
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <Badge className="absolute top-3 left-3 bg-white/90 text-foreground">
                  {brochure.category}
                </Badge>
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 text-xs font-semibold">
                  {brochure.downloads}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-bold group-hover:text-primary transition-colors line-clamp-2">
                  {brochure.title}
                </h3>
                
                <p className="text-muted-foreground text-sm line-clamp-3">
                  {brochure.description}
                </p>
                
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{brochure.pages} pages</span>
                  <span>{brochure.size}</span>
                  <span>{brochure.updated}</span>
                </div>
                
                <Button aria-label="Download" className="w-full group-hover:bg-primary group-hover:text-primary-foreground" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter Subscription */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Get Latest Resources</h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Subscribe to receive new product catalogs, market reports, and exclusive resources directly in your inbox
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-6">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button aria-label="Subscribe" variant="hero" className="px-8">
              Subscribe
            </Button>
          </div>
          
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span>Monthly Updates</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>500+ Subscribers</span>
            </div>
          </div>
        </div>

        {/* Contact for Custom Brochures */}
        <div className="text-center mt-8">
          <p className="text-muted-foreground mb-4">
            Need a custom brochure for your specific requirements?
          </p>
          <Button aria-label="Request Custom Brochure" variant="export" size="lg">
            Request Custom Brochure
          </Button>
        </div>
      </div>
    </section>
  );
}