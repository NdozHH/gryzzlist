import type { FC } from 'react'

import { json } from '@remix-run/node'
import type { LoaderFunction } from '@remix-run/node'

export const loader: LoaderFunction = async () => {
  return json({
    name: 'Calculator',
  })
}

const CalculatorRoute: FC = () => {
  return null
}

export default CalculatorRoute
