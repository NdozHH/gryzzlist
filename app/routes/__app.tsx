import type { FC } from 'react'

import { Container, createStyles } from '@mantine/core'

import type { LoaderFunction } from '@remix-run/node'
import { Outlet } from '@remix-run/react'

import Appbar from '~/components/appbar'
import Navigation from '~/components/navigation'

import { verifySession } from '~/utils/auth.server'

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
    height: `calc(100% - ${theme.other.appbarHeight})`,
    padding: `${theme.spacing.lg}px ${theme.spacing.xl}px`,
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: `${theme.spacing.sm}px`,
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
  return null
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
