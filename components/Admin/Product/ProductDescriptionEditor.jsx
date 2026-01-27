// components/ProductEditor/ProductDescriptionEditor.jsx
'use client';

import { useState, useEffect } from 'react';
import TinyMCEEditor from '@/components/TinyMCEEditor';
import ProductSnippets from './ProductSnippets';
import LivePreview from './LivePreview';
import SEOAnalyzer from './SEOAnalyzer';

export default function ProductDescriptionEditor({
  productId,
  initialContent = '',
  onSave,
}) {
  const [content, setContent] = useState(initialContent);
  const [seoScore, setSeoScore] = useState(0);
  const [wordCount, setWordCount] = useState(0);
  const [activeTab, setActiveTab] = useState('edit');

  // Calculate metrics
  useEffect(() => {
    const text = content.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).length;
    setWordCount(words);

    // Simple SEO scoring
    let score = 0;
    if (content.includes('<h1>') || content.includes('<h2>')) score += 30;
    if (words > 150 && words < 500) score += 30;
    if (content.includes('alt=')) score += 20;
    if (content.includes('<table>')) score += 20;
    setSeoScore(Math.min(score, 100));
  }, [content]);

  const insertSnippet = (snippet) => {
    setContent((prev) => prev + snippet);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: content }),
      });

      if (response.ok) {
        onSave?.(content);
      }
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left sidebar - Snippets */}
      <div className="lg:col-span-1">
        <ProductSnippets onInsert={insertSnippet} />
        <SEOAnalyzer content={content} score={seoScore} wordCount={wordCount} />
      </div>

      {/* Main editor area */}
      <div className="lg:col-span-2 space-y-6">
        {/* Tab navigation */}
        <div className="border-b">
          <nav className="-mb-px flex space-x-8">
            {['edit', 'preview', 'code'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                  py-2 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab content */}
        <div className="min-h-[600px]">
          {activeTab === 'edit' && (
            <TinyMCEEditor value={content} onChange={setContent} height={500} />
          )}

          {activeTab === 'preview' && <LivePreview content={content} />}

          {activeTab === 'code' && (
            <div className="border rounded-lg p-4 bg-gray-50">
              <pre className="text-sm overflow-auto">{content}</pre>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{wordCount}</span> words •
            <span
              className={`ml-2 font-medium ${seoScore > 70 ? 'text-green-600' : 'text-yellow-600'}`}
            >
              SEO Score: {seoScore}/100
            </span>
          </div>

          <div className="space-x-3">
            <button
              onClick={() => setContent('')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Clear
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Save Description
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
