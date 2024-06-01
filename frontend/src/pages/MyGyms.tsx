import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { FaSearch } from 'react-icons/fa'
import { LucidePencil as Pencil } from 'lucide-react'
const MyGyms: React.FC = () => {
  const [gyms, setGyms] = useState([
    'McFit Laim',
    'McFit Neuhausen',
    'McFit Pasing',
  ])

  const handleDeleteGym = (gymToDelete: string) => {
    // Funktion zum Löschen eines Gyms hinzufügen
    setGyms(gyms.filter((gym) => gym !== gymToDelete))
  }

  const handleAddGym = () => {
    // Funktion zum Hinzufügen eines Gyms
    const newGym = `Gym ${gyms.length + 1}`
    setGyms([...gyms, newGym])
  }

  const handleGymClick = (gym: string) => {
    alert(`Gym clicked: ${gym}`)
    // Function einbauen
  }

  return (
    <div style={{ width: '90%', height: '90%' }}>
      <h1
        style={{ fontSize: '2.5rem', marginBottom: '20px', fontWeight: 'bold' }}
      >
        My Gyms
      </h1>
      <div
        style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}
      >
        <Input
          className="bg-gray-400"
          style={{
            width: '100%',
            borderRadius: '8px',
          }}
          placeholder="Search gyms..."
        />
        <Button
          style={{ borderRadius: '8px', marginLeft: '20px' }}
          className="bg-gray-400 w-12 h-12"
        >
          <FaSearch style={{ transform: 'scaleX(-1)', fontSize: '20px' }} />
        </Button>
      </div>

      {gyms.map((gym, index) => (
        <Card key={index} style={{ width: '100%', marginBottom: '10px' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Button onClick={() => handleGymClick(gym)}> {gym} </Button>
            <div>
              <Button>
                <Pencil className="text-xl" />
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
      <Button
        className="bg-gray-400"
        style={{
          width: '100%',
          borderRadius: '8px',
        }}
        onClick={handleAddGym}
      >
        + Add your gym
      </Button>
    </div>
  )
}

export default MyGyms
