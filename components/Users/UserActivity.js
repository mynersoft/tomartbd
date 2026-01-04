// components/Users/UserActivity.js
'use client';

import React from 'react';
import {
  ShoppingBag,
  Eye,
  Heart,
  Star,
  MessageSquare,
  Globe,
} from 'lucide-react';

const UserActivity = ({ user, theme }) => {
  const activities = [
    {
      type: 'purchase',
      title: 'Purchased Wireless Headphones',
      description: 'Order #ORD-7841 • $289.99',
      time: '2 hours ago',
      icon: ShoppingBag,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      type: 'view',
      title: 'Viewed Gaming Laptops',
      description: 'Spent 8 minutes on product page',
      time: '5 hours ago',
      icon: Eye,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      type: 'wishlist',
      title: 'Added Smart Watch to Wishlist',
      description: 'Premium Watch Series X',
      time: '1 day ago',
      icon: Heart,
      color: 'text-pink-500',
      bg: 'bg-pink-100 dark:bg-pink-900/30',
    },
    {
      type: 'review',
      title: 'Left a 5-Star Review',
      description: 'Rated "Wireless Headphones Pro"',
      time: '2 days ago',
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      type: 'support',
      title: 'Opened Support Ticket',
      description: 'Technical assistance requested',
      time: '3 days ago',
      icon: MessageSquare,
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
  ];

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Recent Activity
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            User interactions and behaviors
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => {
          const Icon = activity.icon;
          return (
            <div
              key={index}
              className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <div
                className={`w-10 h-10 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {activity.title}
                </p>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mt-1`}
                >
                  {activity.description}
                </p>
              </div>

              <div
                className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'} flex-shrink-0`}
              >
                {activity.time}
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <h4
          className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Activity Summary
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Page Views', value: '1.2K', icon: Eye },
            { label: 'Cart Adds', value: '24', icon: ShoppingBag },
            { label: 'Wishlist Items', value: '12', icon: Heart },
            { label: 'Reviews', value: '8', icon: Star },
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} text-center`}
              >
                <Icon
                  className={`w-5 h-5 mx-auto mb-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
                <p
                  className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}
                >
                  {item.value}
                </p>
                <p
                  className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default UserActivity;
