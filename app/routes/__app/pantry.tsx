import { useState } from 'react'
import type { FC } from 'react'
import { Search } from 'tabler-icons-react'
import invariant from 'tiny-invariant'
import type { z } from 'zod'

import { Box, Group, Stack, Text, TextInput } from '@mantine/core'

import { redirect, json } from '@remix-run/node'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { useCatch, useLoaderData, useTransition } from '@remix-run/react'

import AddProductModal from '~/components/add-product-modal'
import Button from '~/components/button'
import ErrorContainer from '~/components/error-container'
import PantryContent from '~/components/pantry-content'
import RouteContainer from '~/components/route-container'

import useNotification from '~/hooks/useNotification'
import usePantrySearchFilter from '~/hooks/usePantrySearchFilter'
import useRouteData from '~/hooks/useRouteData'

import {
  deleteProduct,
  fillPantry,
  generateRandomString,
  getProducts,
  updateProduct,
} from '~/utils/database.server'
import type { productSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import { ActionType } from '~/types/common'
import type {
  Product,
  AlertNotification,
  BaseLoaderData,
  Handle,
} from '~/types/common'

import type { LoaderData as AppLoaderData } from '../__app'

type Pantry = z.infer<typeof productSchema>[]

interface LoaderData {
  products: Product[]
  name: string
  notification?: AlertNotification
}

export const handle: Handle = {
  id: 'pantry',
}

export const meta: MetaFunction = () => {
  return {
    title: 'Pantry products | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await handleSession(request)
    const userId = session.getUserId() || ''
    const notification = session.instance.get('notification') || null

    invariant(userId, 'userId is not valid')

    const products = await getProducts(userId)

    return json<LoaderData>(
      {
        ...(notification
          ? {
              notification: {
                id: generateRandomString(),
                message: notification,
              },
            }
          : {}),
        products,
        name: 'Pantry products',
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
    const actionType = formData.get('actionType') as ActionType
    const session = await handleSession(request)
    const userId = session.getUserId()

    invariant(userId, 'userId is not valid')

    if (actionType === ActionType.CREATE) {
      const products = formData.get('products')

      invariant(products, 'products is required')

      await fillPantry({
        products: JSON.parse(products as string) as Pantry,
        userId,
      })

      session.instance.flash('notification', `Pantry has been filled`)

      return redirect('/pantry', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      })
    }

    if (actionType === ActionType.EDIT) {
      const productId = formData.get('productId')
      const name = formData.get('name')
      const number = formData.get('number')

      invariant(productId, 'productId is required')
      invariant(name, 'name is required')
      invariant(number, 'number is required')

      const updatedProduct = await updateProduct({
        name: String(name),
        number: Number(number),
        productId: String(productId),
      })

      session.instance.flash(
        'notification',
        `Product ${updatedProduct.name || ''} has been updated`,
      )

      return redirect('/pantry', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      })
    }

    if (actionType === ActionType.DELETE) {
      const productId = formData.get('productId')

      invariant(productId, 'productId is required')

      const deletedProduct = await deleteProduct(String(productId))

      session.instance.flash(
        'notification',
        `Product ${deletedProduct.name || ''} has been deleted`,
      )

      return redirect('/pantry', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      })
    }

    return undefined
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
  const currentRoute = useRouteData<BaseLoaderData>('pantry')
  const appRoute = useRouteData<AppLoaderData>('app')
  const name = appRoute?.user?.name?.split(' ')?.[0] || ''

  return (
    <Stack spacing={0} mb="sm">
      <Text size="md" color="dimmed" transform="capitalize">
        Hi {name},
      </Text>
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
    </Stack>
  )
}

const PantryRoute = () => {
  const transition = useTransition()
  const [opened, setOpened] = useState(false)
  const loaderData = useLoaderData<LoaderData>()
  const { products, notification } = loaderData
  const { filteredProducts, filter, setFilter } =
    usePantrySearchFilter(products)
  const optimisticProduct = {
    name: transition.submission?.formData.get('name'),
    number: transition.submission?.formData.get('number'),
  }
  useNotification(notification)

  return (
    <RouteContainer
      header={<Header />}
      sx={{
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        pb="xl"
        sx={{
          width: '100%',
          maxWidth: '34.375rem',
        }}
      >
        <Stack spacing={0}>
          <Group position="right" mb="lg">
            <Button radius="md" size="sm" onClick={() => setOpened(true)}>
              Create pantry
            </Button>
          </Group>
          <TextInput
            mb="md"
            radius="md"
            size="md"
            variant="default"
            placeholder="Search your products"
            icon={<Search size={20} />}
            value={filter}
            onChange={event => setFilter(event.currentTarget.value)}
          />
        </Stack>
        <PantryContent
          isEmpty={products.length === 0}
          products={filteredProducts}
          optimisticProduct={optimisticProduct}
        />
      </Box>
      <AddProductModal opened={opened} onClose={() => setOpened(false)} />
    </RouteContainer>
  )
}

export default PantryRoute
