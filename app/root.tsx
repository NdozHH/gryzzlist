import React from 'react'
import type { FC } from 'react'

import { json } from '@remix-run/node'
import type {
  LinksFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useLocation,
  useMatches,
} from '@remix-run/react'
import type { ShouldReloadFunction } from '@remix-run/react'

import globalStyles from '~/styles/global.css'

import ThemeProvider from './components/theme-provider'
import type { ColorScheme } from './utils/theme-provider'
import { getColorSchemeSession } from './utils/theme.server'

interface LoaderData {
  session: {
    colorScheme: ColorScheme | undefined
  }
}

let isMount = true
export const meta: MetaFunction = () => ({
  charset: 'utf-8',
  title: 'GryzzList',
  viewport: 'width=device-width,initial-scale=1',
})

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: globalStyles }]
}

export const loader: LoaderFunction = async ({ request }) => {
  const colorSchemeSession = await getColorSchemeSession(request)

  return json<LoaderData>({
    session: {
      colorScheme: colorSchemeSession.getColorScheme(),
    },
  })
}

export const unstable_shouldReload: ShouldReloadFunction = () => false

const App: FC = () => {
  let location = useLocation()
  let matches = useMatches()

  React.useEffect(() => {
    let mounted = isMount
    isMount = false
    if ('serviceWorker' in navigator) {
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller?.postMessage({
          type: 'REMIX_NAVIGATION',
          isMount: mounted,
          location,
          matches,
          manifest: window.__remixManifest,
        })
      } else {
        let listener = async () => {
          await navigator.serviceWorker.ready
          navigator.serviceWorker.controller?.postMessage({
            type: 'REMIX_NAVIGATION',
            isMount: mounted,
            location,
            matches,
            manifest: window.__remixManifest,
          })
        }
        navigator.serviceWorker.addEventListener('controllerchange', listener)
        return () => {
          navigator.serviceWorker.removeEventListener(
            'controllerchange',
            listener,
          )
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location])

  return (
    <html lang="en">
      <head>
        <Meta />
        <link rel="manifest" href="/resources/manifest.webmanifest" />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' ? <LiveReload /> : null}
      </body>
    </html>
  )
}

const AppWithProviders = () => {
  const data = useLoaderData<LoaderData>()

  return (
    <ThemeProvider providedColorScheme={data?.session?.colorScheme}>
      <App />
    </ThemeProvider>
  )
}

export default AppWithProviders
