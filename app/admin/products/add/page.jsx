'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { useAddProduct } from '@/hooks/useProducts';
import { useSelector } from 'react-redux';
import RichTextEditor from '@/components/TinyMCEEditor';
import { colors } from '@/constants/colors';
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
    variants: [],
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

  const [selectedColor, setSelectedColor] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const hasVariants = form.variants?.length > 0;

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

  // const handleUploadImages = async (e) => {
  //   const files = e.target.files;
  //   if (!files || !files.length) return;

  //   setIsUploading(true);
  //   toast.loading('Uploading images...');
  //   const uploaded = [];

  //   for (const file of files) {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append(
  //       'upload_preset',
  //       process.env.NEXT_PUBLIC_CLOUDINARY_PRESET
  //     );

  //     try {
  //       const res = await fetch(
  //         `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
  //         { method: 'POST', body: formData }
  //       );

  //       const data = await res.json();
  //       uploaded.push(data.secure_url);
  //     } catch (error) {
  //       console.error('Upload error:', error);
  //       toast.error(`Failed to upload ${file.name}`);
  //     }
  //   }

  //   toast.dismiss();
  //   if (uploaded.length > 0) {
  //     toast.success('Images uploaded!');
  //     setForm((prev) => ({ ...prev, images: [...prev.images, ...uploaded] }));
  //   }
  //   setIsUploading(false);
  // };

  const removeImage = (field, index = null) => {
    setForm((prev) => ({
      ...prev,
      [field]:
        index === null
          ? '' // single image
          : prev[field].filter((_, i) => i !== index), // multiple
    }));
  };

  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...prev.variants,
        {
          size: '',
          color: '',
          price: '',
          stock: '',
          discount: { type: '', value: '' },
          salePrice: 0,
          images: [],
        },
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
        newVariants[index].salePrice = Math.max(
          0,
          price - (price * discountValue) / 100
        );
      } else if (newVariants[index].discount.type === 'fixed') {
        newVariants[index].salePrice = Math.max(0, price - discountValue);
      } else {
        newVariants[index].salePrice = price;
      }
    }

    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const updateVariantDiscount = (index, field, value) => {
    const newVariants = [...form.variants];
    newVariants[index].discount[field] = value;

    const price = Number(newVariants[index].price || 0);
    const discountValue = Number(newVariants[index].discount.value || 0);

    if (field === 'value' || field === 'type') {
      if (newVariants[index].discount.type === 'percentage') {
        newVariants[index].salePrice = Math.max(
          0,
          price - (price * discountValue) / 100
        );
      } else if (newVariants[index].discount.type === 'fixed') {
        newVariants[index].salePrice = Math.max(0, price - discountValue);
      } else {
        newVariants[index].salePrice = price;
      }
    }

    setForm((prev) => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index) => {
    const newVariants = [...form.variants];
    newVariants.splice(index, 1);
    setForm((prev) => ({ ...prev, variants: newVariants }));
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

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: 'POST', body: formData }
        );

        const data = await res.json();
        uploaded.push(data.secure_url);
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    toast.dismiss();
    if (uploaded.length > 0) {
      toast.success('Variant images uploaded');
      const newVariants = [...form.variants];
      newVariants[index].images = [
        ...(newVariants[index].images || []),
        ...uploaded,
      ];
      setForm((prev) => ({ ...prev, variants: newVariants }));
    }

    setIsUploading(false);
  };

  const removeVariantImage = (variantIndex, imageIndex) => {
    const newVariants = [...form.variants];
    newVariants[variantIndex].images.splice(imageIndex, 1);
    setForm((prev) => ({ ...prev, variants: newVariants }));
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

    // If no variants, check for regular price
    if (
      !hasVariants &&
      (!form.regularPrice || Number(form.regularPrice) <= 0)
    ) {
      toast.error('Regular price is required when there are no variants');
      return;
    }

    const hasDiscount = form.discount.type && Number(form.discount.value) > 0;

    const variants = form.variants.map((v) => ({
      size: v.size,
      color: v.color,
      price: Number(v.price),
      stock: Number(v.stock || 0),
      salePrice: Number(v.salePrice),
      images: v.images || [],
      ...(v.discount?.value && {
        discount: {
          type: v.discount.type,
          value: Number(v.discount.value),
        },
      }),
    }));

    const productData = {
      name: form.name.trim(),
      description: form.description,
      category: form.category,
      brand: form.brand,
      stock: hasVariants ? 0 : Number(form.stock || 0), // Stock is sum of variants if variants exist
      images: form.images,
      tags: form.tags
        ? form.tags
            .split(',')
            .map((t) => t.trim())
            .filter((t) => t)
        : [],
      featured: form.featured,
      bestseller: form.bestseller,
      newArrival: form.newArrival,
      ...(hasDiscount && {
        discount: {
          type: form.discount.type,
          value: Number(form.discount.value),
        },
      }),
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
      },
    });
  };

  console.log(form);

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

        {/*  Images */}
        <div className="flex ">
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
            />

            {form.featureImg && (
              <div className="relative w-24 mt-2">
                <img
                  src={form.featureImg}
                  className="w-24 h-24 object-cover rounded"
                />
                <button onClick={() => removeImage('featureImg')}>✕</button>
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
            />

            <div className="flex gap-2 flex-wrap mt-2">
              {form.galleryImages?.map((img, index) => (
                <div key={index} className="relative">
                  <img src={img} className="w-16 h-16 object-cover rounded" />
                  <button onClick={() => removeImage('galleryImages', index)}>
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Brand</label>

            <select
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full border px-3 py-2 rounded"
              required
            >
              <option value="">Select Brand</option>
              {brands &&
                brands?.map((brand, index) => (
                  <option key={index} value={brand._id}>
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
            {levelOneSubs.length > 0 && (
              <select
                value={form.subCategory}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    subCategory: e.target.value,
                    childCategory: '',
                  }))
                }
                className="w-full border px-3 py-2 rounded mt-3"
                required
              >
                <option value="">Select Sub Category</option>
                {levelOneSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
            {levelTwoSubs.length > 0 && (
              <select
                value={form.childCategory}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    childCategory: e.target.value,
                  }))
                }
                className="w-full border px-3 py-2 rounded mt-3"
              >
                <option value="">Select Child Category</option>
                {levelTwoSubs.map((sub) => (
                  <option key={sub._id} value={sub._id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        {/* Variants Section */}
        <div className="border-t pt-4">
          <h2 className="text-lg font-semibold mb-2">Variants (Optional)</h2>
          <p className="text-sm text-gray-600 mb-4">
            Add variants if your product comes in different sizes/colors. If no
            variants, use the main price and stock fields below.
          </p>

          {form.variants?.map((variant, index) => (
            <div key={index} className="border p-4 rounded mb-4 space-y-3">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">Variant #{index + 1}</h3>
                <button
                  type="button"
                  onClick={() => removeVariant(index)}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm"
                >
                  Remove
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Size
                  </label>
                  <input
                    type="text"
                    value={variant.size}
                    onChange={(e) =>
                      updateVariant(index, 'size', e.target.value)
                    }
                    placeholder="e.g., M, L, XL"
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Color
                  </label>
                  <select
                    value={variant.color}
                    onChange={(e) =>
                      updateVariant(index, 'color', e.target.value)
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">Select Color</option>
                    {colors.map((c) => (
                      <option key={c.value} value={c.value}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Price *
                  </label>
                  <input
                    type="number"
                    value={variant.price}
                    onChange={(e) =>
                      updateVariant(index, 'price', e.target.value)
                    }
                    placeholder="Price"
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Stock *
                  </label>
                  <input
                    type="number"
                    value={variant.stock}
                    onChange={(e) =>
                      updateVariant(index, 'stock', e.target.value)
                    }
                    placeholder="Stock"
                    className="w-full border px-2 py-1 rounded"
                    required
                  />
                </div>
              </div>

              {/* Discount & Sale Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={variant.discount.type}
                    onChange={(e) =>
                      updateVariantDiscount(index, 'type', e.target.value)
                    }
                    className="w-full border px-2 py-1 rounded"
                  >
                    <option value="">No Discount</option>
                    <option value="percentage">Percentage</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Discount Value
                  </label>
                  <input
                    type="number"
                    value={variant.discount.value}
                    onChange={(e) =>
                      updateVariantDiscount(index, 'value', e.target.value)
                    }
                    placeholder="0"
                    className="w-full border px-2 py-1 rounded"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Sale Price
                  </label>
                  <input
                    type="number"
                    value={variant.salePrice || 0}
                    readOnly
                    className="w-full border px-2 py-1 rounded bg-gray-100"
                  />
                </div>
              </div>

              {/* Variant Images */}
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Variant Images
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => uploadVariantImages(e.target.files, index)}
                  className="w-full border px-2 py-1 rounded"
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
                          className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addVariant}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            + Add Variant
          </button>
        </div>

        {/* Main Price & Discount - Only show if no variants */}
        {!hasVariants && (
          <>
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Pricing (when no variants)</h3>
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
                    placeholder="Regular Price"
                    className="w-full border px-3 py-2 rounded"
                    required={!hasVariants}
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
                    placeholder="Stock Quantity"
                    className="w-full border px-3 py-2 rounded"
                    required={!hasVariants}
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
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
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Discount Value
                </label>
                <input
                  name="discount.value"
                  value={form.discount.value}
                  onChange={handleChange}
                  className="w-full border px-3 py-2 rounded"
                  placeholder="0"
                />
              </div>
            </div>
          </>
        )}

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-1">Tags</label>
          <input
            type="text"
            name="tags"
            value={form.tags}
            onChange={handleChange}
            placeholder="Tags (comma separated)"
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        {/* Featured / Bestseller / NewArrival */}
        <div className="border-t pt-4">
          <h3 className="font-medium mb-3">Product Flags</h3>
          <div className="flex gap-6">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
                className="rounded"
              />
              <span>Featured</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="bestseller"
                checked={form.bestseller}
                onChange={handleChange}
                className="rounded"
              />
              <span>Bestseller</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="newArrival"
                checked={form.newArrival}
                onChange={handleChange}
                className="rounded"
              />
              <span>New Arrival</span>
            </label>
          </div>
        </div>

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
