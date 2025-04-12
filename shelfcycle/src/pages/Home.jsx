import React, { useEffect, useState } from "react";
import SummaryAPI from '../common';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlistItem } from '../store/wishlistSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

export default function HomePage() {
  const [books, setBooks] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const wishlist = useSelector(state => state.wishlist.items || []);

  useEffect(() => {
    fetch(SummaryAPI.getBooks.url, {
      method: SummaryAPI.getBooks.method,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBooks(data.data);
        }
      })
      .catch((err) => console.error("Failed to fetch books:", err));
  }, []);

  const handleToggleWishlist = async (bookId) => {
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (data.success) {
        dispatch(toggleWishlistItem(bookId));
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to update wishlist");
      }
    } catch (err) {
      toast.error("Error updating wishlist");
    }
  };

  return (
    <div className="bg-[#fff8f3] text-[#2b1e17] font-sans">
      {/* Hero Banner */}
      <section className="w-full overflow-hidden relative">
        <div className="w-full h-96 bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center text-4xl font-bold text-orange-800 animate-pulse">
          Discover Your Next Favorite Book 📚
        </div>
      </section>

      {/* For Sale Books */}
      <section className="py-16 px-6">
        <h3 className="text-4xl font-bold mb-10 text-center text-[#2b1e17]">Hot Arrivals (For Sale)</h3>
        <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {books.filter(book => book.bookType === "sell").slice(0, 4).length > 0 ? (
            books
              .filter(book => book.bookType === "sell")
              .slice(0, 4)
              .map((book) => (
                <div
                  key={book._id}
                  className="bg-white p-5 rounded-2xl shadow-xl hover:scale-105 transition transform duration-300 cursor-pointer relative"
                  onClick={() => navigate(`/book-details/${book._id}`)}
                >
                  <img
                    src={book.bookImage?.[0]}
                    alt={book.bookTitle}
                    className="h-48 w-full object-cover rounded-xl mb-4 border"
                  />
                  <h4 className="text-lg font-bold mb-1 truncate">{book.bookTitle}</h4>
                  <p className="text-sm text-gray-500 mb-2 truncate">{book.bookAuthor}</p>
                  <div className="text-blue-600 font-bold text-lg">$ {book.bookPrice}</div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // prevent navigation
                      handleToggleWishlist(book._id);
                    }}
                    className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-500 text-white font-medium py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    {wishlist.includes(book._id) ? <FaHeart /> : <FaRegHeart />}
                    {wishlist.includes(book._id) ? "Remove from Wishlist" : "Add to Wishlist"}
                  </button>
                </div>
              ))
          ) : (
            <p className="col-span-full text-center text-gray-600 text-lg">No books for sale at the moment.</p>
          )}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-6 bg-white border-t border-orange-100">
        <h3 className="text-3xl font-bold mb-10 text-center text-[#2b1e17]">Why Choose ShelfCycle?</h3>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4 text-center">
          <Feature icon="♻️" title="Sustainable Reading" text="Give pre-loved books a new home and reduce waste." />
          <Feature icon="💰" title="Affordable Prices" text="Buy and sell books at fair and friendly prices." />
          <Feature icon="📦" title="Easy Exchange" text="Swap books with others effortlessly and instantly." />
          <Feature icon="📚" title="Vast Selection" text="Thousands of titles across genres from the community." />
        </div>
      </section>
    </div>
  );
}

const Feature = ({ icon, title, text }) => (
  <div>
    <div className="text-5xl mb-4">{icon}</div>
    <h4 className="font-bold text-lg mb-1">{title}</h4>
    <p className="text-sm text-gray-600">{text}</p>
  </div>
);
