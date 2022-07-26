import type {
  Product as OriginalProduct,
  List as OriginalList,
} from '~/db/prisma.server'

export enum ActionType {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
}

export type Product = Pick<OriginalProduct, 'id' | 'name' | 'number' | 'price'>

export interface AlertNotification {
  message: string
  id?: string
}

export type List = Pick<OriginalList, 'createdAt' | 'id' | 'total'>

export interface BaseLoaderData {
  name: string
}

export interface Handle {
  id: string
}
