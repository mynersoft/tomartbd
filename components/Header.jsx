"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  Plus,
  Minus,
  Trash2,
  Search,
  ChevronDown,
  Package,
  Shield,
  Truck,
} from "lucide-react";

import useLoginUser from "@/hooks/useAuth";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
  clearCart,
} from "@/store/slices/cartSlice";
import { useRouter } from "next/navigation";

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items, qty } = useSelector((state) => state.cart);
  const { user } = useLoginUser();

  const [mounted, setMounted] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleQuickOrder = (item) => {
    dispatch(removeFromCart(item._id));
    dispatch({
      type: "cart/addToCart",
      payload: { ...item, quantity: 1 },
    });
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const categories = [
    { name: "Electronics", slug: "electronics" },
    { name: "Fashion", slug: "fashion" },
    { name: "Home & Garden", slug: "home-garden" },
    { name: "Books", slug: "books" },
    { name: "Sports", slug: "sports" },
    { name: "Health & Beauty", slug: "health-beauty" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      {/* ================= TOP BAR ================= */}
      <div className="bg-[#004488] text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 py-2 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Truck size={14} />
              <span>Free shipping on orders over ৳500</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Shield size={14} />
              <span>100% Secure Payment</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-4">
            <Link href="/track-order" className="hover:text-[#C0A460]">
              Track Order
            </Link>
            <Link href="/help" className="hover:text-[#C0A460]">
              Help Center
            </Link>
            {user ? (
              <Link href="/dashboard/user" className="hover:text-[#C0A460]">
                Welcome, {user.name?.split(" ")[0] || "User"}
              </Link>
            ) : (
              <Link href="/auth/login" className="hover:text-[#C0A460]">
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* ================= SEARCH OVERLAY ================= */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-white">
          <div className="max-w-3xl mx-auto px-4 pt-20">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold">What are you looking for?</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close search"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands, and categories..."
                className="w-full p-4 pl-12 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-[#004488]"
                autoFocus
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={24} />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#004488] text-white px-6 py-2 rounded-lg hover:bg-[#003366]"
              >
                Search
              </button>
            </form>

            <div className="mt-8">
              <h3 className="text-lg font-semibold mb-4">Popular Searches</h3>
              <div className="flex flex-wrap gap-2">
                {["Smartphone", "Laptop", "Headphones", "Watch", "Shoes", "Backpack"].map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      setSearchQuery(term);
                      router.push(`/search?q=${encodeURIComponent(term)}`);
                      setIsSearchOpen(false);
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= CART DRAWER ================= */}
      <div
        className={`fixed inset-0 z-50 transition-opacity duration-300 ${
          isCartOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!isCartOpen}
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setIsCartOpen(false)}
        />

        <aside
          className={`absolute top-0 right-0 h-full w-full md:w-[420px] bg-white shadow-xl transform transition-transform duration-300 ${
            isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div>
                <h2 className="text-xl font-bold">Your Cart</h2>
                <p className="text-sm text-gray-500">
                  {qty} item{qty !== 1 ? "s" : ""} • ৳{totalPrice}
                </p>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close cart"
              >
                <X size={24} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length > 0 ? (
                items.map((item) => (
                  <div
                    key={item._id}
                    className="flex gap-3 border rounded-lg p-3 hover:shadow-sm transition-shadow"
                  >
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />

                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/product/${item.slug || item._id}`}
                        onClick={() => setIsCartOpen(false)}
                        className="font-medium text-sm hover:text-[#004488] line-clamp-2"
                      >
                        {item.name}
                      </Link>
                      <p className="text-lg font-bold text-[#004488] mt-1">
                        ৳{item.price}
                      </p>
                      {item.originalPrice && (
                        <p className="text-sm text-gray-500 line-through">
                          ৳{item.originalPrice}
                        </p>
                      )}

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => dispatch(decrementQty(item._id))}
                            className="p-2 hover:bg-gray-100"
                            aria-label="Decrease quantity"
                            disabled={item.quantity <= 1}
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-8 text-center font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => dispatch(incrementQty(item._id))}
                            className="p-2 hover:bg-gray-100"
                            aria-label="Increase quantity"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleQuickOrder(item)}
                            className="text-sm px-3 py-1 bg-[#004488] text-white rounded hover:bg-[#003366]"
                          >
                            Buy Now
                          </button>
                          <button
                            onClick={() => dispatch(removeFromCart(item._id))}
                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                            aria-label="Remove item"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16">
                  <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
                  <p className="text-gray-500 mb-6">Add items to get started</p>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="px-6 py-3 bg-[#004488] text-white rounded-lg hover:bg-[#003366]"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t p-4 space-y-4 bg-gray-50">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold">৳{totalPrice}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-green-600">
                      {totalPrice > 500 ? "FREE" : "৳50"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>৳{totalPrice + (totalPrice > 500 ? 0 : 50)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={() => setIsCartOpen(false)}
                    className="text-center border-2 border-[#004488] text-[#004488] py-3 rounded-lg hover:bg-[#004488] hover:text-white transition-colors"
                  >
                    View Cart
                  </Link>
                  <button
                    onClick={handleCheckout}
                    className="bg-[#C0A460] text-white py-3 rounded-lg hover:bg-[#b09450] transition-colors"
                  >
                    Checkout
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                  <Package size={16} />
                  <span>Free returns • Secure payment • 24/7 support</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className={`sticky top-0 z-40 bg-white border-b transition-shadow duration-300 ${
        isScrolled ? "shadow-lg" : "shadow-sm"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Row */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold text-[#004488] flex items-center gap-2"
              aria-label="TomartBD Home"
            >
              <div className="w-8 h-8 bg-[#004488] rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              Tomart<span className="text-[#C0A460]">BD</span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search for products, brands, and categories..."
                  className="w-full p-3 pl-12 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-[#004488]"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-[#004488] text-white px-6 py-2 rounded hover:bg-[#003366]"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 md:gap-6">
              {/* Search - Mobile */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                aria-label="Search"
              >
                <Search size={22} />
              </button>

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex items-center gap-2 hover:text-[#004488]"
                aria-label="Wishlist"
              >
                <Heart size={22} />
                <span className="text-sm hidden xl:inline">Wishlist</span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} />
                <span className="text-sm hidden xl:inline">Cart</span>
                {mounted && qty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C0A460] text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    {qty}
                  </span>
                )}
              </button>

              {/* User */}
              <Link
                href={user ? "/dashboard/user" : "/auth/login"}
                className="hidden md:flex items-center gap-2 hover:text-[#004488]"
                aria-label="User account"
              >
                <User size={22} />
                <span className="text-sm hidden xl:inline">
                  {user ? "Account" : "Login"}
                </span>
              </Link>

              {/* Mobile Menu */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Categories Navigation - Desktop */}
          <div className="hidden lg:flex items-center justify-between h-12 border-t">
            <div className="flex items-center gap-6">
              <button className="flex items-center gap-2 bg-[#004488] text-white px-4 py-2 rounded-lg hover:bg-[#003366]">
                <Menu size={18} />
                <span>All Categories</span>
                <ChevronDown size={16} />
              </button>
              
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={`/category/${category.slug}`}
                  className="font-medium hover:text-[#004488]"
                >
                  {category.name}
                </Link>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Link href="/deals" className="text-red-600 font-semibold hover:text-red-700">
                🔥 Today's Deals
              </Link>
              <Link href="/new-arrivals" className="text-green-600 font-semibold hover:text-green-700">
                🆕 New Arrivals
              </Link>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t py-4">
              <div className="grid grid-cols-2 gap-4">
                {categories.map((category) => (
                  <Link
                    key={category.slug}
                    href={`/category/${category.slug}`}
                    className="p-3 border rounded-lg hover:bg-gray-50 hover:border-[#004488]"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t space-y-3">
                <Link
                  href="/deals"
                  className="flex items-center gap-2 text-red-600 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔥 Today's Deals
                </Link>
                <Link
                  href="/new-arrivals"
                  className="flex items-center gap-2 text-green-600 font-semibold"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🆕 New Arrivals
                </Link>
                <Link
                  href="/track-order"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 Track Order
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
}