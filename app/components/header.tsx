import type { FC } from 'react'
import { Bell } from 'tabler-icons-react'

import {
  ActionIcon,
  Burger,
  Group,
  Header as MHeader,
  Text,
  useMantineTheme,
} from '@mantine/core'

import Hidden from '~/components/hidden'

import { useNavigationContext } from './navigation'

const Header: FC = () => {
  const theme = useMantineTheme()
  const { opened, setOpened } = useNavigationContext()

  const handleBurgerButton = () => setOpened(prevValue => !prevValue)

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
          <Text>Application header</Text>
          <ActionIcon variant="transparent">
            <Bell color={theme.colors.violet[6]} />
          </ActionIcon>
        </Group>
      </MHeader>
    </Hidden>
  )
}

export default Header
