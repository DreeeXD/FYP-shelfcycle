import React, { useEffect, useState } from "react";
import SummaryAPI from "../common";
import { FaHeart } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { toggleWishlistItem } from "../store/wishlistSlice";
import { Link } from "react-router-dom";

const Wishlist = () => {
  const [wishlistBooks, setWishlistBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  const fetchWishlist = async () => {
    try {
      const res = await fetch(SummaryAPI.wishlistFetch.url, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setWishlistBooks(data.data.map((item) => item.book));
      } else {
        toast.error("Login to load wishlist");
      }
    } catch (err) {
      toast.error("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (bookId) => {
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: SummaryAPI.toggleWishlist.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId }),
      });

      const data = await res.json();
      if (data.success) {
        setWishlistBooks((prev) => prev.filter((book) => book._id !== bookId));
        dispatch(toggleWishlistItem(bookId));
        toast.success("Removed from Wishlist");
      } else {
        toast.error(data.message || "Failed to remove from wishlist");
      }
    } catch (err) {
      toast.error("Error updating wishlist");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 py-10 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">My Wishlist</h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading your wishlist...</p>
        ) : wishlistBooks.length === 0 ? (
          <p className="text-center text-gray-500">You haven&apos;t added anything to your wishlist yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {wishlistBooks.map((book) => (
              <div
                key={book._id}
                className="relative bg-white p-4 rounded-lg shadow-md hover:shadow-lg border hover:scale-[1.02] transition-all"
              >
                {/* Wishlist Icon (outside link) */}
                <button
                  onClick={() => handleToggleWishlist(book._id)}
                  className="absolute top-2 left-2 text-red-500 text-xl z-10"
                  title="Remove from wishlist"
                >
                  <FaHeart />
                </button>

                {/* Card Clickable Area */}
                <Link to={`/book-details/${book._id}`}>
                  {/* Tag */}
                  <div
                    className={`absolute top-2 right-2 px-3 py-1 text-xs rounded-full font-medium drop-shadow ${
                      book.bookType === "sell"
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {book.bookType === "sell" ? "For Sale" : "For Exchange"}
                  </div>

                  {/* Image */}
                  <div className="w-full flex justify-center mt-4">
                    <img
                      src={book?.bookImage?.[0]}
                      alt={book.bookTitle || "Book"}
                      className="w-40 h-56 object-cover rounded-md border"
                    />
                  </div>

                  {/* Book Info */}
                  <div className="mt-4 px-2 flex flex-col gap-1 text-center">
                    <h2 className="font-semibold text-lg text-gray-900 truncate">{book.bookTitle}</h2>
                    <p className="text-sm text-gray-600 truncate">by {book.bookAuthor}</p>
                    {book.bookType === "sell" && (
                      <p className="text-md font-bold text-blue-600 mt-2">$ {book.bookPrice}</p>
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

export default Wishlist;
