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
import { useReadGymAccount } from '@/services/gymAccountService'
import { useEffect } from 'react'
import { gymAccountFormSchema } from '@/components/GymAccountForm'

export function ChangeGymAccountForm() {
  const { user } = useAuth()
  const oldData = useReadGymAccount(user?._id ?? '').data

  const form = useForm<z.infer<typeof gymAccountFormSchema>>({
    resolver: zodResolver(gymAccountFormSchema),
    defaultValues: {
      salutation: oldData?.salutation as 'Mr.' | 'Ms.' | 'Diverse',
      firstName: oldData?.firstName,
      lastName: oldData?.lastName,
      address: oldData?.address,
      email: oldData?.email,
      phone: oldData?.phone,
    },
  })

  //useEffect is necessary because the default values are not available when rendering the form and are thus not displayed without useEffect
  //TODO: show new values instead of old values
  useEffect(() => {
    form.reset({
      salutation: oldData?.salutation as 'Mr.' | 'Ms.' | 'Diverse',
      firstName: oldData?.firstName,
      lastName: oldData?.lastName,
      address: oldData?.address,
      email: oldData?.email,
      phone: oldData?.phone,
    })
  }, [form.reset, oldData])

  async function onSubmitSaveChanges(
    values: z.infer<typeof gymAccountFormSchema>,
  ) {
    const userData = { ...values }

    try {
      const testString = config.BACKEND_URL + '/gymAccounts/update/' + user?._id
      console.log(
        'string that is sent to backend for changing gym account',
        testString,
      )
      const response = await fetch(
        config.BACKEND_URL + '/gymAccounts/update/' + user?._id,
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
        <FormField
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
