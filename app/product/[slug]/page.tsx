import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct } from "@/fetch/getProduct";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{ slug: string }>;
};

/* ---------------- SEO Metadata ---------------- */
export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.name} | Tomartbd`,
    description: product.shortDescription,
    keywords: product.tags,

    openGraph: {
      title: product.name,
      description: product.shortDescription,
      url: `https://mahirprostore.com/product/${product.slug}`,
      images: [
        {
          url: product.image,
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: "website", // ✅ valid OpenGraph type
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.shortDescription,
      images: [product.image],
    },
  };
}

/* ---------------- Product Page ---------------- */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{product.name}</h1>

      <img
        src={product.image}
        alt={product.name}
        width={500}
        height={500}
        className="rounded mb-4"
      />

      <p className="mb-2">{product.description}</p>

      <p className="text-lg font-semibold">
        Price: ৳{product.price}
      </p>

      {/* -------- JSON-LD Structured Data -------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            image: product.image,
            description: product.shortDescription,
            sku: product.sku || product.slug,
            brand: {
              "@type": "Brand",
              name: "MahirProStore",
            },
            offers: {
              "@type": "Offer",
              url: `https://mahirprostore.com/product/${product.slug}`,
              priceCurrency: "BDT",
              price: product.price,
              availability: "https://schema.org/InStock",
            },
          }),
        }}
      />
    </main>
  );
}