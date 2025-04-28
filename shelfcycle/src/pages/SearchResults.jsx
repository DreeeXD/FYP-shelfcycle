import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import SummaryAPI from '../common';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { toast } from 'react-toastify';

const SearchResults = () => {
  const location = useLocation();
  const query =
    new URLSearchParams(location.search).get('search') ||
    new URLSearchParams(location.search).get('q') ||
    '';
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [sortMethod, setSortMethod] = useState('newest');

  const wishlist = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await fetch(`${SummaryAPI.getBooks.url}?search=${encodeURIComponent(query)}`);
        const data = await res.json();
        if (data.success) {
          setBooks(data.data);
        }
      } catch (err) {
        console.error('Failed to fetch books:', err);
      }
    };

    fetchBooks();
  }, [query]);

  useEffect(() => {
    setFilteredBooks(sortBooks(books, sortMethod));
  }, [books, sortMethod]);

  const sortBooks = (list, method) => {
    switch (method) {
      case 'title_asc':
        return [...list].sort((a, b) => a.bookTitle.localeCompare(b.bookTitle));
      case 'title_desc':
        return [...list].sort((a, b) => b.bookTitle.localeCompare(a.bookTitle));
      case 'oldest':
        return [...list].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'newest':
      default:
        return [...list].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  };

  const handleWishlistToggle = async (bookId) => {
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
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
      toast.error('Error updating wishlist');
    }
  };

  const highlightMatch = (text) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.split(regex).map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-yellow-200 dark:bg-yellow-600/30 font-semibold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-100 px-6 py-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">
          Search Results for <span className="text-blue-600 dark:text-blue-400">"{query}"</span>
        </h1>

        <div className="flex justify-end mb-6">
          <select
            value={sortMethod}
            onChange={(e) => setSortMethod(e.target.value)}
            className="border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 px-3 py-1 rounded shadow text-sm"
          >
            <option value="newest">Sort by: Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title_asc">Title A-Z</option>
            <option value="title_desc">Title Z-A</option>
          </select>
        </div>

        {filteredBooks.length === 0 ? (
          <div className="text-center mt-20 text-gray-600 dark:text-gray-400">
            <p>No books found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map((book) => (
              <div
                key={book._id}
                className="relative bg-white dark:bg-gray-800 p-4 rounded-xl shadow-md hover:shadow-xl transition border border-gray-200 dark:border-gray-700 hover:scale-[1.02]"
              >
                {/* Wishlist Icon */}
                <button
                  onClick={() => handleWishlistToggle(book._id)}
                  className="absolute top-2 left-2 text-xl text-red-500 z-10"
                  title="Toggle Wishlist"
                >
                  {wishlist.includes(book._id) ? <FaHeart /> : <FaRegHeart />}
                </button>

                {/* Clickable Book Link */}
                <Link to={`/book-details/${book._id}`}>
                  {/* Badge */}
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-medium drop-shadow ${
                      book.bookType === 'sell'
                        ? 'bg-green-200 text-green-800 dark:bg-green-400/20 dark:text-green-300'
                        : 'bg-yellow-200 text-yellow-800 dark:bg-yellow-400/20 dark:text-yellow-300'
                    }`}
                  >
                    {book.bookType === 'sell' ? 'For Sale' : 'For Exchange'}
                  </div>

                  {/* Image */}
                  <div className="w-full flex justify-center mt-4">
                    <img
                      src={book.bookImage?.[0]}
                      alt={book.bookTitle}
                      className="w-40 h-56 object-cover rounded-md border"
                    />
                  </div>

                  {/* Info */}
                  <div className="mt-4 px-2 flex flex-col gap-1 text-center">
                    <h2 className="font-semibold text-lg text-gray-900 dark:text-white truncate">
                      {highlightMatch(book.bookTitle)}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">
                      by {highlightMatch(book.bookAuthor)}
                    </p>
                    {book.bookType === 'sell' && (
                      <p className="text-md font-bold text-blue-600 dark:text-blue-400 mt-2">
                        Rs {book.bookPrice}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
