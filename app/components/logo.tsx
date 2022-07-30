import type { FC } from 'react'

import { Image } from '@mantine/core'
import type { ImageProps } from '@mantine/core'

import appLogo from '~/images/app_logo.png'

const AppLogo: FC<ImageProps> = props => {
  return <Image src={appLogo} alt="GryzzList's logo" {...props} />
}

export default AppLogo
