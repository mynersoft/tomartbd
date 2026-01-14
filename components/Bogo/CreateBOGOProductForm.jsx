'use client';

import React, { useState, useEffect } from 'react';
import { Save, X, Info, Search, ChevronRight, Check } from 'lucide-react';
import { useCreateBOGOProduct } from '@/hooks/useBOGOProducts';
import { useQuery } from '@tanstack/react-query';

const CreateBOGOProductForm = ({ onCancel, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    price: '29.99',
    stock: '100',
    category: '',
    description: '',
    images: '',
    buyQty: '1',
    getQty: '1',
    sameProductOnly: true,
    freeItem: '',
    freeItemName: '',
  });

  const [errors, setErrors] = useState({});
  const [showProductModal, setShowProductModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const createMutation = useCreateBOGOProduct();

  // Fetch all products for search
  const { data: allProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['all-products'],
    queryFn: async () => {
      const response = await fetch('/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    },
  });

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);

    // Filter products based on search query
    const filtered = (allProducts || []).filter((product) => {
      const query = searchQuery.toLowerCase();
      return (
        product.name.toLowerCase().includes(query) ||
        product._id.includes(query) ||
        (product.sku && product.sku.toLowerCase().includes(query))
      );
    });

    setSearchResults(filtered);
    setIsSearching(false);
  }, [searchQuery, allProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numericValue = Math.max(0, parseFloat(value) || 0);
    setFormData((prev) => ({ ...prev, [name]: numericValue.toString() }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const openProductModal = () => {
    setShowProductModal(true);
    setSearchQuery('');
    setSearchResults([]);
  };

  const closeProductModal = () => {
    setShowProductModal(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const selectProduct = (product) => {
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      freeItem: product._id,
      freeItemName: product.name,
    }));
    closeProductModal();
  };

  const clearSelectedProduct = () => {
    setSelectedProduct(null);
    setFormData((prev) => ({
      ...prev,
      freeItem: '',
      freeItemName: '',
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Product slug is required';
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = 'Valid price is required';
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = 'Valid stock quantity is required';
    if (!formData.buyQty || parseInt(formData.buyQty) < 1)
      newErrors.buyQty = 'Buy quantity must be at least 1';
    if (!formData.getQty || parseInt(formData.getQty) < 1)
      newErrors.getQty = 'Free quantity must be at least 1';

    const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
    if (formData.slug && !slugRegex.test(formData.slug)) {
      newErrors.slug =
        'Slug can only contain lowercase letters, numbers, and hyphens';
    }

    if (!formData.sameProductOnly && !formData.freeItem.trim()) {
      newErrors.freeItem = 'Please select a free product';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category.trim(),
        description: formData.description.trim(),
        images:
          formData.images
            .split(',')
            .map((img) => img.trim())
            .filter((img) => img) || [],
        offer: {
          type: 'BOGO',
          buyQty: parseInt(formData.buyQty),
          getQty: parseInt(formData.getQty),
          sameProductOnly: formData.sameProductOnly,
          freeItem: formData.sameProductOnly
            ? undefined
            : formData.freeItem.trim(),
        },
        regularPrice: parseFloat(formData.price),
        salePrice: parseFloat(formData.price),
      };

      console.log('Submitting product data:', productData);

      await createMutation.mutateAsync(productData);

      // Reset form
      setFormData({
        name: '',
        slug: '',
        price: '29.99',
        stock: '100',
        category: '',
        description: '',
        images: '',
        buyQty: '1',
        getQty: '1',
        sameProductOnly: true,
        freeItem: '',
        freeItemName: '',
      });
      setSelectedProduct(null);
      setErrors({});

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      slug: '',
      price: '29.99',
      stock: '100',
      category: '',
      description: '',
      images: '',
      buyQty: '1',
      getQty: '1',
      sameProductOnly: true,
      freeItem: '',
      freeItemName: '',
    });
    setSelectedProduct(null);
    setErrors({});
    if (onCancel) onCancel();
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Create BOGO Product
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Product Slug */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Slug *
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.slug ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="product-slug-name"
              />
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">{errors.slug}</p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price ($) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleNumberChange}
                step="0.01"
                min="0"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="29.99"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price}</p>
              )}
            </div>

            {/* Stock */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleNumberChange}
                min="0"
                required
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.stock ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="100"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., Electronics, Clothing"
              />
            </div>
          </div>

          {/* BOGO Offer Details */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center gap-2 mb-4">
              <Info className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                BOGO Offer Details
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Buy Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buy Quantity *
                </label>
                <input
                  type="number"
                  name="buyQty"
                  value={formData.buyQty}
                  onChange={handleNumberChange}
                  min="1"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.buyQty ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1"
                />
                {errors.buyQty && (
                  <p className="mt-1 text-sm text-red-600">{errors.buyQty}</p>
                )}
              </div>

              {/* Get Free Quantity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Get Free Quantity *
                </label>
                <input
                  type="number"
                  name="getQty"
                  value={formData.getQty}
                  onChange={handleNumberChange}
                  min="1"
                  required
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.getQty ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="1"
                />
                {errors.getQty && (
                  <p className="mt-1 text-sm text-red-600">{errors.getQty}</p>
                )}
              </div>

              {/* Same Product Only */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Free Product Type
                </label>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        sameProductOnly: true,
                      }));
                      setSelectedProduct(null);
                      if (errors.freeItem) {
                        setErrors((prev) => ({ ...prev, freeItem: '' }));
                      }
                    }}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      formData.sameProductOnly
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Same Product
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        sameProductOnly: false,
                      }))
                    }
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      !formData.sameProductOnly
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    Different Product
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-600">
                  {formData.sameProductOnly
                    ? 'Customer gets the same product for free'
                    : 'Select a different product to give for free'}
                </p>
              </div>
            </div>

            {/* Free Product Selection (if different product) */}
            {!formData.sameProductOnly && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Free Product *
                </label>

                {selectedProduct ? (
                  <div className="border border-green-200 bg-green-50 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {selectedProduct.images?.[0] && (
                          <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                            <img
                              src={selectedProduct.images[0]}
                              alt={selectedProduct.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {selectedProduct.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1">
                            <span className="text-sm text-gray-600">
                              Price: $
                              {selectedProduct.salePrice ||
                                selectedProduct.regularPrice}
                            </span>
                            <span className="text-xs text-gray-500">
                              ID: {selectedProduct._id}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={clearSelectedProduct}
                        className="text-red-600 hover:text-red-800 text-sm font-medium"
                      >
                        Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={openProductModal}
                      className={`w-full px-4 py-3 border rounded-lg flex items-center justify-center gap-2 ${
                        errors.freeItem
                          ? 'border-red-500 bg-red-50'
                          : 'border-gray-300 hover:border-blue-500 hover:bg-blue-50'
                      }`}
                    >
                      <Search className="w-5 h-5 text-gray-400" />
                      <span className="text-gray-700">
                        Search and select free product
                      </span>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </button>
                    {errors.freeItem && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.freeItem}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Product description..."
            />
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URLs (comma separated)
            </label>
            <textarea
              name="images"
              value={formData.images}
              onChange={handleChange}
              rows="2"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
            <button
              type="submit"
              disabled={createMutation.isLoading}
              className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {createMutation.isLoading ? 'Creating...' : 'Create BOGO Product'}
            </button>
          </div>
        </form>
      </div>

      {/* Product Search Modal */}
      {showProductModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
            {/* Modal Header */}
            <div className="border-b border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Select Free Product
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Search and select a product to give for free
                  </p>
                </div>
                <button
                  onClick={closeProductModal}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6 text-gray-500" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="mt-6">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by product name, ID, or SKU..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    autoFocus
                  />
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              {productsLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {searchResults.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => selectProduct(product)}
                      className={`border rounded-lg p-4 cursor-pointer transition-all hover:border-blue-500 hover:bg-blue-50 group ${
                        selectedProduct?._id === product._id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {product.images?.[0] ? (
                          <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-gray-400 text-sm">
                              No image
                            </span>
                          </div>
                        )}

                        <div className="flex-1">
                          <div className="flex items-start justify-between">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-700">
                              {product.name}
                            </h4>
                            {selectedProduct?._id === product._id && (
                              <Check className="w-5 h-5 text-green-600" />
                            )}
                          </div>

                          <div className="mt-2 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-gray-600">
                                Price:
                              </span>
                              <span className="font-medium text-gray-900">
                                ${product.salePrice || product.regularPrice}
                              </span>
                              {product.offer?.type === 'BOGO' && (
                                <span className="px-2 py-0.5 bg-red-100 text-red-700 rounded text-xs font-medium">
                                  BOGO
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span>ID: {product._id}</span>
                              {product.sku && <span>SKU: {product.sku}</span>}
                            </div>

                            <div className="flex items-center gap-4 text-xs">
                              <span
                                className={`px-2 py-0.5 rounded ${
                                  product.stock > 10
                                    ? 'bg-green-100 text-green-700'
                                    : product.stock > 0
                                      ? 'bg-yellow-100 text-yellow-700'
                                      : 'bg-red-100 text-red-700'
                                }`}
                              >
                                Stock: {product.stock}
                              </span>
                              {product.category && (
                                <span className="text-gray-600">
                                  {product.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchQuery ? (
                <div className="text-center py-12">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No products found for "{searchQuery}"
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Try searching by name, ID, or SKU
                  </p>
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">
                    Start typing to search products...
                  </p>
                  <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Search Tips:
                      </h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Product name</li>
                        <li>• Product ID</li>
                        <li>• SKU number</li>
                      </ul>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Recently Added:
                      </h4>
                      {allProducts?.slice(0, 3).map((product) => (
                        <button
                          key={product._id}
                          onClick={() => selectProduct(product)}
                          className="block text-left w-full text-sm text-gray-600 hover:text-blue-600 py-1"
                        >
                          • {product.name}
                        </button>
                      ))}
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-medium text-gray-900 mb-2">
                        BOGO Products:
                      </h4>
                      {allProducts
                        ?.filter((p) => p.offer?.type === 'BOGO')
                        .slice(0, 3)
                        .map((product) => (
                          <button
                            key={product._id}
                            onClick={() => selectProduct(product)}
                            className="block text-left w-full text-sm text-gray-600 hover:text-blue-600 py-1"
                          >
                            • {product.name}
                          </button>
                        ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-6">
              <div className="flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {searchResults.length > 0 && (
                    <span>{searchResults.length} products found</span>
                  )}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={closeProductModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  {selectedProduct && (
                    <button
                      onClick={() => selectProduct(selectedProduct)}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Select Product
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreateBOGOProductForm;
