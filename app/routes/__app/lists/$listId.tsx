import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Stack, Text } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'
import ProductCard from '~/components/product-card'

import { deleteList, getListProducts } from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import type { Product } from '~/types/common'

interface LoaderData {
  name: string
  products: Product[] | undefined
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
        name: 'Previous lists',
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

const ListsDetailRoute: FC = () => {
  const loaderData = useLoaderData<LoaderData>()
  const { products } = loaderData
  const isEmpty = products?.length === 0

  return (
    <Stack
      justify={isEmpty ? 'center' : 'flex-start'}
      align={isEmpty ? 'center' : 'stretch'}
      sx={{
        width: '100%',
        maxWidth: '34.375rem',
        overflow: 'hidden',
        height: '100%',
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
  )
}

export default ListsDetailRoute
