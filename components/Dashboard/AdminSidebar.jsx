<<<<<<< HEAD
// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";

// export default function AdminSidebar({ open, setOpen, isMobile }) {
//   const pathname = usePathname();

//   const menu = [
//     { name: "Dashboard", href: "/admin", icon: "📊" },
//     { name: "Products", href: "/admin/products", icon: "🛍️" },
//     { name: "Orders", href: "/admin/orders", icon: "📦" },
//     { name: "Users", href: "/admin/users", icon: "👥" },
//     { name: "Combos", href: "/admin/combos", icon: "📦" },
//     { name: "Bogo", href: "/admin/bogo", icon: "🆓" },
//     { name: "Blog", href: "/admin/blog", icon: "📝" },
//     { name: "Vouchers", href: "/admin/vouchers", icon: "🎫" },
//     { name: "Reports", href: "/admin/reports", icon: "📈" },
//     { name: "Live Orders", href: "/admin/live-orders", icon: "⚡" },
//     { name: "Analytics", href: "/admin/analytics", icon: "📊" },
//   ];

//   // Close sidebar when clicking outside on mobile
//   const handleLinkClick = () => {
//     if (isMobile) {
//       setOpen(false);
//     }
//   };

//   return (
//     <>
//       {/* Sidebar Container */}
//       <aside
//         className={`
//           fixed md:static
//           top-0 left-0 h-full
//           flex flex-col
//           bg-gray-900 text-white
//           transition-all duration-300 ease-in-out
//           z-50
//           ${isMobile ? 'w-64' : 'w-64'}
//           ${open ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
//           ${isMobile ? 'shadow-2xl' : 'shadow-lg'}
//         `}
//       >
//         {/* Logo/Brand Section */}
//         <div className="p-6 border-b border-gray-800">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center gap-3">
//               <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
//                 <span className="text-xl font-bold">A</span>
//               </div>
//               <div>
//                 <h2 className="text-lg font-bold">AdminHub</h2>
//                 <p className="text-xs text-gray-400">Dashboard v2.0</p>
//               </div>
//             </div>

//             {/* Close button for mobile */}
//             <button
//               onClick={() => setOpen(false)}
//               className="md:hidden p-1 hover:bg-gray-800 rounded"
//               aria-label="Close sidebar"
//             >
//               <svg
//                 className="w-5 h-5"
//                 fill="none"
//                 stroke="currentColor"
//                 viewBox="0 0 24 24"
//               >
//                 <path
//                   strokeLinecap="round"
//                   strokeLinejoin="round"
//                   strokeWidth={2}
//                   d="M6 18L18 6M6 6l12 12"
//                 />
//               </svg>
//             </button>
//           </div>
//         </div>

//         {/* Navigation Menu */}
// <nav className="flex-1 overflow-y-auto py-4 px-3">
//   <div className="space-y-1">
//     {menu.map((item) => {
//       const isActive = pathname === item.href ||
//         (item.href !== "/admin" && pathname.startsWith(item.href));

//       return (
//         <Link
//           key={item.href}
//           href={item.href}
//           onClick={handleLinkClick}
//           className={`
//             flex items-center gap-3
//             px-4 py-3
//             rounded-lg
//             transition-all duration-200
//             ${isActive
//               ? 'bg-blue-600 text-white shadow-md'
//               : 'hover:bg-gray-800 hover:text-white'
//             }
//             group
//           `}
//         >
//           <span className="text-lg">{item.icon}</span>
//           <span className="font-medium">{item.name}</span>

//           {/* Active indicator */}
//           {isActive && (
//             <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
//           )}

//           {/* Hover indicator */}
//           {!isActive && (
//             <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
//               →
//             </span>
//           )}
//         </Link>
//       );
//     })}
//   </div>

//   {/* Divider */}
//   <div className="my-6 px-4">
//     <div className="h-px bg-gray-800"></div>
//   </div>

//   {/* Quick Stats (Optional) */}
//   <div className="px-4 mb-6">
//     <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3">
//       Quick Stats
//     </h3>
//     <div className="space-y-2">
//       <div className="flex justify-between items-center text-sm">
//         <span className="text-gray-300">Today's Orders</span>
//         <span className="font-bold text-green-400">42</span>
//       </div>
//       <div className="flex justify-between items-center text-sm">
//         <span className="text-gray-300">Pending</span>
//         <span className="font-bold text-yellow-400">8</span>
//       </div>
//     </div>
//   </div>
// </nav>

//         {/* Logout Section */}
//         <div className="p-4 border-t border-gray-800">
//           <button
//             onClick={() => {
//               handleLinkClick();
//               alert("Logout");
//             }}
//             className="
//               w-full
//               flex items-center justify-center gap-2
//               px-4 py-3
//               bg-red-900/30 hover:bg-red-800/50
//               text-red-300 hover:text-white
//               rounded-lg
//               transition-all duration-200
//               group
//             "
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             <span className="font-medium">Logout</span>
//           </button>

//           {/* Admin Info */}
//           <div className="mt-4 pt-4 border-t border-gray-800">
//             <div className="flex items-center gap-3">
//               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
//                 <span className="text-sm font-bold">A</span>
//               </div>
//               <div>
//                 <p className="text-sm font-medium">Admin User</p>
//                 <p className="text-xs text-gray-400">admin@example.com</p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </aside>
//     </>
//   );
// }

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
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const { sidebarOpen } = useSelector((state) => state.ui);
=======
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  Home, Package, ShoppingCart, Users, 
  Layers, Tag, FileText, CreditCard, 
  BarChart, Zap, Settings, LogOut,
  ChevronRight, Bell, TrendingUp
} from 'lucide-react';
import { signOut } from 'next-auth/react';

const AdminSidebar = ({ isOpen, onClose, isMobile }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [stats, setStats] = useState({ orders: 42, pending: 8 });

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: <Home className="w-5 h-5" /> },
    { name: "Products", href: "/admin/products", icon: <Package className="w-5 h-5" /> },
    { name: "Orders", href: "/admin/orders", icon: <ShoppingCart className="w-5 h-5" /> },
    { name: "Users", href: "/admin/users", icon: <Users className="w-5 h-5" /> },
    { name: "Combos", href: "/admin/combos", icon: <Layers className="w-5 h-5" /> },
    { name: "BOGO", href: "/admin/bogo", icon: <Tag className="w-5 h-5" /> },
    { name: "Blog", href: "/admin/blog", icon: <FileText className="w-5 h-5" /> },
    { name: "Vouchers", href: "/admin/vouchers", icon: <CreditCard className="w-5 h-5" /> },
    { name: "Reports", href: "/admin/reports", icon: <BarChart className="w-5 h-5" /> },
    { name: "Live Orders", href: "/admin/live-orders", icon: <Zap className="w-5 h-5" /> },
    { name: "Analytics", href: "/admin/analytics", icon: <TrendingUp className="w-5 h-5" /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings className="w-5 h-5" /> },
  ];

>>>>>>> df7b6111019570a53bd71875115c7701408b38e7
  const handleLinkClick = () => {
    if (isMobile) {
      onClose();
    }
  };
  const menu = [
    { name: 'Dashboard', href: '/admin', icon: '📊' },
    { name: 'Products', href: '/admin/products', icon: '🛍️' },
    { name: 'Orders', href: '/admin/orders', icon: '📦' },
    { name: 'Users', href: '/admin/users', icon: '👥' },
    { name: 'Combos', href: '/admin/combos', icon: '📦' },
    { name: 'Bogo', href: '/admin/bogo', icon: '🆓' },
    { name: 'Blog', href: '/admin/blog', icon: '📝' },
    { name: 'Vouchers', href: '/admin/vouchers', icon: '🎫' },
    { name: 'Reports', href: '/admin/reports', icon: '📈' },
    { name: 'Live Orders', href: '/admin/live-orders', icon: '⚡' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📊' },
  ];

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
<<<<<<< HEAD
    <div className="flex min-h-screen bg-slate-50">
      {/* ================= Sidebar ================= */}
      <aside
        className={`
          fixed inset-y-0 z-50  top-15 pt-8
          bg-emerald-900 text-white flex flex-col
          transition-all duration-300
          ${sidebarOpen ? 'w-64' : 'w-20'}
        `}
      >
        {/* Logo + Toggle */}
        <div className="p-2 flex items-center justify-between">
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
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="space-y-1">
            {menu.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== '/admin' && pathname.startsWith(item.href));

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleLinkClick}
                  className={`
                    flex items-center gap-3
                    px-4 py-3
                    rounded-lg
                    transition-all duration-200
                    ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'hover:bg-gray-800 hover:text-white'
                    }
                    group
                  `}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>

                  {/* Active indicator */}
                  {isActive && (
                    <span className="ml-auto w-2 h-2 bg-white rounded-full"></span>
                  )}

                  {/* Hover indicator */}
                  {!isActive && (
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                      →
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Divider */}
          <div className="my-6 px-4">
            <div className="h-px bg-gray-800"></div>
          </div>

          {/* Quick Stats (Optional) */}
          <div className="px-4 mb-6">
            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3">
=======
    <aside
      className={`
        fixed md:relative
        top-0 left-0 h-full
        flex flex-col
        bg-gradient-to-b from-gray-900 to-gray-800
        text-white
        shadow-2xl
        transition-all duration-300 ease-in-out
        z-50
        w-64
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        ${!isOpen && !isMobile ? 'md:w-20' : ''}
      `}
    >
      {/* Logo/Brand */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center justify-between">
          <div className={`flex items-center gap-3 transition-all ${!isOpen && !isMobile ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg">
              <span className="text-xl font-bold">A</span>
            </div>
            {(!isMobile || isOpen) && (
              <div className={`transition-opacity duration-300 ${!isOpen && !isMobile ? 'hidden' : 'block'}`}>
                <h2 className="text-lg font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
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
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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
                  ${active 
                    ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 text-white border-l-4 border-blue-500' 
                    : 'hover:bg-gray-800/50 hover:border-l-4 hover:border-gray-600'
                  }
                  ${!isOpen && !isMobile ? 'justify-center px-2' : ''}
                `}
                title={!isOpen && !isMobile ? item.name : ''}
              >
                <div className={`
                  p-2 rounded-lg
                  ${active 
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500' 
                    : 'bg-gray-800 group-hover:bg-gray-700'
                  }
                `}>
                  {item.icon}
                </div>
                
                {(!isMobile || isOpen) && (
                  <span className={`font-medium transition-all ${!isOpen && !isMobile ? 'hidden' : 'block'}`}>
                    {item.name}
                  </span>
                )}
                
                {active && (!isMobile || isOpen) && (
                  <ChevronRight className={`ml-auto w-4 h-4 animate-pulse ${!isOpen && !isMobile ? 'hidden' : 'block'}`} />
                )}
              </Link>
            );
          })}
        </div>

        {/* Quick Stats */}
        <div className={`mt-8 px-4 transition-all ${!isOpen && !isMobile ? 'hidden' : 'block'}`}>
          <div className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
            <h3 className="text-xs uppercase text-gray-400 font-semibold mb-3 flex items-center gap-2">
              <Bell className="w-3 h-3" />
>>>>>>> df7b6111019570a53bd71875115c7701408b38e7
              Quick Stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Today's Orders</span>
                <span className="font-bold text-green-400 bg-green-400/10 px-2 py-1 rounded">
                  {stats.orders}
                </span>
              </div>
<<<<<<< HEAD
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Pending</span>
                <span className="font-bold text-yellow-400">8</span>
              </div>
            </div>
          </div>
        </nav>
      </aside>

      {/* ================= Main ================= */}
      <main
        className={`
          flex-1 transition-all duration-300
          ${sidebarOpen ? 'ml-64' : 'ml-20'}
        `}
      >
      

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
};

/* ================= Nav Item ================= */
// const NavItem = ({ icon, label, active, isOpen }) => (
// <div
//   className={`
//     flex items-center gap-3 px-3 py-3 rounded-lg cursor-pointer transition
//     ${active ? 'bg-emerald-800 text-white' : 'text-emerald-100 hover:bg-emerald-800/60'}
//     ${!isOpen ? 'justify-center' : ''}
//   `}
// >
//   <div className="w-6 h-6 flex items-center justify-center">{icon}</div>
//   {isOpen && <span className="font-medium">{label}</span>}
// </div>
// );

export default Layout;
=======
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-300">Pending</span>
                <span className="font-bold text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">
                  {stats.pending}
                </span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className={`
            w-full
            flex items-center justify-center gap-2
            px-4 py-3
            bg-red-500/10 hover:bg-red-500/20
            text-red-300 hover:text-white
            rounded-xl
            transition-all duration-200
            group
            ${!isOpen && !isMobile ? 'justify-center px-2' : ''}
          `}
          title={!isOpen && !isMobile ? 'Logout' : ''}
        >
          <LogOut className="w-5 h-5" />
          {(!isMobile || isOpen) && (
            <span className={`font-medium ${!isOpen && !isMobile ? 'hidden' : 'block'}`}>
              Logout
            </span>
          )}
        </button>

        {/* Admin Info */}
        <div className={`mt-4 pt-4 border-t border-gray-700 transition-all ${!isOpen && !isMobile ? 'hidden' : 'block'}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-sm font-bold">A</span>
            </div>
            <div>
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-gray-400 truncate">admin@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
>>>>>>> df7b6111019570a53bd71875115c7701408b38e7
