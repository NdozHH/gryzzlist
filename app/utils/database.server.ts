import crypto from 'crypto'
import type { z } from 'zod'

import prisma from '~/db/prisma.server'

import type { calculatorSchema, productSchema } from './form-schemas'

type ProductValues = z.infer<typeof productSchema> & {
  userId: string
}

type ListValues = z.infer<typeof calculatorSchema> & {
  total: number
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
      price: true,
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

const createList = async ({ products, total, userId }: ListValues) => {
  const list = await prisma.list.create({
    data: {
      userId,
      total,
      products: {
        createMany: {
          data: products.map(product => ({ ...product, userId })),
        },
      },
    },
  })

  return list
}

const getLists = async (userId: string) => {
  const lists = await prisma.list.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    select: {
      _count: {
        select: {
          products: true,
        },
      },
      id: true,
      createdAt: true,
      total: true,
    },
  })

  return lists
}

const deleteList = async (listId: string) => {
  await prisma.list.delete({
    where: {
      id: listId,
    },
  })
}

const getListProducts = async (listId: string) => {
  const list = await prisma.list.findUnique({
    where: {
      id: listId,
    },
    select: {
      products: {
        select: {
          id: true,
          name: true,
          number: true,
          expiryDate: true,
          price: true,
        },
      },
    },
  })

  return list?.products
}

const getUser = async (userId: string) => {
  const user = await prisma.user.findFirstOrThrow({
    where: {
      id: userId,
    },
  })

  return user
}

const generateRandomString = () => crypto.randomBytes(4).toString('hex')

export {
  createProduct,
  getProducts,
  deleteProduct,
  createList,
  getUser,
  getLists,
  deleteList,
  getListProducts,
  generateRandomString,
}
