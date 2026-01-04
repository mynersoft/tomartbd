// components/Dashboard/SalesMap.js
'use client';

import React from 'react';
import { MapPin, TrendingUp, Globe } from 'lucide-react';

const SalesMap = ({ theme }) => {
  const regions = [
    {
      country: 'United States',
      sales: 45231,
      growth: 15,
      color: 'bg-blue-500',
    },
    {
      country: 'United Kingdom',
      sales: 28945,
      growth: 8,
      color: 'bg-purple-500',
    },
    { country: 'Germany', sales: 23456, growth: 12, color: 'bg-green-500' },
    { country: 'Canada', sales: 18923, growth: 25, color: 'bg-yellow-500' },
    { country: 'Australia', sales: 15678, growth: 18, color: 'bg-pink-500' },
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
            Sales by Region
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Geographic distribution
          </p>
        </div>
        <Globe
          className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        />
      </div>

      {/* Map visualization */}
      <div className="relative h-48 mb-6 rounded-lg overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800">
        {/* Simplified world map with dots */}
        <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-primary-500 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 left-1/2 w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-300"></div>
        <div className="absolute top-2/3 left-2/3 w-3 h-3 bg-green-500 rounded-full animate-pulse delay-700"></div>
        <div className="absolute top-1/2 left-1/3 w-5 h-5 bg-purple-500 rounded-full animate-pulse delay-500"></div>
        <div className="absolute top-3/4 left-1/4 w-4 h-4 bg-yellow-500 rounded-full animate-pulse delay-1000"></div>

        {/* Connection lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
          <line
            x1="25"
            y1="25"
            x2="50"
            y2="33"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line
            x1="50"
            y1="33"
            x2="33"
            y2="50"
            stroke="#8b5cf6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line
            x1="33"
            y1="50"
            x2="67"
            y2="75"
            stroke="#10b981"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
          <line
            x1="67"
            y1="75"
            x2="25"
            y2="75"
            stroke="#f59e0b"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        </svg>

        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={`text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-primary-500 to-blue-500 flex items-center justify-center">
              <MapPin className="w-8 h-8 text-white" />
            </div>
            <p className="text-sm font-medium">Global Sales Map</p>
            <p className="text-xs opacity-75">Interactive visualization</p>
          </div>
        </div>
      </div>

      {/* Region list */}
      <div className="space-y-4">
        {regions.map((region, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${region.color}`}></div>
              <div>
                <p
                  className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                >
                  {region.country}
                </p>
                <p
                  className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  ${region.sales.toLocaleString()}
                </p>
              </div>
            </div>
            <div
              className={`inline-flex items-center text-sm font-medium ${
                region.growth > 0 ? 'text-green-500' : 'text-red-500'
              }`}
            >
              <TrendingUp className="w-4 h-4 mr-1" />
              {region.growth > 0 ? '+' : ''}
              {region.growth}%
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesMap;
