import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { Check, Dots, Edit, Trash, X } from 'tabler-icons-react'
import type { z } from 'zod'

import {
  ActionIcon,
  createStyles,
  Group,
  Menu,
  Paper,
  Text,
  TextInput,
} from '@mantine/core'
import type { MenuItemProps } from '@mantine/core'

import { useFetcher } from '@remix-run/react'

import { productSchema } from '~/utils/form-schemas'

import { ActionType } from '~/types/common'
import type { Product } from '~/types/common'

import NumberInput from './number-input'

type ProductCardProps = Omit<Product, 'price'> & {
  hideDelete?: boolean
}

type ItemProps = Omit<MenuItemProps<'button'>, 'children'> & {
  label: string
  id: string
}

type CardMenuProps = {
  options: ItemProps[]
}

type FormValues = z.infer<typeof productSchema>

const useStyles = createStyles(theme => ({
  numberInput: {
    width: '3rem',
    paddingLeft: `${theme.spacing.xs}px`,
    paddingRight: `${theme.spacing.xs}px`,
    textAlign: 'center',
  },
  nameInput: {
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      maxWidth: '12rem',
    },
  },
}))

const CardMenu: FC<CardMenuProps> = ({ options }) => {
  return (
    <Menu
      placement="end"
      withArrow
      withinPortal={false}
      radius="md"
      size="xs"
      control={
        <ActionIcon radius="md">
          <Dots size={18} />
        </ActionIcon>
      }
    >
      {options.map(option => {
        const { id, label, ...restOption } = option
        return (
          <Menu.Item key={id} {...restOption}>
            {label}
          </Menu.Item>
        )
      })}
    </Menu>
  )
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  number,
  hideDelete = false,
}) => {
  const { classes } = useStyles()
  const fetcher = useFetcher()
  const [editMode, setEditMode] = useState(false)
  const { register, handleSubmit, formState, control, reset } =
    useForm<FormValues>({
      defaultValues: {
        name,
        number,
      },
      resolver: zodResolver(productSchema),
    })
  const { errors, isDirty } = formState
  const submittedActionType = fetcher.submission?.formData.get('actionType')
  const submittedProductId = fetcher.submission?.formData.get('productId')
  const isDeleting =
    submittedActionType === ActionType.DELETE && submittedProductId === id
  const isUpdating =
    submittedActionType === ActionType.EDIT && submittedProductId === id
  const isDone = fetcher.state === 'loading'

  useEffect(() => {
    if (isDone) {
      reset()
      setEditMode(false)
    }
  }, [isDone, reset])

  const onDelete = () => {
    fetcher.submit(
      {
        actionType: ActionType.DELETE,
        productId: id,
      },
      {
        method: 'post',
        action: '/pantry',
      },
    )
  }

  const onUpdate = ({ name, number }: FormValues) => {
    if (isDirty) {
      fetcher.submit(
        {
          actionType: ActionType.EDIT,
          productId: id,
          name,
          number: number.toString(),
        },
        {
          method: 'post',
          action: '/pantry',
        },
      )
    } else {
      setEditMode(false)
    }
  }

  const options: ItemProps[] = [
    {
      id: 'edit',
      label: 'Edit',
      icon: <Edit size={16} />,
      onClick: () => setEditMode(true),
    },
    {
      id: 'delete',
      label: 'Delete',
      color: 'red',
      icon: <Trash size={16} />,
      onClick: onDelete,
    },
  ]

  return (
    <fetcher.Form onSubmit={handleSubmit(onUpdate)} hidden={isDeleting}>
      <Paper radius="md" withBorder p="md">
        <Group position="apart">
          <Group spacing="sm">
            {!editMode ? (
              <Text
                sx={{
                  fontSize: '1.3rem',
                }}
                color="violet"
              >
                x{number}
              </Text>
            ) : (
              <NumberInput
                aria-label="Product number"
                id="number"
                control={control}
                enterKeyHint="done"
                inputMode="numeric"
                placeholder="#"
                size="sm"
                name="number"
                variant="default"
                hideControls
                error={errors?.number?.message}
                classNames={{
                  input: classes.numberInput,
                }}
              />
            )}
            {!editMode ? (
              <Text size="lg" transform="capitalize">
                {name}
              </Text>
            ) : (
              <TextInput
                aria-label="Product name"
                id="name"
                placeholder="Product name"
                radius="md"
                size="sm"
                enterKeyHint="done"
                variant="default"
                inputMode="text"
                error={errors?.name?.message}
                {...register('name')}
                classNames={{
                  input: classes.nameInput,
                }}
              />
            )}
          </Group>
          {!hideDelete ? (
            <Group position="center">
              {editMode ? (
                <ActionIcon
                  radius="md"
                  variant="default"
                  type="submit"
                  loading={isUpdating}
                >
                  {isDirty ? <Check size={18} /> : <X size={18} />}
                </ActionIcon>
              ) : (
                <CardMenu options={options} />
              )}
            </Group>
          ) : null}
        </Group>
      </Paper>
    </fetcher.Form>
  )
}

export default ProductCard
