import { createContext, useContext } from 'react'
import type { Dispatch, ReactNode, SetStateAction } from 'react'

enum ColorScheme {
  DARK = 'dark',
  LIGHT = 'light',
}
type ThemeContextType = [
  ColorScheme | undefined,
  Dispatch<SetStateAction<ColorScheme | undefined>>,
]

interface ThemeProviderProps {
  children: ReactNode
  providedColorScheme: ColorScheme | undefined
}

const themes = Object.values(ColorScheme)

const colorSchemeMediaQuery = '(prefers-color-scheme: light)'

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)
ThemeContext.displayName = 'ThemeContext'

const useColorScheme = () => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useColorScheme must be used within a ThemeProvider')
  }

  return context
}

const isColorScheme = (value: unknown): value is ColorScheme => {
  return typeof value === 'string' && themes.includes(value as ColorScheme)
}

export type { ThemeContextType, ThemeProviderProps }
export {
  colorSchemeMediaQuery,
  useColorScheme,
  isColorScheme,
  themes,
  ColorScheme,
  ThemeContext,
}
