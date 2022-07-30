import { Link, useLocation } from '@remix-run/react'

import Button from '~/components/button'
import ErrorContainer from '~/components/error-container'

const NotFoundRoute = () => {
  const location = useLocation()

  return (
    <ErrorContainer
      status={404}
      description={`Sorry, ${location.pathname} is not a valid route`}
      action={
        <Button radius="md" size="md" component={Link} to="/pantry">
          Back to home
        </Button>
      }
    />
  )
}

export default NotFoundRoute
