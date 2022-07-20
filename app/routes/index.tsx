import type { FC } from 'react'

import { Container, Title, Text } from '@mantine/core'

import { Link } from '@remix-run/react'

import ThemeToggle from '~/components/theme-toggle'

const IndexRoute: FC = () => {
  return (
    <Container
      fluid
      px={0}
      sx={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        alignItems: 'center',
        justifyItems: 'center',
        height: '100%',
      }}
    >
      <Text
        variant="gradient"
        gradient={{
          from: 'grape',
          to: 'violet',
        }}
      >
        <Title order={2} sx={{ fontSize: '4rem' }}>
          Coming soon!
        </Title>

        <Text component={Link} to="/sign-in" color="violet" variant="link">
          Login
        </Text>
        <ThemeToggle />
      </Text>
    </Container>
  )
}

export default IndexRoute
