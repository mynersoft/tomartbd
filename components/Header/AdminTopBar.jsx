'use client';

import { useState, useEffect } from 'react';
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
import  {useNotifications} from "@/hooks/useNotifications";

import  {useSelector} from "react-redux";

const AdminTopBar = () => {
  const { user } = useLoginUser();
useNotifications();

const {notifications} = useSelector((state) => state.notification);

console.log(notifications);
  const router = useRouter();

  const pathname = usePathname();
  const { theme, setTheme } = useTheme();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] =useState(false);
    

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

  // Quick stats for header
  const stats = {
    orders: 128,
    revenue: '$12,580',
    users: 856,
    growth: '+12%',
  };

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
    setNotifications(
      notifications.map((notif) =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map((notif) => ({ ...notif, read: true })));
  };

  // Mark message as read
  const markMessageAsRead = (id) => {
    setMessages(
      messages.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
    );
  };

  // Get unread counts
  const unreadNotifications = notifications.filter((n) => !n.read).length;
  const unreadMessages = messages.filter((m) => m.unread).length;

  // Handle logout
  const handleLogout = () => {
    // Your logout logic here
    router.push('/auth/login');
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-container')) {
        setIsDropdownOpen(false);
        setIsNotificationsOpen(false);
        setIsMessagesOpen(false);
      }
      if (!event.target.closest('.search-container')) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <>
      {/* Top Bar Header */}
      <header className="sticky top-0 z-51 w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Logo & Mobile Menu */}
            <div className="flex items-center">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mr-2"
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
                    <h1 className="text-xl font-bold text-primary bg-linear-to-r from-primary-600 to-primary-800 bg-clip-text">
                      Tomartbd
                    </h1>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Admin panel
                    </span>
                  </div>
                </Link>
              </div>
            </div>

            {/* Right: Search, Notifications, User Menu */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Search Bar */}
              <div className="relative search-container hidden md:block">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsSearchOpen(true)}
                    className="w-48 lg:w-64 pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />

                  {/* Search Results Dropdown */}
                  {isSearchOpen && searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-800 py-2 z-50 max-h-96 overflow-y-auto">
                      {searchResults.map((result) => (
                        <Link
                          key={result.id}
                          href={result.path}
                          className="flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                          onClick={() => {
                            setSearchQuery('');
                            setIsSearchOpen(false);
                          }}
                        >
                          <div className="text-gray-500 dark:text-gray-400">
                            {result.icon}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                              {result.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {result.path}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Mobile Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Search className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>

              {/* Mobile Search Bar (Full Width) */}
              {isSearchOpen && (
                <div className="md:hidden absolute top-16 left-0 right-0 px-4 py-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-40">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
              )}

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5 text-yellow-500" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600" />
                )}
              </button>

              {/* Messages Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setIsMessagesOpen(!isMessagesOpen);
                    setIsNotificationsOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                        <span className="text-xs text-primary-600 font-medium cursor-pointer hover:text-primary-800">
                          Mark all as read
                        </span>
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
                                <span className="text-xs text-gray-500 dark:text-gray-400">
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
              <div className="relative dropdown-container">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(!isNotificationsOpen);
                    setIsMessagesOpen(false);
                  }}
                  className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
                      {notifications.map((notification) => (
                        <div
                          key={notification._id}
                          className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer border-l-2 ${
                            !notification.read
                              ? 'border-primary-500 bg-primary-50/50 dark:bg-primary-900/20'
                              : 'border-transparent'
                          }`}
                          onClick={() =>
                            markNotificationAsRead(notification._id)
                          }
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
                                {notification.icon}
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 dark:text-gray-100">
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                  {notification.time}
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

              {/* Quick Stats (Desktop) */}
              <div className="hidden lg:flex items-center space-x-4">
                <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
              </div>

              {/* User Menu Dropdown */}
              <div className="relative dropdown-container">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold">
                    avatar
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {user.role}
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
                        <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary-600 to-primary-800 flex items-center justify-center text-white font-semibold text-lg">
                          avatar
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                          <div className="flex items-center space-x-1 mt-1">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200">
                              {user.role}
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

        {/* Mobile Stats Bar */}
        <div className="lg:hidden bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
          <div className="px-4 py-2">
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <ShoppingCart className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.orders}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Orders
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <CreditCard className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.revenue}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Revenue
                </p>
              </div>
              <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {stats.users}
                  </span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Users
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Side Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50">
          <div className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-gray-900 shadow-xl">
            <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Menu
              </h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
              {/* Add your mobile menu items here */}
              <div className="space-y-1">
                <Link
                  href="/admin"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Home className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Users className="h-5 w-5" />
                  <span>Users</span>
                </Link>
                <Link
                  href="/admin/orders"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <ShoppingCart className="h-5 w-5" />
                  <span>Orders</span>
                </Link>
                <Link
                  href="/admin/products"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <Package className="h-5 w-5" />
                  <span>Products</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminTopBar;
