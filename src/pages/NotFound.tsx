// React import not needed with new JSX transform
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Home, Search } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              className="text-8xl font-bold text-primary-600 dark:text-primary-400"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              404
            </motion.div>
            <motion.div
              className="w-24 h-1 bg-gradient-to-r from-primary-600 to-secondary-600 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 96 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            />
          </div>

          {/* Error Message */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Page Not Found
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
              Oops! The page you're looking for doesn't exist.
            </p>
            <p className="text-gray-500 dark:text-gray-500">
              It might have been moved, deleted, or you entered the wrong URL.
            </p>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            
            <Link
              to="/products"
              className="inline-flex items-center space-x-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
            >
              <Search className="w-5 h-5" />
              <span>Browse Products</span>
            </Link>
          </motion.div>

          {/* Helpful Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700"
          >
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              Looking for something specific? Try these popular links:
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                to="/products"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Products
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/about"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                About Us
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/contact"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                Contact
              </Link>
              <span className="text-gray-300 dark:text-gray-600">|</span>
              <Link
                to="/faq"
                className="text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors"
              >
                FAQ
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}