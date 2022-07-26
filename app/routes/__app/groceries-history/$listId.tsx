import type { FC } from 'react'
import { ChevronLeft } from 'tabler-icons-react'
import invariant from 'tiny-invariant'

import { Box, Stack, Text, useMantineTheme } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { Link, useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'
import ProductCard from '~/components/product-card'
import RouteContainer from '~/components/route-container'

import useRouteData from '~/hooks/useRouteData'

import { deleteList, getListProducts } from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import type { BaseLoaderData, Handle, Product } from '~/types/common'

interface LoaderData {
  name: string
  products: Product[] | undefined
}

export const handle: Handle = {
  id: 'list-detail',
}

export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const { listId } = params
    const session = await handleSession(request)
    const userId = session.getUserId()

    invariant(userId, 'userId is not valid')
    invariant(listId, 'listId is not valid')

    const products = await getListProducts(listId)

    return json<LoaderData>(
      {
        name: 'List',
        products,
      },
      {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    )
  } catch (error) {
    throw new Response('Unexpected error', {
      status: 500,
    })
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const session = await handleSession(request)
    const listId = formData.get('listId')

    invariant(listId, 'listId is required')

    await deleteList(String(listId))

    session.instance.flash('notification', `List has been deleted`)

    return redirect('/lists', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    })
  } catch (error) {
    throw new Response('Unexpected error', {
      status: 500,
    })
  }
}

export const CatchBoundary = () => {
  const { status } = useCatch()

  return <ErrorContainer status={status} />
}

const Header: FC = () => {
  const theme = useMantineTheme()
  const currentRoute = useRouteData<BaseLoaderData>('list-detail')

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
  const loaderData = useLoaderData<LoaderData>()
  const { products } = loaderData
  const isEmpty = products?.length === 0

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
          <>
            {products?.map(product => (
              <ProductCard key={product.id} hideDelete {...product} />
            ))}
          </>
        ) : (
          <Text>You don't have any selected list</Text>
        )}
      </Stack>
    </RouteContainer>
  )
}

export default ListDetailRoute
