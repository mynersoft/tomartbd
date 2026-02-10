import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProduct } from '@/fetch/getProduct';
import ProductSinglePage from './ProductSinglePage';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ slug: string }>;
};

/* ---------------- SEO Metadata ---------------- */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    notFound();
  }

  return {
    title: `${product.metaTitle} | Tomartbd`,
    description: product.metaDescription,
    keywords: product.keywords,

    openGraph: {
      title: product.metaTitle,
      description: product.metaDescription,
      url: `https://mahirprostore.com/product/${product.slug}`,
      images: [
        {
          url: product.galleryImages[0],
          width: 800,
          height: 800,
          alt: product.name,
        },
      ],
      type: 'website', // ✅ valid OpenGraph type
    },

    twitter: {
      card: 'summary_large_image',
      title: product.metaTitle,
      description: product.metaDescription,
      images: [product.featureImg],
    },
  };
}

/* ---------------- Product Page ---------------- */
export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    <div>Product not found</div>
  }

  return (



    <main className="container mx-auto p-4">
     
      
      <ProductSinglePage/>


      {/* -------- JSON-LD Structured Data -------- */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            image: product.featureImg,
            description: product.metaDescription,
            sku: product.sku || product.slug,
            brand: {
              '@type': 'Brand',
              name: 'MahirProStore',
            },
            offers: {
              '@type': 'Offer',
              url: `https://mahirprostore.com/product/${product.slug}`,
              priceCurrency: 'BDT',
              price: product.salePrice,
              availability: 'https://schema.org/InStock',
            },
          }),
        }}
      />
    </main>
  );
}
