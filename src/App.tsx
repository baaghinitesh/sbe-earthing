import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Layout from './components/Layout/Layout'
import LoadingSpinner from './components/UI/LoadingSpinner'
import { useTheme } from './contexts/ThemeContext'

// Lazy load components for better performance
const Home = React.lazy(() => import('./pages/Home'))
const Products = React.lazy(() => import('./pages/Products'))
const ProductDetail = React.lazy(() => import('./pages/ProductDetail'))
const About = React.lazy(() => import('./pages/About'))
const Contact = React.lazy(() => import('./pages/Contact'))
const FAQ = React.lazy(() => import('./pages/FAQ'))
const AdminLogin = React.lazy(() => import('./pages/Admin/AdminLogin'))
const AdminDashboard = React.lazy(() => import('./pages/Admin/AdminDashboard'))
const AdminProducts = React.lazy(() => import('./pages/Admin/AdminProducts'))
const AdminContacts = React.lazy(() => import('./pages/Admin/AdminContacts'))
const AdminFAQs = React.lazy(() => import('./pages/Admin/AdminFAQs'))
const AdminTheme = React.lazy(() => import('./pages/Admin/AdminTheme'))
const NotFound = React.lazy(() => import('./pages/NotFound'))

function App() {
  const { isDark } = useTheme()

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDark ? 'dark' : ''}`}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={
            <Suspense fallback={<LoadingSpinner />}>
              <Home />
            </Suspense>
          } />
          <Route path="products" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Products />
            </Suspense>
          } />
          <Route path="products/:slug" element={
            <Suspense fallback={<LoadingSpinner />}>
              <ProductDetail />
            </Suspense>
          } />
          <Route path="about" element={
            <Suspense fallback={<LoadingSpinner />}>
              <About />
            </Suspense>
          } />
          <Route path="contact" element={
            <Suspense fallback={<LoadingSpinner />}>
              <Contact />
            </Suspense>
          } />
          <Route path="faq" element={
            <Suspense fallback={<LoadingSpinner />}>
              <FAQ />
            </Suspense>
          } />
        </Route>

        {/* Admin Routes */}
        <Route path="/admin/login" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminLogin />
          </Suspense>
        } />
        <Route path="/admin" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminDashboard />
          </Suspense>
        } />
        <Route path="/admin/products" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminProducts />
          </Suspense>
        } />
        <Route path="/admin/contacts" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminContacts />
          </Suspense>
        } />
        <Route path="/admin/faqs" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminFAQs />
          </Suspense>
        } />
        <Route path="/admin/theme" element={
          <Suspense fallback={<LoadingSpinner />}>
            <AdminTheme />
          </Suspense>
        } />

        {/* 404 Route */}
        <Route path="*" element={
          <Suspense fallback={<LoadingSpinner />}>
            <NotFound />
          </Suspense>
        } />
      </Routes>

      {/* Toast notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          className: isDark ? 'dark' : '',
          style: {
            background: isDark ? '#374151' : '#ffffff',
            color: isDark ? '#f9fafb' : '#111827',
            border: isDark ? '1px solid #4b5563' : '1px solid #e5e7eb',
          },
        }}
      />
    </div>
  )
}

export default App