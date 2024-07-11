// import React from 'react'
// import { zodResolver } from '@hookform/resolvers/zod'
// import { z } from 'zod'
// import { useForm } from 'react-hook-form'
// import { Button } from '@/components/ui/button'

// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from '@/components/ui/form'
// import { Input } from '@/components/ui/input'

// const formSchema = z.object({
//   test: z.string(),
// })

// export function AddGym() {
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       test: '',
//     },
//   })

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     console.log(values)
//   }
//   return (
//     <>
//       <Form {...form}>
//         <form onSubmit={form.handleSubmit(onSubmit)}>
//           <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
//           <FormField
//             control={form.control}
//             name="test"
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Offer Title</FormLabel>
//                 <FormControl>
//                   <Input {...field} />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <div className="grid grid-cols-7"></div>
//           <Button className="mt-4" type="submit">
//             Submit
//           </Button>
//         </form>
//       </Form>
//     </>
//   )
// }

// export default AddGym

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'

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

const formSchema = z.object({
  test: z.string(),
})

export function AddGym() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      test: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
  }
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormLabel className="text-2xl font-bold">Opening Times</FormLabel>
          <FormField
            control={form.control}
            name="test"
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
          <div className="grid grid-cols-7"></div>
          <Button className="mt-4" type="submit">
            Submit
          </Button>
        </form>
      </Form>
    </>
  )
}

export default AddGym
