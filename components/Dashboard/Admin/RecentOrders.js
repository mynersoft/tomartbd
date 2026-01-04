// components/Dashboard/RecentOrders.js
'use client';

import React from 'react';
import {
  Clock,
  CheckCircle,
  Truck,
  Package,
  MoreVertical,
  Eye,
  ShoppingCart,
} from 'lucide-react';

const RecentOrders = ({ theme }) => {
  const orders = [
    {
      id: '#ORD-7841',
      customer: 'John Smith',
      amount: '$289.99',
      status: 'delivered',
      date: 'Today, 10:42 AM',
      items: 3,
    },
    {
      id: '#ORD-7840',
      customer: 'Emma Johnson',
      amount: '$145.50',
      status: 'shipped',
      date: 'Today, 09:15 AM',
      items: 2,
    },
    {
      id: '#ORD-7839',
      customer: 'Michael Chen',
      amount: '$532.75',
      status: 'processing',
      date: 'Yesterday, 4:30 PM',
      items: 5,
    },
    {
      id: '#ORD-7838',
      customer: 'Sarah Williams',
      amount: '$89.99',
      status: 'pending',
      date: 'Yesterday, 2:15 PM',
      items: 1,
    },
    {
      id: '#ORD-7837',
      customer: 'Robert Garcia',
      amount: '$312.25',
      status: 'delivered',
      date: 'Nov 15, 11:20 AM',
      items: 4,
    },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
          label: 'Pending',
        };
      case 'processing':
        return {
          icon: Package,
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
          label: 'Processing',
        };
      case 'shipped':
        return {
          icon: Truck,
          color:
            'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
          label: 'Shipped',
        };
      case 'delivered':
        return {
          icon: CheckCircle,
          color:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
          label: 'Delivered',
        };
      default:
        return {
          icon: Clock,
          color: 'bg-gray-100 text-gray-800',
          label: 'Unknown',
        };
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            Recent Orders
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Latest customer orders
          </p>
        </div>
        <button
          className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors`}
        >
          View All →
        </button>
      </div>

      <div className="space-y-4">
        {orders.map((order, index) => {
          const statusInfo = getStatusInfo(order.status);
          const StatusIcon = statusInfo.icon;

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg ${theme === 'dark' ? 'bg-gray-700/50 hover:bg-gray-700' : 'bg-gray-50 hover:bg-gray-100'} transition-colors group`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-lg ${theme === 'dark' ? 'bg-gray-600' : 'bg-white'} flex items-center justify-center`}
                >
                  <div className="w-6 h-6 rounded-md bg-linear-to-br from-primary-500 to-blue-500 flex items-center justify-center">
                    <ShoppingCart className="w-3 h-3 text-white" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <p
                      className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {order.id}
                    </p>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3 inline mr-1" />
                      {statusInfo.label}
                    </span>
                  </div>
                  <p
                    className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {order.customer} • {order.items} items
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p
                    className={`font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {order.amount}
                  </p>
                  <p
                    className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                  >
                    {order.date}
                  </p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <Eye
                      className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>
                  <button
                    className={`p-1.5 rounded ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'}`}
                  >
                    <MoreVertical
                      className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentOrders;
