"use client"; // Important if using client-side React component
import Script from "next/script";

interface PageSchemaProps {
  schema?: {
    Name: string;
    RatingValue: number;
    RatingCount: number;
    ReviewCount: number;
  };
}

export default function PageSchemaScript({ schema }: PageSchemaProps) {
  if (!schema) return null;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: schema.Name,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: schema.RatingValue,
      ratingCount: schema.RatingCount,
      reviewCount: schema.ReviewCount,
    },
  };

  return (
    <Script type="application/ld+json" id="page-schema">
      {JSON.stringify(jsonLd)}
    </Script>
  );
}
