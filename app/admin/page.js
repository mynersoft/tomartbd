'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp,
  Users,
  Package,
  Truck,
  CheckCircle,
  ShoppingCart,
  DollarSign,
  ArrowUp,
  ArrowDown,
  Download,
  BarChart3,
  PieChart,
  LineChart,
  RefreshCw,
  Bell,
  Search,
  User,
  Moon,
  Sun,
  Clock,
  Globe,
  Filter,
  ChevronDown,
  Icon,
} from 'lucide-react';
import StatCard from '@/components/Dashboard/Admin/StatCard';
import ChartCard from '@/components/Dashboard/Admin/ChartCard';
import RecentOrders from '@/components/Dashboard/Admin/RecentOrders';
import TrafficSources from '@/components/Dashboard/Admin/TrafficSources';
import TopProducts from '@/components/Dashboard/Admin/TopProducts';
import SalesMap from '@/components/Dashboard/Admin/SalesMap';
import ActivityFeed from '@/components/Dashboard/Admin/ActivityFeed';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [theme, setTheme] = useState('light');
  const [timeRange, setTimeRange] = useState('month');
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('overview');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const [data, setData] = useState({
    revenue: 45231.89,
    orders: 1245,
    users: 856,
    conversion: 4.8,
    growth: 12.5,
  });
  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setData({
        revenue: data.revenue + Math.random() * 1000,
        orders: data.orders + Math.floor(Math.random() * 50),
        users: data.users + Math.floor(Math.random() * 20),
        conversion: data.conversion + (Math.random() * 0.5 - 0.25),
        growth: data.growth + (Math.random() * 2 - 1),
      });
      setLoading(false);
    }, 1000);
  };

  const timeRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'This Quarter' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' },
  ];
  const metrics = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'sales', label: 'Sales', icon: DollarSign },
    { id: 'customers', label: 'Customers', icon: Users },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'traffic', label: 'Traffic', icon: Globe },
  ];

  const statCard = [
    {
      title: 'Total Revenue',
      value: data.revenue,
      change: data.growth,
      icon: DollarSign,
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100 dark:bg-green-900/30',
      trend: 'up',
      format: 'currency',
    },
    {
      title: 'Total Orders',
      value: data.orders,
      change: 8.2,
      icon: ShoppingCart,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/30',
      trend: 'up',
    },
    {
      title: 'New Users',
      value: data.users,
      change: 15.3,
      icon: Users,
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/30',
      trend: 'up',
    },
    {
      title: 'Conversion Rate',
      value: data.conversion,
      change: -2.1,
      icon: TrendingUp,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
      trend: 'down',
      format: 'percentage',
    },
  ];

  // check isAdmin
  useEffect(() => {
    if (status === 'authenticated') {
      const role = session?.user?.role;

      if (role === 'admin') {
        router.replace('/admin');
      } else if (role === 'user') {
        router.replace('/user');
      } else if (role === 'seller') {
        router.replace('/seller');
      }
    }
  }, [status, session, router]);

  if (status === 'loading') {
    return <div className="p-6">Loading dashboard...</div>;
  }

  return (
    <div
      className={`min-h-screen ${theme === 'dark' ? 'dark bg-gray-900' : 'bg-gray-50'}`}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Track your store performance and metrics
          </p>
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
                      ${
                        selectedMetric === metric.id
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
                      ${
                        timeRange === range.id
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
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
                />
              </button>

              {showFilters && (
                <div className="absolute top-full right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="date"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                        />
                        <input
                          type="date"
                          className="w-full px-3 py-1.5 border border-gray-300 rounded-lg"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Compare With
                      </label>
                      <select className="w-full px-3 py-1.5 border border-gray-300 rounded-lg">
                        <option>Previous Period</option>
                        <option>Same Period Last Year</option>
                        <option>Custom Range</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Metrics
                      </label>
                      <div className="space-y-1">
                        {[
                          'Revenue',
                          'Orders',
                          'Customers',
                          'Conversion',
                          'AOV',
                        ].map((metric) => (
                          <label
                            key={metric}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              defaultChecked
                              className="rounded border-gray-300"
                            />
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

      {/* Main Content */}
      <main className="px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCard.map((item, index) => (
              <StatCard
                key={index}
                title={item.title}
                value={item.value}
                change={item.change}
                icon={item.icon}
                iconColor={item.iconColor}
                iconBg={item.iconBg}
                trend={item.trend}
                theme={theme}
                format={item.format}
                description={item.description}
                showGraph={item.showGraph !== false}
              />
            ))}
          </div>

          {/* Charts and Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Sales Chart */}
            <div
              className={`lg:col-span-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3
                    className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                  >
                    Revenue Overview
                  </h3>
                  <p
                    className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    Monthly revenue performance
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <BarChart3
                      className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <PieChart
                      className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>
                  <button
                    className={`p-2 rounded-lg ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} transition-colors`}
                  >
                    <LineChart
                      className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                    />
                  </button>
                </div>
              </div>
              <div className="h-80">
                <ChartCard type="line" theme={theme} />
              </div>
            </div>

            {/* Traffic Sources */}
            <TrafficSources theme={theme} />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Order Status */}
            <div
              className={`rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <h3
                className={`text-lg font-semibold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
              >
                Order Status
              </h3>
              <div className="space-y-6">
                {[
                  {
                    status: 'Pending',
                    count: 245,
                    color: 'bg-yellow-500',
                    icon: Clock,
                    change: 12,
                  },
                  {
                    status: 'Processing',
                    count: 189,
                    color: 'bg-blue-500',
                    icon: Package,
                    change: 8,
                  },
                  {
                    status: 'Shipped',
                    count: 156,
                    color: 'bg-purple-500',
                    icon: Truck,
                    change: -4,
                  },
                  {
                    status: 'Delivered',
                    count: 567,
                    color: 'bg-green-500',
                    icon: CheckCircle,
                    change: 15,
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg ${item.color} flex items-center justify-center`}
                      >
                        <item.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p
                          className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}
                        >
                          {item.status}
                        </p>
                        <p
                          className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}
                        >
                          {item.count} orders
                        </p>
                      </div>
                    </div>
                    <div
                      className={`text-sm font-medium ${item.change > 0 ? 'text-green-500' : 'text-red-500'}`}
                    >
                      {item.change > 0 ? '+' : ''}
                      {item.change}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <TopProducts theme={theme} />

            {/* Sales Map */}
            <SalesMap theme={theme} />
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Orders */}
            <div
              className={`lg:col-span-2 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
            >
              <RecentOrders theme={theme} />
            </div>

            {/* Activity Feed */}
            <ActivityFeed theme={theme} />
          </div>

          {/* Quick Stats Bar */}
          <div
            className={`mt-8 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} p-6 shadow-sm border ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}
          >
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[
                { label: 'Avg. Order Value', value: '$124.50', change: 5.2 },
                { label: 'Customer Satisfaction', value: '4.8/5', change: 0.3 },
                { label: 'Return Rate', value: '2.4%', change: -0.8 },
                { label: 'Inventory Turnover', value: '8.2x', change: 1.2 },
                { label: 'Cart Abandonment', value: '24.5%', change: -3.1 },
                { label: 'Repeat Purchase', value: '42.8%', change: 6.7 },
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <p
                    className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} mb-1`}
                  >
                    {stat.label}
                  </p>
                  <p
                    className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-1`}
                  >
                    {stat.value}
                  </p>
                  <div
                    className={`inline-flex items-center text-sm ${stat.change > 0 ? 'text-green-500' : 'text-red-500'}`}
                  >
                    {stat.change > 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    {stat.change > 0 ? '+' : ''}
                    {stat.change}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
