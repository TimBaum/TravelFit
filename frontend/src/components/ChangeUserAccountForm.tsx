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

export const changeUserAccountFormSchema = z.object({
  salutation: z.enum(['Mr.', 'Ms.', 'Diverse'], {
    required_error: 'Salutation is required.',
  }),
  displayName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
})

export function ChangeUserAccountForm() {
  const { user, getAccountType } = useAuth()
  let userDataFromBackend = useReadUser(user?._id ?? '', getAccountType()).data

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

  //useEffect is necessary because the default values are not available when initially rendering the form and are thus not displayed without useEffect
  useEffect(() => {
    form.reset({
      salutation:
        (userDataFromBackend?.salutation as 'Mr.' | 'Ms.' | 'Diverse') ??
        'Diverse',
      displayName: userDataFromBackend?.displayName ?? '',
      email: userDataFromBackend?.email ?? '',
    })
  }, [form.reset, userDataFromBackend])

  async function onSubmitSaveChanges(
    values: z.infer<typeof changeUserAccountFormSchema>,
  ) {
    console.log('New user values for update HTTP request: ', values)

    try {
      const response = await fetchJSON('/users/update/' + user?._id, {
        method: 'PATCH',
        body: JSON.stringify(values),
      })

      if (!response.ok) {
        console.log('response in changeUserAccountForm was ', response)
        console.log('response.ok in changeUserAccountForm was ', response.ok)
        //for some reason response.ok is undefined. updating works correctly,
        //the sent request is a PATCH request that returns status code 200
        //and this problem does not occur in the other 3 classes
        throw new Error('Problem changeing user because !response.ok')
      }

      console.log('User changed successfully:', await response)
      userDataFromBackend = useReadUser(user?._id ?? '', getAccountType()).data //TODO: refactor
    } catch (error) {
      console.error('Error changing user:', error)
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
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <div>
          <div className="flex justify-center items-center m-6">
            <div className="flex flex-col justify-center items-center p-6 border-2 border-gray-300 rounded-lg w-32 h-32">
              <LucidePencil size={20} />
              <span>Foto</span>
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
          <Button
            type="button"
            variant="outline"
            onClick={() => onClickChangePassword()}
          >
            Change password
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default ChangeUserAccountForm
