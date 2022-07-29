import type { NotificationProps } from '@mantine/notifications'

import type {
  Product as OriginalProduct,
  List as OriginalList,
  ListProduct,
} from '~/db/prisma.server'

export enum ActionType {
  CREATE = 'create',
  DELETE = 'delete',
  EDIT = 'edit',
}

export type Product = Pick<OriginalProduct, 'id' | 'name' | 'number'>

export interface AlertNotification {
  message: string
  id: string
  config?: Omit<NotificationProps, 'message'>
}

export type List = Pick<OriginalList, 'createdAt' | 'id' | 'total'>

export type ListDetail = Pick<OriginalList, 'createdAt' | 'total'> & {
  products: Pick<ListProduct, 'id' | 'name' | 'number' | 'price'>[]
}

export interface BaseLoaderData {
  name: string
}

export interface Handle {
  id: string
}
