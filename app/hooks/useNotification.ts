import { useShallowEffect } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'

import type { AlertNotification } from '~/types/common'

type NotificationContent = AlertNotification | undefined

const useNotification = (
  content: NotificationContent = {
    message: '',
    id: '',
    config: {},
  },
) => {
  const { showNotification: showMNotification } = useNotifications()
  const { id, message, config } = content

  useShallowEffect(() => {
    if (!message) return

    showMNotification({
      color: 'violet',
      radius: 'md',
      ...config,
      id,
      message,
    })
  }, [message, id])

  return id
}

export default useNotification
