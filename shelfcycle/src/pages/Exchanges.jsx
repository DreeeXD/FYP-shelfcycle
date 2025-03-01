import React, { useState } from 'react'
import AddBookForListing from '../components/AddBookForListing'

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false)

  return (
    <div className='min-h-screen'>
      <div className='px-4 py-2 bg-blue-50 flex justify-between items-center'>
        <h1 className='font-semibold text-lg'>Exchanges</h1>
        <button className='border-2 py-2 px-4 rounded-md bg-blue-400 hover:bg-blue-600 hover:text-white transition-all' onClick={()=> setOpenAddBookListing(true)}>Add a book</button>
      </div>

      {/*Adding book component */}
      {
        openAddBookListing && (

          <AddBookForListing onClose = {()=>setOpenAddBookListing(false)}/>
        )

      }

    </div>
  )
}

export default Exchanges