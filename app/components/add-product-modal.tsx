import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import type { FC } from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { Plus } from 'tabler-icons-react'
import type { z } from 'zod'

import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'
import type { ModalProps } from '@mantine/core'

import { useFetcher } from '@remix-run/react'

import useMobile from '~/hooks/useMobile'

import { fillPantrySchema } from '~/utils/form-schemas'

import { ActionType } from '~/types/common'

import NumberInput from './number-input'

type FormValues = z.infer<typeof fillPantrySchema>

const useStyles = createStyles(theme => ({
  weekend: {
    color: `${theme.colors.violet[6]} !important`,
  },
  selected: {
    color: `${theme.white} !important`,
  },
  modal: {
    minHeight: '100vh',
  },
  modalInner: {
    padding: `${theme.spacing.md}px`,
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))

const AddProductModal: FC<ModalProps> = props => {
  const { classes } = useStyles()
  const fetcher = useFetcher()
  const { register, handleSubmit, formState, control, reset } =
    useForm<FormValues>({
      defaultValues: {
        products: [
          {
            name: '',
            number: 1,
          },
        ],
      },
      resolver: zodResolver(fillPantrySchema),
    })
  const { fields, prepend, remove, update } = useFieldArray({
    name: 'products',
    control,
  })
  const { errors } = formState
  const isMobile = useMobile()
  const { onClose: onCloseModal, ...restProps } = props
  const hasOneItem = fields.length === 1
  const isSubmitting = fetcher.state === 'submitting'
  const isDone = fetcher.state === 'loading'

  useEffect(() => {
    if (isDone) {
      onCloseModal()
      reset()
    }
  }, [isDone, onCloseModal, reset])

  const onAddProduct = () => {
    prepend({
      name: '',
      number: 1,
    })
  }

  const onRemoveProduct = (index: number) => {
    if (!hasOneItem) {
      remove(index)
    } else {
      update(0, {
        name: '',
        number: 1,
      })
    }
  }

  const onSubmit = ({ products }: FormValues) => {
    fetcher.submit(
      {
        actionType: ActionType.CREATE,
        products: JSON.stringify(products),
      },
      {
        method: 'post',
        action: '/pantry',
      },
    )
  }

  const onClose = () => {
    onCloseModal()
    reset()
  }

  return (
    <Modal
      radius="md"
      title={<Text size="lg">Fill the pantry</Text>}
      size={isMobile ? 'sm' : 'lg'}
      onClose={onClose}
      {...restProps}
      classNames={{
        inner: classes.modalInner,
        modal: classes.modal,
      }}
    >
      <fetcher.Form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
        <Group position="apart" mb="lg">
          <ActionIcon
            variant="default"
            size="md"
            radius="md"
            onClick={onAddProduct}
            title="Add product to pantry"
          >
            <Plus />
          </ActionIcon>
          <Button
            type="submit"
            radius="md"
            size={isMobile ? 'sm' : 'md'}
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 105 }}
            loading={isSubmitting}
            title="Save pantry"
          >
            Save
          </Button>
        </Group>
        <Box
          sx={theme => ({
            display: 'grid',
            overflowY: 'auto',
            gap: `${theme.spacing.md}px`,
            gridTemplateColumns: '1fr',
            scrollbarWidth: 'none',
            '::-webkit-scrollbar': {
              display: 'none',
            },
            [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
              gridTemplateColumns: '1fr 1fr',
            },
          })}
        >
          {fields.map((field, index) => {
            return (
              <Paper key={field.id} radius="md" withBorder p="sm">
                <Stack spacing="sm">
                  <TextInput
                    id="name"
                    placeholder="Enter product name"
                    label={isMobile ? undefined : 'Name'}
                    radius="md"
                    size={isMobile ? 'xs' : 'sm'}
                    required
                    variant="default"
                    error={errors?.products?.[index]?.name?.message}
                    {...register(`products.${index}.name`)}
                  />
                  <NumberInput
                    id="number"
                    label={isMobile ? undefined : 'Number'}
                    control={control}
                    variant="default"
                    name={`products.${index}.number`}
                    size={isMobile ? 'xs' : 'sm'}
                    error={errors?.products?.[index]?.number?.message}
                  />
                  <Group position="center">
                    <Button
                      size="xs"
                      radius="md"
                      variant="subtle"
                      color="gray"
                      onClick={() => onRemoveProduct(index)}
                    >
                      Remove
                    </Button>
                  </Group>
                </Stack>
              </Paper>
            )
          })}
        </Box>
      </fetcher.Form>
    </Modal>
  )
}

export default AddProductModal
