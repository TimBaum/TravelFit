import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'

import { IGym } from '@models/gym'

import { useState } from 'react'

import { IReview } from '@models/review'

function AddReviewDialog({ gym }: { gym: IGym | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">Add review</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Write a new review for {gym?.name}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Rating
            </Label>
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Text
            </Label>
            <Input className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Submit</Button>
        </DialogFooter>
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

function ReviewDialog({ reviews }: { reviews: [IReview] | undefined }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">view more</Button>
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
