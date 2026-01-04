'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useUpdateProduct } from '@/hooks/useProducts';
import { useRouter, useParams } from 'next/navigation';
import { useSelector } from 'react-redux';

export default function UpdateProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const { mutate, isPending } = useUpdateProduct();

  const { products } = useSelector(
    (state) => state.product || { products: [] }
  );

  const product = products?.find((item) => item._id === id);

  const [form, setForm] = useState({
    name: '',
    description: '',
    category: 'electronics',
    brand: '',
    price: '',
    discount: '',
    stock: '',
    sku: '',
    images: [],
    tags: '',
    type: 'regular',
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (product) {
      setForm({
        ...product,
        tags: product.tags?.join(',') || '',
      });
      setLoading(false);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleUploadImages = async (e) => {
    const files = e.target.files;
    if (!files.length) return;

    toast.loading('Uploading images...', { id: 'upload' });

    const uploaded = [];
    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
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
    setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
  };

  const handleRemoveImage = (index) => {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      
    }));
    toast.success('Image removed');
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();

    mutate({
      id,
      data: {
        ...form,
        price: Number(form.price),
        discount: Number(form.discount),
        stock: Number(form.stock),
        tags: form.tags.split(',').map((t) => t.trim()),
      },
    });
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow rounded mt-6">
      <div className="flex justify-between my-2">
        <h1 className="text-2xl font-bold mb-4">Update Product</h1>
        <Link
          href="/admin/products"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Product list
        </Link>
      </div>

      <form className="space-y-4" onSubmit={handleUpdateProduct}>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full border px-3 py-2 rounded"
          required
        />

        {/* Image Preview */}
        <div className="grid grid-cols-4 gap-3">
          {form.images.map((img, index) => (
            <div key={index} className="relative group">
              <img
                src={img}
                alt="product"
                className="w-full h-28 object-cover rounded"
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(index)}
                className="absolute top-1 right-1 bg-red-600 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

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
          <input
            type="number"
            name="discount"
            value={form.discount}
            onChange={handleChange}
            placeholder="Discount %"
            className="w-1/2 border px-3 py-2 rounded"
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

        <select
          name="type"
          value={form.type}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, type: e.target.value }))
          }
          className="w-full border px-3 py-2 rounded"
        >
          <option value="">Select type</option>
          <option value="regular">Regular</option>
          <option value="featured">Featured</option>
          <option value="new">New</option>
          <option value="best-selling">Best Selling</option>
        </select>

        <button
          type="submit"
          disabled={isPending}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          {isPending ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
}
