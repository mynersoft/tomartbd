// components/ReviewForm.jsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Star, 
  StarHalf, 
  X, 
  Upload, 
  Image as ImageIcon,
  User,
  ShoppingBag,
  ThumbsUp,
  ThumbsDown,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  Camera,
  Smile,
  Frown,
  Meh,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { toast } from 'react-hot-toast';

const ReviewForm = ({ 
  productId, 
  productName, 
  orderId = null,
  customerName = null,
  onReviewSubmit,
  onClose,
  isOpen = false
}) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [photos, setPhotos] = useState([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [recommends, setRecommends] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedTag, setSelectedTag] = useState('');
  const [isFormExpanded, setIsFormExpanded] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);
  
  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);

  const reviewTags = [
    { label: 'Great Quality', emoji: '👍' },
    { label: 'Fast Delivery', emoji: '🚚' },
    { label: 'Value for Money', emoji: '💰' },
    { label: 'Easy to Use', emoji: '✨' },
    { label: 'Exceeded Expectations', emoji: '🌟' },
    { label: 'Packaging', emoji: '📦' },
    { label: 'Customer Support', emoji: '💬' },
    { label: 'Would Recommend', emoji: '❤️' }
  ];

  const ratingLabels = [
    'Terrible',
    'Poor',
    'Average',
    'Good',
    'Excellent'
  ];

  // Character counter
  useEffect(() => {
    setCharacterCount(comment.length);
  }, [comment]);

  // Auto-expand textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [comment]);

  const handlePhotoUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPhotos = files.slice(0, 4 - photos.length); // Max 4 photos
    
    if (newPhotos.length + photos.length > 4) {
      toast.error('Maximum 4 photos allowed');
      return;
    }

    newPhotos.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error('Please upload image files only');
        return;
      }

      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotos(prev => [...prev, {
          id: Date.now() + Math.random(),
          url: e.target.result,
          file: file
        }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (id) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      toast.error('Please select a rating');
      return;
    }

    if (comment.trim().length < 20) {
      toast.error('Please write a more detailed review (minimum 20 characters)');
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare form data
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('orderId', orderId || '');
      formData.append('rating', rating);
      formData.append('title', title.trim());
      formData.append('comment', comment.trim());
      formData.append('recommends', recommends);
      formData.append('isAnonymous', isAnonymous);
      formData.append('tags', JSON.stringify([selectedTag].filter(Boolean)));

      // Append photos
      photos.forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo.file);
      });

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In real implementation:
      // const response = await fetch('/api/reviews', {
      //   method: 'POST',
      //   body: formData
      // });

      const reviewData = {
        id: Date.now(),
        productId,
        productName,
        customerName: isAnonymous ? 'Anonymous' : (customerName || 'Customer'),
        rating,
        title: title.trim(),
        comment: comment.trim(),
        recommends,
        date: new Date().toISOString(),
        photos: photos.map(p => ({ url: p.url })),
        tags: selectedTag ? [selectedTag] : [],
        verified: !!orderId
      };

      // Call parent callback
      if (onReviewSubmit) {
        onReviewSubmit(reviewData);
      }

      toast.success('🎉 Review submitted successfully!');
      
      // Reset form
      setRating(5);
      setTitle('');
      setComment('');
      setPhotos([]);
      setSelectedTag('');
      
      if (onClose) {
        setTimeout(() => onClose(), 1000);
      }
    } catch (error) {
      toast.error('Failed to submit review. Please try again.');
      console.error('Review submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTagClick = (tag) => {
    setSelectedTag(prev => prev === tag ? '' : tag);
  };

  if (!isOpen && onClose) {
    return null;
  }

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${isOpen ? 'block' : 'hidden'}`}>
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Write a Review</h2>
                <p className="text-blue-100">Share your experience with {productName}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Product Info */}
            <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
              <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                <ShoppingBag className="h-8 w-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-gray-900">{productName}</h3>
                <p className="text-sm text-gray-600">
                  {orderId ? `Order #${orderId}` : 'Recent Purchase'}
                </p>
                {customerName && !isAnonymous && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Reviewing as {customerName}
                  </p>
                )}
              </div>
            </div>

            {/* Rating Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-900">
                  Overall Rating
                </label>
                <span className={`text-2xl font-bold ${
                  rating >= 4 ? 'text-green-600' : 
                  rating >= 3 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {rating}.0
                </span>
              </div>
              
              {/* Star Rating */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      className="p-1"
                    >
                      <Star className={`h-12 w-12 transition-all ${
                        star <= (hoverRating || rating) 
                          ? 'fill-yellow-400 text-yellow-400' 
                          : 'fill-gray-200 text-gray-200'
                      } hover:scale-110`} />
                    </button>
                  ))}
                </div>
                
                <div className={`text-xl font-semibold transition-colors ${
                  rating >= 4 ? 'text-green-600' : 
                  rating >= 3 ? 'text-yellow-600' : 
                  'text-red-600'
                }`}>
                  {ratingLabels[rating - 1]}
                </div>
              </div>
            </div>

            {/* Recommend Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {recommends ? (
                  <ThumbsUp className="h-6 w-6 text-green-600" />
                ) : (
                  <ThumbsDown className="h-6 w-6 text-red-600" />
                )}
                <div>
                  <p className="font-semibold text-gray-900">
                    Would you recommend this product?
                  </p>
                  <p className="text-sm text-gray-600">
                    Your recommendation helps other customers
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setRecommends(true)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    recommends 
                      ? 'bg-green-100 text-green-700 border-2 border-green-500' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  Yes
                </button>
                <button
                  type="button"
                  onClick={() => setRecommends(false)}
                  className={`px-4 py-2 rounded-lg transition-all ${
                    !recommends 
                      ? 'bg-red-100 text-red-700 border-2 border-red-500' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  No
                </button>
              </div>
            </div>

            {/* Expand/Collapse Button */}
            <button
              type="button"
              onClick={() => setIsFormExpanded(!isFormExpanded)}
              className="w-full flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl hover:from-blue-100 hover:to-indigo-100 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  {isFormExpanded ? 
                    <ChevronUp className="h-5 w-5 text-blue-600" /> : 
                    <ChevronDown className="h-5 w-5 text-blue-600" />
                  }
                </div>
                <span className="font-semibold text-gray-900">
                  Add more details (optional)
                </span>
              </div>
              <span className="text-sm text-gray-600">
                {isFormExpanded ? 'Show less' : 'Show more'}
              </span>
            </button>

            {/* Expanded Form Content */}
            {isFormExpanded && (
              <div className="space-y-6 animate-slide-down">
                {/* Review Title */}
                <div className="space-y-3">
                  <label className="font-semibold text-gray-900">
                    Review Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Summarize your experience"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    maxLength={100}
                  />
                </div>

                {/* Review Tags */}
                <div className="space-y-3">
                  <label className="font-semibold text-gray-900">
                    What stood out?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {reviewTags.map((tag) => (
                      <button
                        key={tag.label}
                        type="button"
                        onClick={() => handleTagClick(tag.label)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
                          selectedTag === tag.label
                            ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        <span>{tag.emoji}</span>
                        <span>{tag.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Photo Upload */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-semibold text-gray-900">
                      Add Photos
                    </label>
                    <span className="text-sm text-gray-500">
                      {photos.length}/4 photos
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {/* Add Photo Button */}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={photos.length >= 4}
                      className={`aspect-square border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-all ${
                        photos.length >= 4
                          ? 'border-gray-300 bg-gray-50 text-gray-400 cursor-not-allowed'
                          : 'border-blue-300 bg-blue-50 text-blue-600 hover:bg-blue-100 hover:border-blue-400'
                      }`}
                    >
                      <Camera className="h-8 w-8" />
                      <span className="text-sm">Add Photo</span>
                    </button>
                    
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />

                    {/* Photo Previews */}
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <img
                          src={photo.url}
                          alt="Preview"
                          className="aspect-square object-cover rounded-xl w-full"
                        />
                        <button
                          type="button"
                          onClick={() => removePhoto(photo.id)}
                          className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Upload images of your product (JPEG, PNG, max 5MB each)
                  </p>
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <User className="h-6 w-6 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        Post as Anonymous
                      </p>
                      <p className="text-sm text-gray-600">
                        Your name won't be shown publicly
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAnonymous(!isAnonymous)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      isAnonymous ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isAnonymous ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            )}

            {/* Review Comment */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-gray-900">
                  Your Review
                </label>
                <div className={`text-sm ${characterCount > 500 ? 'text-red-600' : 'text-gray-500'}`}>
                  {characterCount}/500
                </div>
              </div>
              
              <div className="relative">
                <textarea
                  ref={textareaRef}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={4}
                  placeholder={`Share your experience with ${productName}...\n• What do you like about it?\n• Any issues or suggestions?\n• How was your buying experience?`}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                  maxLength={500}
                />
                
                {/* Character limit warning */}
                {characterCount > 450 && (
                  <div className={`absolute bottom-2 right-2 text-xs ${
                    characterCount > 500 ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    {characterCount > 500 ? 'Character limit exceeded!' : `${500 - characterCount} characters left`}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>Be specific and honest</span>
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  <span>Minimum 20 characters</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="sticky bottom-0 bg-white pt-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row gap-4">
                {onClose && (
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSubmitting}
                    className="px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || rating === 0 || comment.length < 20}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review
                      <Send className="h-5 w-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReviewForm;