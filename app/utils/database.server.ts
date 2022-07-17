import type { z } from 'zod'

import prisma from '~/db/prisma.server'

import type { calculatorSchema, productSchema } from './form-schemas'

type ProductValues = z.infer<typeof productSchema> & {
  userId: string
}

type ListValues = z.infer<typeof calculatorSchema> & {
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

const createList = async ({ products, userId }: ListValues) => {
  const list = await prisma.list.create({
    data: {
      userId,
      products: {
        createMany: {
          data: products.map(product => ({ ...product, userId })),
        },
      },
    },
  })

  return list
}

const getUser = async (userId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  })

  return user
}

export { createProduct, getProducts, deleteProduct, createList, getUser }
