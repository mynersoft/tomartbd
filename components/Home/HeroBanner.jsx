// components/home/HeroBanner.jsx
"use client";
import { motion } from 'framer-motion';
import { ArrowRight, Shield, Truck, RefreshCw } from 'lucide-react';
import Image from 'next/image';

const HeroBanner = () => {
  const slides = [
    {
      title: "Biggest Sale of the Year",
      subtitle: "Up to 70% OFF",
      description: "Winter collection is here. Don't miss the opportunity!",
      image: "/banner1.jpg",
      color: "from-blue-600 to-purple-600",
      buttonText: "Shop Now"
    },
    {
      title: "Free Home Delivery",
      subtitle: "All Over Bangladesh",
      description: "Order above ৳1000 and get free delivery",
      image: "/banner2.jpg",
      color: "from-green-600 to-emerald-600",
      buttonText: "Order Now"
    },
    {
      title: "New Arrivals",
      subtitle: "Latest Tech Gadgets",
      description: "Smartphones, Laptops & Accessories",
      image: "/banner3.jpg",
      color: "from-orange-500 to-red-500",
      buttonText: "Explore"
    }
  ];

  const features = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: "Free Shipping",
      desc: "On orders over ৳1000"
    },
    {
      icon: <RefreshCw className="w-8 h-8" />,
      title: "Easy Returns",
      desc: "30-day return policy"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Payment",
      desc: "100% secure payment"
    },
    {
      icon: <span className="text-2xl">🎁</span>,
      title: "Gift Cards",
      desc: "Buy gift cards"
    }
  ];

  return (
    <section className="relative overflow-hidden">
      {/* Hero Slider */}
      <div className="relative h-[600px] bg-gradient-to-r from-blue-50 to-purple-50">
        <div className="container mx-auto px-4 h-full flex items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl"
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold mb-4">
              Winter Sale 2024
            </span>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
              Fresh Styles for
              <span className="block gradient-text">Every Occasion</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Discover amazing products at unbelievable prices. 
              Quality you can trust, delivered to your doorstep.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="btn-primary flex items-center gap-2">
                Start Shopping
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="px-6 py-3 border-2 border-blue-600 text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition">
                View Categories
              </button>
            </div>
          </motion.div>
        </div>
        
        {/* Decorative Elements */}
        <div className="absolute right-0 top-0 w-1/3 h-full hidden lg:block">
          <div className="relative h-full">
            {/* Add your hero image here */}
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-white/50"></div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="container mx-auto px-4 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-xl p-6 flex items-center gap-4 card-hover"
            >
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                {feature.icon}
              </div>
              <div>
                <h3 className="font-bold text-gray-900">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;