import qs from "qs";
import AboutLanding from "./components/AboutLanding";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Fetch About Pages
async function getAboutPages() {
  const query = qs.stringify(
    {
      sort: ["Title:asc"],
      populate: "*",
    },
    {
      encodeValuesOnly: true,
    }
  );

  const url = `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-pages?${query}`;

  console.log("Fetching:", url);

  try {
    const res = await fetch(url, {
      cache: "no-store",
    });

    console.log("STATUS:", res.status);

    const text = await res.text();

    console.log("BODY:", text);

    if (!res.ok) {
      return [];
    }

    return JSON.parse(text).data ?? [];
  } catch (err) {
    console.error("ACTUAL FETCH ERROR:", err);
    return [];
  }
}

// SEO
export async function generateMetadata() {
  return {
    title: "About Namakwala | Legacy Since 1945",
    description:
      "Explore Namakwala's journey, legacy, values, vision, mission and customer commitment built over 80 years of trust and excellence.",

    openGraph: {
      title: "About Namakwala | Legacy Since 1945",
      description:
        "Explore Namakwala's journey, legacy, values, vision, mission and customer commitment built over 80 years of trust and excellence.",
      url: "https://www.namakwala.com/about",
      siteName: "Namakwala",
    },

    twitter: {
      card: "summary_large_image",
      title: "About Namakwala",
      description:
        "Explore Namakwala's journey, legacy, values, vision and customer commitment.",
    },
  };
}

// Page
export default async function AboutPage() {
  const pages = await getAboutPages();

  return (
    <main className="overflow-hidden">
      <AboutLanding pages={pages} />
    </main>
  );
}