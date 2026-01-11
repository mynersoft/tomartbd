'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAddProduct } from '@/hooks/useProducts';

export default function AddProductPage() {
  const { mutate, isLoading } = useAddProduct();

  const colors = [
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ff0000" },
    { name: "Blue", value: "#0000ff" },
    { name: "Green", value: "#00ff00" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Purple", value: "#800080" },
    { name: "Orange", value: "#ffa500" },
    { name: "Gray", value: "#808080" },
  ];

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: '',
    brand: '',
    regularPrice: '',
    stock: '',
    discount: { type: '', value: '' },
    images: [],
    tags: '',
    featured: false,
    bestseller: false,
    newArrival: true,
    variants: [],
  });

  const [selectedColor, setSelectedColor] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const hasVariants = form.variants.length > 0;

  // -------------------- HANDLERS --------------------
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setForm(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: type === 'checkbox' ? checked : value },
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    }
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files || !files.length) return;

    toast.loading('Uploading images...');
    const uploaded = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: 'POST', body: formData }
      );

      const data = await res.json();
      uploaded.push(data.secure_url);
    }

    toast.dismiss();
    toast.success('Images uploaded!');
    setForm(prev => ({ ...prev, images: uploaded }));
  };

  const addVariant = () => {
    setForm(prev => ({
      ...prev,
      variants: [
        ...prev.variants,
        { size: '', color: '', price: '', stock: '', discount: { type: '', value: '' }, salePrice: 0, images: [] },
      ],
    }));
  };

  const updateVariant = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index][field] = value;
    
    // Recalculate sale price when price changes
    if (field === 'price') {
      const price = Number(value || 0);
      const discountValue = Number(newVariants[index].discount.value || 0);
      
      if (newVariants[index].discount.type === 'percentage') {
        newVariants[index].salePrice = price - (price * discountValue) / 100;
      } else if (newVariants[index].discount.type === 'fixed') {
        newVariants[index].salePrice = price - discountValue;
      } else {
        newVariants[index].salePrice = price;
      }
    }
    
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const updateVariantDiscount = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index].discount[field] = value;

    const price = Number(newVariants[index].price || 0);
    const discountValue = Number(newVariants[index].discount.value || 0);

    if (field === 'value') {
      if (newVariants[index].discount.type === 'percentage') {
        newVariants[index].salePrice = price - (price * discountValue) / 100;
      } else if (newVariants[index].discount.type === 'fixed') {
        newVariants[index].salePrice = price - discountValue;
      } else {
        newVariants[index].salePrice = price;
      }
    } else if (field === 'type') {
      if (value === 'percentage') {
        newVariants[index].salePrice = price - (price * discountValue) / 100;
      } else if (value === 'fixed') {
        newVariants[index].salePrice = price - discountValue;
      } else {
        newVariants[index].salePrice = price;
      }
    }

    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index) => {
    const newVariants = [...form.variants];
    newVariants.splice(index, 1);
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  const uploadVariantImages = async (files, index) => {
    if (!files.length) return;

    setIsUploading(true);
    toast.loading('Uploading variant images...');
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
    toast.success('Variant images uploaded');

    const newVariants = [...form.variants];
    newVariants[index].images = [
      ...(newVariants[index].images || []),
      ...uploaded,
    ];
    setForm((prev) => ({ ...prev, variants: newVariants }));

    setIsUploading(false);
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const newVariants = [...form.variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    setForm(prev => ({ ...prev, variants: newVariants }));
  };

  // -------------------- SUBMIT --------------------
  const handleAddProduct = (e) => {
    e.preventDefault();

    const hasDiscount = form.discount.type && Number(form.discount.value) > 0;

    const variants = form.variants.map(v => ({
      size: v.size,
      color: v.color,
      price: Number(v.price),
      stock: Number(v.stock),
      salePrice: Number(v.salePrice),
      images: v.images || [],
      ...(v.discount?.value && { discount: { type: v.discount.type, value: Number(v.discount.value) } }),
    }));

    const productData = {
      name: form.name,
      description: form.description,
      category: form.category,
      brand: form.brand,
      stock: Number(form.stock),
      images: form.images,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()) : [],
      featured: form.featured,
      bestseller: form.bestseller,
      newArrival: form.newArrival,
      ...(hasDiscount && { discount: { type: form.discount.type, value: Number(form.discount.value) } }),
    };

    // Add regularPrice only if there are no variants
    if (!hasVariants) {
      productData.regularPrice = Number(form.regularPrice);
    }

    // Add variants only if they exist
    if (variants.length > 0) {
      productData.variants = variants;
    }

    mutate(productData, {
      onSuccess: () => {
        toast.success('Product added successfully');
        setForm({
          name: '',
          description: '',
          category: '',
          brand: '',
          regularPrice: '',
          stock: '',
          discount: { type: '', value: '' },
          images: [],
          tags: '',
          featured: false,
          bestseller: false,
          newArrival: true,
          variants: [],
        });
        setSelectedColor('');
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add product');
      }
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
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Main Images */}
        <div>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleUploadImages}
            className="w-full border px-3 py-2 rounded"
          />
          {form.images.length > 0 && (
            <div className="flex gap-2 mt-2 flex-wrap">
              {form.images.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt="product"
                  className="w-16 h-16 object-cover rounded border"
                />
              ))}
            </div>
          )}
        </div>

        {/* Description */}
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Brand & Category */}
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

        {/* Variants Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Variants</h2>

          {form.variants.map((variant, index) => (
            <div key={index} className="border p-4 rounded mb-4 space-y-3">
              <div className="flex gap-2 flex-wrap items-center">
                <input
                  type="text"
                  value={variant.size}
                  onChange={(e) => updateVariant(index, 'size', e.target.value)}
                  placeholder="Size"
                  className="border px-2 py-1 rounded w-1/4"
                />
                <select
                  value={variant.color}
                  onChange={(e) =>
                    updateVariant(index, "color", e.target.value)
                  }
                  className="border px-2 py-1 rounded w-1/4"
                >
                  <option value="">Select Color</option>
                  {colors.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.name}
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  value={variant.price}
                  onChange={(e) =>
                    updateVariant(index, 'price', e.target.value)
                  }
                  placeholder="Price"
                  className="border px-2 py-1 rounded w-1/4"
                />
                <input
                  type="number"
                  value={variant.stock}
                  onChange={(e) =>
                    updateVariant(index, 'stock', e.target.value)
                  }
                  placeholder="Stock"
                  className="border px-2 py-1 rounded w-1/4"
                />
              </div>

              {/* Discount & Sale Price */}
              <div className="flex gap-2">
                <select
                  value={variant.discount.type}
                  onChange={(e) =>
                    updateVariantDiscount(index, 'type', e.target.value)
                  }
                  className="border px-2 py-1 rounded w-1/3"
                >
                  <option value="">Discount Type</option>
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>

                <input
                  type="number"
                  value={variant.discount.value}
                  onChange={(e) =>
                    updateVariantDiscount(index, 'value', e.target.value)
                  }
                  placeholder="Discount Value"
                  className="border px-2 py-1 rounded w-1/3"
                />

                <input
                  type="number"
                  value={variant.salePrice || 0}
                  readOnly
                  placeholder="Sale Price"
                  className="border px-2 py-1 rounded w-1/3 bg-gray-100"
                />
              </div>

              {/* Variant Images */}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => uploadVariantImages(e.target.files, index)}
                className="border px-2 py-1 rounded w-full"
                disabled={isUploading}
              />

              {variant.images?.length > 0 && (
                <div className="flex gap-2 mt-2 flex-wrap">
                  {variant.images.map((img, imgIndex) => (
                    <div key={imgIndex} className="relative">
                      <img
                        src={img}
                        alt="variant"
                        className="w-16 h-16 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeVariantImage(index, imgIndex)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => removeVariant(index)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove Variant
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-600 text-white px-4 py-1 rounded"
          >
            Add Variant
          </button>
        </div>

        {/* Main Price & Discount - Only show if no variants */}
        {!hasVariants && (
          <>
            <div className="flex gap-2">
              <input
                type="number"
                name="regularPrice"
                value={form.regularPrice}
                onChange={handleChange}
                placeholder="Regular Price"
                className="w-full border px-3 py-2 rounded"
                required
              />
            </div>
            <div className="flex gap-2">
              <select
                name="discount.type"
                value={form.discount.type}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded"
              >
                <option value="">Select discount type</option>
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>

              <input
                name="discount.value"
                value={form.discount.value}
                onChange={handleChange}
                className="w-1/2 border px-3 py-2 rounded"
                placeholder="Discount value"
              />
            </div>
          </>
        )}

        {/* Stock - Only show if no variants */}
        {!hasVariants && (
          <input
            type="number"
            name="stock"
            value={form.stock}
            onChange={handleChange}
            placeholder="Stock Quantity"
            className="w-full border px-3 py-2 rounded"
            required
          />
        )}

        {/* Tags */}
        <input
          type="text"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border px-3 py-2 rounded"
        />

        {/* Featured / Bestseller / NewArrival */}
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

        <button
          disabled={isLoading || isUploading}
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded disabled:opacity-50"
        >
          {isLoading
            ? 'Adding...'
            : isUploading
              ? 'Uploading images...'
              : 'Add Product'}
        </button>
      </form>
    </div>
  );
}