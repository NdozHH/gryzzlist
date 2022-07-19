import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Box, Container, Stack, Text, useMantineTheme } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { Outlet, useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'
import ListCard from '~/components/list-card'

import useNotification from '~/hooks/useNotification'

import {
  deleteList,
  generateRandomString,
  getLists,
} from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification, List } from '~/types/common'

interface LoaderData {
  name: string
  notification?: AlertNotification
  lists: List[]
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await handleSession(request)
    const userId = session.getUserId()
    const notification = session.instance.get('notification') || null

    invariant(userId, 'userId is not valid')

    const lists = await getLists(userId)

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
        name: 'Previous lists',
        lists,
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

const ListsRoute: FC = () => {
  const theme = useMantineTheme()
  const loaderData = useLoaderData<LoaderData>()
  const { notification, lists } = loaderData
  const isEmpty = lists.length === 0
  useNotification(notification)

  return (
    <Container
      fluid
      px={0}
      sx={{
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        [`@media (max-width: ${theme.breakpoints.md}px)`]: {
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'center',
          paddingTop: `${theme.spacing.md}px`,
        },
      }}
    >
      <Stack
        spacing="md"
        justify={isEmpty ? 'center' : 'flex-start'}
        align={isEmpty ? 'center' : 'stretch'}
        sx={theme => ({
          width: '100%',
          maxWidth: '34.375rem',
          paddingBottom: `${theme.spacing.md}px`,
          paddingRight: `${theme.spacing.sm}px`,
          overflow: 'hidden',
          height: '100%',
          overflowY: 'auto',
          borderRight: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[6]
              : theme.colors.gray[2]
          }`,
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            borderRight: 'none',
            borderBottom: `1px solid ${
              theme.colorScheme === 'dark'
                ? theme.colors.dark[6]
                : theme.colors.gray[2]
            }`,
            paddingRight: 0,
          },
        })}
      >
        {!isEmpty ? (
          <>
            {lists.map((list, index) => {
              return <ListCard key={list.id} index={index + 1} {...list} />
            })}
          </>
        ) : (
          <Text>You don't have any saved lists</Text>
        )}
      </Stack>
      <Box
        sx={theme => ({
          width: '100%',
          maxWidth: '34.375rem',
          paddingBottom: `${theme.spacing.md}px`,
          paddingLeft: `${theme.spacing.sm}px`,
          overflow: 'hidden',
          height: '100%',
          [`@media (max-width: ${theme.breakpoints.md}px)`]: {
            paddingLeft: 0,
            paddingTop: `${theme.spacing.sm}px`,
          },
        })}
      >
        <Outlet />
      </Box>
    </Container>
  )
}

export default ListsRoute
