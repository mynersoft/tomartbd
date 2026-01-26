'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBrands, useAddBrand, useDeleteBrand } from '@/hooks/useBrands';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

export default function BrandAdminPage() {
  const { data: brands = [], isLoading, error } = useBrands();
  const addBrand = useAddBrand();
  const deleteBrand = useDeleteBrand();

  const [newBrand, setNewBrand] = useState({ name: '', icon: 'Home' });

  const handleAddBrand = () => {
    if (!newBrand.name.trim()) return;
    addBrand.mutate({
      name: newBrand.name,
    });
    setNewBrand({ name: '', icon: 'Home' });
  };

const handleBrandDelete = (id) => {
  if (confirm('⚠️ This brand will be permanently deleted. Continue?')) {
    deleteBrand.mutate(id);
  }
};


  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center py-12">Loading categories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <h2 className="text-red-800 font-semibold">
            Error loading categories
          </h2>
          <p className="text-red-600 mt-1">
            Please check your database connection.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Brand Management</h1>

      {/* Add Brand Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Brand</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Brand Name (e.g., Home)"
            value={newBrand.name}
            onChange={(e) => setNewBrand({ ...newBrand, name: e.target.value })}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />

          <button
            onClick={handleAddBrand}
            disabled={addBrand.isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {addBrand.isLoading ? 'Adding...' : 'Add Brand'}
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">All brands</h2>
        </div>

        {brands.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No brands yet. Add your first brand above.
          </div>
        ) : (
          <div className="flex  flex-wrap gap-2 p-2">
            {brands
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((brand) => (
                <div key={brand._id} className="p-6 rounded bg-purple-50 ">
                  {/* Main Brand Row */}
                  <div className="flex items-center justify-between">
                    <div
                      className="flex items-center gap-3 justify-between flex-row
				  "
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-gray-800">
                          {brand.name}
                        </span>
                      </div>
                      <button onClick={() => handleBrandDelete(brand._id)}>
                        <Trash2 size={14} className="text-red-500" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
