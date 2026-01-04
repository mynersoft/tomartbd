// components/Dashboard/ActivityFeed.js
'use client';

import React from 'react';
import {
  UserPlus,
  ShoppingCart,
  CreditCard,
  Star,
  MessageSquare,
  TrendingUp,
  Package,
  Truck,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';

const ActivityFeed = ({ theme }) => {
  const activities = [
    {
      type: 'new_user',
      user: 'Alex Johnson',
      action: 'created an account',
      time: '2 minutes ago',
      icon: UserPlus,
      color: 'text-blue-500',
      bg: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      type: 'order',
      user: 'Sarah Miller',
      action: 'placed an order for $289.99',
      time: '15 minutes ago',
      icon: ShoppingCart,
      color: 'text-green-500',
      bg: 'bg-green-100 dark:bg-green-900/30',
    },
    {
      type: 'payment',
      user: 'Mike Davis',
      action: 'completed payment via PayPal',
      time: '1 hour ago',
      icon: CreditCard,
      color: 'text-purple-500',
      color: 'text-purple-500',
      bg: 'bg-purple-100 dark:bg-purple-900/30',
    },
    {
      type: 'review',
      user: 'Emma Wilson',
      action: 'left a 5-star review',
      time: '2 hours ago',
      icon: Star,
      color: 'text-yellow-500',
      bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    },
    {
      type: 'support',
      user: 'David Brown',
      action: 'opened a support ticket',
      time: '3 hours ago',
      icon: MessageSquare,
      color: 'text-red-500',
      bg: 'bg-red-100 dark:bg-red-900/30',
    },
  ];

  const timeline = [
    { time: '9:00 AM', event: 'System backup completed', status: 'success' },
    {
      time: '10:30 AM',
      event: 'Inventory sync initiated',
      status: 'processing',
    },
    {
      time: '12:15 PM',
      event: 'Marketing campaign launched',
      status: 'success',
    },
    {
      time: '2:45 PM',
      event: 'Server maintenance scheduled',
      status: 'warning',
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
            Activity Feed
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Recent system activities
          </p>
        </div>
        <div
          className={`text-xs px-2 py-1 rounded ${theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-600'}`}
        >
          Live
        </div>
      </div>

      <div className="space-y-6">
        {/* Recent activities */}
        <div>
          <h4
            className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            User Activities
          </h4>
          <div className="space-y-4">
            {activities.map((activity, index) => {
              const Icon = activity.icon;
              return (
                <div key={index} className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${activity.bg} flex items-center justify-center flex-shrink-0`}
                  >
                    <Icon className={`w-4 h-4 ${activity.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      <span className="font-medium">{activity.user}</span>{' '}
                      {activity.action}
                    </p>
                    <p
                      className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                    >
                      {activity.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* System timeline */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <h4
            className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            System Timeline
          </h4>
          <div className="relative pl-6">
            {/* Timeline line */}
            <div className="absolute left-2 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700"></div>

            {timeline.map((item, index) => (
              <div key={index} className="relative mb-4 last:mb-0">
                <div
                  className={`absolute -left-7 w-3 h-3 rounded-full border-2 ${
                    item.status === 'success'
                      ? 'bg-green-500 border-green-500'
                      : item.status === 'warning'
                        ? 'bg-yellow-500 border-yellow-500'
                        : 'bg-blue-500 border-blue-500'
                  }`}
                ></div>
                <div>
                  <p
                    className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {item.event}
                  </p>
                  <div className="flex items-center justify-between">
                    <p
                      className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                    >
                      {item.time}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded ${
                        item.status === 'success'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : item.status === 'warning'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="grid grid-cols-2 gap-4">
            <div
              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
                <span
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Active Users
                </span>
              </div>
              <p
                className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                2.4K
              </p>
            </div>

            <div
              className={`p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <AlertCircle
                  className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                />
                <span
                  className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  Issues
                </span>
              </div>
              <p
                className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                3
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeed;
