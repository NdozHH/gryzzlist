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

import { PantryAction } from '~/types/common'
import type { Product } from '~/types/common'

const ProductCard: FC<Product> = ({ id, name, number, expiryDate }) => {
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
    expiryDate ? formattedDate : undefined,
  )
  const isDeleting = transition.submission?.formData.get('productId') === id

  const onDelete = () => {
    submit(
      {
        actionType: PantryAction.DELETE,
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
            color="grape"
          >
            x{number}
          </Text>
          <Stack spacing={0}>
            <Text size="lg" transform="capitalize">
              {name}
            </Text>
            {expiryDate ? (
              <Text size="sm" color="dimmed">
                Expires:{' '}
                <span
                  style={{
                    color:
                      label === 'expired' ? theme.colors.red[5] : 'inherit',
                  }}
                >
                  {label}
                </span>
              </Text>
            ) : null}
          </Stack>
        </Group>
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
      </Group>
    </Paper>
  )
}

export default ProductCard
