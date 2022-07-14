import { useFetcher } from '@remix-run/react'

const useLogout = () => {
  const fetcher = useFetcher()

  return () =>
    fetcher.submit(null, {
      method: 'delete',
      action: '/logout',
    })
}

export default useLogout
