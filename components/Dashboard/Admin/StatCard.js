// components/Dashboard/Admin/StatCard.js
'use client';

import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
  trend,
  theme,
}) => {
  return (
    <div
      className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'} hover:shadow-md transition-shadow duration-300`}
    >
      <div className="flex items-start justify-between">
        <div>
      
          <p
            className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-2`}
          >
            {title}
          </p>
          <p
            className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-3`}
          >
            {value}
          </p>
          <div className="flex items-center gap-2">
            <div
              className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${
                trend === 'up'
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
              }`}
            >
              {trend === 'up' ? (
                <ArrowUp className="w-3 h-3 mr-1" />
              ) : (
                <ArrowDown className="w-3 h-3 mr-1" />
              )}
              {change > 0 ? '+' : ''}
              {change}%
            </div>
            <span
              className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-600'}`}
            >
              vs last month
            </span>
          </div>
        </div>

        <div
          className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center`}
        >
          <Icon className={`w-6 h-6 ${iconColor}`} />
        </div>
      </div>

      {/* Mini chart */}
      <div className="mt-4">
        <div className="h-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div
            className={`h-full ${trend === 'up' ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ width: `${Math.min(Math.abs(change) * 5, 100)}%` }}
          >
            <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatCard;
