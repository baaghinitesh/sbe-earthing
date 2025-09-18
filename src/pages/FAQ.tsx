// React import not needed with new JSX transform
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Search, HelpCircle, MessageCircle, Phone } from 'lucide-react'

const faqCategories = [
  'All',
  'Products',
  'Installation',
  'Maintenance',
  'Technical',
  'Pricing',
  'Warranty'
]

const faqData = [
  {
    id: 1,
    category: 'Products',
    question: 'What types of earthing products does SBE offer?',
    answer: 'SBE offers a comprehensive range of earthing products including Copper Bonded Earth Rods, GI Earth Electrodes, Chemical Earth Electrodes, Lightning Protection Systems, Copper Earth Strips, Surge Protection Devices, and various earthing accessories. All our products comply with IS and IEC standards.'
  },
  {
    id: 2,
    category: 'Installation',
    question: 'Do you provide installation services for earthing systems?',
    answer: 'Yes, we provide complete installation services through our network of certified technicians across India. Our installation team ensures proper grounding as per IS 3043:2018 standards and provides post-installation testing and certification.'
  },
  {
    id: 3,
    category: 'Technical',
    question: 'What is the difference between conventional and chemical earthing?',
    answer: 'Conventional earthing uses metal electrodes buried in natural soil, while chemical earthing uses specially formulated compounds to enhance conductivity. Chemical earthing provides lower resistance, requires less maintenance, and works better in rocky or sandy soil conditions. It typically lasts 15+ years with minimal maintenance.'
  },
  {
    id: 4,
    category: 'Warranty',
    question: 'What warranty do you provide on earthing products?',
    answer: 'We provide comprehensive warranty coverage: 15 years on Copper Bonded Earth Rods, 10 years on Chemical Earth Electrodes, 5 years on Lightning Protection Systems, and 3 years on Surge Protection Devices. All warranties cover manufacturing defects and performance issues.'
  },
  {
    id: 5,
    category: 'Maintenance',
    question: 'How often should earthing systems be maintained?',
    answer: 'We recommend annual maintenance checks for all earthing systems. This includes resistance testing, visual inspection of connections, and cleaning of electrodes. Chemical earthing systems require minimal maintenance, while conventional systems may need more frequent attention in corrosive soil conditions.'
  },
  {
    id: 6,
    category: 'Technical',
    question: 'What is the ideal earth resistance value?',
    answer: 'The ideal earth resistance depends on the application: Residential buildings: <5 ohms, Commercial buildings: <3 ohms, Industrial installations: <1 ohm, Substations: <0.5 ohms, Lightning protection: <10 ohms. These values ensure safety and proper equipment protection.'
  },
  {
    id: 7,
    category: 'Pricing',
    question: 'How do you calculate pricing for earthing systems?',
    answer: 'Pricing depends on several factors including site conditions, required resistance values, soil resistivity, installation complexity, and system size. We provide detailed quotations after site assessment. Bulk orders and long-term contracts receive special pricing.'
  },
  {
    id: 8,
    category: 'Installation',
    question: 'What soil testing is required before installation?',
    answer: 'We conduct comprehensive soil resistivity testing using the Wenner 4-point method at various depths. This helps determine the optimal electrode configuration, depth requirements, and whether chemical enhancement is needed. Soil pH and moisture content are also analyzed.'
  },
  {
    id: 9,
    category: 'Products',
    question: 'Are your products certified and compliant with Indian standards?',
    answer: 'Yes, all SBE products are certified and comply with relevant Indian standards including IS 3043:2018 for earthing, IS/IEC 62305 for lightning protection, and IS 13032 for surge protection devices. We also meet international standards like IEC 62561.'
  },
  {
    id: 10,
    category: 'Technical',
    question: 'Can earthing systems be upgraded or expanded?',
    answer: 'Yes, existing earthing systems can be upgraded or expanded. We assess the current system performance and recommend additions or modifications to meet new requirements. This is often more cost-effective than complete replacement.'
  },
  {
    id: 11,
    category: 'Maintenance',
    question: 'What are signs that an earthing system needs attention?',
    answer: 'Warning signs include: Increased earth resistance readings, Frequent electrical equipment failures, Visible corrosion on electrodes, Loose or damaged connections, Equipment experiencing electrical noise, and Failure in surge protection devices.'
  },
  {
    id: 12,
    category: 'Pricing',
    question: 'Do you offer financing options for large projects?',
    answer: 'Yes, we offer flexible payment terms and financing options for large projects. These include staged payments linked to project milestones, extended credit terms for established clients, and partnership with financial institutions for project funding.'
  }
]

function FAQItem({ faq, isOpen, onToggle }: { 
  faq: typeof faqData[0], 
  isOpen: boolean, 
  onToggle: () => void 
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
    >
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            <span className="px-3 py-1 text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 dark:text-primary-400 rounded-full">
              {faq.category}
            </span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {faq.question}
          </h3>
        </div>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400" />
        </motion.div>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-4 text-gray-600 dark:text-gray-400 leading-relaxed">
              {faq.answer}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function FAQ() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  // Filter FAQs based on category and search
  const filteredFAQs = faqData.filter(faq => {
    const matchesCategory = selectedCategory === 'All' || faq.category === selectedCategory
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const toggleItem = (id: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id)
    } else {
      newOpenItems.add(id)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <HelpCircle className="w-16 h-16 text-white/80 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Find answers to common questions about our earthing products, installation, maintenance, and services.
            </p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Search and Filters */}
        <div className="mb-12">
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white shadow-lg"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {faqCategories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
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

        {/* FAQ Items */}
        <div className="space-y-4 mb-16">
          {filteredFAQs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.05 }}
            >
              <FAQItem
                faq={faq}
                isOpen={openItems.has(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredFAQs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <HelpCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No FAQs Found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search terms or browse different categories.
            </p>
          </motion.div>
        )}

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Still Have Questions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8 text-center">
            <MessageCircle className="w-12 h-12 text-primary-600 dark:text-primary-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              Still Have Questions?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Can't find what you're looking for? Our expert team is here to help with personalized answers.
            </p>
            <motion.a
              href="/contact"
              className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-5 h-5" />
              <span>Contact Us</span>
            </motion.a>
          </div>

          {/* Technical Support */}
          <div className="bg-gradient-to-br from-secondary-600 to-secondary-700 rounded-lg shadow-xl p-8 text-center text-white">
            <Phone className="w-12 h-12 text-white/80 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-4">
              Need Technical Support?
            </h3>
            <p className="text-white/90 mb-6">
              Get immediate assistance from our technical experts for installation and troubleshooting.
            </p>
            <motion.a
              href="tel:+919999789012"
              className="inline-flex items-center space-x-2 bg-white text-secondary-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Phone className="w-5 h-5" />
              <span>Call Support</span>
            </motion.a>
          </div>
        </motion.div>

        {/* Popular Topics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-8">
            Popular Topics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Product Selection',
                description: 'How to choose the right earthing solution for your needs',
                category: 'Products'
              },
              {
                title: 'Installation Guide',
                description: 'Step-by-step installation procedures and best practices',
                category: 'Installation'
              },
              {
                title: 'Maintenance Tips',
                description: 'Keeping your earthing system in optimal condition',
                category: 'Maintenance'
              }
            ].map((topic, index) => (
              <motion.button
                key={topic.title}
                onClick={() => setSelectedCategory(topic.category)}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-left hover:shadow-xl transition-all group"
                whileHover={{ y: -4 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                  {topic.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {topic.description}
                </p>
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}