import { useMantineTheme } from '@mantine/core'
import type { MantineNumberSize } from '@mantine/core'

const useImageMediaQuery = (breakpoint: MantineNumberSize) => {
  const theme = useMantineTheme()
  const query = theme.fn.smallerThan(breakpoint)

  return query.split('@media ')[1]
}

export default useImageMediaQuery
