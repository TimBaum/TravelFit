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
import { useAuth } from '@/provider/AuthProvider'
import { useReadGymAccount } from '@/services/gymAccountService'
import { useEffect } from 'react'

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
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 characters.' })
    .regex(phoneValidationRegex, {
      message: 'Please enter a valid phone number.',
    }),
  /*address: z
    .string()
    .min(5, { message: 'Address must be at least 5 characters.' }),*/
  /* password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters.' }),*/
})
/* .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })*/

export function ChangeGymAccountForm() {
  const { user } = useAuth()
  let gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data

  const form = useForm<z.infer<typeof changeGymAccountFormSchema>>({
    resolver: zodResolver(changeGymAccountFormSchema),
    defaultValues: {
      salutation:
        (gymAccountDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      firstName: gymAccountDataFromBackend?.firstName ?? '',
      lastName: gymAccountDataFromBackend?.lastName ?? '',
      //address: gymAccountDataFromBackend?.address ?? '',
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    },
  })

  //useEffect is necessary because the default values are not available when rendering the form and are thus not displayed without useEffect
  //TODO: show new values instead of old values
  useEffect(() => {
    form.reset({
      salutation:
        (gymAccountDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      firstName: gymAccountDataFromBackend?.firstName ?? '',
      lastName: gymAccountDataFromBackend?.lastName ?? '',
      // address: oldData?.address,
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    })
  }, [form.reset, gymAccountDataFromBackend])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeGymAccountFormSchema>,
  ) {
    const newUserData = { ...values }
    console.log('New gym account values: ', values)

    try {
      /* const testString = config.BACKEND_URL + '/gymAccounts/update/' + user?._id
      console.log(
        'string that is sent to backend for changing gym account',
        testString,
      )*/
      const response = await fetch(
        config.BACKEND_URL + '/gymAccounts/update/' + user?._id ?? '',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to change gym account')
      }

      const data = await response.json()
      console.log('Gym account changed successfully:', data)
      gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data
    } catch (error) {
      console.error('Error changing gym account:', error)
    }
  }

  async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  return (
    <Form {...form}>
      <form>
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
        {/* <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />*/}
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
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
              <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant="outline"
          onClick={() =>
            form.handleSubmit((values) => onSubmitSaveChanges(values))()
          }
        >
          Save changes
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => onClickChangePassword()}
        >
          Change password
        </Button>
      </form>
    </Form>
  )
}

export default ChangeGymAccountForm
