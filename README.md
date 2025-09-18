# SBE Earthing - Advanced Electrical Solutions

<div align="center">

![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3-blue?style=for-the-badge&logo=tailwindcss)
![Vite](https://img.shields.io/badge/Vite-5-purple?style=for-the-badge&logo=vite)

**A modern, responsive web application for electrical earthing solutions with comprehensive admin management**

[🚀 Live Demo](#) • [📖 Documentation](#) • [🐛 Report Bug](#) • [💡 Request Feature](#)

</div>

## 📋 Table of Contents

- [Overview](#overview)
- [✨ Features](#features)
- [🚀 Quick Start](#quick-start)
- [📁 Project Structure](#project-structure)
- [🛠️ Technology Stack](#technology-stack)
- [📱 Responsive Design](#responsive-design)
- [🔐 Admin Panel](#admin-panel)
- [🎨 UI Components](#ui-components)
- [⚙️ Configuration](#configuration)
- [🚀 Deployment](#deployment)
- [🤝 Contributing](#contributing)
- [📄 License](#license)

## Overview

**SBE Earthing** is a comprehensive web application designed for an electrical earthing solutions company. It features a modern, responsive public website showcasing products and services, along with a powerful admin panel for content management, product catalog administration, and business analytics.

### 🎯 Key Highlights

- **✅ Fully Responsive Design** - Works seamlessly across all devices
- **✅ Modern Admin Dashboard** - Comprehensive management interface
- **✅ TypeScript Support** - Type-safe development experience
- **✅ Performance Optimized** - Fast loading and smooth interactions
- **✅ SEO Friendly** - Optimized for search engines

## ✨ Features

### 🌐 Public Website

| Feature | Description | File Location |
|---------|-------------|---------------|
| **Homepage** | Company introduction, services showcase, hero section | `src/pages/Home.tsx` |
| **Product Catalog** | Interactive product display with categories and filters | `src/pages/Products.tsx` |
| **Product Details** | Individual product pages with specifications | `src/pages/ProductDetail.tsx` |
| **About Us** | Company information, team, and values | `src/pages/About.tsx` |
| **Contact Form** | Contact form with validation and submission | `src/pages/Contact.tsx` |
| **FAQ Section** | Expandable frequently asked questions | `src/pages/FAQ.tsx` |
| **WhatsApp Integration** | Floating WhatsApp button for instant contact | `src/components/UI/WhatsAppFloat.tsx` |

### 🛡️ Admin Panel

| Feature | Description | File Location |
|---------|-------------|---------------|
| **Dashboard** | Analytics, statistics, and overview | `src/pages/Admin/AdminDashboard.tsx` |
| **Product Management** | CRUD operations for products | `src/pages/Admin/AdminProducts.tsx` |
| **Contact Management** | View and manage contact submissions | `src/pages/Admin/AdminContacts.tsx` |
| **FAQ Management** | Manage FAQ content | `src/pages/Admin/AdminFAQs.tsx` |
| **Theme Customization** | Customize website appearance | `src/pages/Admin/AdminTheme.tsx` |
| **File Upload System** | Handle product images and documents | `src/components/Admin/FileUpload.tsx` |
| **Data Export** | Export data in various formats | `src/components/Admin/ExportDialog.tsx` |

### 🔐 Authentication & Security

| Feature | Description | File Location |
|---------|-------------|---------------|
| **Admin Authentication** | Secure login system | `src/pages/Admin/AdminLogin.tsx` |
| **Protected Routes** | Route-level access control | `src/components/Auth/ProtectedRoute.tsx` |
| **Session Management** | Persistent admin sessions | `src/contexts/AdminContext.tsx` |

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 8.0.0 or **yarn** >= 1.22.0
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sbe-earthing
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   - **Public Website**: http://localhost:5173/
   - **Admin Panel**: http://localhost:5173/admin/login

### 🔑 Admin Credentials

- **Email**: `baaghinitesh@gmail.com`
- **Password**: `nitesh@123`

## 📁 Project Structure

```
sbe-earthing/
├── 📁 public/                     # Static assets
├── 📁 src/
│   ├── 📁 assets/                 # Images, icons, fonts
│   ├── 📁 components/             # Reusable UI components
│   │   ├── 📁 Admin/              # Admin-specific components
│   │   │   ├── AdminLayout.tsx    # Admin panel layout wrapper
│   │   │   ├── ExportDialog.tsx   # Data export functionality
│   │   │   └── FileUpload.tsx     # File upload component
│   │   ├── 📁 Auth/               # Authentication components
│   │   │   └── ProtectedRoute.tsx # Route protection wrapper
│   │   ├── 📁 Form/               # Form components
│   │   │   ├── Form.tsx           # Generic form component
│   │   │   └── FormField.tsx      # Form input fields
│   │   ├── 📁 Layout/             # Layout components
│   │   │   ├── Layout.tsx         # Main site layout
│   │   │   ├── Navbar.tsx         # Navigation bar
│   │   │   └── Footer.tsx         # Site footer
│   │   └── 📁 UI/                 # UI utility components
│   │       ├── LoadingSpinner.tsx # Loading indicator
│   │       ├── ScrollToTop.tsx    # Scroll to top button
│   │       └── WhatsAppFloat.tsx  # WhatsApp floating button
│   ├── 📁 contexts/               # React contexts for state management
│   │   ├── AdminContext.tsx       # Admin authentication context
│   │   └── ThemeContext.tsx       # Theme and styling context
│   ├── 📁 pages/                  # Application pages
│   │   ├── 📁 Admin/              # Admin panel pages
│   │   │   ├── AdminDashboard.tsx # Admin dashboard
│   │   │   ├── AdminProducts.tsx  # Product management
│   │   │   ├── AdminContacts.tsx  # Contact management
│   │   │   ├── AdminFAQs.tsx      # FAQ management
│   │   │   ├── AdminTheme.tsx     # Theme customization
│   │   │   ├── AdminLogin.tsx     # Admin login page
│   │   │   └── AdminProductForm.tsx # Product form
│   │   ├── Home.tsx               # Homepage
│   │   ├── Products.tsx           # Products catalog
│   │   ├── ProductDetail.tsx      # Individual product page
│   │   ├── About.tsx              # About us page
│   │   ├── Contact.tsx            # Contact page
│   │   ├── FAQ.tsx                # FAQ page
│   │   └── NotFound.tsx           # 404 error page
│   ├── 📁 services/               # API and external services
│   │   └── api.ts                 # API configuration and methods
│   ├── 📁 utils/                  # Utility functions
│   │   ├── export.ts              # Data export utilities
│   │   └── validation.ts          # Form validation helpers
│   ├── App.tsx                    # Main application component
│   ├── main.tsx                   # Application entry point
│   └── index.css                  # Global styles
├── 📄 package.json                # Project dependencies and scripts
├── 📄 tailwind.config.js          # Tailwind CSS configuration
├── 📄 vite.config.ts              # Vite build configuration
├── 📄 tsconfig.json               # TypeScript configuration
└── 📄 README.md                   # Project documentation
```

## 🛠️ Technology Stack

### Frontend Framework
- **React 18** - Modern React with hooks and concurrent features
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful & consistent icon library
- **CSS Modules** - Scoped styling approach

### Routing & Navigation
- **React Router v6** - Client-side routing
- **Protected Routes** - Authentication-based route protection

### State Management
- **React Context API** - Global state management
- **Local Storage** - Persistent data storage

### Development Tools
- **ESLint** - Code linting and formatting
- **PostCSS** - CSS processing and optimization
- **TypeScript Compiler** - Type checking and compilation

## 📱 Responsive Design

The application is built with a **mobile-first approach** and works seamlessly across all devices:

### Breakpoints
- **Mobile**: `320px - 767px`
- **Tablet**: `768px - 1023px`
- **Desktop**: `1024px+`

### Responsive Features
- ✅ Adaptive navigation menu
- ✅ Flexible grid layouts
- ✅ Optimized images and media
- ✅ Touch-friendly interactions
- ✅ Mobile-optimized forms

## 🔐 Admin Panel

### Access Control
The admin panel is protected by authentication and includes:

- **Secure Login System** - Email/password authentication
- **Session Management** - Persistent login sessions
- **Route Protection** - Unauthorized access prevention

### Admin Features

#### 📊 Dashboard (`AdminDashboard.tsx`)
```tsx
// Key features:
- Statistics overview (revenue, orders, products, users)
- Recent orders display
- Quick action buttons
- Performance metrics with charts
```

#### 📦 Product Management (`AdminProducts.tsx`)
```tsx
// Functionality:
- View all products in a table format
- Add new products with form validation
- Edit existing product information
- Delete products with confirmation
- Image upload and management
- Category and inventory tracking
```

#### 📞 Contact Management (`AdminContacts.tsx`)
```tsx
// Features:
- View all contact form submissions
- Filter and search contacts
- Export contact data (CSV, PDF)
- Mark contacts as resolved/pending
```

#### ❓ FAQ Management (`AdminFAQs.tsx`)
```tsx
// Capabilities:
- Add/edit/delete FAQ items
- Organize FAQs by categories
- Drag-and-drop reordering
- Rich text editing support
```

#### 🎨 Theme Customization (`AdminTheme.tsx`)
```tsx
// Options:
- Color scheme customization
- Layout preferences
- Brand logo and favicon upload
- Typography settings
```

## 🎨 UI Components

### Layout Components

#### `AdminLayout.tsx` - Admin Panel Layout
```tsx
// Features:
- Responsive sidebar navigation
- Mobile-friendly drawer menu
- Breadcrumb navigation
- User profile dropdown
- Logout functionality
```

#### `Layout.tsx` - Public Site Layout
```tsx
// Includes:
- Header with navigation
- Main content area
- Footer with links
- Mobile menu toggle
```

### Form Components

#### `Form.tsx` - Generic Form Wrapper
```tsx
// Provides:
- Form validation framework
- Error message display
- Loading states
- Submit handling
```

#### `FormField.tsx` - Input Field Component
```tsx
// Supports:
- Text, email, password inputs
- Textarea fields
- Select dropdowns
- File upload inputs
- Validation feedback
```

### UI Utilities

#### `LoadingSpinner.tsx` - Loading Indicator
```tsx
// Features:
- Customizable size and color
- Smooth animations
- Accessible design
```

#### `WhatsAppFloat.tsx` - WhatsApp Button
```tsx
// Functionality:
- Floating action button
- Direct WhatsApp integration
- Mobile-optimized positioning
```

## ⚙️ Configuration

### Environment Variables
Create a `.env.local` file in the root directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3001
VITE_API_KEY=your_api_key_here

# WhatsApp Configuration
VITE_WHATSAPP_NUMBER=+1234567890

# Analytics
VITE_GA_TRACKING_ID=GA_TRACKING_ID
```

### Tailwind Configuration
Customize the design system in `tailwind.config.js`:

```javascript
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#64748b',
        // Add custom colors
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        // Add custom fonts
      }
    }
  },
  plugins: [
    // Add Tailwind plugins
  ]
}
```

### TypeScript Configuration
The project uses strict TypeScript settings in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## 🚀 Deployment

### Build for Production

```bash
# Create optimized build
npm run build

# Preview production build locally
npm run preview
```

### Deployment Options

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
3. Deploy automatically on push to main branch

#### Netlify
1. Connect repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure redirects for SPA routing

#### Traditional Hosting
1. Run `npm run build`
2. Upload `dist/` folder contents to your web server
3. Configure web server for SPA routing

### Performance Optimization

The build process includes:
- **Code Splitting** - Automatic route-based splitting
- **Tree Shaking** - Remove unused code
- **Minification** - Compress JavaScript and CSS
- **Asset Optimization** - Optimize images and fonts

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Commit with conventional commits**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Coding Standards
- Use TypeScript for all new files
- Follow ESLint configuration
- Write meaningful commit messages
- Add tests for new features
- Update documentation

## 📞 Support & Contact

**Developer**: Nitesh  
**Email**: baaghinitesh@gmail.com  
**Project Repository**: [GitHub Repository](#)

### Getting Help
- 📖 Check the [documentation](#)
- 🐛 Report bugs in [Issues](#)
- 💡 Request features in [Discussions](#)
- 📧 Email for direct support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ by Nitesh**

⭐ **If this project helped you, please consider giving it a star!** ⭐

</div>