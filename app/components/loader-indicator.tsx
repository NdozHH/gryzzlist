import type { FC } from 'react'

import { Loader } from '@mantine/core'
import type { LoaderProps } from '@mantine/core'

import { useTransition } from '@remix-run/react'

const LoaderIndicator: FC<LoaderProps> = ({ size = 28 }) => {
  const transition = useTransition()

  return (
    <Loader
      size={size}
      sx={{
        visibility: transition.state === 'idle' ? 'hidden' : 'visible',
      }}
    />
  )
}

export default LoaderIndicator
