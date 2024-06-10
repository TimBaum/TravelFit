import { StarIcon, StarFilledIcon } from '@radix-ui/react-icons'

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
            <StarFilledIcon className="w-8 h-8" />
          ) : (
            <StarIcon className="w-8 h-8" />
          )}
        </div>
      ))}
    </div>
  )
}

export default StarRating
