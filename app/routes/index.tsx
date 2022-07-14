import type { FC } from 'react'

import { Container, createStyles, Title, Text } from '@mantine/core'

import ThemeToggle from '~/components/theme-toggle'

const useStyles = createStyles(() => ({
  container: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    alignItems: 'center',
    justifyItems: 'center',
    height: '100%',
  },
}))

const BaseRoute: FC = () => {
  const { classes } = useStyles()

  return (
    <Container className={classes.container} fluid px={0}>
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
        <ThemeToggle />
      </Text>
    </Container>
  )
}

export default BaseRoute
