// React import not needed with new JSX transform
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'
import WhatsAppFloat from '../UI/WhatsAppFloat'
import ScrollToTop from '../UI/ScrollToTop'

export default function Layout() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppFloat />
      <ScrollToTop />
    </div>
  )
}