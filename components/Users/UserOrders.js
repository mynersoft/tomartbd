// components/Users/UserOrders.js
'use client';

import React from 'react';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { useSingleOrder } from '../../hooks/useOrder';

const UserOrders = ({ user, theme }) => {
  useSingleOrder('69551148ddbd2397087a1fa6');

  //
  const recentOrders = [
    {
      id: '#ORD-7841',
      date: 'Dec 15, 2024',
      amount: '$289.99',
      status: 'delivered',
      items: 3,
      tracking: 'TRK784512369',
    },
    {
      id: '#ORD-7840',
      date: 'Dec 14, 2024',
      amount: '$145.50',
      status: 'shipped',
      items: 2,
      tracking: 'TRK784512368',
    },
    {
      id: '#ORD-7839',
      date: 'Dec 12, 2024',
      amount: '$532.75',
      status: 'processing',
      items: 5,
      tracking: null,
    },
    {
      id: '#ORD-7838',
      date: 'Dec 10, 2024',
      amount: '$89.99',
      status: 'delivered',
      items: 1,
      tracking: 'TRK784512367',
    },
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'delivered':
        return {
          icon: CheckCircle,
          color:
            'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        };
      case 'shipped':
        return {
          icon: Truck,
          color:
            'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
        };
      case 'processing':
        return {
          icon: Package,
          color:
            'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        };
      default:
        return {
          icon: Clock,
          color:
            'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
        };
    }
  };

  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
    >
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
          className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors flex items-center gap-1`}
        >
          View All
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr
              className={`border-b ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <th
                className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Order ID
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Date
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Amount
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Status
              </th>
              <th
                className={`text-left py-3 px-4 text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {recentOrders.map((order, index) => {
              const statusInfo = getStatusInfo(order.status);
              const StatusIcon = statusInfo.icon;

              return (
                <tr
                  key={index}
                  className={`border-b ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-200 hover:bg-gray-50'} transition-colors`}
                >
                  <td className="py-3 px-4">
                    <div>
                      <p
                        className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                      >
                        {order.id}
                      </p>
                      <p
                        className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
                      >
                        {order.items} items
                      </p>
                    </div>
                  </td>
                  <td
                    className={`py-3 px-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                  >
                    {order.date}
                  </td>
                  <td
                    className={`py-3 px-4 font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    {order.amount}
                  </td>
                  <td className="py-3 px-4">
                    <div
                      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}
                    >
                      <StatusIcon className="w-3 h-3" />
                      {order.status.charAt(0).toUpperCase() +
                        order.status.slice(1)}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      className={`text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors`}
                    >
                      View
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserOrders;
