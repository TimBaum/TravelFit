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
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  websiteLink: z.string().min(1).max(255),
  openingHours: z.array(
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
          path: ['closingTime'], // Pfad zur Fehlermeldung
        },
      ),
  ),
})

export function AddGym() {
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      websiteLink: '',
      openingHours: Array(7).fill({
        weekday: null,
        openingTime: '',
        closingTime: '',
      }),
    },
  })
  const watch = form.watch //watch is a function that returns the value of the fields being watched

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    const filteredData = values.openingHours.filter(
      (day) => day?.weekday !== null, //checks if the day is selected and if not, excludes the day from the array
    )
    console.log(filteredData)
  }

  const [isOpen, setIsOpen] = React.useState(Array(7).fill(false))
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Bla</FormLabel>
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
          <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
          <div className="grid grid-cols-7">
            {weekdays.map((day, index) => (
              <div key={day} className="day-row">
                <FormField
                  control={form.control}
                  name={`openingHours.${index}.weekday`}
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
                                `openingHours.${index}.weekday`,
                                null,
                              ), // Setze weekday auf null
                                form.setValue(
                                  `openingHours.${index}.openingTime`,
                                  'dudud',
                                ),
                                form.setValue(
                                  `openingHours.${index}.closingTime`,
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
                {watch(`openingHours.${index}.weekday`) !== null && (
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
                      name={`openingHours.${index}.closingTime`}
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
