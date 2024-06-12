import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { useState } from 'react'

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

  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm)

  const executeSearch = () => {
    if (!internalSearchTerm) {
      return
    }
    setSearchTerm(internalSearchTerm)
    navigate(`/find-gyms?search=${internalSearchTerm}`)
  }

  return (
    <div className={`flex gap-2 mt-4 ${className}`}>
      <Input
        className="h-14"
        placeholder="Search for your location"
        onChange={(e) => setInternalSearchTerm(e.target.value)}
        value={internalSearchTerm}
        onKeyDown={(event) => (event.key === 'Enter' ? executeSearch() : null)}
      />
      <Button
        className="w-14 h-14"
        size="icon"
        variant={'outline'}
        onClick={() => executeSearch()}
      >
        <MagnifyingGlassIcon className="h-6 w-6" />
      </Button>
    </div>
  )
}

export default SearchBar
