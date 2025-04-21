import { useState } from "react";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import imgToBase64 from "../helpers/imgToBase64";
import SummaryAPI from "../common";
import { toast } from "react-toastify";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../helpers/cropImage";
import Modal from "react-modal";
import { motion, AnimatePresence } from "framer-motion";

const SignUp = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [zoom, setZoom] = useState(1);

  const [data, setData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    phone: "",
    uploadPic: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUploadPicture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await imgToBase64(file);
      setCropImage(base64);
      setShowCropModal(true);
    }
  };

  const handleCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropSave = async () => {
    try {
      const croppedImg = await getCroppedImg(cropImage, croppedAreaPixels, zoom);
      setData((prev) => ({ ...prev, uploadPic: croppedImg }));
      setShowCropModal(false);
      setCropImage(null);
      toast.success("Image cropped successfully!");
    } catch (err) {
      toast.error("Error cropping image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (data.password === data.confirmPassword) {
      const dataResponse = await fetch(SummaryAPI.signUp.url, {
        method: SummaryAPI.signUp.method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const dataAPI = await dataResponse.json();

      if (dataAPI.success) {
        toast.success(dataAPI.message);
        navigate("/verify-email", { state: { userId: dataAPI.userId } });
      } else if (dataAPI.error) {
        toast.error(dataAPI.message);
      }
    } else {
      toast.error("Please enter a matching password and try again.");
    }
  };

  return (
    <section id="signup">
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md w-96 text-gray-900 dark:text-gray-100"
        >
          <h2 className="text-2xl font-semibold text-center">Welcome to ShelfCycle</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-6">
            Create your ShelfCycle account
          </p>
  
          <form onSubmit={handleSubmit}>
            
  
            {/* Email */}
            <div className="mb-4">
              <label className="block font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={data.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Username */}
            <div className="mb-4">
              <label className="block font-medium">Username</label>
              <input
                type="text"
                name="username"
                value={data.username}
                onChange={handleChange}
                required
                placeholder="Enter your username"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            {/* Phone */}
            <div className="mb-4">
              <label className="block font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={data.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full px-4 py-2 mt-1 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
  
            {/* Password */}
            <div className="mb-4 relative">
              <label className="block font-medium">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={data.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="w-full px-4 py-2 mt-1 border rounded-lg pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
              </span>
            </div>
  
            {/* Confirm Password */}
            <div className="mb-4 relative">
              <label className="block font-medium">Confirm Password</label>
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm your password"
                className="w-full px-4 py-2 mt-1 border rounded-lg pr-10 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-10 cursor-pointer text-gray-500 hover:text-gray-700 dark:text-gray-300"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <IoMdEyeOff size={22} /> : <IoMdEye size={22} />}
              </span>
            </div>
  
            {/* Upload Picture */}
            <label className="block text-sm font-medium pb-2">Upload Photo</label>
            <input
              type="file"
              name="photo"
              accept="image/*"
              onChange={handleUploadPicture}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:border file:rounded-lg file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-gray-700 dark:file:text-gray-100"
            />
  
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition mt-4"
            >
              Sign Up
            </button>
  
            <p className="text-center text-gray-600 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-500 hover:underline hover:text-blue-700 dark:hover:text-blue-400"
              >
                Sign in
              </Link>
            </p>
          </form>
        </motion.div>
      </div>
  
      {/* Crop Modal with Animation */}
      <AnimatePresence>
        {showCropModal && (
          <Modal
            isOpen={showCropModal}
            onRequestClose={() => setShowCropModal(false)}
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60"
            ariaHideApp={false}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg p-6 w-[90vw] max-w-md relative"
            >
              <div className="relative w-full h-72 bg-gray-200 dark:bg-gray-700">
                <Cropper
                  image={cropImage}
                  crop={{ x: 0, y: 0 }}
                  zoom={zoom}
                  aspect={1}
                  onCropChange={() => {}}
                  onZoomChange={setZoom}
                  onCropComplete={handleCropComplete}
                />
              </div>
              <div className="mt-4 flex justify-between items-center">
                <input
                  type="range"
                  min={1}
                  max={3}
                  step={0.1}
                  value={zoom}
                  onChange={(e) => setZoom(Number(e.target.value))}
                  className="w-3/4"
                />
                <button
                  onClick={handleCropSave}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
                >
                  Crop
                </button>
              </div>
            </motion.div>
          </Modal>
        )}
      </AnimatePresence>
    </section>
  );
}

export default SignUp;
