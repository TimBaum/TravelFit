import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { FaSearch } from 'react-icons/fa'
import { LucidePencil as Pencil } from 'lucide-react'
import '../styles/MyGyms.css'
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
import { IGymWithId } from '@models/gym'

import NoGyms from '@/assets/NoGyms.svg'

const MyGyms: React.FC = () => {
  const [gyms, setGyms] = useState<IGymWithId[]>([])

  const navigate = useNavigate()

  const handleDeleteGym = async (gymToDelete: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${gymToDelete}?`,
    )
    if (!confirmed) return
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
      {gyms.length < 1 && (
        <div className="svg-container">
          <img src={NoGyms} alt="No Gyms Available" />
        </div>
      )}
      <h1 className="title">My Gyms</h1>
      <input type="text" placeholder="Filter..." />
      <Button className="search-button">
        <FaSearch style={{ transform: 'scaleX(-1)', fontSize: '20px' }} />
      </Button>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Gym name</TableHead>
            <TableHead>Reviews</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gyms.map((gym) => (
            <TableRow key={gym._id}>
              <TableCell>{gym.name}</TableCell>
              <TableCell>{gym.averageRating?.toString() ?? '?'}/5</TableCell>
              <TableCell>
                <div>
                  <Button>View</Button>
                  <Button onClick={() => navigate('/gyms/')}>
                    <Pencil />
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteGym(gym._id)}
                  >
                    Delete
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Button onClick={() => navigate('/add-gym')}>+ Add a Gym</Button>
    </>
  )
}

export default MyGyms
