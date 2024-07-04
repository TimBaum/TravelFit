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

//TODO: this is a code duplicate, see GymAccountForm -> refactor
const phoneValidationRegex = /^\+?[1-9]\d{1,14}$/ // E.164 international phone number format

const formSchema = z
  .object({
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
    address: z
      .string()
      .min(5, { message: 'Address must be at least 5 characters.' }),
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters.' }),
    confirmPassword: z
      .string()
      .min(8, { message: 'Confirm Password must be at least 8 characters.' }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export function ChangeGymAccountForm() {
  const { user } = useAuth()
  const oldSalutation = useReadUser(user?._id ?? '').data?.salutation as
    | 'Mr.'
    | 'Ms.'
    | 'Diverse'
    | undefined
  const oldFirstName = useReadUser(user?._id ?? '').data?.firstName
  const oldLastName = useReadUser(user?._id ?? '').data?.lastName
  const oldAddress = useReadUser(user?._id ?? '').data?.address
  const oldEmail = useReadUser(user?._id ?? '').data?.email
  const oldPhone = useReadUser(user?._id ?? '').data?.phone

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      salutation: oldSalutation,
      firstName: oldFirstName,
      lastName: oldLastName,
      address: oldAddress,
      email: oldEmail,
      phone: oldPhone,
    },
  })

  //useEffect is necessary because the default values are not available when rendering the form and are thus not displayed without useEffect
  useEffect(() => {
    form.reset({
      salutation: oldSalutation,
      firstName: oldFirstName,
      lastName: oldLastName,
      address: oldAddress,
      email: oldEmail,
      phone: oldPhone,
    })
  }, [
    oldSalutation,
    oldFirstName,
    oldLastName,
    oldAddress,
    oldEmail,
    oldPhone,
    form.reset,
  ])

  async function onSubmitSaveChanges(values: z.infer<typeof formSchema>) {
    const userData = { ...values }

    try {
      const response = await fetch(
        config.BACKEND_URL + '/gymAccounts/update/' + user?._id ?? '',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(userData),
        },
      )

      if (!response.ok) {
        throw new Error('Failed to change gym account')
      }

      const data = await response.json()
      console.log('Gym account changed successfully:', data)
    } catch (error) {
      console.error('Error changing gym account:', error)
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

export default ChangeGymAccountForm
