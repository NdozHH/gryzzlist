import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import invariant from 'tiny-invariant'
import type { z } from 'zod'

import {
  Button,
  Container,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useSubmit,
  useTransition,
} from '@remix-run/react'

import Alert from '~/components/alert'

import useNotification from '~/hooks/useNotification'

import { decodeBase64, signIn, verifySessionCookie } from '~/utils/auth.server'
import { generateRandomString } from '~/utils/database.server'
import { signInSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification } from '~/types/common'

type FormValues = z.infer<typeof signInSchema>

interface LoaderData {
  notification?: AlertNotification
}

interface ActionData {
  error?: AlertNotification
}

export const meta: MetaFunction = () => {
  return {
    title: 'Sign in | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await handleSession(request)
  const notification = session.instance.get('notification') || null
  const { uid } = await verifySessionCookie(session.instance)

  if (uid) {
    return redirect('/pantry', {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    })
  }

  return json<LoaderData>(
    {
      ...(notification
        ? {
            notification: {
              id: generateRandomString(),
              message: notification,
              config: {
                autoClose: false,
              },
            },
          }
        : {}),
    },
    {
      headers: {
        'Set-Cookie': await session.commit(),
      },
    },
  )
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const session = await handleSession(request)

    invariant(email, 'email is required')
    invariant(password, 'password is required')

    const decodedPassword = decodeBase64(String(password))
    const signInResult = await signIn(
      request,
      email.toString().toLowerCase(),
      decodedPassword,
    )

    if (!signInResult.session || !signInResult.isSignedIn) {
      return json<ActionData>(
        {
          error: {
            id: generateRandomString(),
            message:
              'It looks like your email or password is incorrect. Please check them and try again.',
          },
        },
        { status: 401 },
      )
    }

    return redirect('/pantry', {
      headers: {
        'Set-Cookie': await session.commit(signInResult.session),
      },
    })
  } catch (error) {
    return json<ActionData>(
      {
        error: {
          id: generateRandomString(),
          message: `We're having trouble logging you in. Please try again later.`,
        },
      },
      {
        status: 500,
      },
    )
  }
}

const SignInRoute: FC = () => {
  const transition = useTransition()
  const loaderData = useLoaderData<LoaderData>()
  const { notification } = loaderData
  const actionData = useActionData<ActionData>()
  const { error } = actionData || {}
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  })
  const { errors } = formState
  const submit = useSubmit()
  useNotification(notification)
  const isSubmitting = transition.state === 'submitting'

  const onSubmit = ({ email, password }: FormValues) => {
    submit(
      { email, password: window.btoa(password) },
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
        <Alert content={error} />
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
                Sign in to your account
              </Text>
              <TextInput
                id="email"
                placeholder="Enter your email"
                autoComplete="email"
                label="Email"
                radius="md"
                variant="default"
                size="sm"
                required
                type="email"
                error={errors?.email?.message}
                {...register('email')}
              />
              <Stack spacing="xs">
                <PasswordInput
                  id="password"
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  label="Password"
                  radius="md"
                  variant="default"
                  size="sm"
                  required
                  error={errors?.password?.message}
                  {...register('password')}
                />
                <Group position="right">
                  <Text
                    variant="link"
                    component={Link}
                    to="/reset-password"
                    color="violet"
                    size="sm"
                  >
                    Forgot password?
                  </Text>
                </Group>
              </Stack>
              <Group position="center" mt="lg">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  radius="md"
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: 105 }}
                >
                  Sign In
                </Button>
              </Group>
            </Stack>
          </Form>
        </Paper>
        <Text
          align="center"
          sx={theme => ({
            marginTop: `${theme.spacing.xl}px`,
          })}
        >
          Don't have an account?{' '}
          <Text component={Link} to="/sign-up" color="violet" variant="link">
            ¡Create one!
          </Text>
        </Text>
      </Stack>
    </Container>
  )
}

export default SignInRoute
