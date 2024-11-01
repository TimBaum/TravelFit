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
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'

import { StarRating, DisplayRating } from './StarRating'

import { IGymWithIdPopulated } from '@models/gym'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { IReviewPopulated } from '@models/review'
import { useAuth } from '@/provider/AuthProvider'
import { fetchJSON } from '@/services/utils'
import { DialogDescription } from '@radix-ui/react-dialog'

//TODO: show prompt when review is scussessfully created

function AddReviewDialog({ gym }: { gym: IGymWithIdPopulated | undefined }) {
  const [filledStars, setFilledStars] = useState([
    false,
    false,
    false,
    false,
    false,
  ])

  const { user } = useAuth()

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

  function checkIfUserHasReviewed() {
    const reviews = gym?.reviews

    if (reviews) {
      console.log(reviews)
      console.log(user)
      const hasUserReviewed = reviews.some(
        (review) => review.author._id === user?._id,
      )
      return hasUserReviewed
    }

    return false
  }

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    const review = {
      author: user?._id,
      rating: filledStars.filter(Boolean).length,
      text: data.reviewText,
    }

    const hasUserReviewed = checkIfUserHasReviewed()

    if (hasUserReviewed) {
      toast.error('You have already reviewed this gym')
      return
    }

    try {
      const response = await fetchJSON(`/gyms/${gym?._id}/reviews`, {
        method: 'PATCH',
        body: JSON.stringify({ review }),
      })
      toast.success('Review added successfully')
      console.log('Succesfully added review: ', response)
    } catch (error) {
      toast.error('Error adding review')
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
          <DialogTitle>Add review</DialogTitle>
          <DialogDescription>
            {/* Added to get rid of missing description warning */}
            Write a new review for {gym?.name}
          </DialogDescription>
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

function ReviewTile({ review }: { review: IReviewPopulated }) {
  const [showFullText, setShowFullText] = useState(false)
  const maxLength = 100

  const toggleShowFullText = () => {
    setShowFullText(!showFullText)
  }

  if (!review.author) return

  const author = review.author.displayName

  return (
    <div className="flex h-46 w-full rounded relative mb-2">
      <div className="w-full">
        <div className="flex justify-between items-center">
          <h1 className="font-bold">{author}</h1>
          <DisplayRating rating={Number(review.rating)} />
        </div>
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

function ReviewDialog({
  reviews,
}: {
  reviews: IReviewPopulated[] | undefined
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">View more</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto">
        <DialogHeader>
          <DialogTitle>View all reviews</DialogTitle>
          <DialogDescription></DialogDescription>
          {/* Added to get rid of missing description warning */}
        </DialogHeader>

        <div>
          {reviews?.map((review, index) => (
            <ReviewTile key={index} review={review} />
          )) || <p>No reviews available.</p>}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { AddReviewDialog, ReviewTile, ReviewDialog }
