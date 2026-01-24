'use client';
import React, { useState } from 'react';
import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
  MoreVertical,
  Filter,
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/utils/formatters';

const OrderTable = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'today',
    search: '',
    page: 1,
    limit: 10,
  });

  const { data: ordersData, isLoading, error, refetch } = useOrders(filters);
  const updateOrderStatusMutation = useUpdateOrderStatus();

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatusMutation.mutateAsync({
        orderId,
        status: newStatus,
      });
      refetch(); // Refetch to get updated data
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      pending: {
        icon: Clock,
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        bgColor: 'bg-yellow-50',
        textColor: 'text-yellow-700',
        actions: ['processing', 'cancelled'],
      },
      processing: {
        icon: Package,
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-700',
        actions: ['shipped', 'cancelled'],
      },
      shipped: {
        icon: Truck,
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-700',
        actions: ['delivered', 'cancelled'],
      },
      delivered: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-800 border-green-200',
        bgColor: 'bg-green-50',
        textColor: 'text-green-700',
        actions: ['completed', 'returned'],
      },
      cancelled: {
        icon: AlertCircle,
        color: 'bg-red-100 text-red-800 border-red-200',
        bgColor: 'bg-red-50',
        textColor: 'text-red-700',
        actions: [],
      },
      returned: {
        icon: AlertCircle,
        color: 'bg-orange-100 text-orange-800 border-orange-200',
        bgColor: 'bg-orange-50',
        textColor: 'text-orange-700',
        actions: [],
      },
    };
    return configs[status] || configs.pending;
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">Failed to load orders</p>
      </div>
    );
  }

  const orders = ordersData?.orders || [];
  const totalOrders = ordersData?.total || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalOrders} total orders • {ordersData?.pendingCount || 0}{' '}
              pending
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Status Filter */}
            <div className="flex gap-2">
              {['all', 'pending', 'processing', 'delivered', 'cancelled'].map(
                (status) => (
                  <button
                    key={status}
                    onClick={() =>
                      setFilters((prev) => ({ ...prev, status, page: 1 }))
                    }
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                      filters.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {status.replace('_', ' ')}
                  </button>
                )
              )}
            </div>

            {/* Date Filter */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.dateRange}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, dateRange: e.target.value }))
              }
            >
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => {
              const statusConfig = getStatusConfig(order.status);
              const StatusIcon = statusConfig.icon;

              return (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      #{order.orderNumber}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.items.length} item
                      {order.items.length > 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-medium text-gray-900">
                      {order.customer?.name || 'Guest'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.customer?.phone || order.customer?.email}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {order.paymentMethod}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border ${statusConfig.color}`}
                      >
                        <StatusIcon className="h-3.5 w-3.5" />
                        <span className="text-xs font-medium capitalize">
                          {order.status}
                        </span>
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.paymentStatus === 'paid'
                          ? 'bg-green-100 text-green-800'
                          : order.paymentStatus === 'pending'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2">
                      <button
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Status Update Dropdown */}
                      {statusConfig.actions.length > 0 && (
                        <div className="relative">
                          <button
                            className="p-1.5 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                            title="More Options"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </button>
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10 hidden group-hover:block">
                            {statusConfig.actions.map((action) => (
                              <button
                                key={action}
                                onClick={() =>
                                  handleStatusUpdate(order.id, action)
                                }
                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg capitalize"
                              >
                                Mark as {action}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No orders found
          </h3>
          <p className="text-gray-500">
            {filters.status !== 'all'
              ? `No ${filters.status} orders for this period`
              : 'No orders placed yet'}
          </p>
        </div>
      )}

      {/* Pagination */}
      {ordersData?.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Page {filters.page} of {ordersData.totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page - 1 }))
                }
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                onClick={() =>
                  setFilters((prev) => ({ ...prev, page: prev.page + 1 }))
                }
                disabled={filters.page === ordersData.totalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTable;
