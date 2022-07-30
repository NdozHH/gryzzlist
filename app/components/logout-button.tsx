import type { FC } from 'react'

import { useFetcher } from '@remix-run/react'

import Button from './button'

const LogoutButton: FC = () => {
  const fetcher = useFetcher()
  const isSubmitting = fetcher.state === 'submitting'

  const onLogout = () =>
    fetcher.submit(null, {
      method: 'delete',
      action: '/logout',
    })

  return (
    <Button
      variant="subtle"
      color="gray"
      radius="md"
      onClick={onLogout}
      loading={isSubmitting}
    >
      Log out
    </Button>
  )
}

export default LogoutButton
