import { z } from 'zod'

/* Form checks */
export const gymFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
  websiteLink: z
    .string()
    .refine((value) => simpleUrlRegex.test(value), { message: 'Invalid URL' }),
  address: z.object({
    street: z
      .string()
      .min(2, { message: 'Invalid street' })
      .max(100, { message: 'Invalid street' }),
    postalCode: z.string().regex(/^\d{5}$/, {
      message: 'Invalid postal code. It should be exactly 5 digits.',
    }),
    city: z
      .string()
      .min(2, { message: 'Invalid city' })
      .max(50, { message: 'Invalid city' }),
    country: z
      .string()
      .min(2, { message: 'Invalid country' })
      .max(50, { message: 'Invalid country' }),
  }),
  openingTimes: z.array(
    z
      .object({
        weekday: z.coerce.number().min(0).max(6).nullable(), //0 = Sunday, 6 = Saturday
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
      })
      .refine(
        (data) =>
          data.weekday === null || (data.openingTime && data.closingTime), //checks if opening and closing times are non-empty strings when the day is selected
        {
          message: 'Times must be provided',
          path: ['closingTime'], // Pfad zur Fehlermeldung
        },
      )
      .refine(
        (data) => {
          if (data.weekday === null) return true
          if (!data.openingTime || !data.closingTime) return false
          return data.openingTime < data.closingTime
        },
        {
          message: 'Opening time must be before closing time',
          path: ['closingTime'],
        },
      ),
  ),
  highlights: z.array(z.string()).optional(),
})
const simpleUrlRegex =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

/* Dialog form checks */
export const offerFormSchema = z.object({
  title: z.string().min(2, { message: 'Field is required.' }),
  description: z.string().min(2, { message: 'Field is required.' }),
  type: z.string(),
  isSpecial: z.boolean(),
  priceEuro: z.coerce.number(),
  endDate: z.coerce.date(),
})
