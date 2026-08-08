export async function getAboutMenu() {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_STRAPI_URL}/api/about-pages?fields[0]=Title&fields[1]=Slug`,
        {
          next: { revalidate: 60 },
        }
      );
  
      if (!res.ok) return [];
  
      const json = await res.json();
  
      return json.data || [];
    } catch {
      return [];
    }
  }