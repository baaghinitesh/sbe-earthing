import { useState, useEffect } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function WhatsAppFloat() {
  const [isVisible, setIsVisible] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)

  // Show after 3 seconds and when scrolled down a bit
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 3000)
    
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setIsVisible(true)
      }
    }
    
    window.addEventListener('scroll', handleScroll)
    
    return () => {
      clearTimeout(timer)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  // Auto show tooltip after component mounts
  useEffect(() => {
    if (isVisible) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true)
        setTimeout(() => setShowTooltip(false), 5000) // Hide after 5 seconds
      }, 1000)
      
      return () => clearTimeout(tooltipTimer)
    }
  }, [isVisible])

  const handleWhatsAppClick = () => {
    const phoneNumber = '+918578861071' // SBE Earthing WhatsApp number
    const message = encodeURIComponent(
      'Hello! I am interested in SBE Earthing products and services. Could you please provide more information?'
    )
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')
    
    setShowTooltip(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ 
            type: 'spring', 
            stiffness: 260, 
            damping: 20 
          }}
          className="fixed bottom-6 right-6 z-50"
        >
          <div className="relative">
            {/* Tooltip */}
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, x: 20, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 20, scale: 0.8 }}
                  className="absolute right-16 bottom-0 mb-2 mr-2"
                >
                  <div className="glass-card px-4 py-3 rounded-lg shadow-xl min-w-48 max-w-64">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          Need Help?
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Chat with us on WhatsApp for instant support!
                        </p>
                      </div>
                      <button
                        onClick={() => setShowTooltip(false)}
                        className="text-gray-400 hover:text-gray-600 ml-2 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    
                    {/* Arrow */}
                    <div className="absolute right-4 bottom-full mb-1">
                      <div className="w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-white/80 dark:border-b-gray-900/80"></div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* WhatsApp Button */}
            <motion.button
              onClick={handleWhatsAppClick}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-2xl flex items-center justify-center transition-colors duration-200 relative overflow-hidden group"
              aria-label="Chat on WhatsApp"
            >
              {/* Pulse animation */}
              <div className="absolute inset-0 rounded-full bg-green-500 animate-ping opacity-20"></div>
              
              {/* Icon */}
              <MessageCircle className="w-7 h-7 relative z-10" />
              
              {/* Hover effect */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-200"></div>
            </motion.button>

            {/* Online indicator */}
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white dark:border-gray-900 animate-pulse"></div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}