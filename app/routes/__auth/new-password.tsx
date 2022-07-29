import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import invariant from 'tiny-invariant'
import type { z } from 'zod'

import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  PasswordInput,
} from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type {
  LoaderFunction,
  MetaFunction,
  ActionFunction,
} from '@remix-run/node'
import {
  Form,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from '@remix-run/react'

import Alert from '~/components/alert'

import { createNewPassword, decodeBase64 } from '~/utils/auth.server'
import { generateRandomString } from '~/utils/database.server'
import { newPasswordSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification } from '~/types/common'

enum ActionMode {
  ResetPassword = 'resetPassword',
}

type FormValues = z.infer<typeof newPasswordSchema>

interface LoaderData {
  mode: ActionMode | null
  email: string | null
  oobCode: string | null
  continueUrl?: string | null
  error?: AlertNotification
}

interface ActionData {
  error?: AlertNotification
}

export const meta: MetaFunction = () => {
  return {
    title: 'New password | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const session = await handleSession(request)
    const url = new URL(request.url)

    // If the search params exist, this page is being loaded from the email link
    if (url.search) {
      const newPasswordData: Partial<LoaderData> = {}
      const mode = url.searchParams.get('mode') as ActionMode
      const oobCode = url.searchParams.get('oobCode')
      const continueUrl = new URL(url.searchParams.get('continueUrl')!)
      const email = continueUrl.searchParams.get('email')
      newPasswordData.mode = mode
      newPasswordData.oobCode = oobCode
      newPasswordData.email = email
      newPasswordData.continueUrl = continueUrl.pathname // Remix's redirect only needs the pathname
      session.instance.set('newPasswordData', newPasswordData)

      return redirect('/new-password', {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      })
    }

    const { mode, oobCode, email, continueUrl } =
      (session.instance.get('newPasswordData') as LoaderData) || {}

    if (mode === ActionMode.ResetPassword) {
      return json<LoaderData>(
        {
          mode,
          oobCode,
          email,
          continueUrl,
        },
        {
          headers: {
            'Set-Cookie': await session.commit(),
          },
        },
      )
    }

    session.instance.flash(
      'notification',
      `The link used is no longer valid, please request a new one.`,
    )

    return redirect('/sign-in', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    })
  } catch (error) {
    return json<ActionData>(
      {
        error: {
          id: generateRandomString(),
          message: `We're having trouble creating your password. Please try again later.`,
        },
      },
      {
        status: 500,
      },
    )
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const password = formData.get('password')
    const email = formData.get('email')
    const oobCode = formData.get('oobCode')
    const continueUrl = formData.get('continueUrl')
    const session = await handleSession(request)

    invariant(email, 'email is required')
    invariant(password, 'password is required')
    invariant(oobCode, 'oobCode is required')
    invariant(continueUrl, 'continueUrl is required')

    const decodedPassword = decodeBase64(String(password))
    const decodedOobCode = decodeBase64(String(oobCode))

    const newPasswordData = session.instance.get(
      'newPasswordData',
    ) as LoaderData

    const isPasswordReset = await createNewPassword(
      String(email),
      decodedPassword,
      decodedOobCode,
    )

    if (isPasswordReset) {
      // Remove the newPasswordData from the session
      if (newPasswordData) {
        session.instance.unset('newPasswordData')
      }

      return redirect(String(continueUrl), {
        headers: {
          'Set-Cookie': await session.commit(),
        },
      })
    }

    return json<ActionData>(
      {
        error: {
          id: generateRandomString(),
          message: `We're having trouble creating your password. Please try again later.`,
        },
      },
      {
        status: 500,
        headers: {
          'Set-Cookie': await session.commit(),
        },
      },
    )
  } catch (error) {
    return json<ActionData>(
      {
        error: {
          id: generateRandomString(),
          message: `We're having trouble creating your password. Please try again later.`,
        },
      },
      {
        status: 500,
      },
    )
  }
}

const NewPasswordRoute = () => {
  const transition = useTransition()
  const loaderData = useLoaderData<LoaderData>()
  const actionData = useActionData<ActionData>()
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(newPasswordSchema),
  })
  const { errors } = formState
  const submit = useSubmit()
  const isSubmitting = transition.state === 'submitting'

  const onSubmit = ({ password }: FormValues) => {
    submit(
      {
        password: window.btoa(password),
        oobCode: window.btoa(loaderData.oobCode!),
        email: loaderData.email || '',
        continueUrl: loaderData.continueUrl || '',
      },
      {
        method: 'post',
      },
    )
  }

  return (
    <Container
      fluid
      sx={theme => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
          padding: `${theme.spacing.md}px`,
        },
      })}
    >
      <Stack
        align="center"
        sx={{
          maxWidth: 500,
          width: '100%',
        }}
      >
        <Alert content={loaderData?.error || actionData?.error} />
        <Paper
          radius="lg"
          p="md"
          withBorder
          sx={{
            width: '100%',
          }}
        >
          <Form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack>
              <Text align="center" size="xl">
                Create your new password
              </Text>
              <PasswordInput
                id="password"
                placeholder="Enter new password"
                autoComplete="new-password"
                label="New password"
                radius="md"
                variant="default"
                size="sm"
                required
                error={errors?.password?.message}
                {...register('password')}
              />
              <Group position="center" mt="lg">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  radius="md"
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: 105 }}
                >
                  Create password
                </Button>
              </Group>
            </Stack>
          </Form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default NewPasswordRoute
