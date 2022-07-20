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

import { useFetcher } from '@remix-run/react'

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
  const fetcher = useFetcher()
  const formattedDate = dayjs(expiryDate).format('MMMM DD, YYYY')
  const currentDate = dayjs()
  const difference = expiryDate
    ? dayjs(expiryDate).diff(currentDate, 'days') + 1
    : 0
  const label = getExpiresLabel(
    difference,
    expiryDate ? formattedDate : 'undated',
  )
  const isDeleting = fetcher.submission?.formData.get('productId') === id

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

  return (
    <fetcher.Form>
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
    </fetcher.Form>
  )
}

export default ProductCard
