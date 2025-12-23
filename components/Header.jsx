"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signOut } from "next-auth/react";
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
  LogOut,
  Settings,
  PackageOpen,
  MapPin,
  CreditCard,
  Bell,
  HelpCircle,
  Star,
  History,
  UserCircle,
  ChevronRight,
  Phone,
} from "lucide-react";

import useLoginUser from "@/hooks/useAuth";
import {
  incrementQty,
  decrementQty,
  removeFromCart,
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
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  const userMenuRef = useRef(null);
  const cartRef = useRef(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setIsCartOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    dispatch({
      type: "cart/addToCart",
      payload: { ...item, quantity: 1 },
    });
    setIsCartOpen(false);
    router.push("/checkout");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop", hasDropdown: true },
    { name: "Categories", href: "/categories", hasDropdown: true },
    { name: "Deals", href: "/deals", badge: "Hot" },
    { name: "New Arrivals", href: "/new-arrivals" },
    { name: "Brands", href: "/brands" },
  ];

  const userMenuItems = user?.role === "admin" 
    ? [
        { icon: <Package size={18} />, label: "Admin Panel", href: "/dashboard/admin" },
        { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
        { icon: <Bell size={18} />, label: "Notifications", href: "/dashboard/notifications" },
        { divider: true },
        { icon: <LogOut size={18} />, label: "Logout", action: () => signOut({ callbackUrl: "/" }) },
      ]
    : [
        { icon: <UserCircle size={18} />, label: "My Profile", href: "/dashboard/user" },
        { icon: <PackageOpen size={18} />, label: "My Orders", href: "/dashboard/orders" },
        { icon: <Heart size={18} />, label: "Wishlist", href: "/wishlist" },
        { icon: <History size={18} />, label: "Order History", href: "/dashboard/order-history" },
        { icon: <CreditCard size={18} />, label: "Payment Methods", href: "/dashboard/payments" },
        { icon: <MapPin size={18} />, label: "Addresses", href: "/dashboard/addresses" },
        { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
        { divider: true },
        { icon: <HelpCircle size={18} />, label: "Help Center", href: "/help" },
        { icon: <Package size={18} />, label: "Track Order", href: "/track-order" },
        { divider: true },
        { icon: <LogOut size={18} />, label: "Logout", action: () => signOut({ callbackUrl: "/" }) },
      ];

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Living",
    "Beauty",
    "Sports",
    "Books",
    "Toys",
    "Automotive",
  ];

  return (
    <>
      {/* ================= TOP ANNOUNCEMENT BAR ================= */}
      <div className="bg-[#004488] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>Hotline: 09678-123456</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <Truck size={14} />
              <span>Free Shipping Over ৳2000</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={14} />
              <span>100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Package size={14} />
              <span>Easy Returns</span>
            </div>
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
                placeholder="Search products, brands, and categories..."
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
          ref={cartRef}
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
                      {totalPrice > 2000 ? "FREE" : "৳80"}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg font-bold pt-2 border-t">
                    <span>Total</span>
                    <span>৳{totalPrice + (totalPrice > 2000 ? 0 : 80)}</span>
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
                  <Shield size={16} />
                  <span>Secure payment • 24/7 support • Easy returns</span>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

      {/* ================= MAIN HEADER ================= */}
      <header className={`sticky top-0 z-40 bg-white transition-shadow duration-300 ${
        scrolled ? "shadow-lg border-b" : "border-b"
      }`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Main Header Row */}
          <div className="h-16 flex items-center justify-between">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center gap-2"
              aria-label="TomartBD Home"
            >
              <div className="relative w-10 h-10">
                <div className="absolute inset-0 bg-[#004488] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-xl">T</span>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#C0A460] rounded-full" />
              </div>
              <div>
                <span className="text-2xl font-bold text-[#004488]">Tomart</span>
                <span className="text-2xl font-bold text-[#C0A460]">BD</span>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden lg:block flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  placeholder="Search products, brands, and categories..."
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
                className="hidden md:flex items-center gap-2 hover:text-[#004488] group relative"
                aria-label="Wishlist"
              >
                <div className="relative">
                  <Heart size={22} className="group-hover:fill-[#C0A460]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C0A460] rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">3</span>
                  </div>
                </div>
                <span className="text-sm hidden xl:inline">Wishlist</span>
              </Link>

              {/* Cart */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg"
                aria-label="Open cart"
              >
                <ShoppingCart size={22} className="hover:stroke-[#004488]" />
                <span className="text-sm hidden xl:inline">Cart</span>
                {mounted && qty > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#C0A460] text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-bold">
                    {qty}
                  </span>
                )}
              </button>

              {/* User Account with Dropdown */}
              <div className="relative" ref={userMenuRef}>
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="hidden md:flex items-center gap-2 p-2 hover:bg-gray-100 rounded-lg group"
                      aria-label="Account menu"
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-transparent group-hover:border-[#C0A460]">
                        {user.image ? (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={32}
                            height={32}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#f8f5ec] flex items-center justify-center">
                            <User size={18} className="text-[#C0A460]" />
                          </div>
                        )}
                      </div>
                      <div className="hidden xl:block text-left">
                        <p className="text-sm font-medium">My Account</p>
                        <p className="text-xs text-gray-500">
                          {user.role === "admin" ? "Administrator" : "Premium Member"}
                        </p>
                      </div>
                      <ChevronDown size={16} className={`transition-transform ${isUserMenuOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="font-semibold text-gray-900">{user.name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          <span className="inline-block mt-1 px-2 py-1 bg-[#f8f5ec] text-[#C0A460] text-xs rounded-full">
                            {user.role === "admin" ? "Administrator" : "Premium Member"}
                          </span>
                        </div>
                        
                        <div className="py-2">
                          {userMenuItems.map((item, index) => (
                            <div key={index}>
                              {item.divider ? (
                                <div className="border-t border-gray-100 my-2" />
                              ) : item.href ? (
                                <Link
                                  href={item.href}
                                  className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#004488] transition-colors"
                                  onClick={() => setIsUserMenuOpen(false)}
                                >
                                  {item.icon}
                                  <span>{item.label}</span>
                                </Link>
                              ) : (
                                <button
                                  onClick={() => {
                                    item.action?.();
                                    setIsUserMenuOpen(false);
                                  }}
                                  className="flex items-center gap-3 w-full px-4 py-3 text-gray-700 hover:bg-gray-50 hover:text-[#004488] transition-colors text-left"
                                >
                                  {item.icon}
                                  <span>{item.label}</span>
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Mobile User Button */}
                    <Link
                      href="/dashboard/user"
                      className="md:hidden p-2 hover:bg-gray-100 rounded-full"
                      aria-label="User account"
                    >
                      <User size={22} />
                    </Link>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    className="hidden md:flex items-center gap-2 hover:text-[#004488]"
                    aria-label="Login"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#f8f5ec] flex items-center justify-center">
                      <User size={18} className="text-[#C0A460]" />
                    </div>
                    <span className="text-sm hidden xl:inline">Login</span>
                  </Link>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-full"
                aria-label="Menu"
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Navigation Menu (Desktop) */}
          <nav className="hidden lg:flex items-center justify-between py-3 border-t border-gray-100">
            <div className="flex items-center gap-8">
              {navigationLinks.map((link) => (
                <div key={link.name} className="relative group">
                  <Link
                    href={link.href}
                    className="flex items-center gap-1 text-gray-700 hover:text-[#004488] transition-colors font-medium py-2"
                  >
                    {link.name}
                    {link.badge && (
                      <span className="ml-1 px-2 py-0.5 bg-[#C0A460] text-white text-xs rounded-full">
                        {link.badge}
                      </span>
                    )}
                    {link.hasDropdown && <ChevronDown size={16} />}
                  </Link>
                  
                  {/* Dropdown for Shop */}
                  {link.hasDropdown && link.name === "Shop" && (
                    <div className="absolute left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40">
                      <Link href="/shop/all" className="block px-4 py-2 hover:bg-gray-50">
                        All Products
                      </Link>
                      <Link href="/shop/bestsellers" className="block px-4 py-2 hover:bg-gray-50">
                        Bestsellers
                      </Link>
                      <Link href="/shop/featured" className="block px-4 py-2 hover:bg-gray-50">
                        Featured
                      </Link>
                      <div className="border-t border-gray-100 my-2" />
                      <Link href="/shop/sale" className="block px-4 py-2 text-[#C0A460] font-medium">
                        Sale Items
                      </Link>
                    </div>
                  )}

                  {/* Dropdown for Categories */}
                  {link.hasDropdown && link.name === "Categories" && (
                    <div className="absolute left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-40 grid grid-cols-2">
                      {categories.slice(0, 8).map((cat) => (
                        <Link
                          key={cat}
                          href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                          className="px-4 py-2 hover:bg-gray-50 text-sm"
                        >
                          {cat}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            <div className="flex items-center gap-4 text-sm">
              <Link href="/track-order" className="text-[#004488] hover:underline">
                Track Order
              </Link>
              <Link href="/help" className="text-[#004488] hover:underline">
                Help Center
              </Link>
            </div>
          </nav>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-gray-200 py-4">
              {/* Mobile Search */}
              <form onSubmit={handleSearch} className="mb-4 px-4">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg"
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                </div>
              </form>

              {/* User Section in Mobile Menu */}
              {user ? (
                <div className="p-4 bg-gray-50 rounded-lg mb-4 mx-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#C0A460]">
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name}
                          width={48}
                          height={48}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#f8f5ec] flex items-center justify-center">
                          <User size={24} className="text-[#C0A460]" />
                        </div>
                      )}
                    </div>
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-1 bg-[#f8f5ec] text-[#C0A460] text-xs rounded-full">
                        {user.role === "admin" ? "Administrator" : "Premium Member"}
                      </span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-3">
                    <Link
                      href="/dashboard/orders"
                      className="text-center py-2 bg-white border rounded-lg text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => {
                        signOut({ callbackUrl: "/" });
                        setIsMenuOpen(false);
                      }}
                      className="text-center py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-4 bg-gray-50 rounded-lg mb-4 mx-4">
                  <p className="font-medium mb-2">Welcome to TomartBD</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      className="text-center py-2 bg-[#004488] text-white rounded-lg text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      className="text-center py-2 bg-white border border-[#004488] text-[#004488] rounded-lg text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}

              {/* Mobile Navigation */}
              <div className="space-y-1 px-4">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className="px-2 py-1 bg-[#C0A460] text-white text-xs rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                ))}
              </div>

              {/* Quick Categories in Mobile */}
              <div className="mt-6 px-4">
                <h3 className="font-semibold mb-3 text-gray-700">Categories</h3>
                <div className="grid grid-cols-2 gap-2">
                  {categories.map((cat) => (
                    <Link
                      key={cat}
                      href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                      className="px-3 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Quick Links in Mobile */}
              <div className="mt-6 pt-4 border-t space-y-3 px-4">
                <Link
                  href="/track-order"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  📦 Track Order
                </Link>
                <Link
                  href="/help"
                  className="flex items-center gap-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ❓ Help Center
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* ================= QUICK CATEGORIES BAR ================= */}
      <div className="hidden lg:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between overflow-x-auto py-2">
            <div className="flex space-x-8">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-sm text-gray-600 hover:text-[#004488] whitespace-nowrap py-1 px-2 hover:bg-white rounded transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">Daily Deals:</span>
              <Link href="/deals/flash" className="text-sm text-red-600 font-semibold hover:underline">
                ⚡ Flash Sale
              </Link>
              <Link href="/deals/clearance" className="text-sm text-green-600 font-semibold hover:underline">
                🛒 Clearance
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}