import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Container, createStyles } from '@mantine/core'

import type { LoaderFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import Appbar from '~/components/appbar'
import Navigation from '~/components/navigation'

import { verifySession } from '~/utils/auth.server'
import { getUser } from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

const useStyles = createStyles(theme => ({
  container: {
    position: 'relative',
    height: '100%',
    display: 'grid',
    gridTemplateColumns: 'fit-content(100%) 1fr',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      gridTemplateColumns: '1fr',
      gridTemplateRows: 'fit-content(100%) 1fr',
    },
  },
  main: {
    height: '100%',
    padding: `0 ${theme.spacing.xl}px`,
    marginTop: `${theme.spacing.lg}px`,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: `0 ${theme.spacing.sm}px`,
      marginTop: `${theme.spacing.sm}px`,
      height: '100%',
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    overflow: 'hidden',
    position: 'relative',
  },
}))

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

const DashboardLayout: FC = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.container} fluid px={0}>
      <Navigation />
      <div className={classes.content}>
        <Appbar />
        <main className={classes.main}>
          <Outlet />
        </main>
      </div>
    </Container>
  )
}

export default DashboardLayout
