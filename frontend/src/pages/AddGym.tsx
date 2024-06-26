import React from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { useNavigate } from 'react-router-dom'
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
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import '../styles/AddGym.css'

const simpleUrlRegex =
  /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/

const formSchema = z.object({
  gymname: z.string().min(2).max(50),
  url: z.string().refine((value) => simpleUrlRegex.test(value), {
    message: 'Invalid URL',
  }),
  address: z.string().min(5).max(100),
  highlights: z.string().optional(),
  offers: z.string().optional(),
  specialOffers: z.string().optional(),
})

export function AddGym() {
  const [date, setDate] = React.useState<Date>()
  const navigate = useNavigate()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      gymname: '',
      url: '',
      address: '',
      highlights: '',
      offers: '',
      specialOffers: '',
    },
  })
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      console.log(values)
      const response = await fetch('http://localhost:5000/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: values.gymname,
          websiteLink: values.url,
          address: {
            street: values.address,
            postalCode: '12345', // example; replace
            city: 'Sample City',
            country: 'Sample Country',
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
      <Tabs defaultValue="account" className="">
        <TabsList>
          <TabsTrigger value="account">Key information</TabsTrigger>
          <TabsTrigger value="openingHours">Opening hours</TabsTrigger>
          <TabsTrigger value="offers">Offers</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="gymname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gym name</FormLabel>
                      <FormControl>
                        <Input placeholder="Awesome gym" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is the public display name of your gym.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Awesome street 12" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="highlights"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Highlights</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Select your highlights"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button variant={'outline'} className="mt-4 mr-2">
                    Back
                  </Button>
                  <Button className="mt-4">Next</Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="openingHours">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="offers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Opening hours</FormLabel>
                      <FormControl>
                        <Input placeholder="+" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialOffers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Diverging hours</FormLabel>
                      <FormControl>
                        <Input placeholder="+" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button className="mt-4 mr-2">Back</Button>
                  <Button className="mt-4">Next</Button>{' '}
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>

        <TabsContent value="offers">
          <div className="mt-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField
                  control={form.control}
                  name="offers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Offers</FormLabel>
                      <FormControl>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">+Add Offer</Button>
                          </DialogTrigger>
                          <DialogContent className="">
                            <DialogHeader>
                              <DialogTitle className="flex">
                                Add Offer
                              </DialogTitle>
                              <DialogDescription>
                                Add permanent price offers to your gym page.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <Label htmlFor="minTerm">Minimum term</Label>
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
                              <div>
                                <Label htmlFor="price">Price (€)</Label>
                                <Input id="price" className="w-[100px] ml-5" />
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
                        </Dialog>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialOffers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Offers</FormLabel>
                      <FormControl>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline">
                              +Add Special Offer
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle className="flex">
                                Add special offer
                              </DialogTitle>
                              <DialogDescription>
                                Add temporary price offers to your gym page.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                              <Label htmlFor="minTerm">Minimum term</Label>
                              <div className="grid grid-cols-2">
                                <Input
                                  id="name"
                                  defaultValue="12"
                                  className="w-[100px]"
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
                                <Label htmlFor="price">Price (€)</Label>
                                <Label htmlFor="price">End date</Label>
                                <Input id="price" className="w-[100px]" />
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
                                </Popover>{' '}
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
                        </Dialog>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button className="mt-4 mr-2">Back</Button>
                  <Button className="mt-4" type="submit">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </TabsContent>
      </Tabs>
    </>
  )
}

export default AddGym
