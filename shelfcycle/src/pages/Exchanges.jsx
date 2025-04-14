import React, { useEffect, useRef, useState } from 'react';
import AddBookForListing from '../components/AddBookForListing';
import SummaryAPI from '../common';
import PropTypes from 'prop-types';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setWishlist, toggleWishlistItem } from '../store/wishlistSlice';
import { Link } from 'react-router-dom';

const Exchanges = () => {
  const [openAddBookListing, setOpenAddBookListing] = useState(false);
  const [allBooks, setAllBooks] = useState([]);
  const [isBookAdded, setIsBookAdded] = useState(false);
  const [showMoreExchange, setShowMoreExchange] = useState(false);
  const [showMoreSale, setShowMoreSale] = useState(false);
  const [exchangeSort, setExchangeSort] = useState('newest');
  const [saleSort, setSaleSort] = useState('newest');

  const wishlist = useSelector(state => state.wishlist.items || []);
  const dispatch = useDispatch();
  const exchangeRef = useRef(null);
  const saleRef = useRef(null);

  useEffect(() => {
    const fetchAllBooks = async () => {
      const response = await fetch(SummaryAPI.getBooks.url);
      const dataResponse = await response.json();
      setAllBooks(dataResponse?.data || []);
    };

    const fetchWishlist = async () => {
      const res = await fetch(SummaryAPI.wishlistFetch.url, {
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        dispatch(setWishlist(data.data.map(item => item.book._id)));
      }
    };

    fetchAllBooks();
    fetchWishlist();
  }, [isBookAdded, dispatch]);

  const handleBookAdded = () => {
    setIsBookAdded(!isBookAdded);
    setOpenAddBookListing(false);
  };

  const handleAddToWishlist = async (bookId) => {
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: SummaryAPI.toggleWishlist.method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ bookId }),
      });
      const data = await res.json();

      if (data.success) {
        dispatch(toggleWishlistItem(bookId));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Failed to update wishlist");
    }
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
    allBooks.filter(
      book =>
        book.bookType === 'exchange' &&
        book.bookStatus !== 'sold' &&
        book.isExchanged !== true &&
        book.isExchanged !== 'true'
    ),
    exchangeSort
  );
  
  const saleBooks = sortBooks(
    allBooks.filter(
      book =>
        book.bookType === 'sell' &&
        book.bookStatus !== 'sold' &&
        book.isExchanged !== true &&
        book.isExchanged !== 'true'
    ),
    saleSort
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200">
      <header className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg px-4 md:px-8 py-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-bold tracking-wide text-center sm:text-left">Book Exchange Platform</h1>
          <button
            onClick={() => setOpenAddBookListing(true)}
            className="bg-white text-blue-700 font-semibold px-5 py-2 rounded-lg shadow-md hover:bg-blue-700 hover:text-white transition-all duration-300"
          >
            + Add Book
          </button>
        </div>
      </header>

      <BookSection
        title="Available for Exchange"
        sort={exchangeSort}
        setSort={setExchangeSort}
        books={exchangeBooks}
        showMore={showMoreExchange}
        setShowMore={setShowMoreExchange}
        refValue={exchangeRef}
        onWishlist={handleAddToWishlist}
        wishlist={wishlist}
      />

      <BookSection
        title="Available for Sale"
        sort={saleSort}
        setSort={setSaleSort}
        books={saleBooks}
        showMore={showMoreSale}
        setShowMore={setShowMoreSale}
        refValue={saleRef}
        onWishlist={handleAddToWishlist}
        wishlist={wishlist}
      />

      {openAddBookListing && (
        <AddBookForListing
          onClose={() => setOpenAddBookListing(false)}
          onBookAdded={handleBookAdded}
        />
      )}
    </div>
  );
};

// ============================

const BookSection = ({ title, sort, setSort, books, showMore, setShowMore, refValue, onWishlist, wishlist }) => {
  const getMaxHeight = (showMore, totalItems) => {
    const itemHeight = 500;
    const itemsPerRow = 4;
    const visibleRows = Math.ceil((showMore ? totalItems : 4) / itemsPerRow);
    return `${visibleRows * itemHeight + 60}px`;
  };

  return (
    <section className="px-6 py-6 bg-white shadow-inner rounded-md my-6 mx-4 md:mx-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="border rounded-md px-3 py-1 shadow text-sm"
        >
          <option value="newest">Sort: Newest</option>
          <option value="oldest">Sort: Oldest</option>
          <option value="title_asc">Sort: Title A-Z</option>
          <option value="title_desc">Sort: Title Z-A</option>
        </select>
      </div>

      <div
        ref={refValue}
        className="transition-all duration-700 ease-in-out overflow-hidden"
        style={{ maxHeight: getMaxHeight(showMore, books.length) }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {(showMore ? books : books.slice(0, 4)).map((book) => (
            <BookCard
              key={book._id}
              book={book}
              onWishlist={onWishlist}
              isWishlisted={wishlist.includes(book._id)}
            />
          ))}
        </div>
      </div>

      {books.length > 4 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowMore(prev => !prev)}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300 shadow"
          >
            {showMore ? 'Show Less' : 'View More'}
          </button>
        </div>
      )}
    </section>
  );
};

// ============================

const BookCard = ({ book, onWishlist, isWishlisted }) => {
  return (
    <div className="relative w-full">
      <Link
        to={`/book-details/${book._id}`}
        className="block w-full bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all border border-gray-200 p-4 hover:scale-[1.02] duration-300 ease-in-out"
      >
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
      </Link>

      <button
        title="Toggle Wishlist"
        onClick={() => onWishlist(book._id)}
        className="absolute top-2 left-2 text-xl z-10 transition"
      >
        {isWishlisted ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-gray-400 hover:text-red-500" />
        )}
      </button>
    </div>
  );
};

// ============================

BookCard.propTypes = {
  book: PropTypes.object.isRequired,
  onWishlist: PropTypes.func.isRequired,
  isWishlisted: PropTypes.bool.isRequired,
};

BookSection.propTypes = {
  title: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  setSort: PropTypes.func.isRequired,
  books: PropTypes.arrayOf(PropTypes.object).isRequired,
  showMore: PropTypes.bool.isRequired,
  setShowMore: PropTypes.func.isRequired,
  refValue: PropTypes.object.isRequired,
  onWishlist: PropTypes.func.isRequired,
  wishlist: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default Exchanges;
