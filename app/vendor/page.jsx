import React from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import StatsCards from '../../components/vendor/StatsCards';
import SalesChart from '../../components/vendor/SalesChart';
import RecentActivity from '../../components/vendor/RecentActivity';
import OrderTable from '../../components/vendor/OrderTable';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users,
  ArrowUpRight,
  Plus,
  AlertCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useVendorStats } from '../../hooks/useVendorQuery';

const DashboardPage = () => {
  const { data: stats, isLoading } = useVendorStats();

  return (
    <DashboardLayout>
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <p className="text-gray-600 mt-1">
              Track your store performance and recent activities
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <TrendingUp className="h-4 w-4" />
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <StatsCards />

      {/* Alerts */}
      {stats?.alerts && stats.alerts.length > 0 && (
        <div className="mb-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-yellow-800">Attention Needed</h3>
                <ul className="mt-1 text-sm text-yellow-700">
                  {stats.alerts.map((alert, index) => (
                    <li key={index}>• {alert}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sales Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Revenue Analytics</h2>
                <p className="text-sm text-gray-500 mt-1">Sales performance over time</p>
              </div>
              <div className="flex items-center gap-3">
                <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
                  <option>Last 7 days</option>
                  <option>Last 30 days</option>
                  <option>Last 90 days</option>
                  <option>This Year</option>
                </select>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  Export
                </button>
              </div>
            </div>
            <SalesChart />
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                  <p className="text-sm text-gray-500 mt-1">Latest customer orders</p>
                </div>
                <Link
                  to="/vendor/orders"
                  className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="overflow-x-auto">
              <OrderTable compact={true} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                <p className="text-sm text-gray-500 mt-1">Your store activities</p>
              </div>
              <Link
                to="/vendor/activities"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                View All
              </Link>
            </div>
            <RecentActivity limit={5} />
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
                    <p className="text-xl font-bold">{stats?.conversionRate || '4.8%'}</p>
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
                    <p className="text-xl font-bold">৳{stats?.avgOrderValue?.toLocaleString() || '2,450'}</p>
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
                    <p className="text-xl font-bold">{stats?.satisfactionRate || '94%'}</p>
                  </div>
                </div>
                <span className="text-sm text-green-300">+3.2%</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Link
                to="/vendor/products/add"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">Add New Product</span>
                <Package className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/vendor/orders?status=pending"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">Process Orders</span>
                <ShoppingBag className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/vendor/analytics"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">View Analytics</span>
                <TrendingUp className="h-4 w-4 text-gray-400" />
              </Link>
              <Link
                to="/vendor/inventory"
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">Check Inventory</span>
                <Package className="h-4 w-4 text-gray-400" />
              </Link>
            </div>
          </div>

          {/* Low Stock Alert */}
          {stats?.lowStockItems && stats.lowStockItems.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                <div>
                  <h3 className="text-sm font-medium text-red-800">Low Stock Alert</h3>
                  <p className="text-sm text-red-700 mt-1">
                    {stats.lowStockItems.length} products are running low
                  </p>
                </div>
              </div>
              <Link
                to="/vendor/inventory?filter=low_stock"
                className="inline-flex items-center text-sm font-medium text-red-700 hover:text-red-800"
              >
                Restock Now
                <ArrowUpRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardPage;