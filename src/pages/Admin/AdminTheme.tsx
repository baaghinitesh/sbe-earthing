import React, { useState } from 'react';
import { Save, RefreshCw, Palette, Eye, Monitor, Sun, Moon, Smartphone } from 'lucide-react';

import FileUpload from '../../components/Admin/FileUpload';
import toast from 'react-hot-toast';

interface ThemeSettings {
  logo: {
    primary: string;
    dark: string;
    favicon: string;
  };
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    success: string;
    warning: string;
    error: string;
    info: string;
  };
  typography: {
    fontFamily: string;
    headingFont: string;
    fontSize: {
      xs: string;
      sm: string;
      base: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
    };
  };
  layout: {
    maxWidth: string;
    borderRadius: string;
    spacing: string;
    headerHeight: string;
    footerStyle: 'minimal' | 'detailed' | 'compact';
  };
  components: {
    buttons: {
      style: 'rounded' | 'square' | 'pill';
      shadow: boolean;
    };
    cards: {
      style: 'flat' | 'elevated' | 'outlined';
      borderRadius: string;
    };
    inputs: {
      style: 'outlined' | 'filled' | 'underlined';
      borderRadius: string;
    };
  };
}

const defaultTheme: ThemeSettings = {
  logo: {
    primary: '/logo-light.png',
    dark: '/logo-dark.png',
    favicon: '/favicon.ico'
  },
  colors: {
    primary: '#2563eb',
    secondary: '#7c3aed',
    accent: '#f59e0b',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6'
  },
  typography: {
    fontFamily: 'Inter',
    headingFont: 'Inter',
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    }
  },
  layout: {
    maxWidth: '1280px',
    borderRadius: '0.5rem',
    spacing: '1rem',
    headerHeight: '4rem',
    footerStyle: 'detailed'
  },
  components: {
    buttons: {
      style: 'rounded',
      shadow: true
    },
    cards: {
      style: 'elevated',
      borderRadius: '0.5rem'
    },
    inputs: {
      style: 'outlined',
      borderRadius: '0.375rem'
    }
  }
};

const fontOptions = [
  { name: 'Inter', value: 'Inter' },
  { name: 'Roboto', value: 'Roboto' },
  { name: 'Open Sans', value: 'Open Sans' },
  { name: 'Lato', value: 'Lato' },
  { name: 'Poppins', value: 'Poppins' },
  { name: 'Nunito', value: 'Nunito' },
  { name: 'Source Sans Pro', value: 'Source Sans Pro' }
];

const AdminTheme: React.FC = () => {
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(defaultTheme);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeTab, setActiveTab] = useState<'colors' | 'typography' | 'layout' | 'components' | 'logos'>('colors');

  const handleColorChange = (colorKey: keyof ThemeSettings['colors'], value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [colorKey]: value
      }
    }));
  };

  const handleTypographyChange = (key: string, value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value
      }
    }));
  };

  const handleLayoutChange = (key: string, value: string) => {
    setThemeSettings(prev => ({
      ...prev,
      layout: {
        ...prev.layout,
        [key]: value
      }
    }));
  };

  const handleComponentChange = (category: string, key: string, value: any) => {
    setThemeSettings(prev => ({
      ...prev,
      components: {
        ...prev.components,
        [category]: {
          ...prev.components[category as keyof ThemeSettings['components']],
          [key]: value
        }
      }
    }));
  };

  const handleLogoUpload = (logoType: keyof ThemeSettings['logo'], files: any[]) => {
    if (files.length > 0) {
      const logoUrl = URL.createObjectURL(files[0].file);
      setThemeSettings(prev => ({
        ...prev,
        logo: {
          ...prev.logo,
          [logoType]: logoUrl
        }
      }));
    }
  };

  const resetToDefault = () => {
    if (confirm('Are you sure you want to reset all theme settings to default? This action cannot be undone.')) {
      setThemeSettings(defaultTheme);
      toast.success('Theme settings reset to default');
    }
  };

  const saveTheme = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      toast.success('Theme settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save theme settings');
    } finally {
      setLoading(false);
    }
  };

  const generateCSS = () => {
    return `
:root {
  --color-primary: ${themeSettings.colors.primary};
  --color-secondary: ${themeSettings.colors.secondary};
  --color-accent: ${themeSettings.colors.accent};
  --color-success: ${themeSettings.colors.success};
  --color-warning: ${themeSettings.colors.warning};
  --color-error: ${themeSettings.colors.error};
  --color-info: ${themeSettings.colors.info};
  
  --font-family: ${themeSettings.typography.fontFamily};
  --font-heading: ${themeSettings.typography.headingFont};
  
  --max-width: ${themeSettings.layout.maxWidth};
  --border-radius: ${themeSettings.layout.borderRadius};
  --spacing: ${themeSettings.layout.spacing};
  --header-height: ${themeSettings.layout.headerHeight};
}`;
  };

  const tabs = [
    { id: 'colors', name: 'Colors', icon: Palette },
    { id: 'typography', name: 'Typography', icon: Monitor },
    { id: 'layout', name: 'Layout', icon: Monitor },
    { id: 'components', name: 'Components', icon: Monitor },
    { id: 'logos', name: 'Logos', icon: Eye }
  ];

  return (
    <div>
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Theme Customization</h1>
            <p className="text-gray-600 dark:text-gray-400">Customize your website's appearance and branding</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetToDefault}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              <RefreshCw className="w-4 h-4" />
              Reset
            </button>
            <button
              onClick={saveTheme}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Saving...' : 'Save Theme'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <nav className="space-y-1">
                {tabs.map(tab => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg transition-colors ${
                        activeTab === tab.id
                          ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {tab.name}
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Preview Controls */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mt-4">
              <h3 className="font-medium text-gray-900 dark:text-white mb-3">Preview Mode</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setPreviewMode('desktop')}
                  className={`p-2 rounded ${previewMode === 'desktop' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('tablet')}
                  className={`p-2 rounded ${previewMode === 'tablet' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Monitor className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setPreviewMode('mobile')}
                  className={`p-2 rounded ${previewMode === 'mobile' ? 'bg-blue-100 dark:bg-blue-900/20 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Smartphone className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              {/* Colors Tab */}
              {activeTab === 'colors' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Color Scheme</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(themeSettings.colors).map(([key, value]) => (
                      <div key={key} className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">
                          {key} Color
                        </label>
                        <div className="flex gap-3 items-center">
                          <input
                            type="color"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ThemeSettings['colors'], e.target.value)}
                            className="w-12 h-12 border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
                          />
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => handleColorChange(key as keyof ThemeSettings['colors'], e.target.value)}
                            className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          />
                        </div>
                        <div 
                          className="w-full h-8 rounded border border-gray-200 dark:border-gray-600"
                          style={{ backgroundColor: value }}
                        ></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Typography Tab */}
              {activeTab === 'typography' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Typography</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Body Font Family
                      </label>
                      <select
                        value={themeSettings.typography.fontFamily}
                        onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>{font.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Heading Font Family
                      </label>
                      <select
                        value={themeSettings.typography.headingFont}
                        onChange={(e) => handleTypographyChange('headingFont', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {fontOptions.map(font => (
                          <option key={font.value} value={font.value}>{font.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Font Preview */}
                  <div className="p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                    <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: themeSettings.typography.headingFont }}>
                      Sample Heading (using {themeSettings.typography.headingFont})
                    </h3>
                    <p style={{ fontFamily: themeSettings.typography.fontFamily }}>
                      This is sample body text using {themeSettings.typography.fontFamily}. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    </p>
                  </div>
                </div>
              )}

              {/* Layout Tab */}
              {activeTab === 'layout' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Layout Settings</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Max Width
                      </label>
                      <select
                        value={themeSettings.layout.maxWidth}
                        onChange={(e) => handleLayoutChange('maxWidth', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="1024px">1024px (Small)</option>
                        <option value="1280px">1280px (Medium)</option>
                        <option value="1536px">1536px (Large)</option>
                        <option value="100%">100% (Full Width)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Border Radius
                      </label>
                      <select
                        value={themeSettings.layout.borderRadius}
                        onChange={(e) => handleLayoutChange('borderRadius', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="0">0 (Square)</option>
                        <option value="0.25rem">0.25rem (Small)</option>
                        <option value="0.5rem">0.5rem (Medium)</option>
                        <option value="1rem">1rem (Large)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Header Height
                      </label>
                      <select
                        value={themeSettings.layout.headerHeight}
                        onChange={(e) => handleLayoutChange('headerHeight', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="3rem">3rem (Compact)</option>
                        <option value="4rem">4rem (Standard)</option>
                        <option value="5rem">5rem (Large)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Footer Style
                      </label>
                      <select
                        value={themeSettings.layout.footerStyle}
                        onChange={(e) => handleLayoutChange('footerStyle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="minimal">Minimal</option>
                        <option value="compact">Compact</option>
                        <option value="detailed">Detailed</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Components Tab */}
              {activeTab === 'components' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Component Styles</h2>
                  
                  <div className="space-y-6">
                    {/* Buttons */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Buttons</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Button Style
                          </label>
                          <select
                            value={themeSettings.components.buttons.style}
                            onChange={(e) => handleComponentChange('buttons', 'style', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="rounded">Rounded</option>
                            <option value="square">Square</option>
                            <option value="pill">Pill</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center">
                            <input
                              type="checkbox"
                              checked={themeSettings.components.buttons.shadow}
                              onChange={(e) => handleComponentChange('buttons', 'shadow', e.target.checked)}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                              Button Shadow
                            </span>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Cards */}
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Cards</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Card Style
                          </label>
                          <select
                            value={themeSettings.components.cards.style}
                            onChange={(e) => handleComponentChange('cards', 'style', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="flat">Flat</option>
                            <option value="elevated">Elevated</option>
                            <option value="outlined">Outlined</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Logos Tab */}
              {activeTab === 'logos' && (
                <div className="space-y-6">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Brand Assets</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Light Mode Logo</h3>
                      <FileUpload
                        accept="image/*"
                        multiple={false}
                        maxFiles={1}
                        onUpload={(files) => handleLogoUpload('primary', files)}
                        dragDropText="Upload light mode logo"
                        existingFiles={themeSettings.logo.primary ? [{ id: 'primary', url: themeSettings.logo.primary, name: 'logo-light.png' }] : []}
                      />
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Dark Mode Logo</h3>
                      <FileUpload
                        accept="image/*"
                        multiple={false}
                        maxFiles={1}
                        onUpload={(files) => handleLogoUpload('dark', files)}
                        dragDropText="Upload dark mode logo"
                        existingFiles={themeSettings.logo.dark ? [{ id: 'dark', url: themeSettings.logo.dark, name: 'logo-dark.png' }] : []}
                      />
                    </div>

                    <div>
                      <h3 className="text-md font-medium text-gray-900 dark:text-white mb-3">Favicon</h3>
                      <FileUpload
                        accept="image/x-icon,image/png,image/svg+xml"
                        multiple={false}
                        maxFiles={1}
                        onUpload={(files) => handleLogoUpload('favicon', files)}
                        dragDropText="Upload favicon (ICO, PNG, SVG)"
                        existingFiles={themeSettings.logo.favicon ? [{ id: 'favicon', url: themeSettings.logo.favicon, name: 'favicon.ico' }] : []}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* CSS Export */}
            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 mt-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Generated CSS</h2>
              <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm overflow-x-auto">
                <code>{generateCSS()}</code>
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminTheme;