import type { FC } from 'react'

import { Stack, Text } from '@mantine/core'

import useImageMediaQuery from '~/hooks/useImageMediaQuery'

import emptyPantry from '~/images/empty_pantry.svg'
import type { Product } from '~/types/common'

import ProductCard from './product-card'

interface PantryContentProps {
  isEmpty: boolean
  products: Product[]
  hideDelete?: boolean
  optimisticProduct?: {
    name: FormDataEntryValue | null | undefined
    number: FormDataEntryValue | null | undefined
  }
}

const PantryContent: FC<PantryContentProps> = ({
  isEmpty,
  products,
  optimisticProduct,
  hideDelete,
}) => {
  const smallImageQuery = useImageMediaQuery('sm')

  return (
    <>
      {!isEmpty ? (
        <>
          {products.length > 0 ? (
            <Stack>
              {products.map(product => (
                <ProductCard
                  key={product.id}
                  {...product}
                  hideDelete={hideDelete}
                />
              ))}
              {optimisticProduct?.name ? (
                <ProductCard
                  id="temporal-id"
                  name={String(optimisticProduct.name)}
                  number={Number(optimisticProduct.number)}
                />
              ) : null}
            </Stack>
          ) : (
            <Stack align="center" mt="xl" spacing="sm">
              <img
                srcSet={`${emptyPantry} 890w`}
                sizes={`${smallImageQuery} 220px, 330px`}
                src={emptyPantry}
                alt="A man with a list in his hand and an empty grocery cart"
              />
              <Text mt="md" size="xl" align="center">
                There're no products matching your search query
              </Text>
            </Stack>
          )}
        </>
      ) : (
        <Stack align="center" mt="xl" spacing="sm">
          <img
            srcSet={`${emptyPantry} 890w`}
            sizes={`${smallImageQuery} 220px, 330px`}
            src={emptyPantry}
            alt="A man with a list in his hand and an empty grocery cart"
          />
          <Text mt="md" size="xl" align="center">
            You don't have any products in your pantry yet
          </Text>
        </Stack>
      )}
    </>
  )
}

export default PantryContent
