import { useAuth } from '@/provider/AuthProvider'
import { useReadUser } from '@/services/userService'
import { fetchJSON } from '@/services/utils'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from './ui/button'
import { GoBookmarkSlashFill } from 'react-icons/go'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { IGymWithId } from '@models/gym' // Import the type definition

function MarkFavourite({ gym }: { gym: IGymWithId | undefined }) {
  const navigate = useNavigate()
  const gymId = gym?._id || ''

  const { user } = useAuth()
  const { data: userData } = useReadUser(user?._id ?? '')
  const userFavourites = userData?.favourites

  const [isFavourite, setIsFavourite] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    if (user && userFavourites) {
      setIsFavourite(userFavourites.includes(gymId))
    }
  }, [user, gymId, userFavourites])

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
      const response = await fetchJSON(`/users/${user?._id}/favourites/add`, {
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
      const response = await fetchJSON(
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
      {user ? (
        <Button
          variant="ghost"
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
              <GoBookmarkSlashFill className="h-6 w-6" />
            ) : (
              <FaBookmark className="h-6 w-6" />
            )
          ) : (
            <FaRegBookmark className="h-6 w-6" />
          )}
        </Button>
      ) : (
        <>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <FaRegBookmark className="h-6 w-6" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Login to mark this gym as favourite</DialogTitle>
                <DialogDescription>
                  If you want to remember this gym later, you can mark it as
                  favourite. Login to mark this gym as favourite.
                </DialogDescription>
              </DialogHeader>
              <div>
                {' '}
                <Button className="bg-black" onClick={() => navigate('/login')}>
                  Login
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

export { MarkFavourite }
