'use client';

import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import InventoryTable from '../../components/vendor/InventoryTable';
import { 
  Package, 
  AlertCircle, 
  TrendingUp, 
  TrendingDown,
  RefreshCw,
  Download,
  Upload,
  Plus,
  Filter,
  BarChart3
} from 'lucide-react';
import { Link } from 'next/link';

const InventoryPage = () => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('stock_low');
  const [view, setView] = useState('detailed');

  const inventoryStats = [
    { label: 'Total Products', value: '145', change: '+5.2%', color: 'bg-blue-100 text-blue-600' },
    { label: 'In Stock', value: '132', change: '+3.1%', color: 'bg-green-100 text-green-600' },
    { label: 'Low Stock', value: '8', change: '-2.4%', color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Out of Stock', value: '5', change: '+1.2%', color: 'bg-red-100 text-red-600' },
    { label: 'Total Value', value: '৳2.4M', change: '+12.5%', color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-600 mt-1">
              Track stock levels, manage inventory, and avoid stockouts
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              Import Stock
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export Report
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Restock Items
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {inventoryStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                <div className="flex items-center mt-1">
                  {stat.change.startsWith('+') ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={`text-xs ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <Package className="h-5 w-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts Section */}
      <div className="mb-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-yellow-800">Stock Alerts</h3>
              <p className="text-sm text-yellow-700 mt-1">
                8 products are running low on stock. Consider restocking to avoid stockouts.
              </p>
              <div className="flex gap-3 mt-3">
                <button className="text-sm font-medium text-yellow-700 hover:text-yellow-800">
                  View Low Stock Items
                </button>
                <button className="text-sm font-medium text-yellow-700 hover:text-yellow-800">
                  Set Auto-reorder
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Quick Filters */}
          <div className="flex flex-wrap gap-2">
            {['all', 'low_stock', 'out_of_stock', 'over_stock', 'needs_reorder'].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize ${
                  filter === f
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {f.replace('_', ' ')}
              </button>
            ))}
          </div>

          {/* Sort and View Options */}
          <div className="flex gap-3 ml-auto">
            <select
              className="border border-gray-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="stock_low">Stock: Low to High</option>
              <option value="stock_high">Stock: High to Low</option>
              <option value="value_high">Value: High to Low</option>
              <option value="value_low">Value: Low to High</option>
              <option value="sales_high">Sales: High to Low</option>
              <option value="name_asc">Name: A to Z</option>
              <option value="name_desc">Name: Z to A</option>
            </select>

            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setView('detailed')}
                className={`p-2 ${view === 'detailed' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Detailed View"
              >
                <BarChart3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setView('compact')}
                className={`p-2 ${view === 'compact' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
                title="Compact View"
              >
                <Package className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Advanced
            </button>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <InventoryTable filter={filter} sortBy={sortBy} view={view} />

      {/* Restock Suggestions */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Restock Suggestions</h2>
            <p className="text-sm text-gray-500 mt-1">Products that need reordering based on sales velocity</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Auto-reorder All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Daily Sales
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Days Until Stockout
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Suggested Order
                </th>
                <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[
                {
                  name: 'Premium Cotton T-Shirt',
                  sku: 'TSHIRT-PREM-001',
                  stock: 12,
                  dailySales: 3.2,
                  leadTime: 7,
                  suggestedOrder: 50
                },
                {
                  name: 'Wireless Bluetooth Headphones',
                  sku: 'HEAD-WL-2024',
                  stock: 8,
                  dailySales: 1.8,
                  leadTime: 14,
                  suggestedOrder: 30
                },
                {
                  name: 'Stainless Steel Water Bottle',
                  sku: 'BOTTLE-SS-500',
                  stock: 15,
                  dailySales: 2.5,
                  leadTime: 10,
                  suggestedOrder: 40
                },
                {
                  name: 'Organic Cotton Towels',
                  sku: 'TOWEL-ORG-SET',
                  stock: 6,
                  dailySales: 1.2,
                  leadTime: 5,
                  suggestedOrder: 25
                }
              ].map((item, index) => {
                const daysUntilStockout = Math.floor(item.stock / item.dailySales);
                const urgency = daysUntilStockout <= 7 ? 'high' : daysUntilStockout <= 14 ? 'medium' : 'low';
                
                return (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                          <Package className="h-5 w-5 text-gray-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{item.name}</p>
                          <p className="text-sm text-gray-500">SKU: {item.sku}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        item.stock <= 10 
                          ? 'bg-red-100 text-red-800'
                          : item.stock <= 20
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.stock} units
                      </span>
                    </td>
                    <td className="py-4 px-6 text-sm text-gray-900">
                      {item.dailySales.toFixed(1)} / day
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <span className={`font-medium ${
                          urgency === 'high' 
                            ? 'text-red-600'
                            : urgency === 'medium'
                            ? 'text-yellow-600'
                            : 'text-green-600'
                        }`}>
                          {daysUntilStockout} days
                        </span>
                        {urgency === 'high' && (
                          <AlertCircle className="h-4 w-4 text-red-500 ml-2" />
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-medium text-gray-900">{item.suggestedOrder} units</span>
                    </td>
                    <td className="py-4 px-6">
                      <button className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                        Order Now
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inventory Value Summary */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Inventory Value by Category</h2>
          <div className="space-y-4">
            {[
              { category: 'Electronics', value: 850000, percentage: 35, color: 'bg-blue-500' },
              { category: 'Fashion', value: 620000, percentage: 26, color: 'bg-purple-500' },
              { category: 'Home & Living', value: 450000, percentage: 19, color: 'bg-green-500' },
              { category: 'Beauty', value: 280000, percentage: 12, color: 'bg-pink-500' },
              { category: 'Sports', value: 200000, percentage: 8, color: 'bg-orange-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-3 w-3 rounded-full ${item.color}`}></div>
                    <span className="text-sm font-medium text-gray-900">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-medium text-gray-900">
                      ৳{item.value.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500 ml-2">({item.percentage}%)</span>
                  </div>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${item.color}`}
                    style={{ width: `${item.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Inventory Turnover</h2>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Current Turnover Rate</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">4.2x</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Industry Average</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">3.8x</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Fast Moving</span>
                <span className="text-sm text-green-600 font-medium">Above Average</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-900">Slow Moving</span>
                <span className="text-sm text-red-600 font-medium">Needs Attention</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Your inventory turns over faster than industry average. Consider optimizing slow-moving items.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default InventoryPage;