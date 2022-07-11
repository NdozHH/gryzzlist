import { forwardRef } from 'react'

import {
  Button,
  createStyles,
  SegmentedControl,
  SharedButtonProps,
  useMantineTheme,
} from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'

import { ColorScheme, useColorScheme } from '~/utils/theme-provider'

const useStyles = createStyles(theme => ({
  button: {
    borderRadius: '50%',
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
    [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
      width: '2.5rem',
      height: '2.5rem',
    },
  },
  buttonLabel: {
    width: '2rem',
    height: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
      width: '2.5rem',
      height: '2.5rem',
    },
  },
  icon: {
    width: '1.3rem',
    height: '1.3rem',
    [`@media (min-width: ${theme.breakpoints.xs}px)`]: {
      width: '1.5rem',
      height: '1.5rem',
    },
  },
}))

const ThemeToggle = forwardRef<HTMLButtonElement, SharedButtonProps>(
  ({ className }, ref) => {
    const [colorScheme, setColorScheme] = useColorScheme()

    const onToggleTheme = () => {
      if (colorScheme === ColorScheme.DARK) {
        setColorScheme(ColorScheme.LIGHT)
      } else {
        setColorScheme(ColorScheme.DARK)
      }
    }

    const onChangeTheme = (value: string) => {
      if (value === 'light') {
        setColorScheme(ColorScheme.LIGHT)
      } else {
        setColorScheme(ColorScheme.DARK)
      }
    }

    useHotkeys([['ctrl+J', () => onToggleTheme()]])

    return (
      <SegmentedControl
        onChange={onChangeTheme}
        value={colorScheme}
        data={[
          {
            value: ColorScheme.DARK,
            label: 'Dark',
          },
          {
            value: ColorScheme.LIGHT,
            label: 'Light',
          },
        ]}
      />
    )
  },
)

export default ThemeToggle
