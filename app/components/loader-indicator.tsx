import type { FC } from 'react'

import { Loader } from '@mantine/core'
import type { LoaderProps } from '@mantine/core'

import { useTransition } from '@remix-run/react'

const LoaderIndicator: FC<LoaderProps> = ({ size = 28 }) => {
  const transition = useTransition()

  return (
    <div>{transition.state === 'idle' ? null : <Loader size={size} />}</div>
  )
}

export default LoaderIndicator
