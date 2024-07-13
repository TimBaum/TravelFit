import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { LucidePencil as Pencil } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { IGymWithId } from '@models/gym'
import NoGyms from '@/assets/illustrations/NoGyms.svg'
import { Input } from '@/components/ui/input'

const MyGyms: React.FC = () => {
  const [gyms, setGyms] = useState<IGymWithId[]>([])
  const [searchQuery, setSearchQuery] = useState<string>('')

  const navigate = useNavigate()

  const handleDeleteGym = async (gymToDelete: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/gyms/${gymToDelete}`,
        {
          method: 'DELETE',
        },
      )

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      setGyms(gyms.filter((gym) => gym._id !== gymToDelete))
    } catch (error) {
      console.error('Error deleting gym:', error)
    }
  }
  useEffect(() => {
    // Abrufen der Gyms vom Backend
    fetch('http://localhost:5000/gyms/get')
      .then((response) => response.json())
      .then((data) => {
        console.log(data) //  Struktur der Daten überprüfen
        setGyms(data.gyms)
      })
      .catch((error) => console.error('Error fetching gyms:', error))
  }, [])

  const filteredGyms = gyms.filter((gym) =>
    gym.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <>
      <div className="breadcrumps">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/my-gyms">My Gyms</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <h1 className="text-5xl font-bold mb-2">My Gyms</h1>

      {gyms.length === 0 ? (
        <div className="no-gyms-container flex flex-col justify-center text-center">
          <img
            src={NoGyms}
            alt="No Gyms Available"
            className="w-2/5 mx-auto mb-6"
          />
          <p className="text-2xl">Nothing here yet.</p>
          <Button
            className="mx-auto mt-3"
            onClick={() => navigate('/create-gym')}
          >
            + Add your first gym
          </Button>
        </div>
      ) : (
        <>
          <div className={`mt-4`}>
            <Input
              className="h-10"
              type="text"
              placeholder="Filter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Gym name</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGyms.map((gym) => (
                <TableRow key={gym._id}>
                  <TableCell>{gym.name}</TableCell>
                  <TableCell>
                    {gym.averageRating?.toString() ?? '?'}/5
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-end items-center gap-2">
                      <Button
                        className="px-2.5"
                        onClick={() =>
                          navigate(`/gyms/${gym._id}`, {
                            state: { from: '/my-gyms' },
                          })
                        }
                      >
                        View
                      </Button>
                      <Button
                        className="px-2.5"
                        onClick={() => navigate(`/edit-gym/${gym._id}`)}
                      >
                        <Pencil className="h-5 w-6" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="px-2.5" variant="destructive">
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete that gym?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete the gym and remove your data
                              from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDeleteGym(gym._id)}
                            >
                              Continue
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Button onClick={() => navigate('/create-gym')}>+ Add a Gym</Button>
        </>
      )}
    </>
  )
}

export default MyGyms
