import { Controller } from 'react-hook-form'
import type { Control, Path } from 'react-hook-form'

import { DatePicker as MDatePicker } from '@mantine/dates'
import type { DatePickerProps as MDatePickerProps } from '@mantine/dates'

type DatePickerProps<FieldValues> = {
  control: Control<FieldValues>
  name: Path<FieldValues>
} & MDatePickerProps

const DatePicker = <T,>(props: DatePickerProps<T>) => {
  const { name, control, ...restProps } = props

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value, name, ref } }) => {
        return (
          <MDatePicker
            name={name}
            size="md"
            radius="md"
            variant="default"
            value={value as Date}
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

export default DatePicker
