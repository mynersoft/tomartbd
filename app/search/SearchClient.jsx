'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Loader2, Tag, ShoppingBag, ExternalLink } from 'lucide-react';

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Fetch search results
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchResults = async () => {
      setIsSearching(true);
      setLoading(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error('Search error:', err);
        setResults([]);
      } finally {
        setLoading(false);
        setIsSearching(false);
      }
    };

    fetchResults();
  }, [debouncedQuery]);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }, [query, router]);

  const handleProductClick = useCallback((productId) => {
    router.push(`/products/${productId}`);
  }, [router]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }, [handleSubmit]);

  // Clear search
  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    router.push('/search');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Discover Products
          </h1>
          <p className="text-gray-600">
            Search through our collection of premium products
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <form onSubmit={handleSubmit} className="relative">
            <div className="relative flex items-center">
              <div className="absolute left-4 text-gray-400">
                {isSearching ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Search className="h-5 w-5" />
                )}
              </div>
              
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search by name..."
                className="w-full pl-12 pr-24 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-all duration-200 shadow-sm hover:shadow-md"
                autoFocus
              />
              
              <div className="absolute right-2 flex items-center gap-2">
                {query && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="px-3 py-1 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  disabled={!query.trim() || loading}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium rounded-lg hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      Search
                      <ExternalLink className="h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
            
            {query && (
              <div className="mt-3 px-4">
                <span className="text-sm text-gray-500">
                  Press Enter to search or see results as you type
                </span>
              </div>
            )}
          </form>
        </div>

        {/* Results Section */}
        <div className="mt-8">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <p className="text-gray-600">Searching for products...</p>
            </div>
          )}

          {!loading && debouncedQuery && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {results.length > 0 ? (
                    <>
                      Found {results.length} product{results.length !== 1 ? 's' : ''} for "
                      <span className="text-blue-600">{debouncedQuery}</span>"
                    </>
                  ) : (
                    <>
                      No results for "<span className="text-blue-600">{debouncedQuery}</span>"
                    </>
                  )}
                </h2>
              </div>

              {results.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {results.map((product) => (
                    <div
                      key={product._id}
                      onClick={() => handleProductClick(product.slug || product._id)}
                      className="group bg-white rounded-xl border-2 border-gray-200 p-5 hover:border-blue-500 hover:shadow-xl cursor-pointer transition-all duration-300 transform hover:-translate-y-1"
                    >
                      {/* Product Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-700 line-clamp-1">
                            {product.name}
                          </h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                              {product.brand}
                            </span>
                            <span className="text-sm text-gray-500 bg-blue-50 px-2 py-1 rounded">
                              {product.category}
                            </span>
                          </div>
                        </div>
                        
                        {/* Sale Badge */}
                        {product.isOnSale && (
                          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                            SALE
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            {product.isOnSale ? (
                              <div className="flex items-center gap-2">
                                <span className="text-2xl font-bold text-red-600">
                                  ${product.salePrice.toFixed(2)}
                                </span>
                                <span className="text-gray-400 line-through">
                                  ${product.price.toFixed(2)}
                                </span>
                                <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded">
                                  Save {(((product.price - product.salePrice) / product.price) * 100).toFixed(0)}%
                                </span>
                              </div>
                            ) : (
                              <span className="text-2xl font-bold text-gray-900">
                                ${product.price.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <ShoppingBag className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                        </div>

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-3 border-t">
                            {product.tags.slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded"
                              >
                                {tag}
                              </span>
                            ))}
                            {product.tags.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{product.tags.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* View Details Button */}
                        <div className="pt-4">
                          <button className="w-full py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors flex items-center justify-center gap-2">
                            View Product Details
                            <ExternalLink className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-gray-50 rounded-2xl">
                  <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                    <Search className="h-12 w-12 text-gray-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-500 max-w-md mx-auto mb-6">
                    Try different keywords or browse our categories
                  </p>
                  <button
                    onClick={clearSearch}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    Clear Search
                  </button>
                </div>
              )}
            </>
          )}

          {!debouncedQuery && !loading && (
            <div className="text-center py-16">
              <div className="w-20 h-20 mx-auto mb-6 bg-blue-50 rounded-full flex items-center justify-center">
                <Search className="h-10 w-10 text-blue-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                Start searching for products
              </h3>
              <p className="text-gray-500">
                Enter keywords above to discover amazing products
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}