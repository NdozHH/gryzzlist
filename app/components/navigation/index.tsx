import { createContext, useContext, useState } from 'react'
import type { FC, SetStateAction, Dispatch } from 'react'

import Header from '~/components/header'

import Desktop from './desktop'
import Mobile from './mobile'

interface NavigationContextType {
  opened: boolean
  setOpened: Dispatch<SetStateAction<boolean>>
}

export const NavigationContext = createContext<
  NavigationContextType | undefined
>(undefined)
NavigationContext.displayName = 'NavigationContext'

export const useNavigationContext = () => {
  const context = useContext(NavigationContext)

  if (context === undefined) {
    throw new Error(
      'useNavigationContext must be used within a NavigationProvider',
    )
  }

  return context
}

const Navigation: FC = () => {
  const [opened, setOpened] = useState(false)

  const value = {
    opened,
    setOpened,
  }

  return (
    <>
      <NavigationContext.Provider value={value}>
        <Header />
      </NavigationContext.Provider>
      <Desktop />
      <NavigationContext.Provider value={value}>
        <Mobile />
      </NavigationContext.Provider>
    </>
  )
}

export default Navigation
