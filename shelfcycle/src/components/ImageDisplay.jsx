import React from 'react';
import { IoMdClose } from 'react-icons/io';

const ImageDisplay = ({ ImageUrl, onClose }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-50 bg-opacity-60">
      <div className="relative">


        <img src={ImageUrl} className="w-96 h-auto rounded-lg shadow-lg" alt="Enlarged preview" />


        <button 
          className="absolute top-1 right-1 bg-white rounded-full p-1 text-gray-600 hover:text-red-500 transition duration-300 shadow-lg"
          onClick={onClose}
        >
          <IoMdClose size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageDisplay;
