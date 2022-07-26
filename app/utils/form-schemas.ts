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
  number: z
    .number({
      required_error: 'Number is required',
    })
    .positive('Provided number is not valid'),
})

const calculatorItemSchema = productSchema.merge(
  z.object({
    price: z
      .number({
        required_error: 'Price is required',
      })
      .positive('Provided price is not valid'),
  }),
)

const calculatorSchema = z.object({
  products: z.array(calculatorItemSchema),
})

const fillPantrySchema = z.object({
  products: z.array(productSchema),
})

export {
  signInSchema,
  signUpSchema,
  productSchema,
  calculatorSchema,
  calculatorItemSchema,
  fillPantrySchema,
}
