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
import { config } from '@/config'
import { useAuth } from '@/provider/AuthProvider'
import { useReadUser } from '@/services/userService'
import { useEffect } from 'react'

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
  const { user } = useAuth()
  let userDataFromBackend = useReadUser(user?._id ?? '').data

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
    const newUserData = { ...values }
    console.log('New user values for update HTTP request: ', values)

    try {
      const response = await fetch(
        config.BACKEND_URL + '/users/update/' + user?._id ?? '',
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newUserData),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to change user')
      }

      const data = await response.json()
      console.log('User changed successfully:', data)
      userDataFromBackend = useReadUser(user?._id ?? '').data
    } catch (error) {
      console.error('Error changing user:', error)
    }
  }

  async function onClickChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  return (
    <Form {...form}>
      <form
      //onSubmit={form.handleSubmit((values) => {
      //console.log('handleSubmit called with values:', values)
      //onSubmitSaveChanges(values)
      //})}
      >
        <div className="flex flex-col items-center mb-5">
          <LucidePencil size={20} />
          <span>Foto</span>
        </div>
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

export default ChangeUserAccountForm
