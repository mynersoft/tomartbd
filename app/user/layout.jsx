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
import UserHeader from '@/components/Header/UserHeader';
import UserSidebar from '../../components/Dashboard/UserSidebar';

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

      <UserSidebar />
      
     

      {/* ================= Main ================= */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
        {/* Header */}

        <div className="p-6">
          <UserHeader />
          {children}
        </div>
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
