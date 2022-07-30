import { zodResolver } from '@hookform/resolvers/zod'
import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import invariant from 'tiny-invariant'
import type { z } from 'zod'

import { Container, Paper, Stack, Text, TextInput } from '@mantine/core'

import { json, redirect } from '@remix-run/node'
import type { ActionFunction, MetaFunction } from '@remix-run/node'
import {
  Form,
  Link,
  useActionData,
  useSubmit,
  useTransition,
} from '@remix-run/react'

import Alert from '~/components/alert'
import Button from '~/components/button'

import { resetPassword } from '~/utils/auth.server'
import { generateRandomString } from '~/utils/database.server'
import { resetPasswordSchema } from '~/utils/form-schemas'
import { handleSession } from '~/utils/session.server'

import type { AlertNotification } from '~/types/common'

type FormValues = z.infer<typeof resetPasswordSchema>

interface ActionData {
  error?: AlertNotification
}

export const meta: MetaFunction = () => {
  return {
    title: 'Reset password | GryzzList',
  }
}

export const action: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData()
    const email = formData.get('email')
    const session = await handleSession(request)

    invariant(email, 'email is required')

    await resetPassword(String(email))

    session.instance.flash(
      'notification',
      `If this email is associated to a user, we will send an email to create a new password.`,
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
          message: `We're having trouble resetting your password. Please try again later.`,
        },
      },
      {
        status: 500,
      },
    )
  }
}

const ResetPasswordRoute: FC = () => {
  const transition = useTransition()
  const actionData = useActionData<ActionData>()
  const { error } = actionData || {}
  const { register, handleSubmit, formState } = useForm<FormValues>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(resetPasswordSchema),
  })
  const { errors } = formState
  const submit = useSubmit()
  const isSubmitting = transition.state === 'submitting'

  const onSubmit = ({ email }: FormValues) => {
    submit(
      { email },
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
                Reset your password
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
              <Stack align="center" mt="lg">
                <Button
                  type="submit"
                  loading={isSubmitting}
                  radius="md"
                  size="md"
                >
                  Reset password
                </Button>
                <Button
                  component={Link}
                  to="/sign-in"
                  radius="md"
                  size="md"
                  variant="subtle"
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Paper>
      </Stack>
    </Container>
  )
}

export default ResetPasswordRoute
