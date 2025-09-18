// React import not needed with new JSX transform
import { useState } from 'react'
import { 
  MapPin, Phone, Mail, Clock, Send, CheckCircle, 
  MessageCircle, User, Building 
} from 'lucide-react'
import Form from '../components/Form/Form'
import ContextFormField from '../components/Form/ContextFormField'
import { commonValidationRules } from '../utils/validation'
import toast from 'react-hot-toast'

const contactInfo = [
  {
    icon: MapPin,
    title: 'Head Office',
    details: [
      'SBE Earthing Solutions Pvt. Ltd.',
      'Plot No. 45, Industrial Area',
      'Ghaziabad, Uttar Pradesh 201001',
      'India'
    ]
  },
  {
    icon: Phone,
    title: 'Phone Numbers',
    details: [
      '+91 9999-123-456 (Sales)',
      '+91 9999-789-012 (Support)',
      '+91 120-4567-890 (Office)'
    ]
  },
  {
    icon: Mail,
    title: 'Email Addresses',
    details: [
      'sales@sbeearthing.com',
      'support@sbeearthing.com',
      'info@sbeearthing.com'
    ]
  },
  {
    icon: Clock,
    title: 'Business Hours',
    details: [
      'Monday - Friday: 9:00 AM - 6:00 PM',
      'Saturday: 9:00 AM - 1:00 PM',
      'Sunday: Closed',
      'Emergency Support: 24/7'
    ]
  }
]

const officeLocations = [
  {
    city: 'Delhi NCR',
    address: 'Plot No. 45, Industrial Area, Ghaziabad, UP 201001',
    phone: '+91 120-4567-890',
    email: 'delhi@sbeearthing.com'
  },
  {
    city: 'Mumbai',
    address: 'Office No. 12, Andheri Industrial Estate, Mumbai, MH 400053',
    phone: '+91 22-2345-6789',
    email: 'mumbai@sbeearthing.com'
  },
  {
    city: 'Bangalore',
    address: 'Electronic City Phase 1, Bangalore, KA 560100',
    phone: '+91 80-1234-5678',
    email: 'bangalore@sbeearthing.com'
  },
  {
    city: 'Chennai',
    address: 'OMR Road, Thoraipakkam, Chennai, TN 600097',
    phone: '+91 44-9876-5432',
    email: 'chennai@sbeearthing.com'
  }
]

const enquiryTypes = [
  'Product Enquiry',
  'Technical Support',
  'Bulk Orders',
  'Partnership',
  'Service Request',
  'Complaint/Feedback',
  'Other'
]

export default function Contact() {
  const [isSubmitted, setIsSubmitted] = useState(false)

  const initialFormData = {
    name: '',
    email: '',
    phone: '',
    company: '',
    enquiryType: '',
    subject: '',
    message: ''
  }

  const validationRules = {
    name: { ...commonValidationRules.name, required: true },
    email: { ...commonValidationRules.email, required: true },
    phone: { ...commonValidationRules.phone, required: false },
    company: { required: false, minLength: 2, maxLength: 100 },
    enquiryType: { required: true },
    subject: { required: true, minLength: 5, maxLength: 100 },
    message: { required: true, minLength: 20, maxLength: 1000 }
  }

  const handleSubmit = async (data: any, isValid: boolean) => {
    if (!isValid) {
      toast.error('Please fix the errors in the form before submitting')
      return
    }
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setIsSubmitted(true)
      toast.success('Thank you for your message! We will get back to you soon.')
      
      // Reset form after showing success message
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">
              Have questions about our products or need technical support? Our team is here to help you find the perfect earthing solution.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return (
                    <div
                      key={info.title}
                      className="flex items-start space-x-4"
                    >
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                          {info.title}
                        </h3>
                        <div className="space-y-1">
                          {info.details.map((detail, detailIndex) => (
                            <p key={detailIndex} className="text-gray-600 dark:text-gray-400 text-sm">
                              {detail}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Office Locations */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Our Locations
              </h3>
              
              <div className="space-y-4">
                {officeLocations.map((location, index) => (
                  <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {location.city}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {location.address}
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <a
                        href={`tel:${location.phone}`}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        {location.phone}
                      </a>
                      <a
                        href={`mailto:${location.email}`}
                        className="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400"
                      >
                        {location.email}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Message Sent Successfully!
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Thank you for contacting us. We'll respond within 24 hours.
                    </p>
                  </div>
                ) : (
                  <Form
                    onSubmit={handleSubmit}
                    validationRules={validationRules}
                    initialData={initialFormData}
                    submitText="Send Message"
                    validateOnChange={true}
                    validateOnBlur={true}
                    resetOnSubmit={true}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ContextFormField
                        name="name"
                        label="Full Name"
                        type="text"
                        icon={User}
                        placeholder="Enter your full name"
                        required
                        validation={{ showSuccess: true }}
                      />

                      <ContextFormField
                        name="email"
                        label="Email Address"
                        type="email"
                        icon={Mail}
                        placeholder="Enter your email address"
                        required
                        validation={{ showOnFocus: true, showSuccess: true }}
                      />

                      <ContextFormField
                        name="phone"
                        label="Phone Number"
                        type="tel"
                        icon={Phone}
                        placeholder="Enter your phone number"
                        helpText="Optional - We may call you for clarifications"
                        validation={{ showOnFocus: true }}
                      />

                      <ContextFormField
                        name="company"
                        label="Company Name"
                        type="text"
                        icon={Building}
                        placeholder="Enter your company name"
                        helpText="Optional - Helps us understand your business needs"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <ContextFormField
                        name="enquiryType"
                        label="Enquiry Type"
                        type="select"
                        placeholder="Select enquiry type"
                        options={enquiryTypes.map(type => ({ label: type, value: type }))}
                        required
                      />

                      <ContextFormField
                        name="subject"
                        label="Subject"
                        type="text"
                        placeholder="Enter subject"
                        required
                        validation={{ showSuccess: true }}
                      />
                    </div>

                    <ContextFormField
                      name="message"
                      label="Message"
                      type="textarea"
                      icon={MessageCircle}
                      placeholder="Please describe your requirements or questions in detail..."
                      rows={6}
                      required
                      helpText="Minimum 20 characters - The more details you provide, the better we can assist you"
                      validation={{ showSuccess: true }}
                    />
                  </Form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-16">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="p-8 pb-0">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Find Our Head Office
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Visit us at our head office in Ghaziabad for direct consultation and product demonstrations.
              </p>
            </div>
            
            <div className="h-96 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              {/* Placeholder for map - would integrate with Google Maps API */}
              <div className="text-center">
                <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Interactive map would be integrated here
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
                  Plot No. 45, Industrial Area, Ghaziabad, UP 201001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Contact Cards */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white text-center">
            <Phone className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Call Us Now</h3>
            <p className="mb-4 opacity-90">Speak directly with our experts</p>
            <a
              href="tel:+919999123456"
              className="inline-block bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              +91 9999-123-456
            </a>
          </div>

          <div className="bg-gradient-to-br from-secondary-500 to-secondary-600 rounded-2xl p-6 text-white text-center">
            <Mail className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Email Us</h3>
            <p className="mb-4 opacity-90">Get detailed information via email</p>
            <a
              href="mailto:sales@sbeearthing.com"
              className="inline-block bg-white text-secondary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              sales@sbeearthing.com
            </a>
          </div>

          <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white text-center">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Live Chat</h3>
            <p className="mb-4 opacity-90">Get instant support online</p>
            <button className="inline-block bg-white text-accent-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Start Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}