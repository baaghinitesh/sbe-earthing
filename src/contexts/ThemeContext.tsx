import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'

interface ThemeColors {
  primary: Record<string, string>
  secondary: Record<string, string>
  accent: Record<string, string>
}

interface ThemeSettings {
  defaultMode: 'light' | 'dark'
  enableAnimations: boolean
  enableGlassEffects: boolean
  borderRadius: 'none' | 'small' | 'medium' | 'large' | 'full'
}

interface ThemeContextType {
  isDark: boolean
  colors: ThemeColors
  settings: ThemeSettings
  toggleTheme: () => void
  setThemeMode: (mode: 'light' | 'dark') => void
  updateColors: (colors: Partial<ThemeColors>) => void
  updateSettings: (settings: Partial<ThemeSettings>) => void
}

const defaultColors: ThemeColors = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  secondary: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  accent: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
}

const defaultSettings: ThemeSettings = {
  defaultMode: 'dark',
  enableAnimations: true,
  enableGlassEffects: true,
  borderRadius: 'medium',
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState<boolean>(() => {
    // Check localStorage first, then system preference, default to dark
    const saved = localStorage.getItem('theme-mode')
    if (saved) return saved === 'dark'
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches || true
  })

  const [colors, setColors] = useState<ThemeColors>(() => {
    const saved = localStorage.getItem('theme-colors')
    return saved ? JSON.parse(saved) : defaultColors
  })

  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('theme-settings')
    return saved ? JSON.parse(saved) : defaultSettings
  })

  // Apply theme to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDark)
    localStorage.setItem('theme-mode', isDark ? 'dark' : 'light')
  }, [isDark])

  // Save colors to localStorage
  useEffect(() => {
    localStorage.setItem('theme-colors', JSON.stringify(colors))
  }, [colors])

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('theme-settings', JSON.stringify(settings))
  }, [settings])

  // Apply CSS custom properties for colors
  useEffect(() => {
    const root = document.documentElement
    
    Object.entries(colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value)
    })
    
    Object.entries(colors.secondary).forEach(([key, value]) => {
      root.style.setProperty(`--secondary-${key}`, value)
    })
    
    Object.entries(colors.accent).forEach(([key, value]) => {
      root.style.setProperty(`--accent-${key}`, value)
    })
  }, [colors])

  const toggleTheme = () => {
    setIsDark(prev => !prev)
  }

  const setThemeMode = (mode: 'light' | 'dark') => {
    setIsDark(mode === 'dark')
  }

  const updateColors = (newColors: Partial<ThemeColors>) => {
    setColors(prev => ({
      ...prev,
      ...newColors,
    }))
  }

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings,
    }))
  }

  const value: ThemeContextType = {
    isDark,
    colors,
    settings,
    toggleTheme,
    setThemeMode,
    updateColors,
    updateSettings,
  }

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}