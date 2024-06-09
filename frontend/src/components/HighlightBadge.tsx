import { Highlight } from '@models/gym'
import { StarIcon } from '@radix-ui/react-icons'
import {
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
    switch (name) {
      case 'Sauna':
        return <ThermometerIcon className="w-5 h-5" />
      case 'Posing room':
        return <img src="src/assets/biceps-flexed.svg" className="w-5 h-5" />
      case 'Pool':
        return <WavesIcon className="w-5 h-5" />
      case 'Courses':
        return <Calendar className="w-5 h-5" />
      case 'Personal trainings':
        return <PersonStanding className="w-5 h-5" />
      case 'Nutrition bar':
        return <Salad className="w-5 h-5" />
      case 'Outdoor':
        return <Flower className="w-5 h-5" />
      case 'Parking':
        return <Car className="w-5 h-5" />
      default:
        return <StarIcon className="w-5 h-5" />
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
