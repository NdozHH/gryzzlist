import type { FC } from 'react'

import {
  Burger,
  Group,
  Header as MHeader,
  useMantineTheme,
} from '@mantine/core'

import Hidden from '~/components/hidden'

import appLogo from '~/images/app_logo.png'

import LoaderIndicator from './loader-indicator'
import { useNavigationContext } from './navigation'

const Header: FC = () => {
  const theme = useMantineTheme()
  const { opened, setOpened } = useNavigationContext()

  const handleBurgerButton = () => {
    setOpened(prevValue => !prevValue)
  }

  return (
    <Hidden largerThan="sm">
      <MHeader
        sx={theme => ({
          padding: `${theme.spacing.sm}px `,
          zIndex: theme.other.zIndex.mobileNavigation + 1,
          display: 'flex',
        })}
        height={theme.other.headerHeight}
      >
        <Group
          position="apart"
          sx={{
            width: '100%',
          }}
        >
          <Burger
            opened={opened}
            onClick={handleBurgerButton}
            size="md"
            color={opened ? theme.colors.gray[6] : theme.colors.violet[6]}
            title="Open navigation"
            aria-label="Open navigation"
          />
          <img src={appLogo} alt="GryzzList's logo" width={140} />
          <LoaderIndicator size="sm" />
        </Group>
      </MHeader>
    </Hidden>
  )
}

export default Header
