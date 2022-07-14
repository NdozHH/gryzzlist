import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import type { ModalProps } from '@mantine/core'

import { Form, useSubmit, useTransition } from '@remix-run/react'

import { productSchema } from '~/utils/form-schemas'

import { PantryAction } from '~/types/common'

import DatePicker from './date-picker'
import NumberInput from './number-input'

type FormValues = z.infer<typeof productSchema>

const AddProductModal: FC<ModalProps> = props => {
  const { register, handleSubmit, formState, control, reset } =
    useForm<FormValues>({
      defaultValues: {
        name: '',
        number: 1,
        expiryDate: undefined,
      },
      resolver: zodResolver(productSchema),
    })
  const { errors } = formState
  const submit = useSubmit()
  const transition = useTransition()
  const { onClose, ...restProps } = props
  const isSubmitting = transition.state === 'submitting'

  useEffect(() => {
    if (isSubmitting) {
      reset()
      onClose()
    }
  }, [onClose, reset, isSubmitting])

  const onSubmit = ({ name, number, expiryDate }: FormValues) => {
    submit(
      {
        actionType: PantryAction.CREATE,
        name,
        number: number!.toString(),
        ...(expiryDate ? { expiryDate: expiryDate.toUTCString() } : {}),
      },
      {
        method: 'post',
        action: '/pantry',
      },
    )
  }

  return (
    <Modal
      centered
      radius="md"
      title="Add new product"
      size="sm"
      onClose={onClose}
      {...restProps}
    >
      <Form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Stack>
          <TextInput
            id="name"
            placeholder="Enter product name"
            label="Name"
            radius="md"
            size="md"
            required
            variant="default"
            error={errors?.name?.message}
            {...register('name')}
          />
          <NumberInput
            id="number"
            description="How much of this product do you have?"
            control={control}
            name="number"
            error={errors?.number?.message}
          />
          <DatePicker
            id="expiryDate"
            label="Expiry date"
            placeholder="Enter expiry date"
            name="expiryDate"
            control={control}
            description="When does this product expire?"
            error={errors?.expiryDate?.message}
          />
          <Group position="center" mt="md">
            <Button
              type="submit"
              radius="md"
              size="md"
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 105 }}
            >
              Add product
            </Button>
          </Group>
        </Stack>
      </Form>
    </Modal>
  )
}

export default AddProductModal
