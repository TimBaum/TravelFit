/* Imports */
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import OfferTile from '@/components/Offer'
import { IOffer } from '@models/offer'
import { config } from '@/config'

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
  title: z.string().min(2, { message: 'Field is required.' }),
  description: z.string().min(2, { message: 'Field is required.' }),
  // TODO Rest: type, priceEuro,validityDays,startDate,endDate
})

/* Component content */
export function CreateGymForm() {
  const navigate = useNavigate()
  // state for the dialog form open/close
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  // offer array
  const [offers, setOffers] = React.useState<IOffer[]>([])

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
  async function onDialogSubmit(
    // event: React.FormEvent<HTMLFormElement>, //to prevent default form submission when submitting dialog offer
    values: z.infer<typeof dialogFormSchema>,
  ) {
    // event.preventDefault() // Verhindert das Standardverhalten des Formulars
    // event.stopPropagation() // Stoppt die Weitergabe des Events an übergeordnete Elemente
    console.log(values)
    const newOffer: IOffer = {
      title: values.title,
      type: 'Special',
      description: values.description,
      priceEuro: 99.99,
      validityDays: 7,
      startDate: new Date(),
      endDate: new Date('2222-06-04T11:00:12.070Z'),
    }
    setOffers([...offers, newOffer])

    setIsDialogOpen(false)
  }

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)

    // send data to backend
    //const gymData = { ...values }
    const mockGym = {
      name: 'Fitness World',
      highlights: ['Sauna', 'Pool', 'Personal trainings'],
      websiteLink: 'https://www.fitnessworld.com',
      pictures: [
        'https://example.com/picture1.jpg',
        'https://example.com/picture2.jpg',
      ],
      averageRating: 4.5,
      cheapestOfferPrice: 19.99,
      address: {
        street: '123 Fitness St',
        city: 'Workout City',
        state: 'Muscle State',
        zipCode: '12345',
        country: 'Gainsland',
      },
      openingHours: [
        { start: '06:00', end: '22:00', dayOfWeek: 'Monday' },
        { start: '06:00', end: '22:00', dayOfWeek: 'Tuesday' },
        { start: '06:00', end: '22:00', dayOfWeek: 'Wednesday' },
        { start: '06:00', end: '22:00', dayOfWeek: 'Thursday' },
        { start: '06:00', end: '22:00', dayOfWeek: 'Friday' },
        { start: '08:00', end: '20:00', dayOfWeek: 'Saturday' },
        { start: '08:00', end: '20:00', dayOfWeek: 'Sunday' },
      ],
      offers: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    try {
      const response = await fetch(config.BACKEND_URL + '/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockGym),
      })
      const data = await response.json()
      console.log('Gym created:', data)
      form.control._reset()
    } catch (error) {
      console.log('Error creating gym:', error)
    }
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
            >
              {' '}
              + Add Offer
            </Button>
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
