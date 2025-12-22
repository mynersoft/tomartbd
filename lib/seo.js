const SITE_NAME = "TomartBD";
const SITE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "https://tomartbd.com";

const DEFAULT_DESCRIPTION =
  "TomartBD offers quality products at the best price. Shop featured and best-selling items with fast delivery.";

export function generateMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = [],
  path = "",
  image = "/og-image.png",
} = {}) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : SITE_NAME;
  const url = `${SITE_URL}${path}`;

  const ogImage = image.startsWith("http")
    ? image
    : `${SITE_URL}${image}`;

  return {
    title: fullTitle,
    description,
    keywords: [
      "tomartbd",
      "online shop",
      "ecommerce Bangladesh",
      ...keywords,
    ],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage],
    },
  };
}