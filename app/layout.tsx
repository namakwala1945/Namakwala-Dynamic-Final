import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import ClientComponents from "./ClientComponents";
import { Playfair_Display, Poppins } from "next/font/google";
import PageSchemaScript from "@/components/PageSchemaScript";
import { GoogleAnalytics } from "@next/third-parties/google";
// Fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-playfair",
  display: "swap",
});
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-poppins",
  display: "swap",
});

// Metadata
export const metadata: Metadata = {
  title:
    "Best Salt's Exporter in India | Best Mineral's Exporter in India | NAMAKWALA",
  description:
    "NAMAKWALA – The Best Salt's Exporter in India & Best Mineral's Exporter in India, delivering pure, high-quality salts & minerals worldwide with trust.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, viewport-fit=cover"
        />
        <PageSchemaScript
          schema={{
            Name: "Namakwala",
            RatingValue: 4.8,
            RatingCount: 28916,
            ReviewCount: 50,
          }}
        />
      </head>

      <body
        className={`${poppins.variable} ${playfair.variable} font-poppins font-playfair cursor-none`}
      >
        <ClientComponents />
        <Header />
        <Providers>{children}</Providers>
        <Footer />
        <GoogleAnalytics gaId="G-KHLPFW7673" />
      </body>
    </html>
  );
}
