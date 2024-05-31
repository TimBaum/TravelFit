import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const MyGyms: React.FC = () => {
  const [gyms, setGyms] = useState(['McFit Laim', 'McFit Neuhausen', 'McFit Pasing']);
  
  const handleDeleteGym = (gymToDelete: string) => { // Funktion zum Löschen eines Gyms hinzufügen
    setGyms(gyms.filter(gym => gym !== gymToDelete));
  };
  
  const handleAddGym = () => { // Funktion zum Hinzufügen eines Gyms
    const newGym = `Gym ${gyms.length + 1}`;
    setGyms([...gyms, newGym]);
  };
  
  const handleGymClick = (gym: string) => {
    alert(`Gym clicked: ${gym}`);
    // Function einbauen
  };
  
 
  return (
    <div style={{width: '90%', height: '90%'}}>
      <h1>My Gyms</h1>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
        <Input placeholder="Search gyms" />
        <Button>Search</Button>
      </div>

      {gyms.map((gym, index) => (
        <Card key={index} style={{ width: '100%', marginBottom: '10px' }}> 
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button onClick={() => handleGymClick(gym)}> {gym} </Button>
            <div>
              <Button >Edit</Button>
              <Button variant="destructive" onClick={() => handleDeleteGym(gym)}>Delete</Button>
            </div>
          </div>
        </Card>
      ))}
      <Card style={{width: '20%'}} className="rounded-xl">
      <Button onClick={handleAddGym} >+ Add your gym</Button>
      </Card>
    </div>
  );
};

export default MyGyms;
