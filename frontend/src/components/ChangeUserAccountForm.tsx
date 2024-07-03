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

const formSchema = z.object({
  salutation: z.enum(['Mr.', 'Ms.', 'Diverse'], {}),
  displayName: z
    .string()
    .min(2, { message: 'Name must be at least 2 characters.' }),
  //email,
})

export function ChangeUserAccountForm() {
  const { user } = useAuth()
  const oldSalutation = useReadUser(user?._id ?? '').data?.salutation as
    | 'Mr.'
    | 'Ms.'
    | 'Diverse'
    | undefined
  const oldDisplayName = useReadUser(user?._id ?? '').data?.displayName

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: oldSalutation,
      displayName: oldDisplayName,
      //email: 'TODO: should email be changeable?',
    },
  })

  //useEffect is necessary because the default values are not available when rendering the form and are thus not displayed without useEffect
  useEffect(() => {
    form.reset({
      salutation: oldSalutation,
      displayName: oldDisplayName,
    })
  }, [oldSalutation, oldDisplayName, form.reset])

  async function onSubmitSaveChanges(values: z.infer<typeof formSchema>) {
    const userData = { ...values }

    try {
      const response = await fetch(config.BACKEND_URL + '/users/create', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })

      if (!response.ok) {
        throw new Error('Failed to create user')
      }

      const data = await response.json()
      console.log('User created successfully:', data)
    } catch (error) {
      console.error('Error creating user:', error)
    }
  }

  async function onSubmitChangeEmail() {
    return <h1>TODO: implement email change</h1>
  }

  async function onSubmitChangePassword() {
    return <h1>TODO: implement password change</h1>
  }

  return (
    <Form {...form}>
      <form>
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
        {/* <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="TODO: fetch email from backend"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />*/}
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
          type="submit"
          variant="outline"
          onClick={() => form.handleSubmit(() => onSubmitChangeEmail())()}
        >
          Change email
        </Button>
        <Button
          type="submit"
          variant="outline"
          onClick={() => form.handleSubmit(() => onSubmitChangePassword())()}
        >
          Change password
        </Button>
      </form>
    </Form>
  )
}

export default ChangeUserAccountForm
