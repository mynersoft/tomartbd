// components/orders/OrderHistory.jsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  Calendar,
  Package,
  CheckCircle,
  Clock,
  XCircle,
  ChevronRight,
  Download,
  Eye,
  ShoppingBag,
} from "lucide-react";
import OrderDetailsModal from "@/components/Order/OrderDetailsModal";
import OrderCard from "@/components/Order/OrderCard";

const OrderHistory = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sample orders data
  const orders = [
    {
      id: "ORD-789456",
      date: "2024-03-15",
      total: 245.99,
      status: "delivered",
      items: 3,
      trackingNumber: "TRK789456123",
      deliveryDate: "2024-03-18",
      paymentMethod: "Visa **** 4321",
      itemsList: [
        { name: "Wireless Headphones", price: 129.99, quantity: 1 },
        { name: "Phone Case", price: 29.99, quantity: 2 },
      ],
    },
    {
      id: "ORD-123456",
      date: "2024-03-10",
      total: 89.5,
      status: "processing",
      items: 2,
      trackingNumber: null,
      estimatedDelivery: "2024-03-20",
      paymentMethod: "PayPal",
      itemsList: [
        { name: "Smart Watch", price: 249.99, quantity: 1 },
        { name: "Screen Protector", price: 14.99, quantity: 1 },
      ],
    },
    {
      id: "ORD-654321",
      date: "2024-03-05",
      total: 420.75,
      status: "shipped",
      items: 4,
      trackingNumber: "TRK987654321",
      estimatedDelivery: "2024-03-12",
      paymentMethod: "MasterCard **** 8765",
      itemsList: [
        { name: "Laptop", price: 1199.99, quantity: 1 },
        { name: "Laptop Sleeve", price: 34.99, quantity: 1 },
      ],
    },
    {
      id: "ORD-321987",
      date: "2024-02-28",
      total: 65.25,
      status: "cancelled",
      items: 1,
      trackingNumber: null,
      paymentMethod: "Visa **** 1234",
      itemsList: [
        { name: "USB-C Cable", price: 19.99, quantity: 2 },
        { name: "Power Adapter", price: 45.27, quantity: 1 },
      ],
    },
    {
      id: "ORD-852963",
      date: "2024-02-20",
      total: 156.8,
      status: "delivered",
      items: 2,
      trackingNumber: "TRK741852963",
      deliveryDate: "2024-02-23",
      paymentMethod: "Apple Pay",
      itemsList: [
        { name: "Tablet", price: 329.99, quantity: 1 },
        { name: "Tablet Pen", price: 79.99, quantity: 1 },
      ],
    },
  ];

  const filters = [
    { id: "all", label: "All Orders", count: orders.length },
    { id: "delivered", label: "Delivered", count: orders.filter(o => o.status === "delivered").length },
    { id: "processing", label: "Processing", count: orders.filter(o => o.status === "processing").length },
    { id: "shipped", label: "Shipped", count: orders.filter(o => o.status === "shipped").length },
    { id: "cancelled", label: "Cancelled", count: orders.filter(o => o.status === "cancelled").length },
  ];

  const filteredOrders = orders.filter(order => {
    const matchesFilter = selectedFilter === "all" || order.status === selectedFilter;
    const matchesSearch = searchQuery === "" || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.itemsList.some(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case "delivered": return <CheckCircle className="w-5 h-5 text-green-500" />;
      case "processing": return <Clock className="w-5 h-5 text-blue-500" />;
      case "shipped": return <Package className="w-5 h-5 text-purple-500" />;
      case "cancelled": return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Package className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-800";
      case "processing": return "bg-blue-100 text-blue-800";
      case "shipped": return "bg-purple-100 text-purple-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleDownloadInvoice = (orderId) => {
    // Implement download logic
    console.log("Downloading invoice for:", orderId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <ShoppingBag className="w-8 h-8" />
            Order History
          </h1>
          <p className="text-gray-600 mt-2">
            View and manage all your past orders
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
              </div>
              <ShoppingBag className="w-10 h-10 text-blue-500 bg-blue-50 p-2 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Delivered</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === "delivered").length}
                </p>
              </div>
              <CheckCircle className="w-10 h-10 text-green-500 bg-green-50 p-2 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {orders.filter(o => o.status === "processing" || o.status === "shipped").length}
                </p>
              </div>
              <Clock className="w-10 h-10 text-yellow-500 bg-yellow-50 p-2 rounded-lg" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${orders.reduce((sum, order) => sum + order.total, 0).toFixed(2)}
                </p>
              </div>
              <Calendar className="w-10 h-10 text-purple-500 bg-purple-50 p-2 rounded-lg" />
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search orders by ID or product..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <Filter className="w-5 h-5 text-gray-500 shrink-0" />
              {filters.map((filter) => (
                <button
                  key={filter.id}
                  onClick={() => setSelectedFilter(filter.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition ${
                    selectedFilter === filter.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-200">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600 mb-6">
                {searchQuery ? "Try a different search term" : "You haven't placed any orders yet"}
              </p>
              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                Start Shopping
              </button>
            </div>
          ) : (
            filteredOrders.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    {/* Order Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            Order #{order.id}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                            <span className="flex items-center gap-1">
                              {getStatusIcon(order.status)}
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(order.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                          <span>•</span>
                          <span>{order.items} item{order.items !== 1 ? 's' : ''}</span>
                          <span>•</span>
                          <span className="font-medium">${order.total.toFixed(2)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Download className="w-4 h-4" />
                          Invoice
                        </button>
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <Eye className="w-4 h-4" />
                          View Details
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order Items Preview */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Items</h4>
                      <div className="flex flex-wrap gap-4">
                        {order.itemsList.slice(0, 3).map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                            <div className="w-10 h-10 bg-gray-200 rounded-md"></div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">
                                {item.quantity} × ${item.price.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.itemsList.length > 3 && (
                          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-3">
                            <span className="text-sm text-gray-600">
                              +{order.itemsList.length - 3} more items
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Tracking Info (if available) */}
                    {order.trackingNumber && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Package className="w-4 h-4 text-gray-500" />
                            <span className="text-sm text-gray-600">Tracking:</span>
                            <code className="text-sm font-mono bg-gray-100 px-2 py-1 rounded">
                              {order.trackingNumber}
                            </code>
                          </div>
                          <div className="text-sm text-gray-600">
                            {order.deliveryDate ? (
                              <>Delivered on {new Date(order.deliveryDate).toLocaleDateString()}</>
                            ) : order.estimatedDelivery ? (
                              <>Estimated delivery: {new Date(order.estimatedDelivery).toLocaleDateString()}</>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Previous
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                1
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                3
              </button>
              <span className="px-2 text-gray-500">...</span>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                10
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {isModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrderHistory;