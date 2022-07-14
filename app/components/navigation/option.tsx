import type { FC, ReactNode } from 'react'

import { Button, createStyles, Group } from '@mantine/core'

import { NavLink, useLocation } from '@remix-run/react'
import type { NavLinkProps } from '@remix-run/react'

interface OptionProps extends Omit<NavLinkProps, 'children'> {
  label: string
  leftIcon: ReactNode
  onClick?: () => void
}

const useStyles = createStyles(theme => ({
  button: {
    width: '100%',
    borderRadius: 0,
    border: 'none',
    borderLeft: '4px solid transparent',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[2]
        : theme.colors.gray[6],
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: 'transparent',
    },
  },
  buttonInner: {
    justifyContent: 'flex-start',
  },
  active: {
    borderLeftColor: theme.colors.violet[6],
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.violet[4]
        : theme.colors.violet[6],
  },
}))

const Option: FC<OptionProps> = ({ to, label, leftIcon, onClick }) => {
  const { classes, cx } = useStyles()
  const { pathname } = useLocation()
  const isActive = `/${to}` === pathname || pathname.startsWith(`/${to}/`)

  return (
    <Button
      className={cx(classes.button, {
        [classes.active]: isActive,
      })}
      classNames={{
        inner: classes.buttonInner,
      }}
      component={NavLink}
      to={to}
      prefetch="intent"
      size="md"
      onClick={() => {
        if (onClick) onClick()
      }}
    >
      <Group pl="xl">
        {leftIcon}
        {label}
      </Group>
    </Button>
  )
}

export default Option
