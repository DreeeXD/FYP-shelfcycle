import { useState } from "react";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import uploadImage from "../helpers/uploadImage";
import ImageDisplay from "./ImageDisplay";
import { MdDeleteForever } from "react-icons/md";
import SummaryAPI from "../common";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const EditBook = ({ onClose, bookData, onBookUpdated }) => {
  const [data, setData] = useState({
    _id: bookData?._id || "",
    bookTitle: bookData?.bookTitle || "",
    bookAuthor: bookData?.bookAuthor || "",
    bookDescription: bookData?.bookDescription || "",
    bookCondition: bookData?.bookCondition || "",
    bookCategory: bookData?.bookCategory || "",
    bookPrice: bookData?.bookPrice || "",
    bookImage: bookData?.bookImage || [],
    bookType: bookData?.bookType || "exchange",
  });

  const [uploading, setUploading] = useState(false);
  const [openImageEnlarge, setOpenImageEnlarge] = useState(false);
  const [imageEnlarge, setImageEnlarge] = useState("");
  const navigate = useNavigate();

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      await Promise.all(
        files.map(async (file) => {
          const uploadImageCloudinary = await uploadImage(file);
          setData((prevData) => ({
            ...prevData,
            bookImage: [...prevData.bookImage, uploadImageCloudinary.url],
          }));
        })
      );
    } catch (err) {
      console.error("Image upload error", err);
    }
    setUploading(false);
  };

  const handleBookImageDelete = (index) => {
    const updated = [...data.bookImage];
    updated.splice(index, 1);
    setData((prev) => ({ ...prev, bookImage: updated }));
  };

  const handleUploadBook = async (e) => {
    e.preventDefault();
    const res = await fetch(SummaryAPI.updateBook.url, {
      method: SummaryAPI.updateBook.method,
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (result.success) {
      toast.success(result.message);
      onBookUpdated?.();
      onClose();
      navigate("/user-profile/user-uploads/");
    } else {
      toast.error(result.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-40 backdrop-blur-sm px-4 py-8">
      <div className="relative bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-lg w-full max-w-lg max-h-[90vh] shadow-lg overflow-hidden transition-colors duration-300">
        <div className="overflow-y-auto max-h-[calc(90vh-2rem)] p-6">
          <button
            className="absolute top-3 right-3 text-gray-600 dark:text-gray-300 hover:text-red-500 transition"
            onClick={onClose}
          >
            <IoMdClose size={24} />
          </button>

          <h2 className="text-2xl font-bold text-center text-blue-700 dark:text-blue-400 mb-6">
            Edit Book Details
          </h2>

          <form className="flex flex-col gap-4" onSubmit={handleUploadBook}>
            <div>
              <label className="text-sm font-medium text-gray-700 dark:text-gray-200 block mb-1">
                Book Type
              </label>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookType"
                    value="exchange"
                    checked={data.bookType === "exchange"}
                    onChange={handleOnChange}
                  />
                  Exchange
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="bookType"
                    value="sell"
                    checked={data.bookType === "sell"}
                    onChange={handleOnChange}
                  />
                  Sell
                </label>
              </div>
            </div>

            {[
              { id: "bookTitle", label: "Title" },
              { id: "bookAuthor", label: "Author" },
              { id: "bookCondition", label: "Condition" },
              { id: "bookCategory", label: "Category" },
            ].map(({ id, label }) => (
              <div key={id}>
                <label
                  htmlFor={id}
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  {label}
                </label>
                <input
                  id={id}
                  name={id}
                  value={data[id]}
                  required
                  onChange={handleOnChange}
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                />
              </div>
            ))}

            <div>
              <label
                htmlFor="bookDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
              >
                Description
              </label>
              <textarea
                id="bookDescription"
                name="bookDescription"
                value={data.bookDescription}
                required
                onChange={handleOnChange}
                className="w-full p-2 border rounded-md resize-none h-24 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {data.bookType === "sell" && (
              <div>
                <label
                  htmlFor="bookPrice"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1"
                >
                  Price (Rs.)
                </label>
                <input
                  type="number"
                  id="bookPrice"
                  name="bookPrice"
                  value={data.bookPrice}
                  onChange={handleOnChange}
                  className="w-full p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                Images
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleUploadProduct}
                className="w-full text-sm p-2 border rounded-md dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
              {uploading && (
                <p className="text-blue-500 text-sm mt-1">Uploading...</p>
              )}
              <div className="flex gap-3 flex-wrap mt-2">
                {data.bookImage.map((img, i) => (
                  <div key={i} className="relative group">
                    <img
                      src={img}
                      alt="Book"
                      onClick={() => {
                        setOpenImageEnlarge(true);
                        setImageEnlarge(img);
                      }}
                      className="h-20 w-20 object-cover rounded-md border cursor-pointer"
                    />
                    <div
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition"
                      onClick={() => handleBookImageDelete(i)}
                    >
                      <MdDeleteForever />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={uploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md font-semibold transition"
            >
              {uploading ? "Updating..." : "Update"}
            </button>
          </form>
        </div>
      </div>

      {openImageEnlarge && (
        <ImageDisplay
          onClose={() => setOpenImageEnlarge(false)}
          ImageUrl={imageEnlarge}
        />
      )}
    </div>
  );
};

EditBook.propTypes = {
  onClose: PropTypes.func.isRequired,
  bookData: PropTypes.shape({
    _id: PropTypes.string,
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
    bookDescription: PropTypes.string,
    bookCondition: PropTypes.string,
    bookCategory: PropTypes.string,
    bookPrice: PropTypes.number,
    bookImage: PropTypes.arrayOf(PropTypes.string),
    bookType: PropTypes.oneOf(["exchange", "sell"]),
  }).isRequired,
  onBookUpdated: PropTypes.func.isRequired,
};

export default EditBook;
