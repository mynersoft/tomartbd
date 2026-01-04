'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function BlogPostForm() {
  const queryClient = useQueryClient();
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState('');
  const [keywords, setKeywords] = useState([]);
  const [keywordInput, setKeywordInput] = useState('');
  const [images, setImages] = useState([]);
  const [imageInput, setImageInput] = useState('');
  const [slug, setSlug] = useState('');

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();

  const mutation = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, slug, tags, keywords, images }),
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
      alert('Blog post created successfully!');
    },
    onError: (error) => {
      alert(`Error: ${error.message}`);
    },
  });

  // Auto-generate slug from title
  const title = watch('title');
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '') // remove special chars
        .replace(/\s+/g, '-')         // spaces → dashes
        .replace(/-+/g, '-');         // remove duplicate dashes
      setSlug(generatedSlug);
    } else {
      setSlug('');
    }
  }, [title]);

  // ===== HANDLERS =====
  const addTag = (e) => {
    e.preventDefault();
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };
  const removeTag = (tagToRemove) => setTags(tags.filter(tag => tag !== tagToRemove));

  const addKeyword = (e) => {
    e.preventDefault();
    if (keywordInput.trim() && !keywords.includes(keywordInput.trim())) {
      setKeywords([...keywords, keywordInput.trim()]);
      setKeywordInput('');
    }
  };
  const removeKeyword = (keywordToRemove) => setKeywords(keywords.filter(k => k !== keywordToRemove));

  const addImage = (e) => {
    e.preventDefault();
    if (imageInput.trim() && !images.includes(imageInput.trim())) {
      setImages([...images, imageInput.trim()]);
      setImageInput('');
    }
  };
  const removeImage = (imgToRemove) => setImages(images.filter(i => i !== imgToRemove));

  const onSubmit = (data) => {
    if (tags.length === 0) {
      alert('Please add at least one tag');
      return;
    }
    mutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto px-4">
      {/* TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
        <input
          {...register('title', { required: 'Title is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter blog post title"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
      </div>

      {/* SLUG */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Slug</label>
        <input
          value={slug}
          readOnly
          className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="mt-1 text-sm text-gray-500">Automatically generated from title</p>
      </div>

      {/* AUTHOR */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Author Name</label>
        <input
          {...register('author.name', { required: 'Author is required' })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Enter author name"
        />
        {errors.author?.name && <p className="mt-1 text-sm text-red-600">{errors.author.name.message}</p>}
      </div>

      {/* EXCERPT */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Excerpt</label>
        <textarea
          {...register('excerpt', { required: 'Excerpt is required', maxLength: { value: 300, message: 'Max 300 chars' } })}
          rows="3"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Brief summary of the post"
        />
        {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt.message}</p>}
      </div>

      {/* CONTENT */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
        <textarea
          {...register('content', { required: 'Content is required' })}
          rows="6"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Write your blog post content here..."
        />
        {errors.content && <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>}
      </div>

      {/* GRID: CATEGORY + STATUS + FEATURED */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <input
            {...register('category')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Category name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            {...register('status')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </div>

        <div className="flex items-center gap-2 mt-6 md:mt-0">
          <input type="checkbox" {...register('isFeatured')} className="h-4 w-4" />
          <label className="text-sm font-medium text-gray-700">Featured Post</label>
        </div>
      </div>

      {/* READ TIME */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Read Time (minutes)</label>
        <input
          {...register('readTime', { valueAsNumber: true })}
          type="number"
          min="1"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="e.g. 5"
        />
      </div>

      {/* TAGS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === 'Enter' && addTag(e)}
          />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-blue-600 hover:text-blue-800">×</button>
            </span>
          ))}
        </div>
        {tags.length === 0 && <p className="mt-1 text-sm text-yellow-600">Add at least one tag</p>}
      </div>

      {/* KEYWORDS */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">SEO Keywords</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="Add a keyword"
            onKeyPress={(e) => e.key === 'Enter' && addKeyword(e)}
          />
          <button type="button" onClick={addKeyword} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {keywords.map((keyword) => (
            <span key={keyword} className="inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {keyword}
              <button type="button" onClick={() => removeKeyword(keyword)} className="text-green-600 hover:text-green-800">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* IMAGES */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Additional Images URLs</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={imageInput}
            onChange={(e) => setImageInput(e.target.value)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg"
            placeholder="https://example.com/image.jpg"
            onKeyPress={(e) => e.key === 'Enter' && addImage(e)}
          />
          <button type="button" onClick={addImage} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300">Add</button>
        </div>
        <div className="flex flex-wrap gap-2">
          {images.map((img) => (
            <span key={img} className="inline-flex items-center gap-1 bg-purple-100 text-purple-800 px-3 py-1 rounded-full">
              {img}
              <button type="button" onClick={() => removeImage(img)} className="text-purple-600 hover:text-purple-800">×</button>
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED IMAGE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Featured Image URL</label>
        <input
          {...register('coverImage')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="https://example.com/featured.jpg"
        />
      </div>

      {/* META TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Title</label>
        <input
          {...register('metaTitle')}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Meta title for SEO"
        />
      </div>

      {/* META DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description</label>
        <textarea
          {...register('metaDescription')}
          rows="2"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Meta description for SEO"
        />
      </div>

      {/* SUBMIT */}
      <button
        type="submit"
        disabled={mutation.isLoading}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {mutation.isLoading ? 'Creating...' : 'Create Blog Post'}
      </button>
    </form>
  );
}