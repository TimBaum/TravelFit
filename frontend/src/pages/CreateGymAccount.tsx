import { useState } from 'react'

function CreateGymAccount() {
    const [count, setCount] = useState(0)
  
    return (
      <>
        <h1>You can create a gym account here! :D</h1>
        <div className="card">
          <button onClick={() => setCount((count) => count + 1)}>
            {count} gym accounts created
          </button>
          <p>
            Great to see you here! You can create a gym account by clicking the button above.
          </p>
        </div>
        <p className="great-day">
          I am glad you can see this page. Have a great day!
        </p>
      </>
    )
  }
  
  export default CreateGymAccount
  