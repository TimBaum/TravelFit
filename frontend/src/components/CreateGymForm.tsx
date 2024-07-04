/* Imports */
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

/* UI imports */
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog'

/* Form checks */
const formSchema = z.object({
  gymname: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
})

/* Dialog form checks */
const dialogFormSchema = z.object({
  dialogField: z.string().min(2, {
    message: 'Field is required.',
  }),
})

/* Component content */
export function CreateGymForm() {
  const [count, setCount] = React.useState(0); //delete
  const increment = () => {
    setCount(count + 1);
  };
  //constants
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymname: '',
    },
  })

  const dialogForm = useForm({
    resolver: zodResolver(dialogFormSchema),
    defaultValues: {
      dialogField: '',
    },
  })

  const [isDialogOpen, setIsDialogOpen] = React.useState(false)

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    navigate('/my-gyms')
  }

  /* Dialog submission */
  async function onDialogSubmit(values: z.infer<typeof dialogFormSchema>) {
    console.log(values)

    setIsDialogOpen(false)
  }

  /* Render */
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormLabel>Hallo!{count}</FormLabel>
        <FormField
          control={form.control}
          name="gymname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Name </FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>Enter the name of the gym.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="mt-4"
            >
              Open Dialog
            </Button>
          </DialogTrigger>
          <DialogContent>
            <Form {...dialogForm}>
              <form onSubmit={dialogForm.handleSubmit(onDialogSubmit)}>
                <FormField
                  control={dialogForm.control}
                  name="dialogField"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dialog Field</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button type="button" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        <Button onClick={increment}>Increment</Button>
        {/* Submit Button form */}

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default CreateGymForm
