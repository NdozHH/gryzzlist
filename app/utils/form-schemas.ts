import { z } from 'zod'

const signInSchema = z.object({
  email: z.string().email({
    message: 'Provided email is not valid',
  }),
  password: z.string().min(10, {
    message: 'Provided password is too short',
  }),
})

const signUpSchema = z.object({
  name: z.string().min(1, {
    message: 'Provided name is too short',
  }),
  email: z.string().email({
    message: 'Provided email is not valid',
  }),
  password: z.string().min(10, {
    message: 'Provided password is too short',
  }),
})

const productSchema = z.object({
  name: z.string().min(1, {
    message: 'Provided name is too short',
  }),
  number: z.number().min(1),
  expiryDate: z.date().optional(),
})

export { signInSchema, signUpSchema, productSchema }
