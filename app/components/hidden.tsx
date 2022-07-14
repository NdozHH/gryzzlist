import type { FC } from 'react'

import { MediaQuery } from '@mantine/core'
import type { MediaQueryProps } from '@mantine/core'

const Hidden: FC<Partial<MediaQueryProps>> = ({ children, ...props }) => {
  return (
    <MediaQuery {...props} styles={{ display: 'none' }}>
      {children}
    </MediaQuery>
  )
}

export default Hidden
