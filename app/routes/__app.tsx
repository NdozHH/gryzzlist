import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Box, Container } from '@mantine/core'

import type { LoaderFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import Appbar from '~/components/appbar'
import Navigation from '~/components/navigation'

import { verifySession } from '~/utils/auth.server'
import { getUser } from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import type { User } from '~/db/prisma.server'

import type { Handle } from '~/types/common'

export interface LoaderData {
  user: User
}

export const handle: Handle = {
  id: 'app',
}

export const loader: LoaderFunction = async ({ request }) => {
  await verifySession(request)

  const session = await handleSession(request)
  const userId = session.getUserId()

  invariant(userId, 'userId is not valid')

  const user = await getUser(userId)

  return {
    user,
  }
}

const MainLayout: FC = () => {
  return (
    <Container
      fluid
      px={0}
      sx={theme => ({
        position: 'relative',
        height: '100%',
        display: 'grid',
        gridTemplateColumns: 'fit-content(100%) 1fr',
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          gridTemplateColumns: '1fr',
          gridTemplateRows: 'fit-content(100%) 1fr',
        },
      })}
    >
      <Navigation />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <Appbar />
        <Box
          component="main"
          sx={theme => ({
            height: '100%',
            padding: `0 ${theme.spacing.xl}px`,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
            [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
              padding: `0 ${theme.spacing.sm}px`,
              height: '100%',
            },
          })}
        >
          <Outlet />
        </Box>
      </Box>
    </Container>
  )
}

export default MainLayout
