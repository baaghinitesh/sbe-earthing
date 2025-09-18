import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn, Download, FileText, Star, Share2, Heart,
  ChevronLeft, ChevronRight, Phone, Mail, MessageSquare,
  ShoppingCart, Eye, Check, X, ArrowLeft
} from 'lucide-react'

// Sample product data with variants
const sampleProductData = {
  'copper-bonded-earth-rod': {
    id: 1,
    name: 'Copper Bonded Earth Rod',
    category: 'Earth Rods',
    images: [
      'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
      'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=800&h=600&fit=crop'
    ],
    variants: [
      {
        id: 'cb-14-3000',
        name: '14.2mm x 3000mm',
        price: 850,
        sku: 'SBE-CBR-14-3000',
        stock: 'In Stock',
        description: 'Standard size for residential applications'
      },
      {
        id: 'cb-17-3000',
        name: '17.2mm x 3000mm',
        price: 1050,
        sku: 'SBE-CBR-17-3000',
        stock: 'In Stock',
        description: 'Heavy duty for commercial use'
      },
      {
        id: 'cb-14-4500',
        name: '14.2mm x 4500mm',
        price: 1200,
        sku: 'SBE-CBR-14-4500',
        stock: 'Limited Stock',
        description: 'Extended length for deep grounding'
      }
    ],
    pdfManual: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    rating: 4.8,
    reviews: 156,
    description: {
      overview: 'Our Copper Bonded Earth Rods are manufactured using high-grade steel core with molecularly bonded copper coating. These rods provide excellent corrosion resistance and superior conductivity for effective earthing systems.',
      features: [
        'High conductivity copper bonding',
        'Corrosion resistant steel core',
        'Molecularly bonded copper coating',
        'IS 3043:2018 compliant',
        'Easy installation with driving head',
        '15-year warranty against manufacturing defects'
      ],
      applications: [
        'Residential earthing systems',
        'Commercial building grounding',
        'Industrial electrical installations',
        'Substation earthing',
        'Lightning protection systems'
      ],
      specifications: {
        'Core Material': 'High Carbon Steel',
        'Coating': '99.9% Pure Copper',
        'Coating Thickness': '254 microns minimum',
        'Tensile Strength': '600 N/mm²',
        'Conductivity': '100% IACS',
        'Standard': 'IS 3043:2018, IEC 62561-2'
      }
    }
  }
}

// Related products
const relatedProducts = [
  {
    id: 2,
    name: 'GI Earth Electrode',
    image: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=200&fit=crop',
    price: 420,
    rating: 4.6
  },
  {
    id: 3,
    name: 'Chemical Earth Electrode',
    image: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df6b?w=300&h=200&fit=crop',
    price: 3500,
    rating: 4.7
  },
  {
    id: 4,
    name: 'Copper Earth Strip',
    image: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop',
    price: 180,
    rating: 4.5
  }
]

// Image Gallery Component with Zoom
function ImageGallery({ images, productName }: { images: string[], productName: string }) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPosition({ x, y })
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div 
        className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-zoom-in"
        onMouseEnter={() => setIsZoomed(true)}
        onMouseLeave={() => setIsZoomed(false)}
        onMouseMove={handleMouseMove}
      >
        <img
          src={images[selectedImage]}
          alt={productName}
          className={`w-full h-full object-cover transition-transform duration-300 ${
            isZoomed ? 'scale-150' : 'scale-100'
          }`}
          style={
            isZoomed
              ? {
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }
              : {}
          }
        />
        <div className="absolute top-4 right-4">
          <button className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors">
            <ZoomIn className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Thumbnail Navigation */}
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`relative w-full h-20 rounded-lg overflow-hidden border-2 transition-colors ${
              selectedImage === index
                ? 'border-primary-600'
                : 'border-gray-200 dark:border-gray-600'
            }`}
          >
            <img
              src={image}
              alt={`${productName} ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  )
}

// Enquiry Form Modal
function EnquiryModal({ 
  isOpen, 
  onClose, 
  productName, 
  selectedVariant 
}: { 
  isOpen: boolean
  onClose: () => void
  productName: string
  selectedVariant: any
}) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  })
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSubmitted(true)
    setTimeout(() => {
      setIsSubmitted(false)
      onClose()
      setFormData({ name: '', phone: '', email: '', message: '' })
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6"
          onClick={(e) => e.stopPropagation()}
        >
          {!isSubmitted ? (
            <>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Product Enquiry
                </h3>
                <button
                  onClick={onClose}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{productName}</p>
                {selectedVariant && (
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Variant: {selectedVariant.name} - ₹{selectedVariant.price.toLocaleString()}
                  </p>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Any specific requirements or questions..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors font-medium"
                >
                  Send Enquiry
                </button>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Enquiry Sent!
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                We'll get back to you within 24 hours.
              </p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

export default function ProductDetail() {
  const { slug } = useParams()
  const [selectedVariant, setSelectedVariant] = useState(0)
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  const product = slug ? sampleProductData[slug as keyof typeof sampleProductData] : null

  useEffect(() => {
    if (product) {
      setSelectedVariant(0)
    }
  }, [product])

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Product Not Found
          </h1>
          <Link 
            to="/products" 
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to Products
          </Link>
        </div>
      </div>
    )
  }

  const currentVariant = product.variants[selectedVariant]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Breadcrumb */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm">
            <Link to="/" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Home
            </Link>
            <span className="text-gray-400">/</span>
            <Link to="/products" className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              Products
            </Link>
            <span className="text-gray-400">/</span>
            <span className="text-gray-900 dark:text-white">{product.name}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link 
          to="/products"
          className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Left Side - Image Gallery */}
          <div>
            <ImageGallery images={product.images} productName={product.name} />
          </div>

          {/* Right Side - Product Info */}
          <div className="space-y-6">
            {/* Product Title & Rating */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="px-3 py-1 text-sm font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
                  {product.category}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {product.name}
              </h1>
              
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                    />
                  ))}
                  <span className="text-gray-600 dark:text-gray-400 ml-2">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Variant Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select Variant
              </label>
              <select
                value={selectedVariant}
                onChange={(e) => setSelectedVariant(Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {product.variants.map((variant, index) => (
                  <option key={variant.id} value={index}>
                    {variant.name} - ₹{variant.price.toLocaleString()}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {currentVariant.description}
              </p>
            </div>

            {/* Price & Stock */}
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl font-bold text-gray-900 dark:text-white">
                  ₹{currentVariant.price.toLocaleString()}
                </span>
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                  currentVariant.stock === 'In Stock'
                    ? 'text-green-700 bg-green-100 dark:text-green-400 dark:bg-green-900/20'
                    : 'text-yellow-700 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/20'
                }`}>
                  {currentVariant.stock}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                SKU: {currentVariant.sku}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={() => setIsEnquiryOpen(true)}
                className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-5 h-5" />
                <span>Send Enquiry</span>
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => window.open(product.pdfManual, '_blank')}
                  className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>See Manual</span>
                </button>
                <button className="flex items-center justify-center space-x-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <Share2 className="w-4 h-4" />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex space-x-8 px-6">
              {['overview', 'features', 'applications', 'specifications'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab
                      ? 'border-primary-600 text-primary-600'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && (
              <div className="prose dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {product.description.overview}
                </p>
              </div>
            )}

            {activeTab === 'features' && (
              <div>
                <ul className="space-y-3">
                  {product.description.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <Check className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'applications' && (
              <div>
                <ul className="space-y-3">
                  {product.description.applications.map((application, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" />
                      <span className="text-gray-700 dark:text-gray-300">{application}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <tbody>
                    {Object.entries(product.description.specifications).map(([key, value]) => (
                      <tr key={key} className="border-b border-gray-200 dark:border-gray-700">
                        <td className="py-3 pr-6 font-medium text-gray-900 dark:text-white">
                          {key}
                        </td>
                        <td className="py-3 text-gray-600 dark:text-gray-400">
                          {value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <motion.div
                key={relatedProduct.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                whileHover={{ y: -4 }}
              >
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {relatedProduct.name}
                  </h3>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ₹{relatedProduct.price.toLocaleString()}
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                        {relatedProduct.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        productName={product.name}
        selectedVariant={currentVariant}
      />
    </div>
  )
}