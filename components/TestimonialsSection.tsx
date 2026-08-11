"use client";
import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const testimonials = [
  {
    id: 1,
    name: "Michael Chen",
    company: "Global Spice Trading Co.",
    country: "United States",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Working with this Indian export company has been exceptional. Their spices are of the highest quality, and their logistics support is outstanding. We've been importing from them for 3 years now.",
    products: ["Spices", "Condiments"],
    partnership: "3 years"
  },
  {
    id: 2,
    name: "Sarah Johnson",
    company: "European Textiles Ltd.",
    country: "United Kingdom",
    flag: "🇬🇧",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The quality of Indian textiles we receive is consistently excellent. Their attention to detail and commitment to delivery schedules has made them our preferred supplier.",
    products: ["Textiles", "Apparel"],
    partnership: "5 years"
  },
  {
    id: 3,
    name: "Hiroshi Tanaka",
    company: "Asia Pacific Imports",
    country: "Japan",
    flag: "🇯🇵",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Their tea selection is remarkable. The authentic flavors and premium packaging have helped us establish a strong market presence in Japan. Highly recommended!",
    products: ["Tea", "Beverages"],
    partnership: "2 years"
  },
  {
    id: 4,
    name: "Emma Schmidt",
    company: "German Import Solutions",
    country: "Germany",
    flag: "🇩🇪",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Professional service from start to finish. Their handicrafts and jewelry collections are authentic and well-crafted. The export documentation is always perfect.",
    products: ["Handicrafts", "Jewelry"],
    partnership: "4 years"
  },
  {
    id: 5,
    name: "Ahmed Al-Rashid",
    company: "Middle East Trading House",
    country: "UAE",
    flag: "🇦🇪",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "Excellent business partnership. Their understanding of international markets and ability to customize products for our region has been invaluable to our success.",
    products: ["Multiple Categories"],
    partnership: "6 years"
  },
  {
    id: 6,
    name: "Lisa Anderson",
    company: "Australian Imports Co.",
    country: "Australia",
    flag: "🇦🇺",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    text: "The best Indian export partner we've worked with. Their product range is extensive, quality is consistent, and their customer service is exceptional.",
    products: ["Spices", "Textiles"],
    partnership: "2 years"
  }
];

const stats = [
  { label: "Client Satisfaction", value: "98%", color: "text-green-600" },
  { label: "On-time Delivery", value: "99.5%", color: "text-blue-600" },
  { label: "Quality Rating", value: "4.9/5", color: "text-yellow-600" },
  { label: "Repeat Customers", value: "95%", color: "text-purple-600" }
];

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [visibleTestimonials, setVisibleTestimonials] = useState(3);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="section-padding bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Client Testimonials</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from our satisfied international clients about their experience with our export services
          </p>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-white p-6 hover-lift shadow-lg">
                <div className={`text-3xl md:text-4xl font-bold mb-2 ${stat.color}`}>
                  {stat.value}
                </div>
                <div className="text-muted-foreground font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Featured Testimonial */}
        <div className="mb-12">
          <div className="relative bg-white p-8 md:p-12 shadow-xl max-w-4xl mx-auto">
            <Quote className="absolute top-6 left-6 w-12 h-12 text-primary/20" />
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <Image
                    src={testimonials[currentTestimonial].image}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover shadow-lg"
                    priority
                    fill
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {Array.from({ length: testimonials[currentTestimonial].rating }).map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  
                  <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed italic">
                    "{testimonials[currentTestimonial].text}"
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className="text-2xl">{testimonials[currentTestimonial].flag}</span>
                      <h4 className="text-xl font-bold">{testimonials[currentTestimonial].name}</h4>
                    </div>
                    <p className="text-primary font-semibold">{testimonials[currentTestimonial].company}</p>
                    <p className="text-sm text-muted-foreground">
                      Partnership: {testimonials[currentTestimonial].partnership} • 
                      Products: {testimonials[currentTestimonial].products.join(", ")}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-primary/10 hover:bg-primary hover:text-white rounded-full p-3 transition-all duration-300"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-primary/10 hover:bg-primary hover:text-white rounded-full p-3 transition-all duration-300"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentTestimonial ? "bg-primary scale-125" : "bg-muted"
                }`}
              />
            ))}
          </div>
        </div>

        {/* All Testimonials Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.slice(0, visibleTestimonials).map((testimonial, index) => (
            <div
              key={testimonial.id}
              className="export-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center gap-4 mb-4">
                <Image
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full object-cover"
                  priority
                  fill
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-lg">{testimonial.flag}</span>
                    <h4 className="font-bold">{testimonial.name}</h4>
                  </div>
                  <p className="text-sm text-primary font-semibold">{testimonial.company}</p>
                  <div className="flex mt-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                </div>
              </div>
              
              <p className="text-muted-foreground text-sm mb-4 line-clamp-4">
                "{testimonial.text}"
              </p>
              
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground">
                  Partnership: {testimonial.partnership}
                </p>
                <div className="flex flex-wrap gap-1">
                  {testimonial.products.map((product) => (
                    <span
                      key={product}
                      className="bg-primary/10 text-primary px-2 py-1 rounded text-xs"
                    >
                      {product}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleTestimonials < testimonials.length && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setVisibleTestimonials(testimonials.length)}
            >
              View All Testimonials
            </Button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
            <h3 className="text-2xl font-bold mb-4">Join Our Success Stories</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Become part of our growing family of satisfied international clients. Experience the quality and service that sets us apart.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Start Your Partnership
              </Button>
              <Button variant="export" size="lg">
                Schedule Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}