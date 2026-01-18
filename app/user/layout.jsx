'use client';

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleSidebar, setSidebar } from '@/store/slices/uiSlice';
import {
  LayoutDashboard,
  Package,
  Settings,
  Menu,
  X,
  Search,
  Bell,
  ShoppingCart,
} from 'lucide-react';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { sidebarOpen } = useSelector((state) => state.ui);

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

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* ================= Sidebar ================= */}
      <aside
        className={`
          fixed inset-y-0 z-50
          bg-emerald-900 text-white flex flex-col
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo + Toggle */}
        <div className="p-4 flex items-center justify-between">
          {sidebarOpen ? (
            <span className="text-xl font-bold tracking-tight text-emerald-400">
              TOMART<span className="text-orange-400">BD</span>
            </span>
          ) : (
            <ShoppingCart className="w-8 h-8 text-emerald-400 mx-auto" />
          )}

          {/* Toggle button */}
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="p-1 rounded hover:bg-emerald-800"
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 mt-6 px-3 space-y-2">
          <NavItem
            icon={<LayoutDashboard />}
            label="Dashboard"
            active
            isOpen={sidebarOpen}
          />
          <NavItem icon={<Package />} label="Combos" isOpen={sidebarOpen} />
          <NavItem
            icon={<ShoppingCart />}
            label="Orders"
            isOpen={sidebarOpen}
          />
          <NavItem icon={<Settings />} label="Settings" isOpen={sidebarOpen} />
        </nav>
      </aside>

      {/* ================= Main ================= */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b px-6 py-4 flex justify-between items-center">
          {/* Search */}
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              placeholder="Search everything..."
              className="pl-10 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 w-64"
            />
          </div>

          {/* Right */}
          <div className="flex items-center gap-6">
            <button className="relative text-slate-500 hover:text-emerald-600">
              <Bell className="w-5 h-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="flex items-center gap-3">
              <div className="hidden md:block text-right">
                <p className="text-sm font-semibold">Admin User</p>
                <p className="text-xs text-slate-500">Store Manager</p>
              </div>
              <img
                src="https://picsum.photos/40"
                className="w-10 h-10 rounded-full border-2 border-emerald-100"
              />
            </div>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

/* ================= Nav Item ================= */
const NavItem = ({ icon, label, active, isOpen }) => (
  <div
    className={`
      flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition
      ${active ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/60'}
      ${!isOpen ? 'justify-center' : ''}
    `}
  >
    <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
    {isOpen && <span className="font-medium">{label}</span>}
  </div>
);

export default Layout;
