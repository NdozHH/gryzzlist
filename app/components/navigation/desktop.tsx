import type { FC } from 'react'

import { Group, Navbar, Stack } from '@mantine/core'

import Hidden from '~/components/hidden'

import AppLogo from '../logo'
import LogoutButton from '../logout-button'
import Options from './options'

const Desktop: FC = () => {
  return (
    <Hidden smallerThan="sm">
      <Navbar hiddenBreakpoint="sm" hidden width={{ sm: 288 }}>
        <Group position="center" mt="3.5rem">
          <AppLogo width={220} />
        </Group>
        <Stack
          justify="space-between"
          align="center"
          pb="lg"
          pt="10rem"
          sx={{
            height: '100%',
          }}
        >
          <Options />
          <LogoutButton />
        </Stack>
      </Navbar>
    </Hidden>
  )
}

export default Desktop
