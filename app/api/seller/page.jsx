'use client'

import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { 
  ShoppingBag, 
  Star, 
  Package, 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock, 
  Eye, 
  Heart, 
  Share2,
  Filter,
  Search,
  Grid,
  List,
  ChevronRight,
  CheckCircle,
  Truck,
  Shield,
  RefreshCw,
  MessageCircle,
  Phone,
  MapPin,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  ArrowUpRight,
  MoreVertical,
  Edit,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react'

export default function SellerShopPage() {
  const { user } = useSelector((state) => state.auth)
  const [activeTab, setActiveTab] = useState('all')
  const [viewMode, setViewMode] = useState('grid')
  const [sortBy, setSortBy] = useState('popularity')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Mock shop data
  const [shopStats, setShopStats] = useState({
    totalProducts: 124,
    monthlyOrders: 845,
    totalRevenue: 284500,
    totalCustomers: 3241,
    shopRating: 4.7,
    responseRate: '98%',
    followers: 12842,
  })

  // Mock products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: 'Wireless Bluetooth Headphones',
      category: 'Electronics',
      price: 2999,
      originalPrice: 3999,
      discount: 25,
      rating: 4.5,
      reviews: 124,
      sold: 452,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      stock: 45,
      featured: true,
      freeShipping: true,
    },
    {
      id: 2,
      name: 'Smart Watch Series 7',
      category: 'Electronics',
      price: 5999,
      originalPrice: 7999,
      discount: 25,
      rating: 4.8,
      reviews: 89,
      sold: 231,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w-400',
      stock: 23,
      featured: true,
      freeShipping: true,
    },
    // Add more products...
  ])

  // Mock categories
  const categories = [
    { id: 'all', name: 'All Products', count: 124 },
    { id: 'electronics', name: 'Electronics', count: 45 },
    { id: 'fashion', name: 'Fashion', count: 32 },
    { id: 'home', name: 'Home & Living', count: 28 },
    { id: 'beauty', name: 'Beauty', count: 19 },
  ]

  // Mock reviews
  const [recentReviews, setRecentReviews] = useState([
    {
      id: 1,
      userName: 'John Doe',
      rating: 5,
      comment: 'Excellent product quality and fast delivery!',
      date: '2 days ago',
      product: 'Wireless Headphones',
    },
    // Add more reviews...
  ])

  // Stats cards
  const statCards = [
    { icon: ShoppingBag, label: 'Total Products', value: shopStats.totalProducts, color: 'blue' },
    { icon: Package, label: 'Monthly Orders', value: shopStats.monthlyOrders, color: 'green' },
    { icon: DollarSign, label: 'Total Revenue', value: `₹${shopStats.totalRevenue.toLocaleString()}`, color: 'purple' },
    { icon: Users, label: 'Customers', value: shopStats.totalCustomers, color: 'orange' },
    { icon: Star, label: 'Shop Rating', value: shopStats.shopRating, color: 'yellow' },
    { icon: TrendingUp, label: 'Response Rate', value: shopStats.responseRate, color: 'pink' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Shop Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="flex items-center space-x-6">
              {/* Shop Logo */}
              <div className="relative">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-white p-2 shadow-2xl">
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </div>
              </div>

              {/* Shop Info */}
              <div className="text-white">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">{user?.shopName || "Tech Haven"}</h1>
                <div className="flex items-center space-x-4 mb-3">
                  <div className="flex items-center">
                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                    <span className="ml-1 font-semibold">{shopStats.shopRating}</span>
                    <span className="text-blue-100 ml-2">({shopStats.followers.toLocaleString()} followers)</span>
                  </div>
                  <div className="h-4 w-px bg-blue-400"></div>
                  <div className="flex items-center text-blue-100">
                    <MapPin className="w-4 h-4 mr-1" />
                    {user?.shopAddress || "Mumbai, Maharashtra"}
                  </div>
                </div>
                <p className="text-blue-100 max-w-2xl">
                  Premium electronics and gadgets store. 100% original products with warranty. Fast delivery across India.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mt-6 md:mt-0">
              <button className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors flex items-center">
                <MessageCircle className="w-5 h-5 mr-2" />
                Contact Seller
              </button>
              <button className="px-6 py-3 bg-blue-700 text-white font-semibold rounded-lg hover:bg-blue-800 transition-colors flex items-center">
                <Heart className="w-5 h-5 mr-2" />
                Follow Shop
              </button>
              <button className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors">
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Shop Stats */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <BarChart3 className="w-5 h-5 mr-2" />
                Shop Statistics
              </h3>
              <div className="space-y-4">
                {statCards.map((stat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg bg-${stat.color}-100 mr-3`}>
                        <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
                      </div>
                      <span className="text-gray-600">{stat.label}</span>
                    </div>
                    <span className="font-bold text-gray-900">{stat.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Shop Policies */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Shop Policies</h3>
              <div className="space-y-4">
                <div className="flex items-center text-green-600">
                  <Truck className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders above ₹499</p>
                  </div>
                </div>
                <div className="flex items-center text-blue-600">
                  <Shield className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">7 Days Return</p>
                    <p className="text-sm text-gray-500">Easy return policy</p>
                  </div>
                </div>
                <div className="flex items-center text-purple-600">
                  <RefreshCw className="w-5 h-5 mr-3" />
                  <div>
                    <p className="font-medium">Warranty</p>
                    <p className="text-sm text-gray-500">1 Year warranty on electronics</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="bg-white rounded-xl shadow-sm border p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Contact Info</h3>
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-3" />
                  <span>{user?.phone || "+91 9876543210"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-3" />
                  <span>{user?.shopAddress || "123 Tech Street, Mumbai"}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Globe className="w-4 h-4 mr-3" />
                  <span>www.techhaven.com</span>
                </div>
              </div>
              <div className="flex space-x-3 mt-4 pt-4 border-t">
                <button className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                  <Facebook className="w-5 h-5" />
                </button>
                <button className="p-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100">
                  <Instagram className="w-5 h-5" />
                </button>
                <button className="p-2 bg-blue-50 text-blue-400 rounded-lg hover:bg-blue-100">
                  <Twitter className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-xl shadow-sm border mb-6">
              <div className="flex flex-wrap items-center justify-between p-4">
                <div className="flex space-x-1 overflow-x-auto">
                  {['all', 'featured', 'best-selling', 'new', 'discount'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${activeTab === tab
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {tab.replace('-', ' ')}
                    </button>
                  ))}
                </div>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Edit className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <Settings className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 rounded-lg hover:bg-gray-100">
                    <HelpCircle className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-white rounded-xl shadow-sm border p-4 mb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search in your shop..."
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="popularity">Sort by Popularity</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest First</option>
                  </select>
                  <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2.5 ${viewMode === 'grid' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                      <Grid className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2.5 ${viewMode === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
                    >
                      <List className="w-5 h-5" />
                    </button>
                  </div>
                  <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center">
                    <Filter className="w-5 h-5 mr-2" />
                    Filters
                  </button>
                </div>
              </div>
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-4 mb-6 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${selectedCategory === category.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-600 hover:bg-gray-100 border'
                    }`}
                >
                  {category.name}
                  <span className={`ml-2 text-sm ${selectedCategory === category.id ? 'text-blue-100' : 'text-gray-400'}`}>
                    ({category.count})
                  </span>
                </button>
              ))}
            </div>

            {/* Products Grid */}
            <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'space-y-4'} gap-6`}>
              {products.map((product) => (
                <div key={product.id} className={`bg-white rounded-xl shadow-sm border overflow-hidden hover:shadow-md transition-shadow ${viewMode === 'list' ? 'flex' : ''}`}>
                  {/* Product Image */}
                  <div className={`relative ${viewMode === 'list' ? 'w-48 flex-shrink-0' : 'h-48'}`}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                    {product.discount > 0 && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                        {product.discount}% OFF
                      </div>
                    )}
                    {product.featured && (
                      <div className="absolute top-3 right-3 bg-blue-500 text-white px-2 py-1 rounded text-sm font-bold">
                        Featured
                      </div>
                    )}
                    <button className="absolute bottom-3 right-3 bg-white/90 p-2 rounded-full hover:bg-white">
                      <Heart className="w-5 h-5 text-gray-600" />
                    </button>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-sm text-gray-500">{product.category}</span>
                        <h3 className="font-semibold text-gray-900 mt-1">{product.name}</h3>
                        <div className="flex items-center mt-2">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500 ml-2">({product.reviews})</span>
                        </div>
                      </div>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>

                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-gray-900">₹{product.price.toLocaleString()}</span>
                        {product.originalPrice && (
                          <>
                            <span className="text-lg text-gray-400 line-through">₹{product.originalPrice.toLocaleString()}</span>
                            <span className="text-sm text-red-500 font-semibold">Save {product.discount}%</span>
                          </>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Package className="w-4 h-4 mr-1" />
                            {product.sold.toLocaleString()} sold
                          </div>
                          <div className="flex items-center mt-1">
                            <Clock className="w-4 h-4 mr-1" />
                            {product.stock} in stock
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-medium">
                            Edit
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center">
                            View
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {product.freeShipping && (
                      <div className="mt-3 pt-3 border-t border-gray-100">
                        <div className="flex items-center text-green-600">
                          <Truck className="w-4 h-4 mr-2" />
                          <span className="text-sm font-medium">Free Shipping</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="mt-8 text-center">
              <button className="px-8 py-3 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 font-semibold transition-colors">
                Load More Products
              </button>
            </div>

            {/* Recent Reviews */}
            <div className="mt-12 bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Customer Reviews</h3>
                <button className="text-blue-600 hover:text-blue-700 font-medium flex items-center">
                  View All Reviews
                  <ChevronRight className="w-5 h-5 ml-1" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recentReviews.map((review) => (
                  <div key={review.id} className="border border-gray-200 rounded-xl p-4 hover:border-blue-200 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="font-semibold text-blue-600">{review.userName.charAt(0)}</span>
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium text-gray-900">{review.userName}</h4>
                          <div className="flex items-center mt-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="mt-3 text-gray-600">{review.comment}</p>
                    <div className="mt-3 flex items-center text-sm text-gray-500">
                      <Package className="w-4 h-4 mr-1" />
                      Product: {review.product}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div>
              <h3 className="text-xl font-bold mb-2">{user?.shopName || "Tech Haven"}</h3>
              <p className="text-gray-400">Premium Electronics Store © 2024</p>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <span className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span>
              <span className="text-gray-400 hover:text-white cursor-pointer">Terms of Service</span>
              <span className="text-gray-400 hover:text-white cursor-pointer">Return Policy</span>
              <span className="text-gray-400 hover:text-white cursor-pointer">Contact Us</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}