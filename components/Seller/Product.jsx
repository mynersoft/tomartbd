// components/ProductsDashboard.tsx
import { ChevronDown, Search, Edit2, Package } from 'lucide-react';

export default function Product() {
  const statusOptions = [
    { label: 'Active', count: 1 },
    { label: 'Inactive', count: null },
    { label: 'Draft', count: null },
    { label: 'Pending QC', count: null },
    { label: 'Out', count: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900"># Products</h1>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          {/* Search Bar */}
          <div className="relative max-w-md mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search Product"
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>

          {/* Status Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {statusOptions.map((status) => (
              <button
                key={status.label}
                className={`
                  px-4 py-2 rounded-lg border flex items-center gap-2 transition
                  ${status.label === 'Active' 
                    ? 'bg-blue-50 border-blue-200 text-blue-700' 
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <span className="font-medium">{status.label}</span>
                {status.count !== null && (
                  <span className="bg-blue-100 text-blue-600 text-xs font-semibold px-2 py-0.5 rounded-full">
                    {status.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Sort and Filter Row */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-gray-600">Sort By:</span>
                <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                  <span className="font-medium">Last Updated</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              
              <button className="flex items-center gap-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition">
                <span className="font-medium">Filter</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-8"></div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-6 mb-12">
          <button className="flex flex-col items-center justify-center w-40 h-32 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition group">
            <div className="mb-3 p-3 bg-blue-50 rounded-full group-hover:bg-blue-100 transition">
              <Edit2 className="w-6 h-6 text-blue-600" />
            </div>
            <span className="font-semibold text-gray-900">Edit Price</span>
            <span className="text-sm text-gray-500 mt-1">Update product pricing</span>
          </button>

          <button className="flex flex-col items-center justify-center w-40 h-32 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition group">
            <div className="mb-3 p-3 bg-green-50 rounded-full group-hover:bg-green-100 transition">
              <Package className="w-6 h-6 text-green-600" />
            </div>
            <span className="font-semibold text-gray-900">Edit Stock</span>
            <span className="text-sm text-gray-500 mt-1">Manage inventory</span>
          </button>
        </div>

        {/* Note about functionality */}
        <div className="mt-12 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> This is a UI implementation matching your design. 
            To make it fully functional, you'll need to:
          </p>
          <ul className="mt-2 text-sm text-blue-700 list-disc list-inside">
            <li>Connect the search input to a state management system</li>
            <li>Implement sorting and filtering logic</li>
            <li>Add product listing table/grid below</li>
            <li>Connect Edit Price/Edit Stock to modals or separate pages</li>
          </ul>
        </div>
      </div>
    </div>
  );
}