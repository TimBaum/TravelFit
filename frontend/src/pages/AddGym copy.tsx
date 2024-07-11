/*
import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'

import { Switch } from '@/components/ui/switch'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const formSchema = z.object({
  openingHours: z.array(
    z
      .object({
        weekday: z.coerce.number().min(0).max(6).optional(), //0 = Sunday, 6 = Saturday
        //open: z.boolean(),
        openingTime: z.string(),
        closingTime: z.string(),
      })
      .optional(),
  ),
})

export function AddGym() {
  //state for the "next"/"back" buttons for switching tabs
  // State for the special offer checkbox
  const weekdays = [
    'Sunday',
    'Monday',
    // 'Tuesday',
    // 'Wednesday',
    // 'Thursday',
    // 'Friday',
    // 'Saturday',
  ]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openingHours: Array(7).fill({
        weekday: null,
        openingTime: '',
        closingTime: '',
      }),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
          <div className="grid grid-cols-7">
            {weekdays.map((day) => (
              <div key={day} className="day-row">
                <FormField
                  control={form.control}
                  name={`openingHours.${weekdays.indexOf(day)}.weekday`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{day}: open</FormLabel>
                      <FormControl>
                        <Switch
                          checked={isOpen}
                          // onCheckedChange={(checked) => field.onChange(checked)}
                          onCheckedChange={() => {
                            setIsOpen(!isOpen)
                            field.onChange(day)
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isOpen && (
                  <>
                    <FormField
                      control={form.control}
                      name={`openingHours.${weekdays.indexOf(day)}.openingTime`}
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
                      name={`openingHours.${weekdays.indexOf(day)}.closingTime`}
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
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  )
}

export default AddGym
*/

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Button } from '@/components/ui/button'

const formSchema = z.object({
  openingHours: z.array(
    z
      .object({
        weekday: z.coerce.number().min(0).max(6).optional(), //0 = Sunday, 6 = Saturday
        //open: z.boolean(),
        openingTime: z.string(),
        closingTime: z.string(),
      })
      .optional(),
  ),
})
const weekdays = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
]
export function AddGym() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      openingHours: Array(7).fill({
        weekday: null,
        openingTime: '',
        closingTime: '',
      }),
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
          {/* <div className="grid grid-cols-7">
            {weekdays.map((day, index) => (
             // <DayRow key={day} day={day} index={index} />
            ))}
          </div> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </>
  )
}
// const DayRow = ({ day, index }: { day: string; index: number }) => {
//   const [isOpen, setIsOpen] = React.useState(false)

//   return (
//     <div className="day-row">
//       <Form {...form}>
//         <form onSubmit={handleSubmit(onSubmit)}>
//           <FormField
//             control={form.control}
//             name={`openingHours.${index}.weekday`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>{day}: open</FormLabel>
//                 <FormControl>
//                   <Switch
//                     checked={isOpen}
//                     onCheckedChange={(checked) => {
//                       setIsOpen(checked)
//                       field.onChange(checked)
//                     }}
//                   />
//                 </FormControl>
//                 {isOpen && (
//                   <>
//                     <FormField
//                       control={form.control}
//                       name={`openingHours.${index}.openingTime`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Opening Time</FormLabel>
//                           <FormControl>
//                             <input type="time" {...field} />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                     <FormField
//                       control={form.control}
//                       name={`openingHours.${index}.closingTime`}
//                       render={({ field }) => (
//                         <FormItem>
//                           <FormLabel>Closing Time</FormLabel>
//                           <FormControl>
//                             <input type="time" {...field} />
//                           </FormControl>
//                         </FormItem>
//                       )}
//                     />
//                   </>
//                 )}
//               </FormItem>
//             )}
//           />
//         </form>
//       </Form>
//     </div>
//   )
// }

export default AddGym
