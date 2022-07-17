import { useId, useShallowEffect } from '@mantine/hooks'
import { useNotifications } from '@mantine/notifications'
import type { NotificationProps } from '@mantine/notifications'

type NotificationContent =
  | 'string'
  | {
      title?: string
      message?: string
    }
  | undefined

const variants = {
  success: 'violet',
  info: 'cyan',
  warning: 'yellow',
  error: 'pink',
}

interface NotificationConfiguration
  extends Omit<NotificationProps, 'title' | 'message' | 'color'> {
  variant?: keyof typeof variants
}

const useNotification = (
  content: NotificationContent,
  configuration: NotificationConfiguration = {},
) => {
  const { showNotification } = useNotifications()
  const id = useId()

  useShallowEffect(() => {
    if (!content) return

    const title = typeof content === 'string' ? undefined : content.title
    const message = typeof content === 'string' ? content : content.message

    if (message) {
      showNotification({
        id,
        color: variants[configuration.variant || 'success'],
        ...configuration,
        radius: 'md',
        title,
        message,
      })
    }
  }, [configuration, content, showNotification])

  return configuration.id || id
}

export default useNotification
