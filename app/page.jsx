import HomeClient from "./HomeClient";

export const metadata = {
  title: "TomartBD | Buy Quality Products Online",
  description:
    "TomartBD offers quality products at the best price. Shop featured and best-selling items with fast delivery.",
  keywords: [
    "online shop",
"tomartbd",
    "best selling products",
    "featured products",
"best products",
    "ecommerce Bangladesh",
  ],
  openGraph: {
    title: "Tomartbd – Best Online Shop",
    description:
      "Shop featured and best-selling products online from tomartbd.",
    url: "https://mahirprostore.com",
    siteName: "TomartBD",
    type: "website",
  },
  alternates: {
    canonical: "https://mahirprostore.com",
  },
};

export default function HomePage() {
  return (
    <>
      <header className="sr-only">
        <h1>TomartBD Online Shopping Platform</h1>
      </header>

      <HomeClient />
    </>
  );
}