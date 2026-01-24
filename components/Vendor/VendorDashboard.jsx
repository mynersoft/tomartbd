'use client';
import React from 'react';
import DashboardLayout from '../components/vendor/DashboardLayout';
import StatsCards from '../components/vendor/StatsCards';
import ProductTable from '../components/vendor/ProductTable';
import OrderTable from '../components/vendor/OrderTable';
import RecentActivity from '../components/vendor/RecentActivity';
import SalesChart from '../components/vendor/SalesChart';
import { TrendingUp, Package, ShoppingBag, Users } from 'lucide-react';

const VendorDashboard = () => {
  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, Shahriar!
        </h1>
        <p className="text-gray-600 mt-1">
          Here's what's happening with your TomartBD store today.
        </p>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Sales Overview
              </h2>
              <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <SalesChart />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <OrderTable />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Activity
              </h2>
              <button className="text-sm text-blue-600 hover:text-blue-700">
                View All
              </button>
            </div>
            <RecentActivity />
          </div>

          {/* Quick Stats */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-semibold mb-4">Store Performance</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Conversion Rate</p>
                    <p className="text-xl font-bold">4.8%</p>
                  </div>
                </div>
                <span className="text-sm text-green-300">+2.4%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Avg Order Value</p>
                    <p className="text-xl font-bold">৳2,450</p>
                  </div>
                </div>
                <span className="text-sm text-green-300">+12.5%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Customer Satisfaction</p>
                    <p className="text-xl font-bold">94%</p>
                  </div>
                </div>
                <span className="text-sm text-green-300">+3.2%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Quick Actions
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">
                  Add New Product
                </span>
                <Package className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">
                  Process Orders
                </span>
                <ShoppingBag className="h-4 w-4 text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                <span className="font-medium text-gray-900">
                  View Analytics
                </span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default VendorDashboard;
