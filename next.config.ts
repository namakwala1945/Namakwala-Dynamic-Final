const { i18n } = require("./next-i18next.config");

module.exports = {
  experimental: {
    optimizeCss: true, // inline critical CSS
  },

  images: {
    unoptimized: false, // ✅ enable Next.js image optimization
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [320, 640, 768, 1024, 1200, 1600],

    // Existing image domains
    domains: ["images.unsplash.com", "img.youtube.com"],

    // Remote patterns for optimized external images
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "apeda.gov.in" },

      // ✅ Strapi host for uploads
      {
        protocol: "https",
        hostname: "admin.namakwala.in",
        port: "",
        pathname: "/uploads/**", // allow all images under /uploads
      },

      // Optional: allow optimized fallback images
      {
        protocol: "https",
        hostname: "admin.namakwala.in",
        port: "",
        pathname: "/optimized/**", // allow /optimized folder
      },
    ],
  },

  i18n: {
    locales: ["en", "fr", "de", "ar", "ur", "af"],
    defaultLocale: "en",
  },

  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

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
