// components/FeaturedVendors.jsx
import { Check, Star, Store } from 'lucide-react';

export default function FeaturedVendors() {
  const vendors = [
    {
      id: 1,
      name: 'Tech Galaxy',
      category: 'Electronics & Gadgets',
      rating: 4.8,
      products: '1,234',
      joined: '2 years',
      verified: true,
      imageColor: 'bg-gradient-to-br from-blue-100 to-cyan-100',
    },
    {
      id: 2,
      name: 'Fashion Palace',
      category: 'Clothing & Accessories',
      rating: 4.6,
      products: '2,567',
      joined: '3 years',
      verified: true,
      imageColor: 'bg-gradient-to-br from-pink-100 to-rose-100',
    },
    {
      id: 3,
      name: 'Home Comforts',
      category: 'Home & Kitchen',
      rating: 4.9,
      products: '890',
      joined: '1 year',
      verified: true,
      imageColor: 'bg-gradient-to-br from-emerald-100 to-green-100',
    },
    {
      id: 4,
      name: 'Beauty Box',
      category: 'Cosmetics & Skincare',
      rating: 4.7,
      products: '456',
      joined: '2 years',
      verified: true,
      imageColor: 'bg-gradient-to-br from-purple-100 to-violet-100',
    },
  ];

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900">Featured Vendors</h2>
          <p className="text-gray-600 mt-2">
            Shop from our trusted and verified vendors
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vendors.map((vendor) => (
            <div
              key={vendor.id}
              className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow border border-gray-200 group"
            >
              <div className="flex flex-col items-center text-center">
                <div
                  className={`${vendor.imageColor} w-20 h-20 rounded-full flex items-center justify-center mb-4`}
                >
                  <Store className="h-10 w-10 text-gray-700" />
                </div>
                <div className="flex items-center mb-2">
                  <h3 className="text-xl font-bold text-gray-900 mr-2">
                    {vendor.name}
                  </h3>
                  {vendor.verified && (
                    <div
                      className="bg-blue-100 p-1 rounded-full"
                      title="Verified Vendor"
                    >
                      <Check className="h-4 w-4 text-blue-600" />
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{vendor.category}</p>

                <div className="flex items-center justify-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(vendor.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="ml-2 text-sm font-medium">
                    {vendor.rating}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {vendor.products}
                    </div>
                    <div className="text-xs text-gray-600">Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {vendor.joined}
                    </div>
                    <div className="text-xs text-gray-600">On Platform</div>
                  </div>
                </div>

                <button className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-emerald-500 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
                  Visit Store
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Become a Vendor on TomartBD
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join thousands of successful sellers. Reach millions of customers,
            get marketing support, and grow your business with our platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:shadow-lg transition-shadow">
              Start Selling Now
            </button>
            <button className="px-8 py-3 bg-white text-blue-600 border-2 border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
