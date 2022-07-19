import type {
  Product as OriginalProduct,
  List as OriginalList,
} from '~/db/prisma.server'

export enum ActionType {
  CREATE = 'create',
  DELETE = 'delete',
}

export type Product = Pick<
  OriginalProduct,
  'id' | 'name' | 'number' | 'expiryDate' | 'price'
>

export interface AlertNotification {
  message: string
  id: string
}

export type List = Pick<OriginalList, 'createdAt' | 'id' | 'total'>
