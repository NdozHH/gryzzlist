import type { FC, ReactNode } from 'react'

import { Container, Text } from '@mantine/core'
import type { Sx } from '@mantine/core'

import useRouteData from '~/hooks/useRouteData'

interface RouteContainerProps {
  sx?: Sx
  header?: ReactNode
  handleId?: string
}

interface LoaderData {
  name: string
}

const RouteContainer: FC<RouteContainerProps> = ({
  children,
  sx,
  header,
  handleId,
}) => {
  const currentRoute = useRouteData<LoaderData>(handleId)

  return (
    <Container
      fluid
      px={0}
      sx={theme => ({
        display: 'flex',
        flexDirection: 'column',
        [theme.fn.smallerThan('sm')]: {
          paddingTop: `${theme.spacing.md}px`,
        },
      })}
    >
      {!header ? (
        <Text
          sx={theme => ({
            fontSize: '2rem',
            fontWeight: 'bold',
            lineHeight: 1,
            [theme.fn.smallerThan('sm')]: {
              fontSize: '1.5rem',
            },
          })}
        >
          {currentRoute?.name}
        </Text>
      ) : (
        header
      )}
      <Container
        fluid
        px={0}
        sx={[
          {
            height: '100%',
            display: 'flex',
            paddingTop: '1rem',
          },
          sx,
        ]}
      >
        {children}
      </Container>
    </Container>
  )
}

export default RouteContainer
