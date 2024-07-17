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
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/provider/AuthProvider'
import { useState } from 'react'
import { fetchJSON } from '@/services/utils'
import { userAccountFormSchema } from '@/schemas/userAccountFormSchema'

export function UserAccountForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof userAccountFormSchema>>({
    resolver: zodResolver(userAccountFormSchema),
    defaultValues: {
      salutation: undefined,
      displayName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(values: z.infer<typeof userAccountFormSchema>) {
    try {
      setIsLoading(true)
      await fetchJSON('/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      })

      login(values.email, values.password)
      navigate('/')
    } catch (error) {
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  //without this, a GET instead of a POST request is sent
  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    form.handleSubmit((values) => onSubmit(values))()
  }

  return (
    <Form {...form}>
      <form onSubmit={handleFormSubmit}>
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
                <Input placeholder="name" {...field} />
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
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage>{form.formState.errors.email?.message}</FormMessage>
            </FormItem>
          )}
        />
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
          className="bg-emerald-500 text-white mt-4"
        >
          Create free account
        </Button>
      </form>
    </Form>
  )
}

export default UserAccountForm
