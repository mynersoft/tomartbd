import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import OrderTable from '../../components/vendor/OrderTable';
import { 
  Filter, 
  Download, 
  Printer, 
  RefreshCw,
  Calendar,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useOrders } from '../../hooks/useVendorQuery';

const OrdersPage = () => {
  const [dateRange, setDateRange] = useState('today');
  const [orderType, setOrderType] = useState('all');
  const [paymentStatus, setPaymentStatus] = useState('all');

  const { data: ordersData, refetch, isLoading } = useOrders({
    dateRange,
    orderType,
    paymentStatus
  });

  const orderStats = [
    {
      label: 'Total Orders',
      value: ordersData?.total || 0,
      icon: Package,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      label: 'Processing',
      value: ordersData?.processingCount || 0,
      icon: RefreshCw,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      label: 'Shipped',
      value: ordersData?.shippedCount || 0,
      icon: Truck,
      color: 'bg-purple-100 text-purple-600'
    },
    {
      label: 'Delivered',
      value: ordersData?.deliveredCount || 0,
      icon: CheckCircle,
      color: 'bg-green-100 text-green-600'
    },
    {
      label: 'Cancelled',
      value: ordersData?.cancelledCount || 0,
      icon: XCircle,
      color: 'bg-red-100 text-red-600'
    }
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
            <p className="text-gray-600 mt-1">
              View, process, and manage customer orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => refetch()}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Order Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {orderStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`p-2 rounded-lg ${stat.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Date Range */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <select
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                <option value="today">Today</option>
                <option value="yesterday">Yesterday</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="quarter">This Quarter</option>
                <option value="year">This Year</option>
                <option value="custom">Custom Range</option>
              </select>
            </div>
          </div>

          {/* Order Type */}
          <div className="flex-1">
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={orderType}
              onChange={(e) => setOrderType(e.target.value)}
            >
              <option value="all">All Order Types</option>
              <option value="regular">Regular</option>
              <option value="preorder">Pre-order</option>
              <option value="wholesale">Wholesale</option>
              <option value="subscription">Subscription</option>
            </select>
          </div>

          {/* Payment Status */}
          <div className="flex-1">
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={paymentStatus}
              onChange={(e) => setPaymentStatus(e.target.value)}
            >
              <option value="all">All Payment Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="refunded">Refunded</option>
              <option value="partial">Partially Paid</option>
            </select>
          </div>

          <button className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4" />
            More Filters
          </button>
        </div>

        {/* Quick Status Filter */}
        <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t border-gray-200">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'].map((status) => (
            <button
              key={status}
              onClick={() => setOrderType(status === 'all' ? 'all' : status)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                orderType === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <OrderTable />

      {/* Order Processing Tips */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-800 mb-2">Order Processing Tips</h3>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Process orders within 24 hours for better customer satisfaction</li>
                <li>• Update tracking information promptly after shipping</li>
                <li>• Contact customers if there are any delays</li>
                <li>• Check inventory before confirming orders</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-green-800 mb-2">Best Practices</h3>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Package items securely with proper padding</li>
                <li>• Include a thank you note in packages</li>
                <li>• Double-check addresses before shipping</li>
                <li>• Follow up with customers after delivery</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrdersPage;