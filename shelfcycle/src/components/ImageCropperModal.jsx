import React, { useState } from 'react';
import Cropper from 'react-easy-crop';
import { getCroppedImg } from '../helpers/cropImage';

const ImageCropperModal = ({ image, onClose, onCropComplete }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleDone = async () => {
    const croppedImage = await getCroppedImg(image, croppedAreaPixels, zoom);
    onCropComplete(croppedImage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-4 w-full max-w-lg space-y-4 shadow-lg transition-colors duration-300">
        <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-700 rounded">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        <div className="flex justify-between items-center">
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-3/4 accent-blue-600"
          />
          <div className="space-x-2">
            <button
              onClick={onClose}
              className="bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-white px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded transition"
            >
              Crop
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
