import type { FC } from 'react'

import { Box, createStyles, Drawer, Text } from '@mantine/core'

import HiddenBox from '~/components/hidden'
import ThemeToggle from '~/components/theme-toggle'

import { useNavigationContext } from '.'
import Options from './options'

const useStyles = createStyles(theme => ({
  optionsContainer: {
    marginBottom: '5rem',
  },
  actionsContainer: {
    marginTop: '2rem',
  },
  drawer: {
    marginTop: theme.other.headerHeight,
  },
}))

const Mobile: FC = () => {
  const { classes } = useStyles()
  const { opened, setOpened } = useNavigationContext()

  const onCloseDrawer = () => setOpened(false)

  return (
    <HiddenBox largerThan="sm">
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        withCloseButton={false}
        title={
          <div>
            <Text transform="uppercase" size="sm" lineClamp={2}>
              juan david cano
            </Text>
            <Text size="xs" color="dimmed">
              juan@gmail.com
            </Text>
          </div>
        }
        padding="xl"
        size="md"
        className={classes.drawer}
      >
        <Box
          sx={{
            marginTop: '5rem',
            marginBottom: '8rem',
          }}
        >
          <Options onCloseDrawer={onCloseDrawer} />
        </Box>
        <div className={classes.actionsContainer}>
          <ThemeToggle />
        </div>
      </Drawer>
    </HiddenBox>
  )
}

export default Mobile
