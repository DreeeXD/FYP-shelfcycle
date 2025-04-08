import React, { useEffect, useState } from 'react';
import AddBookForListing from '../components/AddBookForListing';
import EditBook from '../components/EditBook';
import SummaryAPI from '../common';
import PropTypes from 'prop-types';
import { RiEditBoxLine } from "react-icons/ri";

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [allBooks, setAllBooks] = useState([]);
  const [isBookAdded, setIsBookAdded] = useState(false);

  const fetchAllBooks = async () => {
    const response = await fetch(SummaryAPI.getBooks.url);
    const dataResponse = await response.json();
    setAllBooks(dataResponse?.data || []);
  };

  useEffect(() => {
    fetchAllBooks();
  }, [isBookAdded]);

  const handleBookAdded = () => {
    setIsBookAdded(!isBookAdded);
    setOpenAddBookListing(false);
    setEditModalOpen(false);
  };

  const handleEditBook = (book) => {
    setSelectedBook(book);
    setEditModalOpen(true);
  };

  const exchangeBooks = allBooks.filter(book => book.bookType === 'exchange');
  const saleBooks = allBooks.filter(book => book.bookType === 'sell');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">

      {/* Header */}
      <div className="px-6 py-5 bg-gradient-to-r from-blue-500 to-indigo-600 text-white flex justify-between items-center shadow-lg">
        <h1 className="font-bold text-2xl tracking-wide">Book Exchange Platform</h1>
        <button
          className="bg-white text-blue-700 font-semibold py-2 px-5 rounded-lg shadow-md hover:bg-blue-700 hover:text-white transition duration-300"
          onClick={() => setOpenAddBookListing(true)}
        >
          + Add Book
        </button>
      </div>

      {/* Exchange Section */}
      <section className="px-6 py-6 bg-white shadow-inner rounded-md my-6 mx-4 md:mx-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available for Exchange</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {exchangeBooks.length > 0 ? (
            exchangeBooks.map((book, index) => (
              <BookCard key={index} book={book} onEdit={() => handleEditBook(book)} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No books for exchange at the moment.</p>
          )}
        </div>
      </section>

      {/* Sale Section */}
      <section className="px-6 py-6 bg-white shadow-inner rounded-md my-6 mx-4 md:mx-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Available for Sale</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {saleBooks.length > 0 ? (
            saleBooks.map((book, index) => (
              <BookCard key={index} book={book} onEdit={() => handleEditBook(book)} />
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">No books for sale at the moment.</p>
          )}
        </div>
      </section>

      {/* ✅ Add Book Modal */}
      {openAddBookListing && (
        <AddBookForListing
          onClose={() => setOpenAddBookListing(false)}
          onBookAdded={handleBookAdded}
        />
      )}

      {/* ✅ Edit Book Modal */}
      {editModalOpen && selectedBook && (
        <EditBook
          onClose={() => setEditModalOpen(false)}
          bookData={selectedBook}
          onBookUpdated={handleBookAdded}
        />
      )}
    </div>
  );
};

// BookCard Component
const BookCard = ({ book, onEdit }) => {
  return (
    <div className="relative w-72 h-auto flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 p-4 hover:scale-[1.02] duration-300 ease-in-out">
      {/* Edit Icon */}
      <div
        className="absolute text-sm bottom-6 right-3 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-all"
        onClick={onEdit}
        title="Edit Book"
      >
        <RiEditBoxLine />
      </div>

      {/* Tag */}
      <div className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-medium drop-shadow ${book.bookType === "sell" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}>
        {book.bookType === "sell" ? "For Sale" : "For Exchange"}
      </div>

      {/* Image */}
      <div className="w-full flex justify-center mt-4">
        <img
          src={book?.bookImage?.[0]}
          alt={book.bookTitle || "Book Image"}
          className="w-44 h-56 object-cover rounded-md border shadow-sm"
        />
      </div>

      {/* Details */}
      <div className="mt-4 px-2 flex flex-col gap-1 text-center">
        <h2 className="font-semibold text-lg text-gray-900 truncate">{book.bookTitle}</h2>
        <p className="text-sm text-gray-600 truncate">by {book.bookAuthor}</p>

        {book.bookType === "sell" && (
          <p className="text-md font-bold text-blue-600 mt-2">
            $ {book.bookPrice}
          </p>
        )}
      </div>
    </div>
  );
};

BookCard.propTypes = {
  book: PropTypes.shape({
    bookTitle: PropTypes.string.isRequired,
    bookAuthor: PropTypes.string.isRequired,
    bookType: PropTypes.oneOf(['sell', 'exchange']).isRequired,
    bookPrice: PropTypes.number,
    bookImage: PropTypes.arrayOf(PropTypes.string)
  }).isRequired,
  onEdit: PropTypes.func.isRequired
};

export default Exchanges;
