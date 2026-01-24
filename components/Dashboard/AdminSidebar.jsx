
'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebar } from '@/store/slices/uiSlice';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Home,
  Package,
  ShoppingCart,
  Users,
  Layers,
  Tag,
  FileText,
  CreditCard,
  BarChart,
  Zap,
  Settings,
  LogOut,
  ChevronRight,
  Bell,
  TrendingUp,
} from 'lucide-react';
import { signOut } from 'next-auth/react';
import { menuItems } from '@/constants/adminMenu';

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

  const [stats, setStats] = useState({ orders: 42, pending: 8 });



  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };

  /* 🔹 Auto sidebar behavior based on screen size */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        dispatch(setSidebar(false)); // mobile → closed
      } else {
        dispatch(setSidebar(true)); // desktop → open
      }
    };

    handleResize(); // initial
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dispatch]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const isActive = (href) => {
    if (href === '/admin') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside
      className={`
        fixed md:relative
        top-0 left-0 h-full
        flex flex-col
        bg-linear-to-b from-gray-900 to-gray-800
        text-white
        shadow-2xl
        transition-all duration-300 ease-in-out
        z-50
        w-64
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen && !isMobile ? 'md:w-20' : ''}
      `}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div
            className={`flex items-center gap-3 transition-all ${!isOpen && !isMobile ? 'justify-center' : ''}`}
          >
            <div className="w-10 h-10 rounded-xl bg-linear-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">A</span>
            </div>
            {(!isMobile || isOpen) && (
              <div
                className={`transition-opacity duration-300 ${!isOpen && !isMobile ? 'hidden' : 'block'}`}
              >
                <h2 className="text-lg font-bold bg-linear-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  AdminHub
                </h2>
                <p className="text-xs text-gray-400">Dashboard v2.0</p>
              </div>
            )}
          </div>

          {isMobile && (
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <div className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={handleLinkClick}
                className={`
                  flex items-center gap-3
                  px-4 py-3
                  rounded-xl
                  transition-all duration-200
                  group
                  ${
                    active
                      ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500'
                      : 'hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-600'
                  }
                  ${!isOpen && !isMobile ? 'justify-center px-2' : ''}
                `}
                title={!isOpen && !isMobile ? item.name : ''}
              >
                <div
                  className={`
                  p-2 rounded-lg
                  ${
                    active
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500'
                      : 'bg-gray-800 group-hover:bg-gray-700'
                  }
                `}
                >
                  {item.icon}
                </div>

                {(!isMobile || isOpen) && (
                  <span
                    className={`font-medium transition-all ${!isOpen && !isMobile ? 'hidden' : 'block'}`}
                  >
                    {item.name}
                  </span>
                )}

                {active && (!isMobile || isOpen) && (
                  <ChevronRight
                    className={`ml-auto w-4 h-4 animate-pulse ${!isOpen && !isMobile ? 'hidden' : 'block'}`}
                  />
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div
          className={`mt-8 px-4 transition-all ${!isOpen && !isMobile ? 'hidden' : 'block'}`}
        >
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <Bell className="w-3 h-3" />
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Today&apos;s Orders</span>
                <span className="font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  {stats.orders}
                </span>
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Pending</span>
                <span className="font-bold text-yellow-400">8</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
