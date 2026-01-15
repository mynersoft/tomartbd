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
import { useAddBogo } from '../../hooks/useBogo';
import toast from 'react-hot-toast';

// Cloudinary upload function
const uploadToCloudinary = async (file, folder = 'bogos') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append('folder', folder);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      throw new Error(`Upload failed: ${errorData}`);
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

const BogoForm = ({ selectedBogo, activeModal }) => {
  const { mutate, isPending } = useAddBogo();
  const { products: productsData = [] } = useSelector((state) => state.product);
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  // File refs
  const featuredImageRef = useRef(null);
  const galleryImagesRef = useRef(null);

  // Upload states
  const [uploadingFeatured, setUploadingFeatured] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [totalRegularPrice, setTotalRegularPrice] = useState(0);

  // Fixed initial form state matching model structure
  const initialFormData = {
    name: '',
    description: '',
    featuredImage: { url: '', publicId: '' },
    galleryImages: [],
    tags: [],
    mainItem: null,
    freeItem: null,
    buyQty: 1,
    getQty: 1,
    isSameProduct: false,
    discountPercentage: 0,
    discountAmount: 0,
    regularPrice: 0,
    salePrice: 0,
    startDate: '',
    endDate: '',
    isActive: true,
  };

  const [formData, setFormData] = useState(initialFormData);

  console.log(formData);

  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [newTag, setNewTag] = useState('');

  // Initialize form with selected bogo data
  useEffect(() => {
    if (selectedBogo && activeModal === UI_MODAL_TYPE.EDIT) {
      // Transform selectedBogo to match form structure
      const transformedData = {
        ...initialFormData,
        ...selectedBogo,
        featuredImage:
          typeof selectedBogo.featuredImage === 'string'
            ? { url: selectedBogo.featuredImage, publicId: '' }
            : selectedBogo.featuredImage || { url: '', publicId: '' },
        galleryImages: Array.isArray(selectedBogo.galleryImages)
          ? selectedBogo.galleryImages.map((img) =>
              typeof img === 'string' ? { url: img, publicId: '' } : img
            )
          : [],
        tags: Array.isArray(selectedBogo.tags) ? selectedBogo.tags : [],
        startDate: selectedBogo.startDate
          ? new Date(selectedBogo.startDate).toISOString().split('T')[0]
          : '',
        endDate: selectedBogo.endDate
          ? new Date(selectedBogo.endDate).toISOString().split('T')[0]
          : '',
      };

      setFormData(transformedData);
    } else {
      setFormData(initialFormData);
    }
  }, [selectedBogo, activeModal]);

  // get total price

  // Calculate sale price based on discount
  const calculateSalePrice = useMemo(() => {
    if (!formData.mainItem || !formData.freeItem) return 0;

    const mainPrice = formData.mainItem.price || 0;
    const freePrice = formData.freeItem.price || 0;

    const totalPrice = mainPrice + freePrice;
    setTotalRegularPrice(totalPrice);

    let offerPrice = formData.regularPrice - totalPrice;

    setFormData((prev) => ({
      ...prev,
      discountAmount: offerPrice,
    }));

    // if (formData.isSameProduct) {
    //   // Buy X Get Y logic
    //   const buyQty = formData.buyQty || 1;
    //   const getQty = formData.getQty || 1;
    //   const totalQty = buyQty + getQty;

    //   if (formData.discountPercentage > 0) {
    //     const discount =
    //       (mainPrice * buyQty * formData.discountPercentage) / 100;
    //     return mainPrice * buyQty - discount;
    //   } else if (formData.discountAmount > 0) {
    //     return mainPrice * buyQty - formData.discountAmount;
    //   } else {
    //     return mainPrice * buyQty; // Pay only for buy items
    //   }
    // } else {
    //   // Regular BOGO: Pay for main item, get free item free
    //   if (formData.discountPercentage > 0) {
    //     const discount = (mainPrice * formData.discountPercentage) / 100;
    //     return mainPrice - discount;
    //   } else if (formData.discountAmount > 0) {
    //     return mainPrice - formData.discountAmount;
    //   } else {
    //     return mainPrice; // Pay only for main item
    //   }
    // }
  }, [formData]);

  // Get product price
  const getProductPrice = (product) => {
    if (!product) return 0;

    if (product.variants && product.variants.length > 0) {
      return product.variants[0].regularPrice || product.variants[0].price || 0;
    }
    return product.regularPrice || product.price || 0;
  };

  const [bogoItems, setBogoItems] = useState({
    mainItem: '',
    freeItem: '',
  });

  // Handle selecting main item
const handleSelectMainItem = (product) => {
  if (!product) return;

  const price = getProductPrice(product);
  const image = product.images?.[0] || product.variants?.[0]?.images?.[0] || '';

  // Check if mainItem already exists in formData
  if (formData.mainItem) {
    // If mainItem exists, set as freeItem
    setBogoItems((prev) => ({
      ...prev,
      freeItem: {
        _id: product._id,
        name: product.name,
        price: price,
        image: image,
      },
    }));

    setFormData((prev) => ({
      ...prev,
      freeItem: product._id, // Store only ID in formData
    }));
  } else {
    // If mainItem doesn't exist, set as mainItem
    setBogoItems((prev) => ({
      ...prev,
      mainItem: {
        _id: product._id,
        name: product.name,
        price: price,
        image: image,
      },
    }));

    setFormData((prev) => ({
      ...prev,
      mainItem: product._id, // Store only ID in formData
    }));
  }
};

  // Handle selecting main item
  const handleSelectFreeItem = (product) => {
    if (!product) return;
    const price = getProductPrice(product);
    const image =
      product.images?.[0] || product.variants?.[0]?.images?.[0] || '';

    setBogoItems((prev) => ({
      ...prev,
      freeItem: {
        _id: product._id,
        name: product.name,
        price: price,
        image: image,
      },
    }));
  };

  const handleAiGenerate = async () => {
    if (!formData.name) {
      toast.error('Please enter a name first.');
      return;
    }

    setIsAiGenerating(true);
    try {
      const description = `Get amazing value with this BOGO offer! ${formData.name}. Limited time offer - don't miss out!`;
      setFormData((prev) => ({ ...prev, description }));
      toast.success('Description generated!');
    } catch (error) {
      console.error('AI generation failed:', error);
      toast.error('Failed to generate description');
    } finally {
      setIsAiGenerating(false);
    }
  };

  const addTag = (e) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault();
      const tag = newTag.trim();
      if (!formData.tags.includes(tag)) {
        setFormData((prev) => ({
          ...prev,
          tags: [...prev.tags, tag],
        }));
      }
      setNewTag('');
    }
  };

  const removeTag = (tag) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }));
  };

  // Handle featured image upload
  const handleFeaturedImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
        featuredImage: {
          url: result.url,
          publicId: result.publicId,
        },
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
  const handleGalleryImages = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

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

    const remainingSlots = 6 - newGalleryImages.length;
    const filesToUpload = validFiles.slice(0, remainingSlots);

    if (filesToUpload.length < validFiles.length) {
      toast.error(
        `Only ${remainingSlots} more images can be added (max 6 total)`
      );
    }

    for (const file of filesToUpload) {
      try {
        const result = await uploadToCloudinary(file);
        newGalleryImages.push({
          url: result.url,
          publicId: result.publicId,
        });
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

    if (galleryImagesRef.current) {
      galleryImagesRef.current.value = '';
    }
  };

  // Remove featured image
  const removeFeaturedImage = () => {
    if (!window.confirm('Remove featured image?')) return;

    setFormData((prev) => ({
      ...prev,
      featuredImage: { url: '', publicId: '' },
    }));
    toast.success('Featured image removed');
  };

  // Remove gallery image
  const removeGalleryImage = (index) => {
    if (!window.confirm('Remove this image from gallery?')) return;

    setFormData((prev) => ({
      ...prev,
      galleryImages: prev.galleryImages.filter((_, i) => i !== index),
    }));
    toast.success('Image removed from gallery');
  };

  const handleSubmit = () => {
    // Validation
    if (!formData.name.trim()) {
      toast.error('Please enter a name for the BOGO.');
      return;
    }

    if (!formData.description.trim()) {
      toast.error('Please enter a description.');
      return;
    }

    // if (!formData.featuredImage.url) {
    //   toast.error('Please upload a featured image.');
    //   return;
    // }

    if (!formData.mainItem) {
      toast.error('Please select a main item.');
      return;
    }

    if (!formData.freeItem) {
      toast.error('Please select a free item.');
      return;
    }

    // Prepare data for submission
    const submitData = {
      name: formData.name,
      description: formData.description,
      featuredImage: formData.featuredImage,
      galleryImages: formData.galleryImages,
      tags: formData.tags,
      mainItem: formData.mainItem._id,
      freeItem: formData.freeItem._id,
      buyQty: formData.buyQty,
      getQty: formData.getQty,
      isSameProduct: formData.isSameProduct,
      discountPercentage: formData.discountPercentage,
      discountAmount: formData.discountAmount,
      regularPrice:
        (formData.mainItem.price || 0) + (formData.freeItem.price || 0),
      salePrice: calculateSalePrice,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      isActive: formData.isActive,
    };

    mutate(submitData, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bogos'] });
        setFormData(initialFormData);
        toast.success(
          activeModal === UI_MODAL_TYPE.EDIT
            ? 'BOGO updated successfully'
            : 'BOGO created successfully'
        );
        dispatch(setModal({ type: UI_MODAL_TYPE.NONE }));
      },
      onError: (error) => {
        console.error('Error saving BOGO:', error);
        toast.error(`Failed to save BOGO: ${error.message || 'Unknown error'}`);
      },
    });
  };

  // Image Preview Modal
  const ImagePreviewModal = ({ imageUrl, onClose }) => (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Image Preview</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
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
                  BOGO Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  placeholder="e.g., Buy 1 Get 1 Free - Summer Special"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Image className="w-4 h-4" /> Featured Image *
                </label>
                <div className="space-y-2">
                  {formData.featuredImage.url ? (
                    <div className="relative group">
                      <div className="h-40 rounded-xl overflow-hidden border-2 border-slate-200">
                        <img
                          src={formData.featuredImage.url}
                          alt="Featured"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-xl">
                        <button
                          onClick={() =>
                            setPreviewImage(formData.featuredImage.url)
                          }
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Preview"
                          type="button"
                        >
                          <Eye className="w-4 h-4 text-slate-700" />
                        </button>
                        <button
                          onClick={() => featuredImageRef.current?.click()}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Change"
                          type="button"
                        >
                          <Upload className="w-4 h-4 text-emerald-600" />
                        </button>
                        <button
                          onClick={removeFeaturedImage}
                          className="p-2 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                          title="Remove"
                          type="button"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-40 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center bg-slate-50">
                      <ImageIcon className="w-8 h-8 text-slate-400 mb-2" />
                      <p className="text-sm text-slate-500">
                        No featured image
                      </p>
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
                        {formData.featuredImage.url
                          ? 'Change Image'
                          : 'Upload Featured Image'}
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
                  <div className="grid grid-cols-3 gap-2">
                    {formData.galleryImages.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden border border-slate-200">
                          <img
                            src={image.url}
                            alt={`Gallery ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1 rounded-lg">
                          <button
                            onClick={() => setPreviewImage(image.url)}
                            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            title="Preview"
                            type="button"
                          >
                            <Eye className="w-3 h-3 text-slate-700" />
                          </button>
                          <button
                            onClick={() => removeGalleryImage(index)}
                            className="p-1.5 bg-white/90 backdrop-blur-sm rounded-full hover:scale-110 transition-transform"
                            title="Remove"
                            type="button"
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
                    Description *
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
                  placeholder="Describe this BOGO offer..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Tag className="w-4 h-4" /> Tags
                </label>
                <div className="flex flex-wrap gap-2 p-2 border border-slate-200 rounded-xl min-h-[46px] bg-slate-50">
                  {formData.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-white border text-slate-700 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 group"
                    >
                      {tag}
                      <button
                        onClick={() => removeTag(tag)}
                        className="text-slate-300 group-hover:text-red-500"
                        type="button"
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
                    placeholder="Add tag and press Enter..."
                    className="bg-transparent outline-none text-xs font-medium flex-1 px-1 min-w-[80px]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) =>
                    setFormData({ ...formData, startDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) =>
                    setFormData({ ...formData, endDate: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* Product Selection Section */}
          <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Product Selection
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Main Item */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Buy Item (Main Product) *
                </label>
                {formData.mainItem ? (
                  <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                    <img
                      src={formData.mainItem.image}
                      alt={formData.mainItem.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">
                        {formData.mainItem.name}
                      </p>
                      <p className="text-xs text-emerald-600 font-semibold">
                        ৳{formData.mainItem.price}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, mainItem: null }))
                      }
                      className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Select buy item from list
                    </p>
                  </div>
                )}
              </div>

              {/* Free Item */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100">
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  Get Item (Free Product) *
                </label>
                {formData.freeItem ? (
                  <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl border border-blue-200">
                    <img
                      src={formData.freeItem.image}
                      alt={formData.freeItem.name}
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-800">
                        {formData.freeItem.name}
                      </p>
                      <p className="text-xs text-blue-600 font-semibold">
                        ৳{formData.freeItem.price}
                      </p>
                    </div>
                    <button
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, freeItem: null }))
                      }
                      className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      type="button"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-6 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
                    <Package className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-sm text-slate-500">
                      Select free item from list
                    </p>
                  </div>
                )}
              </div>
            </div>

            {formData.mainItem && formData.freeItem && (
              <div className="bg-slate-50 p-4 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-700">
                      BOGO Type:
                    </p>
                    <p className="text-xs text-slate-600">
                      {formData.isSameProduct
                        ? `Buy ${formData.buyQty} Get ${formData.getQty}`
                        : 'Buy 1 Get 1 (Different Products)'}
                    </p>
                  </div>
                  {formData.isSameProduct && (
                    <div className="flex items-center gap-4">
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">
                          Buy Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.buyQty}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              buyQty: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-20 px-3 py-1 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-600 block mb-1">
                          Get Qty
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={formData.getQty}
                          onChange={(e) =>
                            setFormData((prev) => ({
                              ...prev,
                              getQty: parseInt(e.target.value) || 1,
                            }))
                          }
                          className="w-20 px-3 py-1 border border-slate-300 rounded-lg text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 space-y-8">
          {/* Pricing Section */}
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
                    ৳{totalRegularPrice}
                  </span>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-emerald-400">
                    OFFER PRICE
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300 font-bold">
                      ৳
                    </span>
                    <input
                      type="number"
                      value={formData.regularPrice}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          regularPrice: Number(e.target.value),
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
                    <p className="text-lg font-black">
                      ৳{formData.discountAmount}
                    </p>
                  </div>
                  <div className="bg-orange-500 p-3 rounded-2xl text-center shadow-lg shadow-orange-950/20">
                    <p className="text-[10px] text-white font-bold uppercase mb-1">
                      Discount
                    </p>
                    <p className="text-lg font-black">
                      {formData.discountPercentage}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Product List */}
          <section className="bg-white border border-slate-200 rounded-3xl overflow-hidden flex flex-col h-[400px]">
            <div className="p-5 border-b bg-slate-50 flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Product List
              </h3>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {productsData?.length || 0} items
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {productsData?.map((product) => {
                const isMainItem = formData.mainItem?._id === product._id;
                const isFreeItem = formData.freeItem?._id === product._id;
                const price = getProductPrice(product);

                return (
                  <button
                    key={product._id}
                    onClick={() => {
                      if (!formData.mainItem) {
                        handleSelectMainItem(product);
                      } else if (!formData.freeItem) {
                        handleSelectFreeItem(product);
                      } else {
                        // Replace logic
                        const confirm = window.confirm(
                          isMainItem
                            ? 'Replace main item?'
                            : isFreeItem
                              ? 'Replace free item?'
                              : 'Select as which item?'
                        );
                        if (confirm) {
                          if (isMainItem) {
                            handleSelectMainItem(product);
                          } else if (isFreeItem) {
                            handleSelectFreeItem(product);
                          } else {
                            handleSelectMainItem(product);
                          }
                        }
                      }
                    }}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all group ${
                      isMainItem || isFreeItem
                        ? 'bg-emerald-50 border border-emerald-200'
                        : 'hover:bg-slate-50 hover:shadow-sm'
                    }`}
                    type="button"
                  >
                    <img
                      src={
                        product.images?.[0] ||
                        product.variants?.[0]?.images?.[0] ||
                        '/placeholder-image.jpg'
                      }
                      alt={product.name}
                      className="w-11 h-11 rounded-xl object-cover shadow-sm"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {product.name}
                      </p>
                      <p className="text-[10px] text-slate-500 font-bold mt-0.5">
                        ৳{price}
                      </p>
                    </div>
                    {(isMainItem || isFreeItem) && (
                      <div
                        className={`p-1.5 rounded-lg ${isMainItem ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}
                      >
                        {isMainItem ? (
                          <span className="text-[10px] font-bold">BUY</span>
                        ) : (
                          <span className="text-[10px] font-bold">GET</span>
                        )}
                      </div>
                    )}
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
            <span className="text-sm font-bold text-slate-700">
              Publish BOGO
            </span>
          </label>
          <div className="h-6 w-px bg-slate-200"></div>
          {formData.mainItem && formData.freeItem && (
            <p className="text-xs text-slate-400 font-medium">
              Savings:{' '}
              <span className="text-slate-600 font-bold">
                ৳
                {(
                  formData.mainItem.price +
                  formData.freeItem.price -
                  calculateSalePrice
                ).toFixed(2)}
              </span>
            </p>
          )}
        </div>

        <div className="">
          <button
            onClick={handleSubmit}
            disabled={
              isPending ||
              uploadingFeatured ||
              uploadingGallery ||
              !formData.mainItem ||
              !formData.freeItem
            }
            className="px-10 py-3 rounded-2xl bg-emerald-600 text-white font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 active:scale-95 flex items-center gap-3 disabled:opacity-50 disabled:shadow-none"
            type="button"
          >
            {isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5" />
            )}
            {activeModal === UI_MODAL_TYPE.EDIT ? 'Update BOGO' : 'Create BOGO'}
          </button>
        </div>
      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </>
  );
};

export default BogoForm;
