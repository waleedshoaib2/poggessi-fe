'use client'
import { CssBaseline, ThemeProvider } from '@mui/material'
import React, { PropsWithChildren, createContext, useCallback, useContext, useState } from 'react'
import { themeLight } from './themes'
export enum THEMES {
  SYSTEM = 'system',
  LIGHT = 'light',
  DARK = 'dark'
}
export const isDarkMode = (theme: THEMES) => {
  const darkThemeMq =
    typeof window === 'undefined' ? { matches: false } : window.matchMedia('(prefers-color-scheme: dark)')
  return (theme === 'system' && darkThemeMq.matches) || theme === 'dark'
}

// Theme context
const ThemeContext = createContext<{
  darkMode: boolean
  theme: THEMES
  setTheme: (theme: THEMES) => void
} | null>(null)
// Setting custom name for the context which is visible on react dev tools
ThemeContext.displayName = 'ThemeContext'
// Context provider
export const ThemeContextProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const getInitialTheme = (): THEMES => {
    if (typeof window === 'undefined') return THEMES.SYSTEM
    const stored = window.localStorage.getItem('theme')
    switch (stored) {
      case THEMES.DARK:
        return THEMES.DARK
      case THEMES.LIGHT:
        return THEMES.LIGHT
      case THEMES.SYSTEM:
        return THEMES.SYSTEM
      default:
        return THEMES.SYSTEM
    }
  }

  const [theme, _setTheme] = useState<THEMES>(getInitialTheme)
  const [darkMode, setDarkMode] = useState(() => isDarkMode(getInitialTheme()))

  const setTheme = useCallback((theme: THEMES) => {
    _setTheme(theme)
    setDarkMode(isDarkMode(theme))
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('theme', theme)
    }
  }, [])

  return (
    <ThemeContext.Provider value={{ theme, darkMode, setTheme }}>
      <ThemeProvider theme={themeLight}>
        <CssBaseline enableColorScheme />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  )
}

// Context custom hook for using context
export const useThemeContext = () => {
  const context = useContext(ThemeContext)

  if (!context) {
    throw new Error('useThemeContext should be used inside the ThemeContextProvider.')
  }

  return context
}
