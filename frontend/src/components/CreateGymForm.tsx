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
export function CreateGym() {
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
        <FormField
          control={form.control}
          name="gymname"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Name</FormLabel>
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

        {/* Submit Button form */}

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
  {
    /* <Dialog>
        <DialogTrigger asChild>
          <div className="grid gap-4 w-[100px]">
            <Button variant="outline">+Add Offer</Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Offer</DialogTitle>
            <DialogDescription>
              Add price offers to your gym page.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[300px]">
            <div className="mt-2 ml-5"></div>
          </div>
          <div className="grid grid-cols-2">
            <Label>Title</Label>
            <Label>Offer type</Label>
            <Input
              className="w-[150px] ml-5 mt-4"
              placeholder="Awesome offer"
            />
            <Select>
              <SelectTrigger className="w-[180px] mt-4">
                <SelectValue placeholder="Subscription" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Days">Subscription </SelectItem>
                <SelectItem value="Weeks">OneTime</SelectItem>
                <SelectItem value="Months">FreeTrial</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-4">
            <Label>Minimum term</Label>
            <div className="grid grid-cols-2">
              <Input id="name" defaultValue="12" className="w-[100px] ml-5" />
              <Select>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Months" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Days">Days</SelectItem>
                  <SelectItem value="Weeks">Weeks</SelectItem>
                  <SelectItem value="Months">Months</SelectItem>
                  <SelectItem value="Years">Years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2">
              <Label>Price (€)</Label>
              <Label>Payment frequency</Label>
              <Input
                id="price"
                defaultValue="10"
                className="w-[100px] ml-5  mt-4"
              />
              <Select>
                <SelectTrigger className="w-[180px]  mt-4">
                  <SelectValue placeholder="monthly" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Weekly">weekly</SelectItem>
                  <SelectItem value="monthly">monthly</SelectItem>
                  <SelectItem value="yearly">yearly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2">
              <Label htmlFor="specialCheck">Special (limited) offer?</Label>
              <Label>End date</Label>
              <Checkbox
                checked={isSpecialOffer}
                onChange={() => setIsSpecialOffer((prevState) => !prevState)}
                className="ml-5 mt-4"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      ' justify-start text-left font-normal',
                      !date && 'text-muted-foreground',
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label htmlFor="minTerm">Description</Label>
              <Textarea placeholder="Type your offer description here." />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */
  }
}

export default CreateGym
