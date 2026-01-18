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
  const handleLinkClick = () => {
    if (isMobile) {
      setOpen(false);
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

  return (
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
              Quick Stats
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-300">Today's Orders</span>
                <span className="font-bold text-green-400">42</span>
              </div>
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
