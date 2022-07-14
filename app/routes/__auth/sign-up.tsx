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

import { redirect, json } from '@remix-run/node'
import type { LoaderFunction, ActionFunction } from '@remix-run/node'
import { Form, useSubmit, useTransition } from '@remix-run/react'

import { decodeBase64, signUp, verifySessionCookie } from '~/utils/auth.server'
import { signUpSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

type FormValues = z.infer<typeof signUpSchema>

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
  const { email, password, name } = Object.fromEntries(
    await request.formData(),
  ) as FormValues
  const decodedPassword = decodeBase64(password)
  const result = signUpSchema.safeParse({
    email,
    password: decodedPassword,
    name,
  })

  if (result.success) {
    try {
      const session = await handleSession(request)
      const signUpResult = await signUp(
        request,
        email.toLowerCase(),
        decodedPassword,
        name,
      )

      if (!signUpResult.session || !signUpResult.isSignedIn) {
        return json(
          {
            error: {
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
      // eslint-disable-next-line no-console
      console.log('🚨🚨🚨 Unknown error', error)
      return json(
        {
          message: `We're having trouble creating your account. Please try again later.`,
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

const SignUpRoute: FC = () => {
  const { classes } = useStyles()
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

  const onSubmit = ({ email, password, name }: FormValues) => {
    submit(
      { email, password: window.btoa(password), name },
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
              Create your account
            </Text>
            <TextInput
              id="name"
              placeholder="Enter your name"
              autoComplete="name"
              label="Name"
              radius="md"
              size="sm"
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
                loading={transition.state === 'submitting'}
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
    </Container>
  )
}

export default SignUpRoute
