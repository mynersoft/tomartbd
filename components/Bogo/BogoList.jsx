'use client';
import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useDispatch, useSelector } from 'react-redux';
import {
  Edit2,
  Trash2,
  Plus,
  Package,
  Eye,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { useBogo, useDeleteBogo } from '@/hooks/useBogo';
import Image from 'next/image';

const BogoList = () => {
  const { bogos, isLoading } = useSelector((state) => state.bogo);

  console.log(bogos[0]);

  const deleteMutation = useDeleteBogo();

  // State for search and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', 'inactive'

  // Handle edit
  const handleEdit = (bogo) => {
    // Replace with your modal dispatch logic
    console.log('Edit bogo:', bogo);
    // dispatch(setModal({ type: UI_MODAL_TYPE.EDIT, bogo }));
  };

  // Handle delete
  const handleDelete = (id) => {
    if (
      window.confirm(
        'Are you sure you want to delete this bogo? This action cannot be undone.'
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  // Handle toggle status
  const handleToggleStatus = (id, currentStatus) => {
    // Implement status toggle logic
    console.log('Toggle status for:', id, 'to', !currentStatus);
  };

  // Filter bogo based on search and status
  const filteredBogo = bogos.filter((bogo) => {
    const matchesSearch =
      bogo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      bogo.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && bogo.isActive) ||
      (statusFilter === 'inactive' && !bogo.isActive);

    return matchesSearch && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredBogo.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBogo = filteredBogo.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="h-10 bg-slate-200 rounded animate-pulse"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="h-16 bg-slate-100 rounded animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Bogo Offers</h1>
          <p className="text-slate-500">
            Manage your product bundles and special promotions
          </p>
        </div>
        <Link
          href="/admin/bogo/create"
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-emerald-200 self-start md:self-auto"
        >
          <Plus className="w-5 h-5" />
          Create Bogo
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl border border-slate-200 p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search bogo by title or description..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-transparent outline-none text-sm"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-2 border border-slate-200 rounded-lg">
              <span className="text-sm text-slate-600">Show:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="bg-transparent outline-none text-sm"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {bogos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Total Bogo</div>
            <div className="text-2xl font-bold text-slate-800">
              {bogos.length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Active Bogo</div>
            <div className="text-2xl font-bold text-emerald-600">
              {bogos.filter((c) => c.isActive).length}
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Total Products in Bogo</div>
            <div className="text-2xl font-bold text-slate-800">
              {/* {bogos.reduce((sum, bogo) => sum + bogo.products.length, 0)} */}
              something cal
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="text-sm text-slate-500">Average Discount</div>
            <div className="text-2xl font-bold text-orange-600">
              {bogos.length > 0
                ? Math.round(
                    bogos.reduce((sum, bogo) => sum + bogo.discountPercent, 0) /
                      bogos.length
                  ) + '%'
                : '0%'}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {bogos.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-20 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <Package className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No bogo found</h3>
          <p className="text-slate-500 max-w-sm mx-auto mt-1">
            Start by creating your first product bundle to boost your store
            sales.
          </p>
        </div>
      ) : filteredBogo.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center">
          <Package className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="text-lg font-bold text-slate-700">No matching bogo</h3>
          <p className="text-slate-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Bogo Details
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Products
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Pricing
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="text-left p-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {paginatedBogo.map((bogo) => (
                  <tr
                    key={bogo._id}
                    className="hover:bg-slate-50 transition-colors"
                  >
                    {/* Bogo Details */}
                    <td className="p-4">
                      <div className="flex items-start gap-3">
                        <Image
                          src={bogo.featuredImage.url || '/placeholder.png'}
                          alt={bogo.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-lg object-cover border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-slate-800 truncate">
                            {bogo.name}
                          </h3>

                          <div className="flex flex-wrap gap-1 mt-1">
                            {bogo.tags?.slice(0, 2).map((tag, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {bogo.tags?.length > 2 && (
                              <span className="text-[10px] text-slate-400">
                                +{bogo.tags.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Products */}
                    <td className="p-4">
                      <div className="flex items-center">
                        <div className="flex -space-x-2 mr-3">
                          {/* {bogo.products.slice(0, 3).map((product, idx) => (
                            <img
                              key={idx}
                              src={product.image}
                              alt={product.name}
                              className="w-8 h-8 rounded-full border-2 border-white object-cover"
                              title={`${product.name} (x${product.quantity})`}
                            />
                          ))} */}
                        </div>
                        <div className="text-sm">
                          <p className="font-semibold text-slate-800">
                            {bogo.buyQty + bogo.getQty} items
                          </p>
                          <p className="text-xs text-slate-500">
                            Total:
                            {/* {bogo.reduce(
                              (sum, p) => sum + p.quantity,
                              0
                            )}{' '} */}
                            units
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Pricing */}
                    <td className="p-4">
                      <div className="space-y-1">
                        <div className="flex items-baseline gap-2">
                          <span className="text-sm font-bold text-emerald-700">
                            ৳{bogo.salePrice}
                          </span>
                          <span className="text-xs text-slate-400 line-through">
                            ৳{bogo.regularPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded">
                            Save {bogo.discountPercentage}%
                          </span>
                          <span className="text-xs text-red-500">
                            ৳{bogo.discountAmount}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleToggleStatus(bogo._id, bogo.isActive)
                          }
                          className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors ${bogo.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}
                        >
                          <span
                            className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${bogo.isActive ? 'translate-x-6' : 'translate-x-1'}`}
                          />
                        </button>
                        <span
                          className={`text-sm font-medium ${bogo.isActive ? 'text-emerald-700' : 'text-slate-500'}`}
                        >
                          {bogo.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4">
                      <div className="text-sm space-y-1">
                        <div className="flex items-center gap-1 text-slate-700">
                          <Calendar className="w-3 h-3" />
                          {new Date(bogo.startDate).toLocaleDateString()}
                        </div>
                        {bogo.endDate && (
                          <div className="text-[12px] text-red-500">
                            Expires:
                            {new Date(bogo.endDate).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/bogo/${bogo._id}`}
                          className="p-2 hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleEdit(bogo)}
                          className="p-2 hover:bg-emerald-50 text-slate-600 hover:text-emerald-600 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(bogo._id)}
                          className="p-2 hover:bg-red-50 text-slate-600 hover:text-red-600 rounded-lg transition-colors"
                          title="Delete"
                          disabled={deleteMutation.isPending}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="border-t border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="text-sm text-slate-500">
                Showing <span className="font-semibold">{startIndex + 1}</span>{' '}
                to{' '}
                <span className="font-semibold">
                  {Math.min(startIndex + itemsPerPage, filteredBogo.length)}
                </span>{' '}
                of <span className="font-semibold">{filteredBogo.length}</span>{' '}
                results
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
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
                      className={`w-9 h-9 rounded-lg border text-sm font-medium ${currentPage === pageNum ? 'bg-emerald-600 text-white border-emerald-600' : 'border-slate-200 hover:bg-slate-50'}`}
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
                  className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Summary Stats */}
    </div>
  );
};

// Add missing Calendar icon component
const Calendar = ({ className }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

export default BogoList;
