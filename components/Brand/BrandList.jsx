// components/Brands/BrandList.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Filter,
  Grid,
  List,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Plus,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import BrandForm from './BrandForm';

const BrandList = ({ initialBrands = [] }) => {
  const [brands, setBrands] = useState(initialBrands);
  const [filteredBrands, setFilteredBrands] = useState(initialBrands);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'
  const [currentPage, setCurrentPage] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandsPerPage] = useState(12);

  // Filter brands based on search and status
  useEffect(() => {
    let result = brands;

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (brand) =>
          brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          brand.slug?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((brand) => brand.status === statusFilter);
    }

    setFilteredBrands(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [brands, searchTerm, statusFilter]);

  // Calculate pagination
  const indexOfLastBrand = currentPage * brandsPerPage;
  const indexOfFirstBrand = indexOfLastBrand - brandsPerPage;
  const currentBrands = filteredBrands.slice(
    indexOfFirstBrand,
    indexOfLastBrand
  );
  const totalPages = Math.ceil(filteredBrands.length / brandsPerPage);

  // Fetch brands from API
  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/brands');
      const data = await response.json();
      if (data.success) {
        setBrands(data.brands);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (formData) => {
    try {
      const url = editingBrand
        ? `/api/brands/${editingBrand._id}`
        : '/api/brands';
      const method = editingBrand ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBrands(); // Refresh the list
        setShowForm(false);
        setEditingBrand(null);
      } else {
        throw new Error(data.error || 'Failed to save brand');
      }
    } catch (error) {
      console.error('Error saving brand:', error);
      throw error;
    }
  };

  // Handle delete brand
  const handleDelete = async (brandId) => {
    if (!confirm('Are you sure you want to delete this brand?')) return;

    try {
      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        await fetchBrands(); // Refresh the list
      }
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (brandId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';

      const response = await fetch(`/api/brands/${brandId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (data.success) {
        await fetchBrands(); // Refresh the list
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  // Initialize
  useEffect(() => {
    fetchBrands();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Brand Management
            </h1>
            <p className="text-gray-600 mt-2">
              Manage your store brands and their information
            </p>
          </div>

          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl"
          >
            <Plus className="w-5 h-5" />
            Add New Brand
          </button>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl p-4 shadow-sm">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search brands by name or slug..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-3 pr-10 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>

              {/* View Toggle */}
              <div className="flex bg-gray-100 p-1 rounded-xl">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white shadow-sm'
                      : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Modal */}
      <AnimatePresence>
        {showForm && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <BrandForm
                brand={editingBrand}
                onSubmit={handleSubmit}
                onCancel={() => {
                  setShowForm(false);
                  setEditingBrand(null);
                }}
                isLoading={loading}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading State */}
      {loading && !currentBrands.length ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading brands...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Brands Count */}
          <div className="mb-4 text-sm text-gray-600">
            Showing {currentBrands.length} of {filteredBrands.length} brands
          </div>

          {/* Grid View */}
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {currentBrands.map((brand, index) => (
                <motion.div
                  key={brand._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100"
                >
                  {/* Brand Header */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 truncate">
                          {brand.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                          /{brand.slug}
                        </p>
                      </div>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            // Handle menu toggle
                          }}
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <MoreVertical className="w-5 h-5 text-gray-500" />
                        </button>
                      </div>
                    </div>

                    {/* Logo */}
                    <div className="flex justify-center items-center h-32 bg-gray-50 rounded-xl mb-4">
                      {brand.logo ? (
                        <img
                          src={brand.logo}
                          alt={brand.name}
                          className="max-h-20 max-w-full object-contain"
                        />
                      ) : (
                        <div className="text-gray-400 text-sm">No Logo</div>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                          brand.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {brand.status === 'active' ? (
                          <>
                            <CheckCircle className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </span>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(brand._id, brand.status)
                          }
                          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                          title={
                            brand.status === 'active'
                              ? 'Deactivate'
                              : 'Activate'
                          }
                        >
                          {brand.status === 'active' ? (
                            <EyeOff className="w-4 h-4 text-gray-500" />
                          ) : (
                            <Eye className="w-4 h-4 text-gray-500" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setEditingBrand(brand);
                            setShowForm(true);
                          }}
                          className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand._id)}
                          className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="text-xs text-gray-500">
                      Created: {new Date(brand.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            /* List View */
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Brand
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {currentBrands.map((brand, index) => (
                      <motion.tr
                        key={brand._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                              {brand.logo ? (
                                <img
                                  src={brand.logo}
                                  alt={brand.name}
                                  className="w-8 h-8 object-contain"
                                />
                              ) : (
                                <div className="text-gray-400 text-xs">
                                  No Logo
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {brand.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                            /{brand.slug}
                          </code>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
                              brand.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {brand.status === 'active' ? (
                              <>
                                <CheckCircle className="w-3 h-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <XCircle className="w-3 h-3" />
                                Inactive
                              </>
                            )}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-500">
                          {new Date(brand.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleToggleStatus(brand._id, brand.status)
                              }
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              title={
                                brand.status === 'active'
                                  ? 'Deactivate'
                                  : 'Activate'
                              }
                            >
                              {brand.status === 'active' ? (
                                <EyeOff className="w-4 h-4 text-gray-500" />
                              ) : (
                                <Eye className="w-4 h-4 text-gray-500" />
                              )}
                            </button>
                            <button
                              onClick={() => {
                                setEditingBrand(brand);
                                setShowForm(true);
                              }}
                              className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(brand._id)}
                              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-8">
              <div className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white'
                          : 'border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!currentBrands.length && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-12 h-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No brands found
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter'
                  : 'Get started by creating your first brand'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <button
                  onClick={() => setShowForm(true)}
                  className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Create First Brand
                </button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default BrandList;
