import type { FC } from 'react'

import { Group, Stack } from '@mantine/core'

import ThemeToggle from '~/components/theme-toggle'

import useMobile from '~/hooks/useMobile'

import Hidden from './hidden'
import LoaderIndicator from './loader-indicator'

const Appbar: FC = () => {
  const isMobile = useMobile()

  return (
    <Stack spacing={0} px="xl">
      <Hidden smallerThan="sm">
        <Group position={!isMobile ? 'apart' : 'right'} py="md">
          {!isMobile ? <LoaderIndicator /> : null}
          <ThemeToggle />
        </Group>
      </Hidden>
    </Stack>
  )
}

export default Appbar
