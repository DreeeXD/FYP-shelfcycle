import { useState } from "react";
import PropTypes from "prop-types"; // Import PropTypes
import { IoMdClose } from "react-icons/io";
import uploadImage from "../helpers/uploadImage";
import ImageDisplay from "./ImageDisplay";
import { MdDeleteForever } from "react-icons/md";
import SummaryAPI from "../common";
import { toast } from 'react-toastify';
import { Navigate } from "react-router-dom";

const EditBook = ({
  onClose,
  bookData,
}) => {
  const [data, setData] = useState({
    bookTitle: bookData?.bookTitle,
    bookAuthor: bookData?.bookAuthor,
    bookDescription: bookData?.bookDescription,
    bookCondition: bookData?.bookCondition,
    bookCategory: bookData?.bookCategory,
    bookPrice: bookData?.bookPrice,
    bookImage: bookData?.bookImage || [], 
  });

  const [uploading, setUploading] = useState(false);
  const [openImageEnlarge, setOpenImageEnlarge] = useState(false);
  const [imageEnlarge, setImageEnlarge] = useState("");

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUploadProduct = async (e) => {
    const files = Array.from(e.target.files); // Convert FileList to an array
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
    } catch (error) {
      console.error("Error uploading images:", error);
    }

    setUploading(false);
  };

  const handleBookImageDelete = async(index) => {
    const updatedBookImage = [...data.bookImage];
    updatedBookImage.splice(index, 1); //splice to remove elements from the array 

    setData((prevData) => ({
      ...prevData,
      bookImage: [...updatedBookImage],
    }));
  };

  const handleUploadBook = async (e) => {
    e.preventDefault();
    const response = await fetch(SummaryAPI.uploadBook.url, {
      method: SummaryAPI.uploadBook.method,
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    const responseData = await response.json();
    
    if (responseData.success) {
      toast.success(responseData?.message);
      onClose();
      Navigate("/exchanges");
    }

    if (responseData.error) {
      toast.error(responseData?.message);
    }
  };

  return (
    <div className="absolute flex w-full h-full justify-center top-0 items-center bg-slate-100 bg-opacity-60 transition-all">
      <div className="relative bg-white p-5 rounded-lg w-full max-w-2xl max-h-[90%] shadow-lg overflow-auto">
        <button className="absolute top-3 right-3 text-gray-600 hover:text-blue-700 transition duration-300" onClick={onClose}>
          <IoMdClose size={24} />
        </button>

        <h2 className="text-2xl font-semibold text-center mb-4 text-gray-800">Edit Book Details</h2>

        <form className="flex flex-col gap-3" onSubmit={handleUploadBook}>
          {/* Book Title */}
          <div>
            <label htmlFor="bookTitle" className="block text-gray-700 text-sm font-medium mb-1">Book Title:</label>
            <input
              type="text"
              id="bookTitle"
              name="bookTitle"
              value={data.bookTitle}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Author */}
          <div>
            <label htmlFor="bookAuthor" className="block text-gray-700 text-sm font-medium mb-1">Book Author:</label>
            <input
              type="text"
              id="bookAuthor"
              name="bookAuthor"
              value={data.bookAuthor}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Description */}
          <div>
            <label htmlFor="bookDescription" className="block text-gray-700 text-sm font-medium mb-1">Book Description:</label>
            <textarea
              id="bookDescription"
              name="bookDescription"
              value={data.bookDescription}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 h-20 focus:ring-blue-400 resize-none focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Condition */}
          <div>
            <label htmlFor="bookCondition" className="block text-gray-700 text-sm font-medium mb-1">Book Condition:</label>
            <input
              type="text"
              id="bookCondition"
              name="bookCondition"
              value={data.bookCondition}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Category */}
          <div>
            <label htmlFor="bookCategory" className="block text-gray-700 text-sm font-medium mb-1">Book Category:</label>
            <input
              type="text"
              id="bookCategory"
              name="bookCategory"
              value={data.bookCategory}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Price */}
          <div>
            <label htmlFor="bookPrice" className="block text-gray-700 text-sm font-medium mb-1">Book Price:</label>
            <input
              type="number"
              id="bookPrice"
              name="bookPrice"
              value={data.bookPrice}
              required
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleOnChange}
            />
          </div>

          {/* Book Image Upload */}
          <div>
            <label htmlFor="bookImage" className="block text-gray-700 text-sm font-medium mb-1">Book Images:</label>
            <input
              type="file"
              id="bookImage"
              name="bookImage"
              accept="image/*"
              multiple 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none transition focus:bg-blue-50"
              onChange={handleUploadProduct}
            />
            {uploading && <p className="text-blue-500 text-sm mt-1">Uploading...</p>}

            <div className="flex flex-wrap gap-2 mt-2">
              {data.bookImage.length > 0 && 
              data.bookImage.map((image, index) => (
                <div key={index} className="relative group">
                  <img 
                    src={image}
                    alt="Book" className="h-20 w-20 object-cover rounded-md border cursor-pointer" 
                    onClick={() => {
                      setOpenImageEnlarge(true);
                      setImageEnlarge(image);
                    }}
                  />
                  <div className="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition duration-300" onClick={() => handleBookImageDelete(index)}> 
                    <MdDeleteForever />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300 font-semibold text-lg"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>

      {/* Display Full Image */}
      {openImageEnlarge && (
        <ImageDisplay onClose={() => setOpenImageEnlarge(false)} ImageUrl={imageEnlarge} />
      )}
    </div>
  );
};

// Add PropTypes validation
EditBook.propTypes = {
  onClose: PropTypes.func.isRequired,
  bookData: PropTypes.shape({
    bookTitle: PropTypes.string,
    bookAuthor: PropTypes.string,
    bookDescription: PropTypes.string,
    bookCondition: PropTypes.string,
    bookCategory: PropTypes.string,
    bookPrice: PropTypes.number,
    bookImage: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default EditBook;