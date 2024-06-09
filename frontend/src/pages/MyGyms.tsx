import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FaSearch } from 'react-icons/fa'
import { LucidePencil as Pencil } from 'lucide-react'
import '../styles/MyGyms.css'

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'

const MyGyms: React.FC = () => {
  const [gyms, setGyms] = useState([
    'McFit Laim',
    'McFit Neuhausen',
    'McFit Pasing',
  ])

  const handleDeleteGym = (gymToDelete: string) => {
    // Funktion zum Löschen eines Gyms hinzufügen
    alert(`Are you sure you want to delete ${gymToDelete}?`)
    setGyms(gyms.filter((gym) => gym !== gymToDelete))
  }

  const handleAddGym = async () => {
    try {
      // API-Aufruf zum Hinzufügen eines neuen Gyms
      const response = await fetch('http://localhost:5000/gyms/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `Gym ${gyms.length + 1}`, // example; replace
          websiteLink: 'http://example.com', //example; replace
          address: {
            street: '123 Main St',
            postalCode: '12345',
            city: 'Sample City',
            country: 'Sample Country',
            latitude: 40.7128,
            longitude: -74.0060
          } // example; replace
        }),
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const newGym = data.gym._id; // Annahme, dass das Gym-Objekt eine _id hat
      setGyms([...gyms, newGym]);
      //** Save: Alte Funktion zum Hinzufügen eines Gyms
      //const newGym = `Gym ${gyms.length + 1}`
      //setGyms([...gyms, newGym])
    } catch (error) {
      console.error('Error adding gym:', error);
    }
  }

  const handleGymClick = (gym: string) => {
    alert(`Gym clicked: ${gym}`)
    // Function einbauen
  }

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
      <div className="container">
        <h1 className="title">My Gyms</h1>
        <div className="search-bar">
          <Input className="input" placeholder="Search gyms..." />
          <Button className="search-button">
            <FaSearch style={{ transform: 'scaleX(-1)', fontSize: '20px' }} />
          </Button>
        </div>

        {gyms.map((gym, index) => (
          <Card key={index} className="card">
            <div className="card-content">
              <Button onClick={() => handleGymClick(gym)}> {gym} </Button>
              <div>
                <Button>
                  <Pencil />
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDeleteGym(gym)}
                >
                  Delete
                </Button>
              </div>
            </div>
          </Card>
        ))}
        <Button className="add-gym-button" onClick={handleAddGym}>
          + Add your gym
        </Button>
      </div>
    </>
  )
}

export default MyGyms
