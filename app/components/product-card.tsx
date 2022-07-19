import dayjs from 'dayjs'
import type { FC } from 'react'
import { Trash } from 'tabler-icons-react'

import {
  ActionIcon,
  Group,
  Paper,
  Stack,
  Text,
  useMantineTheme,
} from '@mantine/core'

import { useSubmit, useTransition } from '@remix-run/react'

import { getExpiresLabel } from '~/utils/browser'

import { ActionType } from '~/types/common'
import type { Product } from '~/types/common'

type ProductCardProps = Omit<Product, 'price'> & {
  hideDelete?: boolean
}

const ProductCard: FC<ProductCardProps> = ({
  id,
  name,
  number,
  expiryDate,
  hideDelete = false,
}) => {
  const theme = useMantineTheme()
  const submit = useSubmit()
  const transition = useTransition()
  const formattedDate = dayjs(expiryDate).format('MMMM DD, YYYY')
  const currentDate = dayjs()
  const difference = expiryDate
    ? dayjs(expiryDate).diff(currentDate, 'days') + 1
    : 0
  const label = getExpiresLabel(
    difference,
    expiryDate ? formattedDate : 'undated',
  )
  const isDeleting = transition.submission?.formData.get('productId') === id

  const onDelete = () => {
    submit(
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

  return (
    <Paper radius="md" withBorder p="md" hidden={isDeleting}>
      <Group position="apart">
        <Group>
          <Text
            sx={{
              fontSize: '1.3rem',
            }}
            color="violet"
          >
            x{number}
          </Text>
          <Stack spacing={0}>
            <Text size="lg" transform="capitalize">
              {name}
            </Text>
            <Text size="sm" color="dimmed">
              Expires: {label}
            </Text>
          </Stack>
        </Group>
        {!hideDelete ? (
          <Group>
            <ActionIcon
              radius="md"
              variant="default"
              sx={{
                backgroundColor: 'transparent',
                border: 'none',
              }}
              onClick={onDelete}
            >
              <Trash size={20} color={theme.colors.gray[6]} />
            </ActionIcon>
          </Group>
        ) : null}
      </Group>
    </Paper>
  )
}

export default ProductCard
