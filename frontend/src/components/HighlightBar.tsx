import { Badge } from '@/components/ui/badge'

interface IHighlight {
  highlight: string | undefined
  icon: string
}

interface HighlightProps {
  highlights: IHighlight[]
}

function HighlightBar({ highlights }: HighlightProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mt-4">
      {highlights.map(({ highlight, icon }) => (
        <Badge variant="outline">
          <img src={icon}></img>
          {highlight}
        </Badge>
      ))}
    </div>
  )
}

export default HighlightBar
