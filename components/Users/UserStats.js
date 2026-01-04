// components/Users/UserStats.js
'use client';

import React from 'react';
import {
  ShoppingBag,
  DollarSign,
  TrendingUp,
  Package,
  RefreshCw,
  Award,
} from 'lucide-react';

const UserStats = ({ user, theme }) => {
  const stats = [
    {
      title: 'Total Orders',
      value: user.stats.totalOrders,
      icon: ShoppingBag,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Total Spent',
      value: `$${user.stats.totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: DollarSign,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
      change: '+24%',
      trend: 'up',
    },
    {
      title: 'Avg Order Value',
      value: `$${user.stats.avgOrderValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: TrendingUp,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
      change: '+8%',
      trend: 'up',
    },
    {
      title: 'Orders This Month',
      value: user.stats.ordersThisMonth,
      icon: Package,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
      change: '+15%',
      trend: 'up',
    },
    {
      title: 'Refunds',
      value: user.stats.refunds,
      icon: RefreshCw,
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30',
      change: '-2%',
      trend: 'down',
    },
    {
      title: 'Lifetime Value',
      value: `$${user.stats.lifetimeValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: Award,
      color: 'text-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
      change: '+18%',
      trend: 'up',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-4 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                >
                  {stat.title}
                </p>
                <p
                  className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-2`}
                >
                  {stat.value}
                </p>
                <div
                  className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded ${
                    stat.trend === 'up'
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                  }`}
                >
                  {stat.change}
                </div>
              </div>

              <div
                className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserStats;
