import { Controller } from 'react-hook-form'
import type { Control, Path } from 'react-hook-form'

import { NumberInput as MNumberInput } from '@mantine/core'
import type { NumberInputProps as MNumberInputProps } from '@mantine/core'

type NumberInputProps<FieldValues> = {
  control: Control<FieldValues>
  name: Path<FieldValues>
} & MNumberInputProps

const NumberInput = <T,>(props: NumberInputProps<T>) => {
  const { name, control, ...restProps } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        return (
          <MNumberInput
            name={name}
            min={1}
            size="md"
            label="Number"
            required
            radius="md"
            variant="default"
            value={value as number}
            onChange={newValue => {
              onChange(newValue)
            }}
            onBlur={onBlur}
            ref={ref}
            {...restProps}
          />
        )
      }}
    />
  )
}

export default NumberInput
