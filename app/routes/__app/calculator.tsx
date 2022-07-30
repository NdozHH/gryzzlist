import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import type { Control } from 'react-hook-form'
import { Receipt2, Search } from 'tabler-icons-react'
import invariant from 'tiny-invariant'
import type { z } from 'zod'

import { Box, Group, Paper, Stack, Text, TextInput } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from '@remix-run/node'
import { useCatch, useFetcher, useLoaderData } from '@remix-run/react'

import Button from '~/components/button'
import ErrorContainer from '~/components/error-container'
import NumberInput from '~/components/number-input'
import PantryContent from '~/components/pantry-content'
import PantryModal from '~/components/pantry-modal'
import RouteContainer from '~/components/route-container'

import useNotification from '~/hooks/useNotification'
import usePantrySearchFilter from '~/hooks/usePantrySearchFilter'

import {
  createList,
  generateRandomString,
  getProducts,
} from '~/utils/database.server'
import { calculatorSchema } from '~/utils/form-schemas'
import type { calculatorItemSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification, Handle, Product } from '~/types/common'

type FormValues = z.infer<typeof calculatorSchema>

type List = z.infer<typeof calculatorItemSchema>[]

type TotalProps = {
  control: Control<FormValues>
}

interface LoaderData {
  name: string
  notification?: AlertNotification
  pantry: Product[]
}

export const handle: Handle = {
  id: 'calculator',
}

export const meta: MetaFunction = () => {
  return {
    title: 'Calculator | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await handleSession(request)
    const userId = session.getUserId()
    const notification = session.instance.get('notification') || null

    invariant(userId, 'userId is not valid')

    const pantry = await getProducts(userId)

    return json<LoaderData>(
      {
        ...(notification
          ? {
              notification: {
                message: notification,
                id: generateRandomString(),
              },
            }
          : {}),
        name: 'Calculator',
        pantry,
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
    const userId = session.getUserId()
    const products = formData.get('products')
    const total = formData.get('total')

    invariant(products, 'products is required')
    invariant(total, 'total is required')
    invariant(userId, 'userId is not valid')

    await createList({
      products: JSON.parse(products as string) as List,
      total: Number(total),
      userId,
    })

    session.instance.flash('notification', `List has been saved`)

    return redirect('/calculator', {
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

const Total: FC<TotalProps> = ({ control }) => {
  const values = useWatch({
    name: 'products',
    control,
  })
  const total = values.reduce(
    (sum, current) => sum + (current.price * current.number || 0),
    0,
  )
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return (
    <Text
      lineClamp={1}
      sx={theme => ({
        fontSize: '2.5rem',
        userSelect: 'none',
        [theme.fn.smallerThan('sm')]: {
          fontSize: '1.3rem',
        },
      })}
    >
      {formatter.format(total)}
    </Text>
  )
}

const CalculatorRoute: FC = () => {
  const fetcher = useFetcher()
  const loaderData = useLoaderData<LoaderData>()
  const { notification, pantry } = loaderData
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      products: [
        {
          name: '',
          price: undefined,
          number: 1,
        },
      ],
    },
    resolver: zodResolver(calculatorSchema),
  })
  const { fields, prepend, remove, update } = useFieldArray({
    name: 'products',
    control,
  })
  const [showPantryModal, setShowPantryModal] = useState(false)
  const { filteredProducts, filter, setFilter } = usePantrySearchFilter(pantry)
  useNotification(notification)
  const hasOneItem = fields.length === 1
  const isSubmitting = fetcher.state === 'submitting'
  const isDone = fetcher.type === 'done'

  useEffect(() => {
    if (isDone) {
      reset()
    }
  }, [isDone, reset])

  const onAddProduct = () => {
    prepend({
      name: '',
      price: undefined,
      number: 1,
    })
  }

  const onRemoveProduct = (index: number) => {
    if (!hasOneItem) {
      remove(index)
    } else {
      update(0, {
        name: '',
        // @ts-ignore
        price: undefined,
        number: 1,
      })
      reset()
    }
  }

  const onSubmit = ({ products }: FormValues) => {
    const total = products.reduce(
      (sum, current) => sum + (current.price * current.number || 0),
      0,
    )

    fetcher.submit(
      {
        products: JSON.stringify(products),
        total: total.toString(),
      },
      {
        method: 'post',
        action: '/calculator',
      },
    )
  }

  return (
    <RouteContainer
      handleId="calculator"
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
        <Paper
          withBorder
          radius="md"
          px="md"
          sx={theme => ({
            height: '4rem',
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            [theme.fn.smallerThan('sm')]: {
              height: '2.8rem',
            },
          })}
        >
          <Group
            position="apart"
            sx={theme => ({
              width: '100%',
              color: theme.colors.violet[6],
            })}
          >
            <Receipt2 size={30} />
            <Total control={control} />
          </Group>
        </Paper>
        <fetcher.Form
          method="post"
          noValidate
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack spacing={0}>
            <Group position="apart" pt="md" pb="lg">
              <Button
                onClick={() => setShowPantryModal(true)}
                variant="subtle"
                size="xs"
                radius="md"
              >
                See pantry
              </Button>
              <Button
                onClick={onAddProduct}
                variant="subtle"
                size="xs"
                radius="md"
              >
                Add product
              </Button>
              <Button
                type="submit"
                size="xs"
                radius="md"
                loading={isSubmitting}
                sx={{
                  minWidth: '6.25rem',
                }}
              >
                Save list
              </Button>
            </Group>
            <Box
              sx={theme => ({
                display: 'grid',
                flexWrap: 'wrap',
                gap: theme.spacing.md,
                gridTemplateColumns: '1fr',
                [`@media (min-width: ${theme.breakpoints.sm}px)`]: {
                  gridTemplateColumns: '1fr 1fr',
                },
              })}
            >
              {fields.map((field, index) => {
                return (
                  <Box key={field.id}>
                    <Paper radius="md" withBorder p="sm">
                      <Stack spacing="sm">
                        <TextInput
                          aria-label="Product name"
                          id="name"
                          placeholder="Enter product name"
                          radius="md"
                          size="xs"
                          enterKeyHint="done"
                          inputMode="text"
                          variant="default"
                          error={errors?.products?.[index]?.name?.message}
                          {...register(`products.${index}.name`)}
                        />
                        <Group position="apart" spacing={0}>
                          <NumberInput
                            aria-label="Product price"
                            id="price"
                            hideControls
                            control={control}
                            enterKeyHint="done"
                            inputMode="decimal"
                            noClampOnBlur
                            parser={inputValue =>
                              inputValue?.replace(/\$\s?|(,*)/g, '')
                            }
                            formatter={inputValue =>
                              !Number.isNaN(parseFloat(inputValue!))
                                ? `$ ${inputValue}`.replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ',',
                                  )
                                : '$'
                            }
                            variant="default"
                            precision={2}
                            label={undefined}
                            placeholder="Enter price"
                            size="xs"
                            name={`products.${index}.price`}
                            error={errors?.products?.[index]?.price?.message}
                            sx={{
                              width: '48%',
                            }}
                          />
                          <NumberInput
                            aria-label="Product number"
                            id="number"
                            control={control}
                            enterKeyHint="done"
                            inputMode="numeric"
                            label={undefined}
                            placeholder="Enter number"
                            variant="default"
                            size="xs"
                            name={`products.${index}.number`}
                            error={errors?.products?.[index]?.number?.message}
                            sx={{
                              width: '48%',
                            }}
                          />
                        </Group>
                        <Group position="center">
                          <Button
                            size="xs"
                            radius="md"
                            variant="subtle"
                            color="gray"
                            onClick={() => onRemoveProduct(index)}
                          >
                            Remove
                          </Button>
                        </Group>
                      </Stack>
                    </Paper>
                  </Box>
                )
              })}
            </Box>
          </Stack>
        </fetcher.Form>
      </Box>
      <PantryModal
        opened={showPantryModal}
        onClose={() => setShowPantryModal(false)}
      >
        <TextInput
          mb="lg"
          radius="md"
          size="md"
          variant="default"
          placeholder="Search your products"
          icon={<Search size={20} />}
          value={filter}
          onChange={event => setFilter(event.currentTarget.value)}
        />
        <PantryContent
          isEmpty={pantry.length === 0}
          products={filteredProducts}
          hideDelete
        />
      </PantryModal>
    </RouteContainer>
  )
}

export default CalculatorRoute
