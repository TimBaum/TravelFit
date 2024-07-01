import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { config } from '@/config'

const phoneValidationRegex = /^\+?[1-9]\d{1,14}$/ // E.164 international phone number format

const formSchema = z.object({
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
  address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters.' }),
})

export function GymAccountForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const gymAccountData = { ...values }

    try {
      const response = await fetch(config.BACKEND_URL + '/gymAccounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gymAccountData),
      })

      if (!response.ok) {
        throw new Error('Failed to create gym account')
      }

      const data = await response.json()
      console.log('Gym account created successfully:', data)
    } catch (error) {
      console.error('Error creating gym account:', error)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="max-w-xl mx-auto p-5 border border-gray-300 rounded-md space-y-8"
      >
        <FormField
          control={form.control}
          name="salutation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Salutation</FormLabel>
              <FormControl>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="justify-between">
                      {field.value || 'Select'}
                      <span className="ml-2">&#x25BC;</span>{' '}
                      {/* Down arrow symbol */}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    {['Mr.', 'Ms.', 'Diverse'].map((option) => (
                      <DropdownMenuItem
                        key={option}
                        onSelect={() => field.onChange(option)}
                      >
                        {option}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </FormControl>
              <FormMessage>
                {form.formState.errors.salutation?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="first name" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.firstName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="last name" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.lastName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <div className="flex">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.email?.message}
                </FormMessage>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="phone" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <Button
          type="submit"
          variant="outline"
          className="mt-4 bg-emerald-500 text-white"
        >
          Create partner account
        </Button>
      </form>
    </Form>
  )
}

export default GymAccountForm
