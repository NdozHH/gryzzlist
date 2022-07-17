import type { FC } from 'react'

import { Box, Container } from '@mantine/core'

import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { useCatch, useLoaderData } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'

import useNotification from '~/hooks/useNotification'

import { handleSession } from '~/utils/session.server'

import type { AlertNotification } from '~/types/common'

interface LoaderData {
  name: string
  notification?: AlertNotification
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await handleSession(request)
    const notification = session.instance.get('notification') || null

    return json<LoaderData>(
      {
        ...(notification
          ? {
              notification: {
                message: notification,
              },
            }
          : {}),
        name: 'Previous lists',
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

export const CatchBoundary = () => {
  const { status } = useCatch()

  return <ErrorContainer status={status} />
}

const ListsRoute: FC = () => {
  const loaderData = useLoaderData<LoaderData>()
  const { notification } = loaderData
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
          maxWidth: '34.375rem',
          paddingBottom: `${theme.spacing.xl}px`,
          position: 'relative',
          overflow: 'hidden',
          height: '100%',
        })}
      >
        Hello lists
      </Box>
    </Container>
  )
}

export default ListsRoute
