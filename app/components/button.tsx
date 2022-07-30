import type { FC } from 'react'

import { Button as MButton } from '@mantine/core'
import type { ButtonProps } from '@mantine/core'

const Button: FC<ButtonProps<any>> = ({ children, ...props }) => {
  return (
    <MButton
      variant="gradient"
      gradient={{ from: 'violet', to: 'grape', deg: 105 }}
      {...props}
    >
      {children}
    </MButton>
  )
}

export default Button
