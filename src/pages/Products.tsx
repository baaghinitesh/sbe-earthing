import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Filter, Grid, List, Search, ShoppingCart, Eye } from 'lucide-react'

// Example products data with Indian electrical products
const sampleProducts = [
  {
    id: 1,
    name: 'Copper Bonded Earth Rod',
    slug: 'copper-bonded-earth-rod',
    category: 'Earth Rods',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop'
    ],
    shortSpec: '14.2mm dia x 3000mm length, High conductivity',
    minPrice: 850,
    maxPrice: 1200,
    rating: 4.8,
    reviews: 156
  },
  {
    id: 2,
    name: 'GI Earth Electrode',
    slug: 'gi-earth-electrode',
    category: 'Earth Electrodes',
    images: [
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop'
    ],
    shortSpec: '40mm x 40mm x 6mm, IS 3043 certified',
    minPrice: 420,
    maxPrice: 580,
    rating: 4.6,
    reviews: 98
  },
  {
    id: 3,
    name: 'Lightning Protection System',
    slug: 'lightning-protection-system',
    category: 'Lightning Arresters',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=400&fit=crop'
    ],
    shortSpec: 'ESE Air Terminal, 60m protection radius',
    minPrice: 15000,
    maxPrice: 25000,
    rating: 4.9,
    reviews: 45
  },
  {
    id: 4,
    name: 'Chemical Earth Electrode',
    slug: 'chemical-earth-electrode',
    category: 'Chemical Earthing',
    images: [
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df6b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&h=400&fit=crop'
    ],
    shortSpec: 'Maintenance-free, 15-year warranty',
    minPrice: 3500,
    maxPrice: 5500,
    rating: 4.7,
    reviews: 67
  },
  {
    id: 5,
    name: 'Copper Earth Strip',
    slug: 'copper-earth-strip',
    category: 'Earthing Strips',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&h=400&fit=crop'
    ],
    shortSpec: '25mm x 3mm x 1000mm, 99.9% pure copper',
    minPrice: 180,
    maxPrice: 250,
    rating: 4.5,
    reviews: 234
  },
  {
    id: 6,
    name: 'Surge Protection Device',
    slug: 'surge-protection-device',
    category: 'Surge Arresters',
    images: [
      'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df6b?w=500&h=400&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=400&fit=crop'
    ],
    shortSpec: 'Class I+II+III, 40kA surge capacity',
    minPrice: 2800,
    maxPrice: 4200,
    rating: 4.8,
    reviews: 89
  }
]

const categories = ['All', 'Earth Rods', 'Earth Electrodes', 'Lightning Arresters', 'Chemical Earthing', 'Earthing Strips', 'Surge Arresters']

// Auto-scroll image component
function AutoScrollImages({ images, alt }: { images: string[], alt: string }) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (images.length <= 1) return
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length)
    }, 2000) // Change image every 2 seconds

    return () => clearInterval(interval)
  }, [images.length])

  return (
    <div className="relative w-full h-48 overflow-hidden rounded-t-lg">
      {images.map((image, index) => (
        <motion.img
          key={index}
          src={image}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0 }}
          animate={{ opacity: index === currentIndex ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
      {/* Image indicators */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
        {images.map((_, index) => (
          <div
            key={index}
            className={`w-1.5 h-1.5 rounded-full ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}

// Product Card Component
function ProductCard({ product }: { product: typeof sampleProducts[0] }) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden card-hover group"
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/products/${product.slug}`} className="block">
        {/* Auto-scrolling images */}
        <AutoScrollImages images={product.images} alt={product.name} />
        
        {/* Product Info */}
        <div className="p-4">
          {/* Category Badge */}
          <div className="mb-2">
            <span className="inline-block px-2 py-1 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {product.name}
          </h3>

          {/* Short Specification */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {product.shortSpec}
          </p>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-yellow-400'
                      : 'text-gray-300 dark:text-gray-600'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                {product.rating} ({product.reviews})
              </span>
            </div>
          </div>

          {/* Price Range */}
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold text-gray-900 dark:text-white">
              ₹{product.minPrice.toLocaleString()} - ₹{product.maxPrice.toLocaleString()}
            </div>
            
            {/* Action buttons appear on hover */}
            <motion.div
              className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity"
              animate={{ opacity: isHovered ? 1 : 0 }}
            >
              <button className="p-2 bg-primary-600 text-white rounded-full hover:bg-primary-700 transition-colors">
                <Eye className="w-4 h-4" />
              </button>
              <button className="p-2 bg-secondary-600 text-white rounded-full hover:bg-secondary-700 transition-colors">
                <ShoppingCart className="w-4 h-4" />
              </button>
            </motion.div>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

export default function Products() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')

  // Filter products based on category and search
  const filteredProducts = sampleProducts.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.shortSpec.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Products
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our comprehensive range of earthing and lightning protection solutions
            </p>
          </motion.div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between mb-6">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* View Mode Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === 'grid'
              ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
              : 'grid-cols-1'
          }`}
          layout
        >
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>

        {/* No Results */}
        {filteredProducts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Filter className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}