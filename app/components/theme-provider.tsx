import { useEffect, useRef, useState } from 'react'
import type { FC } from 'react'

import { MantineProvider } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import { NotificationsProvider } from '@mantine/notifications'

import { useFetcher } from '@remix-run/react'

import {
  ColorScheme,
  colorSchemeMediaQuery,
  themes,
  ThemeContext,
} from '~/utils/theme-provider'
import type { ThemeProviderProps } from '~/utils/theme-provider'

declare module '@mantine/core' {
  export interface MantineThemeOther {
    headerHeight: string
    appbarHeight: string
    zIndex: {
      mobileNavigation: number
    }
  }
}

const ThemeProvider: FC<ThemeProviderProps> = ({
  children,
  providedColorScheme,
}) => {
  const persistColorScheme = useFetcher()
  // TODO: remove this when persistColorScheme is memoized properly
  const persistColorSchemeRef = useRef(persistColorScheme)
  const firstRun = useRef(false)
  const defaultLightColorScheme = useMediaQuery(colorSchemeMediaQuery)
  const [colorScheme, setColorScheme] = useState<ColorScheme | undefined>(
    () => {
      if (providedColorScheme) {
        if (themes.includes(providedColorScheme)) {
          return providedColorScheme
        }

        return undefined
      }

      if (typeof document === 'undefined') return undefined

      if (defaultLightColorScheme) {
        return ColorScheme.LIGHT
      }

      return ColorScheme.DARK
    },
  )

  useEffect(() => {
    persistColorSchemeRef.current = persistColorScheme
  }, [persistColorScheme])

  useEffect(() => {
    if (!firstRun.current) {
      firstRun.current = true
      return
    }

    if (!colorScheme) return

    persistColorSchemeRef.current.submit(
      { colorScheme },
      { action: 'action/set-color-scheme', method: 'post' },
    )
  }, [colorScheme])

  useEffect(() => {
    const mediaQuery = window.matchMedia(colorSchemeMediaQuery)
    const handleChange = () => {
      setColorScheme(mediaQuery.matches ? ColorScheme.LIGHT : ColorScheme.DARK)
    }

    mediaQuery.addEventListener('change', handleChange)

    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  return (
    <MantineProvider
      withGlobalStyles
      withNormalizeCSS
      theme={{
        colorScheme,
        loader: 'dots',
        spacing: {
          xs: 8,
          sm: 12,
          md: 16,
          lg: 24,
          xl: 32,
        },
        primaryColor: 'violet',
        other: {
          headerHeight: '4.375rem',
          appbarHeight: '10.75rem',
          zIndex: {
            mobileNavigation: 2,
          },
        },
      }}
      styles={{
        Container: {
          root: {
            margin: 0,
            padding: 0,
          },
        },
      }}
    >
      <NotificationsProvider
        position="bottom-left"
        transitionDuration={500}
        containerWidth={300}
        autoClose={5000}
      >
        <ThemeContext.Provider value={[colorScheme, setColorScheme]}>
          {children}
        </ThemeContext.Provider>
      </NotificationsProvider>
    </MantineProvider>
  )
}

export default ThemeProvider
