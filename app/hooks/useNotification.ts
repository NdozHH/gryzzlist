import { useDidUpdate } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'

import type { AlertNotification } from '~/types/common'

type NotificationContent = AlertNotification | undefined

const useNotification = (
  content: NotificationContent = {
    message: '',
    id: '',
  },
) => {
  const { showNotification: showMNotification } = useNotifications()
  const { id, message } = content

  useDidUpdate(() => {
    if (!message) return

    showMNotification({
      id,
      color: 'violet',
      radius: 'md',
      message,
    })
  }, [message, id])

  return id
}

export default useNotification
