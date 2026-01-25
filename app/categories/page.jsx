'use client';

import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Grid,
  List,
  ChevronDown,
  ChevronRight,
  Star,
  TrendingUp,
  Clock,
  Check,
  X,
  Heart,
  ShoppingBag,
} from 'lucide-react';
import { useSelector } from 'react-redux';

import CategoriesSection from '@/components/CategoriesSection';

const featuredProducts = [
  {
    id: 101,
    name: 'Wireless Noise Cancelling Headphones',
    category: 'Electronics',
    price: 299.99,
    discountPrice: 229.99,
    rating: 4.7,
    reviewCount: 128,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 102,
    name: 'Premium Leather Jacket',
    category: 'Fashion',
    price: 189.99,
    discountPrice: 149.99,
    rating: 4.5,
    reviewCount: 89,
    image:
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 103,
    name: 'Smart Coffee Maker',
    category: 'Home & Kitchen',
    price: 129.99,
    discountPrice: 99.99,
    rating: 4.8,
    reviewCount: 234,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80',
  },
];

const CategoriesPage = () => {
  const { categories: categoriesData } = useSelector((state) => state.category);
  const [categories, setCategories] = useState(categoriesData);

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [filters, setFilters] = useState({
    showFeatured: false,
    showTrending: false,
    minProducts: 0,
    sortBy: 'name',
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter categories based on search and filters
  useEffect(() => {
    let filtered = categoriesData;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.subcategories.some((sub) =>
            sub.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Featured filter
    if (filters.showFeatured) {
      filtered = filtered.filter((cat) => cat.featured);
    }

    // Trending filter
    if (filters.showTrending) {
      filtered = filtered.filter((cat) => cat.trending);
    }

    // Min products filter
    if (filters.minProducts > 0) {
      filtered = filtered.filter(
        (cat) => cat.totalProducts >= filters.minProducts
      );
    }

    // Sort categories
    // filtered.sort((a, b) => {
    //   switch (filters.sortBy) {
    //     case 'name':
    //       return a.name.localeCompare(b.name);
    //     case 'products-high':
    //       return b.totalProducts - a.totalProducts;
    //     case 'products-low':
    //       return a.totalProducts - b.totalProducts;
    //     case 'featured':
    //       return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    //     case 'trending':
    //       return (b.trending ? 1 : 0) - (a.trending ? 1 : 0);
    //     default:
    //       return 0;
    //   }
    // });

    setCategories(filtered);
  }, [searchTerm, filters, categoriesData]);

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setFilters({
      showFeatured: false,
      showTrending: false,
      minProducts: 0,
      sortBy: 'name',
    });
    setSearchTerm('');
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}k`;
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="mb-8">
          <div className="bg-linear-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">
              Discover Amazing Products
            </h2>
            <p className="text-lg opacity-90 mb-6">
              Explore thousands of products across diverse categories
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-white/70 hover:text-white" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  Clear all
                </button>
              </div>

              {/* Quick Filters */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Quick Filters
                  </h4>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.showFeatured}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            showFeatured: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Featured Only
                      </span>
                      <span className="ml-auto text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {categoriesData.filter((cat) => cat.featured).length}
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={filters.showTrending}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            showTrending: e.target.checked,
                          })
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Trending Only
                      </span>
                      <TrendingUp className="ml-auto w-4 h-4 text-orange-500" />
                    </label>
                  </div>
                </div>

                {/* Sort By */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Sort By
                  </h4>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters({ ...filters, sortBy: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="name">Name (A-Z)</option>
                    <option value="products-high">Most Products</option>
                    <option value="products-low">Fewest Products</option>
                    <option value="featured">Featured First</option>
                    <option value="trending">Trending First</option>
                  </select>
                </div>

                {/* Product Range */}
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Min Products: {filters.minProducts}+
                  </h4>
                  <input
                    type="range"
                    min="0"
                    max="2000"
                    step="100"
                    value={filters.minProducts}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minProducts: parseInt(e.target.value),
                      })
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>0</span>
                    <span>500</span>
                    <span>1000</span>
                    <span>1500</span>
                    <span>2000+</span>
                  </div>
                </div>
              </div>

              {/* Active Filters */}
              {(filters.showFeatured ||
                filters.showTrending ||
                filters.minProducts > 0) && (
                <div className="mt-6 pt-6 border-t">
                  <h4 className="text-sm font-medium text-gray-900 mb-3">
                    Active Filters
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {filters.showFeatured && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                        Featured
                        <button
                          onClick={() =>
                            setFilters({ ...filters, showFeatured: false })
                          }
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.showTrending && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                        Trending
                        <button
                          onClick={() =>
                            setFilters({ ...filters, showTrending: false })
                          }
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.minProducts > 0 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 text-green-800">
                        {filters.minProducts}+ Products
                        <button
                          onClick={() =>
                            setFilters({ ...filters, minProducts: 0 })
                          }
                          className="ml-2"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Quick Stats */}
              <div className="mt-6 pt-6 border-t">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  Quick Stats
                </h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Categories shown:</span>
                    <span className="font-medium">{categories.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total products:</span>
                    <span className="font-medium">
                      {formatNumber(
                        categories.reduce(
                          (sum, cat) => sum + cat.totalProducts,
                          0
                        )
                      )}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {/* View Controls */}
            <div className="flex flex-wrap items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                >
                  <List className="w-5 h-5" />
                </button>
                <span className="text-sm text-gray-600">
                  Showing {categories.length} categories
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </button>
              </div>
            </div>

            {/* Mobile Filters (only show on mobile when toggled) */}
            {isFilterOpen && (
              <div className="lg:hidden mb-6 bg-white rounded-xl shadow-sm p-6">
                {/* Same filter content as sidebar */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Filters
                  </h3>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <X className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {/* ... include filter components here ... */}
              </div>
            )}

            <CategoriesSection />

            {/* Empty State */}
            {categories.length === 0 && (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No categories found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filters
                </p>
                <button
                  onClick={clearFilters}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}

            {/* Featured Products Section */}
            {!selectedCategory && (
              <div className="mt-12">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Featured Products
                  </h2>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    View all products →
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {featuredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white rounded-xl shadow-sm p-4"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-48 object-cover rounded-lg mb-4"
                      />
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {product.name}
                      </h4>
                      <div className="flex items-center mb-3">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating)
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm text-gray-600 ml-2">
                          ({product.reviewCount})
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-lg font-bold text-gray-900">
                            ${product.discountPrice}
                          </span>
                          {product.discountPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ${product.price}
                            </span>
                          )}
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Category Detail Modal */}
      {selectedCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-gray-600">
                    {selectedCategory.description}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedCategory.image}
                    alt={selectedCategory.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Subcategories
                  </h4>
                  <div className="space-y-2">
                    {selectedCategory.subcategories.map((sub) => (
                      <div
                        key={sub.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <span className="font-medium">{sub.name}</span>
                        <span className="text-sm text-gray-500">
                          {sub.count} products
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Close
                </button>
                <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Browse {selectedCategory.name}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoriesPage;
