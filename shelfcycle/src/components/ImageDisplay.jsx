import React from 'react';
import { IoMdClose } from 'react-icons/io';

const ImageDisplay = ({ ImageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 dark:bg-black bg-opacity-60 dark:bg-opacity-70 z-50 transition-colors duration-300">
      <div className="relative">
        <img
          src={ImageUrl}
          className="w-96 h-auto rounded-lg shadow-lg border border-gray-300 dark:border-gray-600"
          alt="Enlarged preview"
        />

        <button
          className="absolute top-1 right-1 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-full p-1 hover:text-red-500 dark:hover:text-red-400 shadow-lg transition duration-300"
          onClick={onClose}
        >
          <IoMdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;
