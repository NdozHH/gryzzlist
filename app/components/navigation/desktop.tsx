import type { FC } from 'react'

import { createStyles, Navbar } from '@mantine/core'

import Hidden from '~/components/hidden'

import Options from './options'

const useStyles = createStyles(() => ({
  navigation: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    paddingTop: '4rem',
  },
  optionsContainer: {
    marginTop: '5rem',
    width: '100%',
  },
}))

const Desktop: FC = () => {
  const { classes } = useStyles()

  return (
    <Hidden smallerThan="sm">
      <Navbar
        className={classes.navigation}
        hiddenBreakpoint="sm"
        hidden
        width={{ sm: 288 }}
      >
        <div className={classes.optionsContainer}>
          <Options />
        </div>
      </Navbar>
    </Hidden>
  )
}

export default Desktop
