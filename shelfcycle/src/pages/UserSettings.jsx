import React, { useEffect, useState } from 'react';
import { FiSave, FiKey } from 'react-icons/fi';
import { IoMdEye, IoMdEyeOff } from 'react-icons/io';
import { useDispatch, useSelector } from 'react-redux';
import { setUserDetails } from '../store/userSlice';
import { toast } from 'react-toastify';
import SummaryAPI from '../common';
import imgToBase64 from '../helpers/imgToBase64';
import ImageCropperModal from '../components/ImageCropperModal';

const UserSettings = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state?.user?.user);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
    image: '',
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const [cropModalOpen, setCropModalOpen] = useState(false);
  const [cropImage, setCropImage] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(SummaryAPI.currentUser.url, {
          method: SummaryAPI.currentUser.method,
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success) {
          dispatch(setUserDetails(data.data));
          setFormData((prev) => ({
            ...prev,
            username: data.data.username || '',
            email: data.data.email || '',
            phone: data.data.phone || '',
            image: data.data.uploadPic || '',
          }));
        }
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    if (!user?._id) {
      fetchUserDetails();
    } else {
      setFormData((prev) => ({
        ...prev,
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        image: user.uploadPic || '',
      }));
    }
  }, [user, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const base64 = await imgToBase64(file);
      setCropImage(base64);
      setCropModalOpen(true);
    }
  };

  const handleCroppedImage = (croppedBase64) => {
    setFormData((prev) => ({ ...prev, image: croppedBase64 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      userId: user._id,
      email: formData.email,
      username: formData.username,
      phone: formData.phone,
      uploadPic: formData.image,
    };

    try {
      const res = await fetch(SummaryAPI.updateUser.url, {
        method: SummaryAPI.updateUser.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        dispatch(setUserDetails(data.data));
        toast.success('Profile updated successfully!');
      } else {
        toast.error(data.message || 'Update failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handlePasswordChange = async () => {
    if (formData.newPassword !== formData.confirmPassword) {
      return toast.error('New passwords do not match');
    }

    try {
      const res = await fetch(SummaryAPI.changePassword.url, {
        method: SummaryAPI.changePassword.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await res.json();
      if (data.success) toast.success('Password changed successfully!');
      else toast.error(data.message || 'Failed to change password');
    } catch (err) {
      toast.error('Server error during password change');
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl p-8 mt-6 transition-colors duration-300">
      <h2 className="text-2xl font-bold text-center mb-8">Update Your Profile</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col items-center">
          <img
            src={formData.image}
            alt="Profile"
            className="w-28 h-28 rounded-full object-cover shadow mb-4 border-2 border-blue-500"
          />
          <label className="cursor-pointer bg-blue-50 dark:bg-gray-700 px-4 py-1 rounded text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-gray-600 transition">
            Change Photo
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
        </div>

        <div className="grid grid-cols-1 gap-5">
        <label className="block font-medium">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <label className="block font-medium">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
          <label className="block font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            placeholder="Phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 border dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="flex justify-center mt-6">
          <button
            type="submit"
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-full shadow transition"
          >
            <FiSave size={18} />
            Save Changes
          </button>
        </div>
      </form>

      <hr className="my-8 border-gray-300 dark:border-gray-600" />
      <h3 className="text-lg font-semibold mb-4 text-center">Change Password</h3>
      <div className="grid grid-cols-1 gap-4 relative">
        {['oldPassword', 'newPassword', 'confirmPassword'].map((field) => (
          <div key={field} className="relative">
            <input
              type={showPassword[field] ? 'text' : 'password'}
              name={field}
              placeholder={
                field === 'oldPassword'
                  ? 'Current Password'
                  : field === 'newPassword'
                  ? 'New Password'
                  : 'Confirm New Password'
              }
              value={formData[field]}
              onChange={handleChange}
              className="w-full px-4 py-2 border dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-400 pr-10 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
            <span
              className="absolute right-3 top-3.5 text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-white cursor-pointer"
              onClick={() =>
                setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }))
              }
            >
              {showPassword[field] ? <IoMdEyeOff size={20} /> : <IoMdEye size={20} />}
            </span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={handlePasswordChange}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-2 rounded-full shadow transition"
        >
          <FiKey size={18} />
          Update Password
        </button>
      </div>

      {cropModalOpen && cropImage && (
        <ImageCropperModal
          image={cropImage}
          onClose={() => setCropModalOpen(false)}
          onCropComplete={handleCroppedImage}
        />
      )}
    </div>
  );
};

export default UserSettings;
