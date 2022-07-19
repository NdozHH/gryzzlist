import type { FC } from 'react'
import { Calculator, CheckupList, Cheese } from 'tabler-icons-react'

import { Stack } from '@mantine/core'

import Option from './option'

interface OptionsProps {
  onCloseDrawer?: () => void
}

const Options: FC<OptionsProps> = ({ onCloseDrawer }) => {
  return (
    <Stack
      spacing="lg"
      sx={{
        width: '100%',
      }}
    >
      <Option
        to="pantry"
        label="Pantry"
        leftIcon={<Cheese size={25} />}
        onClick={onCloseDrawer}
      />
      <Option
        to="calculator"
        label="Calculator"
        leftIcon={<Calculator size={25} />}
        onClick={onCloseDrawer}
      />
      <Option
        to="lists"
        label="Lists"
        leftIcon={<CheckupList size={25} />}
        onClick={onCloseDrawer}
      />
    </Stack>
  )
}

export default Options
