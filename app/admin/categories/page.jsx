'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  useCategories, 
  useAddCategory, 
  useDeleteCategory,
  useAddSubCategory,
  useDeleteSubCategory 
} from '@/hooks/useCategory';
import { ChevronRight, Plus, Trash2 } from 'lucide-react';

export default function CategoryAdminPage() {
  const { data: categories = [], isLoading, error } = useCategories();
  const addCategory = useAddCategory();
  const deleteCategory = useDeleteCategory();
  const addSubCategory = useAddSubCategory();
  const deleteSubCategory = useDeleteSubCategory();

  const [newCategory, setNewCategory] = useState({ name: '', icon: 'Home' });
  const [newSubCategory, setNewSubCategory] = useState({ 
    parentId: null, 
    name: '',
    parentSubSlug: null // For nested subcategories
  });
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedSubCategories, setExpandedSubCategories] = useState({});

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  };

  const handleAddCategory = () => {
    if (!newCategory.name.trim()) return;
    
    const slug = generateSlug(newCategory.name);
    addCategory.mutate({
      name: newCategory.name,
      icon: newCategory.icon,
      slug,
      hierarchy: 'category'
    });
    setNewCategory({ name: '', icon: 'Home' });
  };

  const handleAddSubCategory = (parentCategory, isNested = false, parentSubCategory = null) => {
    if (!newSubCategory.name.trim() || !parentCategory) return;
    
    const slug = generateSlug(newSubCategory.name);
    let path;
    let level;
    
    if (isNested && parentSubCategory) {
      // Nested subcategory (sub-subcategory)
      path = `${parentSubCategory.path}/${slug}`;
      level = parentSubCategory.level + 1;
    } else {
      // Regular subcategory
      path = `${parentCategory.slug}/${slug}`;
      level = 1;
    }
    
    const subCategoryData = {
      name: newSubCategory.name,
      slug,
      level,
      path,
      hierarchy: isNested ? 'sub-subcategory' : 'subcategory',
      ...(isNested && parentSubCategory && { parentSubCategory: parentSubCategory.slug })
    };
    
    addSubCategory.mutate({
      parentId: parentCategory._id,
      subCategoryData
    });
    
    // Reset form
    setNewSubCategory({ parentId: null, name: '', parentSubSlug: null });
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryId]: !prev[categoryId]
    }));
  };

  const toggleSubCategoryExpand = (subSlug) => {
    setExpandedSubCategories(prev => ({
      ...prev,
      [subSlug]: !prev[subSlug]
    }));
  };

  const getSubcategoriesByParent = (category, parentSlug = null) => {
    if (!category.subCategories) return [];
    return category.subCategories.filter(
      sub => sub.parentSubCategory === parentSlug
    );
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
          <h2 className="text-red-800 font-semibold">Error loading categories</h2>
          <p className="text-red-600 mt-1">Please check your database connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Category Management</h1>

      {/* Add Category Form */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Add Main Category</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Category Name (e.g., Home)"
            value={newCategory.name}
            onChange={e => setNewCategory({...newCategory, name: e.target.value})}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
          />
          <input
            type="text"
            placeholder="Icon (e.g., Home)"
            value={newCategory.icon}
            onChange={e => setNewCategory({...newCategory, icon: e.target.value})}
            className="w-40 border border-gray-300 rounded-lg px-4 py-2"
          />
          <button
            onClick={handleAddCategory}
            disabled={addCategory.isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
          >
            {addCategory.isLoading ? 'Adding...' : 'Add Category'}
          </button>
        </div>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Categories</h2>
          <p className="text-gray-500 text-sm mt-1">
            Click on categories to expand and manage subcategories
          </p>
        </div>

        {categories.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No categories yet. Add your first category above.
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {categories.map(category => (
              <li key={category._id} className="p-6">
                {/* Main Category Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleCategoryExpand(category._id)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <ChevronRight 
                        className={`transition-transform duration-200 ${
                          expandedCategories[category._id] ? 'rotate-90' : ''
                        }`}
                        size={20}
                      />
                    </button>
                    <div className="flex items-center gap-3">
                      <span className="font-medium text-gray-800">{category.name}</span>
                      <span className="text-sm bg-gray-100 text-gray-600 px-2 py-1 rounded">
                        {category.icon}
                      </span>
                      <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                        {category.slug}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setNewSubCategory({ 
                        parentId: category._id, 
                        name: '',
                        parentSubSlug: null
                      })}
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1 px-3 py-1 rounded border border-blue-200 hover:bg-blue-50"
                    >
                      <Plus size={16} />
                      Add Sub
                    </button>
                    <button
                      onClick={() => deleteCategory.mutate(category._id)}
                      className="text-red-600 hover:text-red-800 p-2 rounded hover:bg-red-50"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Add Subcategory Form */}
                {newSubCategory.parentId === category._id && !newSubCategory.parentSubSlug && (
                  <div className="ml-8 mt-4 pl-4 border-l-2 border-blue-300">
                    <div className="flex flex-col sm:flex-row gap-2 mb-4">
                      <input
                        type="text"
                        placeholder="Subcategory Name (e.g., Home Decor)"
                        value={newSubCategory.name}
                        onChange={e => setNewSubCategory({...newSubCategory, name: e.target.value})}
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddSubCategory(category)}
                          disabled={addSubCategory.isLoading}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50"
                        >
                          {addSubCategory.isLoading ? 'Adding...' : 'Add Subcategory'}
                        </button>
                        <button
                          onClick={() => setNewSubCategory({ parentId: null, name: '', parentSubSlug: null })}
                          className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border hover:bg-gray-100"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Subcategories List */}
                <AnimatePresence>
                  {expandedCategories[category._id] && category.subCategories && category.subCategories.length > 0 && (
                    <motion.ul
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="ml-8 mt-4 space-y-4"
                    >
                      {/* Level 1 Subcategories */}
                      {getSubcategoriesByParent(category, null).map(sub => (
                        <li key={sub._id} className="pl-4 border-l-2 border-blue-200">
                          <div className="py-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => toggleSubCategoryExpand(sub.slug)}
                                  className="text-gray-500 hover:text-gray-700"
                                >
                                  <ChevronRight 
                                    className={`transition-transform duration-200 ${
                                      expandedSubCategories[sub.slug] ? 'rotate-90' : ''
                                    }`}
                                    size={18}
                                  />
                                </button>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-700">{sub.name}</span>
                                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                      Level {sub.level}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-500 mt-1">
                                    Path: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{sub.path}</code>
                                  </p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => setNewSubCategory({ 
                                    parentId: category._id, 
                                    name: '',
                                    parentSubSlug: sub.slug
                                  })}
                                  className="text-purple-600 hover:text-purple-800 text-sm flex items-center gap-1 px-2 py-1 rounded border border-purple-200 hover:bg-purple-50"
                                >
                                  <Plus size={14} />
                                  Add Nested
                                </button>
                                <button
                                  onClick={() => deleteSubCategory.mutate({ 
                                    slug: sub.slug,
                                    parentId: category._id
                                  })}
                                  className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Add Nested Subcategory Form */}
                            {newSubCategory.parentId === category._id && newSubCategory.parentSubSlug === sub.slug && (
                              <div className="ml-6 mt-3 pl-4 border-l-2 border-purple-300">
                                <div className="flex flex-col sm:flex-row gap-2 mb-3">
                                  <input
                                    type="text"
                                    placeholder={`Nested under ${sub.name} (e.g., Wall Canvas)`}
                                    value={newSubCategory.name}
                                    onChange={e => setNewSubCategory({...newSubCategory, name: e.target.value})}
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 text-sm"
                                  />
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => handleAddSubCategory(category, true, sub)}
                                      disabled={addSubCategory.isLoading}
                                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium disabled:opacity-50 text-sm"
                                    >
                                      {addSubCategory.isLoading ? 'Adding...' : 'Add Nested'}
                                    </button>
                                    <button
                                      onClick={() => setNewSubCategory({ parentId: null, name: '', parentSubSlug: null })}
                                      className="text-gray-600 hover:text-gray-800 px-4 py-2 rounded-lg border hover:bg-gray-100 text-sm"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Nested Subcategories (Level 2) */}
                            <AnimatePresence>
                              {expandedSubCategories[sub.slug] && (
                                <motion.ul
                                  initial={{ opacity: 0, height: 0 }}
                                  animate={{ opacity: 1, height: 'auto' }}
                                  exit={{ opacity: 0, height: 0 }}
                                  className="ml-6 mt-2 space-y-2"
                                >
                                  {getSubcategoriesByParent(category, sub.slug).map(nested => (
                                    <li key={nested._id} className="pl-4 border-l-2 border-purple-200 py-2">
                                      <div className="flex items-center justify-between">
                                        <div>
                                          <div className="flex items-center gap-2">
                                            <span className="text-gray-600">{nested.name}</span>
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                              Level {nested.level}
                                            </span>
                                          </div>
                                          <p className="text-xs text-gray-500 mt-1">
                                            Path: <code className="bg-gray-100 px-1 py-0.5 rounded">{nested.path}</code>
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => deleteSubCategory.mutate({ 
                                            slug: nested.slug,
                                            parentId: category._id
                                          })}
                                          className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-red-50"
                                        >
                                          <Trash2 size={16} />
                                        </button>
                                      </div>
                                    </li>
                                  ))}
                                </motion.ul>
                              )}
                            </AnimatePresence>
                          </div>
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hierarchy Preview */}
      {categories.length > 0 && (
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold mb-4">Hierarchy Preview</h3>
          <div className="space-y-3">
            {categories.map(category => {
              const level1Subs = category.subCategories?.filter(sub => !sub.parentSubCategory) || [];
              
              return (
                <div key={category._id} className="text-sm">
                  <div className="font-medium text-gray-800 mb-2">{category.name}</div>
                  <ul className="ml-4 space-y-1">
                    {level1Subs.map(sub => {
                      const nestedSubs = category.subCategories?.filter(
                        n => n.parentSubCategory === sub.slug
                      ) || [];
                      
                      return (
                        <li key={sub._id} className="text-gray-700">
                          <div>├─ {sub.name}</div>
                          {nestedSubs.map(nested => (
                            <div key={nested._id} className="ml-4 text-gray-600">
                              └─ {nested.name}
                            </div>
                          ))}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}