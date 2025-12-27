import Providers from "../components/Providers";
import "./globals.css";
import MessengerChat from "@/components/MessengerChat";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
<meta name="google-site-verification" content="OlqGBlfLEkJDmZZ3SppeQU1MDwI_CL6SEFXYSLv_DmA" />
      <body>
        <Providers>
<MessengerChat pageId="583273884879650" />

{children}</Providers>

<script>


javascript:(function(){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/eruda';document.body.appendChild(s);s.onload=function(){eruda.init();};})();

</script>
      </body>
    </html>
  );
}