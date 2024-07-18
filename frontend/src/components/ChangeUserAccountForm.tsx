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
import { LucidePencil } from 'lucide-react'
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

  //useEffect is necessary because the default values are not available when initially
  //rendering the form and are thus not displayed without useEffect
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

  /* async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }*/

  //without this, a GET instead of a POST request is sent
  //this prevents the default form submission and instead uses
  //react-hook-form's handleSubmit method to process the form data
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit((values) => onSubmitSaveChanges(values))()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <div>
          <div className="flex justify-center items-center m-6">
            <div className="flex flex-col justify-center items-center p-6 border rounded-lg w-32 h-32">
              <LucidePencil size={20} />
              <span>Photo</span>
            </div>
          </div>
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
          {/*<Button
            type="button"
            variant="outline"
            onClick={() => onClickChangePassword()}
          >
            TODO: Change password
          </Button>*/}
        </div>
      </form>
    </Form>
  )
}

export default ChangeUserAccountForm
