import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import AnalyticsCharts from '../../components/vendor/AnalyticsCharts';
import { 
  TrendingUp, 
  Users, 
  ShoppingBag, 
  Eye,
  MousePointerClick,
  Clock,
  DollarSign,
  PieChart,
  BarChart3,
  Download,
  Calendar,
  Filter
} from 'lucide-react';
import { useVendorStats } from '../../hooks/useVendorQuery';

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('30days');
  const [compareWith, setCompareWith] = useState('previous_period');
  const [chartMetric, setChartMetric] = useState('revenue');

  const { data: analyticsData } = useVendorStats();

  const metrics = [
    {
      title: 'Conversion Rate',
      value: `${analyticsData?.conversionRate || 4.8}%`,
      change: 2.4,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-600'
    },
    {
      title: 'Avg. Session Duration',
      value: `${analyticsData?.avgSessionDuration || 3.2}min`,
      change: 1.2,
      icon: Clock,
      color: 'from-blue-500 to-cyan-600'
    },
    {
      title: 'Page Views',
      value: `${(analyticsData?.pageViews || 12450).toLocaleString()}`,
      change: 8.7,
      icon: Eye,
      color: 'from-purple-500 to-pink-600'
    },
    {
      title: 'Bounce Rate',
      value: `${analyticsData?.bounceRate || 32.4}%`,
      change: -2.1,
      icon: MousePointerClick,
      color: 'from-orange-500 to-amber-600'
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Deep insights into your store performance and customer behavior
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Calendar className="h-4 w-4" />
              Select Date Range
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Data
            </button>
          </div>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            {['7days', '30days', '90days', 'year', 'custom'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                  timeRange === range
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {range.replace('days', ' days')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={compareWith}
              onChange={(e) => setCompareWith(e.target.value)}
            >
              <option value="previous_period">Compare with Previous Period</option>
              <option value="last_year">Compare with Last Year</option>
              <option value="industry_avg">Compare with Industry Avg.</option>
              <option value="none">No Comparison</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={chartMetric}
              onChange={(e) => setChartMetric(e.target.value)}
            >
              <option value="revenue">Revenue</option>
              <option value="orders">Orders</option>
              <option value="customers">Customers</option>
              <option value="conversion">Conversion Rate</option>
              <option value="traffic">Traffic</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {metrics.map((metric, index) => {
          const Icon = metric.icon;
          const isPositive = metric.change >= 0;
          
          return (
            <div key={index} className={`bg-gradient-to-r ${metric.color} rounded-xl shadow-sm p-6 text-white`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-90">{metric.title}</p>
                  <p className="text-2xl font-bold mt-2">{metric.value}</p>
                  <div className="flex items-center mt-2">
                    {isPositive ? (
                      <TrendingUp className="h-4 w-4 opacity-80 mr-1" />
                    ) : (
                      <TrendingUp className="h-4 w-4 opacity-80 mr-1 transform rotate-180" />
                    )}
                    <span className="text-sm font-medium">
                      {isPositive ? '+' : ''}{metric.change}%
                    </span>
                    <span className="text-xs opacity-80 ml-1">vs last period</span>
                  </div>
                </div>
                <div className="p-3 bg-white/20 rounded-lg">
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Analytics Charts */}
      <AnalyticsCharts timeRange={timeRange} metric={chartMetric} />

      {/* Detailed Analytics Grid */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Traffic Sources</h2>
              <p className="text-sm text-gray-500 mt-1">Where your visitors come from</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {analyticsData?.trafficSources?.map((source, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${source.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{source.name}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-500">{source.visitors.toLocaleString()} visitors</span>
                    <span className="text-sm font-medium text-gray-900">{source.percentage}%</span>
                  </div>
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

        {/* Device Breakdown */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Device Breakdown</h2>
              <p className="text-sm text-gray-500 mt-1">Visitors by device type</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Details
            </button>
          </div>

          <div className="space-y-4">
            {analyticsData?.deviceBreakdown?.map((device, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                      {device.icon === 'mobile' ? (
                        <div className="h-4 w-2 border border-gray-400 rounded"></div>
                      ) : device.icon === 'tablet' ? (
                        <div className="h-3 w-4 border border-gray-400 rounded"></div>
                      ) : (
                        <div className="h-3 w-4 border border-gray-400 rounded"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-900">{device.name}</span>
                      <p className="text-xs text-gray-500">{device.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">{device.percentage}%</span>
                    <p className="text-xs text-gray-500">{device.sessions.toLocaleString()} sessions</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Indicators */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Key Performance Indicators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">Revenue per Visitor</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              ৳{analyticsData?.revenuePerVisitor || 245}
            </p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">New vs Returning</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {(analyticsData?.newVsReturning || 65)}%
            </p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500">Cart Abandonment</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              {analyticsData?.cartAbandonment || 68}%
            </p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
            <p className="text-sm text-gray-500">Growth Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">
              +{analyticsData?.growthRate || 12.5}%
            </p>
          </div>
        </div>
      </div>

      {/* Chart Type Toggle */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Chart Visualization</h2>
            <p className="text-sm text-gray-500 mt-1">Choose how to view your data</p>
          </div>
          <div className="flex border border-gray-300 rounded-lg overflow-hidden">
            <button
              className={`px-4 py-2 flex items-center gap-2 ${
                chartMetric === 'revenue' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => setChartMetric('revenue')}
            >
              <BarChart3 className="h-4 w-4" />
              Bar Chart
            </button>
            <button
              className={`px-4 py-2 flex items-center gap-2 ${
                chartMetric === 'orders' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => setChartMetric('orders')}
            >
              <TrendingUp className="h-4 w-4" />
              Line Chart
            </button>
            <button
              className={`px-4 py-2 flex items-center gap-2 ${
                chartMetric === 'customers' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'
              }`}
              onClick={() => setChartMetric('customers')}
            >
              <PieChart className="h-4 w-4" />
              Pie Chart
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AnalyticsPage;