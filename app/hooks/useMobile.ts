import { useMantineTheme } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

const useMobile = () => {
  const theme = useMantineTheme()
  const isMobile = useMediaQuery(
    `(max-width: ${theme.breakpoints.sm}px)`,
    false,
  )

  return isMobile
}

export default useMobile
