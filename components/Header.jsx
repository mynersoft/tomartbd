"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import {
  Search,
  ShoppingCart,
  User,
  Heart,
  Menu,
  X,
  ChevronDown,
  Phone,
  MapPin,
  Shield,
  Truck,
  LogOut,
  Settings,
  Package,
  Bell
} from "lucide-react";
import useLoginUser from "@/hooks/useAuth";

export default function Header() {
  const { qty } = useSelector((state) => state.cart);
  const { user } = useLoginUser();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const navigationLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop", hasDropdown: true },
    { name: "Categories", href: "/categories", hasDropdown: true },
    { name: "Deals", href: "/deals", badge: "Hot" },
    { name: "New Arrivals", href: "/new" },
    { name: "Brands", href: "/brands" },
  ];

  const userMenuItems = user?.role === "admin" ? [
    { icon: <Package size={18} />, label: "Admin Panel", href: "/dashboard/admin" },
    { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
    { icon: <Bell size={18} />, label: "Notifications", href: "/dashboard/notifications" },
    { divider: true },
    { icon: <LogOut size={18} />, label: "Logout", action: () => signOut({ callbackUrl: "/" }) },
  ] : [
    { icon: <User size={18} />, label: "My Profile", href: "/dashboard/user" },
    { icon: <Package size={18} />, label: "My Orders", href: "/dashboard/orders" },
    { icon: <Heart size={18} />, label: "Wishlist", href: "/wishlist" },
    { icon: <Settings size={18} />, label: "Settings", href: "/dashboard/settings" },
    { divider: true },
    { icon: <LogOut size={18} />, label: "Logout", action: () => signOut({ callbackUrl: "/" }) },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-[#004488] text-white text-sm py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>Hotline: 09678-123456</span>
            </div>
            <div className="hidden md:flex items-center gap-2">
              <MapPin size={14} />
              <span>Free Shipping Over ৳2000</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Shield size={14} />
              <span>100% Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck size={14} />
              <span>Easy Returns</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-lg" : "bg-white border-b"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Main Header Row */}
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link href="/" className="flex items-center gap-2">
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
            </div>

            {/* Search Bar (Desktop) */}
            <div className="hidden lg:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="w-full">
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products, brands, and categories..."
                    className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#004488] focus:border-transparent outline-none"
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                  <button
                    type="submit"
                    className="absolute right-2 top-2 bg-[#004488] text-white px-4 py-2 rounded-md hover:bg-[#003366] transition-colors"
                  >
                    Search
                  </button>
                </div>
              </form>
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="hidden md:flex flex-col items-center text-gray-700 hover:text-[#004488] transition-colors group relative"
              >
                <div className="relative">
                  <Heart size={22} className="group-hover:fill-[#C0A460]" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#C0A460] rounded-full flex items-center justify-center">
                    <span className="text-[10px] text-white font-bold">3</span>
                  </div>
                </div>
                <span className="text-xs mt-1">Wishlist</span>
              </Link>

              {/* Cart */}
              <Link
                href="/cart"
                className="flex flex-col items-center text-gray-700 hover:text-[#004488] transition-colors group relative"
              >
                <div className="relative">
                  <ShoppingCart size={22} className="group-hover:stroke-[#004488]" />
                  {mounted && qty > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#C0A460] text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {qty}
                    </span>
                  )}
                </div>
                <span className="text-xs mt-1">Cart</span>
              </Link>

              {/* User Menu */}
              <div className="relative">
                {user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex flex-col items-center text-gray-700 hover:text-[#004488] transition-colors group"
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
                      <span className="text-xs mt-1">Account</span>
                    </button>

                    {/* User Dropdown */}
                    {isUserMenuOpen && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setIsUserMenuOpen(false)}
                        />
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
                      </>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center">
                    <Link
                      href="/auth/login"
                      className="flex flex-col items-center text-gray-700 hover:text-[#004488] transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#f8f5ec] flex items-center justify-center">
                        <User size={18} className="text-[#C0A460]" />
                      </div>
                      <span className="text-xs mt-1">Login</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden text-gray-700 hover:text-[#004488]"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Navigation Menu (Desktop) */}
          <nav className="hidden lg:flex items-center justify-center space-x-8 py-3 border-t border-gray-100">
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
                
                {/* Dropdown Example for Shop */}
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
              </div>
            ))}
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
                    placeholder="Search..."
                    className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg"
                  />
                  <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                </div>
              </form>

              {/* Mobile Navigation */}
              <div className="space-y-1">
                {navigationLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center justify-between px-4 py-3 text-gray-700 hover:bg-gray-50"
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
                
                {!user && (
                  <>
                    <div className="border-t border-gray-200 my-2" />
                    <Link
                      href="/auth/login"
                      className="flex items-center gap-2 px-4 py-3 text-[#004488] font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <User size={18} />
                      Login / Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Quick Categories Bar */}
      <div className="hidden lg:block bg-gray-50 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between overflow-x-auto py-2">
            <div className="flex space-x-8">
              {["Electronics", "Fashion", "Home & Living", "Beauty", "Sports", "Books", "Toys"].map((cat) => (
                <Link
                  key={cat}
                  href={`/category/${cat.toLowerCase()}`}
                  className="text-sm text-gray-600 hover:text-[#004488] whitespace-nowrap py-1 px-2 hover:bg-white rounded transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <Link href="/track-order" className="text-sm text-[#004488] hover:underline">
                Track Order
              </Link>
              <Link href="/help" className="text-sm text-[#004488] hover:underline">
                Help Center
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}