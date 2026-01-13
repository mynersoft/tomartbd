'use client';
import React, { useState } from 'react';
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
  Heart,
  Eye,
} from 'lucide-react';

const ComboOffer = ({ combo }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [quickView, setQuickView] = useState(false);

  // Calculate time left for limited offers
  const calculateTimeLeft = () => {
    const endDate = new Date(combo.endDate);
    const now = new Date();
    const diff = endDate - now;

    if (diff <= 0) return { expired: true };

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, expired: false };
  };

  const timeLeft = calculateTimeLeft();
  const savings = Math.round(combo.discountPercent);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-20">
        <div className="relative">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full shadow-xl shadow-orange-500/30">
            <div className="flex items-center gap-1">
              <Tag className="w-3 h-3" />
              <span className="text-sm font-black">SAVE {savings}%</span>
            </div>
          </div>
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-500 rotate-45"></div>
        </div>
      </div>

      {/* Like Button */}
      <button
        onClick={() => setIsLiked(!isLiked)}
        className="absolute top-3 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
      >
        <Heart
          className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-slate-400 hover:text-red-500'}`}
        />
      </button>

      {/* Quick View Button */}
      {isHovered && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => setQuickView(true)}
          className="absolute top-14 right-3 z-20 p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:scale-110 transition-transform"
        >
          <Eye className="w-5 h-5 text-emerald-600" />
        </motion.button>
      )}

      {/* Timer for Limited Offers */}
      {!timeLeft.expired && (
        <div className="absolute top-14 left-3 z-20">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1"
          >
            <Clock className="w-3 h-3" />
            <span className="text-xs font-bold">
              {timeLeft.days}d {timeLeft.hours}h {timeLeft.minutes}m
            </span>
          </motion.div>
        </div>
      )}

      {/* Main Card */}
      <div className="bg-white rounded-3xl overflow-hidden border-2 border-slate-100 hover:border-emerald-300 transition-all duration-300 shadow-lg hover:shadow-2xl group-hover:shadow-emerald-100/50">
        {/* Image Container with Gradient Overlay */}
        <div className="relative h-56 overflow-hidden">
          <img
            src={combo.featuredImage.url}
            alt={combo.title}
            className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? 'scale-110' : 'scale-100'}`}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Products Preview */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex justify-center -space-x-4">
              {combo.products.slice(0, 4).map((product, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative group/product"
                >
                  <div className="w-14 h-14 rounded-xl border-4 border-white shadow-lg overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center">
                    ×{product.quantity}
                  </div>
                </motion.div>
              ))}
              {combo.products.length > 4 && (
                <div className="w-14 h-14 rounded-xl bg-slate-800/80 backdrop-blur-sm border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-white text-sm font-black">
                    +{combo.products.length - 4}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title & Rating */}
          <div className="mb-4">
            <h3 className="text-lg font-bold text-slate-900 line-clamp-1 mb-2">
              {combo.title}
            </h3>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${i < 4 ? 'fill-yellow-400 text-yellow-400' : 'fill-slate-200 text-slate-200'}`}
                />
              ))}
              <span className="text-xs text-slate-500 ml-1">(42 reviews)</span>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-slate-600 line-clamp-2 mb-6 h-10">
            {combo.description || 'Premium bundle of essential products'}
          </p>

          {/* Price Section */}
          <div className="mb-6 space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-700">
                ৳{combo.comboPrice.toLocaleString()}
              </span>
              <span className="text-lg text-slate-400 line-through">
                ৳{combo.totalRegularPrice.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-xs text-slate-500">
                <span className="font-bold text-orange-600">
                  Save ৳{combo.discountAmount.toLocaleString()}
                </span>{' '}
                per combo
              </div>
              <div className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-bold">
                {combo.products.length} ITEMS
              </div>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <CheckCircle className="w-4 h-4 text-emerald-500" />
              <span>Free Shipping</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>2 Years Warranty</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <Truck className="w-4 h-4 text-purple-500" />
              <span>Same Day Delivery</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-600">
              <ShoppingBag className="w-4 h-4 text-amber-500" />
              <span>Gift Included</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-3">
            <motion.button
              whileTap={{ scale: 0.95 }}
              className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-emerald-200 transition-all group/btn"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart
              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
            </motion.button>

            <button className="px-4 py-3 border-2 border-slate-200 text-slate-700 rounded-xl font-bold hover:border-emerald-300 hover:bg-emerald-50 transition-colors">
              ৳{combo.comboPrice / 3}
              <span className="text-xs block font-normal text-slate-500">
                /month
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickView && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => setQuickView(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            {/* Quick View Content */}
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  {combo.title}
                </h2>
                <button
                  onClick={() => setQuickView(false)}
                  className="text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <img
                    src={combo.featuredImage.url}
                    alt={combo.title}
                    className="w-full rounded-2xl"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-bold mb-4">Bundle Includes:</h3>
                  <div className="space-y-3">
                    {combo.products.map((product, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl"
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <p className="font-medium text-slate-800">
                            {product.name}
                          </p>
                          <p className="text-sm text-slate-500">
                            Quantity: {product.quantity}
                          </p>
                        </div>
                        <span className="font-bold text-emerald-700">
                          ৳{product.price}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

// Homepage Grid Container for Combos
export const HomepageComboGrid = ({ combos }) => {
  return (
    <section className="py-16 px-4">
      <div className="container mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 px-4 py-1.5 rounded-full text-sm font-bold mb-3">
            <Tag className="w-4 h-4" />
            EXCLUSIVE BUNDLES
          </div>
          <h2 className="text-4xl font-bold text-slate-900 mb-3">
            Smart Combos, Smarter Savings
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Curated bundles that save you up to 60%. Limited time offers with
            free shipping.
          </p>
        </div>

        {/* Combo Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {combos.map((combo) => (
            <HomepageComboCard key={combo._id} combo={combo} />
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-16 bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-8 text-center relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-white mb-3">
              Can't find your perfect bundle?
            </h3>
            <p className="text-emerald-100 mb-6 max-w-md mx-auto">
              Contact our experts to create a custom combo just for your needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-emerald-600 px-8 py-3 rounded-xl font-bold hover:bg-emerald-50 transition-colors">
                Build Custom Bundle
              </button>
              <button className="bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-800 transition-colors border-2 border-white/20">
                View All Combos
              </button>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
            <div className="text-slate-600">Happy Customers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">45%</div>
            <div className="text-slate-600">Average Savings</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">24h</div>
            <div className="text-slate-600">Delivery Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">4.8★</div>
            <div className="text-slate-600">Customer Rating</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComboOffer;
