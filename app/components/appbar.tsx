import type { FC } from 'react'

import { Group, Stack, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { useLocation, useMatches } from '@remix-run/react'

import ThemeToggle from '~/components/theme-toggle'

import Hidden from './hidden'

const Appbar: FC = () => {
  const theme = useMantineTheme()
  const matches = useMatches()
  const location = useLocation()
  const smUp = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`, false)
  const allowedRoutes = ['/pantry', '/lists']
  const currentRoute = matches.find(
    route => route.pathname === location.pathname,
  )
  const indexMatch =
    matches.find(route => route.id === 'routes/__app' && route.pathname === '/')
      ?.data?.user || {}
  const name = indexMatch?.name?.split(' ')?.[0] || ''

  return (
    <Stack spacing={0} px="xl">
      <Hidden smallerThan="sm">
        <Group position="right" py="md">
          <ThemeToggle />
        </Group>
      </Hidden>
      {allowedRoutes.includes(currentRoute?.pathname!) || smUp ? (
        <Stack spacing={0} mt="md">
          <Text size="md" color="dimmed" transform="capitalize">
            Hi {name},
          </Text>
          <Text
            sx={theme => ({
              fontSize: '2rem',
              fontWeight: 'bold',
              lineHeight: 1,
              [theme.fn.smallerThan('sm')]: {
                fontSize: '1.5rem',
              },
            })}
          >
            {currentRoute?.data?.name}
          </Text>
        </Stack>
      ) : null}
    </Stack>
  )
}

export default Appbar
