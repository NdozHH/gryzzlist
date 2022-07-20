import { Button } from '@mantine/core'

import { Link, useLocation } from '@remix-run/react'

import ErrorContainer from '~/components/error-container'

const NotFoundRoute = () => {
  const location = useLocation()

  return (
    <ErrorContainer
      status={404}
      description={`Sorry, ${location.pathname} is not a valid route`}
      action={
        <Button
          radius="md"
          size="md"
          variant="gradient"
          gradient={{ from: 'violet', to: 'grape', deg: 105 }}
          component={Link}
          to="/pantry"
        >
          Back to home
        </Button>
      }
    />
  )
}

export default NotFoundRoute
