'use client';

import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tinymce/tinymce-react';

export default function BlogPostForm() {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [uploading, setUploading] = useState(false);
  const [blobImages, setBlobImages] = useState([]);
  const editorRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      // Convert blob URLs to base64 or upload to server
      const processedContent = await processContentWithBlobs(
        content,
        blobImages
      );

      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          slug,
          tags,
          keywords,
          images,
          content: processedContent,
        }),
      });
      if (!response.ok) throw new Error('Failed to create post');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['blogPosts']);
      reset();
      setTags([]);
      setKeywords([]);
      setImages([]);
      setSlug('');
      setContent('');
      setBlobImages([]);
      if (editorRef.current) {
        editorRef.current.setContent('');
      }
      alert('Blog post created successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Process content to handle blob URLs
  const processContentWithBlobs = async (content, blobs) => {
    if (!content) return content;

    let processedContent = content;

    // Replace blob URLs with uploaded URLs or base64
    for (const blob of blobs) {
      if (blob.url.startsWith('blob:')) {
        try {
          // Convert blob to base64
          const base64Data = await blobToBase64(blob.blob);
          processedContent = processedContent.replace(blob.url, base64Data);
        } catch (error) {
          console.error('Failed to convert blob to base64:', error);
          // Optionally, upload to server
          const uploadedUrl = await uploadBlobToServer(
            blob.blob,
            blob.filename
          );
          if (uploadedUrl) {
            processedContent = processedContent.replace(blob.url, uploadedUrl);
          }
        }
      }
    }

    return processedContent;
  };

  // Convert blob to base64
  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  // Upload blob to server
  const uploadBlobToServer = async (blob, filename) => {
    const formData = new FormData();
    formData.append('image', blob, filename);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      return data.url;
    } catch (error) {
      console.error('Upload failed:', error);
      return null;
    }
  };

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
      setSlug(generatedSlug);
    } else {
      setSlug('');
    }
  }, [title]);

  // Extract blob images from content
  useEffect(() => {
    if (content) {
      const imgRegex = /<img[^>]+src="([^">]+)"/g;
      const matches = [];
      let match;

      while ((match = imgRegex.exec(content)) !== null) {
        matches.push(match[1]);
      }

      // Track blob URLs
      const blobUrls = matches.filter((src) => src.startsWith('blob:'));

      // Update blob images tracking
      blobUrls.forEach(async (blobUrl) => {
        if (!blobImages.find((img) => img.url === blobUrl)) {
          try {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            const filename = `image-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${blob.type.split('/')[1] || 'png'}`;

            setBlobImages((prev) => [
              ...prev,
              {
                url: blobUrl,
                blob,
                filename,
                type: blob.type,
                size: blob.size,
              },
            ]);
          } catch (error) {
            console.error('Failed to fetch blob:', error);
          }
        }
      });
    }
  }, [content, blobImages]);

  // Handler functions
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) =>
    setTags(tags.filter((tag) => tag !== tagToRemove));

  const addKeyword = (e) => {
    e.preventDefault();
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };

  const removeKeyword = (keywordToRemove) =>
    setKeywords(keywords.filter((k) => k !== keywordToRemove));

  const addImage = (e) => {
    e.preventDefault();
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };

  const removeImage = (imgToRemove) =>
    setImages(images.filter((i) => i !== imgToRemove));

  // Handle file upload for TinyMCE - using blob URLs
  const handleImageUpload = (blobInfo, progress) => {
    return new Promise((resolve, reject) => {
      // Create blob URL for immediate display
      const blobUrl = URL.createObjectURL(blobInfo.blob());

      // Store blob information for later processing
      setBlobImages((prev) => [
        ...prev,
        {
          url: blobUrl,
          blob: blobInfo.blob(),
          filename: blobInfo.filename(),
          type: blobInfo.blob().type,
          size: blobInfo.blob().size,
        },
      ]);

      // Resolve with blob URL for immediate display in editor
      resolve(blobUrl);
    });
  };

  // Handle direct file upload
  const handleFileUpload = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    setUploading(true);

    try {
      for (const file of files) {
        // Create blob URL
        const blobUrl = URL.createObjectURL(file);

        // Store blob information
        setBlobImages((prev) => [
          ...prev,
          {
            url: blobUrl,
            blob: file,
            filename: file.name,
            type: file.type,
            size: file.size,
            uploadedAt: new Date().toISOString(),
          },
        ]);

        // Insert into editor if it's open
        if (editorRef.current) {
          editorRef.current.insertContent(
            `<img src="${blobUrl}" alt="${file.name}" style="max-width: 100%; height: auto;" />`
          );
        }
      }
    } catch (error) {
      alert('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
      event.target.value = ''; // Reset file input
    }
  };

  // Insert image into editor
  const insertImageToEditor = (imageUrl) => {
    if (editorRef.current) {
      editorRef.current.insertContent(
        `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto;" />`
      );
    }
  };

  // Remove blob image
  const removeBlobImage = (index) => {
    const imageToRemove = blobImages[index];

    // Revoke blob URL to prevent memory leaks
    if (imageToRemove.url.startsWith('blob:')) {
      URL.revokeObjectURL(imageToRemove.url);
    }

    // Remove from tracking
    setBlobImages((prev) => prev.filter((_, i) => i !== index));

    // Remove from content if present
    if (content.includes(imageToRemove.url)) {
      setContent((prev) =>
        prev.replace(
          new RegExp(`<img[^>]*src="${imageToRemove.url}"[^>]*>`, 'g'),
          ''
        )
      );
    }
  };

  const onSubmit = async (data) => {
    if (tags.length === 0) {
      alert('Please add at least one tag');
      return;
    }

    if (!content || content.trim() === '') {
      alert('Please add content using the editor');
      return;
    }

    mutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Create New Blog Post
          </h1>
          <p className="text-gray-600">
            Fill in the details below to publish your article
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-xl p-6 md:p-8 space-y-8"
        >
          {/* Basic Information Section */}
          <div className="border-b pb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span>Title</span>
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('title', { required: 'Title is required' })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter blog post title"
                  />
                  {errors.title && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Slug
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      value={slug}
                      readOnly
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => navigator.clipboard.writeText(slug)}
                      disabled={!slug}
                      className="px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Automatically generated from title
                  </p>
                </div>

                {/* Author */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                    <span>Author Name</span>
                    <span className="ml-1 text-red-500">*</span>
                  </label>
                  <input
                    {...register('author.name', {
                      required: 'Author is required',
                    })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter author name"
                  />
                  {errors.author?.name && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.author.name.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* Category & Status Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category
                    </label>
                    <input
                      {...register('category')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., Technology"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      {...register('status')}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent bg-white"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>

                {/* Featured & Read Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-3 bg-gray-50 p-4 rounded-xl">
                    <input
                      type="checkbox"
                      {...register('isFeatured')}
                      className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <label className="text-sm font-semibold text-gray-700">
                      Featured Post
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Read Time (minutes)
                    </label>
                    <input
                      {...register('readTime', { valueAsNumber: true })}
                      type="number"
                      min="1"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 5"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Excerpt Section */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <span>Excerpt</span>
              <span className="ml-1 text-red-500">*</span>
            </label>
            <textarea
              {...register('excerpt', {
                required: 'Excerpt is required',
                maxLength: {
                  value: 300,
                  message: 'Excerpt must be 300 characters or less',
                },
              })}
              rows="3"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Brief summary of your post (max 300 characters)"
            />
            {errors.excerpt && (
              <p className="mt-2 text-sm text-red-600">
                {errors.excerpt.message}
              </p>
            )}
            <div className="mt-2 text-sm text-gray-500 text-right">
              {watch('excerpt')?.length || 0}/300 characters
            </div>
          </div>

          {/* Content Editor Section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-semibold text-gray-700 flex items-center">
                <span>Content</span>
                <span className="ml-1 text-red-500">*</span>
              </label>

              {/* Image Upload Button */}
              <div className="flex items-center gap-2">
                <label className="px-4 py-2 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200 transition-colors cursor-pointer">
                  Upload Images
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
                {uploading && (
                  <span className="text-sm text-gray-600">Uploading...</span>
                )}
              </div>
            </div>

            {/* TinyMCE Editor */}
            <div className="border border-gray-300 rounded-xl overflow-hidden mb-4">
              <Editor
                apiKey={process.env.NEXT_PUBLIC_TINY_MCE}
                onInit={(evt, editor) => (editorRef.current = editor)}
                value={content}
                onEditorChange={(newContent) => setContent(newContent)}
                init={{
                  height: 500,
                  menubar: true,
                  plugins: [
                    'advlist',
                    'autolink',
                    'lists',
                    'link',
                    'image',
                    'charmap',
                    'preview',
                    'anchor',
                    'searchreplace',
                    'visualblocks',
                    'code',
                    'fullscreen',
                    'insertdatetime',
                    'media',
                    'table',
                    'code',
                    'help',
                    'wordcount',
                    'quickbars', // Removed 'imagetools'
                  ],
                  toolbar:
                    'undo redo | blocks | bold italic forecolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | code | fullscreen preview',
                  images_upload_handler: handleImageUpload,
                  automatic_uploads: true,
                  file_picker_types: 'image',
                  paste_data_images: true,
                  content_style:
                    'body { font-family:Helvetica,Arial,sans-serif; font-size:16px; line-height:1.6; } img { max-width: 100%; height: auto; }',
                  skin: 'oxide',
                  content_css: 'default',
                  branding: false,
                  image_caption: true,
                  image_advtab: false, // Changed from true to false
                  quickbars_selection_toolbar:
                    'bold italic | quicklink h2 h3 blockquote',
                  quickbars_insert_toolbar: 'quickimage quicktable',
                  contextmenu: 'link image table',
                  images_reuse_filename: true,
                  image_dimensions: false,
                  image_description: true,
                }}
              />
            </div>

            {/* Uploaded Blob Images Gallery */}
            {blobImages.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Uploaded Images ({blobImages.length})
                    <span className="ml-2 text-sm text-gray-500 font-normal">
                      (Will be converted on submit)
                    </span>
                  </h3>
                  <div className="text-sm text-gray-600">
                    {blobImages.reduce((total, img) => total + img.size, 0) /
                      1024 /
                      1024 >
                    1
                      ? `${(blobImages.reduce((total, img) => total + img.size, 0) / 1024 / 1024).toFixed(2)} MB total`
                      : `${(blobImages.reduce((total, img) => total + img.size, 0) / 1024).toFixed(1)} KB total`}
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {blobImages.map((image, index) => (
                    <div
                      key={index}
                      className="relative group border border-gray-200 rounded-lg overflow-hidden bg-gray-50"
                    >
                      <div className="aspect-square relative">
                        <img
                          src={image.url}
                          alt={image.filename}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src =
                              'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZTwvdGV4dD48L3N2Zz4=';
                          }}
                        />
                      </div>
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => insertImageToEditor(image.url)}
                            className="px-3 py-1 bg-white text-gray-800 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            title="Insert into content"
                          >
                            Insert
                          </button>
                          <button
                            type="button"
                            onClick={() => removeBlobImage(index)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            title="Remove image"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                      <div className="p-2">
                        <p
                          className="text-xs text-gray-600 truncate"
                          title={image.filename}
                        >
                          {image.filename}
                        </p>
                        <div className="flex justify-between items-center">
                          <p className="text-xs text-gray-500">
                            {(image.size / 1024).toFixed(1)} KB
                          </p>
                          <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-800 rounded">
                            {image.type.split('/')[1]?.toUpperCase() || 'IMG'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <span className="font-semibold">Note:</span> Images are
                    stored as blob URLs temporarily. They will be converted to
                    base64 format or uploaded to your server when you submit the
                    post.
                  </p>
                </div>
              </div>
            )}

            {!content && (
              <p className="mt-2 text-sm text-red-600">Content is required</p>
            )}
          </div>

          {/* Tags & Keywords Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Tags */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center">
                <span>Tags</span>
                <span className="ml-1 text-red-500">*</span>
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a tag"
                  onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-6 py-3 bg-blue-100 text-blue-700 font-semibold rounded-xl hover:bg-blue-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[48px]">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-800 px-4 py-2 rounded-full border border-blue-200"
                  >
                    <span className="font-medium">{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-blue-600 hover:text-blue-800 text-lg font-bold transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <div className="text-gray-400 italic text-sm py-2">
                    No tags added yet. Add at least one tag.
                  </div>
                )}
              </div>
            </div>

            {/* Keywords */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                SEO Keywords
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={keywordInput}
                  onChange={(e) => setKeywordInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Add a keyword"
                  onKeyPress={(e) => e.key === 'Enter' && addKeyword(e)}
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="px-6 py-3 bg-green-100 text-green-700 font-semibold rounded-xl hover:bg-green-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 min-h-[48px]">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-green-50 to-green-100 text-green-800 px-4 py-2 rounded-full border border-green-200"
                  >
                    <span className="font-medium">{keyword}</span>
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="text-green-600 hover:text-green-800 text-lg font-bold transition-colors"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Featured Image */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Featured Image URL
              </label>
              <div className="space-y-3">
                <input
                  {...register('coverImage')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/featured-image.jpg or paste from uploaded images"
                />
                {watch('coverImage') && (
                  <div className="relative">
                    <img
                      src={watch('coverImage')}
                      alt="Featured preview"
                      className="w-full h-48 object-cover rounded-xl border"
                      onError={(e) => {
                        e.target.src =
                          'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YzZjNmMyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjgiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ob3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Additional Images */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Additional Image URLs
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="https://example.com/image.jpg"
                  onKeyPress={(e) => e.key === 'Enter' && addImage(e)}
                />
                <button
                  type="button"
                  onClick={addImage}
                  className="px-6 py-3 bg-purple-100 text-purple-700 font-semibold rounded-xl hover:bg-purple-200 transition-colors"
                >
                  Add
                </button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto p-2">
                {images.map((img) => (
                  <div
                    key={img}
                    className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-purple-100 px-4 py-3 rounded-xl border border-purple-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded border bg-white overflow-hidden">
                        <img
                          src={img}
                          alt=""
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML =
                              '<div class="w-full h-full flex items-center justify-center text-gray-400 text-xs">404</div>';
                          }}
                        />
                      </div>
                      <span className="text-sm text-purple-800 truncate flex-1">
                        {img}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      className="text-purple-600 hover:text-purple-800 font-bold text-lg transition-colors ml-2"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEO Section */}
          <div className="border-t pt-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              SEO Settings
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  {...register('metaTitle')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Meta title for SEO"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  {...register('metaDescription')}
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-3 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Meta description for SEO"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-8">
            <div className="mb-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">Post Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Title:</span>
                  <p className="font-medium truncate">{title || 'Not set'}</p>
                </div>
                <div>
                  <span className="text-gray-600">Tags:</span>
                  <p className="font-medium">{tags.length} added</p>
                </div>
                <div>
                  <span className="text-gray-600">Images:</span>
                  <p className="font-medium">{blobImages.length} blob images</p>
                </div>
                <div>
                  <span className="text-gray-600">Content:</span>
                  <p className="font-medium">{content.length} characters</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={mutation.isLoading || tags.length === 0 || !content}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl font-bold text-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.99]"
            >
              {mutation.isLoading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {blobImages.length > 0
                    ? 'Processing images...'
                    : 'Creating Post...'}
                </span>
              ) : (
                'Publish Blog Post'
              )}
            </button>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  reset();
                  setTags([]);
                  setKeywords([]);
                  setImages([]);
                  setSlug('');
                  setContent('');
                  // Revoke all blob URLs
                  blobImages.forEach((img) => {
                    if (img.url.startsWith('blob:')) {
                      URL.revokeObjectURL(img.url);
                    }
                  });
                  setBlobImages([]);
                  if (editorRef.current) {
                    editorRef.current.setContent('');
                  }
                }}
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Clear All Fields
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
