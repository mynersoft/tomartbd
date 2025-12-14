
"use client";


import { useState, useEffect } from 'react';
import {
  Users, ShoppingBag, DollarSign, TrendingUp, TrendingDown,
  BarChart3, PieChart, LineChart, Calendar, Download,
  Filter, ChevronDown, Eye, RefreshCw, ArrowUpRight,
  ArrowDownRight, CreditCard, Package, Repeat, Award,
  Target, Globe, Clock, Star, Bell, Settings
} from 'lucide-react';

export default function AdminAnalytics() {
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  // Mock data - in real app, this would come from an API
  const [analyticsData, setAnalyticsData] = useState({
    revenue: {
      total: 125430,
      change: 12.5,
      trend: 'up',
      data: [45000, 52000, 48000, 61000, 72000, 68000, 80000, 92000, 85000, 98000, 105000, 125430]
    },
    orders: {
      total: 3421,
      change: 8.3,
      trend: 'up',
      data: [280, 320, 290, 350, 380, 340, 410, 450, 420, 480, 510, 540]
    },
    customers: {
      total: 8432,
      change: 15.2,
      trend: 'up',
      data: [620, 680, 710, 780, 820, 890, 920, 980, 1020, 1100, 1150, 1200]
    },
    conversion: {
      total: 4.2,
      change: -1.2,
      trend: 'down',
      data: [4.5, 4.2, 4.0, 4.3, 4.1, 4.4, 4.0, 4.2, 4.1, 4.3, 4.0, 4.2]
    },
    avgOrderValue: {
      total: 36.65,
      change: 3.8,
      trend: 'up'
    },
    refunds: {
      total: 12400,
      change: -2.1,
      trend: 'down'
    }
  });

  const topProducts = [
    { id: 1, name: 'Wireless Headphones', sales: 342, revenue: 27360, growth: 24 },
    { id: 2, name: 'Smart Watch Series 5', sales: 289, revenue: 37570, growth: 42 },
    { id: 3, name: 'USB-C Laptop Charger', sales: 567, revenue: 11340, growth: 15 },
    { id: 4, name: 'Ergonomic Office Chair', sales: 89, revenue: 35600, growth: 68 },
    { id: 5, name: 'Bluetooth Speaker', sales: 421, revenue: 25260, growth: 31 }
  ];

  const trafficSources = [
    { source: 'Organic Search', visitors: 8432, percentage: 42, color: 'bg-blue-500' },
    { source: 'Direct', visitors: 5210, percentage: 26, color: 'bg-green-500' },
    { source: 'Social Media', visitors: 3421, percentage: 17, color: 'bg-purple-500' },
    { source: 'Email', visitors: 1890, percentage: 9, color: 'bg-yellow-500' },
    { source: 'Referral', visitors: 1050, percentage: 5, color: 'bg-red-500' }
  ];

  const recentActivities = [
    { id: 1, user: 'John Smith', action: 'placed a new order', value: '$249.99', time: '2 min ago' },
    { id: 2, user: 'Sarah Johnson', action: 'subscribed to newsletter', value: '', time: '5 min ago' },
    { id: 3, user: 'Mike Wilson', action: 'requested a refund', value: '$99.99', time: '12 min ago' },
    { id: 4, user: 'Emma Davis', action: 'wrote a 5-star review', value: '', time: '25 min ago' },
    { id: 5, user: 'Alex Brown', action: 'created an account', value: '', time: '42 min ago' }
  ];

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'traffic', label: 'Traffic', icon: Globe }
  ];

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">Track your store performance and metrics</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={refreshData}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
              <Download className="w-4 h-4" />
              Export Report
            </button>
          </div>
        </div>

        {/* Time Range & Filters */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Metric Tabs */}
            <div className="flex flex-wrap gap-2">
              {metrics.map((metric) => {
                const Icon = metric.icon;
                return (
                  <button
                    key={metric.id}
                    onClick={() => setSelectedMetric(metric.id)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
                      ${selectedMetric === metric.id 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{metric.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Time Range & Filter */}
            <div className="flex items-center gap-3">
              <div className="flex flex-wrap gap-2">
                {timeRanges.slice(0, 5).map((range) => (
                  <button
                    key={range.id}
                    onClick={() => setTimeRange(range.id)}
                    className={`
                      px-3 py-1.5 rounded-lg text-sm font-medium transition
                      ${timeRange === range.id 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }
                    `}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
              
              <div className="relative">
                <button 
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                
                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
                        <div className="space-y-2">
                          <input type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg" />
                          <input type="date" className="w-full px-3 py-1.5 border border-gray-300 rounded-lg" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Compare With</label>
                        <select className="w-full px-3 py-1.5 border border-gray-300 rounded-lg">
                          <option>Previous Period</option>
                          <option>Same Period Last Year</option>
                          <option>Custom Range</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Metrics</label>
                        <div className="space-y-1">
                          {['Revenue', 'Orders', 'Customers', 'Conversion', 'AOV'].map((metric) => (
                            <label key={metric} className="flex items-center gap-2">
                              <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                              <span className="text-sm">{metric}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <button className="w-full px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Apply Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Revenue Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">REVENUE</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.revenue.total)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.revenue.trend === 'up' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{analyticsData.revenue.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{analyticsData.revenue.change}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500">from last period</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
            </div>
          </div>

          {/* Orders Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingBag className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">ORDERS</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.orders.total)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.orders.trend === 'up' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{analyticsData.orders.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{analyticsData.orders.change}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500">from last period</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: '72%' }}></div>
            </div>
          </div>

          {/* Customers Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">CUSTOMERS</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">{formatNumber(analyticsData.customers.total)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.customers.trend === 'up' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{analyticsData.customers.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{analyticsData.customers.change}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500">from last period</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-purple-500 rounded-full" style={{ width: '68%' }}></div>
            </div>
          </div>

          {/* Conversion Card */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-sm font-medium text-gray-500">CONVERSION RATE</span>
            </div>
            <div className="mb-2">
              <div className="text-2xl font-bold text-gray-900">{analyticsData.conversion.total}%</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.conversion.trend === 'up' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{analyticsData.conversion.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{analyticsData.conversion.change}%</span>
                  </>
                )}
                <span className="text-sm text-gray-500">from last period</span>
              </div>
            </div>
            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '63%' }}></div>
            </div>
          </div>
        </div>

        {/* Charts & Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Monthly revenue trends</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" />
                View Details
              </button>
            </div>
            <div className="h-64 flex items-end gap-2 pt-4">
              {analyticsData.revenue.data.map((value, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div 
                    className="w-full bg-blue-500 rounded-t-lg transition-all hover:bg-blue-600 cursor-pointer"
                    style={{ height: `${(value / 130000) * 100}%` }}
                    title={`$${value.toLocaleString()}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][index]}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Traffic Sources</h3>
                <p className="text-sm text-gray-500">Where your visitors come from</p>
              </div>
              <Globe className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700">{source.source}</span>
                    <span className="text-sm font-medium text-gray-900">{formatNumber(source.visitors)} ({source.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${source.color}`}
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Additional Metrics & Top Products */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Top Performing Products</h3>
                <p className="text-sm text-gray-500">Best sellers by revenue</p>
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                View All Products →
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Product</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Sales</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Revenue</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Growth</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {topProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{product.name}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{formatNumber(product.sales)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-green-600">+{product.growth}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Secondary Metrics */}
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <CreditCard className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">AVG ORDER VALUE</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.avgOrderValue.total)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.avgOrderValue.trend === 'up' ? (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">+{analyticsData.avgOrderValue.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">{analyticsData.avgOrderValue.change}%</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Repeat className="w-5 h-5 text-red-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">REFUNDS</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(analyticsData.refunds.total)}</div>
              <div className="flex items-center gap-1 mt-1">
                {analyticsData.refunds.trend === 'down' ? (
                  <>
                    <ArrowDownRight className="w-4 h-4 text-green-500" />
                    <span className="text-sm font-medium text-green-600">{analyticsData.refunds.change}%</span>
                  </>
                ) : (
                  <>
                    <ArrowUpRight className="w-4 h-4 text-red-500" />
                    <span className="text-sm font-medium text-red-600">+{analyticsData.refunds.change}%</span>
                  </>
                )}
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Award className="w-5 h-5 text-orange-600" />
                </div>
                <span className="text-sm font-medium text-gray-500">CUSTOMER SATISFACTION</span>
              </div>
              <div className="text-2xl font-bold text-gray-900">4.8/5</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-600">Based on 1,234 reviews</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity & Quick Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Activity */}
          <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Recent Activity</h3>
                <p className="text-sm text-gray-500">Latest actions in your store</p>
              </div>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <Users className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{activity.user}</div>
                      <div className="text-sm text-gray-500">
                        {activity.action} {activity.value && <span className="font-medium">{activity.value}</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {activity.time}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Stats */}
          <div className="bg-white p-5 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="font-bold text-gray-900">Quick Stats</h3>
                <p className="text-sm text-gray-500">Performance indicators</p>
              </div>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">New Customers Today</span>
                <span className="font-bold text-gray-900">42</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Abandoned Carts</span>
                <span className="font-bold text-gray-900">18</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Avg. Session Duration</span>
                <span className="font-bold text-gray-900">4:32</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Returning Customers</span>
                <span className="font-bold text-gray-900">34%</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Mobile Traffic</span>
                <span className="font-bold text-gray-900">62%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Tips */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">Dashboard Tips</h4>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                <li>Click on any metric card to view detailed analytics</li>
                <li>Use filters to compare different time periods</li>
                <li>Export reports for stakeholder presentations</li>
                <li>Set up alerts for unusual activity</li>
                <li>Monitor conversion rate trends daily for quick optimizations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}