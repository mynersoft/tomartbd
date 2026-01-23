"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    initCartFromStorage,
    selectCartTotalItems
} from "@/store/slices/cartSlice";

import {
    HiHome,
    HiShoppingBag,
    HiHeart,
    HiChatBubbleLeftRight,
    HiUser
} from "react-icons/hi2";
import { FaShoppingCart } from "react-icons/fa";
import {
    FiHome,
    FiShoppingBag,
    FiHeart,
    FiMessageCircle,
    FiUser
} from "react-icons/fi";

const BottomNavigation = ({ activeTab, setActiveTab }) => {
    const pathname = usePathname();
    const { data: session } = useSession();
    const qty = useSelector(selectCartTotalItems);
    const isCartHydrated = useSelector(state => state.cart._hydrated);
    const dispatch = useDispatch();
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [isClient, setIsClient] = useState(false);

const {qty:wishlist}= useSelector(state => state.wishlist);
    


    const wishlistCount = wishlist; // Replace with actual wishlist count

    // Initialize client and cart
    useEffect(() => {
        setIsClient(true);
        dispatch(initCartFromStorage());
    }, [dispatch]);

    // Scroll handler (client-side only)
    useEffect(() => {
        if (!isClient) return;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < 100) {
                setShowNav(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setShowNav(false);
            } else {
                setShowNav(true);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY, isClient]);

    const navItems = [
        {
            name: "Home",
            href: "/",
            icon: FiHome,
            activeIcon: HiHome
        },
        {
            name: "Shop",
            href: "/shop",
            icon: FiShoppingBag,
            activeIcon: HiShoppingBag
        },
        {
            name: "Wishlist",
            href: "/wishlist",
            icon: FiHeart,
            activeIcon: HiHeart,
            badge: wishlistCount > 0 ? wishlistCount : null
        },
        {
            name: "Cart",
            href: "/cart",
            icon: FaShoppingCart,
            activeIcon: FaShoppingCart,
            badge: isCartHydrated && qty > 0 ? qty : null // Only show badge after hydration
        },
        {
            name: "Chat",
            href: "/messages",
            icon: FiMessageCircle,
            activeIcon: HiChatBubbleLeftRight,
            badge: 5 // Replace with actual unread message count
        },
        {
            name: session ? "Account" : "Login",
            href: session ? "/dashboard/user" : "/auth/login",
            icon: FiUser,
            activeIcon: HiUser
        }
    ];

    const isActive = item => {
        return (
            pathname === item.href ||
            activeTab === item.name ||
            (item.href !== "/" && pathname.startsWith(item.href))
        );
    };

    // Only render badge after hydration
    const shouldShowCartBadge = isClient && isCartHydrated && qty > 0;
    const shouldShowOtherBadge = badge => isClient && badge && badge > 0;

    return (
        <>
            {/* Desktop Floating Action Button for Mobile View */}
            <div className="lg:hidden fixed bottom-20 right-4 z-40">
                <Link
                    href="/cart"
                    onClick={() => setActiveTab("Cart")}
                    className="relative group"
                >
                    <div className="w-14 h-14 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95">
                        <FaShoppingCart className="w-6 h-6 text-white" />
                        {shouldShowCartBadge && (
                            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white">
                                {qty > 9 ? "9+" : qty}
                            </span>
                        )}
                    </div>
                    <div className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                        Cart ({qty} items)
                    </div>
                </Link>
            </div>

            {/* Main Bottom Navigation */}
            <nav
                className={`fixed bottom-0 left-0 right-0 z-40 transition-transform duration-300 ${
                    showNav ? "translate-y-0" : "translate-y-full"
                }`}
            >
                <div className="absolute inset-0 backdrop-blur-lg bg-white/90 dark:bg-gray-900/95 border-t border-gray-200/50 dark:border-gray-700/50" />

                <div className="relative max-w-2xl mx-auto">
                    <div className="flex justify-around items-center px-2 py-2">
                        {navItems.map(item => {
                            const active = isActive(item);
                            const Icon = active ? item.activeIcon : item.icon;

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`relative flex flex-col items-center justify-center flex-1 p-2 rounded-xl transition-all duration-200 group ${
                                        active
                                            ? "text-pink-600 dark:text-pink-400"
                                            : "text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                                    }`}
                                >
                                    {active && (
                                        <div className="absolute -top-2 w-10 h-1 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
                                    )}

                                    <div className="relative">
                                        <Icon
                                            className={`w-6 h-6 transition-transform duration-200 ${
                                                active
                                                    ? "scale-110"
                                                    : "group-hover:scale-105"
                                            }`}
                                        />

                                        {item.name === "Cart"
                                            ? shouldShowCartBadge && (
                                                  <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center px-1 text-xs font-bold rounded-full bg-red-500 text-white">
                                                      {item.badge > 9
                                                          ? "9+"
                                                          : item.badge}
                                                  </span>
                                              )
                                            : shouldShowOtherBadge(
                                                  item.badge
                                              ) && (
                                                  <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center px-1 text-xs font-bold rounded-full bg-pink-500 text-white">
                                                      {item.badge > 9
                                                          ? "9+"
                                                          : item.badge}
                                                  </span>
                                              )}
                                    </div>

                                    <span
                                        className={`text-[10px] font-semibold mt-1 transition-all duration-200 ${
                                            active ? "scale-110" : ""
                                        }`}
                                    >
                                        {item.name}
                                    </span>

                                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/0 to-purple-600/0 rounded-xl transition-all duration-300 group-hover:from-pink-500/5 group-hover:to-purple-600/5" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Desktop Side Navigation */}
            <nav className="hidden lg:flex fixed left-0 top-1/2 transform -translate-y-1/2 z-40 ml-4">
                <div className="flex flex-col items-center space-y-3 bg-white/90 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-3 shadow-xl border border-gray-200/50 dark:border-gray-700/50">
                    {navItems.map(item => {
                        const active = isActive(item);
                        const Icon = active ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveTab(item.name)}
                                className={`relative flex flex-col items-center justify-center p-3 rounded-xl transition-all duration-200 group ${
                                    active
                                        ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                                        : "text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400 hover:bg-gray-50 dark:hover:bg-gray-800"
                                }`}
                            >
                                <div className="relative">
                                    <Icon
                                        className={`w-6 h-6 transition-transform duration-200 ${
                                            active
                                                ? "scale-110"
                                                : "group-hover:scale-105"
                                        }`}
                                    />

                                    {item.name === "Cart"
                                        ? shouldShowCartBadge && (
                                              <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center px-1 text-xs font-bold rounded-full bg-red-500 text-white">
                                                  {item.badge > 9
                                                      ? "9+"
                                                      : item.badge}
                                              </span>
                                          )
                                        : shouldShowOtherBadge(item.badge) && (
                                              <span className="absolute -top-2 -right-2 min-w-5 h-5 flex items-center justify-center px-1 text-xs font-bold rounded-full bg-pink-500 text-white">
                                                  {item.badge > 9
                                                      ? "9+"
                                                      : item.badge}
                                              </span>
                                          )}
                                </div>

                                <span className="text-[10px] font-semibold mt-2">
                                    {item.name}
                                </span>
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* Tablet Bottom Navigation */}
            <nav className="hidden md:flex lg:hidden fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
                <div className="flex items-center bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg rounded-2xl p-2 shadow-2xl border border-gray-200/50 dark:border-gray-700/50">
                    {navItems.map(item => {
                        const active = isActive(item);
                        const Icon = active ? item.activeIcon : item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveTab(item.name)}
                                className={`relative flex items-center p-3 rounded-xl transition-all duration-200 group mx-1 ${
                                    active
                                        ? "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20"
                                        : "text-gray-600 dark:text-gray-400 hover:text-pink-500 dark:hover:text-pink-400"
                                }`}
                            >
                                <div className="relative">
                                    <Icon
                                        className={`w-5 h-5 transition-transform duration-200 ${
                                            active
                                                ? "scale-110"
                                                : "group-hover:scale-105"
                                        }`}
                                    />

                                    {item.name === "Cart"
                                        ? shouldShowCartBadge && (
                                              <span className="absolute -top-2 -right-2 min-w-4 h-4 flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-red-500 text-white">
                                                  {item.badge > 9
                                                      ? "9+"
                                                      : item.badge}
                                              </span>
                                          )
                                        : shouldShowOtherBadge(item.badge) && (
                                              <span className="absolute -top-2 -right-2 min-w-4 h-4 flex items-center justify-center px-1 text-[10px] font-bold rounded-full bg-pink-500 text-white">
                                                  {item.badge > 9
                                                      ? "9+"
                                                      : item.badge}
                                              </span>
                                          )}
                                </div>

                                {active && (
                                    <span className="ml-2 text-sm font-semibold">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </>
    );
};

export default BottomNavigation;
