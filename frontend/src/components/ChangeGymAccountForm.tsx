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
import { useAuth } from '@/provider/AuthProvider'
import { useReadGymAccount } from '@/services/gymAccountService'
import { useEffect } from 'react'
import { fetchJSON } from '@/services/utils'

const phoneValidationRegex = /^\+?[1-9]\d{1,14}$/ // E.164 international phone number format

export const changeGymAccountFormSchema = z.object({
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
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters.' })
    .regex(phoneValidationRegex, {
      message: 'Please enter a valid phone number.',
    }),
})

export function ChangeGymAccountForm() {
  const { user } = useAuth()
  console.log('useAuth() in changeGymAccountForm returns ', user, ' as user.')
  let gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data
  console.log('gymAccountDataFromBackend ist ', gymAccountDataFromBackend)

  const form = useForm<z.infer<typeof changeGymAccountFormSchema>>({
    resolver: zodResolver(changeGymAccountFormSchema),
    defaultValues: {
      salutation:
        (gymAccountDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      firstName: gymAccountDataFromBackend?.firstName ?? '',
      lastName: gymAccountDataFromBackend?.lastName ?? '',
      address: {
        street: gymAccountDataFromBackend?.address.street ?? '',
        postalCode: gymAccountDataFromBackend?.address.postalCode ?? '',
        city: gymAccountDataFromBackend?.address.city ?? '',
        country: gymAccountDataFromBackend?.address.country ?? '',
      },
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    },
  })

  //useEffect is necessary because the default values are not available when rendering the form and are thus not displayed without useEffect
  useEffect(() => {
    form.reset({
      salutation:
        (gymAccountDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      firstName: gymAccountDataFromBackend?.firstName ?? '',
      lastName: gymAccountDataFromBackend?.lastName ?? '',
      address: {
        street: gymAccountDataFromBackend?.address.street ?? '',
        postalCode: gymAccountDataFromBackend?.address.postalCode ?? '',
        city: gymAccountDataFromBackend?.address.city ?? '',
        country: gymAccountDataFromBackend?.address.country ?? '',
      },
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    })
  }, [form.reset, gymAccountDataFromBackend])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeGymAccountFormSchema>,
  ) {
    console.log('New gym account values for update HTTP request: ', values)

    try {
      await fetchJSON('/gymAccounts/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
      })

      gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data
    } catch (error) {
      console.error('Error changing gym account:', error)
    }
  }

  async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  //without this, a GET instead of a POST request is sent
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit((values) => onSubmitSaveChanges(values))()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={handleFormSubmit}>
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <FormField
              control={form.control}
              name="salutation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="mr-2">Salutation</FormLabel>
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
            <div className="mt-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First name</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.lastName?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
              {/* <AddressFields /> TODO: Use the new AddressFields component */}
              <>
                <div className="w-1/2">
                  <FormField
                    control={form.control}
                    name="address.street"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Street</FormLabel>
                        <FormControl>
                          <Input placeholder="Street" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid grid-cols-2 w-1/2 gap-2">
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
                </div>
                <div className="w-1/2">
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
                </div>
              </>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                      <Input {...field} />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.phone?.message}
                    </FormMessage>
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-6 space-x-4">
              <Button type="submit" variant="outline">
                Save changes
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onClickChangePassword()}
              >
                Change password
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ChangeGymAccountForm
