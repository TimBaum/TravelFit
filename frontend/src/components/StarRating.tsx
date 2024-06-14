import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons'
import React from 'react'

function StarRating({
  filledStars,
  setFilledStars,
}: {
  filledStars: boolean[]
  setFilledStars: (stars: boolean[]) => void
}) {
  const handleStarClick = (index: number) => {
    const newFilledStars = filledStars.map((_, i) => i <= index)
    setFilledStars(newFilledStars)
  }

  return (
    <div className="inline-grid grid-cols-5 gap-2 p-4">
      {filledStars.map((filled, index) => (
        <div
          key={index}
          className="flex justify-center items-center cursor-pointer"
          onClick={() => handleStarClick(index)}
        >
          {filled ? (
            <StarFilledIcon className="text-primary w-8 h-8" />
          ) : (
            <StarIcon className="text-primary w-8 h-8" />
          )}
        </div>
      ))}
    </div>
  )
}

interface DisplayRatingProps {
  rating: number
}

const DisplayRating: React.FC<DisplayRatingProps> = ({ rating }) => {
  const maxStars = 5 // Define the maximum number of stars
  const stars = []

  for (let i = 1; i <= maxStars; i++) {
    if (i <= rating) {
      stars.push(<StarFilledIcon key={i} className="text-primary w-3 h-3" />)
    } else {
      stars.push(<StarIcon key={i} className="text-primary w-3 h-3" />)
    }
  }

  return <div className="inline-grid grid-cols-5 gap-2 p-2">{stars}</div>
}

export { StarRating, DisplayRating }
