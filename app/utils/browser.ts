import type { Product } from '~/types/common'

const getFilteredProducts = (products: Product[], filter: string) => {
  if (products.length === 0) return []

  return products.filter(
    item => item.name.toLowerCase().indexOf(filter.toLowerCase()) > -1,
  )
}

const getExpiresLabel = (difference: number, defaultLabel = '') => {
  if (difference <= 0) return 'expired'

  if (difference <= 3)
    return `on ${difference} ${difference === 1 ? 'day' : 'days'}`

  return defaultLabel
}

const formatCurrency = (value: number) => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })

  return formatter.format(value)
}

export { getFilteredProducts, getExpiresLabel, formatCurrency }
