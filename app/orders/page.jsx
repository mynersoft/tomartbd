
"use client";

import React, { useState, useEffect } from 'react';

import {useOrders} from " @/hooks/useOrder";




const OrderManagementPage = () => {


const { data: orderData, isLoading, isError } = useOrders();


  // State for active tab and orders
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Order status categories
  const orderTabs = [
    { id: 'all', label: 'All Orders', count: 0 },
    { id: 'placed', label: 'Placed Order', count: 0 },
    { id: 'shipping', label: 'To Ship', count: 0 },
    { id: 'received', label: 'Received', count: 0 },
    { id: 'cancelled', label: 'Cancelled', count: 0 },
  ];

  // Sample order data
  const sampleOrders = [
    {
      id: 'ORD-001',
      date: '2023-10-15',
      customer: 'John Smith',
      items: 3,
      total: 89.99,
      status: 'placed',
      statusText: 'Order Placed',
      itemsList: ['Wireless Earbuds', 'Phone Case', 'Screen Protector']
    },
    {
      id: 'ORD-002',
      date: '2023-10-14',
      customer: 'Emma Johnson',
      items: 2,
      total: 124.50,
      status: 'shipping',
      statusText: 'To Ship',
      itemsList: ['Bluetooth Speaker', 'USB-C Cable']
    },
    {
      id: 'ORD-003',
      date: '2023-10-13',
      customer: 'Michael Chen',
      items: 1,
      total: 59.99,
      status: 'received',
      statusText: 'Received',
      itemsList: ['Smart Watch']
    },
    {
      id: 'ORD-004',
      date: '2023-10-12',
      customer: 'Sarah Williams',
      items: 4,
      total: 210.75,
      status: 'cancelled',
      statusText: 'Cancelled',
      itemsList: ['Laptop Backpack', 'Wireless Mouse', 'Keyboard', 'Mouse Pad']
    },
    {
      id: 'ORD-005',
      date: '2023-10-11',
      customer: 'David Miller',
      items: 2,
      total: 45.25,
      status: 'shipping',
      statusText: 'To Ship',
      itemsList: ['Phone Charger', 'Earbud Tips']
    },
    {
      id: 'ORD-006',
      date: '2023-10-10',
      customer: 'Lisa Anderson',
      items: 1,
      total: 299.99,
      status: 'received',
      statusText: 'Received',
      itemsList: ['Tablet']
    },
    {
      id: 'ORD-007',
      date: '2023-10-09',
      customer: 'Robert Taylor',
      items: 3,
      total: 78.50,
      status: 'placed',
      statusText: 'Order Placed',
      itemsList: ['HDMI Cable', 'Adapter', 'USB Hub']
    },
    {
      id: 'ORD-008',
      date: '2023-10-08',
      customer: 'Maria Garcia',
      items: 5,
      total: 150.00,
      status: 'shipping',
      statusText: 'To Ship',
      itemsList: ['Webcam', 'Microphone', 'Pop Filter', 'Camera Stand', 'Lighting']
    },
  ];

  // Initialize orders and update counts
  useEffect(() => {
    // Simulate API loading
    setTimeout(() => {
      setOrders(orderData);
      setIsLoading(false);
    }, 800);
  }, []);

  // Update tab counts whenever orders change
  useEffect(() => {
    if (orders.length > 0) {
      const updatedTabs = orderTabs.map(tab => {
        if (tab.id === 'all') {
          return { ...tab, count: orders.length };
        } else {
          const count = orders.filter(order => order.status === tab.id).length;
          return { ...tab, count };
        }
      });
      
      // Update the orderTabs array with counts (in a real app, you'd use state for this)
      orderTabs.forEach((tab, index) => {
        orderTabs[index].count = updatedTabs[index].count;
      });
    }
  }, [orders]);

  // Filter orders based on active tab
  const filteredOrders = activeTab === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeTab);

  // Function to get status color
  const getStatusColor = (status) => {
    switch(status) {
      case 'placed': return 'bg-blue-100 text-blue-800';
      case 'shipping': return 'bg-yellow-100 text-yellow-800';
      case 'received': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer orders</p>
        </header>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">To Ship</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'shipping').length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Received</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'received').length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Cancelled</p>
                <p className="text-2xl font-bold">{orders.filter(o => o.status === 'cancelled').length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex flex-wrap md:flex-nowrap overflow-x-auto">
              {orderTabs.map((tab) => (
                <button
                  key={tab.id}
                  className={`flex items-center px-6 py-4 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${activeTab === tab.id ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              {activeTab === 'all' ? 'All Orders' : 
               activeTab === 'placed' ? 'Placed Orders' :
               activeTab === 'shipping' ? 'Orders To Ship' :
               activeTab === 'received' ? 'Received Orders' : 'Cancelled Orders'}
            </h2>
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
          </div>

          {isLoading ? (
            // Loading skeleton
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse flex space-x-4 p-4 border rounded-lg">
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            // Empty state
            <div className="text-center py-16">
              <div className="mx-auto w-24 h-24 text-gray-300 mb-4">
                <svg className="w-full h-full" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-500 max-w-sm mx-auto">There are no orders with the "{activeTab}" status at the moment.</p>
            </div>
          ) : (
            // Orders grid
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <div key={order.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-medium text-gray-900">{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {order.statusText}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-500">Customer</p>
                          <p className="font-medium">{order.customer}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Order Date</p>
                          <p className="font-medium">{formatDate(order.date)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total Amount</p>
                          <p className="font-medium">${order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <p className="text-sm text-gray-500 mb-1">Items ({order.items})</p>
                        <div className="flex flex-wrap gap-2">
                          {order.itemsList.map((item, index) => (
                            <span key={index} className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 md:mt-0 md:ml-6 flex space-x-3">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                        View Details
                      </button>
                      {order.status === 'placed' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Process Order
                        </button>
                      )}
                      {order.status === 'shipping' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                          Mark as Shipped
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>Orders update in real-time. Click on any order to view more details or take action.</p>
        </div>
      </div>
    </div>
  );
};

export default OrderManagementPage;