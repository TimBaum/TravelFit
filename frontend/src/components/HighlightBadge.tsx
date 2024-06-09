import { Highlight } from '@models/gym'
import { ThermometerIcon, WavesIcon } from 'lucide-react'

function HighlightBadge({ name }: { name: Highlight }) {
  function getIcon() {
    switch (name) {
      case 'Sauna':
        return <ThermometerIcon className="w-5 h-5" />
      case 'Posing room':
        return <img src="src/assets/biceps-flexed.svg" className="w-5 h-5" />
      case 'Pool':
        return <WavesIcon className="w-5 h-5" />
      default:
        return null
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
