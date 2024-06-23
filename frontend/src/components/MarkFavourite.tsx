import { useAuth } from '@/provider/AuthProvider'
import { useGetGym } from '@/services/gymService'
import { useReadUser } from '@/services/userService'
import { fetchJSON } from '@/services/utils'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Button } from './ui/button'
import { GoBookmarkSlashFill } from 'react-icons/go'
import { FaBookmark, FaRegBookmark } from 'react-icons/fa'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

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

  function SignUpDialog() {
    return (
      <Dialog>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Login to mark this gym as favourite</DialogTitle>
            <DialogDescription>
              If you want to remember this gym later, you can mark it as
              favourite. For this, you have to login or sign up first!
            </DialogDescription>
          </DialogHeader>
          <div>Content</div>
          <DialogFooter>
            <Button type="submit">Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
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
                  favourite. For this, you have to login or sign up first!
                </DialogDescription>
              </DialogHeader>
              <div>Content</div>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}

export { MarkFavourite }
