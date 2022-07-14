import { createCookieSessionStorage } from '@remix-run/node'

import { ColorScheme, isColorScheme } from './theme-provider'

const sessionSecret = process.env.COLOR_SCHEME_COOKIE_SECRET

if (!sessionSecret) throw new Error('COLOR_SCHEME_COOKIE_SECRET must be set')

const colorSchemeStorage = createCookieSessionStorage({
  cookie: {
    name: '__cs_cookie',
    secure: true,
    secrets: [sessionSecret],
    sameSite: 'lax',
    path: '/',
    expires: new Date('2100-01-01'),
    httpOnly: true,
  },
})

const getColorSchemeSession = async (request: Request) => {
  const session = await colorSchemeStorage.getSession(
    request.headers.get('Cookie'),
  )

  return {
    getColorScheme: () => {
      const colorScheme = session.get('colorScheme')

      return isColorScheme(colorScheme) ? colorScheme : ColorScheme.DARK
    },
    setColorScheme: (colorScheme: ColorScheme) =>
      session.set('colorScheme', colorScheme),
    commit: () => colorSchemeStorage.commitSession(session),
  }
}

export { getColorSchemeSession }
