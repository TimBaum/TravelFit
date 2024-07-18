import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useAuth } from '@/provider/AuthProvider'
import { useReadGymAccount } from '@/services/gymAccountService'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { changeGymAccountFormSchema } from '@/schemas/changeGymAccountFormSchema'

import { fetchJSON } from '@/services/utils'
import { AddressFields } from './AddressFields'
import { toast } from 'sonner'

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

export function ChangeGymAccountForm() {
  const { user, getAccountType } = useAuth()
  const { data: gymAccountDataFromBackend } = useReadGymAccount(
    user?._id ?? '',
    getAccountType(),
  )

  // useForm hook from react-hook-form is used for handling form state, validation, and submission
  // zodResolver along with Zod schema is used for form validation
  const form = useForm<z.infer<typeof changeGymAccountFormSchema>>({
    resolver: zodResolver(changeGymAccountFormSchema),
    // Setting default form values based on the data fetched from the backend
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

  // useEffect is used to update form values dynamically after the component mounts
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
  }, [gymAccountDataFromBackend, form])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeGymAccountFormSchema>,
  ) {
    try {
      await fetchJSON('/gymAccounts/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
      })
      toast('Changes saved')
    } catch (error) {
      console.error('Error changing gym account:', error)
    }
  }

  //this prevents the default form submission and instead uses
  //react-hook-form's handleSubmit method to process the form data
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit((values) => onSubmitSaveChanges(values))()
  }

  return (
    <div>
      <Form {...form}>
        {/* Form component with react-hook-form integration */}
        <form onSubmit={handleFormSubmit}>
          {/* Form element with custom submit handler */}
          <div className="border-2 border-gray-300 rounded-lg p-4">
            <FormField
              control={form.control}
              /* the form's control property registers input fields to the form so that react-hook-form can manage 
            their states and re-render the components as needed based on user input and validation changes
            */
              name="salutation"
              /* render the DropdownMenu with the props 'field', an object containing properties and methods 
            to manage the input's state, handle its registration, and integrate it with the form's validation system */
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
                            /* selecting a value means that field.onChange() is called
                            which updates the form's state to reflect the selected value*/
                            onSelect={() => field.onChange(option)}
                          >
                            {option}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FormControl>
                  {/* Display validation message for this field */}
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
              <AddressFields />
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
            <div className="mt-6">
              <Button type="submit" variant="outline">
                Save changes
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default ChangeGymAccountForm
