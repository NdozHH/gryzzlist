import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Stack, Text } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from '@remix-run/node'
import { Outlet, useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'
import ListCard from '~/components/list-card'
import RouteContainer from '~/components/route-container'

import useNotification from '~/hooks/useNotification'
import useRouteData from '~/hooks/useRouteData'

import {
  deleteList,
  generateRandomString,
  getLists,
} from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification, Handle, List } from '~/types/common'

interface LoaderData {
  name: string
  notification?: AlertNotification
  lists: List[]
}

export const handle: Handle = {
  id: 'groceries-history',
}

export const meta: MetaFunction = () => {
  return {
    title: 'Lists | GryzzList',
  }
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
        name: 'Groceries history',
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
  const listDetailRoute = useRouteData('list-detail')
  const loaderData = useLoaderData<LoaderData>()
  const { notification, lists } = loaderData
  const isEmpty = lists.length === 0
  useNotification(notification)

  if (listDetailRoute) return <Outlet />

  return (
    <RouteContainer
      handleId="groceries-history"
      sx={{
        justifyContent: 'center',
        flexDirection: 'column',
      }}
    >
      <Stack
        spacing="md"
        justify={isEmpty ? 'center' : 'flex-start'}
        align={isEmpty ? 'center' : 'stretch'}
        pb="xl"
        sx={{
          width: '100%',
          maxWidth: '34.375rem',
          height: '100%',
        }}
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
    </RouteContainer>
  )
}

export default ListsRoute
