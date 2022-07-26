import { useMatches } from '@remix-run/react'

const useRouteData = <LoaderData>(handleId?: string) => {
  const matches = useMatches()
  const match = matches.find(({ handle }) => handle?.id === handleId)

  if (!match) {
    return undefined
  }

  return match.data as LoaderData
}

export default useRouteData
