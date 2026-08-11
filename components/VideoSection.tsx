"use client";
import { useState } from "react";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import businessMeeting from "../public/optimized/business-meeting-large.webp";
import Image from "next/image";

const videos = [
  {
    id: 1,
    title: "Our Manufacturing Process",
    description:
      "See how we maintain quality standards in our state-of-the-art facilities",
    thumbnail: businessMeeting,
    duration: "3:45",
    category: "Manufacturing",
  },
  {
    id: 2,
    title: "Quality Control Standards",
    description:
      "Learn about our rigorous quality testing and certification processes",
    thumbnail:
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=600&h=400&fit=crop",
    duration: "2:30",
    category: "Quality",
  },
  {
    id: 3,
    title: "Global Export Network",
    description:
      "Discover how we deliver Indian products to customers worldwide",
    thumbnail:
      "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=600&h=400&fit=crop",
    duration: "4:15",
    category: "Logistics",
  },
  {
    id: 4,
    title: "Customer Success Stories",
    description:
      "Hear from our international clients about their experience with us",
    thumbnail:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    duration: "5:20",
    category: "Testimonials",
  },
  {
    id: 5,
    title: "Sustainable Practices",
    description:
      "Our commitment to environmental responsibility and ethical sourcing",
    thumbnail:
      "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
    duration: "3:10",
    category: "Sustainability",
  },
];

export default function VideoSection() {
  const [currentVideo, setCurrentVideo] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  const nextVideo = () => {
    setCurrentVideo((prev) => (prev + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentVideo((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handlePlayVideo = (videoId: number) => {
    setPlayingVideo(videoId);
    // In a real implementation, you would handle video playback here
    setTimeout(() => setPlayingVideo(null), 2000); // Simulate video loading
  };

  return (
    <section className="section-padding bg-gradient-to-b from-muted/30 to-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">See Us in Action</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get an inside look at our operations, quality processes, and the
            people behind our success
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Main Video Player */}
          <div className="relative">
            <div className="relative overflow-hidden shadow-2xl group">
              <Image
                src={videos[currentVideo].thumbnail}
                alt={videos[currentVideo].title}
                width={800}
                height={500}
                className="w-full h-64 md:h-80 object-cover"
              />

              {/* Video Overlay */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <button
                  onClick={() => handlePlayVideo(videos[currentVideo].id)}
                  className="bg-white/90 backdrop-blur-sm rounded-full p-6 hover:bg-white hover:scale-110 transition-all duration-300 group-hover:scale-105"
                  disabled={playingVideo === videos[currentVideo].id}
                >
                  {playingVideo === videos[currentVideo].id ? (
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Play className="w-8 h-8 text-primary ml-1" />
                  )}
                </button>
              </div>

              {/* Video Info */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  {videos[currentVideo].title}
                </h3>
                <p className="text-white/90 mb-2">
                  {videos[currentVideo].description}
                </p>
                <div className="flex items-center gap-4">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                    {videos[currentVideo].duration}
                  </span>
                  <span className="bg-primary/80 px-3 py-1 rounded-full text-sm">
                    {videos[currentVideo].category}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <button
              onClick={prevVideo}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white hover-lift shadow-lg"
            >
              <ChevronLeft className="w-6 h-6 text-primary" />
            </button>
            <button
              onClick={nextVideo}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-full p-3 hover:bg-white hover-lift shadow-lg"
            >
              <ChevronRight className="w-6 h-6 text-primary" />
            </button>
          </div>

          {/* Video List */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold mb-6">More Videos</h3>
            {videos.map((video, index) => (
              <div
                key={video.id}
                onClick={() => setCurrentVideo(index)}
                className={`flex gap-4 p-4 cursor-pointer transition-all duration-300 hover-lift ${
                  index === currentVideo
                    ? "bg-primary/10 border-2 border-primary/20"
                    : "bg-white border border-border hover:bg-muted/50"
                }`}
              >
                <div className="relative flex-shrink-0">
                  <Image
                    src={video.thumbnail}
                    alt={video.title}
                    width={70}
                    height={30}
                    className="w-full h-[100%] object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                  </div>
                  <span className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 rounded">
                    {video.duration}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-semibold mb-1 truncate ${
                      index === currentVideo
                        ? "text-primary"
                        : "text-foreground"
                    }`}
                  >
                    {video.title}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                    {video.description}
                  </p>
                  <span className="inline-block bg-muted px-2 py-1 rounded text-xs text-muted-foreground">
                    {video.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8">
            <h3 className="text-2xl font-bold mb-4">Want to See More?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our channel for the latest updates on our products,
              processes, and success stories
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg">
                Subscribe to Channel
              </Button>
              <Button variant="export" size="lg">
                Schedule Virtual Tour
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
