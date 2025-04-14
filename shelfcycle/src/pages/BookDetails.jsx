import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SummaryAPI from "../common";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "../store/wishlistSlice";
import { toast } from "react-toastify";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const wishlist = useSelector((state) => state.wishlist.items || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isWishlisted = wishlist.includes(id);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const res = await fetch(`${SummaryAPI.getBookById(id)}`);
        const data = await res.json();
        if (data.success) {
          setBook(data.data);
          setSelectedImage(data.data.bookImage?.[0]);
        }
      } catch (err) {
        console.error("Failed to fetch book:", err);
      }
    };

    fetchBookDetails();
  }, [id]);

  const handleWishlistToggle = async () => {
    try {
      const res = await fetch(SummaryAPI.toggleWishlist.url, {
        method: SummaryAPI.toggleWishlist.method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: id }),
      });

      const data = await res.json();
      if (data.success) {
        dispatch(toggleWishlistItem(id));
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Error updating wishlist");
    }
  };

  const handleMessage = () => {
    if (book?.uploadedBy?._id) {
      navigate(`/chat/${book.uploadedBy._id}`);
    }
  };

  const handleGoBack = () => navigate(-1);

  if (!book) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading book details...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg p-6 grid md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <div className="w-full h-[400px] border rounded-md flex items-center justify-center bg-gray-50 mb-4">
            <img src={selectedImage} alt="Book" className="object-contain h-full" />
          </div>
          <div className="flex gap-3">
            {book.bookImage?.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Book ${index}`}
                onClick={() => setSelectedImage(img)}
                className={`w-16 h-20 object-cover border rounded cursor-pointer ${
                  selectedImage === img ? "ring-2 ring-blue-500" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-gray-800">{book.bookTitle}</h1>
          <p className="text-sm text-gray-500">by {book.bookAuthor}</p>

          {book.owner && (
            <p className="text-xs text-gray-500">
              Uploaded by{" "}
              <span
                className="text-blue-600 hover:underline cursor-pointer"
                onClick={() => navigate(`/public-profile/${book.owner._id}`)}
              >
                {book.owner.username}
              </span>
            </p>
          )}

          <div className="flex items-center gap-3 mt-2">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                book.bookType === "sell"
                  ? "bg-green-200 text-green-800"
                  : "bg-yellow-200 text-yellow-800"
              }`}
            >
              {book.bookType === "sell" ? "For Sale" : "For Exchange"}
            </span>

            {book.bookType === "sell" && (
              <span className="text-blue-600 font-semibold text-lg">$ {book.bookPrice}</span>
            )}
          </div>

          <div className="mt-3">
            <h3 className="text-md font-semibold text-gray-800 mb-1">Description</h3>
            <p className="text-sm text-gray-700">{book.bookDescription || "No description provided."}</p>
          </div>

          <div className="text-sm text-gray-600 mt-3">
            <p>
              Posted on:{" "}
              <span className="font-medium">{moment(book.createdAt).format("LL")}</span>
            </p>
          </div>

          {/* Seller Info */}
          {book.uploadedBy && (
          <div className="mt-4 border-t pt-4">
            <h3 className="font-semibold text-gray-800 mb-1">Uploaded by</h3>
            <p className="text-sm text-gray-700">Name: {book.uploadedBy.username}</p>
            <p className="text-sm text-gray-700">Email: {book.uploadedBy.email}</p>
            {book.uploadedBy.phone && (
              <p className="text-sm text-gray-700">Phone: {book.uploadedBy.phone}</p>
            )}
            {book.uploadedBy.averageRating && (
            <p className="text-sm text-yellow-600">
            ⭐ Average Rating: {book.uploadedBy.averageRating}
            </p>
            )}
          </div>
          )}

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleWishlistToggle}
              className="flex-1 flex items-center justify-center gap-2 bg-pink-100 text-pink-600 border border-pink-300 px-4 py-2 rounded-full hover:bg-pink-200 transition text-sm"
            >
              {isWishlisted ? <FaHeart /> : <FaRegHeart />}
              {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>

            <button
              onClick={handleMessage}
              className="flex-1 bg-blue-100 text-blue-600 border border-blue-300 px-4 py-2 rounded-full hover:bg-blue-200 transition text-sm"
            >
              💬 Contact the Seller
            </button>

            <button
              onClick={handleGoBack}
              className="flex-1 bg-gray-100 text-gray-600 border border-gray-300 px-4 py-2 rounded-full hover:bg-gray-200 transition text-sm"
            >
              ← Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetails;
