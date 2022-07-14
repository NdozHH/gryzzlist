import type { FC } from 'react'
import { MoonStars, Sun } from 'tabler-icons-react'

import { ActionIcon } from '@mantine/core'
import type { ActionIconProps } from '@mantine/core'
import { useHotkeys } from '@mantine/hooks'

import { ColorScheme, useColorScheme } from '~/utils/theme-provider'

const ThemeToggle: FC<ActionIconProps<'button'>> = ({ className }) => {
  const [colorScheme, setColorScheme] = useColorScheme()
  const isDarkTheme = colorScheme === ColorScheme.DARK
  const title = `Switch to ${
    isDarkTheme ? ColorScheme.LIGHT : ColorScheme.DARK
  } mode`

  const onToggleTheme = () => {
    if (isDarkTheme) {
      setColorScheme(ColorScheme.LIGHT)
    } else {
      setColorScheme(ColorScheme.DARK)
    }
  }

  useHotkeys([['ctrl+J', () => onToggleTheme()]])

  return (
    <ActionIcon
      className={className}
      radius="md"
      size="lg"
      onClick={onToggleTheme}
      color={isDarkTheme ? 'yellow' : 'blue'}
      title={title}
    >
      {isDarkTheme ? <Sun size={20} /> : <MoonStars size={20} />}
    </ActionIcon>
  )
}

export default ThemeToggle
