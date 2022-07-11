import type { ActionFunction } from '@remix-run/node'
import { json, redirect } from '@remix-run/node'

import { isColorScheme } from '~/utils/theme-provider'
import { getColorSchemeSession } from '~/utils/theme.server'

// This action is used to update the selected color scheme in the __cs_cookie
export const action: ActionFunction = async ({ request }) => {
  const colorSchemeSession = await getColorSchemeSession(request)
  const requestText = await request.text()
  const form = new URLSearchParams(requestText)
  const colorScheme = form.get('colorScheme')

  if (!isColorScheme(colorScheme))
    return json({
      success: false,
      message: `colorScheme value of ${colorScheme} is not a valid color scheme.`,
    })

  colorSchemeSession.setColorScheme(colorScheme)

  return json(
    { success: true },
    {
      headers: { 'Set-Cookie': await colorSchemeSession.commit() },
    },
  )
}

export const loader = () => redirect('/', { status: 404 })
