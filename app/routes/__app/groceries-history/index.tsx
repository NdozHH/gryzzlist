import type { FC } from 'react'
import invariant from 'tiny-invariant'

import { Stack, Text } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'
import ListCard from '~/components/list-card'
import RouteContainer from '~/components/route-container'

import useImageMediaQuery from '~/hooks/useImageMediaQuery'
import useNotification from '~/hooks/useNotification'

import {
  deleteList,
  generateRandomString,
  getLists,
} from '~/utils/database.server'
import { handleSession } from '~/utils/session.server'

import emptyList from '~/images/empty_list.svg'
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

    return redirect('/groceries-history', {
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

const HistoryIndexRoute: FC = () => {
  const smallImageQuery = useImageMediaQuery('sm')
  const loaderData = useLoaderData<LoaderData>()
  const { notification, lists } = loaderData
  const isEmpty = lists.length === 0
  useNotification(notification)

  return (
    <RouteContainer
      handleId="groceries-history"
      sx={{
        justifyContent: 'center',
      }}
    >
      <Stack
        spacing="md"
        justify="center"
        align="stretch"
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
          <Stack align="center" mt="xl" spacing="sm">
            <img
              srcSet={`${emptyList} 890w`}
              sizes={`${smallImageQuery} 230px, 330px`}
              src={emptyList}
              alt="A woman standing next to a cell phone with list items"
            />
            <Text mt="md" size="xl" align="center">
              You don't have any saved lists
            </Text>
          </Stack>
        )}
      </Stack>
    </RouteContainer>
  )
}

export default HistoryIndexRoute
