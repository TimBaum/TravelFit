import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useDeleteGymAccount } from '@/services/gymAccountService'

/*async function deleteGymAccount(id: string) {
  try {
    const response = await fetch(
      config.BACKEND_URL + '/gymAccounts/delete/' + id,
      {
        method: 'DELETE',
      },
    )

    if (!response.ok) {
      throw new Error('Failed to delete gym account')
    }

    const data = await response.json()
    console.log('Gym account deleted successfully:', data)
  } catch (error) {
    console.error('Error deleting gym account:', error)
  }
}*/

function DeleteGymAccounts() {
  const [inputValue, setInputValue] = useState('')

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value)
  }

  return (
    <>
      <h1 className="mb-2 font-bold text-5xl">Delete gym accounts</h1>
      <div className="container">
        <Input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="gym account id"
        />
        <Button
          type="submit"
          variant="outline"
          className="mt-4 bg-primary"
          onClick={() => useDeleteGymAccount(inputValue)}
        >
          Delete gym account with Id {inputValue}
        </Button>
      </div>
    </>
  )
}

export default DeleteGymAccounts
