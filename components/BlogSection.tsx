import { Calendar, Clock, ArrowRight, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const blogPosts = [
  {
    id: 1,
    title: "5 Key Trends in Indian Spice Exports for 2024",
    excerpt: "Discover the latest trends shaping the Indian spice export industry and how they impact global markets.",
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=400&fit=crop",
    category: "Market Insights",
    author: "Priya Sharma",
    date: "March 15, 2024",
    readTime: "5 min read",
    featured: true
  },
  {
    id: 2,
    title: "Understanding Export Documentation: A Complete Guide",
    excerpt: "Navigate the complex world of export documentation with our comprehensive guide for new exporters.",
    image: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=600&h=400&fit=crop",
    category: "Export Guide",
    author: "Rajesh Kumar",
    date: "March 12, 2024",
    readTime: "8 min read",
    featured: false
  },
  {
    id: 3,
    title: "Sustainable Packaging in International Trade",
    excerpt: "How eco-friendly packaging is revolutionizing the export industry and meeting global sustainability goals.",
    image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop",
    category: "Sustainability",
    author: "Anjali Patel",
    date: "March 10, 2024",
    readTime: "6 min read",
    featured: false
  },
  {
    id: 4,
    title: "Quality Control Standards for Indian Textiles",
    excerpt: "Learn about the rigorous quality standards that make Indian textiles globally competitive.",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e1?w=600&h=400&fit=crop",
    category: "Quality Assurance",
    author: "Vikram Singh",
    date: "March 8, 2024",
    readTime: "7 min read",
    featured: false
  },
  {
    id: 5,
    title: "Digital Transformation in Export Business",
    excerpt: "How technology is streamlining export processes and creating new opportunities for Indian businesses.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    category: "Technology",
    author: "Neha Gupta",
    date: "March 5, 2024",
    readTime: "4 min read",
    featured: false
  },
  {
    id: 6,
    title: "Building Long-term International Partnerships",
    excerpt: "Strategies for developing lasting relationships with international buyers and distributors.",
    image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop",
    category: "Business Strategy",
    author: "Arjun Reddy",
    date: "March 3, 2024",
    readTime: "6 min read",
    featured: false
  }
];

const categories = ["All", "Market Insights", "Export Guide", "Sustainability", "Quality Assurance", "Technology", "Business Strategy"];

export default function BlogSection() {
  const featuredPost = blogPosts.find(post => post.featured);
  const regularPosts = blogPosts.filter(post => !post.featured);

  return (
    <section className="section-padding bg-background">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-gradient">Export Insights</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest trends, insights, and expert advice from the world of international trade
          </p>
        </div>

        {/* Featured Post */}
        {featuredPost && (
          <div className="mb-12">
            <div className="grid lg:grid-cols-2 gap-8 export-card overflow-hidden">
              <div className="relative">
                <Image
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="w-full h-64 lg:h-full object-cover hover:scale-105 transition-transform duration-500"
                  priority
                  fill
                />
                <Badge className="absolute top-4 left-4 bg-accent text-accent-foreground">
                  Featured
                </Badge>
              </div>
              
              <div className="p-6 lg:p-8 flex flex-col justify-center">
                <div className="flex items-center gap-4 mb-4">
                  <Badge variant="outline">{featuredPost.category}</Badge>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </div>
                </div>
                
                <h3 className="text-2xl md:text-3xl font-bold mb-4 hover:text-primary transition-colors cursor-pointer">
                  {featuredPost.title}
                </h3>
                
                <p className="text-muted-foreground mb-6 text-lg leading-relaxed">
                  {featuredPost.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    By <span className="font-semibold text-foreground">{featuredPost.author}</span>
                  </div>
                  <Button aria-label="Read More" variant="hero" className="group">
                    Read More
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {categories.map((category) => (
            <Button
              aria-label={category}
              key={category}
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-primary hover:text-primary-foreground"
            >
              <Tag className="w-3 h-3 mr-2" />
              {category}
            </Button>
          ))}
        </div>

        {/* Blog Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {regularPosts.map((post, index) => (
            <article
              key={post.id}
              className="export-card overflow-hidden group cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="relative overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  priority
                  fill
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Badge variant="secondary" className="text-xs">
                    {post.category}
                  </Badge>
                  <div className="flex items-center gap-1 text-muted-foreground text-xs">
                    <Clock className="w-3 h-3" />
                    {post.readTime}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </div>
                  <span className="text-muted-foreground">By {post.author}</span>
                </div>
                
                <Button
                  variant="ghost"
                   aria-label="Read Article"
                  className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground"
                >
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12">
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter for the latest export insights, market updates, and industry trends delivered to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-border focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button aria-label="Subscribe" variant="hero" className="px-8">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8">
          <Button aria-label="View All Articles" variant="export" size="lg">
            View All Articles
          </Button>
        </div>
      </div>
    </section>
  );
}