// components/Dashboard/ChartCard.js
'use client';

import React from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const ChartCard = ({ type = 'line', theme }) => {
  // Sample data for charts
  const monthlyData = [
    { month: 'Jan', revenue: 32000, orders: 1200, users: 850 },
    { month: 'Feb', revenue: 38000, orders: 1400, users: 920 },
    { month: 'Mar', revenue: 42000, orders: 1600, users: 1050 },
    { month: 'Apr', revenue: 48000, orders: 1850, users: 1240 },
    { month: 'May', revenue: 52000, orders: 2100, users: 1420 },
    { month: 'Jun', revenue: 58000, orders: 2350, users: 1650 },
    { month: 'Jul', revenue: 62000, orders: 2600, users: 1920 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 35, color: '#3b82f6' },
    { name: 'Fashion', value: 25, color: '#8b5cf6' },
    { name: 'Home', value: 20, color: '#10b981' },
    { name: 'Books', value: 12, color: '#f59e0b' },
    { name: 'Others', value: 8, color: '#ef4444' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          className={`p-3 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} border ${theme === 'dark' ? 'border-gray-600' : 'border-gray-200'}`}
        >
          <p
            className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
          >
            {label}
          </p>
          {payload.map((entry, index) => (
            <p key={index} className="text-sm" style={{ color: entry.color }}>
              {entry.name}:{' '}
              {entry.name === 'revenue'
                ? `$${entry.value.toLocaleString()}`
                : entry.value.toLocaleString()}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      {type === 'line' ? (
        <LineChart data={monthlyData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="month"
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ fill: '#3b82f6', strokeWidth: 2 }}
            activeDot={{ r: 6 }}
            name="Revenue"
          />
          <Line
            type="monotone"
            dataKey="orders"
            stroke="#8b5cf6"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
            name="Orders"
          />
        </LineChart>
      ) : type === 'bar' ? (
        <BarChart data={monthlyData}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke={theme === 'dark' ? '#374151' : '#e5e7eb'}
          />
          <XAxis
            dataKey="month"
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <YAxis
            stroke={theme === 'dark' ? '#9ca3af' : '#6b7280'}
            fontSize={12}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar
            dataKey="revenue"
            fill="#3b82f6"
            name="Revenue"
            radius={[4, 4, 0, 0]}
          />
          <Bar
            dataKey="orders"
            fill="#8b5cf6"
            name="Orders"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      ) : (
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={(entry) => `${entry.name}: ${entry.value}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
          <Legend />
        </PieChart>
      )}
    </ResponsiveContainer>
  );
};

export default ChartCard;
