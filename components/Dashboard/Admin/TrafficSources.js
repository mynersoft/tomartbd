// components/Dashboard/TrafficSources.js
'use client';

import React from 'react';
import {
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Search,
  ShoppingBag,
} from 'lucide-react';

const TrafficSources = ({ theme }) => {
  const sources = [
    {
      name: 'Organic Search',
      value: 45,
      icon: Search,
      color: 'bg-green-500',
      change: 12,
    },
    {
      name: 'Direct Traffic',
      value: 28,
      icon: Globe,
      color: 'bg-blue-500',
      change: 8,
    },
    {
      name: 'Social Media',
      value: 18,
      icon: Instagram,
      color: 'bg-pink-500',
      change: 25,
    },
    {
      name: 'Referral',
      value: 9,
      icon: ShoppingBag,
      color: 'bg-purple-500',
      change: -4,
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
            Traffic Sources
          </h3>
          <p
            className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
          >
            Where visitors come from
          </p>
        </div>
        <div
          className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Total: 100%
        </div>
      </div>

      <div className="space-y-6">
        {sources.map((source, index) => {
          const Icon = source.icon;
          return (
            <div key={index}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg ${source.color} flex items-center justify-center`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p
                      className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                    >
                      {source.name}
                    </p>
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                      >
                        {source.value}%
                      </span>
                      <span
                        className={`text-xs px-2 py-0.5 rounded ${source.change > 0 ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'}`}
                      >
                        {source.change > 0 ? '+' : ''}
                        {source.change}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`h-2 w-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} rounded-full overflow-hidden`}
              >
                <div
                  className={`h-full ${source.color} rounded-full transition-all duration-500`}
                  style={{ width: `${source.value}%` }}
                >
                  <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Social media breakdown */}
      <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
        <p
          className={`text-sm font-medium mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
        >
          Social Media Breakdown
        </p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { platform: 'Instagram', value: 48, color: 'bg-pink-500' },
            { platform: 'Facebook', value: 32, color: 'bg-blue-600' },
            { platform: 'Twitter', value: 20, color: 'bg-sky-500' },
          ].map((item, index) => (
            <div key={index} className="text-center">
              <div className="h-12 flex items-center justify-center">
                <div
                  className={`w-full h-2 rounded-full ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'} overflow-hidden`}
                >
                  <div
                    className={`h-full ${item.color} rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
              <p
                className={`text-xs mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
              >
                {item.platform}
              </p>
              <p
                className={`text-sm font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                {item.value}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrafficSources;
