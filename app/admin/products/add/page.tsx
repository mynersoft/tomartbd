'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAddProduct } from '@/hooks/useProducts';
import { useSelector } from 'react-redux';
import RichTextEditor from '@/components/TinyMCEEditor';
import { handleImageUpload } from '@/utils/cloudinaryUploader';

export default function AddProductPage() {
  const { mutate, isLoading } = useAddProduct();
  const { brands } = useSelector((state) => state.brand);
  const { categories } = useSelector((state) => state.category);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    subCategory: '',
    childCategory: '',
    brand: '',
    regularPrice: '',
    stock: '',
    discount: { type: '', value: '' },
    galleryImages: [],
    featureImg: '',
    tags: '',
    featured: false,
    bestseller: false,
    newArrival: true,
    freeDelivery: false,
  });

  const selectedCategory = categories?.find((c) => c._id === form.category);

  const levelOneSubs =
    selectedCategory?.subCategories?.filter((sub) => sub.level === 1) || [];

  const levelTwoSubs =
    selectedCategory?.subCategories?.filter(
      (sub) =>
        sub.level === 2 &&
        sub.parentSubCategory ===
          levelOneSubs.find((s) => s._id === form.subCategory)?.slug
    ) || [];

  const [isUploading, setIsUploading] = useState(false);

  // Calculate sale price based on discount
  const calculateSalePrice = () => {
    const price = Number(form.regularPrice) || 0;
    const discountValue = Number(form.discount.value) || 0;

    if (!form.discount.type || discountValue === 0) return price;

    if (form.discount.type === 'percentage') {
      return price - (price * discountValue) / 100;
    } else if (form.discount.type === 'fixed') {
      return Math.max(0, price - discountValue);
    }

    return price;
  };

  const salePrice = calculateSalePrice();

  // -------------------- HANDLERS --------------------
  const handleChange = (eOrValue, fieldName) => {
    // 🟢 Case 1: TinyMCE (string value)
    if (typeof eOrValue === 'string') {
      setForm((prev) => ({
        ...prev,
        [fieldName]: eOrValue,
      }));
      return;
    }

    // 🟢 Case 2: Normal input event
    const { name, value, type, checked } = eOrValue.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value,
      }));
    }
  };

  const removeImage = (field, index = null) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        index === null
          ? '' // single image
          : prev[field].filter((_, i) => i !== index), // multiple
    }));
  };

  // -------------------- SUBMIT --------------------
  const handleAddProduct = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (!form.category) {
      toast.error('Category is required');
      return;
    }

    if (!form.regularPrice || Number(form.regularPrice) <= 0) {
      toast.error('Regular price is required and must be greater than 0');
      return;
    }

    const hasDiscount = form.discount.type && Number(form.discount.value) > 0;

    const productData = {
      name: form.name.trim(),
      description: form.description,
      category: form.category,
      brand: form.brand,
      regularPrice: Number(form.regularPrice),
      salePrice: salePrice,
      stock: Number(form.stock || 0),
      featureImg: form.featureImg,
      galleryImages: form.galleryImages,
      tags: form.tags
        ? form.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t)
        : [],
      featured: form.featured,
      bestseller: form.bestseller,
      newArrival: form.newArrival,
      freeDelivery: form.freeDelivery,
      ...(hasDiscount && {
        discount: {
          type: form.discount.type,
          value: Number(form.discount.value),
        },
      }),
    };

    // Add subcategories if selected
    if (form.subCategory) {
      productData.subCategory = form.subCategory;
    }
    if (form.childCategory) {
      productData.childCategory = form.childCategory;
    }

    mutate(productData, {
      onSuccess: () => {
        toast.success('Product added successfully');
        setForm({
          name: '',
          description: '',
          category: '',
          subCategory: '',
          childCategory: '',
          brand: '',
          regularPrice: '',
          stock: '',
          discount: { type: '', value: '' },
          galleryImages: [],
          featureImg: '',
          tags: '',
          featured: false,
          bestseller: false,
          newArrival: true,
          freeDelivery: false,
        });
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add product');
      },
    });
  };

  // -------------------- UI --------------------
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
      <div className="flex justify-between my-2">
        <h1 className="text-2xl font-bold mb-4">Add New Product</h1>
        <Link
          href="/admin/products"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Product list
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleAddProduct}>
        {/* Product Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Product Name *
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Product Name"
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <RichTextEditor
            value={form.description}
            onChange={(content) => handleChange(content, 'description')}
            height={450}
            placeholder="Write product description..."
          />
        </div>

        {/* Brand & Category */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>
            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
            >
              <option value="">Select Brand</option>
              {brands &&
                brands?.map((brand) => (
                  <option key={brand._id} value={brand._id}>
                    {brand.name}
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category *</label>
            <select
              value={form.category}
              onChange={(e) => {
                setForm((prev) => ({
                  ...prev,
                  category: e.target.value,
                  subCategory: '',
                  childCategory: '',
                }));
              }}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sub-categories */}
        {levelOneSubs.length > 0 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Sub Category
              </label>
              <select
                value={form.subCategory}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    subCategory: e.target.value,
                    childCategory: '',
                  }))
                }
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">Select Sub Category</option>
                {levelOneSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>
            {levelTwoSubs.length > 0 && (
              <div>
                <label className="block text-sm font-medium mb-1">
                  Child Category
                </label>
                <select
                  value={form.childCategory}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      childCategory: e.target.value,
                    }))
                  }
                  className="w-full border px-3 py-2 rounded"
                >
                  <option value="">Select Child Category</option>
                  {levelTwoSubs.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Images */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Feature Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                handleImageUpload({
                  e,
                  field: 'featureImg',
                  multiple: false,
                  form,
                  setForm,
                  setIsUploading,
                  toast,
                })
              }
              disabled={isUploading}
              className="w-full border px-3 py-2 rounded"
            />

            {form.featureImg && (
              <div className="relative w-24 mt-2">
                <img
                  src={form.featureImg}
                  alt="Feature"
                  className="w-24 h-24 object-cover rounded border"
                />
                <button
                  type="button"
                  onClick={() => removeImage('featureImg')}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Gallery Images
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) =>
                handleImageUpload({
                  e,
                  field: 'galleryImages',
                  multiple: true,
                  form,
                  setForm,
                  setIsUploading,
                  toast,
                })
              }
              disabled={isUploading}
              className="w-full border px-3 py-2 rounded"
            />

            <div className="flex gap-2 flex-wrap mt-2">
              {form.galleryImages?.map((img, index) => (
                <div key={index} className="relative">
                  <img
                    src={img}
                    alt={`Gallery ${index + 1}`}
                    className="w-16 h-16 object-cover rounded border"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage('galleryImages', index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Pricing & Inventory</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Regular Price *
              </label>
              <input
                type="number"
                name="regularPrice"
                value={form.regularPrice}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full border px-3 py-2 rounded"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                placeholder="0"
                className="w-full border px-3 py-2 rounded"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        {/* Discount */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Discount (Optional)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Type
              </label>
              <select
                name="discount.type"
                value={form.discount.type}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
              >
                <option value="">No Discount</option>
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Discount Value
              </label>
              <input
                type="number"
                name="discount.value"
                value={form.discount.value}
                onChange={handleChange}
                className="w-full border px-3 py-2 rounded"
                placeholder="0"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Sale Price
              </label>
              <input
                type="number"
                value={salePrice.toFixed(2)}
                readOnly
                className="w-full border px-3 py-2 rounded bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tags (comma separated)
          </label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="e.g., summer, casual, trending"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Product Flags */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Product Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">Featured Product</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="bestseller"
                checked={form.bestseller}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">Bestseller</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="newArrival"
                checked={form.newArrival}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">New Arrival</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="freeDelivery"
                checked={form.freeDelivery}
                onChange={handleChange}
                className="rounded"
              />
              <span className="text-sm">Free Delivery</span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="border-t pt-6">
          <button
            disabled={isLoading || isUploading}
            type="submit"
            className="bg-blue-600 text-white px-8 py-3 rounded font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading
              ? 'Adding Product...'
              : isUploading
                ? 'Uploading Images...'
                : 'Add Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
