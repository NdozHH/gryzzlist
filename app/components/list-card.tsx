import dayjs from 'dayjs'
import type { FC, MouseEvent } from 'react'
import { Trash } from 'tabler-icons-react'

import {
  ActionIcon,
  Group,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core'

import { Link, useFetcher } from '@remix-run/react'

import { formatCurrency } from '~/utils/browser'

import type { List } from '~/types/common'

type ListCardProps = List & {
  index: number
  _count?: {
    products: number
  }
}

const ListCard: FC<ListCardProps> = ({
  index,
  id,
  createdAt,
  total,
  _count,
}) => {
  const theme = useMantineTheme()
  const fetcher = useFetcher()
  const date = dayjs(createdAt).format('MMMM DD, YYYY')
  const formattedTotal = formatCurrency(total)
  const productsNumber = _count?.products
  const isDeleting = fetcher.submission?.formData.get('listId') === id

  const onSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    event.preventDefault()

    fetcher.submit(
      {
        listId: id,
      },
      {
        action: '/groceries-history?index',
        method: 'post',
      },
    )
  }

  return (
    <fetcher.Form>
      <Paper
        radius="md"
        withBorder
        p="md"
        component={Link}
        prefetch="intent"
        to={`${id}`}
        sx={theme => ({
          cursor: 'pointer',
          ':hover': {
            borderColor: theme.colors.violet[6],
          },
          ':focus': {
            borderColor: theme.colors.violet[6],
          },
        })}
      >
        <Group position="apart">
          <Stack spacing={0}>
            <Title order={4}>{`List ${index}`}</Title>
            <Text size="sm" color="dimmed">
              {date}
            </Text>
            <Text size="sm" color="dimmed">
              {productsNumber} {productsNumber === 1 ? 'product' : 'products'}
            </Text>
          </Stack>
          <Text>{formattedTotal}</Text>
          <ActionIcon
            radius="md"
            variant="default"
            loading={isDeleting}
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
            onClick={onSubmit}
          >
            <Trash size={20} color={theme.colors.gray[6]} />
          </ActionIcon>
        </Group>
      </Paper>
    </fetcher.Form>
  )
}

export default ListCard
