// components/MarketplaceFeatures.jsx
import {
  Shield,
  Truck,
  Headphones,
  CreditCard,
  Users,
  Globe,
} from 'lucide-react';

export default function MarketplaceFeatures() {
  const features = [
    {
      icon: <Shield className="h-10 w-10" />,
      title: 'Secure Transactions',
      description:
        '100% secure payment with SSL encryption and fraud protection',
    },
    {
      icon: <Truck className="h-10 w-10" />,
      title: 'Fast Delivery',
      description: 'Nationwide delivery with real-time tracking system',
    },
    {
      icon: <Headphones className="h-10 w-10" />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for buyers and sellers',
    },
    {
      icon: <CreditCard className="h-10 w-10" />,
      title: 'Easy Returns',
      description: 'Hassle-free returns within 7 days of delivery',
    },
    {
      icon: <Users className="h-10 w-10" />,
      title: 'Verified Vendors',
      description: 'All vendors are thoroughly verified for authenticity',
    },
    {
      icon: <Globe className="h-10 w-10" />,
      title: 'Nationwide Reach',
      description: 'Serving customers across all 64 districts of Bangladesh',
    },
  ];

  return (
    <section className="py-12 bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Why Choose TomartBD?</h2>
          <p className="text-gray-300 max-w-2xl mx-auto">
            We provide the best marketplace experience for both buyers and
            sellers in Bangladesh
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-xl hover:bg-gray-800 transition-colors group border border-gray-700"
            >
              <div className="flex items-start space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-emerald-500 p-3 rounded-lg group-hover:scale-110 transition-transform">
                  <div className="text-white">{feature.icon}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-300">{feature.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-gray-800/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              50K+
            </div>
            <div className="text-gray-300 mt-2">Products</div>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              500+
            </div>
            <div className="text-gray-300 mt-2">Active Vendors</div>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              100K+
            </div>
            <div className="text-gray-300 mt-2">Happy Customers</div>
          </div>
          <div className="bg-gray-800/30 p-6 rounded-xl">
            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              64
            </div>
            <div className="text-gray-300 mt-2">Districts Covered</div>
          </div>
        </div>
      </div>
    </section>
  );
}
