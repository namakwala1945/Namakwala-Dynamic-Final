import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    optimizeCss: true,
  },

  images: {
    unoptimized: false,
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [320, 640, 768, 1024, 1200, 1600],

    domains: ["images.unsplash.com", "img.youtube.com"],

    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "apeda.gov.in" },

      {
        protocol: "https",
        hostname: "admin.namakwala.in",
        pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "admin.namakwala.in",
        pathname: "/optimized/**",
      },
    ],
  },

  i18n: {
    locales: ["en", "fr", "de", "ar", "ur", "af"],
    defaultLocale: "en",
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  async rewrites() {
    return [
      {
        source: "/:slug.html",
        destination: "/blog/:slug.html",
      },
    ];
  },

  future: {
    legacyBrowsers: false,
  },

  browserslist: [
    "last 2 Chrome versions",
    "last 2 Firefox versions",
    "last 2 Edge versions",
    "last 2 Safari versions",
  ],
};

export default nextConfig;
