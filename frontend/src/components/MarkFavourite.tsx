import { useAuth } from '@/provider/AuthProvider'
import { useGetGym } from '@/services/gymService'
import { useReadUser } from '@/services/userService'
import { fetchJSON } from '@/services/utils'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { GoBookmarkSlashFill } from 'react-icons/go'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'

function MarkFavourite() {
  const { id } = useParams()

  const { data, error, loading } = useGetGym(id || '')
  const gymId = data?._id || ''

  const { user } = useAuth()
  const userFavourites = useReadUser(user?._id ?? '').data?.favourites

  const [isFavourite, setIsFavourite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (user && userFavourites) {
      setIsFavourite(userFavourites.includes(gymId))
    }
  }, [user, gymId])

  const handleMouseEnter = () => {
    if (isFavourite) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (isFavourite) {
      setIsHovered(false)
    }
  }

  async function addFavourite() {
    try {
      const response = fetchJSON(`/users/${user?._id}/favourites/add`, {
        method: 'PATCH',
        body: JSON.stringify({ gymId }),
      })
      await response
      window.location.reload()
    } catch (error) {
      console.error('Error adding favourite: ', error)
    }
  }

  async function deleteFavourite() {
    try {
      const response = fetchJSON(
        `/users/${user?._id}/favourites/delete/${gymId}`,
        {
          method: 'PATCH',
        },
      )
      await response
      window.location.reload()
      console.log('Successfully deleted favourite: ', response)
    } catch (error) {
      console.error('Error deleting favourite: ', error)
    }
  }

  return (
    <div>
      <Button
        variant="outline"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={async () => {
          if (isFavourite) {
            await deleteFavourite()
          } else {
            await addFavourite()
          }
        }}
      >
        {isFavourite ? (
          isHovered ? (
            <GoBookmarkSlashFill className="mr-2 h-4 w-4" />
          ) : (
            <FaBookmark className="mr-2 h-4 w-4" />
          )
        ) : (
          <FaRegBookmark className="mr-2 h-4 w-4" />
        )}
        Mark as favourite
      </Button>
    </div>
  )
}

export { MarkFavourite }
