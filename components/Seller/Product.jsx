
"use client";


// components/ProductsDashboard.tsx
import { ChevronDown, Search, Edit2, Package, X, Filter } from 'lucide-react';
import { useState } from 'react';

export default function Product() {
  const [activeTab, setActiveTab] = useState('Active');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const statusTabs = [
    { id: 'Active' , label: 'Active', count: 1, color: 'bg-green-100 text-green-800' },
    { id: 'Inactive' , label: 'Inactive', count: null, color: 'bg-gray-100 text-gray-800' },
    { id: 'Draft' , label: 'Draft', count: null, color: 'bg-yellow-100 text-yellow-800' },
    { id: 'Pending QC' , label: 'Pending QC', count: null, color: 'bg-orange-100 text-orange-800' },
    { id: 'Out' , label: 'Out', count: null, color: 'bg-red-100 text-red-800' },
  ];

  // Mock data for products - in real app this would come from API
  const products = [
    { id: 1, name: 'Wireless Headphones', price: '$99.99', stock: 45, status: 'Active' , lastUpdated: '2 hours ago' },
    { id: 2, name: 'Smart Watch', price: '$199.99', stock: 0, status: 'Out', lastUpdated: '1 day ago' },
    { id: 3, name: 'USB-C Cable', price: '$19.99', stock: 120, status: 'Active', lastUpdated: '3 hours ago' },
    { id: 4, name: 'Laptop Backpack', price: '$59.99', stock: 23, status: 'Active' , lastUpdated: '5 hours ago' },
  ];

  const filteredProducts = products.filter(product => 
    (activeTab === 'Active' || product.status === activeTab) &&
    (searchQuery === '' || product.name.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900"># Products</h1>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Product"
            className="w-full pl-10 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Tabs Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {statusTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all duration-200
                  ${activeTab === tab.id 
                    ? `border-blue-500 bg-blue-50 text-blue-700 shadow-sm` 
                    : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }
                `}
              >
                <span className="font-medium">{tab.label}</span>
                {tab.count !== null && (
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-blue-200 text-blue-800' : tab.color}`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        
        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        
        {/* Products Table */}
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Product Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Updated</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-gray-900">{product.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${product.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {product.lastUpdated}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-2">
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          Edit
                        </button>
                        <button className="text-gray-600 hover:text-gray-800 font-medium text-sm">
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tab Navigation Helper */}
        <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-lg max-w-2xl">
          <p className="text-sm text-gray-700">
            <strong>Tab Navigation:</strong> Click on status tabs above to filter products. Current active tab: 
            <span className="font-semibold text-blue-600 ml-1">{activeTab}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            Each tab is fully interactive and filters the product list below.
          </p>
        </div>
      </div>
    </div>
  );
}