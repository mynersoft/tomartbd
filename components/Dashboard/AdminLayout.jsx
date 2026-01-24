'use client';

import { useState, useEffect, useCallback } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminTopBar from './Admin/AdminTopBar';

export default function AdminLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  const checkMobile = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, [checkMobile]);

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AdminTopBar
        onMenuClick={toggleSidebar}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="flex flex-1 overflow-hidden pt-16">
        {/* Mobile Overlay */}
        {sidebarOpen && isMobile && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <AdminSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          isMobile={isMobile}
        />

        {/* Main Content */}
        <main
          className={`
          flex-1 overflow-y-auto transition-all duration-300 ease-in-out
          ${sidebarOpen && !isMobile ? '' : 'ml-0'}
          p-4 md:p-6
          bg-gradient-to-br from-gray-50 to-gray-100
          min-h-[calc(100vh-4rem)]
        `}
        >
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
}
