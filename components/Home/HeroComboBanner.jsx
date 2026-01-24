'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ShoppingBag,
  Tag,
  Clock,
  ChevronRight,
  Star,
  Shield,
  Truck,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Zap,
  Award,
  Users,
  Package,
  Loader2,
} from 'lucide-react';

const HeroComboBanner = ({ combo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ expired: true });
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(!combo);

  // Calculate time left - runs unconditionally
  useEffect(() => {
    if (!combo?.endDate) {
      setTimeLeft({ expired: true });
      return;
    }

    const calculateTimeLeft = () => {
      const endDate = new Date(combo.endDate);
      const now = new Date();
      const diff = endDate - now;

      if (diff <= 0) return { expired: true };

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      return { days, hours, minutes, seconds, expired: false };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [combo?.endDate]);

  // Auto-rotate featured products if they exist
  useEffect(() => {
    if (!combo?.products?.length) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % combo.products.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [combo?.products?.length]);

  // Handle loading state
  useEffect(() => {
    setIsLoading(!combo);
  }, [combo]);

  if (isLoading) {
    return (
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30 min-h-[600px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-emerald-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">Loading combo offer...</p>
        </div>
      </div>
    );
  }

  const savings = Math.round(combo.discountPercent || 0);
  const safeCombo = combo || {};

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900/30">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#ffffff_1px,transparent_0)] bg-[size:40px_40px]"></div>
      </div>

      {/* Animated Orbs */}
      <motion.div
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity }}
        className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ x: [0, -50, 0], y: [0, 100, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
        className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
      />

      <div className="relative z-10 grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
        {/* Left Content */}
        <div className="space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-bold">LIMITED TIME OFFER</span>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-4xl lg:text-5xl font-bold text-white"
          >
            <span className="bg-gradient-to-r from-emerald-300 to-cyan-300 bg-clip-text text-transparent">
              {safeCombo.title || 'Ultimate Tech Bundle'}
            </span>
            <br />
            <span className="text-white">Save {savings}% Today</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-300 max-w-xl"
          >
            {safeCombo.description ||
              'Get the complete setup with premium products. Perfect for work, gaming, and creative projects. Limited stock available!'}
          </motion.p>

          {/* Stats */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { icon: Users, value: '500+', label: 'Sold Today' },
              { icon: Star, value: '4.8', label: 'Rating' },
              { icon: Award, value: `${savings}%`, label: 'Average Save' },
              { icon: Package, value: '24h', label: 'Delivery' },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="text-center p-3 bg-white/5 rounded-2xl backdrop-blur-sm"
              >
                <stat.icon className="w-5 h-5 text-emerald-300 mx-auto mb-2" />
                <div className="text-2xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-slate-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>

          {/* Timer */}
          {!timeLeft.expired && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-r from-slate-900/50 to-slate-800/50 p-6 rounded-2xl backdrop-blur-sm border border-white/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <Clock className="w-5 h-5 text-orange-400" />
                <span className="text-white font-bold">Offer ends in:</span>
              </div>
              <div className="flex gap-3">
                {[
                  { value: timeLeft.days, label: 'Days' },
                  { value: timeLeft.hours, label: 'Hours' },
                  { value: timeLeft.minutes, label: 'Minutes' },
                  { value: timeLeft.seconds, label: 'Seconds' },
                ].map((time, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div className="bg-slate-900/80 rounded-xl p-3 mb-1">
                      <div className="text-2xl font-bold text-white">
                        {String(time.value || 0).padStart(2, '0')}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400">{time.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button className="group relative flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-4 px-8 rounded-xl font-bold flex items-center justify-center gap-3 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-600 to-cyan-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ShoppingBag className="w-5 h-5 relative z-10" />
              <span className="relative z-10">
                Add to Cart - ৳{(safeCombo.comboPrice || 0).toLocaleString()}
              </span>
              <ChevronRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-4 border-2 border-emerald-400/30 text-emerald-300 rounded-xl font-bold hover:bg-emerald-400/10 transition-colors">
              View Details
            </button>
          </motion.div>
        </div>

        {/* Right Content - Featured Product Showcase */}
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Main Product Display */}
          <div className="relative h-[400px] rounded-2xl overflow-hidden border-2 border-emerald-500/20">
            <img
              src={safeCombo.featuredImage?.url || '/placeholder-image.jpg'}
              alt={safeCombo.title || 'Combo Offer'}
              className={`w-full h-full object-cover transition-transform duration-1000 ${
                isHovered ? 'scale-110' : 'scale-100'
              }`}
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>

            {/* Price Tag */}
            <div className="absolute top-6 right-6">
              <div className="bg-gradient-to-r from-emerald-500 to-cyan-500 text-white px-6 py-3 rounded-xl shadow-2xl">
                <div className="text-xs opacity-90">ONLY</div>
                <div className="text-3xl font-black">
                  ৳{(safeCombo.comboPrice || 0).toLocaleString()}
                </div>
                <div className="text-xs line-through opacity-80">
                  ৳{(safeCombo.totalRegularPrice || 0).toLocaleString()}
                </div>
              </div>
            </div>

            {/* Savings Badge */}
            <div className="absolute top-6 left-6">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-xl">
                <div className="text-xs font-bold">SAVE</div>
                <div className="text-2xl font-black">
                  ৳{(safeCombo.discountAmount || 0).toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Products Carousel */}
          {safeCombo.products && safeCombo.products.length > 0 && (
            <div className="mt-6 relative">
              <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
                {safeCombo.products.map((product, idx) => (
                  <motion.div
                    key={idx}
                    animate={{
                      scale: idx === currentSlide ? 1.05 : 1,
                      borderColor:
                        idx === currentSlide
                          ? 'rgba(52, 211, 153, 0.5)'
                          : 'rgba(255, 255, 255, 0.1)',
                    }}
                    className="flex-shrink-0 w-20 h-20 rounded-xl border-2 overflow-hidden bg-slate-800/50 backdrop-blur-sm cursor-pointer"
                    onClick={() => setCurrentSlide(idx)}
                  >
                    <img
                      src={product.image || '/placeholder-product.jpg'}
                      alt={product.name || 'Product'}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
                      ×{product.quantity || 1}
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Active Product Info */}
              <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold">
                      {safeCombo.products[currentSlide]?.name || 'Product'}
                    </h4>
                    <p className="text-sm text-slate-300">
                      Quantity:{' '}
                      {safeCombo.products[currentSlide]?.quantity || 1}
                    </p>
                  </div>
                  <div className="text-emerald-300 font-bold">
                    ৳{safeCombo.products[currentSlide]?.price || 0}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Included Features */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {[
              { icon: Shield, text: '2 Year Warranty', color: 'text-blue-400' },
              { icon: Truck, text: 'Free Shipping', color: 'text-emerald-400' },
              { icon: Zap, text: 'Fast Delivery', color: 'text-orange-400' },
              {
                icon: CheckCircle,
                text: 'Quality Checked',
                color: 'text-green-400',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 p-3 bg-white/5 rounded-lg backdrop-blur-sm"
              >
                <feature.icon className={`w-4 h-4 ${feature.color}`} />
                <span className="text-sm text-slate-300">{feature.text}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute top-1/4 right-10 hidden lg:block"
      >
        <div className="bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 backdrop-blur-sm p-4 rounded-xl border border-emerald-400/30">
          <div className="text-white text-sm font-bold">🔥 Hot Deal!</div>
          <div className="text-emerald-300 text-xs">Only 12 left in stock</div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-20 left-10 hidden lg:block"
      >
        <div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 backdrop-blur-sm p-3 rounded-xl border border-orange-400/30">
          <div className="text-white text-sm font-bold flex items-center gap-1">
            <Tag className="w-3 h-3" />
            +3 FREE GIFTS
          </div>
        </div>
      </motion.div>
    </div>
  );
};

// Usage Component with proper error handling
export const HeroComboSection = ({ combos = [] }) => {
  // Check if combos is defined and has items
  const hasCombos = combos && combos.length > 0;
  const featuredCombo = hasCombos ? combos[0] : null;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-12 lg:py-24">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950/50"></div>

      {/* Animated Grid */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff22_1px,transparent_1px),linear-gradient(180deg,#ffffff22_1px,transparent_1px)] bg-[size:80px_80px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <HeroComboBanner combo={featuredCombo} />

        {/* Additional Combos Preview - Only show if there are more combos */}
        {hasCombos && combos.length > 1 && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">
                More Amazing Bundles
              </h2>
              <button className="text-emerald-300 hover:text-emerald-200 font-medium flex items-center gap-2">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {combos.slice(1, 4).map((combo) => (
                <div
                  key={combo._id || Math.random()}
                  className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-4 border border-slate-700/50 hover:border-emerald-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-white font-bold">
                        {combo.title || 'Combo Offer'}
                      </h3>
                      <p className="text-slate-400 text-sm mt-1">
                        Save {Math.round(combo.discountPercent || 0)}%
                      </p>
                    </div>
                    <div className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full text-sm font-bold">
                      ৳{(combo.comboPrice || 0).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty state message if no combos */}
        {!hasCombos && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-12 text-center"
          >
            <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
              <Sparkles className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">
                No Combo Offers Available
              </h3>
              <p className="text-slate-400">
                Check back soon for amazing bundle deals!
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HeroComboBanner;
