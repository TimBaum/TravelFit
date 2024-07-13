/* Imports */
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import OfferTile from '@/components/OfferTile'
import { IOffer } from '@models/offer'
import { config } from '@/config'

/* shadcn UI imports */
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
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
  openingTimes: z.array(
    z
      .object({
        weekday: z.coerce.number().min(0).max(6).nullable(), //0 = Sunday, 6 = Saturday
        openingTime: z.string(),
        closingTime: z.string(),
      })
      .refine(
        (data) =>
          data.weekday === null || (data.openingTime && data.closingTime), //checks if opening and closing times are non-empty strings when the day is selected
        {
          message: 'Times must be provided',
          path: ['closingTime'], // Pfad zur Fehlermeldung
        },
      )
      .refine(
        (data) => {
          if (data.weekday === null) return true
          if (!data.openingTime || !data.closingTime) return false
          return data.openingTime < data.closingTime
        },
        {
          message: 'Opening time must be before closing time',
          path: ['closingTime'],
        },
      ),
  ),
  highlights: z.array(z.string()).optional(),
})
const simpleUrlRegex =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

/* Dialog form checks */
const offerFormSchema = z.object({
  title: z.string().min(2, { message: 'Field is required.' }),
  description: z.string().min(2, { message: 'Field is required.' }),
  type: z.string(),
  isSpecial: z.boolean(),
  priceEuro: z.coerce.number(),
  endDate: z.coerce.date(),
})

/* Component content */
export function CreateGymForm() {
  const navigate = useNavigate()
  /* Opening Times */
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const [isOpen, setIsOpen] = React.useState(Array(7).fill(false))

  /* highlight options */
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
  /* Offers */
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const types = ['Subscription', 'One time payment', 'Trial']
  const [isSpecial, setIsSpecial] = React.useState(false)
  const [offers, setOffers] = React.useState<IOffer[]>([])

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
      openingTimes: Array(7).fill({
        weekday: null,
        openingTime: '',
        closingTime: '',
      }),
      highlights: [],
      offers: [],
    },
  })
  const watch = form.watch //watch is a function that returns the value of the fields being watched

  /* Dialog submission default values */
  const offerForm = useForm({
    resolver: zodResolver(offerFormSchema),
    defaultValues: {
      title: '',
      type: 'Subscription',
      isSpecial: false,
      description: '',
      priceEuro: 5,
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  })

  // Form workaround to get the dialog form to submit without submitting the main form
  function handleDialogSubmit() {
    return offerForm.handleSubmit(onDialogSubmit)()
  }
  async function onDialogSubmit(values: z.infer<typeof offerFormSchema>) {
    console.log(values)
    if (!values.isSpecial) {
      values.endDate = new Date(
        new Date().setFullYear(new Date().getFullYear() + 50),
      )
    }
    // TODO:
    // const offerData: IOffer = { ...values}
    // mock offer, can be deleted later
    const newOffer: IOffer = {
      title: values.title,
      type: values.type,
      isSpecial: values.isSpecial,
      description: values.description,
      priceEuro: values.priceEuro,
      startDate: new Date(),
      endDate: values.endDate,
    }
    setOffers([...offers, newOffer])
    setIsDialogOpen(false)
  }

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    //TODO: calc cheapest offer
    //  -> gymWithCheapestOffer = { cheapestOffer, ...values}
    const openingHours = values.openingTimes.filter(
      (day) => day?.weekday !== null, //checks if the day is selected and if not, excludes the day from the array
    )
    /* send data to backend */
    const gymData = { offers, openingHours, ...values }
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

        {/* Opening Times */}

        <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
        <div className="grid grid-cols-7">
          {weekdays.map((day, index) => (
            <div key={day} className="day-row">
              <FormField
                control={form.control}
                name={`openingTimes.${index}.weekday`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{day}: open</FormLabel>
                    <FormControl>
                      <Switch
                        checked={isOpen[index]}
                        onCheckedChange={(checked) => {
                          const newIsOpen = [...isOpen]
                          newIsOpen[index] = checked
                          setIsOpen(newIsOpen)
                          field.onChange(checked ? index : null)
                          if (!checked) {
                            form.setValue(
                              `openingTimes.${index}.weekday`,
                              null,
                            ), // Setze weekday auf null
                              form.setValue(
                                `openingTimes.${index}.openingTime`,
                                'dudud',
                              ),
                              form.setValue(
                                `openingTimes.${index}.closingTime`,
                                'dududu',
                              )
                          }
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watch(`openingTimes.${index}.weekday`) !== null && (
                <>
                  <FormField
                    control={form.control}
                    name={`openingTimes.${weekdays.indexOf(day)}.openingTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Opening Time</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(24)].map((_, hour) =>
                                [...Array(2)].map((_, half) => {
                                  const time = `${hour.toString().padStart(2, '0')}:${half === 0 ? '00' : '30'}`
                                  return (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  )
                                }),
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`openingTimes.${index}.closingTime`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Closing Time</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select time" />
                            </SelectTrigger>
                            <SelectContent>
                              {[...Array(24)].map((_, hour) =>
                                [...Array(2)].map((_, half) => {
                                  const time = `${hour.toString().padStart(2, '0')}:${half === 0 ? '00' : '30'}`
                                  return (
                                    <SelectItem key={time} value={time}>
                                      {time}
                                    </SelectItem>
                                  )
                                }),
                              )}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}
            </div>
          ))}
        </div>

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
        {/* Pictures */}
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
                        <Select
                          onValueChange={(value) => field.onChange(value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Subscription" />
                          </SelectTrigger>
                          <SelectContent>
                            {types.map((type) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2">
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
                  {/* <FormField
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
                  /> */}
                </div>
                <div className="grid grid-cols-2">
                  <FormField
                    control={offerForm.control}
                    name="isSpecial"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Special (time limited) offer?{field.value}
                        </FormLabel>
                        <FormControl>
                          <Checkbox
                            className={cn('grid ml-5')}
                            checked={field.value}
                            onCheckedChange={() => {
                              const newValue = !field.value
                              setIsSpecial(newValue)
                              field.onChange(newValue)
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={offerForm.control}
                    name="endDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Offer ends on:</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                disabled={!isSpecial}
                                variant={'outline'}
                                className={cn(
                                  'w-[240px] text-left',
                                  !field.value && 'text-muted-foreground',
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date < new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={offerForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Describe your offer here. What is included and what is not? What are the benefits?"
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
