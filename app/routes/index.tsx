import type { FC } from 'react'
import {
  BrandGithub,
  BrandTwitter,
  Calculator,
  CheckupList,
  Cheese,
  ExternalLink,
} from 'tabler-icons-react'

import {
  Container,
  Text,
  Header,
  Group,
  Burger,
  Transition,
  Paper,
  Box,
  ActionIcon,
  Stack,
  List,
  Title,
  ThemeIcon,
  Image,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'

import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'
import { Link, useLoaderData } from '@remix-run/react'

import Button from '~/components/button'
import AppLogo from '~/components/logo'
import ThemeToggle from '~/components/theme-toggle'

import { verifySessionCookie } from '~/utils/auth.server'
import { handleSession } from '~/utils/session.server'

import landingImage from '~/images/landing.svg'

interface LoaderData {
  isAuthenticated: boolean
}

const HEADER_HEIGHT = '5rem'
const FOOTER_HEIGHT = '5.5rem'
const SECTION_HEIGHT = `calc(100vh - ${HEADER_HEIGHT} - ${FOOTER_HEIGHT})`
const links = [
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/NdozHH/gryzzlist',
    icon: <ExternalLink size={18} />,
    external: true,
  },
]

export const loader: LoaderFunction = async ({ request }) => {
  const session = await handleSession(request)
  const { uid } = await verifySessionCookie(session.instance)

  if (uid) {
    return json<LoaderData>({
      isAuthenticated: true,
    })
  }

  return json<LoaderData>({
    isAuthenticated: false,
  })
}

const IndexRoute: FC = () => {
  const { isAuthenticated } = useLoaderData<LoaderData>()
  const [opened, { toggle }] = useDisclosure(false)

  const items = links.map(item => (
    <Button
      key={item.id}
      component="a"
      target={item.external ? '_blank' : '_self'}
      href={item.href}
      radius="md"
      variant="default"
      rightIcon={item?.icon}
    >
      {item.label}
    </Button>
  ))

  return (
    <>
      <Header
        height={HEADER_HEIGHT}
        sx={{
          position: 'relative',
          zIndex: 1,
          minHeight: HEADER_HEIGHT,
        }}
      >
        <Container
          fluid
          sx={theme => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            height: '100%',
            width: '100%',
            padding: '0 10rem',
            [theme.fn.smallerThan('md')]: {
              padding: '0 5rem',
            },
            [theme.fn.smallerThan('sm')]: {
              padding: '0 1rem',
            },
          })}
        >
          <a href="/" aria-label="GryzzList">
            <AppLogo
              sx={theme => ({
                width: '10.6rem',
                [theme.fn.smallerThan('sm')]: {
                  width: '8rem',
                },
              })}
            />
          </a>
          <Group
            spacing="sm"
            sx={theme => ({
              [theme.fn.smallerThan('sm')]: {
                display: 'none',
              },
            })}
          >
            <Button radius="md" component={Link} to="/sign-in">
              {isAuthenticated ? 'Go to pantry' : 'Sign in'}
            </Button>
            {items}
            <ThemeToggle />
          </Group>
          <Burger
            opened={opened}
            onClick={toggle}
            size="sm"
            sx={theme => ({
              [theme.fn.largerThan('sm')]: {
                display: 'none',
              },
            })}
          />
          <Transition
            transition="pop-top-right"
            duration={200}
            mounted={opened}
          >
            {styles => (
              <Paper
                py="lg"
                withBorder
                style={styles}
                sx={theme => ({
                  position: 'absolute',
                  top: HEADER_HEIGHT,
                  left: 0,
                  right: 0,
                  zIndex: 0,
                  borderTopRightRadius: 0,
                  borderTopLeftRadius: 0,
                  borderTopWidth: 0,
                  overflow: 'hidden',
                  [theme.fn.largerThan('sm')]: {
                    display: 'none',
                  },
                })}
              >
                <Stack align="center">
                  <Button radius="md" component={Link} to="/sign-in">
                    {isAuthenticated ? 'Go to pantry' : 'Sign in'}
                  </Button>
                  {items}
                  <ThemeToggle />
                </Stack>
              </Paper>
            )}
          </Transition>
        </Container>
      </Header>
      <Box
        component="section"
        sx={theme => ({
          display: 'flex',
          width: '100%',
          flex: 1,
          minHeight: SECTION_HEIGHT,
          padding: `${theme.spacing.xl}px`,
          [theme.fn.smallerThan('xs')]: {
            padding: `${theme.spacing.lg}px ${theme.spacing.md}px`,
          },
        })}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            columnGap: `8rem`,
            minHeight: '100%',
          }}
        >
          <Box
            sx={theme => ({
              width: '100%',
              maxWidth: '36.25rem',
              height: 'auto',
              [theme.fn.smallerThan('md')]: {
                maxWidth: '100%',
              },
            })}
          >
            <Title
              sx={theme => ({
                color: theme.colorScheme === 'dark' ? theme.white : theme.black,
                fontSize: '3.5rem',
                lineHeight: 1.2,
                fontWeight: 900,

                [theme.fn.smallerThan('xs')]: {
                  fontSize: '1.75rem',
                },
              })}
            >
              An{' '}
              <Box
                component="span"
                sx={theme => ({
                  position: 'relative',
                  backgroundColor: theme.fn.variant({
                    variant: 'light',
                    color: theme.primaryColor,
                  }).background,
                  borderRadius: theme.radius.md,
                  padding: '4px 12px',
                })}
              >
                easy
              </Box>{' '}
              way to <br /> manage your pantry
            </Title>
            <Text color="dimmed" mt="md">
              Keep complete control of the products coming in and out of your
              pantry and you will never stop preparing your favorite recipe
              because you are missing an ingredient
            </Text>
            <List mt={30} spacing="sm" size="sm">
              <List.Item
                icon={
                  <ThemeIcon size="md" radius="sm" variant="light">
                    <Cheese size={18} />
                  </ThemeIcon>
                }
              >
                <b>Products in your pantry</b> – create the products you have
                available in your pantry so you know what you need and what you
                should not buy again
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size="md" radius="sm" variant="light">
                    <Calculator size={18} />
                  </ThemeIcon>
                }
              >
                <b>Built-in calculator</b> – keep track of the price of every
                product you want to buy and you will never go over budget
              </List.Item>
              <List.Item
                icon={
                  <ThemeIcon size="md" radius="sm" variant="light">
                    <CheckupList size={18} />
                  </ThemeIcon>
                }
              >
                <b>Purchase history</b> – access the history of your previous
                purchases at any time
              </List.Item>
            </List>
            <Group
              sx={theme => ({
                [theme.fn.smallerThan('sm')]: {
                  justifyContent: 'center',
                },
              })}
            >
              <Button
                radius="lg"
                size="xl"
                mt="3rem"
                component={Link}
                to="/sign-up"
              >
                Create your account
              </Button>
            </Group>
          </Box>
          <Image
            src={landingImage}
            sx={theme => ({
              width: '100%',
              maxWidth: '34.375rem',
              [theme.fn.smallerThan('md')]: {
                display: 'none',
              },
            })}
          />
        </Box>
      </Box>
      <Box
        component="footer"
        sx={theme => ({
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          minHeight: FOOTER_HEIGHT,
          borderTop: `1px solid ${
            theme.colorScheme === 'dark'
              ? theme.colors.dark[5]
              : theme.colors.gray[2]
          }`,
          [theme.fn.smallerThan('xs')]: {
            padding: `${theme.spacing.lg}px 0`,
          },
        })}
      >
        <Container
          px="lg"
          sx={theme => ({
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            [theme.fn.smallerThan('xs')]: {
              flexDirection: 'column',
            },
          })}
        >
          <AppLogo width={100} />
          <Stack
            align="center"
            spacing={0}
            sx={theme => ({
              [theme.fn.smallerThan('xs')]: {
                marginTop: theme.spacing.md,
              },
            })}
          >
            <Text
              size="sm"
              sx={{
                display: 'inline-flex',
              }}
            >
              Powered by{' '}
              <Text
                aria-label="PlanetScale"
                variant="link"
                size="sm"
                mx={4}
                component="a"
                href="https://planetscale.com/?utm_source=hashnode&utm_medium=hackathon&utm_campaign=announcement_article"
                target="_blank"
              >
                PlanetScale
              </Text>
              &
              <Text
                variant="link"
                size="sm"
                mx={4}
                component="a"
                href="https://hashnode.com/?source=planetscale_hackathon_announcement"
                target="_blank"
              >
                Hashnode
              </Text>
            </Text>
            <Text size="xs">Made with 💜 by Juan David</Text>
          </Stack>
          <Group
            spacing={0}
            position="right"
            noWrap
            sx={theme => ({
              [theme.fn.smallerThan('xs')]: {
                marginTop: theme.spacing.md,
              },
            })}
          >
            <ActionIcon
              size="lg"
              color="gray"
              variant="transparent"
              component="a"
              href="https://twitter.com/ndozhh"
              target="_blank"
            >
              <BrandTwitter size={18} />
            </ActionIcon>
            <ActionIcon
              size="lg"
              color="gray"
              variant="transparent"
              component="a"
              href="https://github.com/NdozHH/gryzzlist"
              target="_blank"
            >
              <BrandGithub size={18} />
            </ActionIcon>
          </Group>
        </Container>
      </Box>
    </>
  )
}

export default IndexRoute
