import BlogDetailPage from "@/components/BlogDetailPage";

export default async function Page({
  params,
}: {
  params: {
    slug: string;
    blogslug: string;
  };
}) {
  return (
    <BlogDetailPage
      params={{
        slug: params.blogslug,
      }}
    />
  );
}