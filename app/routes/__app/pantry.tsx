import { useState } from 'react'
import { Search } from 'tabler-icons-react'
import invariant from 'tiny-invariant'

import {
  Box,
  Button,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'

import { redirect, json } from '@remix-run/node'
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from '@remix-run/node'
import { useCatch, useLoaderData, useTransition } from '@remix-run/react'

import AddProductModal from '~/components/add-product-modal'
import ErrorContainer from '~/components/error-container'
import ProductCard from '~/components/product-card'

import useNotification from '~/hooks/useNotification'

import { getFilteredProducts } from '~/utils/browser'
import {
  createProduct,
  deleteProduct,
  generateRandomString,
  getProducts,
} from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import { ActionType } from '~/types/common'
import type { Product, AlertNotification } from '~/types/common'

interface LoaderData {
  products: Product[]
  name: string
  notification?: AlertNotification
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

    if (actionType === ActionType.CREATE) {
      const name = formData.get('name')
      const number = formData.get('number')
      const expiryDate = formData.get('expiryDate')

      invariant(name, 'name is required')
      invariant(
        number && typeof Number(number) === 'number',
        'number is required',
      )
      invariant(userId, 'userId is not valid')

      if (expiryDate) {
        invariant(typeof expiryDate === 'string', 'expiryDate must be a string')
      }

      const product = await createProduct({
        name: String(name),
        number: +number,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        userId,
      })

      session.instance.flash(
        'notification',
        `Product ${product.name || ''} has been created`,
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

const PantryRoute = () => {
  const transition = useTransition()
  const [opened, setOpened] = useState(false)
  const [filter, setFilter] = useState('')
  const loaderData = useLoaderData<LoaderData>()
  const { products, notification } = loaderData
  const filteredProducts = getFilteredProducts(products, filter)
  const optimisticProduct = {
    name: transition.submission?.formData.get('name'),
    number: transition.submission?.formData.get('number'),
    expiryDate: transition.submission?.formData.get('expiryDate')
      ? new Date(String(transition.submission?.formData.get('expiryDate')))
      : null,
  }
  useNotification(notification)

  return (
    <Container
      fluid
      px={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={theme => ({
          width: '100%',
          maxWidth: 550,
          paddingBottom: `${theme.spacing.xl}px`,
        })}
      >
        <Stack spacing={0}>
          <Group position="right" mb="lg">
            <Button
              radius="md"
              size="sm"
              variant="gradient"
              gradient={{ from: 'violet', to: 'grape', deg: 105 }}
              onClick={() => setOpened(true)}
            >
              Add product
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
        {products.length > 0 ? (
          <>
            {filteredProducts.length > 0 ? (
              <Stack>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} {...product} />
                ))}
                {optimisticProduct.name ? (
                  <ProductCard
                    id=""
                    name={String(optimisticProduct.name)}
                    number={Number(optimisticProduct.number)}
                    expiryDate={optimisticProduct.expiryDate}
                  />
                ) : null}
              </Stack>
            ) : (
              <Stack align="center" mt="xl" spacing="sm">
                <Search size={40} color="grey" />
                <Text>There're no products matching your search query</Text>
              </Stack>
            )}
          </>
        ) : (
          <Stack align="center" mt="xl" spacing="sm">
            <Text>You don't have any products in your pantry yet</Text>
          </Stack>
        )}
      </Box>
      <AddProductModal opened={opened} onClose={() => setOpened(false)} />
    </Container>
  )
}

export default PantryRoute
