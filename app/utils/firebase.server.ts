import {
  initializeApp as initializeAdminApp,
  getApps as getAdminApps,
  cert, // eslint-disable-next-line import/no-unresolved
} from 'firebase-admin/app'
// eslint-disable-next-line import/no-unresolved
import { getAuth as getServerAuth } from 'firebase-admin/auth'
// eslint-disable-next-line import/no-unresolved
import {
  initializeApp as initializeClientApp,
  getApps as getClientApps,
} from 'firebase/app'
import { getAuth as getClientAuth } from 'firebase/auth'

if (getAdminApps().length === 0) {
  initializeAdminApp({
    credential: cert({
      projectId: process.env.FIREBASE_ADMIN_PROJECT_ID,
      clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
      privateKey:
        process.env.FIREBASE_ADMIN_PRIVATE_KEY![0] === '-'
          ? process.env.FIREBASE_ADMIN_PRIVATE_KEY
          : JSON.parse(process.env.FIREBASE_ADMIN_PRIVATE_KEY!),
    }),
  })
}

if (getClientApps().length === 0) {
  initializeClientApp({
    apiKey: process.env.FIREBASE_CLIENT_API_KEY,
    authDomain: process.env.FIREBASE_CLIENT_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_CLIENT_PROJECT_ID,
    appId: process.env.FIREBASE_CLIENT_APP_ID,
    measurementId: process.env.FIREBASE_CLIENT_MEASUREMENT_ID,
  })
}

export const auth = {
  server: getServerAuth(),
  client: getClientAuth(),
}
