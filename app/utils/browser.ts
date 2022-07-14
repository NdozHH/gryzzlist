import type { Product } from '~/types/common'

const getFilteredProducts = (products: Product[], filter: string) => {
  if (products.length === 0) return []

  return products.filter(
    item => item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1,
  )
}

const getExpiresLabel = (difference: number, defaultLabel = '') => {
  if (difference <= 0) return 'expired'

  if (difference <= 3) return `on ${difference} days`

  return defaultLabel
}

export { getFilteredProducts, getExpiresLabel }
