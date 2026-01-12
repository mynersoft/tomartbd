// import ProductSinglePage from './ProductSinglePage';
// import { generateMetadata as seo } from '@/lib/seo';

// export async function generateMetadata({ params }) {
//   try {
//     const slug = params?.slug ?? '';
    
//     if (!slug) {
//       return {
//         title: 'Product Details | TomartBD',
//         description: 'Product details page',
//       };
//     }

//     return {
//       title: `${slug.replace(/-/g, ' ')} | TomartBD`,
//       description: 'Buy original products online in Bangladesh with best price, warranty and fast delivery.',
//     };
//   } catch (error) {
//     console.error('Error generating metadata:', error);
//     return {
//       title: 'Product Details | TomartBD',
//       description: 'Product details page',
//     };
//   }
// }

// export default function Page() {
//   return <ProductSinglePage />;
// }


import ProductSinglePage from './ProductSinglePage';

export default function Page() {
  return <ProductSinglePage />;
}
