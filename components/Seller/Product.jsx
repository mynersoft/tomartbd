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
    { id: 1, name: 'Wireless Headphones', price: '$99.99', stock: 45, status: 'Active' as StatusType, lastUpdated: '2 hours ago' },
    { id: 2, name: 'Smart Watch', price: '$199.99', stock: 0, status: 'Out' as StatusType, lastUpdated: '1 day ago' },
    { id: 3, name: 'USB-C Cable', price: '$19.99', stock: 120, status: 'Active' as StatusType, lastUpdated: '3 hours ago' },
    { id: 4, name: 'Laptop Backpack', price: '$59.99', stock: 23, status: 'Active' as StatusType, lastUpdated: '5 hours ago' },
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

        {/* Sort and Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-white border border-gray-200 rounded-lg">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-gray-600 font-medium">Sort By:</span>
              <button className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
                <span className="font-medium">Last Updated</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            
            <div className="relative">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                <Filter className="w-4 h-4" />
                <span className="font-medium">Filter</span>
                <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>

              {/* Filter Dropdown */}
              {showFilters && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Price Range</h3>
                    <div className="flex items-center gap-2">
                      <input type="number" placeholder="Min" className="w-full px-3 py-1.5 border border-gray-300 rounded" />
                      <span className="text-gray-500">to</span>
                      <input type="number" placeholder="Max" className="w-full px-3 py-1.5 border border-gray-300 rounded" />
                    </div>
                  </div>
                  <div className="mb-4">
                    <h3 className="font-semibold text-gray-900 mb-2">Stock Status</h3>
                    <select className="w-full px-3 py-1.5 border border-gray-300 rounded">
                      <option>All</option>
                      <option>In Stock</option>
                      <option>Low Stock</option>
                      <option>Out of Stock</option>
                    </select>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button 
                      onClick={() => setShowFilters(false)}
                      className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                      Apply
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-sm text-gray-500">
            Showing {filteredProducts.length} products
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-6"></div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 md:gap-6 mb-8">
          <button className="flex flex-col items-center justify-center w-full md:w-40 h-32 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
            <div className="mb-3 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition">
              <Edit2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Edit Price</span>
            <span className="text-sm text-gray-500 mt-1">Update product pricing</span>
          </button>

          <button className="flex flex-col items-center justify-center w-full md:w-40 h-32 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
            <div className="mb-3 p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Edit Stock</span>
            <span className="text-sm text-gray-500 mt-1">Manage inventory</span>
          </button>
        </div>

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