import React, { useEffect, useState } from 'react';
import AddBookForListing from '../components/AddBookForListing';
import EditBook from '../components/EditBook'; // ✅ Make sure this exists
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
    <div className="min-h-screen bg-gradient-to-br from-gray-200 to-gray-300">
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white flex justify-between items-center shadow-md">
        <h1 className="font-bold text-xl">📚 Book Exchange</h1>
        <button
          className="bg-white text-blue-600 font-semibold py-2 px-5 rounded-lg shadow-md transition-all hover:bg-blue-600 hover:text-white"
          onClick={() => setOpenAddBookListing(true)}
        >
          + Add a Book
        </button>
      </div>

      {/* Exchange Section */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">📦 Books for Exchange</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {exchangeBooks.length > 0 ? (
            exchangeBooks.map((book, index) => (
              <BookCard key={index} book={book} onEdit={() => handleEditBook(book)} />
            ))
          ) : (
            <p className="text-gray-500 text-center">No books for exchange right now.</p>
          )}
        </div>
      </section>

      {/* Sale Section */}
      <section className="px-6 py-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Books for Sale</h2>
        <div className="flex flex-wrap justify-center gap-8">
          {saleBooks.length > 0 ? (
            saleBooks.map((book, index) => (
              <BookCard key={index} book={book} onEdit={() => handleEditBook(book)} />
            ))
          ) : (
            <p className="text-gray-500 text-center">No books for sale right now.</p>
          )}
        </div>
      </section>

      {/* Add Book Modal */}
      {openAddBookListing && (
        <AddBookForListing onClose={() => setOpenAddBookListing(false)} onBookAdded={handleBookAdded} />
      )}

      {/* Edit Book Modal */}
      {editModalOpen && selectedBook && (
        <EditBook onClose={() => setEditModalOpen(false)} bookData={selectedBook} onBookUpdated={handleBookAdded} />
      )}
    </div>
  );
};

// 📦 Reusable Book Card Component
const BookCard = ({ book, onEdit }) => {
  return (
    <div className="relative w-64 h-auto flex flex-col bg-white rounded-xl shadow-md hover:shadow-xl transition-all border border-gray-200 p-4">
      {/* Edit Icon */}
      <div
        className="absolute text-sm bottom-6 right-3 bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-md hover:bg-blue-600 transition-all"
        onClick={onEdit}
        title="Edit Book"
      >
        <RiEditBoxLine />
      </div>

      {/* Tag */}
      <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-md font-medium ${book.bookType === "sell" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
        {book.bookType === "sell" ? "For Sale" : "For Exchange"}
      </div>

      {/* Image */}
      <div className="w-full flex justify-center">
        <img
          src={book?.bookImage?.[0] || "https://via.placeholder.com/150"}
          alt={book.bookTitle || "Book Image"}
          className="w-40 h-52 object-cover rounded-md border"
        />
      </div>

      {/* Details */}
      <div className="mt-4 px-2 flex flex-col gap-1">
        <h2 className="font-semibold text-md text-gray-900 truncate">{book.bookTitle}</h2>
        <p className="text-sm text-gray-600 truncate">By {book.bookAuthor}</p>

        {book.bookType === "sell" && (
          <p className="text-sm font-semibold text-blue-600 mt-1">
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
