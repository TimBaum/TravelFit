/* Imports */
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import OfferTile from '@/components/OfferTile'
import { IOffer } from '@models/offer'
import { config } from '@/config'
import { fetchJSON } from '@/services/utils'
import axios from 'axios' // API used for finding the coordinates of the gym-address

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

import { TrashIcon } from '@radix-ui/react-icons'
import { ResetIcon } from '@radix-ui/react-icons'
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
import { useFetchImages, useGetGym } from '@/services/gymService'

/* Form checks */
const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
  websiteLink: z
    .string()
    .refine((value) => simpleUrlRegex.test(value), { message: 'Invalid URL' }),
  addressFields: z.object({
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
        openingTime: z.string().optional(),
        closingTime: z.string().optional(),
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

interface CreateGymFormProps {
  mode: 'create' | 'edit'
}

/* Component content */
export function CreateGymForm({ mode }: CreateGymFormProps) {
  const navigate = useNavigate()
  // Leonie
  const { id } = useParams<{ id: string }>()
  const gymId = id || ''
  const {
    data: gym,
    //error: getGymError,
    //loading: getGymLoading,
  } = useGetGym(gymId)

  // FIXME: at the moment only pictures which public_id starts with gym are used. For some reason gym.name is not arriving on time.
  const cleanedName = gym?.name?.replace(/\s+/g, '') || 'gym'

  // Use custom hook to fetch images
  const { data: photos } = useFetchImages(cleanedName || '')

  /* fetch coordinates of the address */
  const fetchCoordinates = async (addressFields: {
    street: string
    postalCode: string
    city: string
    country: string
  }): Promise<{ type: string; coordinates: [number, number] }> => {
    console.log('fetchCoordinates called with addressFields:', addressFields) // Kontrollpunkt
    try {
      const fullAddress = `${addressFields.street}, ${addressFields.postalCode} ${addressFields.city}, ${addressFields.country}`
      console.log('Full addressFields:', fullAddress) // Kontrollpunkt
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullAddress)}`,
      )
      console.log('API response:', response.data) // Kontrollpunkt
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0]
        console.log('lat+lon:', lat, lon) // Kontrollpunkt
        return {
          type: 'Point',
          coordinates: [parseFloat(lon), parseFloat(lat)] as [number, number],
        }
      } else {
        console.error('Error fetching coordinates.')
        return {
          type: 'Point',
          coordinates: [0, 0] as [number, number],
        }
      }
    } catch (error) {
      console.error('Error fetching coordinates.', error)
      return {
        type: 'Point',
        coordinates: [0, 0] as [number, number],
      }
    }
  }

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

  /* Offers */
  const [isDialogOpen, setIsDialogOpen] = React.useState(false)
  const types = ['Subscription', 'One time payment', 'Trial']
  const [isSpecial, setIsSpecial] = React.useState(false)
  const [offers, setOffers] = React.useState<IOffer[]>([])
  const handleDeleteOffer = (index: number) => {
    const updatedOffers = offers.filter((_, i) => i !== index)
    setOffers(updatedOffers)
  }
  /* form default values */
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      websiteLink: '',
      addressFields: {
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

  /* 
  Array of strings (public_ids of images) to be deleted after submission
  Initiaizated with an empty array
  setFlaggedForDeletion  takes a function as an argument, where the function's parameter represents the previous state.
  */
  const [flaggedForDeletion, setFlaggedForDeletion] = useState<string[]>([])

  // State to set at beginning and end of onSubmit to show loading animation
  const [pageLoading, setPageLoading] = useState(false)

  /*
  Function to toggle flag for deletion of images:
  - if image is already flagged, it is removed from the array
  - if image is not flagged, it is added to the array 
  */
  const toggleFlagForDeletion = (
    event: React.MouseEvent<HTMLButtonElement>,
    photoId: string,
  ) => {
    // Prevent form submission (default behaviour for buttons in forms)
    event.preventDefault()
    setFlaggedForDeletion((prev) =>
      prev.includes(photoId)
        ? prev.filter((id) => id !== photoId)
        : [...prev, photoId],
    )
  }

  /* 
  hook for prefill the form with the gyms data if in edit mode
  runs before form is rendered  
  pre-fills a form with a gym's data when the component is in "edit" mode and a gym object is provided
  */
  React.useEffect(() => {
    if (mode === 'edit' && gym) {
      console.log('gym.address:', gym.address), // Kontrollpunkt
        form.reset({
          name: gym.name,
          websiteLink: gym.websiteLink,
          addressFields: {
            street: gym.address.street,
            postalCode: gym.address.postalCode,
            city: gym.address.city,
            country: gym.address.country,
          },
          //TODO: Add all fields
        })
    }
  }, [mode, gym, form])

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

  /* Pictures: Response from cloudinary when image is uploaded successfully */
  interface UploadResult {
    public_id: string
    secure_url: string
    [key: string]: unknown // This line allows any additional attributes
  }

  // Array of files that have been selected via the dropzone
  const [acceptedFiles, setAcceptedFiles] = useState<File[]>([])

  // Callback function that will be triggered when files are dropped/selected
  const handleFilesSelected = (files: File[]) => {
    setAcceptedFiles(files)
  }

  // Upload files to cloudinary (public_id is gym name and used for all images. To make it unique, a TimeStamp is added)
  const uploadFiles = async (public_id: string, acceptedFiles: File[]) => {
    const uploadedFiles: UploadResult[] = []
    // Loop through all files and upload them one by one
    for (const file of acceptedFiles) {
      const formData = new FormData()
      formData.append('file', file)
      /* set of settings and configurations defined in Cloudinary account that specify how to handle the media files being uploaded */
      formData.append('upload_preset', 'test_preset')
      formData.append('api_key', import.meta.env.VITE_CLOUDINARY_KEY)
      // Specify public_id to match gym id
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

    setPageLoading(true)

    /*add coordinates */
    let location: { type: string; coordinates: [number, number] } | null = null
    try {
      location = await fetchCoordinates(values.addressFields)
      if (location.coordinates[0] === 0 && location.coordinates[1] === 0) {
        location = null // Setze location auf null, wenn die Koordinaten beide 0 sind
      }
    } catch (error) {
      alert('Error fetching coordinates')
    }
    console.log(
      'values.addressFields & location:',
      values.addressFields,
      location,
    )

    const address = {
      ...values.addressFields,
      location,
    }

    /* Opening Times */
    const openingHours = values.openingTimes.filter(
      (day) => day?.weekday !== null, //checks if the day is selected and if not, excludes the day from the array
    )
    console.log('CompleteAddress2:', address)
    const gymData = { offers, address, openingHours, ...values }
    console.log(gymData)

    // set the image id to the gym name
    const image_id = values.name.replace(/\s+/g, '')

    /* send data to backend */
    if (mode === 'create') {
      try {
        const data = await fetchJSON('/gyms/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(gymData),
        })
        console.log('Gym created:', data)
        await uploadFiles(image_id, acceptedFiles)
        form.reset()
        console.log('Gym-id:', data.gym._id) //works
      } catch (error) {
        console.log('Error creating gym:', error)
      } finally {
        setPageLoading(false)
      }
      navigate('/my-gyms')
    } else if (mode === 'edit') {
      try {
        const response = await fetch(
          config.BACKEND_URL + `/gyms/update/${gym?._id}`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(gymData),
          },
        )
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Failed to create gym')
        }
        const data = await response.json()
        console.log('Gym created:', data)
        // Upload new images
        await uploadFiles(image_id, acceptedFiles)
        // Delete flagged photos
        if (flaggedForDeletion.length > 0) {
          await Promise.all(
            flaggedForDeletion.map(async (photoId) => {
              await fetch(
                `${config.BACKEND_URL}/gyms/delete-image/${photoId}`,
                {
                  method: 'DELETE',
                },
              )
            }),
          )
          setFlaggedForDeletion([]) // Reset flagged photos
        }
        form.control._reset()
      } catch (error) {
        console.log('Error creating gym:', error)
      } finally {
        setPageLoading(false)
      }
      navigate('/my-gyms')
    }
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

        {/* addressFields */}
        <div>
          <FormField
            control={form.control}
            name="addressFields.street"
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
            name="addressFields.postalCode"
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
            name="addressFields.city"
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
            name="addressFields.country"
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
                                '',
                              ),
                              form.setValue(
                                `openingTimes.${index}.closingTime`,
                                '',
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
                              <SelectItem key="24:00" value="24:00">
                                24:00
                              </SelectItem>
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
              {/* Dropzone accepts callback function that will be triggered when files are dropped/selected */}
              <Dropzone onFilesSelected={handleFilesSelected} />
            </FormLabel>
          </FormControl>
          <FormMessage />
        </FormItem>

        {/* Display stored photos if edit mode*/}

        {mode === 'edit' && (
          <>
            <FormLabel className="text-2xl font-bold">Current Photos</FormLabel>
            <div className="grid grid-cols-3 gap-4 mt-4">
              {photos && photos.length > 0 ? (
                photos.map((photo, index) => (
                  <div key={index} className="relative">
                    <img
                      src={photo.url}
                      alt={`Gym Photo ${index}`}
                      // If the photo is flagged for deletion, the image is greyed out
                      className={`w-full h-full object-cover ${flaggedForDeletion.includes(photo.public_id) ? 'opacity-50' : ''}`}
                    />
                    <button
                      className="absolute top-0 right-0 bg-red-500 text-white m-2 p-1"
                      onClick={(event) =>
                        // Toggles the flag for deletion: if the photo is already flagged, it is removed from the array. If it is not flagged, it is added to the array
                        toggleFlagForDeletion(event, photo.public_id)
                      }
                    >
                      {flaggedForDeletion.includes(photo.public_id) ? (
                        <ResetIcon />
                      ) : (
                        <TrashIcon />
                      )}
                    </button>
                  </div>
                ))
              ) : (
                <p>No photos available</p>
              )}
            </div>
          </>
        )}

        {/* Offers: OfferTile maps over the offer-array filled from the dialog form */}
        <h1 className="text-2xl font-bold mb-2 mt-3">Offers</h1>
        {offers.map((offer, index) => (
          <>
            <OfferTile key={index} offer={offer} />
            <div className="flex justify-end">
              <Button
                variant="destructive"
                onClick={() => handleDeleteOffer(index)}
              >
                Delete
              </Button>
            </div>
          </>
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
