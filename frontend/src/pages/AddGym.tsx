import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import '../styles/AddGym.css'

const formSchema = z.object({
  gymname: z.string().min(2).max(50),
  url: z.string().url(),
  address: z.string().min(5).max(100),
  highlights: z.string().optional(),
  offers: z.string().optional(),
  specialOffers: z.string().optional(),
})

export function AddGym() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymname: '',
      url: '',
      address: '',
      highlights: '',
      offers: '',
      specialOffers: '',
    },
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      // API-Aufruf zum Hinzufügen eines neuen Gyms
      const response = await fetch('http://localhost:5000/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.gymname,
          websiteLink: values.url,
          address: {
            street: values.address,
            postalCode: '12345', // example; replace
            city: 'Sample City',
            country: 'Sample Country',
            latitude: 40.7128,
            longitude: -74.006,
          },
        }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      // const data = await response.json()
    } catch (error) {
      console.error('Error adding gym:', error)
    }
  }
  return (
    <>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-gyms">My Gyms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/add-gym">Add Gym</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="container">
        <h1 className="title">Add Gym</h1>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="gymname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gym name</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome gym" {...field} />
                </FormControl>
                <FormDescription>
                  This is the public display name of your gym.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://awesome-gym.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome street 12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights</FormLabel>
                <FormControl>
                  <Input placeholder="Select your highlights" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="offers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Offers</FormLabel>
                <FormControl>
                  <Input placeholder="+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="specialOffers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Special Offers</FormLabel>
                <FormControl>
                  <Input placeholder="+" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}

export default AddGym
