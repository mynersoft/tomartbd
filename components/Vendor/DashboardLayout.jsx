'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { useVendor } from '../../hooks/useVendor';
import {
  Menu,
  X,
  Home,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  User,
} from 'lucide-react';
import { FaTachometerAlt, FaBoxOpen } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const { vendor, isSidebarCollapsed, toggleSidebar, logout } = useVendor();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/vendor', icon: FaTachometerAlt },
    { name: 'Products', href: '/vendor/products', icon: Package },
    { name: 'Orders', href: '/vendor/orders', icon: ShoppingCart },
    { name: 'Sales', href: '/vendor/sales', icon: DollarSign },
    { name: 'Customers', href: '/vendor/customers', icon: Users },
    { name: 'Analytics', href: '/vendor/analytics', icon: BarChart3 },
    { name: 'Inventory', href: '/vendor/inventory', icon: FaBoxOpen },
    { name: 'Settings', href: '/vendor/settings', icon: Settings },
  ];

  const isActive = (path) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
        fixed inset-y-0 left-0 z-50
        transform transition-transform duration-300 ease-in-out
        ${isSidebarCollapsed ? '-translate-x-full' : 'translate-x-0'}
        lg:translate-x-0 lg:static
        w-64 bg-white border-r border-gray-200
      `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">T</span>
            </div>
            {!isSidebarCollapsed && (
              <span className="text-xl font-bold text-gray-900">TomartBD</span>
            )}
          </div>
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Vendor Info */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
              {vendor.avatar ? (
                <img
                  src={vendor.avatar}
                  alt={vendor.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-5 w-5 text-white" />
              )}
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {vendor.shopName}
                </p>
                <p className="text-sm text-gray-500 truncate">{vendor.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg
                      transition-colors duration-200
                      ${
                        active
                          ? 'bg-blue-50 text-blue-600'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <Icon
                      className={`h-5 w-5 ${active ? 'text-blue-600' : 'text-gray-400'}`}
                    />
                    {!isSidebarCollapsed && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        {!isSidebarCollapsed && (
          <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-200">
            <button
              onClick={logout}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div
        className={`
        flex-1 flex flex-col
        ${isSidebarCollapsed ? 'lg:pl-0' : 'lg:pl-64'}
        transition-all duration-300
      `}
      >
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleSidebar}
                className="p-2 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="h-5 w-5 text-gray-500" />
              </button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search dashboard..."
                  className="pl-10 pr-4 py-2 w-64 lg:w-96 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* Notifications */}
              <button className="relative p-2 rounded-lg hover:bg-gray-100">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>

              {/* User Profile Dropdown */}
              <div className="relative">
                <button className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                    {vendor.avatar ? (
                      <img
                        src={vendor.avatar}
                        alt={vendor.name}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-4 w-4 text-white" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900">
                      {vendor.shopName}
                    </p>
                    <p className="text-xs text-gray-500">Vendor</p>
                  </div>
                  <ChevronDown className="hidden md:block h-4 w-4 text-gray-500" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 hidden group-hover:block">
                  <Link
                    to="/vendor/profile"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <User className="h-4 w-4" />
                    My Profile
                  </Link>
                  <Link
                    to="/vendor/settings"
                    className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    <Settings className="h-4 w-4" />
                    Settings
                  </Link>
                  <div className="border-t border-gray-200 my-2"></div>
                  <button
                    onClick={logout}
                    className="flex items-center gap-3 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;
