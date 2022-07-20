import type { FC } from 'react'

import { Group, Stack, Text, useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

import { useLocation, useMatches } from '@remix-run/react'

import ThemeToggle from '~/components/theme-toggle'

import Hidden from './hidden'
import LoaderIndicator from './loader-indicator'

const Appbar: FC = () => {
  const theme = useMantineTheme()
  const matches = useMatches()
  const location = useLocation()

  const currentRoute = matches.find(
    route => route.pathname === location.pathname,
  )
  const indexMatch =
    matches.find(route => route.id === 'routes/__app' && route.pathname === '/')
      ?.data?.user || {}
  const name = indexMatch?.name?.split(' ')?.[0] || ''
  const isBaseRoute = location.pathname === '/pantry'
  const smUp = useMediaQuery(`(min-width: ${theme.breakpoints.sm}px)`, false)

  return (
    <Stack spacing={0} px="xl">
      <Hidden smallerThan="sm">
        <Group position={smUp ? 'apart' : 'right'} py="md">
          {smUp ? <LoaderIndicator /> : null}
          <ThemeToggle />
        </Group>
      </Hidden>

      {smUp || (!smUp && isBaseRoute) ? (
        <Stack
          spacing={0}
          mb="sm"
          sx={theme => ({
            [theme.fn.smallerThan('sm')]: {
              marginTop: `${theme.spacing.md}px`,
            },
          })}
        >
          {isBaseRoute ? (
            <Text size="md" color="dimmed" transform="capitalize">
              Hi {name},
            </Text>
          ) : null}
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
