'use client';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  X,
  Plus,
  Trash2,
  Wand2,
  Save,
  Loader2,
  Calendar,
  Package,
  Image as ImageIcon,
  Tag,
  CheckCircle,
  Image,
  Upload,
  Eye,
} from 'lucide-react';
import { setModal, UI_MODAL_TYPE } from '@/store/slices/uiSlice';
import { useAddCombo } from '../../hooks/useCombo';
import toast from 'react-hot-toast';
import { ICombo, IComboProduct, ProductType } from '@/types/combo';

interface CloudinaryUploadResult {
  url: string;
  publicId: string;
}

interface Product {
  _id: string;
  name: string;
  price?: number;
  regularPrice?: number;
  images?: string[];
  variants?: Array<{
    price?: number;
    regularPrice?: number;
    images?: string[];
  }>;
  isActive?: boolean;
}

interface RootState {
  product: {
    products: Product[];
  };
}

interface ComboFormProps {
  selectedCombo?: ICombo | null;
  activeModal?: string;
}

interface FormData {
  name: string;
  description: string;
  slug: string;
  products: IComboProduct[];
  comboPrice: number;
  regularPrice: number;
  discountPercent: number;
  discountAmount: number;
  featureImg: string;
  galleryImages: string[];
  isActive: boolean;
  keywords: string[];
  type: ProductType;
  stock: number;
  freeDelivery: boolean;
  brand?: string;
  category?: string;
  metaTitle?: string;
  metaDescription?: string;
  sku?: string;
}

// Cloudinary upload function
const uploadToCloudinary = async (file: File): Promise<CloudinaryUploadResult> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '');
  formData.append('folder', 'combos');

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

export const ComboForm: React.FC<ComboFormProps> = ({ selectedCombo, activeModal }) => {
  const { mutate, isPending } = useAddCombo();
  const { products: productsData } = useSelector((state: RootState) => state.product);

  // File refs
  const featuredImageRef = useRef<HTMLInputElement>(null);
  const galleryImagesRef = useRef<HTMLInputElement>(null);

  // Upload states
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // Initial form state
  const initialFormData: FormData = {
    name: '',
    description: '',
    slug: '',
    products: [],
    comboPrice: 0,
    regularPrice: 0,
    discountPercent: 0,
    discountAmount: 0,
    featureImg: '',
    galleryImages: [],
    isActive: true,
    keywords: [],
    type: 'regular',
    stock: 0,
    freeDelivery: false,
  };

  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Initialize form with selected combo data
  useEffect(() => {
    if (selectedCombo && activeModal === UI_MODAL_TYPE.EDIT) {
      setFormData({
        name: selectedCombo.name,
        description: selectedCombo.description || '',
        slug: selectedCombo.slug,
        products: selectedCombo.products,
        comboPrice: selectedCombo.comboPrice,
        regularPrice: selectedCombo.regularPrice,
        discountPercent: selectedCombo.discountPercent,
        discountAmount: selectedCombo.discountAmount,
        featureImg: selectedCombo.featureImg || '',
        galleryImages: selectedCombo.galleryImages,
        isActive: selectedCombo.isActive,
        keywords: selectedCombo.keywords,
        type: selectedCombo.type,
        stock: selectedCombo.stock,
        freeDelivery: selectedCombo.freeDelivery,
        brand: selectedCombo.brand as string | undefined,
        category: selectedCombo.category as string | undefined,
        metaTitle: selectedCombo.metaTitle,
        metaDescription: selectedCombo.metaDescription,
        sku: selectedCombo.sku,
      });
    } else {
      setFormData(initialFormData);
    }
  }, [selectedCombo, activeModal]);

  // Calculate regular price from products
  const totalRegular = useMemo(() => {
    return formData.products.reduce((acc, p) => acc + p.price * p.quantity, 0);
  }, [formData.products]);

  // Update discount calculations
  useEffect(() => {
    const totalReg = parseFloat(totalRegular.toString()) || 0;
    const comboPrice = parseFloat(formData.comboPrice.toString()) || 0;

    // Ensure combo price doesn't exceed total regular price
    const safeComboPrice = Math.min(comboPrice, totalReg);

    // Calculate discount amount
    let discountAmount = 0;
    let discountPercent = 0;

    if (totalReg > 0 && safeComboPrice >= 0) {
      discountAmount = totalReg - safeComboPrice;
      discountPercent = (discountAmount / totalReg) * 100;
    }

    // Ensure non-negative values
    discountAmount = Math.max(0, discountAmount);
    discountPercent = Math.max(0, discountPercent);

    // Update form data only if values changed
    if (
      formData.regularPrice !== totalReg ||
      formData.discountAmount !== discountAmount ||
      formData.discountPercent !== discountPercent
    ) {
      setFormData((prev) => ({
        ...prev,
        regularPrice: parseFloat(totalReg.toFixed(2)),
        discountAmount: parseFloat(discountAmount.toFixed(2)),
        discountPercent: parseFloat(discountPercent.toFixed(2)),
        comboPrice: parseFloat(safeComboPrice.toFixed(2)),
      }));
    }
  }, [totalRegular, formData.comboPrice]);

  // Get product price based on product structure
  const getProductPrice = (product: Product): number => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].regularPrice || product.variants[0].price || 0;
    }
    return product.regularPrice || product.price || 0;
  };

  const handleAddProduct = (product: Product) => {
    if (formData.products.find((item) => item.productId === product._id)) return;

    const price = getProductPrice(product);
    const image = product.images?.[0] || product.variants?.[0]?.images?.[0] || '';

    const newComboProduct: IComboProduct = {
      productId: product._id,
      name: product.name,
      price: price,
      quantity: 1,
      image: image,
    };

    setFormData((prev) => ({
      ...prev,
      products: [...prev.products, newComboProduct],
    }));
  };

  const updateQuantity = (id: string, q: number) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.map((p) =>
        p.productId === id ? { ...p, quantity: Math.max(1, q) } : p
      ),
    }));
  };

  const removeProduct = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      products: prev.products.filter((p) => p.productId !== id),
    }));
  };

  const handleAiGenerate = async () => {
    if (!formData.name || formData.products.length === 0) {
      alert('Please enter a name and add products first.');
      return;
    }
    setIsAiGenerating(true);
    try {
      // Simulate AI generation - replace with actual API call
      const text = await new Promise<string>((resolve) =>
        setTimeout(
          () =>
            resolve(
              `Amazing bundle of ${formData.products.length} premium products! Save ${formData.discountPercent}% today.`
            ),
          1000
        )
      );
      setFormData((prev) => ({ ...prev, description: text }));
    } catch (error) {
      console.error('AI generation failed:', error);
    }
    setIsAiGenerating(false);
  };

  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      if (!formData.keywords.includes(newTag.trim())) {
        setFormData((prev) => ({
          ...prev,
          keywords: [...prev.keywords, newTag.trim()],
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      keywords: prev.keywords.filter((t) => t !== tag),
    }));
  };

  // Handle featured image upload
  const handleFeaturedImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file (JPG, PNG, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    setUploadingFeatured(true);

    try {
      const result = await uploadToCloudinary(file);
      setFormData((prev) => ({
        ...prev,
        featureImg: result.url,
      }));
      toast.success('Featured image uploaded successfully!');
    } catch (error) {
      console.error('Featured image upload failed:', error);
      toast.error('Failed to upload image. Please try again.');
    } finally {
      setUploadingFeatured(false);
    }
  };

  // Handle gallery images upload
  const handleGalleryImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    if (!files.length) return;

    // Validate files
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not an image file`);
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setUploadingGallery(true);
    const newGalleryImages = [...formData.galleryImages];

    // Limit to 6 images total
    const remainingSlots = 6 - newGalleryImages.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length < validFiles.length) {
      toast.error(`Only ${remainingSlots} more images can be added (max 6 total)`);
    }

    for (const file of filesToUpload) {
      try {
        const result = await uploadToCloudinary(file);
        newGalleryImages.push(result.url);
      } catch (error) {
        console.error('Failed to upload gallery image:', error);
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setFormData((prev) => ({
      ...prev,
      galleryImages: newGalleryImages,
    }));

    if (filesToUpload.length > 0) {
      toast.success(`Added ${filesToUpload.length} image(s) to gallery`);
    }

    setUploadingGallery(false);

    // Reset file input
    if (galleryImagesRef.current) {
      galleryImagesRef.current.value = '';
    }
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    if (!window.confirm('Remove featured image?')) return;
    setFormData((prev) => ({
      ...prev,
      featureImg: '',
    }));
    toast.success('Featured image removed');
  };

  // Remove gallery image
  const removeGalleryImage = (index: number) => {
    if (!window.confirm('Remove this image from gallery?')) return;
    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    toast.success('Image removed from gallery');
  };

  const handleSubmit = () => {
    if (formData.products.length === 0) {
      toast.error('Please add at least one product to the combo.');
      return;
    }
    if (!formData.name.trim()) {
      toast.error('Please enter a name for the combo.');
      return;
    }
    if (!formData.featureImg) {
      toast.error('Please upload a featured image.');
      return;
    }

    mutate(formData, {
      onSuccess: () => {
        setFormData(initialFormData);
        toast.success('Combo added successfully');
      },
      onError: (error) => {
        console.error('Error adding combo:', error);
        toast.error('Failed to add combo');
      },
    });
  };

  // Image Preview Modal
  const ImagePreviewModal: React.FC<{ imageUrl: string; onClose: () => void }> = ({
    imageUrl,
    onClose,
  }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Image Preview</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4">
          <img
            src={imageUrl}
            alt="Preview"
            className="w-full h-auto rounded-lg max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10 max-h-[70vh] overflow-y-auto">
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Base Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Bundle Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: e.target.value.toLowerCase().replace(/ /g, '-'),
                    })
                  }
                  placeholder="e.g., Breakfast Essentials Pack"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Image className="w-4 h-4" /> Featured Image *
                </label>
                <div className="space-y-2">
                  {formData.featureImg ? (
                    <div className="relative group">
                      <div className="h-40 rounded-xl overflow-hidden border-2 border-slate-200">
                        <img
                          src={formData.featureImg}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                        <button
                          onClick={() => setPreviewImage(formData.featureImg)}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={() => featuredImageRef.current?.click()}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Change"
                        >
                          <Upload className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          onClick={removeFeaturedImage}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Remove"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50">
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">No featured image</p>
                    </div>
                  )}

                  <input
                    ref={featuredImageRef}
                    type="file"
                    onChange={handleFeaturedImage}
                    accept="image/*"
                    className="hidden"
                  />

                  <button
                    type="button"
                    onClick={() => featuredImageRef.current?.click()}
                    disabled={uploadingFeatured}
                    className="w-full py-2.5 border border-slate-200 rounded-lg text-slate-700 hover:border-emerald-400 hover:text-emerald-700 font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                  >
                    {uploadingFeatured ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        {formData.featureImg ? 'Change Image' : 'Upload Featured Image'}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-slate-500">
                    Recommended: 1200×800px, JPG/PNG, max 5MB
                  </p>
                </div>
              </div>

              {/* Gallery Images */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Image className="w-4 h-4" /> Gallery Images
                </label>
                <div className="space-y-2">
                  {/* Gallery Preview Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {formData.galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={image}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-lg">
                          <button
                            onClick={() => setPreviewImage(image)}
                            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            title="Preview"
                          >
                            <Eye className="w-3 h-3 text-slate-700" />
                          </button>
                          <button
                            onClick={() => removeGalleryImage(index)}
                            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            title="Remove"
                          >
                            <Trash2 className="w-3 h-3 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}

                    {formData.galleryImages.length < 6 && (
                      <button
                        type="button"
                        onClick={() => galleryImagesRef.current?.click()}
                        disabled={uploadingGallery}
                        className="aspect-square rounded-lg border-2 border-dashed border-slate-300 hover:border-emerald-400 flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-emerald-600 transition-all disabled:opacity-50"
                      >
                        {uploadingGallery ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Plus className="w-5 h-5" />
                            <span className="text-xs font-medium">Add</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  <input
                    ref={galleryImagesRef}
                    type="file"
                    onChange={handleGalleryImages}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />

                  <p className="text-xs text-slate-500">
                    Add up to 6 images (Optional). JPG/PNG, max 5MB each
                  </p>
                </div>
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-sm font-semibold text-slate-700">
                    Description
                  </label>
                  <button
                    onClick={handleAiGenerate}
                    disabled={isAiGenerating}
                    type="button"
                    className="text-xs font-bold text-white bg-emerald-600 px-3 py-1 rounded-full flex items-center gap-1.5 hover:bg-emerald-700 disabled:opacity-50 transition-all shadow-sm"
                  >
                    {isAiGenerating ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      <Wand2 className="w-3 h-3" />
                    )}
                    Generate with AI
                  </button>
                </div>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none resize-none transition-all"
                  placeholder="Write a compelling story for your bundle..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl min-h-[46px] bg-slate-50">
                  {formData.keywords.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white border text-slate-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 group"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-slate-300 group-hover:text-red-500"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  <input
                    type="text"
                    value={newTag}
                    onKeyDown={addTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add tag..."
                    className="bg-transparent outline-none text-xs font-medium flex-1 px-1 min-w-[80px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) =>
                    setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
              Bundle Items ({formData.products.length})
              <span className="text-[10px] font-normal lowercase italic text-slate-400">
                Total items impact total price
              </span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {formData.products.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <Package className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-medium">
                    Search and select items from the sidebar
                  </p>
                </div>
              ) : (
                formData.products.map((p) => (
                  <div
                    key={p.productId}
                    className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-200 transition-colors"
                  >
                    <div className="relative group">
                      <img
                        src={p.image}
                        className="w-14 h-14 rounded-xl object-cover ring-2 ring-slate-100"
                      />
                      <div className="absolute inset-0 bg-black/40 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <ImageIcon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-800 truncate">{p.name}</p>
                      <p className="text-xs text-emerald-600 font-semibold">৳{p.price}</p>
                    </div>
                    <div className="flex items-center bg-slate-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(p.productId as string, p.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold text-slate-600"
                      >
                        -
                      </button>
                      <span className="px-4 text-sm font-black text-slate-800">
                        {p.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(p.productId as string, p.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center hover:bg-white rounded-lg transition-colors font-bold text-slate-600"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeProduct(p.productId as string)}
                      className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          <section className="bg-emerald-950 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-emerald-800 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

            <div className="relative z-10 space-y-6">
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-400">
                Pricing Strategy
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-end border-b border-white/10 pb-4">
                  <span className="text-sm text-emerald-100/60 font-medium">
                    Regular Total
                  </span>
                  <span className="text-lg font-bold line-through text-emerald-100/40">
                    ৳{totalRegular}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-400">OFFER PRICE</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={formData.comboPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          comboPrice: Number(e.target.value),
                        })
                      }
                      className="w-full bg-emerald-900 border border-emerald-800 rounded-2xl pl-10 pr-4 py-4 text-2xl font-black text-white focus:ring-2 focus:ring-emerald-400 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="bg-emerald-900/50 p-3 rounded-2xl border border-white/5 text-center">
                    <p className="text-[10px] text-emerald-300 font-bold uppercase mb-1">
                      Savings
                    </p>
                    <p className="text-lg font-black">৳{formData.discountAmount}</p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-2xl text-center shadow-lg shadow-orange-950/20">
                    <p className="text-[10px] text-white font-bold uppercase mb-1">Discount</p>
                    <p className="text-lg font-black">{formData.discountPercent}%</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Inventory List
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {productsData?.length || 0} items
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
              {productsData?.map((product) => {
                const isAdded = formData.products.some(
                  (item) => item.productId === product._id
                );
                const price = getProductPrice(product);

                return (
                  <button
                    key={product._id}
                    onClick={() => handleAddProduct(product)}
                    disabled={isAdded}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all group ${
                      isAdded
                        ? 'opacity-50 cursor-not-allowed bg-slate-50'
                        : 'hover:bg-emerald-50 hover:shadow-sm active:scale-[0.98]'
                    }`}
                  >
                    <img
                      src={
                        product.images?.[0] || product.variants?.[0]?.images?.[0] || ''
                      }
                      className="w-11 h-11 rounded-xl object-cover shadow-sm group-hover:rotate-3 transition-transform"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-black text-slate-800 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">৳{price}</p>
                    </div>
                    <div
                      className={`p-1.5 rounded-lg transition-colors ${
                        isAdded
                          ? 'bg-slate-200 text-slate-400'
                          : 'bg-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
                      }`}
                    >
                      {isAdded ? (
                        <CheckCircle className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>
        </div>
      </div>

      <div className="p-6 border-t flex items-center justify-between bg-slate-50/50 rounded-b-2xl">
        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div className="relative">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) =>
                  setFormData({ ...formData, isActive: e.target.checked })
                }
                className="peer sr-only"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
            </div>
            <span className="text-sm font-bold text-slate-700">Publish Offer</span>
          </label>
          <div className="h-6 w-px bg-slate-200"></div>
          <p className="text-xs text-slate-400 font-medium">
            Auto-calculated:{' '}
            <span className="text-slate-600 font-bold">
              Total Savings ৳{formData.discountAmount}
            </span>
          </p>
        </div>

        <div>
          <button
            onClick={handleSubmit}
            disabled={isPending || uploadingFeatured || uploadingGallery}
            className="px-10 py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:shadow-none"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            Create Combo
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />
      )}
    </>
  );
};