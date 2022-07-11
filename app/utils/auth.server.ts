import { hash, compare } from 'bcrypt'
import { signInWithEmailAndPassword } from 'firebase/auth'

import { redirect } from '@remix-run/node'
import type { Session } from '@remix-run/node'

import prisma from '~/db/prisma.server'

import { auth } from './firebase.server'
import {
  handleSession,
  sessionExpirationTime,
  sessionIdKey,
} from './session.server'

const hashPassword = async (password: string) => {
  const hashedPassword = await hash(password, 12)
  return hashedPassword
}

const verifyPassword = async (password: string, hashedPassword: string) => {
  const isValid = await compare(password, hashedPassword)
  return isValid
}

const decodeBase64 = (base64: string) => {
  if (!base64) return ''

  const buffer = Buffer.from(base64, 'base64')
  return buffer.toString('ascii')
}

const verifySessionCookie = async (session: Session) => {
  try {
    const decodedIdToken = await auth.server.verifySessionCookie(
      session.get(sessionIdKey) || '',
    )

    return decodedIdToken
  } catch (error) {
    return {
      uid: undefined,
    }
  }
}

const verifySession = async (request: Request) => {
  const session = await handleSession(request)
  const { uid } = await verifySessionCookie(session.instance)

  if (!uid) {
    throw redirect('/sign-in', {
      headers: {
        'Set-Cookie': await session.destroy(),
      },
    })
  }

  return auth.server.getUser(uid)
}

const signIn = async (request: Request, email: string, password: string) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
    select: {
      id: true,
      password: {
        select: {
          hash: true,
        },
      },
    },
  })

  if (user && user.password) {
    const isValidPassword = await verifyPassword(password, user.password.hash)

    if (isValidPassword) {
      const { user: userAuth } = await signInWithEmailAndPassword(
        auth.client,
        email,
        password,
      )

      const idToken = await userAuth.getIdToken()
      const expiresIn = sessionExpirationTime
      const sessionCookie = await auth.server.createSessionCookie(idToken, {
        expiresIn,
      })
      const session = await handleSession(request)
      session.instance.set(sessionIdKey, sessionCookie)
      session.instance.set('userId', user.id)

      return {
        session: session.instance,
        isSignedIn: true,
      }
    }
    return {
      isSignedIn: false,
      session: null,
    }
  }
  return {
    isSignedIn: false,
    session: null,
  }
}

const signUp = async (
  request: Request,
  email: string,
  password: string,
  name: string,
) => {
  const hashedPassword = await hashPassword(password)
  const user = await prisma.user.create({
    data: {
      email,
      password: {
        create: {
          hash: hashedPassword,
        },
      },
      name,
    },
  })

  if (!user)
    return {
      isSignedIn: false,
      session: null,
    }

  const userAuth = await auth.server.createUser({
    email,
    password,
  })

  if (!userAuth)
    return {
      isSignedIn: false,
      session: null,
    }

  const signInResult = await signIn(request, email, password)

  return signInResult
}

const logout = async (request: Request) => {
  const session = await handleSession(request)

  return redirect('/login', {
    headers: {
      'Set-Cookie': (await session.signOut()) as string,
    },
  })
}

export {
  hashPassword,
  verifyPassword,
  decodeBase64,
  verifySessionCookie,
  verifySession,
  signIn,
  signUp,
  logout,
}
