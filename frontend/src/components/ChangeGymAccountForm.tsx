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
import {
  useReadGymAccount,
  useUpdateGymAccount,
  useDeleteGymAccount,
} from '@/services/gymAccountService'
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
      //address: gymAccountDataFromBackend?.address ?? '',
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
      // address: oldData?.address,
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    })
  }, [form.reset, gymAccountDataFromBackend])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeGymAccountFormSchema>,
  ) {
    console.log('New gym account values for update HTTP request: ', values)
    /*const data = useUpdateGymAccount(
      user?._id ?? '',
      JSON.stringify(newGymAccountData),
    )
    console.log('Gym account changed successfully:', data)
    gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data*/

    try {
      const response = await fetchJSON('/gymAccounts/update/' + user?._id, {
        method: 'PATCH',
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        throw new Error('Failed to change gym account')
      }

      console.log('Gym account changed successfully:', await response)
      gymAccountDataFromBackend = useReadGymAccount(user?._id ?? '').data
    } catch (error) {
      console.error('Error changing gym account:', error)
    }
  }

  async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  const handleDeleteAccount = async () => {
    try {
      // Assuming deleteGymAccount() returns a promise
      await useDeleteGymAccount()
      console.log('Account deleted successfully')
      // Handle post-deletion logic here, like redirecting the user
    } catch (error) {
      console.error('Failed to delete account:', error)
    }
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
              {/*  <Button
              type="button"
              variant="outline"
              onClick={() => useDeleteGymAccount()}
            >
              Delete this account
            </Button>*/}
            </div>
          </div>
        </form>
      </Form>
      {/*<Button
        type="button"
        variant="outline"
        onClick={() => handleDeleteAccount()}
      >
        Delete this account
      </Button>*/}
    </div>
  )
}

export default ChangeGymAccountForm