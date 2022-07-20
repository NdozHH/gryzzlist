import type { FC, ReactNode } from 'react'

import { Box, Button, Container, Group, Text, Title } from '@mantine/core'

interface ErrorContainerProps {
  status?: number
  title?: string
  description?: string
  action?: ReactNode
}

const ErrorContainer: FC<ErrorContainerProps> = ({
  status = undefined,
  title = 'Something bad just happened...',
  description = 'We know you had an unexpected problem, please refresh the page.',
  action = undefined,
}) => {
  const onRefresh = () => {
    if (!(typeof document === 'undefined')) {
      location.reload()
    }
  }

  return (
    <Container
      fluid
      px={0}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {status ? (
        <Box
          sx={theme => ({
            textAlign: 'center',
            fontWeight: 900,
            fontSize: 220,
            lineHeight: 1,
            marginBottom: theme.spacing.xl * 1.5,
            color:
              theme.primaryColor === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[5],
            [theme.fn.smallerThan('sm')]: {
              fontSize: 120,
            },
          })}
        >
          {status}
        </Box>
      ) : null}
      <Title
        sx={theme => ({
          textAlign: 'center',
          fontWeight: 900,
          fontSize: 38,
          color: theme.colors.gray[7],
          [theme.fn.smallerThan('sm')]: {
            fontSize: 32,
          },
        })}
      >
        {title}
      </Title>
      <Text
        size="lg"
        align="center"
        sx={theme => ({
          maxWidth: 540,
          margin: 'auto',
          marginTop: theme.spacing.xl,
          marginBottom: theme.spacing.xl * 1.5,
          color: theme.colors.gray[7],
        })}
      >
        {description}
      </Text>
      <Group position="center">
        {action || (
          <Button
            radius="md"
            size="md"
            variant="gradient"
            gradient={{ from: 'violet', to: 'grape', deg: 105 }}
            onClick={onRefresh}
          >
            Refresh the page
          </Button>
        )}
      </Group>
    </Container>
  )
}

export default ErrorContainer
