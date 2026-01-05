'use client';

import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useAddVoucher, useVoucher } from '@/hooks/useVoucher';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Copy,
  Calendar,
  Percent,
  DollarSign,
  Tag,
  Filter,
  ChevronDown,
  CheckCircle,
  XCircle,
  Clock,
  Check,
  X,
  Download,
  Upload,
  BarChart3,
  Eye,
} from 'lucide-react';
import { Select } from '@headlessui/react';
import VoucherTable from './VoucherTable';

export default function VoucherManagement() {
  useVoucher();

  const { vouchers } = useSelector((state) => state.voucher);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedVouchers, setSelectedVouchers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [newVoucher, setNewVoucher] = useState({
    code: '',
    name: '',
    discountType: 'percentage',
    applicableProducts: '',
    discountValue: '',
    minOrderAmount: '',
    usageLimit: '',
    startDate: '',
    endDate: '',
    customerLimit: '',
    usedCount: '',
    status: 'inactive',
    type: '',
  });

  const statusTabs = [
    { id: 'all', label: 'All Vouchers', count: vouchers.length, icon: Tag },
    {
      id: 'active',
      label: 'Active',
      count: vouchers.filter((c) => c.status === 'active').length,
      icon: CheckCircle,
      color: 'text-green-600 bg-green-100',
    },
    {
      id: 'scheduled',
      label: 'Scheduled',
      count: vouchers.filter((c) => c.status === 'scheduled').length,
      icon: Clock,
      color: 'text-blue-600 bg-blue-100',
    },
    {
      id: 'used',
      label: 'Used',
      count: vouchers.filter((c) => c.status === 'used').length,
      icon: Check,
      color: 'text-purple-600 bg-purple-100',
    },
    {
      id: 'expired',
      label: 'Expired',
      count: vouchers.filter((c) => c.status === 'expired').length,
      icon: XCircle,
      color: 'text-red-600 bg-red-100',
    },
    {
      id: 'draft',
      label: 'Draft',
      count: 2,
      icon: Edit2,
      color: 'text-gray-600 bg-gray-100',
    },
  ];

  const discountTypes = [
    {
      id: 'percentage',
      label: 'Percentage Off',
      icon: Percent,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      id: 'fixed',
      label: 'Fixed Amount',
      icon: DollarSign,
      color: 'text-green-600 bg-green-50',
    },
    {
      id: 'shipping',
      label: 'Shipping',
      icon: Tag,
      color: 'text-purple-600 bg-purple-50',
    },
  ];

  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch =
      voucher.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'all' || voucher.status === activeTab;
    return matchesSearch && matchesTab;
  });



  const addVoucherMutation = useAddVoucher();

  const handleCreateVoucher = () => {
    if (!newVoucher.name || !newVoucher.startDate || !newVoucher.endDate) {
      toast.error('Required fields missing');
      return;
    }

    addVoucherMutation.mutate(
      {
        ...newVoucher,
        value: Number(newVoucher.value),
        minPurchase: newVoucher.minPurchase
          ? Number(newVoucher.minPurchase)
          : null,
        usageLimit: newVoucher.usageLimit
          ? Number(newVoucher.usageLimit)
          : null,
        customerLimit: newVoucher.customerLimit
          ? Number(newVoucher.customerLimit)
          : null,
      },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewVoucher({
            code: '',
            name: '',
            discountType: 'percentage',
            applicableProducts: '',
            discountValue: '',
            minOrderAmount: '',
            usageLimit: '',
            startDate: '',
            endDate: '',
            customerLimit: '',
            usedCount: '',
            status: 'inactive',
            type: '',
          });
        },
      }
    );
  };





  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedVouchers(filteredVouchers.map((c) => c.id));
    } else {
      setSelectedVouchers([]);
    }
  };

  const handleSelectVoucher = (id) => {
    setSelectedVouchers((prev) =>
      prev.includes(id)
        ? prev.filter((voucherId) => voucherId !== id)
        : [...prev, id]
    );
  };

  const handleBulkAction = (action) => {
    if (selectedVouchers.length === 0) {
      alert('Please select at least one voucher');
      return;
    }
    alert(`Performing ${action} on ${selectedVouchers.length} voucher(s)`);
  };



  return (
    <>
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-150">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Create New Voucher
                </h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voucher Code *
                      </label>
                      <input
                        type="text"
                        value={newVoucher.code}
                        onChange={(e) =>
                          setNewVoucher({
                            ...newVoucher,
                            code: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., WELCOME25"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voucher Name *
                      </label>
                      <input
                        type="text"
                        value={newVoucher.name}
                        onChange={(e) =>
                          setNewVoucher({
                            ...newVoucher,
                            name: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="e.g., Welcome Discount"
                      />
                    </div>
                  </div>
                </div>

                {/* Discount Type */}
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">
                    Discount Type
                  </h3>
                  <div className="grid md:grid-cols-3 gap-3">
                    {discountTypes.map((type) => (
                      <button
                        key={type.id}
                        onClick={() =>
                          setNewVoucher({
                            ...newVoucher,
                            discountType: type.id,
                          })
                        }
                        className={`p-4 border rounded-lg text-left transition ${
                          newVoucher.discountType === type.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2 rounded-full ${
                              type.color.split(' ')[1]
                            }`}
                          >
                            <type.icon
                              className={`w-5 h-5 ${type.color.split(' ')[0]}`}
                            />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">
                              {type.label}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Discount Value */}
                <div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {newVoucher.discountType === 'percentage'
                          ? 'Percentage (%)'
                          : newVoucher.discountType === 'fixed'
                            ? 'Amount'
                            : 'Shipping Discount'}
                      </label>
                      <input
                        type="number"
                        value={newVoucher.discountValue}
                        onChange={(e) =>
                          setNewVoucher({
                            ...newVoucher,
                            discountValue: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={
                          newVoucher.discountType === 'percentage'
                            ? '5'
                            : newVoucher.discountType === 'fixed'
                              ? '50'
                              : newVoucher.discountType === 'shipping'
                                ? '20'
                                : ''
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum order amount
                      </label>
                      <input
                        type="number"
                        value={newVoucher.minOrderAmount}
                        onChange={(e) =>
                          setNewVoucher({
                            ...newVoucher,
                            minOrderAmount: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="0"
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between gap-4">
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      For All Products or single
                    </label>

                    <select
                      value={newVoucher.type}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          type: e.target.value,
                        })
                      }
                    >
                      <option value="all-product">All</option>
                      <option value="product-specific">Specific product</option>
                    </select>
                  </div>
                  <div className="w-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Applicable voucher for product
                    </label>
                    <input
                      type="number"
                      value={newVoucher.applicableProducts}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          applicableProducts: [],
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0"
                    />
                  </div>
                </div>

                {/* Limits */}

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Usage Limit
                    </label>
                    <input
                      type="number"
                      value={newVoucher.usageLimit}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          usageLimit: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Unlimited"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Per Customer Limit
                    </label>
                    <input
                      type="number"
                      value={newVoucher.customerLimit}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          customerLimit: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="1"
                    />
                  </div>
                </div>

                {/* Validity */}

                <div className="grid mb-3 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date *
                    </label>
                    <input
                      type="date"
                      value={newVoucher.startDate}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          startDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End Date *
                    </label>
                    <input
                      type="date"
                      value={newVoucher.endDate}
                      onChange={(e) =>
                        setNewVoucher({
                          ...newVoucher,
                          endDate: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-6 border-t">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateVoucher}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Create Voucher
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                Voucher Management
              </h1>
              <p className="text-gray-600 mt-1">
                Create, manage, and track discount vouchers
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
              >
                <Plus className="w-4 h-4" />
                Create Voucher
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                <Upload className="w-4 h-4" />
                Import
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium">
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Active Vouchers</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">4</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Used</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">1,607</p>
                </div>
                <Check className="w-8 h-8 text-purple-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Saved</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    $36,850
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-blue-500" />
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Avg. Usage</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">45%</p>
                </div>
                <BarChart3 className="w-8 h-8 text-orange-500" />
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-4 rounded-xl border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by voucher code or name..."
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Filter Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg hover:bg-gray-100 transition font-medium"
                >
                  <Filter className="w-4 h-4" />
                  Filters
                  <ChevronDown
                    className={`w-4 h-4 transition-transform ${
                      showFilters ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {showFilters && (
                  <div className="absolute top-full right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-lg z-10 p-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Discount Type
                        </label>
                        <select className="w-full px-3 py-2 border border-gray-300 rounded-lg">
                          <option value="">All Types</option>
                          <option value="percentage">Percentage</option>
                          <option value="fixed">Fixed Amount</option>
                          <option value="free_shipping">Free Shipping</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date Range
                        </label>
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                        />
                        <input
                          type="date"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Usage Count
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="number"
                            placeholder="Min"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                          <input
                            type="number"
                            placeholder="Max"
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg"
                          />
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <button
                          onClick={() => setShowFilters(false)}
                          className="px-3 py-1.5 text-sm border border-gray-300 rounded hover:bg-gray-50"
                        >
                          Clear
                        </button>
                        <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {statusTabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                    flex items-center gap-2 px-4 py-2.5 rounded-lg border transition-all
                    ${
                      activeTab === tab.id
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }
                  `}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{tab.label}</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        activeTab === tab.id
                          ? 'bg-blue-200 text-blue-800'
                          : tab.color || 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedVouchers.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-blue-600" />
                  <span className="font-medium text-blue-900">
                    {selectedVouchers.length} voucher(s) selected
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('activate')}
                    className="px-3 py-1.5 bg-green-600 text-white text-sm rounded hover:bg-green-700"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => handleBulkAction('deactivate')}
                    className="px-3 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    className="px-3 py-1.5 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Vouchers Table */}
				  <VoucherTable filteredVouchers={filteredVouchers} handleSelectAll={handleSelectAll}
					  selectedVouchers={selectedVouchers}
					
				  
				  />


          {/* Quick Tips */}
          <div className="mt-8 p-4 bg-gray-50 border border-gray-200 rounded-xl">
            <h3 className="font-medium text-gray-900 mb-2">Quick Tips</h3>
            <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
              <li>
                Use percentage discounts for promotions, fixed amounts for clear
                savings
              </li>
              <li>Set usage limits to control discount budget</li>
              <li>Schedule vouchers for future campaigns</li>
              <li>Use customer segmentation for targeted promotions</li>
              <li>Track voucher performance with analytics</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
