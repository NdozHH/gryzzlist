import { useState } from 'react'

import { getFilteredProducts } from '~/utils/browser'

import type { Product } from '~/types/common'

const usePantrySearchFilter = (products: Product[]) => {
  const [filter, setFilter] = useState('')
  const filteredProducts = getFilteredProducts(products, filter)

  return {
    filteredProducts,
    filter,
    setFilter,
  }
}

export default usePantrySearchFilter
