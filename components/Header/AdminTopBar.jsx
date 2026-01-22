'use client';

import { useState, useEffect, useRef } from 'react';
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
  Database,
  BarChart3,
  Globe,
  Package,
  Users,
  ShoppingCart,
  Home,
  Calendar,
  FileText,
  CreditCard,
  TrendingUp,
  BellRing,
  MessageCircle,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import useLoginUser from '@/hooks/useAuth';
import { useNotifications } from "@/hooks/useNotifications";
import { useSelector } from "react-redux";

const AdminTopBar = () => {
  const { user } = useLoginUser();
  useNotifications();

  const { notifications } = useSelector((state) => state.notification);
  
  const router = useRouter();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [messages, setMessages] = useState([
    {
      id: 1,
      name: 'John Doe',
      message: 'Hey, can we schedule a meeting?',
      time: '10 min ago',
      unread: true,
      avatar: 'JD',
    },
    {
      id: 2,
      name: 'Sarah Smith',
      message: 'Thanks for the quick response!',
      time: '1 hour ago',
      unread: false,
      avatar: 'SS',
    },
    {
      id: 3,
      name: 'Alex Johnson',
      message: 'I need help with the dashboard',
      time: '3 hours ago',
      unread: true,
      avatar: 'AJ',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  // Create refs for dropdowns
  const dropdownRef = useRef(null);
  const notificationsRef = useRef(null);
  const messagesRef = useRef(null);
  const searchRef = useRef(null);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
      return;
    }

    // Mock search results
    const results = [
      {
        id: 1,
        title: 'Dashboard',
        path: '/admin',
        icon: <Home className="h-4 w-4" />,
      },
      {
        id: 2,
        title: 'Users Management',
        path: '/admin/users',
        icon: <Users className="h-4 w-4" />,
      },
      {
        id: 3,
        title: 'Orders',
        path: '/admin/orders',
        icon: <ShoppingCart className="h-4 w-4" />,
      },
      {
        id: 4,
        title: 'Products',
        path: '/admin/products',
        icon: <Package className="h-4 w-4" />,
      },
      {
        id: 5,
        title: 'Analytics',
        path: '/admin/analytics',
        icon: <BarChart3 className="h-4 w-4" />,
      },
      {
        id: 6,
        title: 'Settings',
        path: '/admin/settings',
        icon: <Settings className="h-4 w-4" />,
      },
    ].filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));

    setSearchResults(results);
  };

  // Mark notification as read
  const markNotificationAsRead = (id) => {
    // This should be handled by your notification hook/state management
    console.log('Mark notification as read:', id);
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    // This should be handled by your notification hook/state management
    console.log('Mark all notifications as read');
  };

  // Mark message as read
  const markMessageAsRead = (id) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
    );
  };

  // Get unread counts
  const unreadNotifications = notifications?.filter((n) => !n.read)?.length || 0;
  const unreadMessages = messages.filter((m) => m.unread).length;

  // Handle logout
  const handleLogout = () => {
    // Your logout logic here
    router.push('/auth/login');
  };

  // Close dropdowns when clicking outside
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
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close search when clicking outside (for mobile)
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  return (
    <>
      {/* Top Bar Header */}
      <header className="sticky top-0 z-50 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                ) : (
                  <Menu className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                )}
              </button>

              {/* Logo & Brand */}
              <div className="flex items-center space-x-3">
                <Link href="/admin" className="flex items-center space-x-2">
                  <div>
                    <h1 className="text-xl font-bold text-white dark:text-primary-400">
                      Tomartbd
                    </h1>
               
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Search, Notifications, User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
            

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>

              {/* Messages Dropdown */}
              <div className="relative" ref={messagesRef}>
                <button
                  onClick={() => {
                    setIsMessagesOpen(!isMessagesOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Messages"
                >
                  <MessageCircle className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadMessages > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadMessages > 9 ? '9+' : unreadMessages}
                    </span>
                  )}
                </button>

                {/* Messages Dropdown Content */}
                {isMessagesOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Messages
                        </h3>
                        <button
                          onClick={() => setMessages(messages.map(msg => ({ ...msg, unread: false })))}
                          className="text-xs text-primary-600 font-medium cursor-pointer hover:text-primary-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-l-2 ${
                            message.unread
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                              : 'border-transparent'
                          }`}
                          onClick={() => markMessageAsRead(message.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-semibold">
                                {message.avatar}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {message.name}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {message.time}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400 truncate mt-1">
                                {message.message}
                              </p>
                            </div>
                            {message.unread && (
                              <div className="flex-shrink-0">
                                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                      <Link
                        href="/admin/messages"
                        className="text-center block text-primary-600 hover:text-primary-800 font-medium text-sm py-1"
                        onClick={() => setIsMessagesOpen(false)}
                      >
                        View all messages
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Notifications Dropdown */}
              <div className="relative" ref={notificationsRef}>
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>

                {/* Notifications Dropdown Content */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                          Notifications
                        </h3>
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-primary-600 font-medium hover:text-primary-800"
                        >
                          Mark all as read
                        </button>
                      </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                      {notifications?.map((notification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-l-2 ${
                            !notification.read
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                              : 'border-transparent'
                          }`}
                          onClick={() => markNotificationAsRead(notification._id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0">
                              <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                  !notification?.read
                                    ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-500'
                                }`}
                              >
                                {/* You might want to add actual icons here */}
                                <Bell className="h-5 w-5" />
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                  {notification.title || 'Notification'}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                  {notification.time || 'Just now'}
                                </span>
                              </div>
                              <div className="flex items-center space-x-2 mt-1">
                                {!notification.read && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                                    New
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                      <Link
                        href="/admin/notifications"
                        className="text-center block text-primary-600 hover:text-primary-800 font-medium text-sm py-1"
                        onClick={() => setIsNotificationsOpen(false)}
                      >
                        View all notifications
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  aria-label="User menu"
                >
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate max-w-[120px]">
                      {user?.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[120px]">
                      {user?.role || 'Admin'}
                    </p>
                  </div>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-500 dark:text-gray-400 transition-transform ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {/* User Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold text-lg">
                          {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                            {user?.name || 'User'}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user?.email || 'user@example.com'}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                              {user?.role || 'Admin'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Menu Items */}
                    <div className="py-2">
                      <Link
                        href="/admin/profile"
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <User className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          My Profile
                        </span>
                      </Link>

                      <Link
                        href="/admin/settings"
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <Settings className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Settings
                        </span>
                      </Link>

                      <Link
                        href="/admin/help"
                        className="flex items-center space-x-3 px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        onClick={() => setIsDropdownOpen(false)}
                      >
                        <HelpCircle className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                        <span className="text-gray-700 dark:text-gray-300">
                          Help & Support
                        </span>
                      </Link>

                      <div className="px-4 py-2.5 border-t border-gray-200 dark:border-gray-800">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Dark Mode
                          </span>
                          <button
                            onClick={() =>
                              setTheme(theme === 'dark' ? 'light' : 'dark')
                            }
                            className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors"
                            aria-label="Toggle dark mode"
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                theme === 'dark'
                                  ? 'translate-x-6'
                                  : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Logout */}
                    <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-800">
                      <button
                        onClick={handleLogout}
                        className="flex items-center justify-center w-full space-x-2 px-4 py-2.5 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      >
                        <LogOut className="h-5 w-5" />
                        <span className="font-medium">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}

      </header>

      {/* Mobile Side Menu */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="lg:hidden fixed inset-0 z-40 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="lg:hidden fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl z-50 transform transition-transform duration-300 ease-in-out">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Menu
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span>Analytics</span>
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default AdminTopBar;