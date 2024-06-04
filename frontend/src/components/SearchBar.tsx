import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'

function SearchBar({
  searchTerm,
  setSearchTerm,
  className,
}: {
  searchTerm: string
  setSearchTerm: (searchTerm: string) => void
  className?: string
}) {
  const navigate = useNavigate()

  return (
    <div className={`flex gap-2 mt-4 ${className}`}>
      <Input
        className="h-14"
        placeholder="Search for your location"
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
      />
      <Button
        className="w-14 h-14"
        size="icon"
        variant={'outline'}
        onClick={() => {
          if (searchTerm) {
            navigate(`/find-gyms?search=${searchTerm}`)
          }
        }}
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}

export default SearchBar
