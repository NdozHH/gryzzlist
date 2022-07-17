import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import type { z } from 'zod'

import {
  Button,
  Container,
  createStyles,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
} from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { Form, useSubmit, useTransition } from '@remix-run/react'

import { decodeBase64, signIn, verifySessionCookie } from '~/utils/auth.server'
import { signInSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

type FormValues = z.infer<typeof signInSchema>

const useStyles = createStyles(theme => ({
  container: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    [`@media (max-width: ${theme.breakpoints.sm}px)`]: {
      padding: `${theme.spacing.md}px`,
    },
  },
  paper: {
    width: '100%',
    maxWidth: 500,
    border: '1px solid',
    borderColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
  },
}))

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
  const { email, password } = Object.fromEntries(
    await request.formData(),
  ) as FormValues
  const decodedPassword = decodeBase64(password)
  const result = signInSchema.safeParse({
    email,
    password: decodedPassword,
  })

  if (result.success) {
    try {
      const session = await handleSession(request)
      const signInResult = await signIn(
        request,
        email.toLowerCase(),
        decodedPassword,
      )

      if (!signInResult.session || !signInResult.isSignedIn) {
        return json(
          {
            error: {
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
      // eslint-disable-next-line no-console
      console.log('❌❌❌', error)
      return json(
        {
          message: `We're having trouble logging you in. Please try again later.`,
          error,
        },
        {
          status: 500,
        },
      )
    }
  } else {
    return json({ error: 'Invalid credentials' }, { status: 400 })
  }
}

const LoginRoute: FC = () => {
  const { classes } = useStyles()
  const transition = useTransition()
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInSchema),
  })
  const { errors } = formState
  const submit = useSubmit()
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
    <Container className={classes.container} fluid>
      <Paper className={classes.paper} radius="md" p="md">
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
              size="sm"
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
                Sign In
              </Button>
            </Group>
          </Stack>
        </Form>
      </Paper>
    </Container>
  )
}

export default LoginRoute
