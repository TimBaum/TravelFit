import { Highlight } from '@models/gym'
import { StarIcon } from '@radix-ui/react-icons'
import {
  BicepsFlexed,
  Calendar,
  Car,
  Flower,
  PersonStanding,
  Salad,
  ThermometerIcon,
  WavesIcon,
} from 'lucide-react'

function HighlightBadge({ name }: { name: Highlight }) {
  function getIcon() {
    const className = 'w-5 h-5'
    switch (name) {
      case 'Sauna':
        return <ThermometerIcon className={className} />
      case 'Posing room':
        return <BicepsFlexed className={className} />
      case 'Pool':
        return <WavesIcon className={className} />
      case 'Courses':
        return <Calendar className={className} />
      case 'Personal trainings':
        return <PersonStanding className={className} />
      case 'Nutrition bar':
        return <Salad className={className} />
      case 'Outdoor':
        return <Flower className={className} />
      case 'Parking':
        return <Car className={className} />
      default:
        return <StarIcon className={className} />
    }
  }

  return (
    <div className="flex gap-2 items-center px-2 py-1 border rounded">
      {' '}
      {getIcon()} {name}
    </div>
  )
}

export default HighlightBadge
