import HomeClient from "./HomeClient";
import { generateMetadata } from "@/lib/seo";
import { useSelector } from "react-redux";

export const metadata = generateMetadata({
  title: "Buy Quality Products Online",
  path: "/",
  keywords: ["best products", "featured products", "best selling products"],
});

export default function HomePage() {
  // Products can be fetched server-side if you want full SEO
  // For now, we use empty array; React Query will hydrate on client
  const products = []; 

  const jsonLdProducts = products.map((product) => ({
    "@type": "Product",
    name: product.name,
    image: product.image || "/og-image.png",
    description: product.description || "High quality product from TomartBD",
    sku: product.sku || "",
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price || 0,
      availability: "https://schema.org/InStock",
      url: `https://tomartbd.com/product/${product.slug}`,
    },
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Store",
    name: "TomartBD",
    url: "https://tomartbd.com",
    sameAs: [
      "https://www.facebook.com/TomartBD",
      "https://www.instagram.com/TomartBD",
    ],
    potentialAction: {
      "@type": "SearchAction",
      target: "https://tomartbd.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    mainEntity: jsonLdProducts,
  };

  return (
    <>
      <header className="sr-only">
        <h1>Buy Quality Products Online from TomartBD</h1>
      </header>

      <HomeClient />

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}