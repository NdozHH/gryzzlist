import { useEffect } from 'react'

import { useLocation } from '@remix-run/react'

// Small trick to fix a problem with the @mantine/notifications dependency, which is duplicating some tags in the head of the document
const useRemoveTag = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    if (typeof document === 'undefined') return

    const titles = document.getElementsByTagName('title')

    if (titles.length > 1) {
      titles[0].remove()
    }
  }, [pathname])

  return undefined
}

export default useRemoveTag
