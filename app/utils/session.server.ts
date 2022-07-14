import { createCookieSessionStorage } from '@remix-run/node'
import type { Session } from '@remix-run/node'

import prisma from '~/db/prisma.server'

const sessionSecret = process.env.AUTH_COOKIE_SECRET
const sessionExpirationTime = 1000 * 60 * 60 * 24 * 14
export const sessionIdKey = '__sessionId__'

if (!sessionSecret) {
  throw new Error('AUTH_COOKIE_SECRET must be set')
}

const { getSession, commitSession, destroySession } =
  createCookieSessionStorage({
    cookie: {
      name: '__root_session_cookie',
      httpOnly: true,
      maxAge: sessionExpirationTime / 1000,
      path: '/',
      sameSite: 'lax',
      secrets: [sessionSecret],
      secure: true,
    },
  })

const handleSession = async (request: Request) => {
  const session = await getSession(request.headers.get('Cookie'))
  const getSessionId = () => session.get(sessionIdKey) as string | undefined
  const getUserId = () => session.get('userId') as string | undefined
  const removeSessionId = () => session.unset(sessionIdKey)

  const commit = async (updatedSession?: Session) => {
    return commitSession(updatedSession || session)
  }

  const destroy = async () => {
    return destroySession(session)
  }

  const getUser = async () => {
    const userId = getUserId()

    if (!userId) return null

    const user = prisma.user.findFirst({
      where: {
        id: userId,
      },
    })

    return user
  }

  const signOut = async () => {
    const sessionId = getSessionId()

    if (sessionId) {
      removeSessionId()
      return destroySession(session)
    }
  }

  return {
    instance: session,
    getSessionId,
    getUserId,
    removeSessionId,
    commit,
    destroy,
    getUser,
    signOut,
  }
}

export {
  getSession,
  commitSession,
  destroySession,
  sessionExpirationTime,
  handleSession,
}
