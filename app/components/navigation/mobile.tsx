import type { FC } from 'react'

import { createStyles, Drawer, Group, Stack } from '@mantine/core'

import HiddenBox from '~/components/hidden'
import ThemeToggle from '~/components/theme-toggle'

import { useNavigationContext } from '.'
import LogoutButton from '../logout-button'
import Options from './options'

const useStyles = createStyles(theme => ({
  drawer: {
    marginTop: theme.other.headerHeight,
  },
  title: {
    margin: 0,
    width: '100%',
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
          <Group position="right" p="xl">
            <ThemeToggle />
          </Group>
        }
        size="md"
        className={classes.drawer}
        classNames={{
          title: classes.title,
        }}
      >
        <Stack
          spacing={0}
          sx={{
            paddingTop: '3rem',
            marginBottom: '8rem',
          }}
        >
          <Options onCloseDrawer={onCloseDrawer} />
          <Group
            position="center"
            sx={{
              marginTop: '10rem',
            }}
          >
            <LogoutButton />
          </Group>
        </Stack>
      </Drawer>
    </HiddenBox>
  )
}

export default Mobile
