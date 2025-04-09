import React, { useEffect, useRef, useState } from 'react';
import AddBookForListing from '../components/AddBookForListing';
import SummaryAPI from '../common';
import PropTypes from 'prop-types';

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [isBookAdded, setIsBookAdded] = useState(false);
  const [showMoreExchange, setShowMoreExchange] = useState(false);
  const [showMoreSale, setShowMoreSale] = useState(false);
  const [exchangeSort, setExchangeSort] = useState('newest');
  const [saleSort, setSaleSort] = useState('newest');

  const exchangeRef = useRef(null);
  const saleRef = useRef(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      const response = await fetch(SummaryAPI.getBooks.url);
      const dataResponse = await response.json();
      setAllBooks(dataResponse?.data || []);
    };

    fetchAllBooks();
  }, [isBookAdded]);

  const handleBookAdded = () => {
    setIsBookAdded(!isBookAdded);
    setOpenAddBookListing(false);
  };

  const sortBooks = (books, method) => {
    switch (method) {
      case 'title_asc':
        return [...books].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
      case 'title_desc':
        return [...books].sort((a, b) => b.bookTitle.localeCompare(a.bookTitle));
      case 'oldest':
        return [...books].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'newest':
      default:
        return [...books].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const exchangeBooks = sortBooks(
    allBooks.filter(book => book.bookType === 'exchange'),
    exchangeSort
  );

  const saleBooks = sortBooks(
    allBooks.filter(book => book.bookType === 'sell'),
    saleSort
  );

  const getMaxHeight = (showMore, totalItems) => {
    const itemHeight = 500; // Approx card height
    const itemsPerRow = 4;
    const visibleRows = Math.ceil((showMore ? totalItems : 4) / itemsPerRow);
    const paddingBuffer = 60; // Add padding to avoid cut-off
    return `${visibleRows * itemHeight + paddingBuffer}px`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
     {/* Header */}
<header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg px-4 md:px-8 py-4">
  <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
    {/* Title */}
    <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left">
      Book Exchange Platform
    </h1>

    {/* Add Book Button */}
        <button
          onClick={() => setOpenAddBookListing(true)}
          className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:text-white transition-all duration-300"
        >
          + Add Book
        </button>
      </div>
  </header>

      {/* Exchange Section */}
      <section className="px-6 py-6 bg-white shadow-inner rounded-md my-6 mx-4 md:mx-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available for Exchange</h2>
          <select
            value={exchangeSort}
            onChange={(e) => setExchangeSort(e.target.value)}
            className="border rounded-md px-3 py-1 shadow text-sm"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title_asc">Sort: Title A-Z</option>
            <option value="title_desc">Sort: Title Z-A</option>
          </select>
        </div>

        <div
          ref={exchangeRef}
          className="transition-all duration-700 ease-in-out overflow-hidden"
          style={{ maxHeight: getMaxHeight(showMoreExchange, exchangeBooks.length) }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {(showMoreExchange ? exchangeBooks : exchangeBooks.slice(0, 4)).map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </div>

        {exchangeBooks.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowMoreExchange(prev => !prev)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow"
            >
              {showMoreExchange ? 'Show Less' : 'View More'}
            </button>
          </div>
        )}
      </section>

      {/* Sale Section */}
      <section className="px-6 py-6 bg-white shadow-inner rounded-md my-6 mx-4 md:mx-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Available for Sale</h2>
          <select
            value={saleSort}
            onChange={(e) => setSaleSort(e.target.value)}
            className="border rounded-md px-3 py-1 shadow text-sm"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
            <option value="title_asc">Sort: Title A-Z</option>
            <option value="title_desc">Sort: Title Z-A</option>
          </select>
        </div>

        <div
          ref={saleRef}
          className="transition-all duration-700 ease-in-out overflow-hidden"
          style={{ maxHeight: getMaxHeight(showMoreSale, saleBooks.length) }}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {(showMoreSale ? saleBooks : saleBooks.slice(0, 4)).map((book, index) => (
              <BookCard key={index} book={book} />
            ))}
          </div>
        </div>

        {saleBooks.length > 4 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowMoreSale(prev => !prev)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow"
            >
              {showMoreSale ? 'Show Less' : 'View More'}
            </button>
          </div>
        )}
      </section>

      {/* Add Book Modal */}
      {openAddBookListing && (
        <AddBookForListing
          onClose={() => setOpenAddBookListing(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

const BookCard = ({ book }) => {
  return (
    <div className="relative w-full flex flex-col bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 p-4 hover:scale-[1.02] duration-300 ease-in-out">
      <div className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-medium drop-shadow ${
        book.bookType === 'sell' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'
      }`}>
        {book.bookType === 'sell' ? 'For Sale' : 'For Exchange'}
      </div>

      <div className="w-full flex justify-center mt-4">
        <img
          src={book?.bookImage?.[0]}
          alt={book.bookTitle || 'Book Image'}
          className="w-44 h-56 object-cover rounded-md border shadow-sm"
        />
      </div>

      <div className="mt-4 px-2 flex flex-col gap-1 text-center">
        <h2 className="font-semibold text-lg text-gray-900 truncate">{book.bookTitle}</h2>
        <p className="text-sm text-gray-600 truncate">by {book.bookAuthor}</p>
        {book.bookType === 'sell' && (
          <p className="text-md font-bold text-blue-600 mt-2">$ {book.bookPrice}</p>
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
    bookImage: PropTypes.arrayOf(PropTypes.string),
    createdAt: PropTypes.string
  }).isRequired,
};

export default Exchanges;
