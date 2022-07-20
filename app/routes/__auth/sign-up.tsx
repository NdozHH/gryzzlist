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

import { redirect, json } from '@remix-run/node'
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useSubmit,
  useTransition,
} from '@remix-run/react'

import Alert from '~/components/alert'

import { decodeBase64, signUp, verifySessionCookie } from '~/utils/auth.server'
import { generateRandomString } from '~/utils/database.server'
import { signUpSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification } from '~/types/common'

type FormValues = z.infer<typeof signUpSchema>

interface ActionData {
  error?: AlertNotification
}

export const meta: MetaFunction = () => {
  return {
    title: 'Sign up | GryzzList',
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await handleSession(request)
  const { uid } = await verifySessionCookie(session.instance)
  const headers = {
    'Set-Cookie': await session.commit(),
  }

  if (uid) {
    return redirect('/pantry', { headers })
  }

  return json(null, { headers })
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const session = await handleSession(request)

    invariant(name, 'name is required')
    invariant(email, 'email is required')
    invariant(password, 'password is required')

    const decodedPassword = decodeBase64(String(password))
    const signUpResult = await signUp(
      request,
      email.toString().toLowerCase(),
      decodedPassword,
      String(name),
    )

    if (!signUpResult.session || !signUpResult.isSignedIn) {
      return json<ActionData>(
        {
          error: {
            id: generateRandomString(),
            message: `We're having trouble creating your account. Please try again later.`,
          },
        },
        { status: 401 },
      )
    }

    return redirect('/pantry', {
      headers: {
        'Set-Cookie': await session.commit(signUpResult.session),
      },
    })
  } catch (error) {
    return json<ActionData>(
      {
        error: {
          id: generateRandomString(),
          message: `We're having trouble creating your account. Please try again later.`,
        },
      },
      {
        status: 500,
      },
    )
  }
}

const SignUpRoute: FC = () => {
  const actionData = useActionData<ActionData>()
  const { error } = actionData || {}
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpSchema),
  })
  const { errors } = formState
  const submit = useSubmit()
  const transition = useTransition()
  const isSubmitting = transition.state === 'submitting'

  const onSubmit = ({ email, password, name }: FormValues) => {
    submit(
      { email, password: window.btoa(password), name },
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
          radius="md"
          p="md"
          withBorder
          sx={{
            width: '100%',
          }}
        >
          <Form method="post" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack>
              <Text align="center" size="xl">
                Create your account
              </Text>
              <TextInput
                id="name"
                placeholder="Enter your name"
                autoComplete="name"
                label="Name"
                radius="md"
                size="sm"
                variant="default"
                required
                error={errors?.name?.message}
                {...register('name')}
              />
              <TextInput
                id="email"
                placeholder="Enter your email"
                autoComplete="email"
                label="Email"
                radius="md"
                size="sm"
                variant="default"
                required
                type="email"
                error={errors?.email?.message}
                {...register('email')}
              />
              <PasswordInput
                id="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                label="Password"
                radius="md"
                description="Password must be at least 10 characters long"
                variant="default"
                size="sm"
                required
                error={errors?.password?.message}
                {...register('password')}
              />
              <Group position="center">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  radius="md"
                  size="md"
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'grape', deg: 105 }}
                >
                  Create account
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
          Already have an account?{' '}
          <Text component={Link} to="/sign-in" color="violet" variant="link">
            Sign in
          </Text>
        </Text>
      </Stack>
    </Container>
  )
}

export default SignUpRoute
