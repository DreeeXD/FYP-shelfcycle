import React, { useEffect, useState } from 'react';
import AddBookForListing from '../components/AddBookForListing';
import SummaryAPI from '../common';
import { RiEditBoxLine } from "react-icons/ri";
import EditBook from '../components/EditBook';
import { data } from 'react-router-dom';

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false);
  const [allBooks, setAllBooks] = useState([]);

  const [editBook, setEditBook] = useState(false);

  const fetchAllBooks = async () => {
    const response = await fetch(SummaryAPI.getBooks.url);
    const dataResponse = await response.json();
    setAllBooks(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      {/* Header Section */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white flex justify-between items-center shadow-md">
        <h1 className="font-bold text-xl">📚 Book Exchange</h1>
        <button
          className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow-md transition-all hover:bg-blue-600 hover:text-white"
          onClick={() => setOpenAddBookListing(true)}
        >
          + Add a Book
        </button>
      </div>

      {/* Books Grid using Flexbox */}
      <div className="p-6 flex flex-wrap justify-center gap-8">
        {allBooks.map((book, index) => (
          <div
            key={index}
            className="relative w-64 h-80 flex flex-col bg-white rounded-lg shadow-md hover:shadow-xl transition-all border border-gray-300 p-4"
          >
            {/* Book Image Section */}
            <div className="w-full flex justify-center">
              <img
                src={book?.bookImage[0]}
                alt="Book"
                className="w-40 h-52 object-cover rounded-lg shadow-md"
              />
            </div>

            {/* Book Details */}
            <div className="mt-6 px-2">
              <h2 className="font-semibold text-md text-gray-900 truncate">{book.bookTitle}</h2>
              <p className="text-sm text-gray-600">By {book.bookAuthor}</p>
            </div>

            {/* Floating Edit Button at Bottom Right */}
            <div className="absolute bottom-6 right-3 bg-blue-600 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-700 transition-all" onClick={() => setEditBook(true)}>
              <RiEditBoxLine size={18} />
            </div>

          </div>
        ))}
      </div>
      {
        editBook && (
          <EditBook bookData={data} onClose={() => setEditBook(false)}/>
        )
      }
        


      {/* Adding Book Component */}
      {openAddBookListing && (
        <AddBookForListing onClose={() => setOpenAddBookListing(false)} />
      )}
    </div>
  );
};

export default Exchanges;
