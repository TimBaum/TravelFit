import { Badge } from '@/components/ui/badge'
import '../App.css'

interface IHighlight {
  highlight: string | undefined
  icon: string
}

interface HighlightProps {
  highlights: IHighlight[]
}

function HighlightBar({ highlights }: HighlightProps) {
  return (
    <div className="grid grid-cols-6 gap-4 mt-4">
      {highlights.map(({ highlight, icon }) => (
        <Badge variant="outline">
          <img
            style={{ width: '25px', height: '25px', marginRight: '10px' }}
            src={icon}
          ></img>
          {highlight}
        </Badge>
      ))}
    </div>
  )
}

export default HighlightBar
