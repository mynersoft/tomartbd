'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories, useAddCategory, useUpdateCategory, useDeleteCategory } from '@/hooks/useCategory';

export default function CategoryAdminPage() {
  const { data: categories } = useCategories();
  const addCat = useAddCategory();
  const updateCat = useUpdateCategory();
  const deleteCat = useDeleteCategory();

  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('ShoppingBasket');

  const [activeSub, setActiveSub] = useState({}); // track expand

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Category Admin</h1>

      {/* Add Category */}
      <div className="mb-6 flex gap-2">
        <input placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} className="border px-3 py-2 rounded" />
        <input placeholder="Icon" value={newIcon} onChange={e => setNewIcon(e.target.value)} className="border px-3 py-2 rounded" />
        <button onClick={() => addCat.mutate({ name: newName, icon: newIcon })} className="bg-emerald-600 text-white px-4 py-2 rounded">Add</button>
      </div>

      {/* Category List */}
      <ul>
        {categories?.map(cat => (
          <li key={cat._id} className="border-b py-2">
            <div className="flex justify-between items-center">
              <span>{cat.name} ({cat.icon})</span>
              <div className="flex gap-2">
                <button onClick={() => deleteCat.mutate(cat._id)} className="text-red-600">Delete</button>
                <button onClick={() => updateCat.mutate({ id: cat._id, data: { name: cat.name, icon: cat.icon }})} className="text-blue-600">Update</button>
                <button onClick={() => setActiveSub(prev => ({ ...prev, [cat._id]: !prev[cat._id] }))} className="text-gray-600">Sub</button>
              </div>
            </div>

            {/* Subcategories with motion */}
            <AnimatePresence>
              {activeSub[cat._id] && (
                <motion.ul
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pl-6 mt-2"
                >
                  {cat.subCategories?.map(sub => (
                    <li key={sub.slug} className="py-1">{sub.name}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>
          </li>
        ))}
      </ul>
    </div>
  );
}