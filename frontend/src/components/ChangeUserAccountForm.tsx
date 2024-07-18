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
import { useReadUser } from '@/services/userService'
import { useEffect } from 'react'
import { fetchJSON } from '@/services/utils'
import { changeUserAccountFormSchema } from '@/schemas/changeUserAccountFormSchema'
import { toast } from 'sonner'

export function ChangeUserAccountForm() {
  const { user, getAccountType } = useAuth()
  const { data: userDataFromBackend } = useReadUser(
    user?._id ?? '',
    getAccountType(),
  )

  const form = useForm<z.infer<typeof changeUserAccountFormSchema>>({
    resolver: zodResolver(changeUserAccountFormSchema),
    defaultValues: {
      salutation:
        (userDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      displayName: userDataFromBackend?.displayName ?? '',
      email: userDataFromBackend?.email ?? '',
    },
  })

  // useEffect is used to update form values dynamically after the component mounts
  useEffect(() => {
    form.reset({
      salutation:
        (userDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      displayName: userDataFromBackend?.displayName ?? '',
      email: userDataFromBackend?.email ?? '',
    })
  }, [userDataFromBackend, form])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeUserAccountFormSchema>,
  ) {
    try {
      await fetchJSON('/users/update', {
        method: 'PATCH',
        body: JSON.stringify(values),
      })
      toast('Changes saved')
    } catch (error) {
      console.error('Error changing user:', error)
    }
  }

  //this prevents the default form submission and instead uses
  //react-hook-form's handleSubmit method to process the form data
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit((values) => onSubmitSaveChanges(values))()
  }

  return (
    <Form {...form}>
      {/* Form component with react-hook-form integration */}
      <form onSubmit={handleFormSubmit}>
        {' '}
        {/* Form element with custom submit handler */}
        <div>
          {/* <div className="flex justify-center items-center m-6">
            <div className="flex flex-col justify-center items-center p-6 border rounded-lg w-32 h-32">
              <LucidePencil size={20} />
              <span>Photo</span>
            </div>
          </div>*/}
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
          <FormField
            control={form.control}
            name="displayName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.displayName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
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
        </div>
        <div className="mt-6 space-x-4">
          <Button type="submit" variant="outline">
            Save changes
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangeUserAccountForm
