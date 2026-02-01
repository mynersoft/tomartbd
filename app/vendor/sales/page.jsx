
'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/vendor/DashboardLayout';
import SalesChart from '@/components/vendor/SalesChart';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Filter,
  Calendar,
  PieChart,
  BarChart3,
  ShoppingBag,
  Users,
  CreditCard
} from 'lucide-react';
import { useSalesData } from '../../hooks/useVendorQuery';

const SalesPage = () => {
  const [period, setPeriod] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [currency, setCurrency] = useState('BDT');

  const { data: salesData, isLoading } = useSalesData(period);

  const metrics = [
    {
      title: 'Total Revenue',
      value: `৳${(salesData?.totalRevenue || 0).toLocaleString()}`,
      change: salesData?.revenueChange || 0,
      icon: DollarSign,
      color: 'text-green-600 bg-green-100'
    },
    {
      title: 'Total Orders',
      value: (salesData?.totalOrders || 0).toLocaleString(),
      change: salesData?.orderChange || 0,
      icon: ShoppingBag,
      color: 'text-blue-600 bg-blue-100'
    },
    {
      title: 'Average Order Value',
      value: `৳${(salesData?.avgOrderValue || 0).toLocaleString()}`,
      change: salesData?.aovChange || 0,
      icon: CreditCard,
      color: 'text-purple-600 bg-purple-100'
    },
    {
      title: 'New Customers',
      value: (salesData?.newCustomers || 0).toLocaleString(),
      change: salesData?.customerChange || 0,
      icon: Users,
      color: 'text-orange-600 bg-orange-100'
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales & Revenue</h1>
            <p className="text-gray-600 mt-1">
              Track your sales performance and revenue analytics
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            >
              <option value="BDT">BDT (৳)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Report
            </button>
          </div>
        </div>
      </div>

      {/* Sales Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{metric.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={`text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                      {isPositive ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-xs text-gray-500 ml-1">vs last period</span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg ${metric.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Sales Overview</h2>
            <p className="text-sm text-gray-500 mt-1">Revenue trends and performance metrics</p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {/* Period Selector */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              {['daily', 'weekly', 'monthly', 'yearly'].map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`px-4 py-2 text-sm font-medium capitalize ${
                    period === p
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chart Type Selector */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setChartType('line')}
                className={`p-2 ${chartType === 'line' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Line Chart"
              >
                <TrendingUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-2 ${chartType === 'bar' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Bar Chart"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setChartType('pie')}
                className={`p-2 ${chartType === 'pie' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Pie Chart"
              >
                <PieChart className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
          </div>
        </div>

        <SalesChart period={period} chartType={chartType} />
      </div>

      {/* Additional Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
              <p className="text-sm text-gray-500 mt-1">Best performing products by revenue</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {salesData?.topProducts?.slice(0, 5).map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">৳{product.revenue.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{product.quantity} sold</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Revenue by Category</h2>
              <p className="text-sm text-gray-500 mt-1">Sales distribution across categories</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {salesData?.categories?.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900">{category.name}</span>
                  <span className="text-sm text-gray-500">৳{category.revenue.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{category.percentage}% of total</span>
                  <span>{category.orders} orders</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Comparison */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Period Comparison</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Current Period</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ৳{(salesData?.currentPeriod || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Previous Period</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ৳{(salesData?.previousPeriod || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total Revenue</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Growth Rate</p>
            <p className={`text-2xl font-bold mt-2 ${
              salesData?.growthRate >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {salesData?.growthRate >= 0 ? '+' : ''}{salesData?.growthRate || 0}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Revenue Growth</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-500">Avg Daily Sales</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ৳{(salesData?.avgDailySales || 0).toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">Per Day Average</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SalesPage;