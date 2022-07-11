import type { FC } from 'react'

import { createStyles, Paper, Tabs } from '@mantine/core'

const useStyles = createStyles(theme => ({
  paper: {
    width: '100%',
    maxWidth: 500,
    border: '1px solid',
    borderColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
  },
}))

const AuthTabs: FC = () => {
  const { classes } = useStyles()

  return (
    <Paper className={classes.paper} radius="md" p="md">
      <Tabs position="center" color="violet" grow variant="pills">
        <Tabs.Tab label="Sign in">Sign in</Tabs.Tab>
        <Tabs.Tab label="Sigh up">Sigh up</Tabs.Tab>
      </Tabs>
    </Paper>
  )
}

export default AuthTabs
