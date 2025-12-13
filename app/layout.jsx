import type { Metadata } from "next";
import Providers from "../components/Providers";
import "./globals.css";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata: Metadata = {
  title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
  description:
    "Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd. Affordable prices, fast delivery, and a wide selection for every home and project.",

  keywords: [
    "Tomartbd",
    "Hardware",
    "Home Decor",
    "Electrical Items",
    "Accessories",
    "Online Shop Bangladesh",
  ],

  authors: [{ name: "Tomartbd" }],

  verification: {
    google: "eAot73MjOvRjOy1w5IgBUge9d5zFtYqfUZdugtaD16c",
  },

  openGraph: {
    title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
    description:
      "Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd.",
    url: BASE_URL,
    siteName: "Tomartbd Shop",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Tomartbd Shop",
      },
    ],
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Tomartbd Shop - Hardware, Home Decor & Accessories Online",
    description:
      "Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd.",
    images: [`${BASE_URL}/og-image.png`],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}