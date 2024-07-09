/* Imports */
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import OfferTile from '@/components/Offer'
import { IOffer } from '@models/offer'
import { config } from '@/config'

/* shadcn UI imports */
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Dropzone from './Dropzone'

/* Form checks */
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
  websiteLink: z
    .string()
    .refine((value) => simpleUrlRegex.test(value), { message: 'Invalid URL' }),
  address: z.object({
    street: z
      .string()
      .min(2, { message: 'Invalid street' })
      .max(100, { message: 'Invalid street' }),
    postalCode: z.string().regex(/^\d{5}$/, {
      message: 'Invalid postal code. It should be exactly 5 digits.',
    }),
    city: z
      .string()
      .min(2, { message: 'Invalid city' })
      .max(50, { message: 'Invalid city' }),
    country: z
      .string()
      .min(2, { message: 'Invalid country' })
      .max(50, { message: 'Invalid country' }),
  }),
  openingHours: z.object({
    weekday1: z.string(),
    weekday2: z.string(),
    openingHour: z.coerce.number(),
    closingHour: z.coerce.number(),
  }),
  highlights: z.array(z.string()).optional(),
})
const simpleUrlRegex =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
/* Dialog form checks */
const offerFormSchema = z.object({
  title: z.string().min(2, { message: 'Field is required.' }),
  description: z.string().min(2, { message: 'Field is required.' }),
  type: z
    .string()
    .refine(
      (val) =>
        ['Subscription', 'OneTime', 'FreeTrial', 'Special', '...'].includes(
          val,
        ),
      {
        message: 'Invalid type',
      },
    ),
  priceEuro: z.coerce.number(),
  validityDays: z.coerce.number(),
})

/* Component content */
export function CreateGymForm() {
  const navigate = useNavigate()
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  // offer array
  const [offers, setOffers] = React.useState<IOffer[]>([])

  //highlight options
  const highlights = [
    'Sauna',
    'Posing room',
    'Pool',
    'Courses',
    'Personal trainings',
    'Nutrition bar',
    'Outdoor',
    'Parking',
  ] as const

  /* form default values */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      websiteLink: '',
      address: {
        street: '',
        postalCode: '',
        city: '',
        country: 'Germany',
      },
      openingHours: {
        weekday1: 'Monday',
        weekday2: 'Sunday',
        openingHour: 8,
        closingHour: 22,
      },
      highlights: [],
      offers: [],
    },
  })

  /* Dialog submission default values */
  const offerForm = useForm({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      type: 'Subscription',
      description: '',
      priceEuro: 5,
      validityDays: 7,
    },
  })

  /* Pictures */
  interface UploadResult {
    public_id: string
    secure_url: string
    [key: string]: unknown // This line allows any additional attributes
  }
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])
  const handleFilesSelected = (files: File[]) => {
    setAcceptedFiles(files)
  }
  const uploadFiles = async (public_id: string) => {
    const uploadedFiles: UploadResult[] = []
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('upload_preset', 'test_preset')
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_KEY)
      formData.append('public_id', public_id + Date.now())

      const results = await fetch(
        'https://api.cloudinary.com/v1_1/travelfit/image/upload',
        {
          method: 'POST',
          body: formData,
        },
      ).then((r) => r.json())

      uploadedFiles.push(results)
    }
  }
  // workaround to get the dialog form to submit without submitting the main form lol
  function handleDialogSubmit() {
    return offerForm.handleSubmit(onDialogSubmit)()
  }
  async function onDialogSubmit(values: z.infer<typeof offerFormSchema>) {
    console.log(values)
    // TODO:
    // const offerData: IOffer = { ...values}
    // mock offer, can be deleted later
    const newOffer: IOffer = {
      title: values.title,
      type: 'Special',
      description: values.description,
      priceEuro: values.priceEuro,
      validityDays: values.validityDays,
      startDate: new Date(),
      endDate: new Date('2222-06-04T11:00:12.070Z'),
    }
    setOffers([...offers, newOffer])

    setIsDialogOpen(false)
  }

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //TODO: calc cheapest offer

    //  -> gymWithCheapestOffer = { cheapestOffer, ...values}

    /* send data to backend */
    const gymData = { offers, ...values }
    console.log(gymData)
    // Use gym name as image id without spaces
    const image_id = values.name.replace(/\s+/g, '')
    try {
      const response = await fetch(config.BACKEND_URL + '/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(gymData),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create gym')
      }
      const data = await response.json()
      console.log('Gym created:', data)
      await uploadFiles(image_id)
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
        {/* Gym name */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gym Name </FormLabel>
              <FormControl>
                <Input placeholder="Awesome gym" {...field} />
              </FormControl>
              <FormDescription>Enter the name of the gym.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* WebsiteLink */}
        <FormField
          control={form.control}
          name="websiteLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL</FormLabel>
              <FormControl>
                <Input placeholder="https://awesome-gym.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Address */}
        <div>
          <FormField
            control={form.control}
            name="address.street"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Street and Number *</FormLabel>
                <FormControl>
                  <Input placeholder="Awesome street 12" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.postalCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Postal Code *</FormLabel>
                <FormControl>
                  <Input placeholder="12345" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City *</FormLabel>
                <FormControl>
                  <Input placeholder="Awesometown" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country *</FormLabel>
                <FormControl>
                  <Input placeholder="Germany" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* OpeningHours */}
        <FormLabel className="text-2xl font-bold">Opening hours</FormLabel>
        <FormField
          control={form.control}
          name="openingHours.weekday1"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weekday 1</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Monday" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((weekday) => (
                      <SelectItem key={weekday} value={weekday}>
                        {weekday}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openingHours.weekday2"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Weekday 2</FormLabel>
              <FormControl>
                <Select onValueChange={(value) => field.onChange(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sunday" />
                  </SelectTrigger>
                  <SelectContent>
                    {weekdays.map((weekday) => (
                      <SelectItem key={weekday} value={weekday}>
                        {weekday}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openingHours.openingHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Opening Hour</FormLabel>
              <FormControl>
                <Input type="number" placeholder="6" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="openingHours.closingHour"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Closing Hour</FormLabel>
              <FormControl>
                <Input type="number" placeholder="22" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Highlights: */}
        <FormLabel className="text-2xl font-bold">Highlights</FormLabel>
        <FormDescription>
          Select the highlights your gym offers.
        </FormDescription>
        <FormField
          control={form.control}
          name="highlights"
          render={() => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-3">
              {highlights.map((highlight) => (
                <FormField
                  key={highlight}
                  control={form.control}
                  name="highlights"
                  render={({ field }) => {
                    return (
                      <FormItem
                        key={highlight}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={
                              highlight ===
                              field.value?.find((value) => value === highlight)
                            }
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, highlight])
                                : field.onChange(
                                    field.value?.filter(
                                      (value) => value !== highlight,
                                    ),
                                  )
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {highlight}
                        </FormLabel>
                      </FormItem>
                    )
                  }}
                />
              ))}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* TODO: Pictures */}
        <FormLabel className="text-2xl font-bold">Photos</FormLabel>
        <FormDescription>Show your gym!</FormDescription>
        <FormItem>
          <FormControl>
            <FormLabel className="font-normal">
              <Dropzone onFilesSelected={handleFilesSelected} />
            </FormLabel>
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Offers: OfferTile maps over the offer-array filled from the dialog form */}
        <h1 className="text-2xl font-bold mb-2 mt-3">Offers</h1>
        {offers.map((offer, index) => (
          <OfferTile key={index} offer={offer} />
        ))}

        {/* Dialog form that fills the offer array */}

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              onClick={() => setIsDialogOpen(true)}
              className="grid gap-4 mt-4"
            >
              + Add Offer
            </Button>
          </DialogTrigger>

          {/* The fields of the dialog form */}
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Offer</DialogTitle>
              <DialogDescription>
                Add a personalized price offer here.
              </DialogDescription>
            </DialogHeader>
            <Form {...offerForm}>
              <form onSubmit={offerForm.handleSubmit(onDialogSubmit)}>
                <FormField
                  control={offerForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Title</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offerForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offerForm.control}
                  name="priceEuro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (€)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={offerForm.control}
                  name="validityDays"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Validity in days</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Offer Type: Irgendein kack rekursionsproblem */}

                {/* <FormField
                  control={offerForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offer Type</FormLabel>
                      <Select onValueChange={handleChange} defaultValue={ }>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a verified email to display" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="m@example.com">m@example.com</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                <FormField
                  control={offerForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Type your offer description here."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit button for the dialog form */}

                <DialogFooter>
                  <Button type="button" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="button" onClick={() => handleDialogSubmit()}>
                    Save
                  </Button>
                  {/* <Button type="submit">Submit</Button> */}
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
