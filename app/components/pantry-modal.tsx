import type { FC } from 'react'

import { createStyles, Modal, Text } from '@mantine/core'
import type { ModalProps } from '@mantine/core'

import useMobile from '~/hooks/useMobile'

const useStyles = createStyles(theme => ({
  modal: {
    minHeight: '33.75rem',
  },
  inner: {
    padding: `${theme.spacing.md}px`,
    scrollbarWidth: 'none',
    '::-webkit-scrollbar': {
      display: 'none',
    },
  },
}))

const PantryModal: FC<ModalProps> = ({ children, ...props }) => {
  const { classes } = useStyles()
  const isMobile = useMobile()

  return (
    <Modal
      title={<Text size="lg">Products in your pantry</Text>}
      radius="md"
      centered
      size={isMobile ? 'sm' : 'md'}
      {...props}
      classNames={{
        modal: classes.modal,
        inner: classes.inner,
      }}
    >
      {children}
    </Modal>
  )
}

export default PantryModal
