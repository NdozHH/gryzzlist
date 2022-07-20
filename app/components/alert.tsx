import { useEffect, useState } from 'react'
import type { FC } from 'react'
import { AlertCircle } from 'tabler-icons-react'

import { Alert as MAlert } from '@mantine/core'
import type { AlertProps } from '@mantine/core'

import type { AlertNotification } from '~/types/common'

type AlertConfiguration = Omit<AlertProps, 'children'> & {
  content: AlertNotification | undefined
}

const Alert: FC<AlertConfiguration> = ({ content, ...restProps }) => {
  const [showAlert, setShowAlert] = useState(() => Boolean(content?.message))
  const isAlertMessage = typeof content?.message === 'string'
  const alertId = content?.id

  useEffect(() => {
    if (isAlertMessage) {
      setShowAlert(true)
    }
  }, [alertId, isAlertMessage])

  if (!showAlert) return null

  return (
    <MAlert
      closeButtonLabel="Close alert"
      radius="md"
      withCloseButton
      variant="outline"
      color="red"
      icon={<AlertCircle size={20} />}
      title="Ups"
      {...restProps}
      onClose={() => setShowAlert(false)}
    >
      {content?.message}
    </MAlert>
  )
}

export default Alert
