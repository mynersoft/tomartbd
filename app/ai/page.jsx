'use client';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ProductSEOForm() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    features: [''],
  });

  const [seoData, setSeoData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    if (name === 'feature') {
      const newFeatures = [...form.features];
      newFeatures[index] = value;
      setForm((prev) => ({ ...prev, features: newFeatures }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const addFeature = () => {
    setForm((prev) => ({ ...prev, features: [...prev.features, ''] }));
  };

  const removeFeature = (index) => {
    setForm((prev) => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index),
    }));
  };

  const generateSEO = async () => {
    if (!form.title || !form.description)
      return toast.error('Title and description required');

    setLoading(true);
    try {
      const { data } = await axios.post('/api/admin/ai', {
        title: form.title,
        description: form.description,
        features: form.features.filter((f) => f.trim() !== ''),
      });
      setSeoData(data);
      toast.success('SEO content generated successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to generate SEO content');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 bg-white shadow rounded">
      <h2 className="text-xl font-bold">Product SEO Generator</h2>

      <div>
        <label className="block font-medium">Product Title</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
        />
      </div>

      <div>
        <label className="block font-medium">Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border px-3 py-2 rounded"
          rows={4}
        ></textarea>
      </div>

      <div>
        <label className="block font-medium">Features</label>
        {form.features.map((f, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <input
              type="text"
              name="feature"
              value={f}
              onChange={(e) => handleChange(e, idx)}
              className="flex-1 border px-3 py-2 rounded"
            />
            <button
              type="button"
              onClick={() => removeFeature(idx)}
              className="text-red-500"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="text-blue-500 mt-2"
        >
          Add Feature
        </button>
      </div>

      <button
        type="button"
        onClick={generateSEO}
        className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate SEO'}
      </button>

      {seoData && (
        <div className="mt-6 p-4 bg-gray-50 rounded border">
          <h3 className="font-bold">Generated SEO Content</h3>
          <p>
            <strong>SEO Title:</strong> {seoData.seoTitle}
          </p>
          <p>
            <strong>Meta Description:</strong> {seoData.metaDescription}
          </p>
          <p>
            <strong>Tags:</strong> {seoData.tags}
          </p>
          <p>
            <strong>Short Description:</strong> {seoData.shortDescription}
          </p>
          <p>
            <strong>Long Description:</strong> {seoData.longDescription}
          </p>
        </div>
      )}
    </div>
  );
}
