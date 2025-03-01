import React, { useState } from 'react'
import { IoMdClose } from "react-icons/io";

const AddBookForListing = ({
    onClose
}) => {

    const [data, setData] = useState({
        bookTitle : "",
        bookAuthor : "",
        bookDescription : "",
        bookCondition : "",
        bookCategory : "",
        bookPrice : "",
        bookImage : null
    })

    const handleOnChange = (e) => {}

    return (
        <div className='absolute flex w-full h-full justify-center top-0 items-center bg-slate-100 bg-opacity-60 transition-all'>
            <div className='relative bg-white p-5 rounded-lg w-full max-w-2xl max-h-[90%] shadow-lg overflow-auto'>
                <button className="absolute top-3 right-3 text-gray-600 hover:text-blue-700 transition duration-300" onClick={onClose}>
                    <IoMdClose size={24} />
                </button>

                <h2 className='text-2xl font-semibold text-center mb-4 text-gray-800'>Add Book for Exchange</h2>

                <form className='flex flex-col gap-3'>
                    <div>
                        <label htmlFor='bookTitle' className='block text-gray-700 text-sm font-medium mb-1'>Book Title:</label>  
                        <input 
                            type='text' 
                            placeholder='Enter book title' 
                            id='bookTitle'
                            name = 'bookTitle'
                            value={data.bookTitle} 
                            required 
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        /> 
                    </div>

                    <div>
                        <label htmlFor='bookAuthor' className='block text-gray-700 text-sm font-medium mb-1'>Book Author:</label>
                        <input 
                            type='text' 
                            placeholder='Enter author name' 
                            name='bookAuthor'
                            id='bookAuthor'
                            value={data.bookAuthor} 
                            required 
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='bookDescription' className='block text-gray-700 text-sm font-medium mb-1'>Book Description:</label>
                        <textarea 
                            placeholder='Enter book description'
                            id='bookDescription' 
                            name='bookDescription'
                            value={data.bookDescription}  
                            required 
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='bookCondition' className='block text-gray-700 text-sm font-medium mb-1'>Book Condition:</label>
                        <input 
                            type='text' 
                            id='bookCondition'
                            placeholder='e.g., New, Like New, Good' 
                            name='bookCondition'
                            value={data.bookCondition} 
                            required 
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='bookCategory' className='block text-gray-700 text-sm font-medium mb-1'>Book Category:</label>
                        <input 
                            type='text' 
                            id='bookCategory'
                            placeholder='e.g., Fiction, Non-Fiction' 
                            value={data.bookCategory} 
                            name='bookCategory'
                            required 
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='bookPrice' className='block text-gray-700 text-sm font-medium mb-1'>Book Price:</label>
                        <input 
                            type='number' 
                            id='bookPrice'
                            placeholder='Enter book price' 
                            name='bookPrice'
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            value={data.bookPrice}
                            onChange={handleOnChange}
                        />
                    </div>

                    <div>
                        <label htmlFor='bookImage' className='block text-gray-700 text-sm font-medium mb-1'>Book Image:</label>
                        <input 
                            type='file' 
                            id='bookImage'
                            name='bookImage'
                            value={data.bookImage}
                            className='w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50'
                            onChange={handleOnChange}
                        />
                    </div>

                    <button 
                        type='submit' 
                        className='w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-semibold text-lg'
                    > Submit
                    </button>
                </form>
            </div>
        </div>
    )
}
export default AddBookForListing;
