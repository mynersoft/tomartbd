'use client';

import React, { useState } from 'react';
import DashboardLayout from '@/components/Vendor/DashboardLayout';
import CustomerTable from '@/components/Vendor/CustomerTable';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter,
  Mail,
  Phone,
  MapPin,
  Star,
  TrendingUp,
  MessageSquare
} from 'lucide-react';
import { useCustomers } from '../../hooks/useVendorQuery';

const CustomersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [segmentFilter, setSegmentFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { data: customersData } = useCustomers({
    search: searchQuery,
    segment: segmentFilter !== 'all' ? segmentFilter : undefined,
    sortBy
  });

  const customerSegments = [
    { label: 'All Customers', value: 'all', count: customersData?.total || 0, color: 'bg-gray-500' },
    { label: 'New Customers', value: 'new', count: customersData?.newCount || 0, color: 'bg-blue-500' },
    { label: 'Regular', value: 'regular', count: customersData?.regularCount || 0, color: 'bg-green-500' },
    { label: 'VIP', value: 'vip', count: customersData?.vipCount || 0, color: 'bg-purple-500' },
    { label: 'Inactive', value: 'inactive', count: customersData?.inactiveCount || 0, color: 'bg-yellow-500' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your customers, view insights, and build relationships
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Mail className="h-4 w-4" />
              Send Email
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <UserPlus className="h-4 w-4" />
              Add Customer
            </button>
          </div>
        </div>
      </div>

      {/* Customer Segments */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {customerSegments.map((segment) => (
          <div
            key={segment.value}
            className={`bg-white rounded-xl shadow-sm p-4 cursor-pointer transition-all hover:shadow-md ${
              segmentFilter === segment.value ? 'ring-2 ring-blue-500' : ''
            }`}
            onClick={() => setSegmentFilter(segment.value)}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{segment.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{segment.count}</p>
              </div>
              <div className={`h-10 w-10 rounded-lg ${segment.color} flex items-center justify-center`}>
                <Users className="h-5 w-5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Customer Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Customer Value</p>
              <p className="text-2xl font-bold mt-2">৳{(customersData?.avgValue || 0).toLocaleString()}</p>
            </div>
            <TrendingUp className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-80 mt-4">Lifetime value per customer</p>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Repeat Purchase Rate</p>
              <p className="text-2xl font-bold mt-2">{customersData?.repeatRate || 0}%</p>
            </div>
            <Users className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-80 mt-4">Customers who buy again</p>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-sm p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Rating</p>
              <div className="flex items-center gap-2 mt-2">
                <p className="text-2xl font-bold">{customersData?.avgRating || '4.8'}</p>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className="h-4 w-4 fill-current"
                    />
                  ))}
                </div>
              </div>
            </div>
            <Star className="h-8 w-8 opacity-80" />
          </div>
          <p className="text-sm opacity-80 mt-4">Customer satisfaction score</p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search customers by name, email, or phone..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="recent">Recently Added</option>
              <option value="name">Name A-Z</option>
              <option value="value">Highest Value</option>
              <option value="orders">Most Orders</option>
              <option value="spent">Most Spent</option>
              <option value="inactive">Inactive</option>
            </select>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Customers Table */}
      <CustomerTable />

      {/* Customer Insights */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Top Customers</h2>
              <p className="text-sm text-gray-500 mt-1">Highest spending customers</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All
            </button>
          </div>

          <div className="space-y-4">
            {customersData?.topCustomers?.slice(0, 5).map((customer, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {customer.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{customer.name}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Mail className="h-3 w-3" />
                      <span>{customer.email}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">৳{customer.totalSpent.toLocaleString()}</p>
                  <p className="text-sm text-gray-500">{customer.orderCount} orders</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Locations */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Customer Locations</h2>
              <p className="text-sm text-gray-500 mt-1">Geographic distribution</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
              View Map
            </button>
          </div>

          <div className="space-y-4">
            {customersData?.locations?.map((location, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{location.city}</p>
                    <p className="text-sm text-gray-500">{location.region}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{location.count} customers</p>
                  <p className="text-sm text-gray-500">{location.percentage}% of total</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Customer Engagement */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Customer Engagement</h2>
            <p className="text-sm text-gray-500 mt-1">Recent interactions and activities</p>
          </div>
          <button className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
            <MessageSquare className="h-4 w-4" />
            Start Campaign
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Mail className="h-6 w-6 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">Email Open Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customersData?.emailOpenRate || 0}%</p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="h-6 w-6 text-green-600" />
            </div>
            <p className="text-sm text-gray-500">Response Rate</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customersData?.responseRate || 0}%</p>
          </div>

          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="h-6 w-6 text-purple-600" />
            </div>
            <p className="text-sm text-gray-500">Support Tickets</p>
            <p className="text-2xl font-bold text-gray-900 mt-2">{customersData?.supportTickets || 0}</p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CustomersPage;