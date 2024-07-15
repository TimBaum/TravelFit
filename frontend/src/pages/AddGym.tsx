import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import axios from 'axios'
import { Button } from '@/components/ui/button'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'

const formSchema = z.object({
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
    // location: z.object({
    //   type: z.string(),
    //   coordinates: z.tuple([z.number(), z.number()]), // Validierung als Tupel
    // }),
  }),
})

export function AddGym() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const fetchCoordinates = async (address: {
    street: string
    postalCode: string
    city: string
    country: string
  }) => {
    console.log('fetchCoordinates called with address:', address) // Kontrollpunkt
    try {
      const fullAddress = `${address.street}, ${address.postalCode} ${address.city}, ${address.country}`
      console.log('Full address:', fullAddress) // Kontrollpunkt
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
      )
      console.log('API response:', response.data) // Kontrollpunkt
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]
        return {
          type: 'Point',
          coordinates: [parseFloat(lon), parseFloat(lat)] as [number, number],
        }
      } else {
        throw new Error('Address not found')
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error)
      throw error
    }
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log('onSubmit called with values:', values) // Kontrollpunkt
    try {
      const location = await fetchCoordinates(values.address)
      const completeValues = {
        ...values,
        address: {
          ...values.address,
          location,
        },
      }
      console.log('Complete values:', completeValues) // Kontrollpunkt
      // Hier kannst du die kompletten Werte weiterverarbeiten oder senden
    } catch (error) {
      alert('Error fetching coordinates')
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Address</FormLabel>
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>street</FormLabel>
                <FormControl>
                  <Input placeholder="Street" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormLabel className="text-2xl font-bold">Address</FormLabel>
          <FormField
            control={form.control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code</FormLabel>
                <FormControl>
                  <Input placeholder="Postal Code" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input placeholder="City" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="Country" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  )
}

export default AddGym
