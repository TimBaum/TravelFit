import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/components/ui/use-toast'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { StarRating, DisplayRating } from './StarRating'

import { IGymWithId } from '@models/gym'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { IReview } from '@models/review'

import { config } from '@/config'
import { useAuth } from '@/provider/AuthProvider'

function AddReviewDialog({ gym }: { gym: IGymWithId | undefined }) {
  const [filledStars, setFilledStars] = useState([
    false,
    false,
    false,
    false,
    false,
  ])

  const { user, login } = useAuth()

  const FormSchema = z.object({
    reviewText: z
      .string()
      .min(10, {
        message: 'Write at least 10 characters.',
      })
      .max(160, {
        message: 'Review must not be longer than 30 characters.',
      }),
  })
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const author = user?._id
    const rating = filledStars.filter(Boolean).length
    const reviewText = data.reviewText
    const body = `{"review": {"author" : "${author}", "rating":${rating}, "text": "${reviewText}" }}`

    console.log(body)

    try {
      const response = await fetch(
        `${config.BACKEND_URL}/gyms/${gym?._id}/reviews`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ body }), // Pass the review data in the body
        },
      )

      if (!response.ok) {
        throw new Error('Failed to patch gym with new review')
      }

      const data = await response.json()
      console.log('Succesfully added review: ', data)
    } catch (error) {
      console.error('Error adding new review: ', error)
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Add review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a new review for {gym?.name}</DialogTitle>
        </DialogHeader>
        <div>
          <StarRating
            filledStars={filledStars}
            setFilledStars={setFilledStars}
          />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className=" space-y-6">
              <FormField
                control={form.control}
                name="reviewText"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="What do you think about this gym?"
                        className="resize-none"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

function ReviewTile({ review }: { review: IReview }) {
  const [showFullText, setShowFullText] = useState(false)
  const maxLength = 100

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }
  return (
    <div className="flex h-46 w-full rounded p-2 relative m-2">
      <div>
        <DisplayRating rating={Number(review.rating)} />
        {showFullText || review.text.length <= maxLength
          ? review.text
          : `${review.text.substring(0, maxLength)}...`}
        {review.text.length > maxLength && (
          <button onClick={toggleShowFullText} className="ml-2 text-blue-500">
            {showFullText ? 'show less' : 'read more'}
          </button>
        )}
        <Separator className="mt-2" />
      </div>
    </div>
  )
}

function ReviewDialog({ reviews }: { reviews: IReview[] | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">View more</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>View all reviews</DialogTitle>
        </DialogHeader>

        <div>
          {reviews?.map((review) => <ReviewTile review={review} />) || (
            <p>No reviews available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AddReviewDialog, ReviewTile, ReviewDialog }
