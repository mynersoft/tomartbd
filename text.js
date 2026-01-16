
const uploadToCloudinary = async (file, folder = 'bogos') => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append(
    'upload_preset',
    process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET
  );
  formData.append('folder', folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: 'POST', body: formData }
  );

  if (!res.ok) throw new Error('Upload failed');
  const data = await res.json();

  return { url: data.secure_url, publicId: data.public_id };
};









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
