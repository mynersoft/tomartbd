import Providers from '../components/Providers';
import './globals.css';
import MessengerChat from '@/components/MessengerChat';
import InitData from '@/components/InitData';
import Eruda from '@/components/Eruda';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const metadata = {
  title: 'TomartBD – Buy Electronics, Fashion & Daily Products Online in Bangladesh',
  description:
    'Shop electronics, fashion, home & kitchen, beauty and groceries online at TomartBD. 
Fast delivery all over Bangladesh. Best price & trusted service.',

  keywords: [
    'Tomartbd',
    'Hardware',
    'Home Decor',
    'Electrical Items',
    'Accessories',
    'Online Shop Bangladesh',
  ],

  authors: [{ name: 'Tomartbd' }],

  openGraph: {
    title: 'Tomartbd Shop - Hardware, Home Decor & Accessories Online',
    description:
      'Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd.',
    url: BASE_URL,
    siteName: 'Tomartbd Shop',
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: 'Tomartbd Shop',
      },
    ],
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tomartbd Shop - Hardware, Home Decor & Accessories Online',
    description:
      'Shop high-quality hardware, home decor, electrical items, and accessories at Tomartbd.',
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
      <meta
        name="google-site-verification"
        content="OlqGBlfLEkJDmZZ3SppeQU1MDwI_CL6SEFXYSLv_DmA"
      />
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
