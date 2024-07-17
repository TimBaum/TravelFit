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
import { changeGymAccountFormSchema } from '@/schemas/changeGymAccountFormSchema'

export function ChangeGymAccountForm() {
  const { user, getAccountType } = useAuth()
  const { data: gymAccountDataFromBackend } = useReadGymAccount(
    user?._id ?? '',
    getAccountType(),
  )

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

  //useEffect is necessary because the default values are not available when initially
  //rendering the form and are thus not displayed without useEffect
  useEffect(() => {
    form.reset({
      salutation:
        (gymAccountDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      firstName: gymAccountDataFromBackend?.firstName ?? '',
      lastName: gymAccountDataFromBackend?.lastName ?? '',
      //address: gymAccountDataFromBackend?.address ?? '',
      email: gymAccountDataFromBackend?.email ?? '',
      phone: gymAccountDataFromBackend?.phone ?? '',
    })
  }, [gymAccountDataFromBackend, form])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeGymAccountFormSchema>,
  ) {
    try {
      await fetchJSON('/gymAccounts/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
      })
    } catch (error) {
      console.error('Error changing gym account:', error)
    }
  }

  async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  //without this, a GET instead of a POST request is sent
  //this prevents the default form submission and instead uses
  //react-hook-form's handleSubmit method to process the form data
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
              {/*  <FormField
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
