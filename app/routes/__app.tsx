import type { FC } from 'react'

import { Container, createStyles } from '@mantine/core'

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
    height: 'calc(100% - 6rem)',
    padding: `${theme.spacing.md}px`,
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

const DashboardLayout: FC = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.container} fluid px={0}>
      {/* <Navigation />
      <div className={classes.content}>
        <Appbar />
        <main className={classes.main}>
          <Outlet />
        </main>
      </div> */}
    </Container>
  )
}

export default DashboardLayout
