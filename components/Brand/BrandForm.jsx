// components/Brands/BrandForm.jsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Save, Upload, X, Loader2, CheckCircle } from 'lucide-react';

const BrandForm = ({ brand = null, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    logo: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [logoPreview, setLogoPreview] = useState('');

  // Initialize form with brand data if editing
  useEffect(() => {
    if (brand) {
      setFormData({
        name: brand.name || '',
        logo: brand.logo || '',
        status: brand.status || 'active',
      });
      if (brand.logo) {
        setLogoPreview(brand.logo);
      }
    }
  }, [brand]);

  // Handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // In a real app, you would upload to cloud storage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setFormData((prev) => ({ ...prev, logo: base64String }));
        setLogoPreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Brand name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Brand name must be at least 2 characters';
    } else if (formData.name.length > 60) {
      newErrors.name = 'Brand name cannot exceed 60 characters';
    }

    // URL validation for logo
    if (
      formData.logo &&
      !formData.logo.startsWith('http') &&
      !formData.logo.startsWith('data:')
    ) {
      newErrors.logo = 'Please enter a valid URL or upload an image';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const brandData = {
        ...formData,
        name: formData.name.trim(),
      };

      await onSubmit(brandData);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: error.message || 'Failed to save brand' });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const removeLogo = () => {
    setFormData((prev) => ({ ...prev, logo: '' }));
    setLogoPreview('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-2xl shadow-xl overflow-hidden"
    >
      {/* Form Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {brand ? 'Edit Brand' : 'Create New Brand'}
            </h2>
            <p className="text-blue-100 mt-1">
              {brand
                ? 'Update your brand information'
                : 'Add a new brand to your store'}
            </p>
          </div>
          {onCancel && (
            <button
              onClick={onCancel}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          )}
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="p-6">
        {/* Name Field */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Apple, Nike, Samsung"
            className={`w-full px-4 py-3 rounded-xl border ${
              errors.name
                ? 'border-red-300 focus:border-red-500'
                : 'border-gray-300 focus:border-blue-500'
            } focus:ring-2 focus:ring-blue-200 transition-colors outline-none`}
            disabled={isLoading}
          />
          {errors.name && (
            <p className="mt-2 text-sm text-red-600">{errors.name}</p>
          )}
          <p className="mt-2 text-xs text-gray-500">
            {formData.name.length}/60 characters
          </p>
        </div>

        {/* Logo Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Brand Logo
          </label>

          <div className="space-y-4">
            {/* URL Input */}
            <input
              type="text"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="https://example.com/logo.png"
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.logo ? 'border-red-300' : 'border-gray-300'
              } focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-colors outline-none`}
              disabled={isLoading}
            />

            {/* File Upload */}
            <div className="flex items-center gap-4">
              <div className="flex-1">
                <label className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">
                    Upload Logo
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={isLoading}
                  />
                </label>
              </div>

              {formData.logo && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="px-4 py-3 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl font-medium transition-colors"
                  disabled={isLoading}
                >
                  Remove Logo
                </button>
              )}
            </div>

            {/* Logo Preview */}
            {logoPreview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">
                  Preview:
                </p>
                <div className="inline-flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="max-h-24 max-w-full object-contain"
                    onError={() =>
                      setErrors((prev) => ({
                        ...prev,
                        logo: 'Failed to load image',
                      }))
                    }
                  />
                </div>
              </div>
            )}

            {errors.logo && (
              <p className="text-sm text-red-600">{errors.logo}</p>
            )}
          </div>
        </div>

        {/* Status Field */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label
              className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.status === 'active'
                  ? 'border-green-500 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value="active"
                checked={formData.status === 'active'}
                onChange={handleChange}
                className="sr-only"
                disabled={isLoading}
              />
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.status === 'active'
                      ? 'border-green-500 bg-green-500'
                      : 'border-gray-400'
                  }`}
                >
                  {formData.status === 'active' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">Active</span>
              </div>
            </label>

            <label
              className={`relative flex items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                formData.status === 'inactive'
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <input
                type="radio"
                name="status"
                value="inactive"
                checked={formData.status === 'inactive'}
                onChange={handleChange}
                className="sr-only"
                disabled={isLoading}
              />
              <div className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                    formData.status === 'inactive'
                      ? 'border-red-500 bg-red-500'
                      : 'border-gray-400'
                  }`}
                >
                  {formData.status === 'inactive' && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <span className="font-medium">Inactive</span>
              </div>
            </label>
          </div>
        </div>

        {/* Error Message */}
        {errors.submit && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-red-600 text-sm">{errors.submit}</p>
          </div>
        )}

        {/* Form Actions */}
        <div className="flex gap-4">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {brand ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {brand ? 'Update Brand' : 'Create Brand'}
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default BrandForm;
