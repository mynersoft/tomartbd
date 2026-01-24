'use client';
import React from 'react';
import {
  DollarSign,
  Package,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import { FaBoxOpen, FaExchangeAlt } from 'react-icons/fa';
import { useVendorStats } from '../../hooks/useVendorQuery';

const StatCard = ({ title, value, icon, change, isPositive, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-8 bg-gray-200 rounded w-1/2"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
              )}
              <span
                className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}
              >
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                from last month
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${getIconBgColor(icon)}`}>
          {getIconComponent(icon)}
        </div>
      </div>
    </div>
  );
};

const getIconComponent = (iconName) => {
  const iconClasses = 'h-6 w-6 text-white';
  switch (iconName) {
    case 'revenue':
      return <DollarSign className={iconClasses} />;
    case 'products':
      return <Package className={iconClasses} />;
    case 'orders':
      return <ShoppingCart className={iconClasses} />;
    case 'customers':
      return <Users className={iconClasses} />;
    case 'inventory':
      return <FaBoxOpen className={iconClasses} />;
    case 'returns':
      return <FaExchangeAlt className={iconClasses} />;
    default:
      return <DollarSign className={iconClasses} />;
  }
};

const getIconBgColor = (iconName) => {
  switch (iconName) {
    case 'revenue':
      return 'bg-gradient-to-r from-green-500 to-emerald-600';
    case 'products':
      return 'bg-gradient-to-r from-blue-500 to-cyan-600';
    case 'orders':
      return 'bg-gradient-to-r from-purple-500 to-pink-600';
    case 'customers':
      return 'bg-gradient-to-r from-orange-500 to-amber-600';
    case 'inventory':
      return 'bg-gradient-to-r from-indigo-500 to-blue-600';
    case 'returns':
      return 'bg-gradient-to-r from-red-500 to-rose-600';
    default:
      return 'bg-gradient-to-r from-gray-500 to-gray-600';
  }
};

const StatsCards = () => {
  const { data: stats, isLoading, error } = useVendorStats();

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">Failed to load statistics</p>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Revenue',
      value: stats?.totalRevenue
        ? `৳${stats.totalRevenue.toLocaleString()}`
        : '৳0',
      icon: 'revenue',
      change: stats?.revenueChange ? `${stats.revenueChange}%` : null,
      isPositive: stats?.revenueChange > 0,
    },
    {
      title: 'Total Products',
      value: stats?.totalProducts?.toLocaleString() || '0',
      icon: 'products',
      change: stats?.productsChange ? `${stats.productsChange}%` : null,
      isPositive: stats?.productsChange > 0,
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders?.toLocaleString() || '0',
      icon: 'orders',
      change: stats?.ordersChange ? `${stats.ordersChange}%` : null,
      isPositive: stats?.ordersChange > 0,
    },
    {
      title: 'Active Customers',
      value: stats?.activeCustomers?.toLocaleString() || '0',
      icon: 'customers',
      change: stats?.customersChange ? `${stats.customersChange}%` : null,
      isPositive: stats?.customersChange > 0,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((card, index) => (
        <StatCard
          key={index}
          title={card.title}
          value={card.value}
          icon={card.icon}
          change={card.change}
          isPositive={card.isPositive}
          loading={isLoading}
        />
      ))}
    </div>
  );
};

export default StatsCards;
