import Providers from '@/components/Providers';
import './globals.css';
import MessengerChat from '@/components/MessengerChat';
import InitData from '@/components/InitData';
import Eruda from '@/components/Eruda';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://tomartbd.vercel.app';

export const metadata = {
  title: 'TomartBD – Buy Electronics, Fashion & Daily Products Online in Bangladesh',
  description:
    'Shop electronics, fashion, home & kitchen, beauty and groceries online at TomartBD. Fast delivery all over Bangladesh. Best price & trusted service.',

  keywords: [
    'TomartBD',
    'Online Shop Bangladesh',
    'Electronics Store BD',
    'Home & Kitchen Products',
    'Hardware Store Bangladesh',
    'Daily Products Online',
  ],

  authors: [{ name: 'TomartBD' }],

  metadataBase: new URL(BASE_URL),

  openGraph: {
    title: 'TomartBD – Online Shopping Platform in Bangladesh',
    description:
      'Buy electronics, fashion, home & kitchen, beauty and daily products online at TomartBD.',
    url: BASE_URL,
    siteName: 'TomartBD',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'TomartBD Online Shop',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TomartBD – Online Shopping Platform in Bangladesh',
    description:
      'Shop electronics, fashion, home & kitchen, beauty and groceries online at TomartBD.',
    images: ['/og-image.png'],
  },

  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Google Search Console Verification */}
        <meta
          name="google-site-verification"
          content="OlqGBlfLEkJDmZZ3SppeQU1MDwI_CL6SEFXYSLv_DmA"
        />

        {/* Organization Schema (Brand Protection) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'TomartBD',
              url: BASE_URL,
              logo: `${BASE_URL}/logo.png`,
              sameAs: [],
            }),
          }}
        />
      </head>

      <body>
        <Providers>
          <InitData />
          <MessengerChat pageId="583273884879650" />
          {children}
        </Providers>

        <Eruda />
      </body>
    </html>
  );
}