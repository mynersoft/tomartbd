import React, { useState } from 'react';
import { 
  Edit, 
  Trash2, 
  Eye, 
  CheckCircle, 
  XCircle,
  Filter,
  Search,
  Plus
} from 'lucide-react';
import { FaRegClock } from 'react-icons/fa';

import { formatCurrency, formatDate } from '@/utils/formatters';

const ProductTable = () => {
  const [filters, setFilters] = useState({
    status: 'all',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 10
  });

  const { data: productsData, isLoading, error } = useProducts(filters);
  const updateProductMutation = useUpdateProduct();

  const handleStatusChange = async (productId, newStatus) => {
    try {
      await updateProductMutation.mutateAsync({
        id: productId,
        data: { status: newStatus }
      });
    } catch (error) {
      console.error('Failed to update product status:', error);
    }
  };

  const handleSearch = (value) => {
    setFilters(prev => ({ ...prev, search: value, page: 1 }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value, page: 1 }));
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-gray-100 rounded mb-2"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">Failed to load products</p>
      </div>
    );
  }

  const products = productsData?.products || [];
  const totalProducts = productsData?.total || 0;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Products</h2>
            <p className="text-sm text-gray-500 mt-1">
              {totalProducts} total products • {productsData?.activeCount || 0} active
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>

            {/* Filter Dropdown */}
            <select
              className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="out_of_stock">Out of Stock</option>
              <option value="pending">Pending Review</option>
            </select>

            {/* Add Product Button */}
            <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Stock
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sales
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Updated
              </th>
              <th className="py-3 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="py-4 px-6">
                  <div className="flex items-center">
                    <img
                      src={product.thumbnail || '/api/placeholder/40/40'}
                      alt={product.name}
                      className="h-10 w-10 rounded-lg object-cover mr-3"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-6">
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatCurrency(product.price)}
                    </p>
                    {product.originalPrice && (
                      <p className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </p>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    product.stock > 20 
                      ? 'bg-green-100 text-green-800'
                      : product.stock > 0
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="py-4 px-6">
                  <select
                    value={product.status}
                    onChange={(e) => handleStatusChange(product.id, e.target.value)}
                    className={`text-xs font-medium px-3 py-1 rounded-full border ${
                      product.status === 'active'
                        ? 'bg-green-50 text-green-700 border-green-200'
                        : product.status === 'inactive'
                        ? 'bg-gray-50 text-gray-700 border-gray-200'
                        : product.status === 'pending'
                        ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                        : 'bg-red-50 text-red-700 border-red-200'
                    } focus:outline-none focus:ring-1 focus:ring-blue-500`}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </td>
                <td className="py-4 px-6">
                  <div className="text-sm text-gray-900">
                    {product.totalSales || 0} sold
                  </div>
                  <div className="text-xs text-gray-500">
                    ৳{((product.totalSales || 0) * product.price).toLocaleString()}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-500">
                  {formatDate(product.updatedAt)}
                </td>
                <td className="py-4 px-6">
                  <div className="flex items-center gap-2">
                    <button
                      className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {productsData?.totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              Showing {(filters.page - 1) * filters.limit + 1} to{' '}
              {Math.min(filters.page * filters.limit, totalProducts)} of{' '}
              {totalProducts} products
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange('page', filters.page - 1)}
                disabled={filters.page === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                Previous
              </button>
              {[...Array(Math.min(5, productsData.totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={i}
                    onClick={() => handleFilterChange('page', pageNum)}
                    className={`px-3 py-1 rounded-lg ${
                      filters.page === pageNum
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handleFilterChange('page', filters.page + 1)}
                disabled={filters.page === productsData.totalPages}
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

export default ProductTable;