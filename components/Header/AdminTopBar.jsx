'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  Search,
  Bell,
  MessageSquare,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Moon,
  Sun,
  HelpCircle,
  Shield,
  Home,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  MessageCircle,
  Mail,
  Calendar,
  FileText,
  TrendingUp,
  CreditCard,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useSelector } from 'react-redux';

const AdminTopBar = ({ onMenuClick, sidebarOpen }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  
  const { notifications = [] } = useSelector((state) => state.notification || {});

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);

  const messages = [
    { id: 1, name: 'John Doe', message: 'Meeting scheduled', time: '10 min ago', unread: true, avatar: 'JD' },
    { id: 2, name: 'Sarah Smith', message: 'Thanks!', time: '1 hour ago', unread: false, avatar: 'SS' },
    { id: 3, name: 'Alex Johnson', message: 'Need help', time: '3 hours ago', unread: true, avatar: 'AJ' },
  ];

  const unreadNotifications = notifications?.filter(n => !n.read)?.length || 0;
  const unreadMessages = messages.filter(m => m.unread).length;

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/auth/login');
  };

  const closeAllDropdowns = useCallback(() => {
    setIsDropdownOpen(false);
    setIsNotificationsOpen(false);
    setIsMessagesOpen(false);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (messagesRef.current && !messagesRef.current.contains(event.target)) {
        setIsMessagesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    closeAllDropdowns();
  }, [pathname, closeAllDropdowns]);

  const navigationItems = [
    { name: 'Dashboard', href: '/admin', icon: <Home className="w-4 h-4" /> },
    { name: 'Users', href: '/admin/users', icon: <Users className="w-4 h-4" /> },
    { name: 'Orders', href: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { name: 'Products', href: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { name: 'Analytics', href: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { name: 'Settings', href: '/admin/settings', icon: <Settings className="w-4 h-4" /> },
  ];

  if (!mounted) return null;

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Menu Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={onMenuClick}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? (
                  <X className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              <Link href="/admin" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Tomartbd
                </span>
              </Link>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Moon className="w-5 h-5 text-gray-600" />
                )}
              </button>

              {/* Messages */}
              <div className="relative" ref={messagesRef}>
                <button
                  onClick={() => {
                    setIsMessagesOpen(!isMessagesOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>

                {isMessagesOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">Messages</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer border-l-2 ${
                            msg.unread ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20' : 'border-transparent'
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                              {msg.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {msg.name}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {msg.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {msg.message}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                      <Link
                        href="/admin/messages"
                        className="text-center block text-blue-600 hover:text-blue-800 font-medium text-sm py-1"
                        onClick={() => setIsMessagesOpen(false)}
                      >
                        View all messages
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Notifications</h3>
                        <button className="text-xs text-blue-600 font-medium hover:text-blue-800">
                          Mark all read
                        </button>
                      </div>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.slice(0, 5).map((notification) => (
                        <div
                          key={notification._id}
                          className="px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <div className="flex items-start gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                              <Bell className="w-5 h-5 text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-gray-900 dark:text-gray-100">
                                {notification.title || 'Notification'}
                              </p>
                              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                {notification.message}
                              </p>
                              <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                                {notification.time || 'Just now'}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                      <Link
                        href="/admin/notifications"
                        className="text-center block text-blue-600 hover:text-blue-800 font-medium text-sm py-1"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-semibold text-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user?.name || 'Admin User'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'admin@example.com'}
                          </p>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {user?.role || 'Admin'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="py-2">
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="w-5 h-5" />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </Link>
                      <Link
                        href="/admin/help"
                        className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <HelpCircle className="w-5 h-5" />
                        <span>Help & Support</span>
                      </Link>
                    </div>

                    <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminTopBar;