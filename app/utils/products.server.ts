import type { z } from 'zod'

import prisma from '~/db/prisma.server'

import type { productSchema } from './form-schemas'

type ProductValues = z.infer<typeof productSchema> & {
  userId: string
}

const createProduct = async ({
  name,
  number,
  expiryDate,
  userId,
}: ProductValues) => {
  const product = await prisma.product.create({
    data: {
      name,
      number,
      expiryDate,
      userId,
    },
    select: {
      id: true,
      name: true,
      number: true,
      expiryDate: true,
    },
  })

  return product
}

const getProducts = async (userId: string) => {
  const products = await prisma.product.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
      name: true,
      number: true,
      expiryDate: true,
    },
  })

  return products
}

const deleteProduct = async (productId: string) => {
  const product = await prisma.product.delete({
    where: {
      id: productId,
    },
    select: {
      name: true,
    },
  })

  return product
}

export { createProduct, getProducts, deleteProduct }
