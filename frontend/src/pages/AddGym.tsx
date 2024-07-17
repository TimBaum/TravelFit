import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm, FormProvider } from 'react-hook-form' // Import FormProvider to pass down the form contextimport { Button } from '@/components/ui/button'

import {
  Form,
  FormField,
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AddressFields } from '../components/AddressFields'
import { Button } from '@/components/ui/button'
import { gymFormSchema } from '@/schemas/gymFormSchema'

const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
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
})

export function AddGym() {
  const form = useForm<z.infer<typeof gymFormSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
        country: 'Germany',
        // location: {
        //   type: 'Point',
        //   coordinates: [0, 0],
        // },
      },
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('onSubmit called with values:', values) // Kontrollpunkt
  }

  return (
    <FormProvider {...form}>
      {/* Provide the form context to child components */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Name</FormLabel>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gym Name</FormLabel>
                <FormControl>
                  <Input placeholder="Cool Gym" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel className="text-2xl font-bold">Address</FormLabel>
          <AddressFields /> {/* Use the new AddressFields component */}
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </FormProvider>
  )
}

export default AddGym
