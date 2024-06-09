import { Button } from '@/components/ui/button'
import { config } from '@/config'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

async function deleteUser(id: string) {
  try {
    const response = await fetch(config.BACKEND_URL + '/users/delete/' + id, {
      method: 'DELETE',
    })

    if (!response.ok) {
      throw new Error('Failed to delete user')
    }

    const data = await response.json()
    console.log('User deleted successfully:', data)
  } catch (error) {
    console.error('Error deleting user:', error)
  }
}

function DeleteUserAccounts() {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <>
      <h1 className="centered-headline">Delete user accounts</h1>
      <div className="container">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="user id"
        />
        <Button
          type="submit"
          variant="outline"
          className="mt-4 bg-primary"
          onClick={() => deleteUser(inputValue)}
        >
          Delete User with Id {inputValue}
        </Button>
      </div>
    </>
  )
}

export default DeleteUserAccounts
