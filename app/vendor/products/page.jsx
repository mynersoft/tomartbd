import React, { useState } from 'react';
import DashboardLayout from '../../components/vendor/DashboardLayout';
import ProductTable from '../../components/vendor/ProductTable';
import { 
  Search, 
  Filter, 
  Plus, 
  Grid, 
  List, 
  Download,
  Upload,
  Tag,
  Archive
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useProducts } from '../../hooks/useVendorQuery';

const ProductsPage = () => {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: productsData } = useProducts({
    search: searchQuery,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    sortBy: sortBy
  });

  return (
    <DashboardLayout>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Products Management</h1>
            <p className="text-gray-600 mt-1">
              Manage your product catalog, inventory, and listings
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Upload className="h-4 w-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Download className="h-4 w-4" />
              Export
            </button>
            <Link
              to="/vendor/products/add"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </div>
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
                placeholder="Search products by name, SKU, or description..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="home">Home & Living</option>
              <option value="beauty">Beauty</option>
              <option value="sports">Sports</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="pending">Pending</option>
              <option value="draft">Draft</option>
            </select>

            <select
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="price_high">Price: High to Low</option>
              <option value="price_low">Price: Low to High</option>
              <option value="popular">Most Popular</option>
              <option value="stock_low">Stock: Low to High</option>
            </select>

            {/* View Toggle */}
            <div className="flex border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>

            <button className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              More Filters
            </button>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="flex items-center gap-6 mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {productsData?.activeCount || 0}
              </span> Active
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {productsData?.pendingCount || 0}
              </span> Pending
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {productsData?.outOfStockCount || 0}
              </span> Out of Stock
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-600">
              <span className="font-semibold text-gray-900">
                {productsData?.draftCount || 0}
              </span> Draft
            </span>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <select className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm">
            <option>Bulk Actions</option>
            <option>Activate Selected</option>
            <option>Deactivate Selected</option>
            <option>Move to Category</option>
            <option>Update Price</option>
            <option>Delete Selected</option>
          </select>
          <button className="px-4 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
            Apply
          </button>
        </div>
        <div className="text-sm text-gray-500">
          Showing {productsData?.products?.length || 0} of {productsData?.total || 0} products
        </div>
      </div>

      {/* Products Table/Grid */}
      <ProductTable viewMode={viewMode} />

      {/* Categories Section */}
      <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Product Categories</h2>
            <p className="text-sm text-gray-500 mt-1">Manage your product categories</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <Tag className="h-4 w-4" />
            Manage Categories
          </button>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: 'Electronics', count: 45, color: 'bg-blue-100 text-blue-800' },
            { name: 'Fashion', count: 32, color: 'bg-purple-100 text-purple-800' },
            { name: 'Home & Living', count: 28, color: 'bg-green-100 text-green-800' },
            { name: 'Beauty', count: 19, color: 'bg-pink-100 text-pink-800' },
            { name: 'Sports', count: 15, color: 'bg-orange-100 text-orange-800' },
            { name: 'Books', count: 6, color: 'bg-indigo-100 text-indigo-800' },
          ].map((category) => (
            <div
              key={category.name}
              className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors cursor-pointer"
            >
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{category.name}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${category.color}`}>
                  {category.count}
                </span>
              </div>
              <p className="text-sm text-gray-500">Manage products in this category</p>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProductsPage;