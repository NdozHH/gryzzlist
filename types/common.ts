import type { Product as OriginalProduct } from '~/db/prisma.server'

export type Product = Pick<
  OriginalProduct,
  'id' | 'name' | 'number' | 'expiryDate'
>

export enum PantryAction {
  CREATE = 'create',
  DELETE = 'delete',
}

export interface AlertNotification {
  message: string
}
