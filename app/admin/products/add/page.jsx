'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAddProduct } from '@/hooks/useProducts';

export default function AddProductPage() {
  const { mutate, isLoading } = useAddProduct();

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    sku: '',
    discount: { type: '', value: '' },
    images: [],
    tags: '',
    featured: false,
    bestseller: false,
    newArrival: true,
    variants: [], // ✅ variants array
  });

  // handle top-level and nested fields
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

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

  // handle image upload
  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    toast.loading('Uploading images...');
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
      );

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    toast.dismiss();
    toast.success('Images uploaded!');

    setForm((prev) => ({ ...prev, images: uploaded }));
  };

  // variant handlers
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: '', color: '', price: '', stock: '' }],
    }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index) => {
    const newVariants = [...form.variants];
    newVariants.splice(index, 1);
    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  // submit handler
  const handleAddProduct = (e) => {
    e.preventDefault();

    const hasDiscount =
      form.discount.type && Number(form.discount.value) > 0;

    // convert variant price/stock to numbers
    const variants = form.variants.map((v) => ({
      size: v.size,
      color: v.color,
      price: Number(v.price),
      stock: Number(v.stock),
    }));

    mutate(
      {
        name: form.name,
        description: form.description,
        category: form.category,
        brand: form.brand,
        regularPrice: Number(form.price),
        stock: Number(form.stock),
        sku: form.sku,
        images: form.images,
        tags: form.tags ? form.tags.split(',').map((t) => t.trim()) : [],
        featured: form.featured,
        bestseller: form.bestseller,
        newArrival: form.newArrival,
        variants,
        ...(hasDiscount && {
          discount: { type: form.discount.type, value: Number(form.discount.value) },
        }),
      },
      {
        onSuccess: () => {
          toast.success('Product added successfully');
          setForm({
            name: '',
            description: '',
            category: '',
            brand: '',
            price: '',
            stock: '',
            sku: '',
            discount: { type: '', value: '' },
            images: [],
            tags: '',
            featured: false,
            bestseller: false,
            newArrival: true,
            variants: [],
          });
        },
      }
    );
  };

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
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleUploadImages}
          className="w-full border px-3 py-2 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="brand"
          value={form.brand}
          onChange={handleChange}
          placeholder="Brand"
          className="w-full border px-3 py-2 rounded"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select Category</option>
          <option value="electronics">Electronics</option>
          <option value="mobile">Mobile</option>
          <option value="fashion">Fashion</option>
          <option value="hardware">Hardware</option>
          <option value="other">Other</option>
        </select>

        <div className="flex gap-2">
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            placeholder="Price"
            className="w-1/2 border px-3 py-2 rounded"
            required
          />

          <select
            name="discount.type"
            value={form.discount.type}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">Select discount type</option>
            <option value="percentage">Percentage</option>
            <option value="fixed">Fixed</option>
          </select>

          <input
            name="discount.value"
            value={form.discount.value}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            placeholder="Discount value"
          />
        </div>

        <input
          type="number"
          name="stock"
          value={form.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          className="w-full border px-3 py-2 rounded"
          required
        />

        <input
          type="text"
          name="sku"
          value={form.sku}
          onChange={handleChange}
          placeholder="SKU"
          className="w-full border px-3 py-2 rounded"
        />

        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border px-3 py-2 rounded"
        />

        <div className="flex gap-4">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="featured"
              checked={form.featured}
              onChange={handleChange}
            />
            Featured
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="bestseller"
              checked={form.bestseller}
              onChange={handleChange}
            />
            Bestseller
          </label>
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              name="newArrival"
              checked={form.newArrival}
              onChange={handleChange}
            />
            New Arrival
          </label>
        </div>

        {/* 🔹 VARIANTS SECTION */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Variants</h2>
          {form.variants.map((variant, index) => (
            <div key={index} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={variant.size}
                onChange={(e) => updateVariant(index, 'size', e.target.value)}
                placeholder="Size"
                className="border px-2 py-1 rounded w-1/5"
              />
              <input
                type="text"
                value={variant.color}
                onChange={(e) => updateVariant(index, 'color', e.target.value)}
                placeholder="Color"
                className="border px-2 py-1 rounded w-1/5"
              />
              <input
                type="number"
                value={variant.price}
                onChange={(e) => updateVariant(index, 'price', e.target.value)}
                placeholder="Price"
                className="border px-2 py-1 rounded w-1/5"
              />
              <input
                type="number"
                value={variant.stock}
                onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                placeholder="Stock"
                className="border px-2 py-1 rounded w-1/5"
              />
              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
          >
            Add Variant
          </button>
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Adding...' : 'Add Product'}
        </button>
      </form>
    </div>
  );
}