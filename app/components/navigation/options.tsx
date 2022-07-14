import type { FC } from 'react'
import { Calculator, Notes } from 'tabler-icons-react'

import { Container, createStyles } from '@mantine/core'

import Option from './option'

interface OptionsProps {
  onCloseDrawer?: () => void
}

const useStyles = createStyles(theme => ({
  navigation: {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gridGap: theme.spacing.sm,
    justifyItems: 'start',
  },
}))

const Options: FC<OptionsProps> = ({ onCloseDrawer }) => {
  const { classes } = useStyles()

  return (
    <Container id="here" fluid className={classes.navigation} px={0}>
      <Option
        to="calculator"
        label="Calculator"
        leftIcon={<Calculator size={25} />}
        onClick={onCloseDrawer}
      />
      <Option
        to="pantry"
        label="Pantry"
        leftIcon={<Notes size={25} />}
        onClick={onCloseDrawer}
      />
    </Container>
  )
}

export default Options
