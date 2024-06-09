import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

// This page will be implemented later on when the login functionality has been implemented.

async function updateUserAccount(id: string, userData: string) {
  try {
    const response = await fetch(config.BACKEND_URL + '/users/update/' + id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })

    if (!response.ok) {
      throw new Error('Failed to update user')
    }

    const data = await response.json()
    console.log('User updated successfully:', data)
  } catch (error) {
    console.error('Error updating user:', error)
  }
}

function ManageUserAccount() {
  const [newName, setInputValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <>
      <h1 className="centered-headline">Manage your user account</h1>
      <div className="container">
        <Input
          type="text"
          value={newName}
          onChange={handleInputChange}
          placeholder="name"
        />
        <Button
          type="submit"
          variant="outline"
          className="mt-4 bg-primary"
          onClick={() =>
            updateUserAccount('TODO: get id of this account', newName)
          }
        >
          Update
        </Button>
      </div>
    </>
  )
}

export default ManageUserAccount
