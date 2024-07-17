import { z } from 'zod'

const phoneValidationRegex = /^\+?[1-9]\d{1,14}$/ // E.164 international phone number format

export const gymAccountFormSchema = z
  .object({
    salutation: z.enum(['Mr.', 'Ms.', 'Diverse'], {
      required_error: 'Salutation is required.',
    }),
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters.' }),
    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters.' }),
    email: z.string().email({ message: 'Invalid email address.' }),
    phone: z
      .string()
      .min(10, { message: 'Phone number must be at least 10 characters.' })
      .regex(phoneValidationRegex, {
        message: 'Please enter a valid phone number.',
      }),
    /*address: z
      .string()
      .min(5, { message: 'Address must be at least 5 characters.' }),*/
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })
