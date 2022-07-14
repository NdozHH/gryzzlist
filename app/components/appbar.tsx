import type { FC } from 'react'

import { Group, Stack, Text } from '@mantine/core'

import { useLocation, useMatches } from '@remix-run/react'

import ThemeToggle from '~/components/theme-toggle'

import Hidden from './hidden'

const Appbar: FC = () => {
  const matches = useMatches()
  const location = useLocation()
  const currentRoute = matches.find(
    route => route.pathname === location.pathname,
  )

  return (
    <Stack spacing={0} py="lg" px="xl">
      <Hidden smallerThan="sm">
        <Group position="right" mb="xl">
          <ThemeToggle />
        </Group>
      </Hidden>
      <Stack spacing={0}>
        <Text size="md" color="dimmed">
          Hi Juan,
        </Text>
        <Text
          sx={{
            fontSize: '2rem',
            fontWeight: 'bold',
            lineHeight: 1,
          }}
          component="span"
        >
          {currentRoute?.data?.name}
        </Text>
      </Stack>
    </Stack>
  )
}

export default Appbar
