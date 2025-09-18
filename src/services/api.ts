import axios from 'axios'

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin-token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth data on 401
      localStorage.removeItem('admin-token')
      localStorage.removeItem('admin-data')
      
      // Redirect to login if on admin page
      if (window.location.pathname.startsWith('/admin') && 
          !window.location.pathname.includes('/login')) {
        window.location.href = '/admin/login'
      }
    }
    
    return Promise.reject(error.response?.data || error.message)
  }
)

// Types
interface ValidationError {
  field: string
  message: string
}

interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: ValidationError[]
}

interface LoginData {
  email: string
  password: string
}

interface ContactData {
  name: string
  email: string
  phone: string
  subject: string
  message: string
  type?: string
  productId?: string
}

interface ProductData {
  name: string
  description: string
  shortDescription: string
  category: string
  images?: Array<{ url: string; alt: string; isPrimary: boolean }>
  variants?: Array<{
    id: string
    name: string
    price: number
    sku: string
    stock: string
    description: string
  }>
  specifications?: Array<{ key: string; value: string }>
  features?: string[]
  applications?: string[]
  certifications?: string[]
  manualPdf?: string
  tags?: string[]
  isActive?: boolean
  isFeatured?: boolean
  seoTitle?: string
  seoDescription?: string
  seoKeywords?: string[]
}

interface FAQData {
  question: string
  answer: string
  category: string
  tags?: string[]
  order?: number
  relatedProducts?: string[]
}

interface ThemeData {
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
  logo?: string
  favicon?: string
  companyName?: string
  companyTagline?: string
  contactInfo?: {
    email?: string
    phone?: string
    address?: string
  }
  socialMedia?: {
    facebook?: string
    twitter?: string
    linkedin?: string
    instagram?: string
  }
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
  }
}

// Admin API
export const adminApi = {
  login: (data: LoginData): Promise<ApiResponse> => 
    apiClient.post('/auth/login', data),
    
  initialize: (): Promise<ApiResponse> => 
    apiClient.post('/auth/init'),
    
  getDashboardStats: (): Promise<ApiResponse> => 
    apiClient.get('/admin/dashboard'),
}

// Products API
export const productsApi = {
  getAll: (params?: {
    page?: number
    limit?: number
    category?: string
    search?: string
    featured?: boolean
  }): Promise<ApiResponse> => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/products?${searchParams.toString()}`)
  },
  
  getBySlug: (slug: string): Promise<ApiResponse> => 
    apiClient.get(`/products/${slug}`),
    
  create: (data: ProductData): Promise<ApiResponse> => 
    apiClient.post('/products', data),
    
  update: (id: string, data: Partial<ProductData>): Promise<ApiResponse> => 
    apiClient.put(`/products/${id}`, data),
    
  delete: (id: string): Promise<ApiResponse> => 
    apiClient.delete(`/products/${id}`),
    
  getCategories: (): Promise<ApiResponse> => 
    apiClient.get('/products/categories/list'),
}

// Contact API
export const contactApi = {
  submit: (data: ContactData): Promise<ApiResponse> => 
    apiClient.post('/contact', data),
    
  getAll: (params?: {
    page?: number
    limit?: number
    status?: string
    type?: string
    isRead?: boolean
  }): Promise<ApiResponse> => {
    const searchParams = new URLSearchParams()
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, value.toString())
        }
      })
    }
    return apiClient.get(`/contact?${searchParams.toString()}`)
  },
  
  getById: (id: string): Promise<ApiResponse> => 
    apiClient.get(`/contact/${id}`),
    
  update: (id: string, data: {
    status?: string
    priority?: string
    adminNotes?: string[]
  }): Promise<ApiResponse> => 
    apiClient.put(`/contact/${id}`, data),
    
  delete: (id: string): Promise<ApiResponse> => 
    apiClient.delete(`/contact/${id}`),
}

// FAQ API
export const faqApi = {
  getAll: (category?: string): Promise<ApiResponse> => {
    const params = category ? `?category=${category}` : ''
    return apiClient.get(`/admin/faqs${params}`)
  },
  
  create: (data: FAQData): Promise<ApiResponse> => 
    apiClient.post('/admin/faqs', data),
    
  update: (id: string, data: Partial<FAQData>): Promise<ApiResponse> => 
    apiClient.put(`/admin/faqs/${id}`, data),
    
  delete: (id: string): Promise<ApiResponse> => 
    apiClient.delete(`/admin/faqs/${id}`),
}

// Theme API
export const themeApi = {
  get: (): Promise<ApiResponse> => 
    apiClient.get('/admin/theme'),
    
  update: (data: ThemeData): Promise<ApiResponse> => 
    apiClient.put('/admin/theme', data),
}

// Upload API
export const uploadApi = {
  productImage: (file: File): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('productImage', file)
    return apiClient.post('/upload/product-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  productImages: (files: File[]): Promise<ApiResponse> => {
    const formData = new FormData()
    files.forEach(file => formData.append('productImages', file))
    return apiClient.post('/upload/product-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  pdf: (file: File): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('pdf', file)
    return apiClient.post('/upload/pdf', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  galleryImage: (file: File): Promise<ApiResponse> => {
    const formData = new FormData()
    formData.append('galleryImage', file)
    return apiClient.post('/upload/gallery-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  
  delete: (filename: string): Promise<ApiResponse> => 
    apiClient.delete(`/upload/${filename}`),
}

// Health check
export const healthApi = {
  check: (): Promise<ApiResponse> => 
    apiClient.get('/health'),
}

export default apiClient