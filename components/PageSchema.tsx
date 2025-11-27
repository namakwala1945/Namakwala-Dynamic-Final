// components/PageSchema.tsx
interface PageSchemaProps {
  data?: {
    Name?: string;
    RatingValue?: number;
    RatingCount?: number;
    ReviewCount?: number;
  };
}

const defaultSchema = {
  Name: "Namakwala",
  RatingValue: 4.8,
  RatingCount: 28916,
  ReviewCount: 50,
};

export default function PageSchema({ data }: PageSchemaProps) {
  const schemaData = data || defaultSchema;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "http://schema.org/",
          "@type": "Product",
          name: schemaData.Name,
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: schemaData.RatingValue?.toString() || defaultSchema.RatingValue.toString(),
            ratingCount: schemaData.RatingCount?.toString() || defaultSchema.RatingCount.toString(),
            reviewCount: schemaData.ReviewCount?.toString() || defaultSchema.ReviewCount.toString(),
          },
        }),
      }}
    />
  );
}
