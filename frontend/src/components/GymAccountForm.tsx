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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/provider/AuthProvider'
import { useState } from 'react'
import { fetchJSON } from '@/services/utils'
import { gymAccountFormSchema } from '@/schemas/gymAccountFormSchema'

export function GymAccountForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof gymAccountFormSchema>>({
    resolver: zodResolver(gymAccountFormSchema),
    defaultValues: {
      salutation: undefined,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      //address: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof gymAccountFormSchema>) {
    try {
      setIsLoading(true)
      await fetchJSON('/gymAccounts/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      login(values.email, values.password)
      navigate('/my-gyms')
    } catch (error) {
      console.error('Error creating gym account:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // this is the form's onSubmit-handler
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    //without this, a GET instead of a POST request is sent
    //in the http-request of the onSubmit-function
    event.preventDefault()
    form.handleSubmit((values) => onSubmit(values))()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
        <div className="mb-2">
          <FormField
            control={form.control}
            name="salutation"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="mr-2">Salutation</FormLabel>
                <FormControl>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      {/* the drowdown menu is triggered by this button that displays the currently
                    selected value (or "Select" if no value is selected) */}
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
                          // selecting a value means that field.onChange() is called
                          //which updates the form's state to reflect the selected value
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
        </div>
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="first name" {...field} />
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
              <FormItem className="w-1/2">
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="last name" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.lastName?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>

        {/*} <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="address" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.address?.message}
              </FormMessage>
            </FormItem>
          )}
        />*/}
        <div className="flex space-x-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-1/2">
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="email" {...field} />
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
              <FormItem className="w-1/2">
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="phone" {...field} />
                </FormControl>
                <FormMessage>
                  {form.formState.errors.phone?.message}
                </FormMessage>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="password" {...field} />
              </FormControl>
              <FormMessage>
                {form.formState.errors.password?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="confirm password"
                  {...field}
                />
              </FormControl>
              <FormMessage>
                {form.formState.errors.confirmPassword?.message}
              </FormMessage>
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={isLoading ? 'loading' : 'outline'}
          className="mt-4 bg-emerald-500 text-white"
        >
          Create partner account
        </Button>
      </form>
    </Form>
  )
}

export default GymAccountForm
