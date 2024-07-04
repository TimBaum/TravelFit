/* Imports */
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { config } from '@/config'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
// import { useDropzone } from 'react-dropzone'
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Calendar as CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

// import { IOffer } from '../../../models/offer'

/* Form checks */
const simpleUrlRegex =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const formSchema = z.object({
  gymname: z
    .string()
    .min(2, { message: 'Invalid name' })
    .max(50, { message: 'Invalid name' }),
  url: z.string().refine((value) => simpleUrlRegex.test(value), {
    message: 'Invalid URL',
  }),
  street: z
    .string()
    .min(2, { message: 'Invalid street' })
    .max(100, { message: 'Invalid street' }),
  postalCode: z
    .string()
    .regex(/^\d+$/, { message: 'Please enter a number' })
    .min(2, { message: 'Invalid code' })
    .max(20, { message: 'Invalid code' }),
  city: z
    .string()
    .min(2, { message: 'Invalid city' })
    .max(50, { message: 'Invalid city' }),
  country: z
    .string()
    .min(2, { message: 'Invalid country' })
    .max(50, { message: 'Invalid country' }),
  highlights: z.array(z.string()).optional(),
  openingHours: z.string().optional(),
  offers: z.string().optional(),
  specialOffers: z.string().optional(),
})

/* Highlights options */
const highlightOptions = [
  'Sauna',
  'Posing room',
  'Pool',
  'Courses',
  'Personal trainings',
  'Nutrition bar',
  'Outdoor',
  'Parking',
]

/* Component */
export function AddGym() {
  //state for the "next"/"back" buttons for switching tabs
  const [currentTab, setCurrentTab] = React.useState('keyInfo')
  // State for the special offer checkbox
  const [isSpecialOffer, setIsSpecialOffer] = React.useState(false)
  const [date, setDate] = React.useState<Date>()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymname: '',
      url: '',
      street: '',
      postalCode: '',
      city: '',
      country: 'Germany',
      highlights: [],
      openingHours: '',
      offers: '',
      specialOffers: '',
    },
  })

  /* Form submission */
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      const response = await fetch(config.BACKEND_URL + '/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.gymname,
          websiteLink: values.url,
          address: {
            street: values.street,
            postalCode: values.postalCode,
            city: values.city,
            country: values.country,
            // TODO: lookup lat and lng
            latitude: 40.7128,
            longitude: -74.006,
          },
        }),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const data = await response.json()
      console.log('Gym added:', data)
      navigate('/my-gyms')
    } catch (error) {
      console.error('Error adding gym:', error)
    }
  }

  /* Render */
  return (
    <>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-gyms">My Gyms</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/add-gym">Add Gym</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div>
        <h1 className="text-5xl font-bold mb-2">Add Gym</h1>
      </div>

      {/* The three tabs "Key Information", "Opening Hours", "Offers". Contains all page content */}

      <Tabs
        defaultValue={currentTab}
        value={currentTab}
        onValueChange={setCurrentTab}
      >
        <TabsList>
          <TabsTrigger value="keyInfo">Key information</TabsTrigger>
          <TabsTrigger value="openingHours">Opening hours</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
          <TabsTrigger value="photos">Photos</TabsTrigger>
        </TabsList>

        {/* Tab one: Gym name, URL, Street+Number, Postal Code, City, Country, Highlights */}

        <TabsContent value="keyInfo">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="gymname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gym name *</FormLabel>
                      <FormControl>
                        <Input placeholder="Awesome gym" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the publicly displayed name of your gym.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="https://awesome-gym.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="street"
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
                </div>
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="postalCode"
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
                </div>
                <FormField
                  control={form.control}
                  name="city"
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
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="country"
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
                /** TODO: fix highlights */
                <div className="mt-3">
                  <FormField
                    control={form.control}
                    name="highlights"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Highlights</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange(value)}
                            defaultValue=""
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="+ Add highlight" />
                            </SelectTrigger>
                            <SelectContent>
                              {highlightOptions.map((highlight) => (
                                <SelectItem key={highlight} value={highlight}>
                                  {highlight}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex justify-end">
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setCurrentTab('openingHours')
                    }}
                  >
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* Tab two: opening hours */}

        <TabsContent value="openingHours">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="openingHours"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening hours *</FormLabel>
                      <FormControl>
                        <Input placeholder="+" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    className="mt-4 mr-2"
                    onClick={() => {
                      setCurrentTab('keyInfo')
                    }}
                  >
                    Back
                  </Button>
                  <Button
                    className="mt-4"
                    onClick={() => {
                      setCurrentTab('offers')
                    }}
                  >
                    Next
                  </Button>{' '}
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* Tab three: Offers, Special Offers */}

        <TabsContent value="offers">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="offers"
                  render={() => (
                    <FormItem>
                      <FormLabel>Offers</FormLabel>
                      <FormControl>
                        <Dialog>
                          <DialogTrigger asChild>
                            <div className="grid gap-4 w-[100px]">
                              <Button variant="outline">+Add Offer</Button>
                            </div>
                          </DialogTrigger>

                          {/* Popup window for adding Offers*/}

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
                                  <SelectItem value="Days">
                                    Subscription{' '}
                                  </SelectItem>
                                  <SelectItem value="Weeks">OneTime</SelectItem>
                                  <SelectItem value="Months">
                                    FreeTrial
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-4">
                              <Label>Minimum term</Label>
                              <div className="grid grid-cols-2">
                                <Input
                                  id="name"
                                  defaultValue="12"
                                  className="w-[100px] ml-5"
                                />
                                <Select>
                                  <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Months" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Days">Days</SelectItem>
                                    <SelectItem value="Weeks">Weeks</SelectItem>
                                    <SelectItem value="Months">
                                      Months
                                    </SelectItem>
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
                                    <SelectItem value="Weekly">
                                      weekly
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                      monthly
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                      yearly
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="grid grid-cols-2">
                                <Label htmlFor="specialCheck">
                                  Special (limited) offer?
                                </Label>
                                <Label>End date</Label>
                                <Checkbox
                                  onChange={() => {
                                    if (isSpecialOffer) {
                                      setIsSpecialOffer(!isSpecialOffer)
                                    } else {
                                      setIsSpecialOffer(isSpecialOffer)
                                    }
                                  }}
                                  className="ml-5 mt-4"
                                />

                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      disabled={isSpecialOffer}
                                      variant={'outline'}
                                      className={cn(
                                        ' justify-start text-left font-normal',
                                        !date && 'text-muted-foreground',
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {date ? (
                                        format(date, 'PPP')
                                      ) : (
                                        <span>Pick a date</span>
                                      )}
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

                              {/* description field */}

                              <div>
                                <Label htmlFor="minTerm">Description</Label>
                                <Textarea placeholder="Type your offer description here." />
                              </div>
                            </div>
                            <DialogFooter>
                              <Button type="submit">Save changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button
                    className="mt-4 mr-2"
                    onClick={() => {
                      setCurrentTab('openingHours')
                    }}
                  >
                    Back
                  </Button>
                  <Button className="mt-4" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        {/* Tab four: photos */}

        <TabsContent value="photos">
          <Basic />
        </TabsContent>
      </Tabs>
    </>
  )

  function Basic() {
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()

    const files = acceptedFiles.map((file) => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
    ))

    return (
      <section className="container">
        <div {...getRootProps({ className: 'dropzone' })}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
        </div>
        <aside>
          <h4>Files</h4>
          <ul>{files}</ul>
        </aside>
      </section>
    )
  }
}

export default AddGym

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