import React, { useEffect, useState } from 'react'
import AddBookForListing from '../components/AddBookForListing'
import SummaryAPI from '../common'

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false)

  const [allBooks, setAllBooks] = useState([])

  const fetchAllBooks = async() => {
    const response = await fetch(SummaryAPI.getBooks.url)
    const dataResponse = await response.json()

    setAllBooks(dataResponse?.data || [])

  }

  useEffect(() => {
    fetchAllBooks()
  },[])


  return (
    <div className='min-h-screen'>
      <div className='px-4 py-2 bg-blue-50 flex justify-between items-center'>
        <h1 className='font-semibold text-lg'>Exchanges</h1>
        <button className='border-2 py-2 px-4 rounded-md bg-blue-400 hover:bg-blue-600 hover:text-white transition-all' onClick={()=> setOpenAddBookListing(true)}>Add a book</button>
      </div>


      {/*All books for display */}
      <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {allBooks.map((book, index) => (
          <div
            key={index}
            className="border p-4 rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
          >
            {/* Book Image */}
            <img
              src={book?.bookImage[0]}
              alt="Book"
              className="w-32 h-40 object-cover rounded-md mx-auto"
            />

            {/* Book Details */}
            <div className="mt-3 text-center">
              <h2 className="font-semibold text-lg text-gray-800">{book.title}</h2>
              <p className="text-sm text-gray-600">By {book.author}</p>
              <p className="text-xs text-gray-500 mt-2">{book.description}</p>
            </div>
          </div>
        ))}
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