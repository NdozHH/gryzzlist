import dayjs from 'dayjs'
import type { FC } from 'react'
import { ChevronLeft } from 'tabler-icons-react'
import invariant from 'tiny-invariant'

import { Box, Group, Stack, Text, useMantineTheme } from '@mantine/core'

import { json } from '@remix-run/node'
import type { LoaderFunction, MetaFunction } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'

import Button from '~/components/button'
import ErrorContainer from '~/components/error-container'
import ProductCard from '~/components/product-card'
import RouteContainer from '~/components/route-container'

import useImageMediaQuery from '~/hooks/useImageMediaQuery'
import useRouteData from '~/hooks/useRouteData'

import { formatCurrency } from '~/utils/browser'
import { getListProducts } from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import emptyList from '~/images/404.svg'
import type { Handle, ListDetail } from '~/types/common'

interface LoaderData {
  name: string
  list: ListDetail | null
}

export const handle: Handle = {
  id: 'list-detail',
}

export const meta: MetaFunction = () => {
  return {
    title: 'List detail | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { listId } = params
  const session = await handleSession(request)
  const userId = session.getUserId()

  invariant(userId, 'userId is not valid')
  invariant(listId, 'listId is not valid')

  const list = await getListProducts(listId)

  if (!list) {
    throw new Response(`There's no list for the id: ${listId}`, {
      status: 404,
    })
  }

  return json<LoaderData>({
    name: 'List detail',
    list,
  })
}

export const CatchBoundary = () => {
  const { status, data } = useCatch()

  return (
    <ErrorContainer
      status={status}
      description={data}
      action={
        <Button component={Link} to="/groceries-history" radius="md" size="md">
          Return to history
        </Button>
      }
    />
  )
}

const Header: FC = () => {
  const theme = useMantineTheme()
  const currentRoute = useRouteData<LoaderData>('list-detail')

  return (
    <Stack spacing={0} mb="sm">
      <Text
        sx={theme => ({
          fontSize: '2rem',
          fontWeight: 'bold',
          lineHeight: 1,
          [theme.fn.smallerThan('sm')]: {
            fontSize: '1.5rem',
          },
        })}
      >
        {currentRoute?.name}
      </Text>
      <Box
        color="violet"
        sx={theme => ({
          display: 'flex',
          alignItems: 'center',
          columnGap: `${theme.spacing.xs}px`,
          marginTop: `${theme.spacing.lg}px`,
          [theme.fn.smallerThan('sm')]: {
            marginTop: `${theme.spacing.sm}px`,
          },
        })}
      >
        <ChevronLeft color={theme.colors.violet[6]} />
        <Text component={Link} to="/groceries-history" variant="link">
          Back to history
        </Text>
      </Box>
    </Stack>
  )
}

const ListDetailRoute: FC = () => {
  const smallImageQuery = useImageMediaQuery('sm')
  const loaderData = useLoaderData<LoaderData>()
  const { list } = loaderData
  const date = dayjs(list?.createdAt).format('MMMM DD, YYYY')
  const formattedTotal = formatCurrency(list?.total || 0)
  const isEmpty = list?.products.length === 0

  return (
    <RouteContainer
      header={<Header />}
      sx={{
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing="md"
        pb="xl"
        justify={isEmpty ? 'center' : 'flex-start'}
        align={isEmpty ? 'center' : 'stretch'}
        sx={{
          width: '100%',
          maxWidth: '34.375rem',
        }}
      >
        {!isEmpty ? (
          <Stack spacing="lg">
            <Group position="apart">
              <Text size="lg">Created at: {date}</Text>
              <Text size="lg">{formattedTotal}</Text>
            </Group>
            {list?.products.map(product => (
              <ProductCard key={product.id} hideDelete {...product} />
            ))}
          </Stack>
        ) : (
          <Stack align="center" mt="xl" spacing="sm">
            <img
              srcSet={`${emptyList} 890w`}
              sizes={`${smallImageQuery} 260px, 330px`}
              src={emptyList}
              alt="A woman standing next to a cell phone with list items"
            />
            <Text mt="md" size="xl">
              Sorry, this list doesn't exist
            </Text>
          </Stack>
        )}
      </Stack>
    </RouteContainer>
  )
}

export default ListDetailRoute
