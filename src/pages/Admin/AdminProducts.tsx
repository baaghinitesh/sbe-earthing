import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  MoreVertical,
  Tag,
  Grid3X3,
  List,
  Copy,
  Star,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from 'lucide-react'

import toast from 'react-hot-toast'

// Mock product data
const mockProducts = [
  {
    id: 1,
    name: 'Copper Bonded Earth Rod',
    slug: 'copper-bonded-earth-rod',
    category: 'Earth Rods',
    shortDescription: 'High-quality copper bonded earth rod for reliable grounding systems',
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 1, name: '14.2mm x 3000mm', price: 850, stock: 'In Stock' },
      { id: 2, name: '17.2mm x 3000mm', price: 1050, stock: 'In Stock' },
      { id: 3, name: '14.2mm x 4500mm', price: 1200, stock: 'Limited Stock' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop', isPrimary: true }
    ],
    createdAt: '2024-01-10T08:00:00Z',
    updatedAt: '2024-01-15T14:30:00Z'
  },
  {
    id: 2,
    name: 'Chemical Earth Electrode',
    slug: 'chemical-earth-electrode',
    category: 'Electrodes',
    shortDescription: 'Advanced chemical earthing electrode for superior conductivity',
    status: 'active',
    isFeatured: false,
    variants: [
      { id: 4, name: '50mm x 3000mm', price: 3500, stock: 'In Stock' },
      { id: 5, name: '75mm x 3000mm', price: 5200, stock: 'In Stock' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df6b?w=300&h=200&fit=crop', isPrimary: true }
    ],
    createdAt: '2024-01-08T10:15:00Z',
    updatedAt: '2024-01-14T09:45:00Z'
  },
  {
    id: 3,
    name: 'GI Earth Strip',
    slug: 'gi-earth-strip',
    category: 'Strips & Accessories',
    shortDescription: 'Galvanized iron earth strip for electrical grounding connections',
    status: 'draft',
    isFeatured: false,
    variants: [
      { id: 6, name: '25mm x 3mm', price: 120, stock: 'In Stock' },
      { id: 7, name: '40mm x 6mm', price: 200, stock: 'Out of Stock' },
      { id: 8, name: '50mm x 6mm', price: 280, stock: 'In Stock' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop', isPrimary: true }
    ],
    createdAt: '2024-01-12T16:20:00Z',
    updatedAt: '2024-01-13T11:10:00Z'
  },
  {
    id: 4,
    name: 'Copper Earth Strip',
    slug: 'copper-earth-strip',
    category: 'Strips & Accessories',
    shortDescription: 'Pure copper earth strip for high conductivity applications',
    status: 'active',
    isFeatured: true,
    variants: [
      { id: 9, name: '25mm x 3mm', price: 180, stock: 'In Stock' },
      { id: 10, name: '32mm x 3mm', price: 220, stock: 'Limited Stock' }
    ],
    images: [
      { url: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop', isPrimary: true }
    ],
    createdAt: '2024-01-05T12:45:00Z',
    updatedAt: '2024-01-11T15:00:00Z'
  }
]

const categories = [
  'All Categories',
  'Earth Rods',
  'Electrodes', 
  'Strips & Accessories',
  'Clamps & Connectors',
  'Testing Equipment'
]

interface Product {
  id: number
  name: string
  slug: string
  category: string
  shortDescription: string
  status: 'active' | 'draft' | 'archived'
  isFeatured: boolean
  variants: Array<{
    id: number
    name: string
    price: number
    stock: string
  }>
  images: Array<{
    url: string
    isPrimary: boolean
  }>
  createdAt: string
  updatedAt: string
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getStatusColor(status: string) {
  switch (status) {
    case 'active':
      return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400'
    case 'draft':
      return 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400'
    case 'archived':
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
    default:
      return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-400'
  }
}

function getStockColor(stock: string) {
  switch (stock) {
    case 'In Stock':
      return 'text-green-600 dark:text-green-400'
    case 'Limited Stock':
      return 'text-yellow-600 dark:text-yellow-400'
    case 'Out of Stock':
      return 'text-red-600 dark:text-red-400'
    default:
      return 'text-gray-600 dark:text-gray-400'
  }
}

interface ProductActionsProps {
  product: Product
  onEdit: (product: Product) => void
  onDelete: (product: Product) => void
  onToggleStatus: (product: Product) => void
  onDuplicate: (product: Product) => void
}

function ProductActions({ product, onEdit, onDelete, onToggleStatus, onDuplicate }: ProductActionsProps) {
  const [showMenu, setShowMenu] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-10"
          >
            <button
              onClick={() => {
                onEdit(product)
                setShowMenu(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Edit className="w-4 h-4 mr-3" />
              Edit Product
            </button>
            <Link
              to={`/products/${product.slug}`}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => setShowMenu(false)}
            >
              <Eye className="w-4 h-4 mr-3" />
              View Product
            </Link>
            <button
              onClick={() => {
                onDuplicate(product)
                setShowMenu(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Copy className="w-4 h-4 mr-3" />
              Duplicate
            </button>
            <button
              onClick={() => {
                onToggleStatus(product)
                setShowMenu(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              {product.status === 'active' ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-3" />
                  Mark as Draft
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-3" />
                  Mark as Active
                </>
              )}
            </button>
            <div className="border-t border-gray-200 dark:border-gray-700 my-1"></div>
            <button
              onClick={() => {
                onDelete(product)
                setShowMenu(false)
              }}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 className="w-4 h-4 mr-3" />
              Delete Product
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All Categories')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list')
  const [showFilters, setShowFilters] = useState(false)

  // Filter products
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All Categories' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleEdit = (product: Product) => {
    toast.success(`Edit ${product.name} - Feature coming soon!`)
  }

  const handleDelete = (product: Product) => {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      setProducts(products.filter(p => p.id !== product.id))
      toast.success('Product deleted successfully')
    }
  }

  const handleToggleStatus = (product: Product) => {
    const newStatus = product.status === 'active' ? 'draft' : 'active'
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, status: newStatus } : p
    ))
    toast.success(`Product ${newStatus === 'active' ? 'activated' : 'deactivated'} successfully`)
  }

  const handleDuplicate = (product: Product) => {
    const duplicatedProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id)) + 1,
      name: `${product.name} (Copy)`,
      slug: `${product.slug}-copy`,
      status: 'draft' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    setProducts([duplicatedProduct, ...products])
    toast.success('Product duplicated successfully')
  }

  return (
    <div>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Products Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your product catalog, inventory, and product information
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex items-center space-x-3">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
            </div>
            <Link
              to="/admin/products/new"
              className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-sm font-medium rounded-lg hover:from-primary-700 hover:to-secondary-700 transition-all"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Product
            </Link>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            {/* Search */}
            <div className="flex-1 max-w-lg">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Status
                    </label>
                    <select
                      value={selectedStatus}
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="draft">Draft</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Products List/Grid */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {searchQuery || selectedCategory !== 'All Categories' || selectedStatus !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first product'
                }
              </p>
              <Link
                to="/admin/products/new"
                className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700">
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Variants
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Updated
                    </th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {filteredProducts.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                            {product.images[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {product.name}
                              </p>
                              {product.isFeatured && (
                                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                              )}
                            </div>
                            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                              {product.shortDescription}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300">
                          {product.category}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {product.status.charAt(0).toUpperCase() + product.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {product.variants.length} variants
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          ₹{Math.min(...product.variants.map(v => v.price)).toLocaleString()} - 
                          ₹{Math.max(...product.variants.map(v => v.price)).toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                        {formatDate(product.updatedAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ProductActions
                          product={product}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleStatus={handleToggleStatus}
                          onDuplicate={handleDuplicate}
                        />
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mr-3">
                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.status === 'active').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Active Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mr-3">
                <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.status === 'draft').length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Draft Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mr-3">
                <Star className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {products.filter(p => p.isFeatured).length}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Featured Products</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mr-3">
                <TrendingUp className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {categories.length - 1}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}