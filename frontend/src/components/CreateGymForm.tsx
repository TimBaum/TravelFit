/* Imports */
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import OfferTile from '@/components/Offer'
import { IOffer } from '@models/offer'


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
  title: z.string().min(2, { message: 'Field is required.', }),
  description: z.string().min(2, { message: 'Field is required.', }),
  // TODO Rest: type, priceEuro,validityDays,startDate,endDate
})

/* Component content */
export function CreateGymForm() {
  const navigate = useNavigate()
  // state for the dialog form open/close
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  // offer array 
  const [offers, setOffers] = React.useState<IOffer[]>([]);

  //form default values
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymname: '',
      //TODO: insert other values
    },
  })
  const dialogForm = useForm({
    resolver: zodResolver(dialogFormSchema),
    defaultValues: {
      title: '',
      type: 'Special',
      description: '',
      priceEuro: 29.99,
      validityDays: 7,
      startDate: new Date(),
      endDate: new Date('2024-06-04T11:00:12.070Z'),
    },
  })

  /* Dialog submission + offer array */
  async function onDialogSubmit(values: z.infer<typeof dialogFormSchema>) {
    console.log(values)
    const newOffer: IOffer = {
      title: values.title,
      type: 'Special',
      description: values.description,
      priceEuro: 99.99,
      validityDays: 7,
      startDate: new Date(),
      endDate: new Date('2222-06-04T11:00:12.070Z'),
    };
    setOffers([...offers, newOffer]);
    setIsDialogOpen(false)
  }

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    // TODO: send data to backend
    navigate('/my-gyms')
  }

  /* Render */
  return (
    /* one form that contains all the fields */

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
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

        {/* OfferTile maps over the offer-array filled from the dialog form */}
        <h1 className="text-2xl font-bold mb-2 mt-3">Offers</h1>
        {offers.map((offer, index) => (
          <OfferTile key={index} offer={offer} />
        ))}

        {/* The dialog form that fills the offer array */}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="grid gap-4 mt-4"
            > + Add Offer</Button>
          </DialogTrigger>

          {/* The fields of the dialog form */}

          <DialogContent>
            <Form {...dialogForm}>
              <form onSubmit={dialogForm.handleSubmit(onDialogSubmit)}>
                <FormField
                  control={dialogForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={dialogForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
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

        {/* Submit Button for the whole form */}

        <Button className="mt-4" type="submit">
          Submit
        </Button>
      </form>
    </Form>
  )
}

export default CreateGymForm
