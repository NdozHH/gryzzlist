import crypto from 'crypto'
import type { z } from 'zod'

import prisma from '~/db/prisma.server'

import type {
  calculatorSchema,
  fillPantrySchema,
  productSchema,
} from './form-schemas'

type ProductValues = z.infer<typeof productSchema> & {
  userId: string
  productId?: string
}

type UpdateProductValues = z.infer<typeof productSchema> & {
  productId: string
}

type ListValues = z.infer<typeof calculatorSchema> & {
  total: number
  userId: string
}

type PantryValues = z.infer<typeof fillPantrySchema> & {
  userId: string
}

const createProduct = async ({ name, number, userId }: ProductValues) => {
  const product = await prisma.product.create({
    data: {
      name,
      number,
      userId,
    },
    select: {
      id: true,
      name: true,
      number: true,
    },
  })

  return product
}

const fillPantry = async ({ products, userId }: PantryValues) => {
  await prisma.product.createMany({
    data: products.map(product => ({ ...product, userId })),
  })
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

const updateProduct = async ({
  name,
  number,
  productId,
}: UpdateProductValues) => {
  const product = await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name,
      number,
    },
    select: {
      name: true,
    },
  })

  return product
}

const createList = async ({ products, total, userId }: ListValues) => {
  const list = prisma.list.create({
    data: {
      userId,
      total,
      products: {
        createMany: {
          data: products.map(product => ({ ...product })),
        },
      },
    },
  })
  const pantryProducts = prisma.product.createMany({
    data: products.map(({ name, number }) => ({ userId, name, number })),
  })

  await Promise.all([list, pantryProducts])
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
  const list = await prisma.list.findFirst({
    where: {
      id: listId,
    },
    select: {
      createdAt: true,
      total: true,
      products: {
        select: {
          id: true,
          name: true,
          number: true,
          price: true,
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

const generateRandomString = () => crypto.randomBytes(4).toString('hex')

export {
  createProduct,
  fillPantry,
  getProducts,
  deleteProduct,
  updateProduct,
  createList,
  getUser,
  getLists,
  deleteList,
  getListProducts,
  generateRandomString,
}
