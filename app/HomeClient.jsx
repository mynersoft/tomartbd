'use client';
import CategoriesSection from '@/components/Home/CategoriesSection';
import FeaturedVendors from '@/components/FeaturedVendors';
import ProductCardNew from '@/components/Product/ProductCardNew';
import { useSelector } from 'react-redux';
import ProductGrid from '@/components/Product/ProductGrid';
import ComboOffer from '@/components/Home/ComboOffer';

import  CategorySidebar from "@/components/Home/CategorySidebar";

export default function Home() {
  const { products } = useSelector((state) => state.product);
  const { combos, isLoading } = useSelector((state) => state.combo);

  return (
    <div className="min-h-screen bg-gray-50">
      
      <main className="container mx-auto">
     

   <div className="grid grid-cols-12 gap-4">
        
        {/* Left Categories */}
        <div className="col-span-12 md:col-span-3">
          <CategorySidebar />
        </div>

        {/* Right Banner */}
        <div className="col-span-12 md:col-span-9">
         {combos.length > 0 &&
            combos.map((combo, index) => (
              <ComboOffer key={index} combo={combo} />
            ))}
        </div>

        <CategoriesSection />
        <ProductGrid products={products} />

        <FeaturedVendors />
      </main>
    </div>
  );
}

// 'use client';

// import { useProducts } from '@/hooks/useProducts';
// import { useSelector } from 'react-redux';
// import ProductSection from '@/components/Home/ProductSection';
// import ProductCardSkeleton from '@/components/Skeletons/ProductCardSkeleton';
// import ProductGrid from '@/components/Product/ProductGrid';
// import ProductCardS from '@/components/Product/ProductCardS';

// export default function HomeClient() {
//   const { products } = useSelector((state) => state.product);
//   const { isLoading } = useProducts(); // fetch products automatically

//   const featuredProducts = products.filter((p) => p.isFeatured);
//   const bestSellingProducts = products.filter((p) => p.isBestSelling);

//   if (isLoading) {
//     return (
//       <main className="container mx-auto px-4">
//         <ProductCardSkeleton title="Featured Products" />
//         <ProductCardSkeleton title="Best Selling Products" />
//       </main>
//     );
//   }

//   return (
//     <main className="container mx-auto px-4">
//       {/* Featured Products */}
//       {featuredProducts.length > 0 && (
//         <section aria-labelledby="featured-products">
//           <h2 id="featured-products" className="sr-only">
//             Featured Products
//           </h2>
//           <ProductSection
//             title="Featured Products"
//             products={featuredProducts}
//           />
//         </section>
//       )}

//       {/* Best Selling Products */}
//       {bestSellingProducts.length > 0 && (
//         <section aria-labelledby="best-selling-products">
//           <h2 id="best-selling-products" className="sr-only">
//             Best Selling Products
//           </h2>
//           <ProductSection
//             title="Best Selling Products"
//             products={bestSellingProducts}
//           />
//         </section>
//       )}

//       {/* All Products */}
//       <section aria-labelledby="all-products">
//         <h2 id="all-products" className="sr-only">
//           All Products
//         </h2>
//         <ProductGrid products={products} />
//       </section>

//       {products.length === 0 && (
//         <p className="text-center text-gray-500 py-10">No products available</p>
//       )}
//     </main>
//   );
// }
